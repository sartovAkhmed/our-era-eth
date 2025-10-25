//SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "hardhat/console.sol";

/**
 * @title TreeChain
 * @dev Платформа для финансирования посадки деревьев с NFT сертификатами и токенами награды
 * @author TreeChain Team
 */
contract TreeChain is ERC721, Ownable, ReentrancyGuard {
    // ============ STRUCTS ============
    
    struct Tree {
        uint256 id;
        uint256 treeCount;        // Количество деревьев
        string location;          // Геолокация (координаты)
        string imageHash;         // IPFS хеш фотографии
        string documentHash;      // IPFS хеш документов
        address donor;            // Адрес донора
        address executor;         // Адрес исполнителя
        uint256 donationAmount;   // Сумма пожертвования
        uint256 rewardAmount;     // Сумма награды исполнителю
        bool isVerified;          // Подтверждена ли посадка
        uint256 plantedAt;        // Время посадки
        uint256 verifiedAt;       // Время подтверждения
    }

    // ============ STATE VARIABLES ============
    
    uint256 private _treeIds;
    uint256 private _tokenIds;
    
    // Маппинг ID дерева к данным дерева
    mapping(uint256 => Tree) public trees;
    
    // Маппинг адреса исполнителя к количеству посаженных деревьев
    mapping(address => uint256) public executorTreeCount;
    
    // Маппинг адреса донора к количеству пожертвованных деревьев
    mapping(address => uint256) public donorTreeCount;
    
    // Общая статистика
    uint256 public totalTreesPlanted;
    uint256 public totalDonations;
    uint256 public totalRewardsPaid;
    
    // Цены и награды
    uint256 public constant TREE_PRICE = 0.01 ether;  // Цена за посадку одного дерева
    uint256 public constant EXECUTOR_REWARD = 0.008 ether;  // Награда исполнителю за одно дерево
    uint256 public constant PLATFORM_FEE = 0.002 ether;  // Комиссия платформы за одно дерево

    // ============ EVENTS ============
    
    event TreePurchased(
        uint256 indexed treeId,
        address indexed donor,
        uint256 amount,
        uint256 treeCount,
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

    // ============ MODIFIERS ============
    
    modifier onlyVerifiedExecutor() {
        require(executorTreeCount[msg.sender] > 0, "Not a verified executor");
        _;
    }

    // ============ EXTERNAL FUNCTIONS ============
    
    /**
     * @dev Покупка NFT деревьев донором
     * @param treeCount Количество деревьев
     * @param location Геолокация для посадки
     */
    function purchaseTree(
        uint256 treeCount,
        string memory location
    ) external payable nonReentrant {
        require(treeCount > 0, "Tree count must be positive");
        require(msg.value >= TREE_PRICE * treeCount, "Insufficient payment");
        require(bytes(location).length > 0, "Location cannot be empty");
        
        _treeIds++;
        uint256 treeId = _treeIds;
        
        // Создаем NFT для донора
        _tokenIds++;
        uint256 tokenId = _tokenIds;
        _mint(msg.sender, tokenId);
        
        // Создаем запись о дереве
        trees[treeId] = Tree({
            id: treeId,
            treeCount: treeCount,
            location: location,
            imageHash: "",
            documentHash: "",
            donor: msg.sender,
            executor: address(0),
            donationAmount: msg.value,
            rewardAmount: EXECUTOR_REWARD * treeCount,
            isVerified: false,
            plantedAt: 0,
            verifiedAt: 0
        });
        
        // Обновляем статистику
        donorTreeCount[msg.sender] += treeCount;
        totalTreesPlanted += treeCount;
        totalDonations += msg.value;
        
        emit TreePurchased(treeId, msg.sender, msg.value, treeCount, location);
        
        console.log("Trees purchased by %s: %s trees for %s ETH", msg.sender, treeCount, msg.value);
    }

    /**
     * @dev Покупка NFT деревьев предприятием
     * @param treeCount Количество деревьев
     * @param location Геолокация для посадки
     * @param enterpriseName Название предприятия
     */
    function purchaseTreeAsEnterprise(
        uint256 treeCount,
        string memory location,
        string memory enterpriseName
    ) external payable nonReentrant {
        require(treeCount > 0, "Tree count must be positive");
        require(msg.value >= TREE_PRICE * treeCount, "Insufficient payment");
        require(bytes(location).length > 0, "Location cannot be empty");
        require(bytes(enterpriseName).length > 0, "Enterprise name cannot be empty");
        
        _treeIds++;
        uint256 treeId = _treeIds;
        
        // Создаем NFT для донора
        _tokenIds++;
        uint256 tokenId = _tokenIds;
        _mint(msg.sender, tokenId);
        
        // Создаем запись о дереве
        trees[treeId] = Tree({
            id: treeId,
            treeCount: treeCount,
            location: location,
            imageHash: "",
            documentHash: "",
            donor: msg.sender,
            executor: address(0),
            donationAmount: msg.value,
            rewardAmount: EXECUTOR_REWARD * treeCount,
            isVerified: false,
            plantedAt: 0,
            verifiedAt: 0
        });
        
        // Обновляем статистику
        donorTreeCount[msg.sender] += treeCount;
        totalTreesPlanted += treeCount;
        totalDonations += msg.value;
        
        emit TreePurchased(treeId, msg.sender, msg.value, treeCount, location);
        
        console.log("Trees purchased by enterprise %s: %s trees for %s ETH", enterpriseName, treeCount, msg.value);
    }
    
    /**
     * @dev Исполнитель сообщает о посадке дерева
     * @param treeId ID дерева
     * @param imageHash IPFS хеш фотографии
     * @param documentHash IPFS хеш документов
     */
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
    
    /**
     * @dev Верификация посадки дерева (только владелец)
     * @param treeId ID дерева
     * @param approved Одобрена ли посадка
     */
    function verifyTree(uint256 treeId, bool approved) external onlyOwner {
        require(treeId > 0 && treeId <= _treeIds, "Invalid tree ID");
        require(trees[treeId].executor != address(0), "Tree not planted yet");
        require(!trees[treeId].isVerified, "Tree already verified");
        
        if (approved) {
            trees[treeId].isVerified = true;
            trees[treeId].verifiedAt = block.timestamp;
            
            // Начисляем награду исполнителю
            address executor = trees[treeId].executor;
            executorTreeCount[executor] += trees[treeId].treeCount;
            totalRewardsPaid += trees[treeId].rewardAmount;
            
            // Переводим награду исполнителю
            (bool success, ) = executor.call{value: trees[treeId].rewardAmount}("");
            require(success, "Reward transfer failed");
            
            emit TreeVerified(treeId, executor, trees[treeId].rewardAmount);
            
            console.log("Tree %s verified, reward %s ETH sent to %s", 
                treeId, trees[treeId].rewardAmount, executor);
        }
    }
    
    /**
     * @dev Получение информации о дереве
     * @param treeId ID дерева
     * @return tree Данные дерева
     */
    function getTree(uint256 treeId) external view returns (Tree memory tree) {
        require(treeId > 0 && treeId <= _treeIds, "Invalid tree ID");
        return trees[treeId];
    }

    /**
     * @dev Получение статистики предприятия
     * @param enterprise Адрес предприятия
     */
    function getEnterpriseStats(address enterprise) external view returns (
        uint256 _donatedTrees,
        uint256 _totalSpent
    ) {
        return (
            donorTreeCount[enterprise],
            donorTreeCount[enterprise] * TREE_PRICE
        );
    }
    
    /**
     * @dev Получение статистики платформы
     */
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
    
    /**
     * @dev Получение статистики пользователя
     * @param user Адрес пользователя
     */
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
    
    /**
     * @dev Вывод средств платформы
     * @param amount Сумма для вывода
     * @param purpose Назначение средств
     */
    function withdrawFunds(uint256 amount, string memory purpose) external onlyOwner {
        require(amount <= address(this).balance, "Insufficient balance");
        require(amount > 0, "Amount must be positive");
        
        (bool success, ) = owner().call{value: amount}("");
        require(success, "Withdrawal failed");
        
        emit FundsWithdrawn(owner(), amount, purpose);
        
        console.log("Withdrawn %s ETH for: %s", amount, purpose);
    }
    
    /**
     * @dev Экстренный вывод всех средств
     */
    function emergencyWithdraw() external onlyOwner {
        uint256 balance = address(this).balance;
        (bool success, ) = owner().call{value: balance}("");
        require(success, "Emergency withdrawal failed");
        
        emit FundsWithdrawn(owner(), balance, "Emergency withdrawal");
    }
    
    // ============ OVERRIDES ============
    
    /**
     * @dev Переопределяем tokenURI для метаданных NFT
     */
    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        require(ownerOf(tokenId) != address(0), "Token does not exist");
        
        // В реальном проекте здесь должен быть JSON с метаданными
        return string(abi.encodePacked(
            "https://api.treechain.org/metadata/",
            _toString(tokenId)
        ));
    }
    
    // ============ INTERNAL FUNCTIONS ============
    
    /**
     * @dev Конвертация uint256 в string
     */
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
    
    /**
     * @dev Получение ETH
     */
    receive() external payable {
        console.log("Received %s ETH", msg.value);
    }
}