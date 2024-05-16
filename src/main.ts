import assert from 'assert'
import * as ss58 from '@subsquid/ss58'
import { isHex } from '@subsquid/util-internal-hex'
import { TypeormDatabase } from '@subsquid/typeorm-store'
import { decodeHex } from '@subsquid/substrate-processor'
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
import { chain } from './chain'
import { Call, Event, processor } from './processor'
import { getOriginAccountId, processItem } from './utils'
import { Account, Identity, Judgement, IdentitySub } from './model'
import { Action, LazyAction } from './action/base'
import { EnsureAccount, TransferAction, RewardAction } from './action'

processor.run(new TypeormDatabase(), async (ctx) => {
    const actions: Action[] = []

    processItem(ctx.blocks, (block, item) => {
        switch (item.value.name) {
            case 'Balances.Transfer': {
                const event = item.value as Event;
                const data = chain.api.events.balances.Transfer.decode(event)

                const fromId = ss58.codec(chain.config.name).encode(data.from);
                const toId = ss58.codec(chain.config.name).encode(data.to);

                actions.push(
                    new EnsureAccount(block.header, event.extrinsic, {
                        account: () => ctx.store.findOneBy(Account, { id: fromId }),
                        id: fromId,
                    }),
                    new EnsureAccount(block.header, event.extrinsic, {
                        account: () => ctx.store.findOneBy(Account, { id: toId }),
                        id: toId,
                    }),
                    new TransferAction(block.header, event.extrinsic, {
                        id: event.id,
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

                const event = item.value as Event;

                const data = chain.api.events.staking.Rewarded.decode(event)

                if (data == null) return // skip some old format rewards

                let accountId = ss58.codec(chain.config.name).encode(data.stash);

                let validatorId: string | undefined
                let era: number | undefined
                if (event.call?.name === 'Staking.payout_stakers') {
                    const c = chain.api.calls.staking.payout_stakers.decode(event.call)
                    validatorId = ss58.codec(chain.config.name).encode(c.validatorStash);
                    era = c.era
                }

                actions.push(
                    new EnsureAccount(block.header, event.extrinsic, {
                        account: () => ctx.store.findOneBy(Account, { id: accountId }),
                        id: accountId,
                    }),
                    new RewardAction(block.header, event.extrinsic, {
                        id: event.id,
                        accountId,
                        amount: data.amount,
                        era,
                        validatorId,
                    })
                )

                break
            }

            case 'Identity.rename_sub': {
                assert('calls' in chain.api)
                assert('identity' in chain.api.calls)

                const call = item.value as Call;

                if (!call.success) break

                const renameSubData = chain.api.calls.identity.rename_sub.decode(call)

                const subId = ss58.codec(chain.config.name).encode(renameSubData.sub);

                actions.push(
                    new RenameSubAction(block.header, call.extrinsic, {
                        sub: () => ctx.store.findOneByOrFail(IdentitySub, { id: subId }),
                        name: unwrapData(renameSubData.data)!,
                    })
                )

                break
            }

            case 'Identity.set_subs': {
                assert('calls' in chain.api)
                assert('identity' in chain.api.calls)

                const call = item.value as Call;

                if (!call.success) break

                const setSubsData = chain.api.calls.identity.set_subs.decode(call)

                const origin = getOriginAccountId(call.origin)

                if (origin == null) break
                const identityId = ss58.codec(chain.config.name).encode(origin);

                for (const subData of setSubsData.subs) {
                    const subId = ss58.codec(chain.config.name).encode(subData[0]);

                    actions.push(
                        new EnsureAccount(block.header, item.value.extrinsic, {
                            account: () => ctx.store.findOneBy(Account, { id: subId }),
                            id: subId,
                        }),
                        new EnsureAccount(block.header, item.value.extrinsic, {
                            account: () => ctx.store.findOneBy(Account, { id: identityId }),
                            id: identityId,
                        }),
                        new EnsureIdentityAction(block.header, item.value.extrinsic, {
                            identity: () => ctx.store.findOneBy(Identity, { id: identityId }),
                            account: () => ctx.store.findOneByOrFail(Account, { id: identityId }),
                            id: identityId,
                        }),
                        new EnsureIdentitySubAction(block.header, item.value.extrinsic, {
                            sub: () => ctx.store.findOneBy(IdentitySub, { id: subId }),
                            account: () => ctx.store.findOneByOrFail(Account, { id: subId }),
                            id: subId,
                        }),
                        new AddIdentitySubAction(block.header, item.value.extrinsic, {
                            identity: () => ctx.store.findOneByOrFail(Identity, { id: identityId }),
                            sub: () => ctx.store.findOneByOrFail(IdentitySub, { id: subId }),
                        }),
                        new RenameSubAction(block.header, item.value.extrinsic, {
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

                const call = item.value as Call;

                if (!call.success) break

                const judgementGivenData = chain.api.calls.identity.provide_judgement.decode(call)

                const identityId = ss58.codec(chain.config.name).encode(judgementGivenData.target);

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
                    new LazyAction(block.header, item.value.extrinsic, async (ctx) => {
                        const a: Action[] = []

                        if (block.header.specName.startsWith('kusama') || block.header.specName.startsWith('polkadot')) {
                            //[2018825, 3409356, 5926842, 5965153].includes(block.height) &&

                            a.push(
                                new EnsureAccount(block.header, item.value.extrinsic, {
                                    account: () => ctx.store.findOneBy(Account, { id: identityId }),
                                    id: identityId,
                                }),
                                new EnsureIdentityAction(block.header, item.value.extrinsic, {
                                    identity: () => ctx.store.findOneBy(Identity, { id: identityId }),
                                    account: () => ctx.store.findOneByOrFail(Account, { id: identityId }),
                                    id: identityId,
                                })
                            )
                        }

                        return a
                    }),
                    new GiveJudgementAction(block.header, item.value.extrinsic, {
                        identity: () => ctx.store.findOneByOrFail(Identity, { id: identityId }),
                        judgement,
                    })
                )

                break
            }
            case 'Identity.set_identity': {
                assert('calls' in chain.api)
                assert('identity' in chain.api.calls)

                const call = item.value as Call;

                if (!call.success) break

                const identitySetData = chain.api.calls.identity.set_identity.decode(call)
                const origin = getOriginAccountId(call.origin)

                if (origin == null) break

                const identityId = ss58.codec(chain.config.name).encode(origin);

                actions.push(
                    new EnsureAccount(block.header, item.value.extrinsic, {
                        account: () => ctx.store.findOneBy(Account, { id: identityId }),
                        id: identityId,
                    }),
                    new EnsureIdentityAction(block.header, item.value.extrinsic, {
                        identity: () => ctx.store.findOneBy(Identity, { id: identityId }),
                        account: () => ctx.store.findOneByOrFail(Account, { id: identityId }),
                        id: identityId,
                    }),
                    new GiveJudgementAction(block.header, item.value.extrinsic, {
                        identity: () => ctx.store.findOneByOrFail(Identity, { id: identityId }),
                        judgement: Judgement.Unknown,
                    }),
                    new SetIdentityAction(block.header, item.value.extrinsic, {
                        identity: () => ctx.store.findOneByOrFail(Identity, { id: identityId }),
                        web: unwrapData(identitySetData.web),
                        display: unwrapData(identitySetData.display),
                        legal: unwrapData(identitySetData.legal),
                        email: unwrapData(identitySetData.email),
                        image: unwrapData(identitySetData.image),
                        pgpFingerprint: identitySetData.pgpFingerprint ?? null,
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

                const call = item.value as Call;

                if (!call.success) break

                const subAddedCallData = chain.api.calls.identity.add_sub.decode(call)

                const origin = getOriginAccountId(call.origin)
                if (origin == null) break

                const identityId = ss58.codec(chain.config.name).encode(origin);

                const subId = ss58.codec(chain.config.name).encode(subAddedCallData.sub);

                actions.push(
                    new EnsureAccount(block.header, item.value.extrinsic, {
                        account: () => ctx.store.findOneBy(Account, { id: subId }),
                        id: subId,
                    }),
                    new EnsureIdentitySubAction(block.header, item.value.extrinsic, {
                        sub: () => ctx.store.findOneBy(IdentitySub, { id: subId }),
                        account: () => ctx.store.findOneByOrFail(Account, { id: subId }),
                        id: subId,
                    }),
                    new AddIdentitySubAction(block.header, item.value.extrinsic, {
                        identity: () => ctx.store.findOneByOrFail(Identity, { id: identityId }),
                        sub: () => ctx.store.findOneByOrFail(IdentitySub, { id: subId }),
                    }),
                    new RenameSubAction(block.header, item.value.extrinsic, {
                        sub: () => ctx.store.findOneByOrFail(IdentitySub, { id: subId }),
                        name: unwrapData(subAddedCallData.data),
                    })
                )

                break
            }

            case 'Identity.clear_identity': {
                assert('calls' in chain.api)
                assert('identity' in chain.api.calls)

                const call = item.value as Call;

                if (!call.success) break

                const origin = getOriginAccountId(call.origin)
                if (origin == null) break

                const identityId = ss58.codec(chain.config.name).encode(origin);

                actions.push(
                    new ClearIdentityAction(block.header, call.extrinsic, {
                        identity: () => ctx.store.findOneByOrFail(Identity, { id: identityId, subs: true }),
                    }),
                    new GiveJudgementAction(block.header, call.extrinsic, {
                        identity: () => ctx.store.findOneByOrFail(Identity, { id: identityId, subs: true }),
                        judgement: Judgement.Unknown,
                    }),
                    new LazyAction(block.header, call.extrinsic, async (ctx) => {
                        const a: Action[] = []

                        const i = await ctx.store.findOneOrFail(Identity, {
                            where: { id: identityId },
                            relations: { subs: true },
                        })

                        for (const s of i.subs) {
                            new RemoveIdentitySubAction(block.header, call.extrinsic, {
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

                const call = item.value as Call;

                if (!call.success) break

                const origin = getOriginAccountId(call.origin)
                if (origin == null) break

                const identityId = ss58.codec(chain.config.name).encode(origin);

                actions.push(
                    new ClearIdentityAction(block.header, call.extrinsic, {
                        identity: () => ctx.store.findOneByOrFail(Identity, { id: identityId, subs: true }),
                    }),
                    new GiveJudgementAction(block.header, call.extrinsic, {
                        identity: () => ctx.store.findOneByOrFail(Identity, { id: identityId, subs: true }),
                        judgement: Judgement.Unknown,
                    }),
                    new LazyAction(block.header, call.extrinsic, async () => {
                        const a: Action[] = []

                        const i = await ctx.store.findOneOrFail(Identity, {
                            where: { id: identityId },
                            relations: { subs: true },
                        })

                        for (const s of i.subs) {
                            new RemoveIdentitySubAction(block.header, call.extrinsic, {
                                sub: () => Promise.resolve(s),
                            })
                        }

                        return a
                    }),
                    new KillIdentityAction(block.header, call.extrinsic, {
                        identity: () => ctx.store.findOneByOrFail(Identity, { id: identityId, subs: true }),
                    })
                )

                break
            }

            case 'Identity.SubIdentityRemoved': {
                assert('calls' in chain.api)
                assert('identity' in chain.api.events)

                const event = item.value as Event;
                const subRemovedData = chain.api.events.identity.IdentitySubRemoved.decode(event)

                const subId = ss58.codec(chain.config.name).encode(subRemovedData.sub);

                actions.push(
                    new EnsureAccount(block.header, item.value.extrinsic, {
                        account: () => ctx.store.findOneBy(Account, { id: subId }),
                        id: subId,
                    }),
                    new EnsureIdentitySubAction(block.header, item.value.extrinsic, {
                        sub: () => ctx.store.findOneBy(IdentitySub, { id: subId }),
                        account: () => ctx.store.findOneByOrFail(Account, { id: subId }),
                        id: subId,
                    }),
                    new RemoveIdentitySubAction(block.header, event.extrinsic, {
                        sub: () => ctx.store.findOneByOrFail(IdentitySub, { id: subId })
                    })
                )

                break
            }

            case 'Identity.IdentitySubRevoked': {
                assert('calls' in chain.api)
                assert('identity' in chain.api.events)

                const event = item.value as Event;
                const subRevokedData = chain.api.events.identity.IdentitySubRevoked.decode(event)

                const subId = ss58.codec(chain.config.name).encode(subRevokedData.sub);

                actions.push(
                    new EnsureAccount(block.header, item.value.extrinsic, {
                        account: () => ctx.store.findOneBy(Account, { id: subId }),
                        id: subId,
                    }),
                    new EnsureIdentitySubAction(block.header, item.value.extrinsic, {
                        sub: () => ctx.store.findOneBy(IdentitySub, { id: subId }),
                        account: () => ctx.store.findOneByOrFail(Account, { id: subId }),
                        id: subId,
                    }),
                    new RemoveIdentitySubAction(block.header, event.extrinsic, {
                        sub: () => ctx.store.findOneByOrFail(IdentitySub, { id: subId }),
                    })
                )

                break
            }
        }
    })

    await Action.process(ctx, actions)
})

function unwrapData(data: { __kind: string; value?: string }) {
    switch (data.__kind) {
        case 'None':
            return null
        case 'BlakeTwo256':
        case 'Sha256':
        case 'Keccak256':
        case 'ShaThree256':
            return Buffer.from(data.value!).toString('hex')
        default: {
            let unwrapped = '';
            if (isHex(data.value)) {
                unwrapped = decodeHex(data.value).toString('utf-8')
            } else {
                unwrapped = Buffer.from(data.value!)
                    .toString('utf-8')
            }

            return unwrapped.replace(/\u0000/g, '')
        }
    }
}
