import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, OneToOne as OneToOne_, Index as Index_, JoinColumn as JoinColumn_, ManyToOne as ManyToOne_, OneToMany as OneToMany_} from "typeorm"
import * as marshal from "./marshal"
import {Account} from "./account.model"
import {StakingPayee} from "./stakingPayee.model"
import {StakingUnlockChunk} from "./stakingUnlockChunk.model"

@Entity_()
export class Staker {
    constructor(props?: Partial<Staker>) {
        Object.assign(this, props)
    }

    @PrimaryColumn_()
    id!: string

    @Index_({unique: true})
    @OneToOne_(() => Account, {nullable: true})
    @JoinColumn_()
    stash!: Account

    @Index_()
    @ManyToOne_(() => Account, {nullable: true})
    controller!: Account | undefined | null

    @Index_()
    @ManyToOne_(() => StakingPayee, {nullable: true})
    payee!: StakingPayee | undefined | null

    @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
    activeBonded!: bigint

    @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
    totalBonded!: bigint

    @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
    totalUnbonded!: bigint

    @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
    totalWithdrawn!: bigint

    @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
    totalSlashed!: bigint

    @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
    totalRewarded!: bigint

    @OneToMany_(() => StakingPayee, e => e.staker)
    payees!: StakingPayee[]

    @OneToMany_(() => StakingUnlockChunk, e => e.staker)
    unlockings!: StakingUnlockChunk[]
}
