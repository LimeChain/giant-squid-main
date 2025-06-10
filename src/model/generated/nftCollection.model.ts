import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, ManyToOne as ManyToOne_, Index as Index_, OneToMany as OneToMany_} from "typeorm"
import {Account} from "./account.model"
import {NFTHolder} from "./nftHolder.model"
import {NFTToken} from "./nftToken.model"
import {NFTTransfer} from "./nftTransfer.model"

@Entity_()
export class NFTCollection {
    constructor(props?: Partial<NFTCollection>) {
        Object.assign(this, props)
    }

    @PrimaryColumn_()
    id!: string

    @Column_("text", {nullable: true})
    metadataUri!: string | undefined | null

    @Index_()
    @ManyToOne_(() => Account, {nullable: true})
    owner!: Account | undefined | null

    @OneToMany_(() => NFTHolder, e => e.collection)
    holders!: NFTHolder[]

    @OneToMany_(() => NFTToken, e => e.collection)
    tokens!: NFTToken[]

    @OneToMany_(() => NFTTransfer, e => e.collection)
    transfers!: NFTTransfer[]
}
