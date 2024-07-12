import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, ManyToOne as ManyToOne_, Index as Index_} from "typeorm"
import {Staker} from "./staker.model"
import {Account} from "./account.model"

@Entity_()
export class StakingController {
    constructor(props?: Partial<StakingController>) {
        Object.assign(this, props)
    }

    @PrimaryColumn_()
    id!: string

    @Index_()
    @ManyToOne_(() => Staker, {nullable: true})
    staker!: Staker

    @Index_()
    @ManyToOne_(() => Account, {nullable: true})
    controller!: Account

    @Column_("timestamp with time zone", {nullable: false})
    timestamp!: Date

    @Index_()
    @Column_("int4", {nullable: false})
    blockNumber!: number

    @Index_()
    @Column_("text", {nullable: true})
    extrinsicHash!: string | undefined | null
}
