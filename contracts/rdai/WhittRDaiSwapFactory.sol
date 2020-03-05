pragma solidity ^0.5.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./RTokenLike.sol";
import "./IWhittRDaiMoneyToken.sol";
import "./WhittRDaiMoney.sol";

contract WhittRDaiSwapFactory {
    address public admin;

    IERC20 public dai;
    RTokenLike public rtoken;
    IWhittRDaiMoneyToken public whittToken;

    uint public fixedEnterType = 1;
    uint public floatEnterType = 2;
    uint public fixedExitType = 3;
    uint public floatUpdateType = 4;

    constructor(address _dai, address _rtoken) public {
        require(_dai != address(0), "Invalid dai");
        require(_rtoken != address(0), "Invalid rtoken");

        admin = msg.sender;
        dai = IERC20(_dai);
        rtoken = RTokenLike(_rtoken);
    }

    function setWhittToken(address _whittToken) external {
        require(msg.sender == admin);
        whittToken = IWhittRDaiMoneyToken(_whittToken);
    }

    function setFactory(address _nextFactory, bool _active) external {
        require(msg.sender == admin);
        whittToken.setFactory(_nextFactory, _active);
    }

    function fixedEnter(uint _lockedAmount, uint _lockedDuration, uint _dealValue) external returns (uint swapId, address swapAddress) {
        WhittRDaiMoney swap = new WhittRDaiMoney(address(whittToken), address(this), address(dai), address(rtoken), _lockedAmount, _lockedDuration, _dealValue);
        swapAddress = address(swap);
        swapId = uint(keccak256(abi.encode(swapAddress, now))) | (uint(1) * 2 ** 255);

        // Transfer collateral from initiator to contract, then enter fixed side
        require(dai.transferFrom(msg.sender, swapAddress, _lockedAmount), "Transfer failure");

        swap.fixedEnter(msg.sender, swapId);

        whittToken.mint(msg.sender, swapId, swapAddress, "");

        emit Swap(fixedEnterType, swapId, msg.sender, _lockedAmount, _lockedDuration, _dealValue);
    }

    function floatEnter(uint _fixedSwapId, uint _lockedAmount, uint _lockedDuration, uint _dealValue) external returns (uint floatSwapId, address swapAddress) {
        require(_fixedSwapId > 0, "Invalid swap reference");

        floatSwapId = _fixedSwapId ^ uint(-1);
        require(floatSwapId > 0, "Invalid swap id");

        swapAddress = whittToken.swapIdAddress(_fixedSwapId);

        // Transfer fixed deal value to owner of collateral, then enter float side
        require(dai.transferFrom(msg.sender, whittToken.ownerOf(_fixedSwapId), _dealValue), "Transfer failure");

        WhittRDaiMoney(swapAddress).floatEnter(msg.sender, floatSwapId, _fixedSwapId, _lockedAmount, _lockedDuration, _dealValue);

        whittToken.mint(msg.sender, floatSwapId, swapAddress, "");

        emit Swap(floatEnterType, _fixedSwapId, msg.sender, _lockedAmount, _lockedDuration, _dealValue);
    }

    function emitFixedExit(uint _fixedSwapId, uint _lockedAmount, uint _lockedDuration, uint _dealValue) external {
        require(whittToken.swapIdAddress(_fixedSwapId) == msg.sender, "Not swap contract");

        emit Swap(fixedExitType, _fixedSwapId, whittToken.ownerOf(_fixedSwapId), _lockedAmount, _lockedDuration, _dealValue);
    }

    function emitFloatUpdate(uint _fixedSwapId, uint _lockedAmount, uint _lockedDuration, uint _dealValue) external {
        require(whittToken.swapIdAddress(_fixedSwapId ^ uint(-1)) == msg.sender, "Not swap contract");

        emit Swap(floatUpdateType, _fixedSwapId, whittToken.ownerOf(_fixedSwapId ^ uint(-1)), _lockedAmount, _lockedDuration, _dealValue);
    }

    event Swap(uint eventType, uint indexed fixedSwapId, address indexed actor, uint lockedAmount, uint lockedDuration, uint dealValue);
}
