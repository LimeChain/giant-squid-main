import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, ManyToOne as ManyToOne_, Index as Index_} from "typeorm"
import {Staker} from "./staker.model"
import {Account} from "./account.model"
import {RewardDestination} from "./_rewardDestination"

@Entity_()
export class StakingPayee {
    constructor(props?: Partial<StakingPayee>) {
        Object.assign(this, props)
    }

    @PrimaryColumn_()
    id!: string

    @Index_()
    @ManyToOne_(() => Staker, {nullable: true})
    staker!: Staker

    @Index_()
    @ManyToOne_(() => Account, {nullable: true})
    account!: Account | undefined | null

    @Column_("varchar", {length: 10, nullable: false})
    type!: RewardDestination
}
