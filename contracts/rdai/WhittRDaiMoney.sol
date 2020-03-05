pragma solidity ^0.5.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./RTokenLike.sol";
import "./IWhittRDaiMoneyToken.sol";
import "./WhittRDaiSwapFactory.sol";

// Contract represents an interest rate swap between floating and fixed rates,
// using the whitt.money protocol. See https://whitt.money for more details.

// Contract created during the ETHLondon 2020 hackathon..

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
    // lending out the collateral.

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

        dai.approve(address(rtoken), uint(-1));
    }

    function fixedEnter(address _owner, uint _fixedSwapId) external {
        require(address(swapFactory) == msg.sender, "Not swap factory");

        address[] memory recipients = new address[](1);
        recipients[0] = _owner;

        uint32[] memory proportions = new uint32[](1);
        proportions[0] = uint32(1);

        require(rtoken.mintWithNewHat(lockedAmount, recipients, proportions), "RDai mint failure");

        fixedSwapId = _fixedSwapId;
    }

    // Anyone can call, via the factory, the floatEnter assuming the deal is not already locked.
    // When doing so they must provide the deal value, which is transferred to the fixed owner.
    // From that point onwards they will receive the floating interest on the collateral.
    // This remains until the collateral is withdrawn after finishing the lockup period.

    function floatEnter(address _owner, uint _swapId, uint _swapRef, uint _lockedAmount, uint _lockedDuration, uint _dealValue) external {
        require(address(swapFactory) == msg.sender, "Not swap factory");
        require(floatSwapId == 0, "Already a float guy");

        require(lockedAmount > 0, "No value locked");
        require(_swapRef == fixedSwapId, "Invalid swap ref");
        require(_lockedAmount == lockedAmount, "Invalid locked amount");
        require(_lockedDuration == lockedDuration, "Invalid locked duration");
        require(_dealValue == dealValue, "Invalid deal value");

        lockedTimestamp = now + lockedDuration;

        payInterestInternal();

        address[] memory recipients = new address[](1);
        recipients[0] = _owner;

        uint32[] memory proportions = new uint32[](1);
        proportions[0] = uint32(1);

        floatSwapId = _swapId;

        rtoken.createHat(recipients, proportions, true);
    }

    function updateFloatReceiver() external {
        require(whittToken.ownerOf(floatSwapId) == msg.sender, "Not float guy");

        address[] memory recipients = new address[](1);
        recipients[0] = msg.sender;

        uint32[] memory proportions = new uint32[](1);
        proportions[0] = uint32(1);

        payInterestInternal();
        rtoken.createHat(recipients, proportions, true);

        swapFactory.emitFloatUpdate(fixedSwapId, lockedAmount, lockedDuration, dealValue);
    }

    // Until someone has locked in the deal the fixed side who also called the constructor
    // may exit the deal at any time by withdrawing the collateral. If the deal has been
    // locked, they may only withdraw the collateral after the lockup period.

    function fixedExit() external {
        require(whittToken.ownerOf(fixedSwapId) == msg.sender, "Not fixed guy");

        require(lockedTimestamp < now || floatSwapId == 0, "Locked");
        require(lockedAmount > 0, "No value locked");

        uint _lockedAmount = lockedAmount;
        lockedAmount = 0;

        payInterestInternal();
        require(rtoken.redeemAndTransferAll(msg.sender), "RDai redeem failure");

        swapFactory.emitFixedExit(fixedSwapId, _lockedAmount, lockedDuration, dealValue);

        // We could burn and self destruct here if we want, but because there's maybe two sides
        // it might be nice for the other side to still have a reference available.
    }

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