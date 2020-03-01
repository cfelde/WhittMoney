pragma solidity ^0.5.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract ATokenLike is IERC20 {
    event Redeem(
        address indexed _from,
        uint256 _value,
        uint256 _fromBalanceIncrease,
        uint256 _fromIndex
    );

    event MintOnDeposit(
        address indexed _from,
        uint256 _value,
        uint256 _fromBalanceIncrease,
        uint256 _fromIndex
    );

    event BurnOnLiquidation(
        address indexed _from,
        uint256 _value,
        uint256 _fromBalanceIncrease,
        uint256 _fromIndex
    );

    event BalanceTransfer(
        address indexed _from,
        address indexed _to,
        uint256 _value,
        uint256 _fromBalanceIncrease,
        uint256 _toBalanceIncrease,
        uint256 _fromIndex,
        uint256 _toIndex
    );

    event InterestStreamRedirected(
        address indexed _from,
        address indexed _to,
        uint256 _redirectedBalance,
        uint256 _fromBalanceIncrease,
        uint256 _fromIndex
    );

    event RedirectedBalanceUpdated(
        address indexed _targetAddress,
        uint256 _targetBalanceIncrease,
        uint256 _targetIndex,
        uint256 _redirectedBalanceAdded,
        uint256 _redirectedBalanceRemoved
    );

    event InterestRedirectionAllowanceChanged(
        address indexed _from,
        address indexed _to
    );

    uint private debug;
    address private debugAddress;

    constructor() public {}

    function redirectInterestStream(address) external {}

    function redirectInterestStreamOf(address, address) external {}

    function allowInterestRedirectionTo(address) external {}

    function redeem(uint256) external {}

    function mintOnDeposit(address, uint256) external {}

    function burnOnLiquidation(address, uint256) external {}

    function transferOnLiquidation(address, address, uint256) external {}

    function balanceOf(address) public view returns(uint256) {
        return debug;
    }

    function principalBalanceOf(address) external view returns(uint256) {
        return debug;
    }


    function totalSupply() public view returns(uint256) {
        return debug;
    }


    function isTransferAllowed(address, uint256) public view returns (bool) {
        return debug == 0;
    }

    function getUserIndex(address) external view returns(uint256) {
        return debug;
    }

    function getInterestRedirectionAddress(address) external view returns(address) {
        return debugAddress;
    }

    function getRedirectedBalance(address) external view returns(uint256) {
        return debug;
    }

    function transfer(address, uint256) external returns (bool) {
        return debug == 0;
    }

    function allowance(address, address) external view returns (uint256) {
        return debug;
    }

    function approve(address, uint256) external returns (bool) {
        return debug == 0;
    }

    function transferFrom(address, address, uint256) external returns (bool) {
        return debug == 0;
    }
}
