import { TypeormDatabase } from '@subsquid/typeorm-store'
import { processor } from './processor'
import { encodeAddress, getOriginAccountId, processItem } from './utils'
import { chain } from './chain'
import { Account, Identity, Judgement, IdentitySub } from './model'
import { Action, LazyAction } from './action/base'
import assert from 'assert'
import { EnsureAccount, TransferAction, RewardAction } from './action'
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
} from './action/identity'
import { toHex } from '@subsquid/substrate-processor'

processor.run(new TypeormDatabase(), async (ctx) => {

    const actions: Action[] = []
    processItem(ctx.blocks, (block, item) => {
        switch (item.name) {
            case 'Balances.Transfer': {
                const data = chain.api.events.balances.Transfer.decode(ctx, item.event)

                const fromId = encodeAddress(data.from)
                const toId = encodeAddress(data.to)

                actions.push(
                    new EnsureAccount(block, item.event.extrinsic, {
                        account: () => ctx.store.findOneByOrFail(Account, { id: fromId }),
                        id: fromId,
                    }),
                    new EnsureAccount(block, item.event.extrinsic, {
                        account: () => ctx.store.findOneByOrFail(Account, { id: toId }),
                        id: toId,
                    }),
                    new TransferAction(block, item.event.extrinsic, {
                        id: item.event.id,
                        fromId,
                        toId,
                        amount: data.amount,
                        success: true,
                    })
                )
                break
            }
            case 'Staking.Reward':
            case 'Staking.Rewarded': {
                assert('staking' in chain.api.events)
                assert('calls' in chain.api)
                assert('staking' in chain.api.calls)

                const e = chain.api.events.staking.Rewarded.decode(ctx, item.event)
                if (e == null) return // skip some old format rewards

                let accountId = encodeAddress(e.stash)

                let validatorId: string | undefined
                let era: number | undefined
                if (item.event.call?.name === 'Staking.payout_stakers') {
                    const c = chain.api.calls.staking.payout_stakers.decode(ctx, item.event.call)
                    validatorId = encodeAddress(c.validatorStash)
                    era = c.era
                }

                actions.push(
                    new EnsureAccount(block, item.event.extrinsic, {
                        account: () => ctx.store.findOneByOrFail(Account, { id: accountId }),
                        id: accountId,
                    }),
                    new RewardAction(block, item.event.extrinsic, {
                        id: item.event.id,
                        accountId,
                        amount: e.amount,
                        era,
                        validatorId,
                    })
                )

                break
            }
            case 'Identity.rename_sub': {
                assert('calls' in chain.api)
                assert('identity' in chain.api.calls)

                if (!item.call.success) break

                const renameSubData = chain.api.calls.identity.rename_sub.decode(ctx, item.call)

                const subId = encodeAddress(renameSubData.sub)

                actions.push(
                    new RenameSubAction(block, item.extrinsic, {
                        sub: () => ctx.store.findOneByOrFail(IdentitySub, { id: subId }),
                        name: unwrapData(renameSubData.data)!,
                    })
                )

                break
            }
            case 'Identity.set_subs': {
                assert('calls' in chain.api)
                assert('identity' in chain.api.calls)

                if (!item.call.success) break

                const setSubsData = chain.api.calls.identity.set_subs.decode(ctx, item.call)

                const origin = getOriginAccountId(item.call.origin)
                if (origin == null) break

                const identityId = encodeAddress(origin)

                for (const subData of setSubsData.subs) {
                    const subId = encodeAddress(subData[0])

                    actions.push(
                        new EnsureAccount(block, item.extrinsic, {
                            account: () => ctx.store.findOneByOrFail(Account, { id: subId }),
                            id: subId,
                        }),
                        new EnsureIdentitySubAction(block, item.extrinsic, {
                            sub: () => ctx.store.findOneByOrFail(IdentitySub, { id: subId }),
                            account: () => ctx.store.findOneByOrFail(Account, { id: subId }),
                            id: subId,
                        }),
                        new AddIdentitySubAction(block, item.extrinsic, {
                            identity: () => ctx.store.findOneByOrFail(Identity, { id: identityId }),
                            sub: () => ctx.store.findOneByOrFail(IdentitySub, { id: subId }),
                        }),
                        new RenameSubAction(block, item.extrinsic, {
                            sub: () => ctx.store.findOneByOrFail(IdentitySub, { id: subId }),
                            name: unwrapData(subData[1]),
                        })
                    )
                }

                break
            }
            case 'Identity.provide_judgement': {
                assert('calls' in chain.api)
                assert('identity' in chain.api.calls)

                if (!item.call.success) break

                const judgementGivenData = chain.api.calls.identity.provide_judgement.decode(ctx, item.call)

                const identityId = encodeAddress(judgementGivenData.target)

                const getJudgment = () => {
                    const kind = judgementGivenData.judgement.__kind
                    switch (kind) {
                        case Judgement.Erroneous:
                        case Judgement.FeePaid:
                        case Judgement.KnownGood:
                        case Judgement.LowQuality:
                        case Judgement.OutOfDate:
                        case Judgement.Reasonable:
                        case Judgement.Unknown:
                            return kind as Judgement
                        default:
                            throw new Error(`Unknown judgement: ${kind}`)
                    }
                }
                const judgement = getJudgment()

                actions.push(
                    new LazyAction(block, item.extrinsic, async (ctx) => {
                        const a: Action[] = []

                        if (block.specId.startsWith('kusama') || block.specId.startsWith('polkadot')) {
                            //[2018825, 3409356, 5926842, 5965153].includes(block.height) &&

                            a.push(
                                new EnsureAccount(block, item.extrinsic, {
                                    account: () => ctx.store.findOneByOrFail(Account, { id: identityId }),
                                    id: identityId,
                                }),
                                new EnsureIdentityAction(block, item.extrinsic, {
                                    identity: () => ctx.store.findOneByOrFail(Identity, { id: identityId }),
                                    account: () => ctx.store.findOneByOrFail(Account, { id: identityId }),
                                    id: identityId,
                                })
                            )
                        }

                        return a
                    }),
                    new GiveJudgementAction(block, item.extrinsic, {
                        identity: () => ctx.store.findOneByOrFail(Identity, { id: identityId }),
                        judgement,
                    })
                )

                break
            }
            case 'Identity.set_identity': {
                assert('calls' in chain.api)
                assert('identity' in chain.api.calls)

                if (!item.call.success) break

                const identitySetData = chain.api.calls.identity.set_identity.decode(ctx, item.call)

                const origin = getOriginAccountId(item.call.origin)
                if (origin == null) break

                const identityId = encodeAddress(origin)

                actions.push(
                    new EnsureAccount(block, item.extrinsic, {
                        account: () => ctx.store.findOneByOrFail(Account, { id: identityId }),
                        id: identityId,
                    }),
                    new EnsureIdentityAction(block, item.extrinsic, {
                        identity: () => ctx.store.findOneByOrFail(Identity, { id: identityId }),
                        account: () => ctx.store.findOneByOrFail(Account, { id: identityId }),
                        id: identityId,
                    }),
                    new GiveJudgementAction(block, item.extrinsic, {
                        identity: () => ctx.store.findOneByOrFail(Identity, { id: identityId }),
                        judgement: Judgement.Unknown,
                    }),
                    new SetIdentityAction(block, item.extrinsic, {
                        identity: () => ctx.store.findOneByOrFail(Identity, { id: identityId }),
                        web: unwrapData(identitySetData.web),
                        display: unwrapData(identitySetData.display),
                        legal: unwrapData(identitySetData.legal),
                        email: unwrapData(identitySetData.email),
                        image: unwrapData(identitySetData.image),
                        pgpFingerprint: identitySetData.pgpFingerprint ? toHex(identitySetData.pgpFingerprint) : null,
                        riot: unwrapData(identitySetData.riot),
                        twitter: unwrapData(identitySetData.twitter),
                        additional: identitySetData.additional.map((a) => ({
                            name: unwrapData(a[0])!,
                            value: unwrapData(a[1]),
                        })),
                    })
                )

                break
            }
            case 'Identity.add_sub': {
                assert('calls' in chain.api)
                assert('identity' in chain.api.calls)

                if (!item.call.success) break

                const subAddedCallData = chain.api.calls.identity.add_sub.decode(ctx, item.call)

                const origin = getOriginAccountId(item.call.origin)
                if (origin == null) break

                const identityId = encodeAddress(origin)
                const subId = encodeAddress(subAddedCallData.sub)

                actions.push(
                    new EnsureAccount(block, item.extrinsic, {
                        account: () => ctx.store.findOneByOrFail(Account, { id: subId }),
                        id: subId,
                    }),
                    new EnsureIdentitySubAction(block, item.extrinsic, {
                        sub: () => ctx.store.findOneByOrFail(IdentitySub, { id: subId }),
                        account: () => ctx.store.findOneByOrFail(Account, { id: subId }),
                        id: subId,
                    }),
                    new AddIdentitySubAction(block, item.extrinsic, {
                        identity: () => ctx.store.findOneByOrFail(Identity, { id: identityId }),
                        sub: () => ctx.store.findOneByOrFail(IdentitySub, { id: subId }),
                    }),
                    new RenameSubAction(block, item.extrinsic, {
                        sub: () => ctx.store.findOneByOrFail(IdentitySub, { id: subId }),
                        name: unwrapData(subAddedCallData.data),
                    })
                )

                break
            }
            case 'Identity.clear_identity': {
                assert('calls' in chain.api)
                assert('identity' in chain.api.calls)

                if (!item.call.success) break

                const origin = getOriginAccountId(item.call.origin)
                if (origin == null) break

                const identityId = encodeAddress(origin)

                actions.push(
                    new ClearIdentityAction(block, item.extrinsic, {
                        identity: () => ctx.store.findOneByOrFail(Identity, { id: identityId, subs: true }),
                    }),
                    new GiveJudgementAction(block, item.extrinsic, {
                        identity: () => ctx.store.findOneByOrFail(Identity, { id: identityId, subs: true }),
                        judgement: Judgement.Unknown,
                    }),
                    new LazyAction(block, item.extrinsic, async (ctx) => {
                        const a: Action[] = []

                        const i = await ctx.store.findOneOrFail(Identity, {
                            where: { id: identityId },
                            relations: { subs: true },
                        })

                        for (const s of i.subs) {
                            new RemoveIdentitySubAction(block, item.extrinsic, {
                                sub: () => Promise.resolve(s),
                            })
                        }

                        return a
                    })
                )

                break
            }
            case 'Identity.kill_identity': {
                assert('calls' in chain.api)
                assert('identity' in chain.api.events)

                if (!item.call.success) break

                const origin = getOriginAccountId(item.call.origin)
                if (origin == null) break

                const identityId = encodeAddress(origin)

                actions.push(
                    new ClearIdentityAction(block, item.extrinsic, {
                        identity: () => ctx.store.findOneByOrFail(Identity, { id: identityId, subs: true }),
                    }),
                    new GiveJudgementAction(block, item.extrinsic, {
                        identity: () => ctx.store.findOneByOrFail(Identity, { id: identityId, subs: true }),
                        judgement: Judgement.Unknown,
                    }),
                    new LazyAction(block, item.extrinsic, async () => {
                        const a: Action[] = []

                        const i = await ctx.store.findOneOrFail(Identity, {
                            where: { id: identityId },
                            relations: { subs: true },
                        })

                        for (const s of i.subs) {
                            new RemoveIdentitySubAction(block, item.extrinsic, {
                                sub: () => Promise.resolve(s),
                            })
                        }

                        return a
                    }),
                    new KillIdentityAction(block, item.extrinsic, {
                        identity: () => ctx.store.findOneByOrFail(Identity, { id: identityId, subs: true }),
                    })
                )

                break
            }
            case 'Identity.IdentitySubRemoved': {
                assert('calls' in chain.api)
                assert('identity' in chain.api.events)

                const subRemovedData = chain.api.events.identity.IdentitySubRemoved.decode(ctx, item.event)

                const subId = encodeAddress(subRemovedData.sub)

                actions.push(
                    new RemoveIdentitySubAction(block, item.event.extrinsic, {
                        sub: async () => ctx.store.findOneByOrFail(IdentitySub, { id: subId }),
                    })
                )

                break
            }
            case 'Identity.IdentitySubRevoked': {
                assert('calls' in chain.api)
                assert('identity' in chain.api.events)

                const subRevokedData = chain.api.events.identity.IdentitySubRevoked.decode(ctx, item.event)

                const subId = encodeAddress(subRevokedData.sub)

                actions.push(
                    new RemoveIdentitySubAction(block, item.event.extrinsic, {
                        sub: () => ctx.store.findOneByOrFail(IdentitySub, { id: subId }),
                    })
                )

                break
            }
        }
    })

    await Action.process(ctx, actions)
})

function unwrapData(data: { __kind: string; value?: Uint8Array }) {
    switch (data.__kind) {
        case 'None':
            return null
        case 'BlakeTwo256':
        case 'Sha256':
        case 'Keccak256':
        case 'ShaThree256':
            return Buffer.from(data.value!).toString('hex')
        default:
            return Buffer.from(data.value!)
                .toString('utf-8')
                .replace(/\u0000/g, '')
    }
}
