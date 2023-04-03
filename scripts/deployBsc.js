const hre = require("hardhat");
const fs = require('fs');

async function main() {

    let bridgeAddress = "0x6246C17093D6c640E140523BA0ed3C31fb11C4AB";

    const BscBridge = await hre.ethers.getContractFactory("BscBridge");
    const bscBridge = await BscBridge.deploy(bridgeAddress);
    await bscBridge.deployed();
    console.log("BscBridge contract deployed to: ", bscBridge.address);

    const DemoUSD = await hre.ethers.getContractFactory("wSHM");
    const demoUSD = await DemoUSD.deploy();
    await demoUSD.deployed();
    console.log("Demo USDT contract deployed to: ", demoUSD.address);

    const transferTxn = await demoUSD.transfer(bscBridge.address, ethers.utils.parseEther("1000"));
    await transferTxn.wait()
    console.log("liquidity added!")

    const addSupportToken = await bscBridge.addSupportedToken("Wrapped Shardeum", "wSHM", demoUSD.address, 18);
    await addSupportToken.wait();
    console.log("supported token data added")


    let config = `module.exports = {
        bscbridgeaddress : "${bscBridge.address}",
        bscdemousdaddress : "${demoUSD.address}"
    }
  `

    let data = JSON.stringify(config)
    fs.writeFileSync('configBsc.js', JSON.parse(data))
}



main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
