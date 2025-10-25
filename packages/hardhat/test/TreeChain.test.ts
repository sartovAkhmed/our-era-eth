import { expect } from "chai";
import { ethers } from "hardhat";
import { Contract } from "ethers";

describe("TreeChain", function () {
  let treeChain: Contract;
  let treeRewardToken: Contract;
  let owner: any;
  let donor: any;
  let executor: any;
  let other: any;

  beforeEach(async function () {
    [owner, donor, executor, other] = await ethers.getSigners();

    // Deploy TreeRewardToken
    const TreeRewardToken = await ethers.getContractFactory("TreeRewardToken");
    treeRewardToken = await TreeRewardToken.deploy();
    await treeRewardToken.waitForDeployment();

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
    it("Should allow donor to purchase a tree", async function () {
      const species = "Дуб";
      const location = "Москва, парк Сокольники";
      const price = ethers.parseEther("0.01");

      await expect(treeChain.connect(donor).purchaseTree(species, location, { value: price }))
        .to.emit(treeChain, "TreePurchased")
        .withArgs(1, donor.address, price, species, location);

      // Check tree data
      const tree = await treeChain.getTree(1);
      expect(tree.species).to.equal(species);
      expect(tree.location).to.equal(location);
      expect(tree.donor).to.equal(donor.address);
      expect(tree.donationAmount).to.equal(price);
      expect(tree.isVerified).to.be.false;

      // Check donor stats
      const donorStats = await treeChain.getUserStats(donor.address);
      expect(donorStats[0]).to.equal(1); // donated trees
      expect(donorStats[1]).to.equal(0); // planted trees
    });

    it("Should reject purchase with insufficient payment", async function () {
      const species = "Дуб";
      const location = "Москва";
      const insufficientPrice = ethers.parseEther("0.005");

      await expect(
        treeChain.connect(donor).purchaseTree(species, location, { value: insufficientPrice }),
      ).to.be.revertedWith("Insufficient payment");
    });

    it("Should reject purchase with empty species", async function () {
      const species = "";
      const location = "Москва";
      const price = ethers.parseEther("0.01");

      await expect(treeChain.connect(donor).purchaseTree(species, location, { value: price })).to.be.revertedWith(
        "Species cannot be empty",
      );
    });

    it("Should reject purchase with empty location", async function () {
      const species = "Дуб";
      const location = "";
      const price = ethers.parseEther("0.01");

      await expect(treeChain.connect(donor).purchaseTree(species, location, { value: price })).to.be.revertedWith(
        "Location cannot be empty",
      );
    });
  });

  describe("Tree Planting", function () {
    beforeEach(async function () {
      // Purchase a tree first
      const species = "Дуб";
      const location = "Москва";
      const price = ethers.parseEther("0.01");
      await treeChain.connect(donor).purchaseTree(species, location, { value: price });
    });

    it("Should allow executor to plant a tree", async function () {
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
      // Purchase and plant a tree
      const species = "Дуб";
      const location = "Москва";
      const price = ethers.parseEther("0.01");
      await treeChain.connect(donor).purchaseTree(species, location, { value: price });

      const treeId = 1;
      const imageHash = "QmXxXxXxXxXxXxXxXxXxXxXxXxXxXxXxXxXxXxXxXxXxXxXxXxXxXxXx";
      const documentHash = "QmYyYyYyYyYyYyYyYyYyYyYyYyYyYyYyYyYyYyYyYyYyYyYyYyYyYyYy";
      await treeChain.connect(executor).plantTree(treeId, imageHash, documentHash);
    });

    it("Should allow owner to verify tree", async function () {
      const treeId = 1;
      const rewardAmount = ethers.parseEther("0.008");

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
      expect(executorStats[1]).to.equal(1); // planted trees
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
      const species = "Сосна";
      const location = "Санкт-Петербург";
      const price = ethers.parseEther("0.01");
      await treeChain.connect(donor).purchaseTree(species, location, { value: price });

      const treeId = 2;

      await expect(treeChain.connect(owner).verifyTree(treeId, true)).to.be.revertedWith("Tree not planted yet");
    });
  });

  describe("Platform Statistics", function () {
    it("Should return correct platform stats", async function () {
      // Purchase a tree
      const species = "Дуб";
      const location = "Москва";
      const price = ethers.parseEther("0.01");
      await treeChain.connect(donor).purchaseTree(species, location, { value: price });

      const stats = await treeChain.getPlatformStats();
      expect(stats[0]).to.equal(1); // totalTreesPlanted
      expect(stats[1]).to.equal(price); // totalDonations
      expect(stats[2]).to.equal(0); // totalRewardsPaid
      expect(stats[3]).to.equal(price); // availableBalance
    });
  });

  describe("Withdrawal", function () {
    beforeEach(async function () {
      // Purchase a tree to add funds
      const species = "Дуб";
      const location = "Москва";
      const price = ethers.parseEther("0.01");
      await treeChain.connect(donor).purchaseTree(species, location, { value: price });
    });

    it("Should allow owner to withdraw funds", async function () {
      const amount = ethers.parseEther("0.005");
      const initialBalance = await ethers.provider.getBalance(owner.address);

      await expect(treeChain.connect(owner).withdrawFunds(amount, "Test withdrawal"))
        .to.emit(treeChain, "FundsWithdrawn")
        .withArgs(owner.address, amount, "Test withdrawal");

      const finalBalance = await ethers.provider.getBalance(owner.address);
      expect(finalBalance).to.be.gt(initialBalance);
    });

    it("Should reject withdrawal by non-owner", async function () {
      const amount = ethers.parseEther("0.005");

      await expect(treeChain.connect(other).withdrawFunds(amount, "Test withdrawal")).to.be.revertedWithCustomError(
        treeChain,
        "OwnableUnauthorizedAccount",
      );
    });

    it("Should reject withdrawal of more than available balance", async function () {
      const amount = ethers.parseEther("0.02"); // More than available

      await expect(treeChain.connect(owner).withdrawFunds(amount, "Test withdrawal")).to.be.revertedWith(
        "Insufficient balance",
      );
    });
  });
});

