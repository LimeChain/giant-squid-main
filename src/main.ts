import { TypeormDatabaseWithCache } from '@belopash/typeorm-store';
import { chain } from './chain/index';
import { Processor, ProcessorContext } from './processor';
import { processItem } from './utils';
import { Action } from './action/base';
import { PalletMapper } from './indexer/mapper';
import { IndexerParams } from './indexer/types';

export const createIndexer = async ({ config, decoders }: IndexerParams) => {
  const mapper = new PalletMapper(decoders, { chain: chain.config.name });

  const events = mapper.getEvents();
  const calls = mapper.getCalls();

  const processor = new Processor(new TypeormDatabaseWithCache({ supportHotBlocks: true }), config);

  processor.addEvents(events);
  processor.addCalls(calls);
  processor.start(async (ctx: ProcessorContext) => {
    const queue: Action[] = [];
    // const queue: any = {}; //new Queue();

    processItem(ctx.blocks, (block, item) => {
      if (item.kind === 'event') {
        const pallet = mapper.getEventPallet(item.value.name)!;
        pallet.handle({ ctx, queue, block, item: item.value });
      }
      if (item.kind === 'call') {
        const pallet = mapper.getCallPallet(item.value.name)!;
        pallet.handle({ ctx, queue, block, item: item.value });
      }
    });

    // await queue.execute();
    await Action.process(ctx, queue);
    await ctx.store.flush();
  });
};

// processor.run(new TypeormDatabaseWithCache({ supportHotBlocks: true }), async (ctx) => {
//     const queue: Action[] = []
//     ctx.chain = chain.config.name;

//     processItem(ctx.blocks, (block, item) => {
//         // switch (item.value.name) {
//         //     case 'Balances.Transfer': {
//         //         const event = item.value as Event;
//         //         const data = chain.api.events.balances.Transfer.decode(event)

//         //         const fromId = encodeAddress(data.from);
//         //         const toId = encodeAddress(data.to);

//         //         const from = ctx.store.defer(Account, fromId)
//         //         const to = ctx.store.defer(Account, toId)

//         //         actions.push(
//         //             new EnsureAccount(block.header, event.extrinsic, {
//         //                 account: () => from.get(),
//         //                 id: fromId,
//         //             }),
//         //             new EnsureAccount(block.header, event.extrinsic, {
//         //                 account: () => to.get(),
//         //                 id: toId,
//         //             }),
//         //             new TransferAction(block.header, event.extrinsic, {
//         //                 id: event.id,
//         //                 from: () => from.getOrFail(),
//         //                 to: () => to.getOrFail(),
//         //                 amount: data.amount,
//         //                 success: true,
//         //             })
//         //         )
//         //         break
//         //     }
//         //     case 'Staking.Reward':
//         //     case 'Staking.Rewarded': {
//         //         assert('staking' in chain.api.events)
//         //         assert('calls' in chain.api)
//         //         assert('staking' in chain.api.calls)

//         //         const event = item.value as Event;

//         //         const data = chain.api.events.staking.Rewarded.decode(event)

//         //         if (data == null) return // skip some old format rewards

//         //         let accountId = encodeAddress(data.stash);

//         //         let validatorId: string | undefined
//         //         let era: number | undefined
//         //         if (event.call?.name === 'Staking.payout_stakers') {
//         //             const c = chain.api.calls.staking.payout_stakers.decode(event.call)
//         //             validatorId = encodeAddress(c.validatorStash);
//         //             era = c.era
//         //         }

//         //         const from = ctx.store.defer(Account, accountId)

//         //         actions.push(
//         //             new EnsureAccount(block.header, event.extrinsic, {
//         //                 account: () => from.get(),
//         //                 id: accountId,
//         //             }),
//         //             new RewardAction(block.header, event.extrinsic, {
//         //                 id: event.id,
//         //                 account: () => from.getOrFail(),
//         //                 amount: data.amount,
//         //                 era,
//         //                 validatorId,
//         //             })
//         //         )

//         //         break
//         //     }

//         //     case 'Identity.rename_sub': {
//         //         assert('calls' in chain.api)
//         //         assert('identity' in chain.api.calls)

//         //         const call = item.value as Call;

//         //         if (!call.success) break

//         //         const renameSubData = chain.api.calls.identity.rename_sub.decode(call)

//         //         const subId = encodeAddress(renameSubData.sub);

//         //         const sub = ctx.store.defer(IdentitySub, subId)

//         //         actions.push(
//         //             new RenameSubAction(block.header, call.extrinsic, {
//         //                 sub: () => sub.getOrFail(),
//         //                 name: unwrapData(renameSubData.data)!,
//         //             })
//         //         )

//         //         break
//         //     }

//         //     case 'Identity.set_subs': {
//         //         assert('calls' in chain.api)
//         //         assert('identity' in chain.api.calls)

//         //         const call = item.value as Call;

//         //         if (!call.success) break

//         //         const setSubsData = chain.api.calls.identity.set_subs.decode(call)

//         //         const origin = getOriginAccountId(call.origin)

//         //         if (origin == null) break
//         //         const identityId = encodeAddress(origin);
//         //         const identity = ctx.store.defer(Identity, identityId)
//         //         const identityAccount = ctx.store.defer(Account, identityId)

//         //         for (const subData of setSubsData.subs) {
//         //             const subId = encodeAddress(subData[0]);
//         //             const subIdentity = ctx.store.defer(IdentitySub, subId)
//         //             const subIdentityAccount = ctx.store.defer(Account, subId)

//         //             actions.push(
//         //                 new EnsureAccount(block.header, call.extrinsic, {
//         //                     account: () => subIdentityAccount.get(),
//         //                     id: subId,
//         //                 }),
//         //                 new EnsureAccount(block.header, call.extrinsic, {
//         //                     account: () => identityAccount.get(),
//         //                     id: identityId,
//         //                 }),
//         //                 new EnsureIdentityAction(block.header, call.extrinsic, {
//         //                     identity: () => identity.get(),
//         //                     account: () => identityAccount.getOrFail(),
//         //                     id: identityId,
//         //                 }),
//         //                 new EnsureIdentitySubAction(block.header, call.extrinsic, {
//         //                     sub: () => subIdentity.get(),
//         //                     account: () => subIdentityAccount.getOrFail(),
//         //                     id: subId,
//         //                 }),
//         //                 new AddIdentitySubAction(block.header, call.extrinsic, {
//         //                     identity: () => identity.getOrFail(),
//         //                     sub: () => subIdentity.getOrFail(),
//         //                 }),
//         //                 new RenameSubAction(block.header, call.extrinsic, {
//         //                     sub: () => subIdentity.getOrFail(),
//         //                     name: unwrapData(subData[1]),
//         //                 })
//         //             )
//         //         }

//         //         break
//         //     }
//         //     case 'Identity.provide_judgement': {
//         //         assert('calls' in chain.api)
//         //         assert('identity' in chain.api.calls)

//         //         const call = item.value as Call;

//         //         if (!call.success) break

//         //         const judgementGivenData = chain.api.calls.identity.provide_judgement.decode(call)

//         //         const identityId = encodeAddress(judgementGivenData.target);

//         //         const getJudgment = () => {
//         //             const kind = judgementGivenData.judgement.__kind
//         //             switch (kind) {
//         //                 case Judgement.Erroneous:
//         //                 case Judgement.FeePaid:
//         //                 case Judgement.KnownGood:
//         //                 case Judgement.LowQuality:
//         //                 case Judgement.OutOfDate:
//         //                 case Judgement.Reasonable:
//         //                 case Judgement.Unknown:
//         //                     return kind as Judgement
//         //                 default:
//         //                     throw new Error(`Unknown judgement: ${kind}`)
//         //             }
//         //         }
//         //         const judgement = getJudgment()
//         //         const account = ctx.store.defer(Account, identityId)
//         //         const identity = ctx.store.defer(Identity, identityId)

//         //         actions.push(
//         //             new LazyAction(block.header, call.extrinsic, async (ctx) => {
//         //                 const a: Action[] = []

//         //                 if (block.header.specName.startsWith('kusama') || block.header.specName.startsWith('polkadot')) {
//         //                     //[2018825, 3409356, 5926842, 5965153].includes(block.height) &&

//         //                     a.push(
//         //                         new EnsureAccount(block.header, call.extrinsic, {
//         //                             account: () => account.get(),
//         //                             id: identityId,
//         //                         }),
//         //                         new EnsureIdentityAction(block.header, call.extrinsic, {
//         //                             identity: () => identity.get(),
//         //                             account: () => account.getOrFail(),
//         //                             id: identityId,
//         //                         })
//         //                     )
//         //                 }

//         //                 return a
//         //             }),
//         //             new GiveJudgementAction(block.header, call.extrinsic, {
//         //                 identity: () => identity.getOrFail(),
//         //                 judgement,
//         //             })
//         //         )

//         //         break
//         //     }
//         //     case 'Identity.set_identity': {
//         //         assert('calls' in chain.api)
//         //         assert('identity' in chain.api.calls)

//         //         const call = item.value as Call;

//         //         if (!call.success) break

//         //         const identitySetData = chain.api.calls.identity.set_identity.decode(call)
//         //         const origin = getOriginAccountId(call.origin)

//         //         if (origin == null) break

//         //         const identityId = encodeAddress(origin);
//         //         const account = ctx.store.defer(Account, identityId)
//         //         const identity = ctx.store.defer(Identity, identityId)

//         //         actions.push(
//         //             new EnsureAccount(block.header, call.extrinsic, {
//         //                 account: () => account.get(),
//         //                 id: identityId,
//         //             }),
//         //             new EnsureIdentityAction(block.header, call.extrinsic, {
//         //                 identity: () => identity.get(),
//         //                 account: () => account.getOrFail(),
//         //                 id: identityId,
//         //             }),
//         //             new GiveJudgementAction(block.header, call.extrinsic, {
//         //                 identity: () => identity.getOrFail(),
//         //                 judgement: Judgement.Unknown,
//         //             }),
//         //             new SetIdentityAction(block.header, call.extrinsic, {
//         //                 identity: () => identity.getOrFail(),
//         //                 web: unwrapData(identitySetData.web),
//         //                 display: unwrapData(identitySetData.display),
//         //                 legal: unwrapData(identitySetData.legal),
//         //                 email: unwrapData(identitySetData.email),
//         //                 image: unwrapData(identitySetData.image),
//         //                 pgpFingerprint: identitySetData.pgpFingerprint ?? null,
//         //                 riot: unwrapData(identitySetData.riot),
//         //                 twitter: unwrapData(identitySetData.twitter),
//         //                 additional: identitySetData.additional.map((a) => ({
//         //                     name: unwrapData(a[0])!,
//         //                     value: unwrapData(a[1]),
//         //                 })),
//         //             })
//         //         )

//         //         break
//         //     }

//         //     case 'Identity.add_sub': {
//         //         assert('calls' in chain.api)
//         //         assert('identity' in chain.api.calls)

//         //         const call = item.value as Call;

//         //         if (!call.success) break

//         //         const subAddedCallData = chain.api.calls.identity.add_sub.decode(call)

//         //         const origin = getOriginAccountId(call.origin)
//         //         if (origin == null) break

//         //         const identityId = encodeAddress(origin);
//         //         const subId = encodeAddress(subAddedCallData.sub);

//         //         const identity = ctx.store.defer(Identity, identityId)
//         //         const subIdentityAccount = ctx.store.defer(Account, subId)
//         //         const subIdentity = ctx.store.defer(IdentitySub, subId)

//         //         actions.push(
//         //             new EnsureAccount(block.header, call.extrinsic, {
//         //                 account: () => subIdentityAccount.get(),
//         //                 id: subId,
//         //             }),
//         //             new EnsureIdentitySubAction(block.header, call.extrinsic, {
//         //                 sub: () => subIdentity.get(),
//         //                 account: () => subIdentityAccount.getOrFail(),
//         //                 id: subId,
//         //             }),
//         //             new AddIdentitySubAction(block.header, call.extrinsic, {
//         //                 identity: () => identity.getOrFail(),
//         //                 sub: () => subIdentity.getOrFail(),
//         //             }),
//         //             new RenameSubAction(block.header, call.extrinsic, {
//         //                 sub: () => subIdentity.getOrFail(),
//         //                 name: unwrapData(subAddedCallData.data),
//         //             })
//         //         )

//         //         break
//         //     }

//         //     case 'Identity.clear_identity': {
//         //         assert('calls' in chain.api)
//         //         assert('identity' in chain.api.calls)

//         //         const call = item.value as Call;

//         //         if (!call.success) break

//         //         const origin = getOriginAccountId(call.origin)
//         //         if (origin == null) break

//         //         const identityId = encodeAddress(origin);
//         //         const identity = ctx.store.defer(Identity, { id: identityId, relations: { subs: true } })

//         //         actions.push(
//         //             new ClearIdentityAction(block.header, call.extrinsic, {
//         //                 identity: () => identity.getOrFail(),
//         //             }),
//         //             new GiveJudgementAction(block.header, call.extrinsic, {
//         //                 identity: () => identity.getOrFail(),
//         //                 judgement: Judgement.Unknown,
//         //             }),
//         //             new LazyAction(block.header, call.extrinsic, async (ctx) => {
//         //                 const a: Action[] = []

//         //                 const i = await identity.getOrFail()

//         //                 for (const s of i.subs) {
//         //                     new RemoveIdentitySubAction(block.header, call.extrinsic, {
//         //                         sub: () => Promise.resolve(s),
//         //                     })
//         //                 }

//         //                 return a
//         //             })
//         //         )

//         //         break
//         //     }

//         //     case 'Identity.kill_identity': {
//         //         assert('calls' in chain.api)
//         //         assert('identity' in chain.api.events)

//         //         const call = item.value as Call;

//         //         if (!call.success) break

//         //         const origin = getOriginAccountId(call.origin)
//         //         if (origin == null) break

//         //         const identityId = encodeAddress(origin);
//         //         const identity = ctx.store.defer(Identity, { id: identityId, relations: { subs: true } })
//         //         actions.push(
//         //             new ClearIdentityAction(block.header, call.extrinsic, {
//         //                 identity: () => identity.getOrFail(),
//         //             }),
//         //             new GiveJudgementAction(block.header, call.extrinsic, {
//         //                 identity: () => identity.getOrFail(),
//         //                 judgement: Judgement.Unknown,
//         //             }),
//         //             new LazyAction(block.header, call.extrinsic, async () => {
//         //                 const a: Action[] = []

//         //                 const i = await identity.getOrFail()

//         //                 for (const s of i.subs) {
//         //                     new RemoveIdentitySubAction(block.header, call.extrinsic, {
//         //                         sub: () => Promise.resolve(s),
//         //                     })
//         //                 }

//         //                 return a
//         //             }),
//         //             new KillIdentityAction(block.header, call.extrinsic, {
//         //                 identity: () => identity.getOrFail(),
//         //             })
//         //         )

//         //         break
//         //     }

//         //     case 'Identity.SubIdentityRemoved': {
//         //         assert('calls' in chain.api)
//         //         assert('identity' in chain.api.events)

//         //         const event = item.value as Event;
//         //         const subRemovedData = chain.api.events.identity.IdentitySubRemoved.decode(event)

//         //         const subId = encodeAddress(subRemovedData.sub);
//         //         const subAccount = ctx.store.defer(Account, subId)
//         //         const subIdentity = ctx.store.defer(IdentitySub, subId)

//         //         actions.push(
//         //             new EnsureAccount(block.header, event.extrinsic, {
//         //                 account: () => subAccount.get(),
//         //                 id: subId,
//         //             }),
//         //             new EnsureIdentitySubAction(block.header, event.extrinsic, {
//         //                 sub: () => subIdentity.get(),
//         //                 account: () => subAccount.getOrFail(),
//         //                 id: subId,
//         //             }),
//         //             new RemoveIdentitySubAction(block.header, event.extrinsic, {
//         //                 sub: () => subIdentity.getOrFail(),
//         //             })
//         //         )

//         //         break
//         //     }

//         //     case 'Identity.IdentitySubRevoked': {
//         //         assert('calls' in chain.api)
//         //         assert('identity' in chain.api.events)

//         //         const event = item.value as Event;
//         //         const subRevokedData = chain.api.events.identity.IdentitySubRevoked.decode(event)

//         //         const subId = encodeAddress(subRevokedData.sub);
//         //         const subAccount = ctx.store.defer(Account, subId)
//         //         const subIdentity = ctx.store.defer(IdentitySub, subId)

//         //         actions.push(
//         //             new EnsureAccount(block.header, event.extrinsic, {
//         //                 account: () => subAccount.get(),
//         //                 id: subId,
//         //             }),
//         //             new EnsureIdentitySubAction(block.header, event.extrinsic, {
//         //                 sub: () => subIdentity.get(),
//         //                 account: () => subAccount.getOrFail(),
//         //                 id: subId,
//         //             }),
//         //             new RemoveIdentitySubAction(block.header, event.extrinsic, {
//         //                 sub: () => subIdentity.getOrFail(),
//         //             })
//         //         )

//         //         break
//         //     }
//         // }
//     })

//     await Action.process(ctx, actions)
//     await ctx.store.flush();
// })
