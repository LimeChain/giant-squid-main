import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, ManyToOne as ManyToOne_, Index as Index_, OneToMany as OneToMany_} from "typeorm"
import * as marshal from "./marshal"
import {Staker} from "./staker.model"
import {PoolStatus} from "./_poolStatus"
import {NominationPoolsNominate} from "./nominationPoolsNominate.model"
import {NominationPoolsUnbound} from "./nominationPoolsUnbound.model"
import {NominationPoolsPaidOut} from "./nominationPoolsPaidOut.model"
import {NominationPoolsBond} from "./nominationPoolsBond.model"

@Entity_()
export class Pool {
    constructor(props?: Partial<Pool>) {
        Object.assign(this, props)
    }

    @PrimaryColumn_()
    id!: string

    @Column_("text", {nullable: true})
    name!: string | undefined | null

    @Index_()
    @ManyToOne_(() => Staker, {nullable: true})
    creator!: Staker | undefined | null

    @Index_()
    @ManyToOne_(() => Staker, {nullable: true})
    root!: Staker

    @Index_()
    @ManyToOne_(() => Staker, {nullable: true})
    nominator!: Staker

    @Index_()
    @ManyToOne_(() => Staker, {nullable: true})
    toggler!: Staker

    @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
    totalBonded!: bigint

    @Column_("varchar", {length: 10, nullable: false})
    status!: PoolStatus

    @Column_("text", {array: true, nullable: false})
    members!: (string | undefined | null)[]

    @OneToMany_(() => NominationPoolsNominate, e => e.pool)
    nominations!: NominationPoolsNominate[]

    @OneToMany_(() => NominationPoolsUnbound, e => e.pool)
    unbondings!: NominationPoolsUnbound[]

    @OneToMany_(() => NominationPoolsPaidOut, e => e.pool)
    payouts!: NominationPoolsPaidOut[]

    @OneToMany_(() => NominationPoolsBond, e => e.pool)
    bonds!: NominationPoolsBond[]
}
