import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, Index as Index_, ManyToOne as ManyToOne_} from "typeorm"
import * as marshal from "./marshal"
import {Account} from "./account.model"
import {Staker} from "./staker.model"

@Entity_()
export class ParachainStakingDelegationIncreased {
    constructor(props?: Partial<ParachainStakingDelegationIncreased>) {
        Object.assign(this, props)
    }

    @PrimaryColumn_()
    id!: string

    @Column_("timestamp with time zone", {nullable: false})
    timestamp!: Date

    @Index_()
    @Column_("int4", {nullable: false})
    blockNumber!: number

    @Index_()
    @Column_("text", {nullable: true})
    extrinsicHash!: string | undefined | null

    @Index_()
    @ManyToOne_(() => Account, {nullable: true})
    account!: Account

    @Index_()
    @ManyToOne_(() => Staker, {nullable: true})
    staker!: Staker

    @Index_()
    @ManyToOne_(() => Account, {nullable: true})
    delegator!: Account

    @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
    amount!: bigint
}
