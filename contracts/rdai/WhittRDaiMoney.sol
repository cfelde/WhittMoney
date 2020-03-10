pragma solidity ^0.5.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./RTokenLike.sol";
import "./IWhittRDaiMoneyToken.sol";
import "./WhittRDaiSwapFactory.sol";

// Contract represents an interest rate swap between floating and fixed rates,
// using the whitt.money protocol. See https://whitt.money for more details.

contract WhittRDaiMoney {
    IWhittRDaiMoneyToken public whittToken;
    WhittRDaiSwapFactory public swapFactory;
    IERC20 public dai;
    RTokenLike public rtoken;

    uint public fixedSwapId;
    uint public floatSwapId;

    uint public lockedAmount;
    uint public lockedDuration;
    uint public lockedTimestamp;
    uint public dealValue;

    // The contract is created by the person wanting the fixed interest payments.
    // They would call the constructor including the amount to lock up and for how long.
    // They also include the deal value, which is how much DAI they want to receive for
    // lending out the collateral. Constructor must be called through the swap factory.

    constructor(address _whittToken, address _swapFactory, address _dai, address _rtoken, uint _lockedAmount, uint _lockedDuration, uint _dealValue) public {
        require(_whittToken != address(0), "Invalid whitt token");
        require(_swapFactory != address(0), "Invalid swap factory");
        require(_dai != address(0), "Invalid dai");
        require(_rtoken != address(0), "Invalid rtoken");
        require(_lockedAmount > 0, "Zero locked amount");
        require(_dealValue > 0, "Zero deal value");

        whittToken = IWhittRDaiMoneyToken(_whittToken);
        swapFactory = WhittRDaiSwapFactory(_swapFactory);
        dai = IERC20(_dai);
        rtoken = RTokenLike(_rtoken);

        lockedAmount = _lockedAmount;
        lockedDuration = _lockedDuration;
        dealValue = _dealValue;

        require(dai.approve(address(rtoken), uint(-1)), "No DAI approval");
    }

    function fixedEnter(uint _fixedSwapId, address _owner) external {
        require(address(swapFactory) == msg.sender, "Not swap factory");

        fixedSwapId = _fixedSwapId;

        address[] memory recipients = new address[](1);
        recipients[0] = _owner;

        uint32[] memory proportions = new uint32[](1);
        proportions[0] = uint32(1);

        require(rtoken.mintWithNewHat(lockedAmount, recipients, proportions), "RDai mint failure");
    }

    // Anyone can call, via the swap factory, the floatEnter assuming the deal is not already locked.
    // When doing so they must provide the deal value, which is transferred to the fixed owner.
    // From that point onwards they will receive the floating interest on the collateral.
    // This remains until the collateral is withdrawn after finishing the lockup period.

    function floatEnter(uint _swapId, uint _swapRef, uint _lockedAmount, uint _lockedDuration, uint _dealValue, address _floatReceiver) external {
        require(address(swapFactory) == msg.sender, "Not swap factory");
        require(floatSwapId == 0, "Already a float guy");

        require(lockedAmount > 0, "No value locked");
        require(_swapRef == fixedSwapId, "Invalid swap ref");
        require(_lockedAmount == lockedAmount, "Invalid locked amount");
        require(_lockedDuration == lockedDuration, "Invalid locked duration");
        require(_dealValue == dealValue, "Invalid deal value");

        lockedTimestamp = now + lockedDuration;

        payInterestInternal();

        floatSwapId = _swapId;

        updateFloatReceiverInternal(_floatReceiver);
    }

    function updateFloatReceiver(address _floatReceiver) external {
        require(floatSwapId > 0 && whittToken.isApprovedOrOwner(msg.sender, floatSwapId), "Not float guy");

        payInterestInternal();
        updateFloatReceiverInternal(_floatReceiver);

        swapFactory.emitFloatUpdate(fixedSwapId, lockedAmount, lockedDuration, dealValue);
    }

    function updateFloatReceiverInternal(address _floatReceiver) internal {
        address[] memory recipients = new address[](1);
        recipients[0] = _floatReceiver;

        uint32[] memory proportions = new uint32[](1);
        proportions[0] = uint32(1);

        rtoken.createHat(recipients, proportions, true);
    }

    // Until someone has locked in the deal the fixed side who also called the constructor
    // may exit the deal at any time by withdrawing the collateral. If the deal has been
    // locked, they may only withdraw the collateral after the lockup period.

    function fixedExit() external {
        require(fixedSwapId > 0 && whittToken.isApprovedOrOwner(msg.sender, fixedSwapId), "Not fixed guy");

        require(lockedTimestamp <= now || floatSwapId == 0, "Locked");
        require(lockedAmount > 0, "No value locked");

        uint _lockedAmount = lockedAmount;
        lockedAmount = 0;

        payInterestInternal();
        require(rtoken.redeemAndTransferAll(msg.sender), "RDai redeem failure");

        swapFactory.emitFixedExit(fixedSwapId, _lockedAmount, lockedDuration, dealValue);

        // Burn fixed side NFT
        whittToken.burn(whittToken.ownerOf(fixedSwapId), fixedSwapId, address(this));

        // Burn float side NFT if needed
        if (floatSwapId > 0) {
            whittToken.burn(whittToken.ownerOf(floatSwapId), floatSwapId, address(this));
        }

        // Contract no longer needed, self destruct..
        selfdestruct(msg.sender);
    }

    // The below functions are purely utility functions interacting with rtoken

    function payInterest() external {
        payInterestInternal();
    }

    function payInterestInternal() internal {
        address fixedOwner = whittToken.ownerOf(fixedSwapId);
        rtoken.payInterest(fixedOwner);

        if (floatSwapId == 0) {
            return;
        }

        address floatOwner = whittToken.ownerOf(floatSwapId);
        if (floatOwner != address(0)) {
            rtoken.payInterest(floatOwner);
        }
    }
}