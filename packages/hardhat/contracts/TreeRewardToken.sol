//SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "hardhat/console.sol";

/**
 * @title TreeRewardToken
 * @dev ERC20 токен для награждения исполнителей за посадку деревьев
 * @author TreeChain Team
 */
contract TreeRewardToken is ERC20, Ownable, ReentrancyGuard {
    
    // ============ STATE VARIABLES ============
    
    uint256 public constant INITIAL_SUPPLY = 1000000 * 10**18; // 1 миллион токенов
    uint256 public constant REWARD_PER_TREE = 100 * 10**18;    // 100 токенов за дерево
    
    // Маппинг адреса исполнителя к количеству токенов
    mapping(address => uint256) public executorRewards;
    
    // Общая статистика
    uint256 public totalRewardsDistributed;
    uint256 public totalTreesRewarded;
    
    // ============ EVENTS ============
    
    event RewardsDistributed(
        address indexed executor,
        uint256 amount,
        uint256 treeCount
    );
    
    event TokensBurned(
        address indexed from,
        uint256 amount
    );
    
    // ============ CONSTRUCTOR ============
    
    constructor() ERC20("Tree Reward Token", "TRT") Ownable(msg.sender) {
        _mint(msg.sender, INITIAL_SUPPLY);
        console.log("TreeRewardToken deployed with %s tokens", INITIAL_SUPPLY);
    }
    
    // ============ EXTERNAL FUNCTIONS ============
    
    /**
     * @dev Награждение исполнителя токенами (только владелец)
     * @param executor Адрес исполнителя
     * @param treeCount Количество посаженных деревьев
     */
    function rewardExecutor(address executor, uint256 treeCount) external onlyOwner {
        require(executor != address(0), "Invalid executor address");
        require(treeCount > 0, "Tree count must be positive");
        
        uint256 rewardAmount = treeCount * REWARD_PER_TREE;
        require(balanceOf(owner()) >= rewardAmount, "Insufficient token balance");
        
        // Переводим токены исполнителю
        _transfer(owner(), executor, rewardAmount);
        
        // Обновляем статистику
        executorRewards[executor] += rewardAmount;
        totalRewardsDistributed += rewardAmount;
        totalTreesRewarded += treeCount;
        
        emit RewardsDistributed(executor, rewardAmount, treeCount);
        
        console.log("Rewarded %s with %s tokens for %s trees", 
            executor, rewardAmount, treeCount);
    }
    
    /**
     * @dev Сжигание токенов (исполнители могут сжигать за бонусы)
     * @param amount Количество токенов для сжигания
     */
    function burnTokens(uint256 amount) external {
        require(amount > 0, "Amount must be positive");
        require(balanceOf(msg.sender) >= amount, "Insufficient balance");
        
        _burn(msg.sender, amount);
        
        emit TokensBurned(msg.sender, amount);
        
        console.log("Burned %s tokens from %s", amount, msg.sender);
    }
    
    /**
     * @dev Получение статистики исполнителя
     * @param executor Адрес исполнителя
     */
    function getExecutorStats(address executor) external view returns (
        uint256 _totalRewards,
        uint256 _currentBalance,
        uint256 _treesRewarded
    ) {
        return (
            executorRewards[executor],
            balanceOf(executor),
            executorRewards[executor] / REWARD_PER_TREE
        );
    }
    
    /**
     * @dev Получение общей статистики токена
     */
    function getTokenStats() external view returns (
        uint256 _totalSupply,
        uint256 _totalDistributed,
        uint256 _totalTreesRewarded,
        uint256 _ownerBalance
    ) {
        return (
            totalSupply(),
            totalRewardsDistributed,
            totalTreesRewarded,
            balanceOf(owner())
        );
    }
    
    // ============ OWNER FUNCTIONS ============
    
    /**
     * @dev Минт дополнительных токенов (только владелец)
     * @param amount Количество токенов для минта
     */
    function mintTokens(uint256 amount) external onlyOwner {
        require(amount > 0, "Amount must be positive");
        _mint(owner(), amount);
        
        console.log("Minted %s additional tokens", amount);
    }
    
    /**
     * @dev Экстренное сжигание токенов (только владелец)
     * @param amount Количество токенов для сжигания
     */
    function emergencyBurn(uint256 amount) external onlyOwner {
        require(amount > 0, "Amount must be positive");
        require(balanceOf(owner()) >= amount, "Insufficient balance");
        
        _burn(owner(), amount);
        
        console.log("Emergency burned %s tokens", amount);
    }
}
