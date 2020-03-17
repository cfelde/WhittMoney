const fakeERC20 = artifacts.require("FakeERC20");

const fakeRToken = artifacts.require("FakeRToken");
const whittRDaiFactory = artifacts.require("WhittRDaiSwapFactory");
const whittRDaiToken = artifacts.require("WhittRDaiMoneyToken");

const aTokenLike = artifacts.require("ATokenLike");
const lendingPoolLike = artifacts.require("LendingPoolLike");

module.exports = function(deployer, network, accounts) {
    deployer.then(async () => {
        // RDai related..
        let dt = await deployer.deploy(fakeERC20);
        console.log("Deployed Dai: " + dt.address);

        let rt = await deployer.deploy(fakeRToken);
        console.log("Deployed RToken: " + rt.address);

        let whittRDaiFactoryInstance = await deployer.deploy(whittRDaiFactory, dt.address, rt.address);
        await dt.approve(whittRDaiFactoryInstance.address, web3.utils.toBN("0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff"));
        await dt.approve(whittRDaiFactoryInstance.address, web3.utils.toBN("0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff"), {from: accounts[1]});
        console.log("Deployed Whitt RDai factory: " + whittRDaiFactoryInstance.address);

        let whittRDaiTokenInstance = await deployer.deploy(whittRDaiToken, whittRDaiFactoryInstance.address);
        await whittRDaiFactoryInstance.setWhittToken(whittRDaiTokenInstance.address);
        console.log("Deployed Whitt RDai token: " + whittRDaiTokenInstance.address);

        console.log();

        // Aave related..
        /*
        let at = await deployer.deploy(aTokenLike);
        let atAddress = at.address;

        console.log("Deployed AToken: " + atAddress);

        let lp = await deployer.deploy(lendingPoolLike);
        let lpAddress = lp.address;

        console.log("Deployed LPAddress: " + lpAddress);
         */
    });
};
