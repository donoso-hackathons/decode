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

export type EIP712SignatureStruct = {
  v: BigNumberish;
  r: BytesLike;
  s: BytesLike;
  deadline: BigNumberish;
};

export type EIP712SignatureStructOutput = [
  number,
  string,
  string,
  BigNumber
] & { v: number; r: string; s: string; deadline: BigNumber };

export type CollectWithSigDataStruct = {
  collector: string;
  profileId: BigNumberish;
  pubId: BigNumberish;
  data: BytesLike;
  sig: EIP712SignatureStruct;
};

export type CollectWithSigDataStructOutput = [
  string,
  BigNumber,
  BigNumber,
  string,
  EIP712SignatureStructOutput
] & {
  collector: string;
  profileId: BigNumber;
  pubId: BigNumber;
  data: string;
  sig: EIP712SignatureStructOutput;
};

export type CommentDataStruct = {
  profileId: BigNumberish;
  contentURI: string;
  profileIdPointed: BigNumberish;
  pubIdPointed: BigNumberish;
  collectModule: string;
  collectModuleData: BytesLike;
  referenceModule: string;
  referenceModuleData: BytesLike;
};

export type CommentDataStructOutput = [
  BigNumber,
  string,
  BigNumber,
  BigNumber,
  string,
  string,
  string,
  string
] & {
  profileId: BigNumber;
  contentURI: string;
  profileIdPointed: BigNumber;
  pubIdPointed: BigNumber;
  collectModule: string;
  collectModuleData: string;
  referenceModule: string;
  referenceModuleData: string;
};

export type CommentWithSigDataStruct = {
  profileId: BigNumberish;
  contentURI: string;
  profileIdPointed: BigNumberish;
  pubIdPointed: BigNumberish;
  collectModule: string;
  collectModuleData: BytesLike;
  referenceModule: string;
  referenceModuleData: BytesLike;
  sig: EIP712SignatureStruct;
};

export type CommentWithSigDataStructOutput = [
  BigNumber,
  string,
  BigNumber,
  BigNumber,
  string,
  string,
  string,
  string,
  EIP712SignatureStructOutput
] & {
  profileId: BigNumber;
  contentURI: string;
  profileIdPointed: BigNumber;
  pubIdPointed: BigNumber;
  collectModule: string;
  collectModuleData: string;
  referenceModule: string;
  referenceModuleData: string;
  sig: EIP712SignatureStructOutput;
};

export type CreateProfileDataStruct = {
  to: string;
  handle: string;
  imageURI: string;
  followModule: string;
  followModuleData: BytesLike;
  followNFTURI: string;
};

export type CreateProfileDataStructOutput = [
  string,
  string,
  string,
  string,
  string,
  string
] & {
  to: string;
  handle: string;
  imageURI: string;
  followModule: string;
  followModuleData: string;
  followNFTURI: string;
};

export type FollowWithSigDataStruct = {
  follower: string;
  profileIds: BigNumberish[];
  datas: BytesLike[];
  sig: EIP712SignatureStruct;
};

export type FollowWithSigDataStructOutput = [
  string,
  BigNumber[],
  string[],
  EIP712SignatureStructOutput
] & {
  follower: string;
  profileIds: BigNumber[];
  datas: string[];
  sig: EIP712SignatureStructOutput;
};

export type ProfileStructStruct = {
  pubCount: BigNumberish;
  followModule: string;
  followNFT: string;
  handle: string;
  imageURI: string;
  followNFTURI: string;
};

export type ProfileStructStructOutput = [
  BigNumber,
  string,
  string,
  string,
  string,
  string
] & {
  pubCount: BigNumber;
  followModule: string;
  followNFT: string;
  handle: string;
  imageURI: string;
  followNFTURI: string;
};

export type PublicationStructStruct = {
  profileIdPointed: BigNumberish;
  pubIdPointed: BigNumberish;
  contentURI: string;
  referenceModule: string;
  collectModule: string;
  collectNFT: string;
};

export type PublicationStructStructOutput = [
  BigNumber,
  BigNumber,
  string,
  string,
  string,
  string
] & {
  profileIdPointed: BigNumber;
  pubIdPointed: BigNumber;
  contentURI: string;
  referenceModule: string;
  collectModule: string;
  collectNFT: string;
};

export type MirrorDataStruct = {
  profileId: BigNumberish;
  profileIdPointed: BigNumberish;
  pubIdPointed: BigNumberish;
  referenceModule: string;
  referenceModuleData: BytesLike;
};

export type MirrorDataStructOutput = [
  BigNumber,
  BigNumber,
  BigNumber,
  string,
  string
] & {
  profileId: BigNumber;
  profileIdPointed: BigNumber;
  pubIdPointed: BigNumber;
  referenceModule: string;
  referenceModuleData: string;
};

export type MirrorWithSigDataStruct = {
  profileId: BigNumberish;
  profileIdPointed: BigNumberish;
  pubIdPointed: BigNumberish;
  referenceModule: string;
  referenceModuleData: BytesLike;
  sig: EIP712SignatureStruct;
};

export type MirrorWithSigDataStructOutput = [
  BigNumber,
  BigNumber,
  BigNumber,
  string,
  string,
  EIP712SignatureStructOutput
] & {
  profileId: BigNumber;
  profileIdPointed: BigNumber;
  pubIdPointed: BigNumber;
  referenceModule: string;
  referenceModuleData: string;
  sig: EIP712SignatureStructOutput;
};

export type PostDataStruct = {
  profileId: BigNumberish;
  contentURI: string;
  collectModule: string;
  collectModuleData: BytesLike;
  referenceModule: string;
  referenceModuleData: BytesLike;
};

export type PostDataStructOutput = [
  BigNumber,
  string,
  string,
  string,
  string,
  string
] & {
  profileId: BigNumber;
  contentURI: string;
  collectModule: string;
  collectModuleData: string;
  referenceModule: string;
  referenceModuleData: string;
};

export type PostWithSigDataStruct = {
  profileId: BigNumberish;
  contentURI: string;
  collectModule: string;
  collectModuleData: BytesLike;
  referenceModule: string;
  referenceModuleData: BytesLike;
  sig: EIP712SignatureStruct;
};

export type PostWithSigDataStructOutput = [
  BigNumber,
  string,
  string,
  string,
  string,
  string,
  EIP712SignatureStructOutput
] & {
  profileId: BigNumber;
  contentURI: string;
  collectModule: string;
  collectModuleData: string;
  referenceModule: string;
  referenceModuleData: string;
  sig: EIP712SignatureStructOutput;
};

export type SetDefaultProfileWithSigDataStruct = {
  wallet: string;
  profileId: BigNumberish;
  sig: EIP712SignatureStruct;
};

export type SetDefaultProfileWithSigDataStructOutput = [
  string,
  BigNumber,
  EIP712SignatureStructOutput
] & { wallet: string; profileId: BigNumber; sig: EIP712SignatureStructOutput };

export type SetDispatcherWithSigDataStruct = {
  profileId: BigNumberish;
  dispatcher: string;
  sig: EIP712SignatureStruct;
};

export type SetDispatcherWithSigDataStructOutput = [
  BigNumber,
  string,
  EIP712SignatureStructOutput
] & {
  profileId: BigNumber;
  dispatcher: string;
  sig: EIP712SignatureStructOutput;
};

export type SetFollowModuleWithSigDataStruct = {
  profileId: BigNumberish;
  followModule: string;
  followModuleData: BytesLike;
  sig: EIP712SignatureStruct;
};

export type SetFollowModuleWithSigDataStructOutput = [
  BigNumber,
  string,
  string,
  EIP712SignatureStructOutput
] & {
  profileId: BigNumber;
  followModule: string;
  followModuleData: string;
  sig: EIP712SignatureStructOutput;
};

export type SetFollowNFTURIWithSigDataStruct = {
  profileId: BigNumberish;
  followNFTURI: string;
  sig: EIP712SignatureStruct;
};

export type SetFollowNFTURIWithSigDataStructOutput = [
  BigNumber,
  string,
  EIP712SignatureStructOutput
] & {
  profileId: BigNumber;
  followNFTURI: string;
  sig: EIP712SignatureStructOutput;
};

export type SetProfileImageURIWithSigDataStruct = {
  profileId: BigNumberish;
  imageURI: string;
  sig: EIP712SignatureStruct;
};

export type SetProfileImageURIWithSigDataStructOutput = [
  BigNumber,
  string,
  EIP712SignatureStructOutput
] & {
  profileId: BigNumber;
  imageURI: string;
  sig: EIP712SignatureStructOutput;
};

