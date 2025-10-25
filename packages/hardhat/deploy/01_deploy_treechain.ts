import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { Contract } from "ethers";

/**
 * Deploys TreeChain contracts
 * @param hre HardhatRuntimeEnvironment object.
 */
const deployTreeChain: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployer } = await hre.getNamedAccounts();
  const { deploy } = hre.deployments;

  console.log("🌱 Deploying TreeChain contracts...");

  // Deploy TreeRewardToken first
  const treeRewardToken = await deploy("TreeRewardToken", {
    from: deployer,
    log: true,
    autoMine: true,
  });

  console.log("✅ TreeRewardToken deployed at:", treeRewardToken.address);

  // Deploy TreeChain main contract
  const treeChain = await deploy("TreeChain", {
    from: deployer,
    log: true,
    autoMine: true,
  });

  console.log("✅ TreeChain deployed at:", treeChain.address);

  // Get deployed contracts to interact with them
  const treeChainContract = await hre.ethers.getContract<Contract>("TreeChain", deployer);
  const treeRewardTokenContract = await hre.ethers.getContract<Contract>("TreeRewardToken", deployer);

  // Log initial state
  console.log("🌳 TreeChain initial state:");
  console.log("  - Tree Price:", await treeChainContract.TREE_PRICE(), "ETH");
  console.log("  - Executor Reward:", await treeChainContract.EXECUTOR_REWARD(), "ETH");
  console.log("  - Platform Fee:", await treeChainContract.PLATFORM_FEE(), "ETH");

  console.log("🪙 TreeRewardToken initial state:");
  console.log("  - Total Supply:", await treeRewardTokenContract.totalSupply(), "TRT");
  console.log("  - Reward Per Tree:", await treeRewardTokenContract.REWARD_PER_TREE(), "TRT");
  console.log("  - Owner Balance:", await treeRewardTokenContract.balanceOf(deployer), "TRT");

  console.log("🎉 TreeChain deployment completed successfully!");
};

export default deployTreeChain;

deployTreeChain.tags = ["TreeChain", "TreeRewardToken"];

