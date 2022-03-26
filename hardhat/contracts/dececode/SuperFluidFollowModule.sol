//SPDX-License-Identifier: Unlicense
pragma solidity >=0.8.4 <=0.9.10;

import {ISuperfluid, ISuperAgreement, ISuperToken, ISuperApp, SuperAppDefinitions} from "@superfluid-finance/ethereum-contracts/contracts/interfaces/superfluid/ISuperfluid.sol";
import {IConstantFlowAgreementV1} from "@superfluid-finance/ethereum-contracts/contracts/interfaces/agreements/IConstantFlowAgreementV1.sol";
import {SuperAppBase} from "@superfluid-finance/ethereum-contracts/contracts/apps/SuperAppBase.sol";
import {IFollowModule} from "../interfaces/IFollowModule.sol";
import {Errors} from "../libraries/Errors.sol";
import {Events} from "../libraries/Events.sol";
import {ModuleBase} from "../core/modules/ModuleBase.sol";
import {FollowValidatorFollowModuleBase} from "../core/modules/follow/FollowValidatorFollowModuleBase.sol";
import {IERC721} from "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import {SubscriptionBaseFollowModule} from "./SubscriptionBaseFollow.sol";

contract SuperFluidFollowModule is SuperAppBase, SubscriptionBaseFollowModule {
  ISuperfluid private _host; // host
  IConstantFlowAgreementV1 private _cfa; // the stored constant flow agreement class address

  ISuperToken public _acceptedToken; // accepted token

  event FlowUpdated(uint256 profileId);
  event ProfileAddress(address profileOwner);
  address profileOwner = 0xe09E488A6E1B8237b63e028218CCf72a2a398CB1;
  address ownerMock = 0x8A781c02D31E4CCF0dFA9F67106fc81DFC9Ea512;

  constructor(
    ISuperfluid host,
    IConstantFlowAgreementV1 cfa,
    ISuperToken acceptedToken,
    address hub,
    address moduleGlobals
  ) SubscriptionBaseFollowModule(hub, moduleGlobals) {
    require(address(host) != address(0), "host is zero address");
    require(address(cfa) != address(0), "cfa is zero address");
    require(
      address(acceptedToken) != address(0),
      "acceptedToken is zero address"
    );
    _host = host;
    _cfa = cfa;
    _acceptedToken = acceptedToken;

    uint256 configWord = SuperAppDefinitions.APP_LEVEL_FINAL |
      SuperAppDefinitions.BEFORE_AGREEMENT_CREATED_NOOP |
      SuperAppDefinitions.BEFORE_AGREEMENT_UPDATED_NOOP |
      SuperAppDefinitions.BEFORE_AGREEMENT_TERMINATED_NOOP;

    _host.registerApp(configWord);
  }

  /**************************************************************************
   * SuperApp callbacks
   *************************************************************************/

  function afterAgreementCreated(
    ISuperToken _superToken,
    address _agreementClass,
    bytes32, // _agreementId,
    bytes calldata _agreementData,
    bytes calldata, // _cbdata,
    bytes calldata _ctx
  ) external override onlyHost returns (bytes memory newCtx) {
    ISuperfluid.Context memory decodedContext = _host.decodeCtx(_ctx);
    uint256 profileId = abi.decode(decodedContext.userData, (uint256));
    // (uint256 profileId) = parseFollowerStream(decodedContext.userData);
    emit FlowUpdated(profileId);
    (address follower, ) = abi.decode(_agreementData, (address, address));
    emit ProfileAddress(ownerMock);
    emit ProfileAddress(follower);
    _approvedByProfilebySubscription[ownerMock][4][follower] = true;
    return _ctx;
    // return _updateOutflow(_ctx, _agreementData);     onlyExpected(_superToken, _agreementClass)
  }

    function afterAgreementTerminated(
    ISuperToken, /*superToken*/
    address, /*agreementClass*/
    bytes32, // _agreementId,
    bytes calldata _agreementData,
    bytes calldata, /*cbdata*/
    bytes calldata _ctx
  ) external virtual override returns (bytes memory newCtx) {
    
     ISuperfluid.Context memory decodedContext = _host.decodeCtx(_ctx);
    uint256 profileId = abi.decode(decodedContext.userData, (uint256));
    emit FlowUpdated(profileId);
     address owner = IERC721(HUB).ownerOf(profileId);
    (address follower, ) = abi.decode(_agreementData, (address, address));
    emit ProfileAddress(owner);
    emit ProfileAddress(ownerMock);
    emit ProfileAddress(follower);
    _approvedByProfilebySubscription[ownerMock][4][follower] = false;
    return _ctx;
 
  }


  function afterAgreementUpdated(
    ISuperToken _superToken,
    address _agreementClass,
    bytes32, // _agreementId,
    bytes calldata _agreementData,
    bytes calldata, //_cbdata,
    bytes calldata _ctx
  )
    external
    override
    onlyExpected(_superToken, _agreementClass)
    onlyHost
    returns (bytes memory newCtx)
  {
    return _updateOutflow(_ctx, _agreementData);
  }

  function parseFollowerStream(bytes memory data)
    internal
    pure
    returns (uint256)
  {
    uint256 profileId = abi.decode(data, (uint256));
  }

  /// @dev If a new stream is opened, or an existing one is opened
  function _updateOutflow(bytes calldata ctx, bytes calldata _agreementData)
    private
    returns (bytes memory newCtx)
  {
    newCtx = ctx; //update the context with the same logic...
    ISuperfluid.Context memory decodedContext = _host.decodeCtx(ctx);
    uint256 profileId = parseFollowerStream(decodedContext.userData);

    emit FlowUpdated(profileId);
    (address follower, ) = abi.decode(_agreementData, (address, address));
    //  address profileOwner = IERC721(HUB).ownerOf(profileId);

    emit ProfileAddress(profileOwner);
    // address treasury = "";

    require(address(profileOwner) != address(0), "Recipient is not registered");
    require(!_host.isApp(ISuperApp(profileOwner)), "Recipient is an app!");

    // (, int96 inFlowRate, , ) = _cfa.getFlow(
    //   _acceptedToken,
    //   follower,
    //   address(this)
    // ); // CHECK: unclear what happens if flow doesn't exist.

    // (, int96 outFlowRate, , ) = _cfa.getFlow(
    //   _acceptedToken,
    //   address(this),
    //   profileOwner
    // );

    // CHECK: unclear what happens if flow doesn't exist.

    // @dev If inFlowRate === 0, then delete existing flow.
    // if (inFlowRate == int96(0)) {
    //   // @dev if inFlowRate is zero, delete outflow.
    //   (newCtx, ) = _host.callAgreementWithContext(
    //     _cfa,
    //     abi.encodeWithSelector(
    //       _cfa.deleteFlow.selector,
    //       _acceptedToken,
    //       address(this),
    //       profileOwner,
    //       new bytes(0) // placeholder
    //     ),
    //     "0x",
    //     newCtx
    //   );
    //   _cancelSubscription(profileId,follower);

    // } else if (outFlowRate != int96(0)) {
    //   (newCtx, ) = _host.callAgreementWithContext(
    //     _cfa,
    //     abi.encodeWithSelector(
    //       _cfa.updateFlow.selector,
    //       _acceptedToken,
    //       address(this),
    //       profileOwner,
    //       inFlowRate,
    //       new bytes(0) // placeholder
    //     ),
    //     "0x",
    //     newCtx
    //   );
    //      _openSubscription(profileId,follower);
    // } else {
    //   // @dev If there is no existing outflow, then create new flow to equal inflow
    //   (newCtx, ) = _host.callAgreementWithContext(
    //     _cfa,
    //     abi.encodeWithSelector(
    //       _cfa.createFlow.selector,
    //       _acceptedToken,
    //       address(this),
    //       profileOwner,
    //       inFlowRate,
    //       new bytes(0) // placeholder
    //     ),
    //     "0x",
    //     newCtx
    //   );
    //      _openSubscription(profileId,follower);
    // }
    _openSubscription(profileId, follower);
  }



  /**
   * @notice Returns flow details. You should always provide the sender of the originating flow that is incoming to the contract
   *
   * @param sender the flow sender
   */
  function getFlowDetails(address sender)
    public
    view
    returns (
      uint256 timestamp,
      int96 inFlowRate,
      uint256 deposit,
      uint256 owedDeposit
    )
  {
    (timestamp, inFlowRate, deposit, owedDeposit) = _cfa.getFlow(
      _acceptedToken,
      sender,
      address(this)
    );
  }

  function _isSameToken(ISuperToken superToken) private view returns (bool) {
    return address(superToken) == address(_acceptedToken);
  }

  function _isCFAv1(address agreementClass) private view returns (bool) {
    return
      ISuperAgreement(agreementClass).agreementType() ==
      keccak256("org.superfluid-finance.agreements.ConstantFlowAgreement.v1");
  }

  modifier onlyExpected(ISuperToken superToken, address agreementClass) {
    require(_isSameToken(superToken), "RedirectAll: not accepted token");
    require(_isCFAv1(agreementClass), "RedirectAll: only CFAv1 supported");
    _;
  }

  modifier onlyHost() {
    require(msg.sender == address(_host), "RedirectAll: support only one host");
    _;
  }
}
