import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, Index as Index_, ManyToOne as ManyToOne_, OneToMany as OneToMany_} from "typeorm"
import {NFTCollection} from "./nftCollection.model"
import {Account} from "./account.model"
import {NFTTokenStandard} from "./_nftTokenStandard"
import {NFTTokenTransfer} from "./nftTokenTransfer.model"
import {NFTAttribute} from "./nftAttribute.model"

@Entity_()
export class NFTToken {
    constructor(props?: Partial<NFTToken>) {
        Object.assign(this, props)
    }

    @PrimaryColumn_()
    id!: string

    @Index_()
    @Column_("text", {nullable: false})
    tokenId!: string

    @Index_()
    @ManyToOne_(() => NFTCollection, {nullable: true})
    collection!: NFTCollection

    @Index_()
    @ManyToOne_(() => Account, {nullable: true})
    owner!: Account

    @Column_("text", {nullable: true})
    metadataUri!: string | undefined | null

    @Column_("varchar", {length: 7, nullable: true})
    standard!: NFTTokenStandard | undefined | null

    @OneToMany_(() => NFTTokenTransfer, e => e.token)
    transfers!: NFTTokenTransfer[]

    @OneToMany_(() => NFTAttribute, e => e.token)
    attributes!: NFTAttribute[]
}
