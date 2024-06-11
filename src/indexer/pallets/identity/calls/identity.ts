import assert from 'assert';
import { Action, LazyAction } from '../../../../action/base';
import { chain } from '../../../../chain/index';
import { Block, Call, ProcessorContext } from '../../../../processor';
import { encodeAddress, getOriginAccountId, unwrapData } from '../../../../utils';
import { PalletCallHandler } from '../../../handler';
import { Account, Identity, IdentitySub, Judgement } from '../../../../model';
import { EnsureAccount } from '../../../../action';
import {
  AddIdentitySubAction,
  ClearIdentityAction,
  EnsureIdentityAction,
  EnsureIdentitySubAction,
  GiveJudgementAction,
  KillIdentityAction,
  RemoveIdentitySubAction,
  RenameSubAction,
  SetIdentityAction,
} from '../../../../action/identity';
import { IIdentitySetIdentityCallPalletDecoder } from '../../../registry';

// TODO: implement the decoders and change the return type
// This is kinda useless atm lets discuss it
export class SetIdentityCallPalletDecoder implements IIdentitySetIdentityCallPalletDecoder {
  decode(call: Call): { name: string } {
    console.log('IdentitySetIdentityCallPalletDecoder', call);
    return { name: '0x' };
  }
}

export class SetIdentityCallPalletHandler extends PalletCallHandler<SetIdentityCallPalletDecoder> {
  constructor(decoder: SetIdentityCallPalletDecoder, options: { chain: string }) {
    super(decoder, options);
  }

  // TODO: fix the return type
  handle(params: { ctx: ProcessorContext; queue: Action<unknown>[]; block: Block; item: Call }): any {
    assert('calls' in chain.api);
    assert('identity' in chain.api.calls);

    const call = params.item as Call;

    if (!call.success) return;

    // const data = this.decoder.decode(call);

    const data = chain.api.calls.identity.set_identity.decode(call);

    const origin = getOriginAccountId(call.origin);

    if (origin == null) return;

    const identityId = encodeAddress(origin);
    const account = params.ctx.store.defer(Account, identityId);
    const identity = params.ctx.store.defer(Identity, identityId);

    params.queue.push(
      new EnsureAccount(params.block.header, call.extrinsic, {
        account: () => account.get(),
        id: identityId,
      }),
      new EnsureIdentityAction(params.block.header, call.extrinsic, {
        identity: () => identity.get(),
        account: () => account.getOrFail(),
        id: identityId,
      }),
      new GiveJudgementAction(params.block.header, call.extrinsic, {
        identity: () => identity.getOrFail(),
        judgement: Judgement.Unknown,
      }),
      new SetIdentityAction(params.block.header, call.extrinsic, {
        identity: () => identity.getOrFail(),
        web: unwrapData(data.web),
        display: unwrapData(data.display),
        legal: unwrapData(data.legal),
        email: unwrapData(data.email),
        image: unwrapData(data.image),
        pgpFingerprint: data.pgpFingerprint ?? null,
        riot: unwrapData(data.riot),
        twitter: unwrapData(data.twitter),
        additional: data.additional.map((a) => ({
          name: unwrapData(a[0])!,
          value: unwrapData(a[1]),
        })),
      })
    );
  }
}

export class IdentityRenameSubCallPalletHandler extends PalletCallHandler<SetIdentityCallPalletDecoder> {
  constructor(decoder: SetIdentityCallPalletDecoder, options: { chain: string }) {
    super(decoder, options);
  }

  // TODO: fix the return type
  handle(params: { ctx: ProcessorContext; queue: Action<unknown>[]; block: Block; item: Call }): any {
    assert('calls' in chain.api);
    assert('identity' in chain.api.calls);

    const call = params.item as Call;

    if (!call.success) return;

    const renameSubData = chain.api.calls.identity.rename_sub.decode(call);

    const subId = encodeAddress(renameSubData.sub);

    const sub = params.ctx.store.defer(IdentitySub, subId);

    params.queue.push(
      new RenameSubAction(params.block.header, call.extrinsic, {
        sub: () => sub.getOrFail(),
        name: unwrapData(renameSubData.data)!,
      })
    );
  }
}

export class IdentitySetSubsCallPalletHandler extends PalletCallHandler<SetIdentityCallPalletDecoder> {
  constructor(decoder: SetIdentityCallPalletDecoder, options: { chain: string }) {
    super(decoder, options);
  }

  // TODO: fix the return type
  handle(params: { ctx: ProcessorContext; queue: Action<unknown>[]; block: Block; item: Call }): any {
    assert('calls' in chain.api);
    assert('identity' in chain.api.calls);

    const call = params.item as Call;

    if (!call.success) return;

    const setSubsData = chain.api.calls.identity.set_subs.decode(call);

    const origin = getOriginAccountId(call.origin);

    if (origin == null) return;
    const identityId = encodeAddress(origin);
    const identity = params.ctx.store.defer(Identity, identityId);
    const identityAccount = params.ctx.store.defer(Account, identityId);

    for (const subData of setSubsData.subs) {
      const subId = encodeAddress(subData[0]);
      const subIdentity = params.ctx.store.defer(IdentitySub, subId);
      const subIdentityAccount = params.ctx.store.defer(Account, subId);

      params.queue.push(
        new EnsureAccount(params.block.header, call.extrinsic, {
          account: () => subIdentityAccount.get(),
          id: subId,
        }),
        new EnsureAccount(params.block.header, call.extrinsic, {
          account: () => identityAccount.get(),
          id: identityId,
        }),
        new EnsureIdentityAction(params.block.header, call.extrinsic, {
          identity: () => identity.get(),
          account: () => identityAccount.getOrFail(),
          id: identityId,
        }),
        new EnsureIdentitySubAction(params.block.header, call.extrinsic, {
          sub: () => subIdentity.get(),
          account: () => subIdentityAccount.getOrFail(),
          id: subId,
        }),
        new AddIdentitySubAction(params.block.header, call.extrinsic, {
          identity: () => identity.getOrFail(),
          sub: () => subIdentity.getOrFail(),
        }),
        new RenameSubAction(params.block.header, call.extrinsic, {
          sub: () => subIdentity.getOrFail(),
          name: unwrapData(subData[1]),
        })
      );
    }
  }
}

export class IdentityProvideJudgementCallPalletHandler extends PalletCallHandler<SetIdentityCallPalletDecoder> {
  constructor(decoder: SetIdentityCallPalletDecoder, options: { chain: string }) {
    super(decoder, options);
  }

  // TODO: fix the return type
  handle(params: { ctx: ProcessorContext; queue: Action<unknown>[]; block: Block; item: Call }): any {
    assert('calls' in chain.api);
    assert('identity' in chain.api.calls);

    const call = params.item as Call;

    if (!call.success) return;

    const judgementGivenData = chain.api.calls.identity.provide_judgement.decode(call);

    const identityId = encodeAddress(judgementGivenData.target);

    const getJudgment = () => {
      const kind = judgementGivenData.judgement.__kind;
      switch (kind) {
        case Judgement.Erroneous:
        case Judgement.FeePaid:
        case Judgement.KnownGood:
        case Judgement.LowQuality:
        case Judgement.OutOfDate:
        case Judgement.Reasonable:
        case Judgement.Unknown:
          return kind as Judgement;
        default:
          throw new Error(`Unknown judgement: ${kind}`);
      }
    };
    const judgement = getJudgment();
    const account = params.ctx.store.defer(Account, identityId);
    const identity = params.ctx.store.defer(Identity, identityId);

    params.queue.push(
      new LazyAction(params.block.header, call.extrinsic, async (ctx) => {
        const action: Action[] = [];

        if (params.block.header.specName.startsWith('kusama') || params.block.header.specName.startsWith('polkadot')) {
          //[2018825, 3409356, 5926842, 5965153].includes(block.height) &&

          action.push(
            new EnsureAccount(params.block.header, call.extrinsic, {
              account: () => account.get(),
              id: identityId,
            }),
            new EnsureIdentityAction(params.block.header, call.extrinsic, {
              identity: () => identity.get(),
              account: () => account.getOrFail(),
              id: identityId,
            })
          );
        }

        return action;
      }),
      new GiveJudgementAction(params.block.header, call.extrinsic, {
        identity: () => identity.getOrFail(),
        judgement,
      })
    );
  }
}

export class IdentityAddSubCallPalletHandler extends PalletCallHandler<SetIdentityCallPalletDecoder> {
  constructor(decoder: SetIdentityCallPalletDecoder, options: { chain: string }) {
    super(decoder, options);
  }

  // TODO: fix the return type
  handle(params: { ctx: ProcessorContext; queue: Action<unknown>[]; block: Block; item: Call }): any {
    assert('calls' in chain.api);
    assert('identity' in chain.api.calls);

    const call = params.item as Call;

    if (!call.success) return;

    const subAddedCallData = chain.api.calls.identity.add_sub.decode(call);

    const origin = getOriginAccountId(call.origin);
    if (origin == null) return;

    const identityId = encodeAddress(origin);
    const subId = encodeAddress(subAddedCallData.sub);

    const identity = params.ctx.store.defer(Identity, identityId);
    const subIdentityAccount = params.ctx.store.defer(Account, subId);
    const subIdentity = params.ctx.store.defer(IdentitySub, subId);

    params.queue.push(
      new EnsureAccount(params.block.header, call.extrinsic, {
        account: () => subIdentityAccount.get(),
        id: subId,
      }),
      new EnsureIdentitySubAction(params.block.header, call.extrinsic, {
        sub: () => subIdentity.get(),
        account: () => subIdentityAccount.getOrFail(),
        id: subId,
      }),
      new AddIdentitySubAction(params.block.header, call.extrinsic, {
        identity: () => identity.getOrFail(),
        sub: () => subIdentity.getOrFail(),
      }),
      new RenameSubAction(params.block.header, call.extrinsic, {
        sub: () => subIdentity.getOrFail(),
        name: unwrapData(subAddedCallData.data),
      })
    );
  }
}

export class IdentityClearIdentityCallPalletHandler extends PalletCallHandler<SetIdentityCallPalletDecoder> {
  constructor(decoder: SetIdentityCallPalletDecoder, options: { chain: string }) {
    super(decoder, options);
  }
  // TODO: fix the return type
  handle(params: { ctx: ProcessorContext; queue: Action<unknown>[]; block: Block; item: Call }): any {
    assert('calls' in chain.api);
    assert('identity' in chain.api.calls);

    const call = params.item as Call;

    if (!call.success) return;

    const origin = getOriginAccountId(call.origin);
    if (origin == null) return;

    const identityId = encodeAddress(origin);
    const identity = params.ctx.store.defer(Identity, { id: identityId, relations: { subs: true } });

    params.queue.push(
      new ClearIdentityAction(params.block.header, call.extrinsic, {
        identity: () => identity.getOrFail(),
      }),
      new GiveJudgementAction(params.block.header, call.extrinsic, {
        identity: () => identity.getOrFail(),
        judgement: Judgement.Unknown,
      }),
      new LazyAction(params.block.header, call.extrinsic, async (ctx) => {
        const a: Action[] = [];

        const i = await identity.getOrFail();

        for (const s of i.subs) {
          new RemoveIdentitySubAction(params.block.header, call.extrinsic, {
            sub: () => Promise.resolve(s),
          });
        }

        return a;
      })
    );
  }
}
export class IdentityKillIdentityCallPalletHandler extends PalletCallHandler<SetIdentityCallPalletDecoder> {
  constructor(decoder: SetIdentityCallPalletDecoder, options: { chain: string }) {
    super(decoder, options);
  }

  //TODO: fix the return type
  handle(params: { ctx: ProcessorContext; queue: Action<unknown>[]; block: Block; item: Call }): any {
    assert('calls' in chain.api);
    assert('identity' in chain.api.events);

    const call = params.item as Call;

    if (!call.success) return;

    const origin = getOriginAccountId(call.origin);
    if (origin == null) return;

    const identityId = encodeAddress(origin);
    const identity = params.ctx.store.defer(Identity, { id: identityId, relations: { subs: true } });
    params.queue.push(
      new ClearIdentityAction(params.block.header, call.extrinsic, {
        identity: () => identity.getOrFail(),
      }),
      new GiveJudgementAction(params.block.header, call.extrinsic, {
        identity: () => identity.getOrFail(),
        judgement: Judgement.Unknown,
      }),
      new LazyAction(params.block.header, call.extrinsic, async () => {
        const a: Action[] = [];

        const i = await identity.getOrFail();

        for (const s of i.subs) {
          new RemoveIdentitySubAction(params.block.header, call.extrinsic, {
            sub: () => Promise.resolve(s),
          });
        }

        return a;
      }),
      new KillIdentityAction(params.block.header, call.extrinsic, {
        identity: () => identity.getOrFail(),
      })
    );
  }
}
