const {expectRevert} = require('@openzeppelin/test-helpers');
const truffleAssert = require('truffle-assertions');

const fakeRToken = artifacts.require("FakeRToken");
const fakeERC20 = artifacts.require("FakeERC20");
const swapFactory = artifacts.require("WhittRDaiSwapFactory");
const whittToken = artifacts.require("WhittRDaiMoneyToken");
const whittRDaiMoney = artifacts.require("WhittRDaiMoney");

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

contract("When testing WhittRDaiMoney, it:", async accounts => {
    it("is possible to deploy and exit an unlocked swap", async () => {
        let whittTokenInstance = await whittToken.deployed();
        let swapFactoryInstance = await swapFactory.deployed();

        let tx1 = await swapFactoryInstance.fixedEnter(1000, 0, 10);
        truffleAssert.eventEmitted(tx1, 'Swap', (ev) => {
            return ev.eventType.toString(10) === "1"
                && ev.actor === accounts[0]
                && ev.lockedAmount.toString(10) === "1000"
                && ev.lockedDuration.toString(10) === "0"
                && ev.dealValue.toString(10) === "10";
        });

        let fixedSwapId = tx1.logs[0].args.fixedSwapId;
        let whittRDaiMoneyAddress = await whittTokenInstance.swapIdAddress(fixedSwapId);
        let wm = await whittRDaiMoney.at(whittRDaiMoneyAddress);

        let floatSwapId = await swapFactoryInstance.calcOtherSideId(fixedSwapId);
        let fixedSwapId2 = await swapFactoryInstance.calcOtherSideId(floatSwapId);

        assert.isTrue(await whittTokenInstance.exists(fixedSwapId));
        assert.isFalse(await whittTokenInstance.exists(floatSwapId));

        assert.isTrue(await swapFactoryInstance.isFixedSide(fixedSwapId));
        assert.isFalse(await swapFactoryInstance.isFixedSide(floatSwapId));

        assert.equal(fixedSwapId.toString(16), fixedSwapId2.toString(16));

        //console.log("Created swap with fixed side id 0x" + fixedSwapId.toString(16) + " on address " + whittRDaiMoneyAddress);

        assert.equal(await wm.lockedAmount(), 1000);
        // TODO Other values

        await expectRevert(swapFactoryInstance.floatEnter(fixedSwapId, 1001, 0, 10), "Invalid locked amount");
        await expectRevert(swapFactoryInstance.floatEnter(fixedSwapId, 1000, 1, 10), "Invalid locked duration");
        await expectRevert(swapFactoryInstance.floatEnter(fixedSwapId, 1000, 0, 11), "Invalid deal value");

        let tx2 = await wm.fixedExit();
        assert.isTrue(tx2.receipt.rawLogs.map(x => x.address).includes(swapFactoryInstance.address));
        assert.isTrue(tx2.receipt.rawLogs.map(x => x.topics[0]).includes(web3.utils.keccak256("Swap(uint256,uint256,address,uint256,uint256,uint256)")));

        assert.equal(await wm.lockedAmount(), 0);
        // TODO Other values

        await expectRevert(wm.fixedExit(), "No value locked");
        await expectRevert(swapFactoryInstance.floatEnter(fixedSwapId, 1000, 0, 10), "No value locked");

        // Test direct WM access
        await expectRevert(wm.fixedEnter(accounts[0], fixedSwapId), "Not swap factory");
        await expectRevert(wm.floatEnter(accounts[0], floatSwapId, fixedSwapId, 1000, 0, 10), "Not swap factory");
    });

    it("is possible to deploy but not exit a locked swap", async () => {
        let whittTokenInstance = await whittToken.deployed();
        let swapFactoryInstance = await swapFactory.deployed();

        let tx1 = await swapFactoryInstance.fixedEnter(1000, 5, 10);
        truffleAssert.eventEmitted(tx1, 'Swap', (ev) => {
            return ev.eventType.toString(10) === "1"
                && ev.actor === accounts[0]
                && ev.lockedAmount.toString(10) === "1000"
                && ev.lockedDuration.toString(10) === "5"
                && ev.dealValue.toString(10) === "10";
        });

        let fixedSwapId = tx1.logs[0].args.fixedSwapId;
        let whittRDaiMoneyAddress1 = await whittTokenInstance.swapIdAddress(fixedSwapId);
        let wm = await whittRDaiMoney.at(whittRDaiMoneyAddress1);

        //console.log("Created swap with fixed side id 0x" + fixedSwapId.toString(16) + " on address " + whittRDaiMoneyAddress1);

        assert.equal(await wm.lockedAmount(), 1000);
        // TODO Other values

        let floatSwapId = await swapFactoryInstance.calcOtherSideId(fixedSwapId);

        assert.isTrue(await whittTokenInstance.exists(fixedSwapId));
        assert.isFalse(await whittTokenInstance.exists(floatSwapId));

        assert.isTrue(await swapFactoryInstance.isFixedSide(fixedSwapId));
        assert.isFalse(await swapFactoryInstance.isFixedSide(floatSwapId));

        let tx2 = await swapFactoryInstance.floatEnter(fixedSwapId, 1000, 5, 10, {from: accounts[1]});
        truffleAssert.eventEmitted(tx2, 'Swap', (ev) => {
            return ev.eventType.toString(10) === "2"
                && ev.actor === accounts[1]
                && ev.lockedAmount.toString(10) === "1000"
                && ev.lockedDuration.toString(10) === "5"
                && ev.dealValue.toString(10) === "10";
        });

        assert.isTrue(await whittTokenInstance.exists(floatSwapId));

        let whittRDaiMoneyAddress2 = await whittTokenInstance.swapIdAddress(floatSwapId);

        assert.equal(whittRDaiMoneyAddress1, whittRDaiMoneyAddress2);

        assert.equal(await wm.lockedAmount(), 1000);
        // TODO Other values

        await sleep(2000);

        await expectRevert(wm.fixedExit(), "Locked");
    });

    it("is only possible for one person the enter float side", async () => {
        let whittTokenInstance = await whittToken.deployed();
        let swapFactoryInstance = await swapFactory.deployed();

        let tx1 = await swapFactoryInstance.fixedEnter(1000, 0, 10);
        let fixedSwapId = tx1.logs[0].args.fixedSwapId;
        let floatSwapId = await swapFactoryInstance.calcOtherSideId(fixedSwapId);

        //console.log("Created swap with fixed side id 0x" + fixedSwapId.toString(16) + " on address " + whittRDaiMoneyAddress1);

        let tx2 = await swapFactoryInstance.floatEnter(fixedSwapId, 1000, 0, 10, {from: accounts[1]});
        truffleAssert.eventEmitted(tx2, 'Swap', (ev) => {
            return ev.eventType.toString(10) === "2"
                && ev.actor === accounts[1]
                && ev.lockedAmount.toString(10) === "1000"
                && ev.lockedDuration.toString(10) === "0"
                && ev.dealValue.toString(10) === "10";
        });

        assert.isTrue(await whittTokenInstance.exists(floatSwapId));

        await expectRevert(swapFactoryInstance.floatEnter(fixedSwapId, 1000, 0, 10), "Already a float guy");
        await expectRevert(swapFactoryInstance.floatEnter(fixedSwapId, 1000, 0, 10, {from: accounts[1]}), "Already a float guy");
    });

    /*
    it("is only possible for fixed guy to exit after lockup", async () => {
        let dai = await fakeERC20.deployed();
        let rdai = await fakeRToken.deployed();

        let wm = await whittRDaiMoney.new(dai.address, rdai.address, 1000000, 3, 200000, {from: accounts[1]});
        await dai.approve(wm.address, 10000000);
        let tx1 = await wm.init({from: accounts[1]});
        truffleAssert.eventEmitted(tx1, 'NewWhitt', (ev) => {
            return ev.fixedOwner.toString() === accounts[1].toString()
                && ev.lockedAmount.toString(10) === "1000000"
                && ev.lockedDuration.toString(10) === "3"
                && ev.dealValue.toString(10) === "200000";
        });

        await wm.floatEnter();

        await expectRevert(wm.fixedExit({from: accounts[1]}), "Locked");

        await sleep(4 * 1000);

        assert.equal(await wm.lockedAmount(), 1000000);
        await wm.fixedExit({from: accounts[1]});
        assert.equal(await wm.lockedAmount(), 0);
    });
    */
});
