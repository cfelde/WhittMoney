pragma solidity ^0.5.0;

import "@openzeppelin/contracts/token/ERC721/ERC721Full.sol";
import "./IWhittRDaiMoneyToken.sol";

contract WhittRDaiMoneyToken is ERC721Full, IWhittRDaiMoneyToken {
    mapping(uint => address) private swapIdAddressMapping;
    mapping(address => bool) private factoryAddressStatusMapping;

    constructor(address _swapFactory) public ERC721Full("Whitt RDai Money - Float to Fixed", "Whitt:RDai:Float:Fixed") {
        require(_swapFactory != address(0), "Invalid swap factory");
        factoryAddressStatusMapping[_swapFactory] = true;
    }

    function setFactory(address _factoryAddress, bool _active) external {
        require(msg.sender != _factoryAddress, "Invalid self call");
        require(factoryAddressStatusMapping[msg.sender], "Not active factory");

        factoryAddressStatusMapping[_factoryAddress] = _active;
    }

    function swapIdAddress(uint _swapId) public view returns (address) {
        require(_swapId > 0 && swapIdAddressMapping[_swapId] != address(0), "Invalid swap id");
        return swapIdAddressMapping[_swapId];
    }

    function mint(address _owner, uint _swapId, address _swapAddress, bytes calldata _data) external {
        require(factoryAddressStatusMapping[msg.sender], "Not active factory");
        require(_swapId > 0 && swapIdAddressMapping[_swapId] == address(0), "Not correct swap");

        swapIdAddressMapping[_swapId] = _swapAddress;
        _safeMint(_owner, _swapId, _data);
    }

    function burn(address _owner, uint _swapId, address _swapAddress) external {
        require(factoryAddressStatusMapping[msg.sender], "Not active factory");
        require(_swapId > 0 && swapIdAddressMapping[_swapId] == _swapAddress, "Not correct swap");

        delete swapIdAddressMapping[_swapId];
        _burn(_owner, _swapId);
    }

    function exists(uint _swapId) public view returns (bool) {
        return _exists(_swapId);
    }
}