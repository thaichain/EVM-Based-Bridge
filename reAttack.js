const ethers = require("ethers");
const abiEth = require('./abiEth.json');

const rpcUrl = "https://api.avax-test.network/ext/bc/C/rpc";
const EthcontractAddress = "0x29720bC3b78536167B5261f42caFB57F847D63c8";

const EthBridgePrvKey = "PrivateKey"
const providerEth = new ethers.providers.JsonRpcProvider(rpcUrl);

const signerEth = new ethers.Wallet(EthBridgePrvKey, providerEth);
const contractEth = new ethers.Contract(EthcontractAddress, abiEth, signerEth);

const getWssEth = async () => {
while (true) {
    
    const txn = await contractEth.deposit(1,1);
    await txn.wait();
    console.log(txn);
}
}
getWssEth();
