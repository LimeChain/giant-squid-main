import * as p from '@subsquid/evm-codec';
import { event, fun, indexed, ContractBase } from '@subsquid/evm-abi';
import type { EventParams as EParams, FunctionArguments, FunctionReturn } from '@subsquid/evm-abi';

export const events = {
  Transfer: event('0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef', {
    from: indexed(p.address),
    to: indexed(p.address),
    tokenId: indexed(p.uint256),
  }),
  Approval: event('0x8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925', {
    owner: indexed(p.address),
    approved: indexed(p.address),
    tokenId: indexed(p.uint256),
  }),
  ApprovalForAll: event('0x17307eab39ab6107e8899845ad3d59bd9653f200f220920489ca2b5937696c31', {
    owner: indexed(p.address),
    operator: indexed(p.address),
    approved: p.bool,
  }),
};

export const abi = [
  // Events
  'event Transfer(address indexed from, address indexed to, uint256 indexed tokenId)',
  'event Approval(address indexed owner, address indexed approved, uint256 indexed tokenId)',
  'event ApprovalForAll(address indexed owner, address indexed operator, bool approved)',

  // Read functions
  'function balanceOf(address owner) view returns (uint256)',
  'function ownerOf(uint256 tokenId) view returns (address)',
  'function getApproved(uint256 tokenId) view returns (address)',
  'function isApprovedForAll(address owner, address operator) view returns (bool)',
  'function name() view returns (string)',
  'function symbol() view returns (string)',
  'function tokenURI(uint256 tokenId) view returns (string)',

  // Write functions
  'function approve(address to, uint256 tokenId)',
  'function setApprovalForAll(address operator, bool approved)',
  'function transferFrom(address from, address to, uint256 tokenId)',
  'function safeTransferFrom(address from, address to, uint256 tokenId)',
  'function safeTransferFrom(address from, address to, uint256 tokenId, bytes data)',
];

export const functions = {
  approve: fun('0x095ea7b3', { to: p.address, tokenId: p.uint256 }),
  mint: fun('0x40c10f19', { to: p.address, tokenId: p.uint256 }),
  'safeTransferFrom(address,address,uint256)': fun('0x42842e0e', { from: p.address, to: p.address, tokenId: p.uint256 }),
  'safeTransferFrom(address,address,uint256,bytes)': fun('0xb88d4fde', { from: p.address, to: p.address, tokenId: p.uint256, _data: p.bytes }),
  setApprovalForAll: fun('0xa22cb465', { to: p.address, approved: p.bool }),
  transferFrom: fun('0x23b872dd', { from: p.address, to: p.address, tokenId: p.uint256 }),
  balanceOf: fun('0x70a08231', { owner: p.address }, p.uint256),
  getApproved: fun('0x081812fc', { tokenId: p.uint256 }, p.address),
  isApprovedForAll: fun('0xe985e9c5', { owner: p.address, operator: p.address }, p.bool),
  ownerOf: fun('0x6352211e', { tokenId: p.uint256 }, p.address),
  supportsInterface: fun('0x01ffc9a7', { interfaceId: p.bytes4 }, p.bool),
};

export class Contract extends ContractBase {
  balanceOf(owner: BalanceOfParams['owner']) {
    return this.eth_call(functions.balanceOf, { owner });
  }

  getApproved(tokenId: GetApprovedParams['tokenId']) {
    return this.eth_call(functions.getApproved, { tokenId });
  }

  isApprovedForAll(owner: IsApprovedForAllParams['owner'], operator: IsApprovedForAllParams['operator']) {
    return this.eth_call(functions.isApprovedForAll, { owner, operator });
  }

  ownerOf(tokenId: OwnerOfParams['tokenId']) {
    return this.eth_call(functions.ownerOf, { tokenId });
  }

  supportsInterface(interfaceId: SupportsInterfaceParams['interfaceId']) {
    return this.eth_call(functions.supportsInterface, { interfaceId });
  }
}

/// Event types
export type TransferEventArgs = EParams<typeof events.Transfer>;
export type ApprovalEventArgs = EParams<typeof events.Approval>;
export type ApprovalForAllEventArgs = EParams<typeof events.ApprovalForAll>;

/// Function types
export type ApproveParams = FunctionArguments<typeof functions.approve>;
export type ApproveReturn = FunctionReturn<typeof functions.approve>;

export type MintParams = FunctionArguments<typeof functions.mint>;
export type MintReturn = FunctionReturn<typeof functions.mint>;

export type SafeTransferFromParams_0 = FunctionArguments<(typeof functions)['safeTransferFrom(address,address,uint256)']>;
export type SafeTransferFromReturn_0 = FunctionReturn<(typeof functions)['safeTransferFrom(address,address,uint256)']>;

export type SafeTransferFromParams_1 = FunctionArguments<(typeof functions)['safeTransferFrom(address,address,uint256,bytes)']>;
export type SafeTransferFromReturn_1 = FunctionReturn<(typeof functions)['safeTransferFrom(address,address,uint256,bytes)']>;

export type SetApprovalForAllParams = FunctionArguments<typeof functions.setApprovalForAll>;
export type SetApprovalForAllReturn = FunctionReturn<typeof functions.setApprovalForAll>;

export type TransferFromParams = FunctionArguments<typeof functions.transferFrom>;
export type TransferFromReturn = FunctionReturn<typeof functions.transferFrom>;

export type BalanceOfParams = FunctionArguments<typeof functions.balanceOf>;
export type BalanceOfReturn = FunctionReturn<typeof functions.balanceOf>;

export type GetApprovedParams = FunctionArguments<typeof functions.getApproved>;
export type GetApprovedReturn = FunctionReturn<typeof functions.getApproved>;

export type IsApprovedForAllParams = FunctionArguments<typeof functions.isApprovedForAll>;
export type IsApprovedForAllReturn = FunctionReturn<typeof functions.isApprovedForAll>;

export type OwnerOfParams = FunctionArguments<typeof functions.ownerOf>;
export type OwnerOfReturn = FunctionReturn<typeof functions.ownerOf>;

export type SupportsInterfaceParams = FunctionArguments<typeof functions.supportsInterface>;
export type SupportsInterfaceReturn = FunctionReturn<typeof functions.supportsInterface>;
