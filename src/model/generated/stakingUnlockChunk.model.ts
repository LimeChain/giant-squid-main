import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, Index as Index_, ManyToOne as ManyToOne_} from "typeorm"
import * as marshal from "./marshal"
import {Staker} from "./staker.model"

@Entity_()
export class StakingUnlockChunk {
    constructor(props?: Partial<StakingUnlockChunk>) {
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
    @ManyToOne_(() => Staker, {nullable: true})
    staker!: Staker

    @Column_("int4", {nullable: false})
    lockedUntilEra!: number

    @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
    amount!: bigint

    @Column_("bool", {nullable: false})
    withdrawn!: boolean
}
