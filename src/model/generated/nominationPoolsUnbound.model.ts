import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, Index as Index_, ManyToOne as ManyToOne_} from "typeorm"
import * as marshal from "./marshal"
import {Pool} from "./pool.model"
import {Staker} from "./staker.model"

@Entity_()
export class NominationPoolsUnbound {
    constructor(props?: Partial<NominationPoolsUnbound>) {
        Object.assign(this, props)
    }

    @PrimaryColumn_()
    id!: string

    @Index_()
    @Column_("int4", {nullable: false})
    blockNumber!: number

    @Index_()
    @Column_("text", {nullable: true})
    extrinsicHash!: string | undefined | null

    @Index_()
    @ManyToOne_(() => Pool, {nullable: true})
    pool!: Pool

    @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
    balance!: bigint

    @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
    points!: bigint

    @Column_("int4", {nullable: false})
    era!: number

    @Index_()
    @ManyToOne_(() => Staker, {nullable: true})
    staker!: Staker
}
