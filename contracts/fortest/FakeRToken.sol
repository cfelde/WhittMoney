pragma solidity ^0.5.0;

import "../rdai/RTokenLike.sol";

contract FakeRToken is RTokenLike {
    uint256 public mintWithNewHatAmount;
    address[] public mintWithNewHatRecipients;
    uint32[] public mintWithNewHatProportions;

    address public redeemAndTransferAllRedeemTo;

    address[] public createHatRecipients;
    uint32[] public createHatProportions;
    bool public createHatDoChangeHat;

    address public payInterestRecipient1;
    address public payInterestRecipient2;

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

    function approve(address, uint256) external returns (bool) {
        return true;
    }

    function transferFrom(address, address, uint256) external returns (bool) {
        return true;
    }

    function mint(uint256) external returns (bool) {
        return true;
    }

    function mintWithSelectedHat(uint256, uint256) external returns (bool) {
        return true;
    }

    function mintWithNewHat(
        uint256 amount,
        address[] calldata recipients,
        uint32[] calldata proportions
    ) external returns (bool) {
        mintWithNewHatAmount = amount;
        mintWithNewHatRecipients = recipients;
        mintWithNewHatProportions = proportions;
        return true;
    }

    function transferAll(address) external returns (bool) {
        return true;
    }

    function transferAllFrom(address, address) external returns (bool) {
        return true;
    }

    function redeem(uint256) external returns (bool) {
        return true;
    }

    function redeemAll() external returns (bool) {
        return true;
    }

    function redeemAndTransfer(address, uint256) external returns (bool) {
        return true;
    }

    function redeemAndTransferAll(address redeemTo) external returns (bool) {
        redeemAndTransferAllRedeemTo = redeemTo;
        return true;
    }

    function createHat(
        address[] calldata recipients,
        uint32[] calldata proportions,
        bool doChangeHat
    ) external returns (uint256) {
        createHatRecipients = recipients;
        createHatProportions = proportions;
        createHatDoChangeHat = doChangeHat;
        return 0;
    }

    function changeHat(uint256) external returns (bool) {
        return true;
    }

    function payInterest(address recipient) external returns (bool) {
        payInterestRecipient2 = payInterestRecipient1;
        payInterestRecipient1 = recipient;
        return true;
    }

    function getMaximumHatID() external view returns (uint256) {
        return 0;
    }

    function getHatByAddress(address)
    external
    view
    returns (
        uint256 hatID,
        address[] memory recipients,
        uint32[] memory proportions
    ) {
        hatID = 0;
        recipients = new address[](0);
        proportions = new uint32[](0);
    }

    function getHatByID(uint256)
    external
    view
    returns (address[] memory recipients, uint32[] memory proportions) {
        recipients = new address[](0);
        proportions = new uint32[](0);
    }

    function receivedSavingsOf(address)
    external
    view
    returns (uint256) {
        return 0;
    }

    function receivedLoanOf(address)
    external
    view
    returns (uint256) {
        return 0;
    }

    function interestPayableOf(address)
    external
    view
    returns (uint256) {
        return 0;
    }
}