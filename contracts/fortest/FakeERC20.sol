pragma solidity ^0.5.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract FakeERC20 is IERC20 {
    address public approveSpender;
    uint256 public approveAmount;

    address public transferFromSender;
    address public transferFromRecipient;
    uint public transferFromAmount;

    uint8 public decimals = 18;

    constructor() public {}

    function totalSupply() external view returns (uint256) {
        return 0;
    }

    function balanceOf(address) external view returns (uint256) {
        return 0;
    }

    function transfer(address, uint256) external returns (bool) {
        return true;
    }

    function allowance(address, address) external view returns (uint256) {
        return 0;
    }

    function approve(address spender, uint256 amount) external returns (bool) {
        approveSpender = spender;
        approveAmount = amount;
        return true;
    }

    function transferFrom(address sender, address recipient, uint256 amount) external returns (bool) {
        transferFromSender = sender;
        transferFromRecipient = recipient;
        transferFromAmount = amount;
        return true;
    }
}