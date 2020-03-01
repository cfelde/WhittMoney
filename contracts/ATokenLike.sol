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

    constructor() public {}

    function redirectInterestStream(address _to) external {}

    function redirectInterestStreamOf(address _from, address _to) external {}

    function allowInterestRedirectionTo(address _to) external {}

    function redeem(uint256 _amount) external {}

    function mintOnDeposit(address _account, uint256 _amount) external {}

    function burnOnLiquidation(address _account, uint256 _value) external {}

    function transferOnLiquidation(address _from, address _to, uint256 _value) external {}

    function balanceOf(address _user) public view returns(uint256) {
        return 0;
    }

    function principalBalanceOf(address _user) external view returns(uint256) {
        return 0;
    }


    function totalSupply() public view returns(uint256) {
        return 0;
    }


    function isTransferAllowed(address _user, uint256 _amount) public view returns (bool) {
        return true;
    }

    function getUserIndex(address _user) external view returns(uint256) {
        return 0;
    }

    function getInterestRedirectionAddress(address _user) external view returns(address) {
        return address(0);
    }

    function getRedirectedBalance(address _user) external view returns(uint256) {
        return 0;
    }

    function transfer(address, uint256) external returns (bool) {
        return true;
    }

    function allowance(address, address) external view returns (uint256) {
        return 0;
    }

    function approve(address spender, uint256 amount) external returns (bool) {
        return true;
    }

    function transferFrom(address sender, address recipient, uint256 amount) external returns (bool) {
        return true;
    }
}
