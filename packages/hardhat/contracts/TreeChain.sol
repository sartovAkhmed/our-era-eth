// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "hardhat/console.sol";

/**
 * @title TreeChain (Gasless)
 * @dev Платформа для посадки деревьев с NFT сертификатами без платы за газ и без цен.
 */
contract TreeChain is ERC721, Ownable, ReentrancyGuard {
    // ============ STRUCTS ============
    struct Tree {
        uint256 id;
        string species;
        string location;
        string imageHash;
        string documentHash;
        address donor;
        address executor;
        uint256 donationAmount;
        uint256 rewardAmount;
        bool isVerified;
        uint256 plantedAt;
        uint256 verifiedAt;
    }

    // ============ STATE VARIABLES ============
    uint256 private _treeIds;
    uint256 private _tokenIds;

    mapping(uint256 => Tree) public trees;
    mapping(address => uint256) public executorTreeCount;
    mapping(address => uint256) public donorTreeCount;

    uint256 public totalTreesPlanted;
    uint256 public totalDonations;
    uint256 public totalRewardsPaid;

    // Без оплат
    uint256 public constant TREE_PRICE = 0;
    uint256 public constant EXECUTOR_REWARD = 0;
    uint256 public constant PLATFORM_FEE = 0;

    // ============ EVENTS ============
    event TreePurchased(
        uint256 indexed treeId,
        address indexed donor,
        uint256 amount,
        string species,
        string location
    );

    event TreePlanted(
        uint256 indexed treeId,
        address indexed executor,
        string imageHash,
        string documentHash
    );

    event TreeVerified(
        uint256 indexed treeId,
        address indexed executor,
        uint256 rewardAmount
    );

    event FundsWithdrawn(
        address indexed to,
        uint256 amount,
        string purpose
    );

    // ============ CONSTRUCTOR ============
    constructor() ERC721("TreeChain NFT", "TREE") Ownable(msg.sender) {}

    // ============ EXTERNAL FUNCTIONS ============

    function purchaseTree(
        string memory species,
        string memory location
    ) external nonReentrant {
        require(bytes(species).length > 0, "Species cannot be empty");
        require(bytes(location).length > 0, "Location cannot be empty");

        _treeIds++;
        uint256 treeId = _treeIds;

        _tokenIds++;
        uint256 tokenId = _tokenIds;
        _mint(msg.sender, tokenId);

        trees[treeId] = Tree({
            id: treeId,
            species: species,
            location: location,
            imageHash: "",
            documentHash: "",
            donor: msg.sender,
            executor: address(0),
            donationAmount: 0,
            rewardAmount: 0,
            isVerified: false,
            plantedAt: 0,
            verifiedAt: 0
        });

        donorTreeCount[msg.sender]++;
        totalTreesPlanted++;

        emit TreePurchased(treeId, msg.sender, 0, species, location);

        console.log("Tree purchased by %s (free, gasless)", msg.sender);
    }

    function plantTree(
        uint256 treeId,
        string memory imageHash,
        string memory documentHash
    ) external {
        require(treeId > 0 && treeId <= _treeIds, "Invalid tree ID");
        require(trees[treeId].executor == address(0), "Tree already assigned");
        require(bytes(imageHash).length > 0, "Image hash required");
        require(bytes(documentHash).length > 0, "Document hash required");

        trees[treeId].executor = msg.sender;
        trees[treeId].imageHash = imageHash;
        trees[treeId].documentHash = documentHash;
        trees[treeId].plantedAt = block.timestamp;

        emit TreePlanted(treeId, msg.sender, imageHash, documentHash);

        console.log("Tree %s planted by %s", treeId, msg.sender);
    }

    function verifyTree(uint256 treeId, bool approved) external onlyOwner {
        require(treeId > 0 && treeId <= _treeIds, "Invalid tree ID");
        require(trees[treeId].executor != address(0), "Tree not planted yet");
        require(!trees[treeId].isVerified, "Tree already verified");

        if (approved) {
            trees[treeId].isVerified = true;
            trees[treeId].verifiedAt = block.timestamp;

            address executor = trees[treeId].executor;
            executorTreeCount[executor]++;

            emit TreeVerified(treeId, executor, 0);

            console.log("Tree %s verified (no reward sent)", treeId);
        }
    }

    function getTree(uint256 treeId) external view returns (Tree memory tree) {
        require(treeId > 0 && treeId <= _treeIds, "Invalid tree ID");
        return trees[treeId];
    }

    function getPlatformStats() external view returns (
        uint256 _totalTreesPlanted,
        uint256 _totalDonations,
        uint256 _totalRewardsPaid,
        uint256 _availableBalance
    ) {
        return (
            totalTreesPlanted,
            totalDonations,
            totalRewardsPaid,
            address(this).balance
        );
    }

    function getUserStats(address user) external view returns (
        uint256 _donatedTrees,
        uint256 _plantedTrees
    ) {
        return (
            donorTreeCount[user],
            executorTreeCount[user]
        );
    }

    // ============ OWNER FUNCTIONS ============
    function withdrawFunds(uint256 amount, string memory purpose) external onlyOwner {
        require(amount <= address(this).balance, "Insufficient balance");
        require(amount > 0, "Amount must be positive");

        (bool success, ) = owner().call{value: amount}("");
        require(success, "Withdrawal failed");

        emit FundsWithdrawn(owner(), amount, purpose);
    }

    function emergencyWithdraw() external onlyOwner {
        uint256 balance = address(this).balance;
        (bool success, ) = owner().call{value: balance}("");
        require(success, "Emergency withdrawal failed");

        emit FundsWithdrawn(owner(), balance, "Emergency withdrawal");
    }

    // ============ METАДАННЫЕ NFT ============
    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        require(ownerOf(tokenId) != address(0), "Token does not exist");

        return string(abi.encodePacked(
            "https://api.treechain.org/metadata/",
            _toString(tokenId)
        ));
    }

    function _toString(uint256 value) internal pure returns (string memory) {
        if (value == 0) {
            return "0";
        }
        uint256 temp = value;
        uint256 digits;
        while (temp != 0) {
            digits++;
            temp /= 10;
        }
        bytes memory buffer = new bytes(digits);
        while (value != 0) {
            digits -= 1;
            buffer[digits] = bytes1(uint8(48 + uint256(value % 10)));
            value /= 10;
        }
        return string(buffer);
    }

    // ============ RECEIVE ============
    receive() external payable {
        console.log("Received %s ETH", msg.value);
    }
}