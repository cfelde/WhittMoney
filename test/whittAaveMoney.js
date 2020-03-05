const {expectRevert} = require('@openzeppelin/test-helpers');
const truffleAssert = require('truffle-assertions');

const lendingPoolLike = artifacts.require("LendingPoolLike");
const aTokenLike = artifacts.require("ATokenLike");
const fakeERC20 = artifacts.require("FakeERC20");
const whittAaveMoney = artifacts.require("WhittAaveMoney");

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

/*
contract("When testing WhittAaveMoney, it:", async accounts => {
    it("is possible to deploy and exit an unlocked swap", async () => {
        let dai = await fakeERC20.deployed();
        let lp = await lendingPoolLike.deployed();
        let adai = await aTokenLike.deployed();

        let wm = await whittAaveMoney.new(dai.address, lp.address, adai.address, 1000, 0, 10);
        await dai.approve(wm.address, 10000000);
        let tx1 = await wm.init();
        truffleAssert.eventEmitted(tx1, 'NewWhitt', (ev) => {
            return ev.fixedOwner.toString() === accounts[0].toString()
                && ev.lockedAmount.toString(10) === "1000"
                && ev.lockedDuration.toString(10) === "0"
                && ev.dealValue.toString(10) === "10";
        });

        assert.equal(await wm.lockedAmount(), 1000);
        let tx2 = await wm.fixedExit();
        truffleAssert.eventEmitted(tx2, 'FixedExit', (ev) => {
            return ev.fixedOwner.toString() === accounts[0].toString()
                && ev.floatOwner.toString() === "0x0000000000000000000000000000000000000000"
                && ev.lockedAmount.toString(10) === "1000"
                && ev.dealValue.toString(10) === "10";
        });

        assert.equal(await wm.lockedAmount(), 0);

        await expectRevert(wm.fixedExit(), "No value locked");
        await expectRevert(wm.floatEnter(), "No value locked");
    });

    it("is possible to deploy but not exit a locked swap", async () => {
        let dai = await fakeERC20.deployed();
        let lp = await lendingPoolLike.deployed();
        let adai = await aTokenLike.deployed();

        let wm = await whittAaveMoney.new(dai.address, lp.address, adai.address, 2000, 500, 20, {from: accounts[1]});
        await dai.approve(wm.address, 10000000);
        let tx1 = await wm.init({from: accounts[1]});
        truffleAssert.eventEmitted(tx1, 'NewWhitt', (ev) => {
            return ev.fixedOwner.toString() === accounts[1].toString()
                && ev.lockedAmount.toString(10) === "2000"
                && ev.lockedDuration.toString(10) === "500"
                && ev.dealValue.toString(10) === "20";
        });

        assert.equal(await wm.lockedTimestamp(), 0);
        let tx2 = await wm.floatEnter();
        truffleAssert.eventEmitted(tx2, 'FloatEnter', (ev) => {
            return ev.fixedOwner.toString() === accounts[1].toString()
                && ev.floatOwner.toString() === accounts[0].toString()
                && ev.lockedAmount.toString(10) === "2000"
                && ev.dealValue.toString(10) === "20";
        });
        assert.isTrue((await wm.lockedTimestamp()) > 0);

        await expectRevert(wm.fixedExit(), "Not fixed guy");
        await expectRevert(wm.fixedExit({from: accounts[1]}), "Locked");
    });

    it("is only possible for one person the enter float side", async () => {
        let dai = await fakeERC20.deployed();
        let lp = await lendingPoolLike.deployed();
        let adai = await aTokenLike.deployed();

        let wm = await whittAaveMoney.new(dai.address, lp.address, adai.address, 1000000, 1000, 200000, {from: accounts[1]});
        await dai.approve(wm.address, 10000000);
        let tx1 = await wm.init({from: accounts[1]});
        truffleAssert.eventEmitted(tx1, 'NewWhitt', (ev) => {
            return ev.fixedOwner.toString() === accounts[1].toString()
                && ev.lockedAmount.toString(10) === "1000000"
                && ev.lockedDuration.toString(10) === "1000"
                && ev.dealValue.toString(10) === "200000";
        });

        assert.equal(await wm.lockedTimestamp(), 0);
        let tx2 = await wm.floatEnter();
        truffleAssert.eventEmitted(tx2, 'FloatEnter', (ev) => {
            return ev.fixedOwner.toString() === accounts[1].toString()
                && ev.floatOwner.toString() === accounts[0].toString()
                && ev.lockedAmount.toString(10) === "1000000"
                && ev.dealValue.toString(10) === "200000";
        });
        assert.isTrue((await wm.lockedTimestamp()) > 0);

        await expectRevert(wm.floatEnter(), "Already a float guy");
        await expectRevert(wm.floatEnter({from: accounts[1]}), "Already a float guy");
    });

    it("is only possible for fixed guy to exit after lockup", async () => {
        let dai = await fakeERC20.deployed();
        let lp = await lendingPoolLike.deployed();
        let adai = await aTokenLike.deployed();

        let wm = await whittAaveMoney.new(dai.address, lp.address, adai.address, 1000000, 3, 200000, {from: accounts[1]});
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
});
*/