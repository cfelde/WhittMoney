pragma solidity ^0.5.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./RTokenLike.sol";

// Contract represents an interest rate swap between floating and fixed rates,
// using the whitt.money protocol. See https://whitt.money for more details.

// Contract created during the ETHLondon 2020 hackathon..

contract WhittMoney {
    IERC20 public dai;
    RTokenLike public rtoken;

    address public fixedOwner;
    address public floatOwner;

    uint public lockedAmount;
    uint public lockedDuration;
    uint public lockedTimestamp;
    uint public dealValue;

    // The contract is created by the person wanting the fixed interest payments.
    // They would call the constructor including the amount to lock up and for how long.
    // They also include the deal value, which is how much DAI they want to receive for
    // lending out the collateral.

    constructor(address _dai, address _rtoken, uint _lockedAmount, uint _lockedDuration, uint _dealValue) public {
        require(_dai != address(0), "Invalid dai");
        require(_rtoken != address(0), "Invalid rtoken");
        require(_lockedAmount > 0, "Zero locked amount");
        require(_dealValue > 0, "Zero deal value");

        dai = IERC20(_dai);
        rtoken = RTokenLike(_rtoken);
        fixedOwner = msg.sender;
        lockedAmount = _lockedAmount;
        lockedDuration = _lockedDuration;
        dealValue = _dealValue;

        address[] memory recipients = new address[](1);
        recipients[0] = msg.sender;

        uint32[] memory proportions = new uint32[](1);
        proportions[0] = uint32(1);

        dai.approve(_rtoken, uint(-1));
        require(dai.transferFrom(msg.sender, address(this), _lockedAmount), "Transfer failure");
        require(rtoken.mintWithNewHat(_lockedAmount, recipients, proportions), "RDai mint failure");

        emit NewWhitt(fixedOwner, lockedAmount, lockedDuration, dealValue);
    }

    modifier onlyFixedGuy() {
        require(fixedOwner == msg.sender, "Not fixed guy");
        _;
    }

    modifier noFloatGuy() {
        require(floatOwner == address(0), "Already a float guy");
        _;
    }

    // Until someone has locked in the deal the fixed side who also called the constructor
    // may exit the deal at any time by withdrawing the collateral. If the deal has been
    // locked, they may only withdraw the collateral after the lockup period.

    function fixedExit() external onlyFixedGuy {
        require(lockedTimestamp < now || fixedOwner == address(0), "Locked");
        require(lockedAmount > 0, "No value locked");

        uint _lockedAmount = lockedAmount;
        lockedAmount = 0;

        require(rtoken.redeemAndTransfer(msg.sender, _lockedAmount), "RDai redeem failure");

        emit FixedExit(fixedOwner, floatOwner, _lockedAmount, dealValue);
    }

    // Anyone can call the floatEnter assuming the deal is not already locked. When doing so
    // they must provide the deal value, which is transferred to the fixed owner. From that
    // point onwards they will receive the floating interest on the collateral. This remains
    // until the collateral is withdrawn after finishing the lockup period.

    function floatEnter() external noFloatGuy {
        require(lockedAmount > 0, "No value locked");
        require(dai.transferFrom(msg.sender, fixedOwner, dealValue), "Transfer failure");

        floatOwner = msg.sender;
        lockedTimestamp = now + lockedDuration;

        address[] memory recipients = new address[](1);
        recipients[0] = msg.sender;

        uint32[] memory proportions = new uint32[](1);
        proportions[0] = uint32(1);

        rtoken.createHat(recipients, proportions, true);

        emit FloatEnter(fixedOwner, floatOwner, lockedAmount, dealValue);
    }

    event NewWhitt(address indexed fixedOwner, uint lockedAmount, uint lockedDuration, uint dealValue);
    event FixedExit(address indexed fixedOwner, address indexed floatOwner, uint lockedAmount, uint dealValue);
    event FloatEnter(address indexed fixedOwner, address indexed floatOwner, uint lockedAmount, uint dealValue);
}