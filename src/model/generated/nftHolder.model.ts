import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, ManyToOne as ManyToOne_, Index as Index_} from "typeorm"
import {Account} from "./account.model"
import {NftCollection} from "./nftCollection.model"

@Entity_()
export class NftHolder {
    constructor(props?: Partial<NftHolder>) {
        Object.assign(this, props)
    }

    @PrimaryColumn_()
    id!: string

    @Index_()
    @ManyToOne_(() => Account, {nullable: true})
    account!: Account

    @Column_("int4", {nullable: false})
    balance!: number

    @Index_()
    @ManyToOne_(() => NftCollection, {nullable: true})
    collection!: NftCollection
}
