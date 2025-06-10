import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, ManyToOne as ManyToOne_, Index as Index_} from "typeorm"
import {Account} from "./account.model"
import {NFTCollection} from "./nftCollection.model"

@Entity_()
export class NFTHolder {
    constructor(props?: Partial<NFTHolder>) {
        Object.assign(this, props)
    }

    @PrimaryColumn_()
    id!: string

    @Index_()
    @ManyToOne_(() => Account, {nullable: true})
    account!: Account

    @Column_("int4", {nullable: false})
    nftCount!: number

    @Index_()
    @ManyToOne_(() => NFTCollection, {nullable: true})
    collection!: NFTCollection
}
