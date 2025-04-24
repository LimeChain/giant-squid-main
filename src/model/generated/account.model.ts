import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, Index as Index_, OneToMany as OneToMany_} from "typeorm"
import {Transfer} from "./transfer.model"
import {IdentitySub} from "./identitySub.model"
import {Identity} from "./identity.model"
import {Staker} from "./staker.model"
import {StakingReward} from "./stakingReward.model"
import {XcmTransfer} from "./xcmTransfer.model"
import {PolkadotXcmTransfer} from "./polkadotXcmTransfer.model"

@Entity_()
export class Account {
    constructor(props?: Partial<Account>) {
        Object.assign(this, props)
    }

    @PrimaryColumn_()
    id!: string

    @Index_()
    @Column_("text", {nullable: false})
    publicKey!: string

    @OneToMany_(() => Transfer, e => e.account)
    transfers!: Transfer[]




    @OneToMany_(() => StakingReward, e => e.account)
    rewards!: StakingReward[]

    @OneToMany_(() => XcmTransfer, e => e.account)
    xcmTransfers!: XcmTransfer[]

    @OneToMany_(() => PolkadotXcmTransfer, e => e.account)
    polkadotXcmTransfers!: PolkadotXcmTransfer[]
}
