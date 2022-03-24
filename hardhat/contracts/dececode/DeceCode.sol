// SPDX-License-Identifier: AGPL-3.0-only
import "@openzeppelin/contracts/access/Ownable.sol";
import {ILensHub} from '../interfaces/ILensHub.sol';
import {IERC721Time} from '../core/base/IERC721Time.sol';
pragma solidity 0.8.10;

contract DeceCode is Ownable,  {

  mapping(uint256 => uint256) internal _lensIdbyDececodeId;
  mapping(uint256 => uint256) internal _decodeIdbyLensId;
  mapping(address => mapping(uint256 => string)) internal _profileUribyLensId;

address lenshub;
address decodeHub;

constructor(address _lensHub, address _decodeHub){
  lensHub = _lensHub;
  decodeHub = _decodeHub;
}

  /**
    * @dev This modifier reverts if the caller is not a whitelisted profile creator address.
    */
    modifier onlyOwnerOfProfile(uint256 _decodeId) {
       require(IERC721Time(decodeHub).balanceOf(msg.sender)>0 )
        _;
    }

setProfile(uint256 _dececodeId, uint256 _lensId, string memory profileUri) public onlyOwnerOfProfile({

 _lensIdbyDececodeId[_dececodeId = _lensId;
 _decodeIdbyLensId[_lensId] = _dececodeId;

}


}