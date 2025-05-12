import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, ManyToOne as ManyToOne_, Index as Index_} from "typeorm"
import * as marshal from "./marshal"
import {Staker} from "./staker.model"

@Entity_()
export class StakingEraReward {
    constructor(props?: Partial<StakingEraReward>) {
        Object.assign(this, props)
    }

    @PrimaryColumn_()
    id!: string

    @Index_()
    @ManyToOne_(() => Staker, {nullable: true})
    staker!: Staker

    @Column_("int4", {nullable: false})
    era!: number

    @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
    totalRewarded!: bigint

    @Column_("text", {nullable: false})
    returnPercentage!: string
}
