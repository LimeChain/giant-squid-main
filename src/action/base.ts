import assert from 'assert'
import {DataHandlerContext, SubstrateBlock, SubstrateExtrinsic} from '@subsquid/substrate-processor'
import {withErrorContext} from '@subsquid/util-internal'
import { Store } from '@subsquid/typeorm-store'

export type ActionContext = DataHandlerContext<Store, unknown>

export abstract class Action<T = unknown> {
    static async process(ctx: ActionContext, actions: Action[]) {
        for (const action of actions) {
            const actionCtx = {
                ...ctx,
                log: ctx.log.child('actions', {
                    block: action.block.height,
                    extrinsic: action.extrinsic?.hash,
                }),
            }

            await action.perform(actionCtx).catch(
                withErrorContext({
                    block: action.block.height,
                    extrinsicHash: action.extrinsic?.hash,
                })
            )
        }
    }

    protected performed = false

    constructor(
        readonly block: Pick<SubstrateBlock, 'id' | 'hash' | 'height' | 'timestamp'>,
        readonly extrinsic: Pick<SubstrateExtrinsic, 'id' | 'hash'> | undefined,
        readonly data: T
    ) {}

    async perform(ctx: ActionContext): Promise<void> {
        assert(!this.performed)
        await this._perform(ctx)
        this.performed = true
    }

    protected abstract _perform(ctx: ActionContext): Promise<void>
}

export class LazyAction extends Action {
    constructor(
        readonly block: Pick<SubstrateBlock, 'id' | 'hash' | 'height' | 'timestamp'>,
        readonly extrinsic: Pick<SubstrateExtrinsic, 'id' | 'hash'> | undefined,
        readonly cb: (ctx: ActionContext) => Promise<Action[]>
    ) {
        super(block, extrinsic, {})
    }

    protected async _perform(ctx: DataHandlerContext<Store, {}>): Promise<void> {
        const actions = await this.cb(ctx)
        await Action.process(ctx, actions)
    }
}
