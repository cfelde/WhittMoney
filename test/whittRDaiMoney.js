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

        // Test direct WM access not allowed on fixedEnter and floatEnter
        await expectRevert(wm.fixedEnter(fixedSwapId, accounts[0]), "Not swap factory");
        await expectRevert(wm.floatEnter(floatSwapId, fixedSwapId, 1000, 0, 10, accounts[0]), "Not swap factory");

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

        assert.notEqual(await web3.eth.getCode(whittRDaiMoneyAddress), "0x");

        let tx2 = await wm.fixedExit();
        assert.isTrue(tx2.receipt.rawLogs.map(x => x.address).includes(swapFactoryInstance.address));
        assert.isTrue(tx2.receipt.rawLogs.map(x => x.topics[0]).includes(web3.utils.keccak256("Swap(uint256,uint256,address,uint256,uint256,uint256)")));
        assert.equal(await web3.eth.getCode(whittRDaiMoneyAddress), "0x");

        assert.isFalse(await whittTokenInstance.exists(fixedSwapId));

        await expectRevert(whittTokenInstance.swapIdAddress(fixedSwapId), "Invalid swap id");
        await expectRevert(swapFactoryInstance.floatEnter(fixedSwapId, 1000, 0, 10), "Invalid swap id");
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
        let whittRDaiMoneyAddress = await whittTokenInstance.swapIdAddress(fixedSwapId);
        let wm = await whittRDaiMoney.at(whittRDaiMoneyAddress);

        await swapFactoryInstance.floatEnter(fixedSwapId, 1000, 5, 10, {from: accounts[1]});
        let floatSwapId = await swapFactoryInstance.calcOtherSideId(fixedSwapId);

        await sleep(2000);
        await expectRevert(wm.fixedExit(), "Locked");
        assert.equal(await wm.lockedAmount(), 1000);

        await sleep(1000);
        await expectRevert(wm.fixedExit(), "Locked");
        assert.equal(await wm.lockedAmount(), 1000);

        await sleep(3000);

        assert.notEqual(await web3.eth.getCode(whittRDaiMoneyAddress), "0x");
        assert.isTrue(await whittTokenInstance.exists(fixedSwapId));
        assert.isTrue(await whittTokenInstance.exists(floatSwapId));

        await wm.fixedExit();

        assert.equal(await web3.eth.getCode(whittRDaiMoneyAddress), "0x");
        assert.isFalse(await whittTokenInstance.exists(fixedSwapId));
        assert.isFalse(await whittTokenInstance.exists(floatSwapId));
        await expectRevert(whittTokenInstance.swapIdAddress(fixedSwapId), "Invalid swap id");
        await expectRevert(whittTokenInstance.swapIdAddress(floatSwapId), "Invalid swap id");
    });

    it("is not possible to enter a float side with mismatching values", async () => {
        let whittTokenInstance = await whittToken.deployed();
        let swapFactoryInstance = await swapFactory.deployed();

        let tx1 = await swapFactoryInstance.fixedEnter(1000, 5, 10);
        let fixedSwapId = tx1.logs[0].args.fixedSwapId;
        let whittRDaiMoneyAddress1 = await whittTokenInstance.swapIdAddress(fixedSwapId);
        let wm = await whittRDaiMoney.at(whittRDaiMoneyAddress1);

        await expectRevert(swapFactoryInstance.floatEnter(fixedSwapId.add(web3.utils.toBN(1)), 1000, 5, 10, {from: accounts[1]}), "Invalid swap id");
        await expectRevert(swapFactoryInstance.floatEnter(fixedSwapId, 1001, 5, 10, {from: accounts[1]}), "Invalid locked amount");
        await expectRevert(swapFactoryInstance.floatEnter(fixedSwapId, 1000, 6, 10, {from: accounts[1]}), "Invalid locked duration");
        await expectRevert(swapFactoryInstance.floatEnter(fixedSwapId, 1000, 5, 11, {from: accounts[1]}), "Invalid deal value");

        assert.equal((await wm.fixedSwapId()).toString(10), fixedSwapId.toString(10));
        assert.equal((await wm.floatSwapId()).toString(10), 0);
        assert.equal(await wm.lockedAmount(), 1000);
        assert.equal(await wm.lockedDuration(), 5);
        assert.equal(await wm.lockedTimestamp(), 0);
        assert.equal(await wm.dealValue(), 10);

        await expectRevert(swapFactoryInstance.floatEnter(fixedSwapId.add(web3.utils.toBN(1)), 1000, 5, 10), "Invalid swap id");
        await expectRevert(swapFactoryInstance.floatEnter(fixedSwapId, 1001, 5, 10), "Invalid locked amount");
        await expectRevert(swapFactoryInstance.floatEnter(fixedSwapId, 1000, 6, 10), "Invalid locked duration");
        await expectRevert(swapFactoryInstance.floatEnter(fixedSwapId, 1000, 5, 11), "Invalid deal value");

        assert.equal((await wm.fixedSwapId()).toString(10), fixedSwapId.toString(10));
        assert.equal((await wm.floatSwapId()).toString(10), 0);
        assert.equal(await wm.lockedAmount(), 1000);
        assert.equal(await wm.lockedDuration(), 5);
        assert.equal(await wm.lockedTimestamp(), 0);
        assert.equal(await wm.dealValue(), 10);

        await swapFactoryInstance.floatEnter(fixedSwapId, 1000, 5, 10, {from: accounts[2]});

        assert.isTrue(await wm.lockedTimestamp() > Math.round(new Date().getTime() / 1000));

        let floatSwapId = await swapFactoryInstance.calcOtherSideId(fixedSwapId);

        assert.isTrue(await whittTokenInstance.exists(floatSwapId));
        assert.equal(await whittTokenInstance.ownerOf(floatSwapId), accounts[2]);
    });

    it("triggers the right actions in dai and rtoken", async () => {
        let rtokenInstance = await fakeRToken.deployed();
        let daiInstance = await fakeERC20.deployed();
        let whittTokenInstance = await whittToken.deployed();
        let swapFactoryInstance = await swapFactory.deployed();

        let tx1 = await swapFactoryInstance.fixedEnter(3000, 3, 30, {from: accounts[3]});
        let fixedSwapId = tx1.logs[0].args.fixedSwapId;
        let swapAddress = await whittTokenInstance.swapIdAddress(fixedSwapId);

        assert.equal(await daiInstance.approveSpender(), rtokenInstance.address);
        assert.equal((await daiInstance.approveAmount()).toString(16), "ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff");

        assert.equal(await daiInstance.transferFromSender(), accounts[3]);
        assert.equal(await daiInstance.transferFromRecipient(), swapAddress);
        assert.equal(await daiInstance.transferFromAmount(), 3000);

        assert.equal(await rtokenInstance.mintWithNewHatAmount(), 3000);
        assert.equal(await rtokenInstance.mintWithNewHatRecipients(0), accounts[3]);
        assert.equal(await rtokenInstance.mintWithNewHatProportions(0), 1);
        await expectRevert(rtokenInstance.mintWithNewHatRecipients(1), "invalid opcode");
        await expectRevert(rtokenInstance.mintWithNewHatProportions(1), "invalid opcode");

        await swapFactoryInstance.floatEnter(fixedSwapId, 3000, 3, 30, {from: accounts[2]});

        assert.equal(await daiInstance.transferFromSender(), accounts[2]);
        assert.equal(await daiInstance.transferFromRecipient(), accounts[3]);
        assert.equal(await daiInstance.transferFromAmount(), 30);

        assert.equal(await rtokenInstance.createHatRecipients(0), accounts[2]);
        assert.equal(await rtokenInstance.createHatProportions(0), 1);
        await expectRevert(rtokenInstance.createHatRecipients(1), "invalid opcode");
        await expectRevert(rtokenInstance.createHatProportions(1), "invalid opcode");
        assert.isTrue(await rtokenInstance.createHatDoChangeHat());

        let existingValue = await rtokenInstance.redeemAndTransferAllRedeemTo();
        assert.notEqual(existingValue, accounts[3]);

        let wm = await whittRDaiMoney.at(swapAddress);
        await expectRevert(wm.fixedExit({from: accounts[3]}), "Locked");

        assert.equal(await rtokenInstance.redeemAndTransferAllRedeemTo(), existingValue);

        await sleep(3000);

        await wm.fixedExit({from: accounts[3]});

        assert.equal(await rtokenInstance.redeemAndTransferAllRedeemTo(), accounts[3]);
    });

    it("is possible to pay interest, only one side", async () => {
        let rtokenInstance = await fakeRToken.deployed();
        let swapFactoryInstance = await swapFactory.deployed();
        let whittTokenInstance = await whittToken.deployed();

        let tx1 = await swapFactoryInstance.fixedEnter(3000, 3, 30, {from: accounts[3]});
        let fixedSwapId = tx1.logs[0].args.fixedSwapId;
        let swapAddress = await whittTokenInstance.swapIdAddress(fixedSwapId);
        let wm = await whittRDaiMoney.at(swapAddress);

        let existingValue = await rtokenInstance.payInterestRecipient1();
        assert.notEqual(existingValue, accounts[3]);

        await wm.fixedExit({from: accounts[3]});

        assert.equal(await rtokenInstance.payInterestRecipient1(), accounts[3]);
        assert.equal(await rtokenInstance.payInterestRecipient2(), existingValue);
    });

    it("is possible to pay interest, both sides", async () => {
        let rtokenInstance = await fakeRToken.deployed();
        let swapFactoryInstance = await swapFactory.deployed();
        let whittTokenInstance = await whittToken.deployed();

        let tx1 = await swapFactoryInstance.fixedEnter(1, 0, 1, {from: accounts[5]});
        let fixedSwapId = tx1.logs[0].args.fixedSwapId;
        let swapAddress = await whittTokenInstance.swapIdAddress(fixedSwapId);
        let wm = await whittRDaiMoney.at(swapAddress);

        await swapFactoryInstance.floatEnter(fixedSwapId, 1, 0, 1, {from: accounts[4]});

        assert.equal(await rtokenInstance.payInterestRecipient1(), accounts[5]);
        assert.equal(await rtokenInstance.payInterestRecipient2(), accounts[3]); // From previous test

        await wm.fixedExit({from: accounts[5]});

        assert.equal(await rtokenInstance.payInterestRecipient1(), accounts[4]);
        assert.equal(await rtokenInstance.payInterestRecipient2(), accounts[5]);
    });

    it("is possible to update float receiver", async () => {
        let rtokenInstance = await fakeRToken.deployed();
        let swapFactoryInstance = await swapFactory.deployed();
        let whittTokenInstance = await whittToken.deployed();

        let tx1 = await swapFactoryInstance.fixedEnter(1, 0, 1, {from: accounts[1]});
        let fixedSwapId = tx1.logs[0].args.fixedSwapId;
        let swapAddress = await whittTokenInstance.swapIdAddress(fixedSwapId);
        let wm = await whittRDaiMoney.at(swapAddress);

        await swapFactoryInstance.floatEnter(fixedSwapId, 1, 0, 1, {from: accounts[4]});

        await expectRevert(wm.updateFloatReceiver(accounts[6]), "Not float guy");

        let tx2 = await wm.updateFloatReceiver(accounts[6], {from: accounts[4]});
        assert.isTrue(tx2.receipt.rawLogs.map(x => x.address).includes(swapFactoryInstance.address));
        assert.isTrue(tx2.receipt.rawLogs.map(x => x.topics[0]).includes(web3.utils.keccak256("Swap(uint256,uint256,address,uint256,uint256,uint256)")));

        assert.equal(await rtokenInstance.createHatRecipients(0), accounts[6]);
        assert.equal(await rtokenInstance.createHatProportions(0), 1);
        await expectRevert(rtokenInstance.createHatRecipients(1), "invalid opcode");
        await expectRevert(rtokenInstance.createHatProportions(1), "invalid opcode");
        assert.isTrue(await rtokenInstance.createHatDoChangeHat());

        await wm.fixedExit({from: accounts[1]});

        assert.equal(await rtokenInstance.payInterestRecipient1(), accounts[6]);
        assert.equal(await rtokenInstance.payInterestRecipient2(), accounts[1]);
    });

    // TODO it("is possible to change swap leg owners", async () => {});

    // TODO it("is possible to change swap leg spenders", async () => {});
});
