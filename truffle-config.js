const HDWalletProvider = require("@truffle/hdwallet-provider");
const fs = require('fs');
const mnemonic = readFile(".secret");
const infura = readFile(".infura");

function readFile(path) {
    if (fs.existsSync(path))
        return fs.readFileSync(path).toString().trim();
    else
        return "";
}

module.exports = {
    // See <http://truffleframework.com/docs/advanced/configuration>
    // to customize your Truffle configuration!
    networks: {
        development: {
            host: "127.0.0.1",     // Localhost (default: none)
            port: 8545,            // Standard Ethereum port (default: none)
            network_id: "*",       // Any network (default: none)
        },

        kovan: {
            provider: () => new HDWalletProvider(mnemonic, "https://kovan.infura.io/v3/" + infura),
            network_id: 42,
            gasPrice: 1000000000
        }
    }
};
