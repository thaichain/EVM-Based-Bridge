/** @type import('hardhat/config').HardhatUserConfig */
require("@nomicfoundation/hardhat-toolbox");

const { mnemonic } = require('./secrets.json');

task("accounts", "Prints the list of accounts", async () => {
  const accounts = await ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

// 0x3A05f13F03175339659487D2b6709312bfb358DD
// 5a0b298330eb14476d3ebec609190652f0df3fdd1ecd9d4877dc3090d01cee76

module.exports = {
  networks: {
    localhost: {
      url: "http://127.0.0.1:8545"
    },
    hardhat: {
    },
    bsc_testnet: {
      url: "https://data-seed-prebsc-1-s1.binance.org:8545",
      chainId: 97,
      gasPrice: 20000000000,
      accounts: { mnemonic: mnemonic }
    },
    fuji_testnet: {
      url: 'https://api.avax-test.network/ext/bc/C/rpc',
      gasPrice: 225000000000,
      chainId: 43113,
      accounts: { mnemonic: mnemonic }
    }
  },
  etherscan: {
    apiKey: "6IUWJ2755N3U6AHRDIXIP4SQJGSIQGV496",
  },
  solidity: {
    version: "0.8.18",
    settings: {
      optimizer: {
        enabled: true
      }
    },
  },
}
