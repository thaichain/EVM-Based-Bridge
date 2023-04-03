const ethers = require("ethers");

const abiEth = require('./abiEth.json');
const abiBsc = require("./abiBsc.json")
const rpcUrl = "https://api.avax-test.network/ext/bc/C/rpc";
const bscUrl = "https://data-seed-prebsc-1-s1.binance.org:8545/";



// Doğru RPC URL'si kullanarak bağlantı sağlayıcısı oluşturma
// Sözleşme adresi
const EthcontractAddress = "0x29720bC3b78536167B5261f42caFB57F847D63c8";
const BscContractAddress = "0x06df246bA8AdaB2cB5309B5F374436dfB0EE8563";


const EthBridgePrvKey = "--Bridge Key"
const providerBsc = new ethers.providers.JsonRpcProvider(bscUrl);
const providerEth = new ethers.providers.JsonRpcProvider(rpcUrl);

const signerEth = new ethers.Wallet(EthBridgePrvKey, providerEth);
const signerBsc = new ethers.Wallet(EthBridgePrvKey, providerBsc);
const contractEth = new ethers.Contract(EthcontractAddress, abiEth, signerEth);
const contractBsc = new ethers.Contract(BscContractAddress, abiBsc, signerBsc);

let i = 1;



const getWssEth = async () => {
    while (true) {
        console.log(i)
        const data = await contractEth.wss(i);
        const item = {
            sender: data.sender,
            amount: Number(data.amount),
            tokenId: Number(data.tokenId),
            targetChain: Number(data.targetchain),
            status: Number(data.status)
        }
        console.log(item)
        if (item.status == 1) {

            console.log("not sent", i)

            const approveTokenTxn = await contractBsc.approveToken(item.amount, item.tokenId)
            await approveTokenTxn.wait();

            const sendTokenTxn = await contractBsc.recive(item.amount, item.sender, item.tokenId)
            await sendTokenTxn.wait();

            if (sendTokenTxn == false) {
                console.log("failure on sending token: ", item)
                const pauseTxn = contractBsc.pauseToken(item.tokenId);
                await pauseTxn.wait();
                i++;
            } else {
                const txn = await contractEth.setCompleted(i)
                await txn.wait()
                console.log("sent", i)
            }

        } else if (item.status == 3) {
            i++;
        }
    }
}

getWssEth()





// // View fonksiyonunu çağır
// const userAddress = "0x3f7F4d90eb1721Cc1C935C450F705D3a2D87939e";
// controlETH().then(r => console.log('***'));
// async function controlETH() {
//     //  while(true) {
//     const data = await contract.wss(1);
//     console.log(data: ${ data.toString() });
//     //}
// }