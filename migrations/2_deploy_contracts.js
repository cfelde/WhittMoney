const fakeRToken = artifacts.require("FakeRToken");
const fakeERC20 = artifacts.require("FakeERC20");
const aTokenLike = artifacts.require("ATokenLike");
const lendingPoolLike = artifacts.require("LendingPoolLike");

module.exports = function(deployer, network, accounts) {
  deployer.then(async () => {
    let dt = await deployer.deploy(fakeERC20);
    let dtAddress = await dt.address;

    console.log("Deployed Dai: " + dtAddress);

    let rt = await deployer.deploy(fakeRToken);
    let rtAddress = rt.address;

    console.log("Deployed RToken: " + rtAddress);

    let at = await deployer.deploy(aTokenLike);
    let atAddress = at.address;

    console.log("Deployed AToken: " + atAddress);

    let lp = await deployer.deploy(lendingPoolLike);
    let lpAddress = lp.address;

    console.log("Deployed LPAddress: " + lpAddress);
  });
};
