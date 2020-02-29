const {expectRevert, expectEvent} = require('@openzeppelin/test-helpers');

const fakeRToken = artifacts.require("FakeRToken");
const fakeERC20 = artifacts.require("FakeERC20");
const whittMoney = artifacts.require("WhittMoney");

contract("When testing MillionDai, it:", async accounts => {
    it("is possible to deploy and exit an unlocked swap", async () => {
        let dai = await fakeERC20.deployed();
        let rdai = await fakeRToken.deployed();

        let wm = await whittMoney.new(dai.address, rdai.address, 1000, 0, 10);

        assert.equal(await wm.lockedAmount(), 1000);
        await wm.fixedExit();
        assert.equal(await wm.lockedAmount(), 0);

        await expectRevert(wm.fixedExit(), "No value locked");
        await expectRevert(wm.floatEnter(), "No value locked");
    });

    it("is possible to deploy but not exit a locked swap", async () => {
        let dai = await fakeERC20.deployed();
        let rdai = await fakeRToken.deployed();

        let wm = await whittMoney.new(dai.address, rdai.address, 1000, 0, 10);

        assert.equal(await wm.lockedTimestamp(), 0);
        await wm.floatEnter();
        assert.isTrue((await wm.lockedTimestamp()) > 0);

        await expectRevert(wm.fixedExit(), "Locked");
    });
});
