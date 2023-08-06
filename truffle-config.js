require('dotenv').config();
var HDWalletProvider = require("truffle-hdwallet-provider");
var mnemonic = process.env["NEMONIC"];
var tokenKey = process.env["ENDPOINT_KEY"];

module.exports = {
  networks: {
    
    development: {
      host: "127.0.0.1",
      port: 7545,
      network_id: "*" // Match any network id
    },
    sepolia:{
      host: "localhost",
      provider: new HDWalletProvider( mnemonic, "https://sepolia.infura.io/v3/" + tokenKey),
      network_id: 11155111, 
      confirmations: 1,    
      skipDryRun: true  
      },
    rinkeby:{
      host: "localhost",
      provider: new HDWalletProvider( mnemonic, "https://rinkeby.infura.io/" + tokenKey),
      network_id:4, 
      gas: 4700000,
      },
    ropsten:{
      host: "localhost",
      provider: new HDWalletProvider( mnemonic, "https://ropsten.infura.io/763fdca4ff774b1daa578d5c617672e3"),
      network_id:3, 
      gas: 4700000,
      },
  },
  compilers: {
    solc: {
      version: "0.8.20",
        optimizer: {
          enabled: false,
          runs: 200
      },
    }
  }
};
