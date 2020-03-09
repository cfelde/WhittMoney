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
        let rtokenInstance = await fakeRToken.deployed();
        let daiInstance = await fakeERC20.deployed();
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

        assert.equal(await wm.whittToken(), whittTokenInstance.address);
        assert.equal(await wm.swapFactory(), swapFactoryInstance.address);
        assert.equal(await wm.dai(), daiInstance.address);
        assert.equal(await wm.rtoken(), rtokenInstance.address);
        assert.equal((await wm.fixedSwapId()).toString(10), fixedSwapId.toString(10));
        assert.equal((await wm.floatSwapId()).toString(10), 0);
        assert.equal(await wm.lockedAmount(), 1000);
        assert.equal(await wm.lockedDuration(), 0);
        assert.equal(await wm.lockedTimestamp(), 0);
        assert.equal(await wm.dealValue(), 10);

        await expectRevert(swapFactoryInstance.floatEnter(fixedSwapId, 1001, 0, 10), "Invalid locked amount");
        await expectRevert(swapFactoryInstance.floatEnter(fixedSwapId, 1000, 1, 10), "Invalid locked duration");
        await expectRevert(swapFactoryInstance.floatEnter(fixedSwapId, 1000, 0, 11), "Invalid deal value");

        let tx2 = await wm.fixedExit();
        assert.isTrue(tx2.receipt.rawLogs.map(x => x.address).includes(swapFactoryInstance.address));
        assert.isTrue(tx2.receipt.rawLogs.map(x => x.topics[0]).includes(web3.utils.keccak256("Swap(uint256,uint256,address,uint256,uint256,uint256)")));

        assert.equal(await wm.whittToken(), whittTokenInstance.address);
        assert.equal(await wm.swapFactory(), swapFactoryInstance.address);
        assert.equal(await wm.dai(), daiInstance.address);
        assert.equal(await wm.rtoken(), rtokenInstance.address);
        assert.equal((await wm.fixedSwapId()).toString(10), fixedSwapId.toString(10));
        assert.equal((await wm.floatSwapId()).toString(10), 0);
        assert.equal(await wm.lockedAmount(), 0);
        assert.equal(await wm.lockedDuration(), 0);
        assert.equal(await wm.lockedTimestamp(), 0);
        assert.equal(await wm.dealValue(), 10);

        await expectRevert(wm.fixedExit(), "No value locked");
        await expectRevert(swapFactoryInstance.floatEnter(fixedSwapId, 1000, 0, 10), "No value locked");

        // Test direct WM access
        await expectRevert(wm.fixedEnter(accounts[0], fixedSwapId), "Not swap factory");
        await expectRevert(wm.floatEnter(accounts[0], floatSwapId, fixedSwapId, 1000, 0, 10), "Not swap factory");
    });

    it("is possible to deploy but not exit a locked swap", async () => {
        let rtokenInstance = await fakeRToken.deployed();
        let daiInstance = await fakeERC20.deployed();
        let whittTokenInstance = await whittToken.deployed();
        let swapFactoryInstance = await swapFactory.deployed();

        let tx1 = await swapFactoryInstance.fixedEnter(2000, 5, 20);
        truffleAssert.eventEmitted(tx1, 'Swap', (ev) => {
            return ev.eventType.toString(10) === "1"
                && ev.actor === accounts[0]
                && ev.lockedAmount.toString(10) === "2000"
                && ev.lockedDuration.toString(10) === "5"
                && ev.dealValue.toString(10) === "20";
        });

        let fixedSwapId = tx1.logs[0].args.fixedSwapId;
        let whittRDaiMoneyAddress1 = await whittTokenInstance.swapIdAddress(fixedSwapId);
        let wm = await whittRDaiMoney.at(whittRDaiMoneyAddress1);

        assert.equal(await wm.whittToken(), whittTokenInstance.address);
        assert.equal(await wm.swapFactory(), swapFactoryInstance.address);
        assert.equal(await wm.dai(), daiInstance.address);
        assert.equal(await wm.rtoken(), rtokenInstance.address);
        assert.equal((await wm.fixedSwapId()).toString(10), fixedSwapId.toString(10));
        assert.equal((await wm.floatSwapId()).toString(10), 0);
        assert.equal(await wm.lockedAmount(), 2000);
        assert.equal(await wm.lockedDuration(), 5);
        assert.equal(await wm.lockedTimestamp(), 0);
        assert.equal(await wm.dealValue(), 20);

        let floatSwapId = await swapFactoryInstance.calcOtherSideId(fixedSwapId);

        assert.isTrue(await whittTokenInstance.exists(fixedSwapId));
        assert.isFalse(await whittTokenInstance.exists(floatSwapId));

        assert.isTrue(await swapFactoryInstance.isFixedSide(fixedSwapId));
        assert.isFalse(await swapFactoryInstance.isFixedSide(floatSwapId));

        let tx2 = await swapFactoryInstance.floatEnter(fixedSwapId, 2000, 5, 20, {from: accounts[1]});
        truffleAssert.eventEmitted(tx2, 'Swap', (ev) => {
            return ev.eventType.toString(10) === "2"
                && ev.actor === accounts[1]
                && ev.lockedAmount.toString(10) === "2000"
                && ev.lockedDuration.toString(10) === "5"
                && ev.dealValue.toString(10) === "20";
        });

        assert.isTrue(await whittTokenInstance.exists(floatSwapId));

        let whittRDaiMoneyAddress2 = await whittTokenInstance.swapIdAddress(floatSwapId);

        assert.equal(whittRDaiMoneyAddress1, whittRDaiMoneyAddress2);

        assert.equal(await wm.whittToken(), whittTokenInstance.address);
        assert.equal(await wm.swapFactory(), swapFactoryInstance.address);
        assert.equal(await wm.dai(), daiInstance.address);
        assert.equal(await wm.rtoken(), rtokenInstance.address);
        assert.equal((await wm.fixedSwapId()).toString(10), fixedSwapId.toString(10));
        assert.equal((await wm.floatSwapId()).toString(10), floatSwapId.toString(10));
        assert.equal(await wm.lockedAmount(), 2000);
        assert.equal(await wm.lockedDuration(), 5);
        assert.isTrue(await wm.lockedTimestamp() > Math.round(new Date().getTime() / 1000));
        assert.equal(await wm.dealValue(), 20);

        await sleep(2000);

        await expectRevert(wm.fixedExit(), "Locked");
    });

    it("is only possible for one person the enter float side", async () => {
        let whittTokenInstance = await whittToken.deployed();
        let swapFactoryInstance = await swapFactory.deployed();

        let tx1 = await swapFactoryInstance.fixedEnter(1000, 0, 10);
        let fixedSwapId = tx1.logs[0].args.fixedSwapId;
        let floatSwapId = await swapFactoryInstance.calcOtherSideId(fixedSwapId);

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

    it("is only possible for fixed guy to exit after lockup", async () => {
        let whittTokenInstance = await whittToken.deployed();
        let swapFactoryInstance = await swapFactory.deployed();

        let tx1 = await swapFactoryInstance.fixedEnter(1000, 5, 10);
        let fixedSwapId = tx1.logs[0].args.fixedSwapId;
        let whittRDaiMoneyAddress1 = await whittTokenInstance.swapIdAddress(fixedSwapId);
        let wm = await whittRDaiMoney.at(whittRDaiMoneyAddress1);

        await swapFactoryInstance.floatEnter(fixedSwapId, 1000, 5, 10, {from: accounts[1]});

        await sleep(2000);
        await expectRevert(wm.fixedExit(), "Locked");
        assert.equal(await wm.lockedAmount(), 1000);

        await sleep(1000);
        await expectRevert(wm.fixedExit(), "Locked");
        assert.equal(await wm.lockedAmount(), 1000);

        await sleep(3000);
        await wm.fixedExit();
        assert.equal(await wm.lockedAmount(), 0);
    });

    // TODO it("is not possible to enter a float side with mismatching values", async () => {});

    // TODO it("triggers the right actions in dai and rdai", async () => {});

});
