const fakeRToken = artifacts.require("FakeRToken");
const fakeERC20 = artifacts.require("FakeERC20");

module.exports = function(deployer, network, accounts) {
  deployer.then(async () => {
    let dt = await deployer.deploy(fakeERC20);
    let dtAddress = await dt.address;

    console.log("Deployed Dai: " + dtAddress);

    let rt = await deployer.deploy(fakeRToken);
    let rtAddress = rt.address;

    console.log("Deployed RToken: " + rtAddress);
  });
};
