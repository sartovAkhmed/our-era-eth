import { expect } from "chai";
import { ethers } from "hardhat";
import { Contract } from "ethers";

describe("TreeChain", function () {
  let treeChain: Contract;
  let owner: any;
  let donor: any;
  let executor: any;
  let other: any;

  beforeEach(async function () {
    [owner, donor, executor, other] = await ethers.getSigners();

    // Deploy TreeChain
    const TreeChain = await ethers.getContractFactory("TreeChain");
    treeChain = await TreeChain.deploy();
    await treeChain.waitForDeployment();
  });

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      expect(await treeChain.owner()).to.equal(owner.address);
    });

    it("Should have correct tree price", async function () {
      expect(await treeChain.TREE_PRICE()).to.equal(ethers.parseEther("0.01"));
    });

    it("Should have correct executor reward", async function () {
      expect(await treeChain.EXECUTOR_REWARD()).to.equal(ethers.parseEther("0.008"));
    });

    it("Should have correct platform fee", async function () {
      expect(await treeChain.PLATFORM_FEE()).to.equal(ethers.parseEther("0.002"));
    });
  });

  describe("Tree Purchase", function () {
    it("Should allow donor to purchase trees", async function () {
      const treeCount = 3;
      const location = "Москва, парк Сокольники";
      const price = ethers.parseEther("0.03"); // 0.01 * 3

      await expect(treeChain.connect(donor).purchaseTree(treeCount, location, { value: price }))
        .to.emit(treeChain, "TreePurchased")
        .withArgs(1, donor.address, price, treeCount, location);

      // Check tree data
      const tree = await treeChain.getTree(1);
      expect(tree.treeCount).to.equal(treeCount);
      expect(tree.location).to.equal(location);
      expect(tree.donor).to.equal(donor.address);
      expect(tree.donationAmount).to.equal(price);
      expect(tree.rewardAmount).to.equal(ethers.parseEther("0.024")); // 0.008 * 3
      expect(tree.isVerified).to.be.false;

      // Check donor stats
      const donorStats = await treeChain.getUserStats(donor.address);
      expect(donorStats[0]).to.equal(treeCount); // donated trees
      expect(donorStats[1]).to.equal(0); // planted trees
    });

    it("Should allow enterprise to purchase trees", async function () {
      const treeCount = 5;
      const location = "Москва, ВДНХ";
      const enterpriseName = "ООО 'ЭкоСтрой'";
      const price = ethers.parseEther("0.05"); // 0.01 * 5

      await expect(
        treeChain.connect(donor).purchaseTreeAsEnterprise(treeCount, location, enterpriseName, { value: price }),
      )
        .to.emit(treeChain, "TreePurchased")
        .withArgs(1, donor.address, price, treeCount, location);

      // Check tree data
      const tree = await treeChain.getTree(1);
      expect(tree.treeCount).to.equal(treeCount);
      expect(tree.location).to.equal(location);
      expect(tree.donor).to.equal(donor.address);
      expect(tree.donationAmount).to.equal(price);
    });

    it("Should reject purchase with zero tree count", async function () {
      const treeCount = 0;
      const location = "Москва";
      const price = ethers.parseEther("0.01");

      await expect(treeChain.connect(donor).purchaseTree(treeCount, location, { value: price })).to.be.revertedWith(
        "Tree count must be positive",
      );
    });

    it("Should reject purchase with insufficient payment", async function () {
      const treeCount = 2;
      const location = "Москва";
      const insufficientPrice = ethers.parseEther("0.015"); // Should be 0.02

      await expect(
        treeChain.connect(donor).purchaseTree(treeCount, location, { value: insufficientPrice }),
      ).to.be.revertedWith("Insufficient payment");
    });

    it("Should reject purchase with empty location", async function () {
      const treeCount = 1;
      const location = "";
      const price = ethers.parseEther("0.01");

      await expect(treeChain.connect(donor).purchaseTree(treeCount, location, { value: price })).to.be.revertedWith(
        "Location cannot be empty",
      );
    });

    it("Should reject enterprise purchase with empty name", async function () {
      const treeCount = 1;
      const location = "Москва";
      const enterpriseName = "";
      const price = ethers.parseEther("0.01");

      await expect(
        treeChain.connect(donor).purchaseTreeAsEnterprise(treeCount, location, enterpriseName, { value: price }),
      ).to.be.revertedWith("Enterprise name cannot be empty");
    });
  });

  describe("Tree Planting", function () {
    beforeEach(async function () {
      // Purchase trees first
      const treeCount = 2;
      const location = "Москва";
      const price = ethers.parseEther("0.02");
      await treeChain.connect(donor).purchaseTree(treeCount, location, { value: price });
    });

    it("Should allow executor to plant trees", async function () {
      const treeId = 1;
      const imageHash = "QmXxXxXxXxXxXxXxXxXxXxXxXxXxXxXxXxXxXxXxXxXxXxXxXxXxXxXx";
      const documentHash = "QmYyYyYyYyYyYyYyYyYyYyYyYyYyYyYyYyYyYyYyYyYyYyYyYyYyYyYy";

      await expect(treeChain.connect(executor).plantTree(treeId, imageHash, documentHash))
        .to.emit(treeChain, "TreePlanted")
        .withArgs(treeId, executor.address, imageHash, documentHash);

      // Check tree data
      const tree = await treeChain.getTree(treeId);
      expect(tree.executor).to.equal(executor.address);
      expect(tree.imageHash).to.equal(imageHash);
      expect(tree.documentHash).to.equal(documentHash);
      expect(tree.plantedAt).to.be.gt(0);
    });

    it("Should reject planting with invalid tree ID", async function () {
      const treeId = 999;
      const imageHash = "QmXxXxXxXxXxXxXxXxXxXxXxXxXxXxXxXxXxXxXxXxXxXxXxXxXxXxXx";
      const documentHash = "QmYyYyYyYyYyYyYyYyYyYyYyYyYyYyYyYyYyYyYyYyYyYyYyYyYyYyYy";

      await expect(treeChain.connect(executor).plantTree(treeId, imageHash, documentHash)).to.be.revertedWith(
        "Invalid tree ID",
      );
    });

    it("Should reject planting already assigned tree", async function () {
      const treeId = 1;
      const imageHash = "QmXxXxXxXxXxXxXxXxXxXxXxXxXxXxXxXxXxXxXxXxXxXxXxXxXxXxXx";
      const documentHash = "QmYyYyYyYyYyYyYyYyYyYyYyYyYyYyYyYyYyYyYyYyYyYyYyYyYyYyYy";

      // First planting
      await treeChain.connect(executor).plantTree(treeId, imageHash, documentHash);

      // Second planting should fail
      await expect(treeChain.connect(other).plantTree(treeId, imageHash, documentHash)).to.be.revertedWith(
        "Tree already assigned",
      );
    });
  });

  describe("Tree Verification", function () {
    beforeEach(async function () {
      // Purchase and plant trees
      const treeCount = 3;
      const location = "Москва";
      const price = ethers.parseEther("0.03");
      await treeChain.connect(donor).purchaseTree(treeCount, location, { value: price });

      const treeId = 1;
      const imageHash = "QmXxXxXxXxXxXxXxXxXxXxXxXxXxXxXxXxXxXxXxXxXxXxXxXxXxXxXx";
      const documentHash = "QmYyYyYyYyYyYyYyYyYyYyYyYyYyYyYyYyYyYyYyYyYyYyYyYyYyYyYy";
      await treeChain.connect(executor).plantTree(treeId, imageHash, documentHash);
    });

    it("Should allow owner to verify trees", async function () {
      const treeId = 1;
      const rewardAmount = ethers.parseEther("0.024"); // 0.008 * 3

      const initialBalance = await ethers.provider.getBalance(executor.address);

      await expect(treeChain.connect(owner).verifyTree(treeId, true))
        .to.emit(treeChain, "TreeVerified")
        .withArgs(treeId, executor.address, rewardAmount);

      // Check tree is verified
      const tree = await treeChain.getTree(treeId);
      expect(tree.isVerified).to.be.true;
      expect(tree.verifiedAt).to.be.gt(0);

      // Check executor received reward
      const finalBalance = await ethers.provider.getBalance(executor.address);
      expect(finalBalance).to.be.gt(initialBalance);

      // Check executor stats
      const executorStats = await treeChain.getUserStats(executor.address);
      expect(executorStats[1]).to.equal(3); // planted trees (treeCount = 3)
    });

    it("Should reject verification by non-owner", async function () {
      const treeId = 1;

      await expect(treeChain.connect(other).verifyTree(treeId, true)).to.be.revertedWithCustomError(
        treeChain,
        "OwnableUnauthorizedAccount",
      );
    });

    it("Should reject verification of unplanted tree", async function () {
      // Purchase another tree but don't plant it
      const treeCount = 2;
      const location = "Санкт-Петербург";
      const price = ethers.parseEther("0.02");
      await treeChain.connect(donor).purchaseTree(treeCount, location, { value: price });

      const treeId = 2;

      await expect(treeChain.connect(owner).verifyTree(treeId, true)).to.be.revertedWith("Tree not planted yet");
    });
  });

  describe("Enterprise Statistics", function () {
    it("Should return correct enterprise stats", async function () {
      const treeCount = 4;
      const location = "Москва";
      const enterpriseName = "ЗАО 'Зеленый мир'";
      const price = ethers.parseEther("0.04");

      await treeChain.connect(donor).purchaseTreeAsEnterprise(treeCount, location, enterpriseName, { value: price });

      const stats = await treeChain.getEnterpriseStats(donor.address);
      expect(stats[0]).to.equal(treeCount); // donated trees
      expect(stats[1]).to.equal(price); // total spent
    });
  });

  describe("Platform Statistics", function () {
    it("Should return correct platform stats", async function () {
      // Purchase trees
      const treeCount = 2;
      const location = "Москва";
      const price = ethers.parseEther("0.02");
      await treeChain.connect(donor).purchaseTree(treeCount, location, { value: price });

      const stats = await treeChain.getPlatformStats();
      expect(stats[0]).to.equal(treeCount); // totalTreesPlanted
      expect(stats[1]).to.equal(price); // totalDonations
      expect(stats[2]).to.equal(0); // totalRewardsPaid
      expect(stats[3]).to.equal(price); // availableBalance
    });
  });

  describe("Withdrawal", function () {
    beforeEach(async function () {
      // Purchase trees to add funds
      const treeCount = 3;
      const location = "Москва";
      const price = ethers.parseEther("0.03");
      await treeChain.connect(donor).purchaseTree(treeCount, location, { value: price });
    });

    it("Should allow owner to withdraw funds", async function () {
      const amount = ethers.parseEther("0.01");
      const initialBalance = await ethers.provider.getBalance(owner.address);

      await expect(treeChain.connect(owner).withdrawFunds(amount, "Test withdrawal"))
        .to.emit(treeChain, "FundsWithdrawn")
        .withArgs(owner.address, amount, "Test withdrawal");

      const finalBalance = await ethers.provider.getBalance(owner.address);
      expect(finalBalance).to.be.gt(initialBalance);
    });

    it("Should reject withdrawal by non-owner", async function () {
      const amount = ethers.parseEther("0.01");

      await expect(treeChain.connect(other).withdrawFunds(amount, "Test withdrawal")).to.be.revertedWithCustomError(
        treeChain,
        "OwnableUnauthorizedAccount",
      );
    });

    it("Should reject withdrawal of more than available balance", async function () {
      const amount = ethers.parseEther("0.04"); // More than available

      await expect(treeChain.connect(owner).withdrawFunds(amount, "Test withdrawal")).to.be.revertedWith(
        "Insufficient balance",
      );
    });
  });

  describe("Multiple Purchases", function () {
    it("Should handle multiple tree purchases correctly", async function () {
      // First purchase
      const treeCount1 = 2;
      const location1 = "Москва";
      const price1 = ethers.parseEther("0.02");
      await treeChain.connect(donor).purchaseTree(treeCount1, location1, { value: price1 });

      // Second purchase
      const treeCount2 = 1;
      const location2 = "Санкт-Петербург";
      const price2 = ethers.parseEther("0.01");
      await treeChain.connect(other).purchaseTree(treeCount2, location2, { value: price2 });

      // Check total statistics
      const stats = await treeChain.getPlatformStats();
      expect(stats[0]).to.equal(treeCount1 + treeCount2); // totalTreesPlanted
      expect(stats[1]).to.equal(price1 + price2); // totalDonations

      // Check donor statistics
      const donor1Stats = await treeChain.getUserStats(donor.address);
      expect(donor1Stats[0]).to.equal(treeCount1);

      const donor2Stats = await treeChain.getUserStats(other.address);
      expect(donor2Stats[0]).to.equal(treeCount2);
    });
  });
});
