// SPDX-License-Identifier: AGPL-3.0-only

pragma solidity 0.8.10;

import "@openzeppelin/contracts/access/Ownable.sol";
import {ILensHub} from '../interfaces/ILensHub.sol';
import {IERC721Time} from '../core/base/IERC721Time.sol';
import "hardhat/console.sol";


contract DeceCode is Ownable  {

  mapping(uint256 => uint256) internal _lensIdbyDececodeId;
  mapping(uint256 => uint256) internal _decodeIdbyLensId;
  mapping(address => mapping(uint256 => string)) internal _profileUribyLensId;
  mapping( address => bool) public allowed;

  address lenshubAddress;
  address decodeHubAddress;

constructor() { //address _lensHub, address _decodeHub){
  // lenshubAddress = _lensHub;
  // decodeHubAddress = _decodeHub;
}

  /**
    * @dev This modifier reverts if the caller is not a whitelisted profile creator address.
    */
    // modifier onlyOwnerOfProfile(uint256 _decodeId) {
    //    require(IERC721Time(decodeHub).balanceOf(msg.sender)>0 );
    //     _;
    // }

function isAllowed(address who) public view returns(bool){
  return allowed[who];
}

function revokeAllowed() public {
allowed[msg.sender] = false;
}

function setAllowed() public {
  allowed[msg.sender] = true;
}

function decode(bytes memory data) public view returns(uint256) {
   (uint256 profileId) = abi.decode(data, (uint256));
   console.log(profileId);
   return profileId;
}


// function setProfile(uint256 _dececodeId, uint256 _lensId, string memory profileUri) public onlyOwnerOfProfile({

//  _lensIdbyDececodeId[_dececodeId = _lensId;
//  _decodeIdbyLensId[_lensId] = _dececodeId;

// }


}