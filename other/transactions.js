// Various steps needed for deploying and interacting with the WhittMoney contract.

const whittMoney = artifacts.require("WhittMoney");
const erc20 = artifacts.require("IERC20");
const rtoken = artifacts.require("RTokenLike");

// To deploy a new contract, do:

// Kovan
let daiAddress = "0x4F96Fe3b7A6Cf9725f59d353F723c1bDb64CA6Aa";
let rtokenAddress = "0x462303f77a3f17Dbd95eb7bab412FE4937F9B9CB";

// Mainnet
//let daiAddress = "0x6B175474E89094C44Da98b954EedeAC495271d0F";
//let rtokenAddress = "0x261b45D85cCFeAbb11F022eBa346ee8D1cd488c0";

let lockedAmount = web3.utils.toWei("680"); // How much DAI to lock up as collateral
let lockedDuration = 60 * 5; // For how long, in seconds, the deal is locked
let dealValue = web3.utils.toWei("5"); // How much up front DAI payment is required in exchange of the collateral

let wm = await deployer.deploy(whittMoney, daiAddress, rtokenAddress, lockedAmount, lockedDuration, dealValue);
let wmAddress = wm.address;

console.log("Deployed WhittMoney: " + wmAddress);

let dai = await erc20.at(daiAddress);
let rdai = await rtoken.at(rtokenAddress);

await dai.approve(wm.address, web3.utils.toBN("0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff"));
console.log("Spender approved: " + (await dai.allowance(accounts[0], wm.address)).toString(16));
await wm.init();

console.log("Ready..");

// -----

// To enter a floating, and locking the contract, do:

await wm.floatEnter();

// -----

// To get back collateral after lockup period or before a floatEnter(), do:

await wm.fixedExit();
await rdai.redeemAll();

console.log("Done..");
