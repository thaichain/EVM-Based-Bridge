const hre = require("hardhat");
const fs = require('fs');
const { ethers } = require("ethers");

async function main() {

    let bridgeAddress = "0x6246C17093D6c640E140523BA0ed3C31fb11C4AB";

    const AvaxBridge = await hre.ethers.getContractFactory("AvaxBridge");
    const avaxBridge = await AvaxBridge.deploy(bridgeAddress);
    await avaxBridge.deployed();
    console.log("AvaxBridge contract deployed to: ", avaxBridge.address);

    const DemoUSD = await hre.ethers.getContractFactory("wSHM");
    const demoUSD = await DemoUSD.deploy();
    await demoUSD.deployed();
    console.log("Demo USDC contract deployed to: ", demoUSD.address);

    const transferTxn = await demoUSD.transfer(avaxBridge.address, ethers.utils.parseEther("1000"));
    await transferTxn.wait()
    console.log("liquidity added!")

    const addSupportToken = await avaxBridge.addSupportedToken("Wrapped Shardeum", "wSHM", demoUSD.address, 18);
    await addSupportToken.wait();
    console.log("supported token data added")

    let config = `module.exports = {
        avaxbridgeaddress : "${avaxBridge.address}",
        avaxdemousdaddress : "${demoUSD.address}"
    }
  `

    let data = JSON.stringify(config)
    fs.writeFileSync('configAvax.js', JSON.parse(data))
}



main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
