import { ethers } from "hardhat";
import { HardhatRuntimeEnvironment } from "hardhat/types";

declare global {
  var hre: any;
}

async function main() {
  console.log("🚀 Deploying SwapScrolls contracts...");

  // Get the deployer account
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with account:", deployer.address);
  console.log("Account balance:", (await deployer.provider.getBalance(deployer.address)).toString());

  // Deploy SwapScrollNFT
  console.log("\n📜 Deploying SwapScrollNFT...");
  const SwapScrollNFT = await ethers.getContractFactory("SwapScrollNFT");
  const swapScrollNFT = await SwapScrollNFT.deploy();
  await swapScrollNFT.waitForDeployment();
  console.log("SwapScrollNFT deployed to:", await swapScrollNFT.getAddress());

  // Deploy LayerZeroBridge (using mock endpoint for demo)
  console.log("\n🌉 Deploying LayerZeroBridge...");
  const LayerZeroBridge = await ethers.getContractFactory("LayerZeroBridge");
  const mockEndpoint = "0x66A71Dcef29A0fFBDBE3c6a460a3B5BC225Cd675"; // Mock endpoint
  const layerZeroBridge = await LayerZeroBridge.deploy(mockEndpoint);
  await layerZeroBridge.waitForDeployment();
  console.log("LayerZeroBridge deployed to:", await layerZeroBridge.getAddress());

  // Deploy SuiBridge
  console.log("\n🔗 Deploying SuiBridge...");
  const SuiBridge = await ethers.getContractFactory("SuiBridge");
  const suiBridge = await SuiBridge.deploy();
  await suiBridge.waitForDeployment();
  console.log("SuiBridge deployed to:", await suiBridge.getAddress());

  // Deploy RewardSystem (using SwapScrolls token)
  console.log("\n🎁 Deploying RewardSystem...");
  const RewardSystem = await ethers.getContractFactory("RewardSystem");
  const swapScrollsToken = await swapScrollsToken.getAddress(); // Use our deployed token
  const rewardSystem = await RewardSystem.deploy(swapScrollsToken);
  await rewardSystem.waitForDeployment();
  console.log("RewardSystem deployed to:", await rewardSystem.getAddress());

  // Deploy SwapScrolls Token
  console.log("\n🪙 Deploying SwapScrollsToken...");
  const SwapScrollsToken = await ethers.getContractFactory("SwapScrollsToken");
  const swapScrollsToken = await SwapScrollsToken.deploy("SwapScrolls Token", "SST");
  await swapScrollsToken.waitForDeployment();
  console.log("SwapScrollsToken deployed to:", await swapScrollsToken.getAddress());

  // Deploy RewardSystem (using SwapScrolls token)
  console.log("\n🎁 Deploying RewardSystem...");
  const RewardSystem = await ethers.getContractFactory("RewardSystem");
  const rewardSystem = await RewardSystem.deploy(await swapScrollsToken.getAddress());
  await rewardSystem.waitForDeployment();
  console.log("RewardSystem deployed to:", await rewardSystem.getAddress());

  // Update RewardSystem with real token address
  console.log("\n🔄 Updating RewardSystem with real token...");
  await rewardSystem.updateRewardToken(await swapScrollsToken.getAddress());
  console.log("RewardSystem updated with real token");

  // Set up initial configuration
  console.log("\n⚙️ Setting up initial configuration...");
  
  // Add supported chains to LayerZeroBridge
  await layerZeroBridge.addSupportedChain(1, "ethereum");
  await layerZeroBridge.addSupportedChain(137, "polygon");
  await layerZeroBridge.addSupportedChain(42161, "arbitrum");
  await layerZeroBridge.addSupportedChain(10, "optimism");
  await layerZeroBridge.addSupportedChain(8453, "base");
  console.log("✅ Supported chains added to LayerZeroBridge");

  // Mint some initial reward tokens
  await swapScrollsToken.mint(await rewardSystem.getAddress(), ethers.parseEther("1000000"));
  console.log("✅ Initial reward tokens minted");

  console.log("\n🎉 Deployment completed successfully!");
  console.log("\n📋 Contract Addresses:");
  console.log("SwapScrollNFT:", await swapScrollNFT.getAddress());
  console.log("LayerZeroBridge:", await layerZeroBridge.getAddress());
  console.log("SuiBridge:", await suiBridge.getAddress());
  console.log("RewardSystem:", await rewardSystem.getAddress());
  console.log("SwapScrollsToken:", await swapScrollsToken.getAddress());

  // Verify contracts on Etherscan (if not on local network)
  const network = await ethers.provider.getNetwork();
  if (network.chainId !== BigInt(31337)) {
    console.log("\n🔍 Verifying contracts on Etherscan...");
    try {
      await hre.run("verify:verify", {
        address: await swapScrollNFT.getAddress(),
        constructorArguments: [],
      });
      console.log("✅ SwapScrollNFT verified");
    } catch (error) {
      console.log("⚠️ SwapScrollNFT verification failed:", error);
    }

    try {
      await hre.run("verify:verify", {
        address: await layerZeroBridge.getAddress(),
        constructorArguments: [mockEndpoint],
      });
      console.log("✅ LayerZeroBridge verified");
    } catch (error) {
      console.log("⚠️ LayerZeroBridge verification failed:", error);
    }

    try {
      await hre.run("verify:verify", {
        address: await suiBridge.getAddress(),
        constructorArguments: [],
      });
      console.log("✅ SuiBridge verified");
    } catch (error) {
      console.log("⚠️ SuiBridge verification failed:", error);
    }

    try {
      await hre.run("verify:verify", {
        address: await rewardSystem.getAddress(),
        constructorArguments: [mockRewardToken],
      });
      console.log("✅ RewardSystem verified");
    } catch (error) {
      console.log("⚠️ RewardSystem verification failed:", error);
    }

    try {
      await hre.run("verify:verify", {
        address: await swapScrollsToken.getAddress(),
        constructorArguments: ["SwapScrolls Token", "SST"],
      });
      console.log("✅ SwapScrollsToken verified");
    } catch (error) {
      console.log("⚠️ SwapScrollsToken verification failed:", error);
    }
  }

  console.log("\n🚀 SwapScrolls is ready for action!");
  console.log("Next steps:");
  console.log("1. Update frontend with contract addresses");
  console.log("2. Configure LayerZero endpoints for production");
  console.log("3. Deploy Sui Move contracts");
  console.log("4. Test cross-chain functionality");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
  }); 