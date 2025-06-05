import * as p from '@subsquid/evm-codec';
import { event, fun, indexed, ContractBase } from '@subsquid/evm-abi';
import type { EventParams as EParams, FunctionArguments, FunctionReturn } from '@subsquid/evm-abi';

export const events = {
  ApprovalForAll: event('0x17307eab39ab6107e8899845ad3d59bd9653f200f220920489ca2b5937696c31', {
    account: indexed(p.address),
    operator: indexed(p.address),
    approved: p.bool,
  }),
  TransferBatch: event('0x4a39dc06d4c0dbc64b70af90fd698a233a518aa5d07e595d983b8c0526c8f7fb', {
    operator: indexed(p.address),
    from: indexed(p.address),
    to: indexed(p.address),
    ids: p.array(p.uint256),
    values: p.array(p.uint256),
  }),
  TransferSingle: event('0xc3d58168c5ae7397731d063d5bbf3d657854427343f4c083240f7aacaa2d0f62', {
    operator: indexed(p.address),
    from: indexed(p.address),
    to: indexed(p.address),
    id: p.uint256,
    value: p.uint256,
  }),
  URI: event('0x6bb7ff708619ba0610cba295a58592e0451dee2622938c8755667688daf3529b', { value: p.string, id: indexed(p.uint256) }),
};

export const abi = [
  // Events
  'event TransferSingle(address indexed operator, address indexed from, address indexed to, uint256 id, uint256 value)',
  'event TransferBatch(address indexed operator, address indexed from, address indexed to, uint256[] ids, uint256[] values)',
  'event ApprovalForAll(address indexed account, address indexed operator, bool approved)',
  'event URI(string value, uint256 indexed id)',

  // Read functions
  'function balanceOf(address account, uint256 id) view returns (uint256)',
  'function balanceOfBatch(address[] accounts, uint256[] ids) view returns (uint256[])',
  'function isApprovedForAll(address account, address operator) view returns (bool)',
  'function uri(uint256 id) view returns (string)',

  // Write functions
  'function setApprovalForAll(address operator, bool approved)',
  'function safeTransferFrom(address from, address to, uint256 id, uint256 amount, bytes data)',
  'function safeBatchTransferFrom(address from, address to, uint256[] ids, uint256[] amounts, bytes data)',
];

export const functions = {
  balanceOf: fun('0x00fdd58e', { account: p.address, id: p.uint256 }, p.uint256),
  balanceOfBatch: fun('0x4e1273f4', { accounts: p.array(p.address), ids: p.array(p.uint256) }, p.array(p.uint256)),
  isApprovedForAll: fun('0xe985e9c5', { account: p.address, operator: p.address }, p.bool),
  safeBatchTransferFrom: fun('0x2eb2c2d6', { from: p.address, to: p.address, ids: p.array(p.uint256), amounts: p.array(p.uint256), data: p.bytes }),
  safeTransferFrom: fun('0xf242432a', { from: p.address, to: p.address, id: p.uint256, amount: p.uint256, data: p.bytes }),
  setApprovalForAll: fun('0xa22cb465', { operator: p.address, approved: p.bool }),
  supportsInterface: fun('0x01ffc9a7', { interfaceId: p.bytes4 }, p.bool),
  uri: fun('0x0e89341c', { id: p.uint256 }, p.string),
};

export class Contract extends ContractBase {
  balanceOf(account: BalanceOfParams['account'], id: BalanceOfParams['id']) {
    return this.eth_call(functions.balanceOf, { account, id });
  }

  balanceOfBatch(accounts: BalanceOfBatchParams['accounts'], ids: BalanceOfBatchParams['ids']) {
    return this.eth_call(functions.balanceOfBatch, { accounts, ids });
  }

  isApprovedForAll(account: IsApprovedForAllParams['account'], operator: IsApprovedForAllParams['operator']) {
    return this.eth_call(functions.isApprovedForAll, { account, operator });
  }

  supportsInterface(interfaceId: SupportsInterfaceParams['interfaceId']) {
    return this.eth_call(functions.supportsInterface, { interfaceId });
  }

  uri(id: UriParams['id']) {
    return this.eth_call(functions.uri, { id });
  }
}

/// Event types
export type ApprovalForAllEventArgs = EParams<typeof events.ApprovalForAll>;
export type TransferBatchEventArgs = EParams<typeof events.TransferBatch>;
export type TransferSingleEventArgs = EParams<typeof events.TransferSingle>;
export type URIEventArgs = EParams<typeof events.URI>;

/// Function types
export type BalanceOfParams = FunctionArguments<typeof functions.balanceOf>;
export type BalanceOfReturn = FunctionReturn<typeof functions.balanceOf>;

export type BalanceOfBatchParams = FunctionArguments<typeof functions.balanceOfBatch>;
export type BalanceOfBatchReturn = FunctionReturn<typeof functions.balanceOfBatch>;

export type IsApprovedForAllParams = FunctionArguments<typeof functions.isApprovedForAll>;
export type IsApprovedForAllReturn = FunctionReturn<typeof functions.isApprovedForAll>;

export type SafeBatchTransferFromParams = FunctionArguments<typeof functions.safeBatchTransferFrom>;
export type SafeBatchTransferFromReturn = FunctionReturn<typeof functions.safeBatchTransferFrom>;

export type SafeTransferFromParams = FunctionArguments<typeof functions.safeTransferFrom>;
export type SafeTransferFromReturn = FunctionReturn<typeof functions.safeTransferFrom>;

export type SetApprovalForAllParams = FunctionArguments<typeof functions.setApprovalForAll>;
export type SetApprovalForAllReturn = FunctionReturn<typeof functions.setApprovalForAll>;

export type SupportsInterfaceParams = FunctionArguments<typeof functions.supportsInterface>;
export type SupportsInterfaceReturn = FunctionReturn<typeof functions.supportsInterface>;

export type UriParams = FunctionArguments<typeof functions.uri>;
export type UriReturn = FunctionReturn<typeof functions.uri>;
