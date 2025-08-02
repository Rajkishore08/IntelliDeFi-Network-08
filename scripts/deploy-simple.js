const { ethers } = require("hardhat");

async function main() {
  console.log("🚀 Deploying IntelliDeFi Network contracts...");

  // Get the deployer account
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with account:", deployer.address);
  console.log("Account balance:", (await deployer.provider.getBalance(deployer.address)).toString());

  try {
    // Deploy IntelliDeFi Token first
    console.log("\n🪙 Deploying IntelliDeFiToken...");
    const IntelliDeFiToken = await ethers.getContractFactory("IntelliDeFiToken");
    const intelliDeFiToken = await IntelliDeFiToken.deploy("IntelliDeFi Network Token", "IDNT");
    await intelliDeFiToken.waitForDeployment();
    console.log("✅ IntelliDeFiToken deployed to:", await intelliDeFiToken.getAddress());

    // Deploy SwapScrollNFT
    console.log("\n📜 Deploying SwapScrollNFT...");
    const SwapScrollNFT = await ethers.getContractFactory("SwapScrollNFT");
    const swapScrollNFT = await SwapScrollNFT.deploy();
    await swapScrollNFT.waitForDeployment();
    console.log("✅ SwapScrollNFT deployed to:", await swapScrollNFT.getAddress());

    // Deploy LayerZeroBridge
    console.log("\n🌉 Deploying LayerZeroBridge...");
    const LayerZeroBridge = await ethers.getContractFactory("LayerZeroBridge");
    const mockEndpoint = "0x66A71Dcef29A0fFBDBE3c6a460a3B5BC225Cd675";
    const layerZeroBridge = await LayerZeroBridge.deploy(mockEndpoint);
    await layerZeroBridge.waitForDeployment();
    console.log("✅ LayerZeroBridge deployed to:", await layerZeroBridge.getAddress());

    // Deploy SuiBridge
    console.log("\n🔗 Deploying SuiBridge...");
    const SuiBridge = await ethers.getContractFactory("SuiBridge");
    const suiBridge = await SuiBridge.deploy();
    await suiBridge.waitForDeployment();
    console.log("✅ SuiBridge deployed to:", await suiBridge.getAddress());

    // Deploy RewardSystem
    console.log("\n🎁 Deploying RewardSystem...");
    const RewardSystem = await ethers.getContractFactory("RewardSystem");
    const rewardSystem = await RewardSystem.deploy(await intelliDeFiToken.getAddress());
    await rewardSystem.waitForDeployment();
    console.log("✅ RewardSystem deployed to:", await rewardSystem.getAddress());

    console.log("\n🎉 All contracts deployed successfully!");
    console.log("\n📋 Contract Addresses:");
    console.log("IntelliDeFiToken:", await intelliDeFiToken.getAddress());
    console.log("SwapScrollNFT:", await swapScrollNFT.getAddress());
    console.log("LayerZeroBridge:", await layerZeroBridge.getAddress());
    console.log("SuiBridge:", await suiBridge.getAddress());
    console.log("RewardSystem:", await rewardSystem.getAddress());

  } catch (error) {
    console.error("❌ Deployment failed:", error);
    throw error;
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
  }); 