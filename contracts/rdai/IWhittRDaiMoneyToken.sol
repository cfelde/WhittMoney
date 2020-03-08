pragma solidity ^0.5.0;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";

contract IWhittRDaiMoneyToken is IERC721 {
    function setFactory(address _factoryAddress, bool _active) external;

    function swapIdAddress(uint _swapId) public view returns (address);

    function mint(address _owner, uint _swapId, address _swapAddress, bytes calldata _data) external;

    function burn(address _owner, uint _swapId, address _swapAddress) external;

    function exists(uint _swapId) public view returns (bool);
}
