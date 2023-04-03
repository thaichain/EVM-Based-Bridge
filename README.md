# EVM-Based-Bridge

## Installation

## First Step

Deploy Bridge Contract to 2 Differents Networks.
you can use deploy scripts. Firstly Add you Owner walet key to secret.json

```
npx hardhat run scripts/deployAvax.js --network fuji_testnet

npx hardhat run scripts/deployBSC.js --network fuji_testnet
```

You deployed ERC20 Token and Bridge Contracts..

## Second Step

You should set your API, edit Index.js. set your bridge addres you can take from config[network].js.

```
node ./index.js

```

Test Your Bridge

You can use reAttack.js for testing.. add you private key.

## Notes
```
Before using the repository function, grant the Approve permission to the Bridge contract via the Token contract. When Front End is added, we will be able to do these operations from the front end.
```
Developers :
Github : @musxos

Github : @eyyubmermer

Github : @sinyordes
