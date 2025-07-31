import { expect } from "chai";
import { ethers } from "hardhat";
import { ContractFactory, Signer } from "ethers";
import { SwapScrollNFT } from "../typechain-types";

declare global {
  var describe: any;
  var it: any;
  var beforeEach: any;
}

describe("SwapScrollNFT", function () {
  let SwapScrollNFT: ContractFactory;
  let swapScrollNFT: Contract;
  let owner: Signer;
  let user1: Signer;
  let user2: Signer;
  let ownerAddress: string;
  let user1Address: string;
  let user2Address: string;

  beforeEach(async function () {
    [owner, user1, user2] = await ethers.getSigners();
    ownerAddress = await owner.getAddress();
    user1Address = await user1.getAddress();
    user2Address = await user2.getAddress();

    SwapScrollNFT = await ethers.getContractFactory("SwapScrollNFT");
    swapScrollNFT = await SwapScrollNFT.deploy();
    await swapScrollNFT.deployed();
  });

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      expect(await swapScrollNFT.owner()).to.equal(ownerAddress);
    });

    it("Should have correct name and symbol", async function () {
      expect(await swapScrollNFT.name()).to.equal("SwapScrolls");
      expect(await swapScrollNFT.symbol()).to.equal("SWAPSCROLL");
    });
  });

  describe("Minting", function () {
    it("Should mint a new SwapScroll with correct payment", async function () {
      const mintPrice = await swapScrollNFT.MINT_PRICE();
      const scrollType = "basic";
      const tokenURI = "ipfs://QmTest";

      await expect(
        swapScrollNFT.connect(user1).mintSwapScroll(scrollType, tokenURI, {
          value: mintPrice
        })
      )
        .to.emit(swapScrollNFT, "SwapScrollMinted")
        .withArgs(1, user1Address, scrollType);

      expect(await swapScrollNFT.ownerOf(1)).to.equal(user1Address);
      expect(await swapScrollNFT.tokenURI(1)).to.equal(tokenURI);
    });

    it("Should fail to mint with insufficient payment", async function () {
      const insufficientPrice = ethers.utils.parseEther("0.005"); // Less than required
      const scrollType = "basic";
      const tokenURI = "ipfs://QmTest";

      await expect(
        swapScrollNFT.connect(user1).mintSwapScroll(scrollType, tokenURI, {
          value: insufficientPrice
        })
      ).to.be.revertedWith("Insufficient mint price");
    });

    it("Should fail to mint with empty scroll type", async function () {
      const mintPrice = await swapScrollNFT.MINT_PRICE();
      const scrollType = "";
      const tokenURI = "ipfs://QmTest";

      await expect(
        swapScrollNFT.connect(user1).mintSwapScroll(scrollType, tokenURI, {
          value: mintPrice
        })
      ).to.be.revertedWith("Invalid scroll type");
    });
  });

  describe("Swap Execution", function () {
    beforeEach(async function () {
      // Mint a scroll first
      const mintPrice = await swapScrollNFT.MINT_PRICE();
      await swapScrollNFT.connect(user1).mintSwapScroll("basic", "ipfs://QmTest", {
        value: mintPrice
      });
    });

    it("Should execute swap and update scroll data", async function () {
      const tokenId = 1;
      const fromToken = "ETH";
      const toToken = "USDC";
      const amount = ethers.utils.parseEther("1");
      const price = ethers.utils.parseEther("1800");
      const chainId = "1";

      await expect(
        swapScrollNFT.connect(user1).executeSwap(
          tokenId,
          fromToken,
          toToken,
          amount,
          price,
          chainId
        )
      )
        .to.emit(swapScrollNFT, "SwapExecuted")
        .withArgs(tokenId, fromToken, toToken, amount);

      const scrollData = await swapScrollNFT.getScrollData(tokenId);
      expect(scrollData.swapCount).to.equal(1);
      expect(scrollData.totalVolume).to.equal(amount);
    });

    it("Should fail to execute swap if not scroll owner", async function () {
      const tokenId = 1;
      const fromToken = "ETH";
      const toToken = "USDC";
      const amount = ethers.utils.parseEther("1");
      const price = ethers.utils.parseEther("1800");
      const chainId = "1";

      await expect(
        swapScrollNFT.connect(user2).executeSwap(
          tokenId,
          fromToken,
          toToken,
          amount,
          price,
          chainId
        )
      ).to.be.revertedWith("Not scroll owner");
    });
  });

  describe("Cross-Chain Swap", function () {
    beforeEach(async function () {
      // Mint a scroll first
      const mintPrice = await swapScrollNFT.MINT_PRICE();
      await swapScrollNFT.connect(user1).mintSwapScroll("basic", "ipfs://QmTest", {
        value: mintPrice
      });
    });

    it("Should execute cross-chain swap", async function () {
      const tokenId = 1;
      const fromChain = "ethereum";
      const toChain = "polygon";
      const bridgeData = "0x1234567890abcdef";

      await expect(
        swapScrollNFT.connect(user1).executeCrossChainSwap(
          tokenId,
          fromChain,
          toChain,
          bridgeData
        )
      )
        .to.emit(swapScrollNFT, "CrossChainSwap")
        .withArgs(tokenId, fromChain, toChain);

      const scrollData = await swapScrollNFT.getScrollData(tokenId);
      expect(scrollData.swapCount).to.equal(1);
      expect(scrollData.crossChainData).to.equal(bridgeData);
    });
  });

  describe("Scroll Trading", function () {
    beforeEach(async function () {
      // Mint a scroll first
      const mintPrice = await swapScrollNFT.MINT_PRICE();
      await swapScrollNFT.connect(user1).mintSwapScroll("basic", "ipfs://QmTest", {
        value: mintPrice
      });
    });

    it("Should trade scroll to new owner", async function () {
      const tokenId = 1;

      await expect(
        swapScrollNFT.connect(user1).tradeScroll(tokenId, user2Address)
      )
        .to.emit(swapScrollNFT, "ScrollTraded")
        .withArgs(tokenId, user1Address, user2Address, 0);

      expect(await swapScrollNFT.ownerOf(tokenId)).to.equal(user2Address);
    });

    it("Should fail to trade if not scroll owner", async function () {
      const tokenId = 1;

      await expect(
        swapScrollNFT.connect(user2).tradeScroll(tokenId, user2Address)
      ).to.be.revertedWith("Not scroll owner");
    });
  });

  describe("Access Control", function () {
    it("Should allow owner to pause contract", async function () {
      await swapScrollNFT.pause();
      expect(await swapScrollNFT.paused()).to.be.true;
    });

    it("Should allow owner to unpause contract", async function () {
      await swapScrollNFT.pause();
      await swapScrollNFT.unpause();
      expect(await swapScrollNFT.paused()).to.be.false;
    });

    it("Should fail to pause if not owner", async function () {
      await expect(
        swapScrollNFT.connect(user1).pause()
      ).to.be.revertedWith("Ownable: caller is not the owner");
    });

    it("Should fail to mint when paused", async function () {
      await swapScrollNFT.pause();
      const mintPrice = await swapScrollNFT.MINT_PRICE();

      await expect(
        swapScrollNFT.connect(user1).mintSwapScroll("basic", "ipfs://QmTest", {
          value: mintPrice
        })
      ).to.be.revertedWith("Pausable: paused");
    });
  });

  describe("Data Retrieval", function () {
    beforeEach(async function () {
      // Mint a scroll first
      const mintPrice = await swapScrollNFT.MINT_PRICE();
      await swapScrollNFT.connect(user1).mintSwapScroll("basic", "ipfs://QmTest", {
        value: mintPrice
      });
    });

    it("Should return correct scroll data", async function () {
      const tokenId = 1;
      const scrollData = await swapScrollNFT.getScrollData(tokenId);

      expect(scrollData.tokenId).to.equal(tokenId);
      expect(scrollData.owner).to.equal(user1Address);
      expect(scrollData.scrollType).to.equal("basic");
      expect(scrollData.swapCount).to.equal(0);
      expect(scrollData.totalVolume).to.equal(0);
      expect(scrollData.reputation).to.equal(100); // Base reputation
    });

    it("Should return user's scrolls", async function () {
      const userScrolls = await swapScrollNFT.getUserScrolls(user1Address);
      expect(userScrolls.length).to.equal(1);
      expect(userScrolls[0]).to.equal(1);
    });

    it("Should return empty array for user with no scrolls", async function () {
      const userScrolls = await swapScrollNFT.getUserScrolls(user2Address);
      expect(userScrolls.length).to.equal(0);
    });
  });

  describe("Reward Calculation", function () {
    it("Should calculate correct rewards for basic scroll", async function () {
      const amount = ethers.utils.parseEther("1000");
      const scrollType = "basic";
      
      // This would test the internal calculateRewards function
      // Since it's internal, we test it indirectly through executeSwap
      const mintPrice = await swapScrollNFT.MINT_PRICE();
      await swapScrollNFT.connect(user1).mintSwapScroll(scrollType, "ipfs://QmTest", {
        value: mintPrice
      });

      await swapScrollNFT.connect(user1).executeSwap(
        1,
        "ETH",
        "USDC",
        amount,
        ethers.utils.parseEther("1800"),
        "1"
      );

      const scrollData = await swapScrollNFT.getScrollData(1);
      expect(scrollData.rewardPoints).to.be.gt(0);
      expect(scrollData.reputation).to.be.gt(100); // Should increase from base
    });
  });
}); 