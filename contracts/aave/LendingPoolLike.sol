pragma solidity ^0.5.0;

contract LendingPoolLike {
    event Deposit(
        address indexed _reserve,
        address indexed _user,
        uint256 _amount,
        uint16 indexed _referral,
        uint256 _timestamp
    );

    event RedeemUnderlying(
        address indexed _reserve,
        address indexed _user,
        uint256 _amount,
        uint256 _timestamp
    );

    event Borrow(
        address indexed _reserve,
        address indexed _user,
        uint256 _amount,
        uint256 _borrowRateMode,
        uint256 _borrowRate,
        uint256 _originationFee,
        uint256 _borrowBalanceIncrease,
        uint16 indexed _referral,
        uint256 _timestamp
    );

    event Repay(
        address indexed _reserve,
        address indexed _user,
        address indexed _repayer,
        uint256 _amountMinusFees,
        uint256 _fees,
        uint256 _borrowBalanceIncrease,
        uint256 _timestamp
    );

    event Swap(
        address indexed _reserve,
        address indexed _user,
        uint256 _newRateMode,
        uint256 _newRate,
        uint256 _borrowBalanceIncrease,
        uint256 _timestamp
    );

    event ReserveUsedAsCollateralEnabled(address indexed _reserve, address indexed _user);

    event ReserveUsedAsCollateralDisabled(address indexed _reserve, address indexed _user);

    event RebalanceStableBorrowRate(
        address indexed _reserve,
        address indexed _user,
        uint256 _newStableRate,
        uint256 _borrowBalanceIncrease,
        uint256 _timestamp
    );

    event FlashLoan(
        address indexed _target,
        address indexed _reserve,
        uint256 _amount,
        uint256 _totalFee,
        uint256 _protocolFee,
        uint256 _timestamp
    );

    event OriginationFeeLiquidated(
        address indexed _collateral,
        address indexed _reserve,
        address indexed _user,
        uint256 _feeLiquidated,
        uint256 _liquidatedCollateralForFee,
        uint256 _timestamp
    );

    event LiquidationCall(
        address indexed _collateral,
        address indexed _reserve,
        address indexed _user,
        uint256 _purchaseAmount,
        uint256 _liquidatedCollateralAmount,
        uint256 _accruedBorrowInterest,
        address _liquidator,
        bool _receiveAToken,
        uint256 _timestamp
    );

    function deposit(address, uint256, uint16)
    external
    payable
    {}

    function redeemUnderlying(
        address,
        address payable,
        uint256,
        uint256
    )
    external
    {}

    function borrow(
        address,
        uint256,
        uint256,
        uint16
    )
    external
    {}

    function repay(address, uint256, address payable)
    external
    payable
    {}

    function swapBorrowRateMode(address)
    external
    {}

    function rebalanceStableBorrowRate(address, address)
    external
    {}

    function setUserUseReserveAsCollateral(address, bool)
    external
    {}

    function liquidationCall(
        address,
        address,
        address,
        uint256,
        bool
    ) external payable {}

    function flashLoan(address, address, uint256, bytes memory)
    public
    {}
}
