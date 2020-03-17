pragma solidity ^0.5.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./ATokenLike.sol";
import "./LendingPoolLike.sol";

// Contract represents an interest rate swap between floating and fixed rates,
// using the whitt.money protocol. See https://whitt.money for more details.

// Contract created during the ETHLondon 2020 hackathon..

// This contract is a proof of concept using Aave rather than rDAI.
// While WhittRDaiMoney has been deployed and tested on Kovan, WhittAaveMoney
// is missing a bit of setup and similar. It should however not be a big
// effort to complete this and thereby be able to enjoy aDAI on Whitt.
// You can run local tests on this contract, with tests in whittAaveMoney.js.

contract WhittAaveMoney {
    IERC20 public dai;
    LendingPoolLike public lendingPool;
    ATokenLike public atoken;

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

    constructor(address _dai, address _lendingPool, address _atoken, uint _lockedAmount, uint _lockedDuration, uint _dealValue) public {
        require(_dai != address(0), "Invalid dai");
        require(_lendingPool != address(0), "Invalid lending pool");
        require(_atoken != address(0), "Invalid atoken");
        require(_lockedAmount > 0, "Zero locked amount");
        require(_dealValue > 0, "Zero deal value");

        dai = IERC20(_dai);
        lendingPool = LendingPoolLike(_lendingPool);
        atoken = ATokenLike(_atoken);
        fixedOwner = msg.sender;
        lockedAmount = _lockedAmount;
        lockedDuration = _lockedDuration;
        dealValue = _dealValue;
    }

    modifier onlyFixedGuy() {
        require(fixedOwner == msg.sender, "Not fixed guy");
        _;
    }

    modifier noFloatGuy() {
        require(floatOwner == address(0), "Already a float guy");
        _;
    }

    function init() external onlyFixedGuy {
        dai.approve(address(atoken), uint(-1));
        require(dai.transferFrom(msg.sender, address(this), lockedAmount), "Transfer failure");
        lendingPool.deposit(address(atoken), lockedAmount, uint16(0));
        atoken.redirectInterestStream(msg.sender);

        emit NewWhitt(fixedOwner, lockedAmount, lockedDuration, dealValue);
    }

    // Until someone has locked in the deal the fixed side who also called the constructor
    // may exit the deal at any time by withdrawing the collateral. If the deal has been
    // locked, they may only withdraw the collateral after the lockup period.

    function fixedExit() external onlyFixedGuy {
        require(lockedTimestamp < now || floatOwner == address(0), "Locked");
        require(lockedAmount > 0, "No value locked");

        uint _lockedAmount = lockedAmount;
        lockedAmount = 0;

        payInterestInternal();
        atoken.redeem(_lockedAmount);
        dai.transfer(msg.sender, _lockedAmount);

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

        payInterestInternal();
        atoken.redirectInterestStream(msg.sender);

        emit FloatEnter(fixedOwner, floatOwner, lockedAmount, dealValue);
    }

    function payInterest() external {
        payInterestInternal();
    }

    function payInterestInternal() internal {
    }

    event NewWhitt(address indexed fixedOwner, uint lockedAmount, uint lockedDuration, uint dealValue);
    event FixedExit(address indexed fixedOwner, address indexed floatOwner, uint lockedAmount, uint dealValue);
    event FloatEnter(address indexed fixedOwner, address indexed floatOwner, uint lockedAmount, uint dealValue);
}