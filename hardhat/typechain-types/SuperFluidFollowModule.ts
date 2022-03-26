/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import {
  BaseContract,
  BigNumber,
  BigNumberish,
  BytesLike,
  CallOverrides,
  ContractTransaction,
  Overrides,
  PopulatedTransaction,
  Signer,
  utils,
} from "ethers";
import { FunctionFragment, Result, EventFragment } from "@ethersproject/abi";
import { Listener, Provider } from "@ethersproject/providers";
import { TypedEventFilter, TypedEvent, TypedListener, OnEvent } from "./common";

export interface SuperFluidFollowModuleInterface extends utils.Interface {
  functions: {
    "HUB()": FunctionFragment;
    "_acceptedToken()": FunctionFragment;
    "afterAgreementCreated(address,address,bytes32,bytes,bytes,bytes)": FunctionFragment;
    "afterAgreementTerminated(address,address,bytes32,bytes,bytes,bytes)": FunctionFragment;
    "afterAgreementUpdated(address,address,bytes32,bytes,bytes,bytes)": FunctionFragment;
    "beforeAgreementCreated(address,address,bytes32,bytes,bytes)": FunctionFragment;
    "beforeAgreementTerminated(address,address,bytes32,bytes,bytes)": FunctionFragment;
    "beforeAgreementUpdated(address,address,bytes32,bytes,bytes)": FunctionFragment;
    "cancelSubscription(uint256,address)": FunctionFragment;
    "followModuleTransferHook(uint256,address,address,uint256)": FunctionFragment;
    "getFlowDetails(address)": FunctionFragment;
    "getProfileData(uint256)": FunctionFragment;
    "hasSubscription(uint256,address)": FunctionFragment;
    "initializeFollowModule(uint256,bytes)": FunctionFragment;
    "openSubscription(uint256,address)": FunctionFragment;
    "processFollow(address,uint256,bytes)": FunctionFragment;
    "validateFollow(uint256,address,uint256)": FunctionFragment;
  };

  encodeFunctionData(functionFragment: "HUB", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "_acceptedToken",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "afterAgreementCreated",
    values: [string, string, BytesLike, BytesLike, BytesLike, BytesLike]
  ): string;
  encodeFunctionData(
    functionFragment: "afterAgreementTerminated",
    values: [string, string, BytesLike, BytesLike, BytesLike, BytesLike]
  ): string;
  encodeFunctionData(
    functionFragment: "afterAgreementUpdated",
    values: [string, string, BytesLike, BytesLike, BytesLike, BytesLike]
  ): string;
  encodeFunctionData(
    functionFragment: "beforeAgreementCreated",
    values: [string, string, BytesLike, BytesLike, BytesLike]
  ): string;
  encodeFunctionData(
    functionFragment: "beforeAgreementTerminated",
    values: [string, string, BytesLike, BytesLike, BytesLike]
  ): string;
  encodeFunctionData(
    functionFragment: "beforeAgreementUpdated",
    values: [string, string, BytesLike, BytesLike, BytesLike]
  ): string;
  encodeFunctionData(
    functionFragment: "cancelSubscription",
    values: [BigNumberish, string]
  ): string;
  encodeFunctionData(
    functionFragment: "followModuleTransferHook",
    values: [BigNumberish, string, string, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "getFlowDetails",
    values: [string]
  ): string;
  encodeFunctionData(
    functionFragment: "getProfileData",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "hasSubscription",
    values: [BigNumberish, string]
  ): string;
  encodeFunctionData(
    functionFragment: "initializeFollowModule",
    values: [BigNumberish, BytesLike]
  ): string;
  encodeFunctionData(
    functionFragment: "openSubscription",
    values: [BigNumberish, string]
  ): string;
  encodeFunctionData(
    functionFragment: "processFollow",
    values: [string, BigNumberish, BytesLike]
  ): string;
  encodeFunctionData(
    functionFragment: "validateFollow",
    values: [BigNumberish, string, BigNumberish]
  ): string;

  decodeFunctionResult(functionFragment: "HUB", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "_acceptedToken",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "afterAgreementCreated",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "afterAgreementTerminated",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "afterAgreementUpdated",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "beforeAgreementCreated",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "beforeAgreementTerminated",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "beforeAgreementUpdated",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "cancelSubscription",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "followModuleTransferHook",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getFlowDetails",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getProfileData",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "hasSubscription",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "initializeFollowModule",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "openSubscription",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "processFollow",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "validateFollow",
    data: BytesLike
  ): Result;

  events: {
    "RegistrationSuccessEvent(bytes32)": EventFragment;
    "RegistrationTimedOutEvent(bytes32)": EventFragment;
  };

  getEvent(nameOrSignatureOrTopic: "RegistrationSuccessEvent"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "RegistrationTimedOutEvent"): EventFragment;
}

export type RegistrationSuccessEventEvent = TypedEvent<
  [string],
  { phoneNumberHash: string }
>;

export type RegistrationSuccessEventEventFilter =
  TypedEventFilter<RegistrationSuccessEventEvent>;

export type RegistrationTimedOutEventEvent = TypedEvent<
  [string],
  { phoneNumberHash: string }
>;

export type RegistrationTimedOutEventEventFilter =
  TypedEventFilter<RegistrationTimedOutEventEvent>;

export interface SuperFluidFollowModule extends BaseContract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  interface: SuperFluidFollowModuleInterface;

  queryFilter<TEvent extends TypedEvent>(
    event: TypedEventFilter<TEvent>,
    fromBlockOrBlockhash?: string | number | undefined,
    toBlock?: string | number | undefined
  ): Promise<Array<TEvent>>;

  listeners<TEvent extends TypedEvent>(
    eventFilter?: TypedEventFilter<TEvent>
  ): Array<TypedListener<TEvent>>;
  listeners(eventName?: string): Array<Listener>;
  removeAllListeners<TEvent extends TypedEvent>(
    eventFilter: TypedEventFilter<TEvent>
  ): this;
  removeAllListeners(eventName?: string): this;
  off: OnEvent<this>;
  on: OnEvent<this>;
  once: OnEvent<this>;
  removeListener: OnEvent<this>;

  functions: {
    HUB(overrides?: CallOverrides): Promise<[string]>;

    _acceptedToken(overrides?: CallOverrides): Promise<[string]>;

    afterAgreementCreated(
      _superToken: string,
      _agreementClass: string,
      arg2: BytesLike,
      _agreementData: BytesLike,
      arg4: BytesLike,
      _ctx: BytesLike,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    afterAgreementTerminated(
      arg0: string,
      arg1: string,
      arg2: BytesLike,
      _agreementData: BytesLike,
      arg4: BytesLike,
      _ctx: BytesLike,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    afterAgreementUpdated(
      _superToken: string,
      _agreementClass: string,
      arg2: BytesLike,
      _agreementData: BytesLike,
      arg4: BytesLike,
      _ctx: BytesLike,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    beforeAgreementCreated(
      arg0: string,
      arg1: string,
      arg2: BytesLike,
      arg3: BytesLike,
      arg4: BytesLike,
      overrides?: CallOverrides
    ): Promise<[string]>;

    beforeAgreementTerminated(
      arg0: string,
      arg1: string,
      arg2: BytesLike,
      arg3: BytesLike,
      arg4: BytesLike,
      overrides?: CallOverrides
    ): Promise<[string]>;

    beforeAgreementUpdated(
      arg0: string,
      arg1: string,
      arg2: BytesLike,
      arg3: BytesLike,
      arg4: BytesLike,
      overrides?: CallOverrides
    ): Promise<[string]>;

    cancelSubscription(
      profileId: BigNumberish,
      follower: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    followModuleTransferHook(
      profileId: BigNumberish,
      from: string,
      to: string,
      followNFTTokenId: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    getFlowDetails(
      sender: string,
      overrides?: CallOverrides
    ): Promise<
      [BigNumber, BigNumber, BigNumber, BigNumber] & {
        timestamp: BigNumber;
        inFlowRate: BigNumber;
        deposit: BigNumber;
        owedDeposit: BigNumber;
      }
    >;

    getProfileData(
      profileId: BigNumberish,
      overrides?: CallOverrides
    ): Promise<[boolean]>;

    hasSubscription(
      profileId: BigNumberish,
      toCheck: string,
      overrides?: CallOverrides
    ): Promise<[boolean]>;

    initializeFollowModule(
      profileId: BigNumberish,
      data: BytesLike,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    openSubscription(
      profileId: BigNumberish,
      follower: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    processFollow(
      follower: string,
      profileId: BigNumberish,
      data: BytesLike,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    validateFollow(
      profileId: BigNumberish,
      follower: string,
      followNFTTokenId: BigNumberish,
      overrides?: CallOverrides
    ): Promise<[void]>;
  };

  HUB(overrides?: CallOverrides): Promise<string>;

  _acceptedToken(overrides?: CallOverrides): Promise<string>;

  afterAgreementCreated(
    _superToken: string,
    _agreementClass: string,
    arg2: BytesLike,
    _agreementData: BytesLike,
    arg4: BytesLike,
    _ctx: BytesLike,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  afterAgreementTerminated(
    arg0: string,
    arg1: string,
    arg2: BytesLike,
    _agreementData: BytesLike,
    arg4: BytesLike,
    _ctx: BytesLike,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  afterAgreementUpdated(
    _superToken: string,
    _agreementClass: string,
    arg2: BytesLike,
    _agreementData: BytesLike,
    arg4: BytesLike,
    _ctx: BytesLike,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  beforeAgreementCreated(
    arg0: string,
    arg1: string,
    arg2: BytesLike,
    arg3: BytesLike,
    arg4: BytesLike,
    overrides?: CallOverrides
  ): Promise<string>;

  beforeAgreementTerminated(
    arg0: string,
    arg1: string,
    arg2: BytesLike,
    arg3: BytesLike,
    arg4: BytesLike,
    overrides?: CallOverrides
  ): Promise<string>;

  beforeAgreementUpdated(
    arg0: string,
    arg1: string,
    arg2: BytesLike,
    arg3: BytesLike,
    arg4: BytesLike,
    overrides?: CallOverrides
  ): Promise<string>;

  cancelSubscription(
    profileId: BigNumberish,
    follower: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  followModuleTransferHook(
    profileId: BigNumberish,
    from: string,
    to: string,
    followNFTTokenId: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  getFlowDetails(
    sender: string,
    overrides?: CallOverrides
  ): Promise<
    [BigNumber, BigNumber, BigNumber, BigNumber] & {
      timestamp: BigNumber;
      inFlowRate: BigNumber;
      deposit: BigNumber;
      owedDeposit: BigNumber;
    }
  >;

  getProfileData(
    profileId: BigNumberish,
    overrides?: CallOverrides
  ): Promise<boolean>;

  hasSubscription(
    profileId: BigNumberish,
    toCheck: string,
    overrides?: CallOverrides
  ): Promise<boolean>;

  initializeFollowModule(
    profileId: BigNumberish,
    data: BytesLike,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  openSubscription(
    profileId: BigNumberish,
    follower: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  processFollow(
    follower: string,
    profileId: BigNumberish,
    data: BytesLike,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  validateFollow(
    profileId: BigNumberish,
    follower: string,
    followNFTTokenId: BigNumberish,
    overrides?: CallOverrides
  ): Promise<void>;

  callStatic: {
    HUB(overrides?: CallOverrides): Promise<string>;

    _acceptedToken(overrides?: CallOverrides): Promise<string>;

    afterAgreementCreated(
      _superToken: string,
      _agreementClass: string,
      arg2: BytesLike,
      _agreementData: BytesLike,
      arg4: BytesLike,
      _ctx: BytesLike,
      overrides?: CallOverrides
    ): Promise<string>;

    afterAgreementTerminated(
      arg0: string,
      arg1: string,
      arg2: BytesLike,
      _agreementData: BytesLike,
      arg4: BytesLike,
      _ctx: BytesLike,
      overrides?: CallOverrides
    ): Promise<string>;

    afterAgreementUpdated(
      _superToken: string,
      _agreementClass: string,
      arg2: BytesLike,
      _agreementData: BytesLike,
      arg4: BytesLike,
      _ctx: BytesLike,
      overrides?: CallOverrides
    ): Promise<string>;

    beforeAgreementCreated(
      arg0: string,
      arg1: string,
      arg2: BytesLike,
      arg3: BytesLike,
      arg4: BytesLike,
      overrides?: CallOverrides
    ): Promise<string>;

    beforeAgreementTerminated(
      arg0: string,
      arg1: string,
      arg2: BytesLike,
      arg3: BytesLike,
      arg4: BytesLike,
      overrides?: CallOverrides
    ): Promise<string>;

    beforeAgreementUpdated(
      arg0: string,
      arg1: string,
      arg2: BytesLike,
      arg3: BytesLike,
      arg4: BytesLike,
      overrides?: CallOverrides
    ): Promise<string>;

    cancelSubscription(
      profileId: BigNumberish,
      follower: string,
      overrides?: CallOverrides
    ): Promise<void>;

    followModuleTransferHook(
      profileId: BigNumberish,
      from: string,
      to: string,
      followNFTTokenId: BigNumberish,
      overrides?: CallOverrides
    ): Promise<void>;

    getFlowDetails(
      sender: string,
      overrides?: CallOverrides
    ): Promise<
      [BigNumber, BigNumber, BigNumber, BigNumber] & {
        timestamp: BigNumber;
        inFlowRate: BigNumber;
        deposit: BigNumber;
        owedDeposit: BigNumber;
      }
    >;

    getProfileData(
      profileId: BigNumberish,
      overrides?: CallOverrides
    ): Promise<boolean>;

    hasSubscription(
      profileId: BigNumberish,
      toCheck: string,
      overrides?: CallOverrides
    ): Promise<boolean>;

    initializeFollowModule(
      profileId: BigNumberish,
      data: BytesLike,
      overrides?: CallOverrides
    ): Promise<string>;

    openSubscription(
      profileId: BigNumberish,
      follower: string,
      overrides?: CallOverrides
    ): Promise<void>;

    processFollow(
      follower: string,
      profileId: BigNumberish,
      data: BytesLike,
      overrides?: CallOverrides
    ): Promise<void>;

    validateFollow(
      profileId: BigNumberish,
      follower: string,
      followNFTTokenId: BigNumberish,
      overrides?: CallOverrides
    ): Promise<void>;
  };

  filters: {
    "RegistrationSuccessEvent(bytes32)"(
      phoneNumberHash?: BytesLike | null
    ): RegistrationSuccessEventEventFilter;
    RegistrationSuccessEvent(
      phoneNumberHash?: BytesLike | null
    ): RegistrationSuccessEventEventFilter;

    "RegistrationTimedOutEvent(bytes32)"(
      phoneNumberHash?: BytesLike | null
    ): RegistrationTimedOutEventEventFilter;
    RegistrationTimedOutEvent(
      phoneNumberHash?: BytesLike | null
    ): RegistrationTimedOutEventEventFilter;
  };

  estimateGas: {
    HUB(overrides?: CallOverrides): Promise<BigNumber>;

    _acceptedToken(overrides?: CallOverrides): Promise<BigNumber>;

    afterAgreementCreated(
      _superToken: string,
      _agreementClass: string,
      arg2: BytesLike,
      _agreementData: BytesLike,
      arg4: BytesLike,
      _ctx: BytesLike,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    afterAgreementTerminated(
      arg0: string,
      arg1: string,
      arg2: BytesLike,
      _agreementData: BytesLike,
      arg4: BytesLike,
      _ctx: BytesLike,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    afterAgreementUpdated(
      _superToken: string,
      _agreementClass: string,
      arg2: BytesLike,
      _agreementData: BytesLike,
      arg4: BytesLike,
      _ctx: BytesLike,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    beforeAgreementCreated(
      arg0: string,
      arg1: string,
      arg2: BytesLike,
      arg3: BytesLike,
      arg4: BytesLike,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    beforeAgreementTerminated(
      arg0: string,
      arg1: string,
      arg2: BytesLike,
      arg3: BytesLike,
      arg4: BytesLike,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    beforeAgreementUpdated(
      arg0: string,
      arg1: string,
      arg2: BytesLike,
      arg3: BytesLike,
      arg4: BytesLike,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    cancelSubscription(
      profileId: BigNumberish,
      follower: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    followModuleTransferHook(
      profileId: BigNumberish,
      from: string,
      to: string,
      followNFTTokenId: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    getFlowDetails(
      sender: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    getProfileData(
      profileId: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    hasSubscription(
      profileId: BigNumberish,
      toCheck: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    initializeFollowModule(
      profileId: BigNumberish,
      data: BytesLike,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    openSubscription(
      profileId: BigNumberish,
      follower: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    processFollow(
      follower: string,
      profileId: BigNumberish,
      data: BytesLike,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    validateFollow(
      profileId: BigNumberish,
      follower: string,
      followNFTTokenId: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;
  };

  populateTransaction: {
    HUB(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    _acceptedToken(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    afterAgreementCreated(
      _superToken: string,
      _agreementClass: string,
      arg2: BytesLike,
      _agreementData: BytesLike,
      arg4: BytesLike,
      _ctx: BytesLike,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    afterAgreementTerminated(
      arg0: string,
      arg1: string,
      arg2: BytesLike,
      _agreementData: BytesLike,
      arg4: BytesLike,
      _ctx: BytesLike,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    afterAgreementUpdated(
      _superToken: string,
      _agreementClass: string,
      arg2: BytesLike,
      _agreementData: BytesLike,
      arg4: BytesLike,
      _ctx: BytesLike,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    beforeAgreementCreated(
      arg0: string,
      arg1: string,
      arg2: BytesLike,
      arg3: BytesLike,
      arg4: BytesLike,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    beforeAgreementTerminated(
      arg0: string,
      arg1: string,
      arg2: BytesLike,
      arg3: BytesLike,
      arg4: BytesLike,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    beforeAgreementUpdated(
      arg0: string,
      arg1: string,
      arg2: BytesLike,
      arg3: BytesLike,
      arg4: BytesLike,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    cancelSubscription(
      profileId: BigNumberish,
      follower: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    followModuleTransferHook(
      profileId: BigNumberish,
      from: string,
      to: string,
      followNFTTokenId: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    getFlowDetails(
      sender: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    getProfileData(
      profileId: BigNumberish,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    hasSubscription(
      profileId: BigNumberish,
      toCheck: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    initializeFollowModule(
      profileId: BigNumberish,
      data: BytesLike,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    openSubscription(
      profileId: BigNumberish,
      follower: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    processFollow(
      follower: string,
      profileId: BigNumberish,
      data: BytesLike,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    validateFollow(
      profileId: BigNumberish,
      follower: string,
      followNFTTokenId: BigNumberish,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;
  };
}
