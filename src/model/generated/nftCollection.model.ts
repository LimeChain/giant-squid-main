import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, ManyToOne as ManyToOne_, Index as Index_, OneToMany as OneToMany_} from "typeorm"
import {Account} from "./account.model"
import {NftToken} from "./nftToken.model"

@Entity_()
export class NftCollection {
    constructor(props?: Partial<NftCollection>) {
        Object.assign(this, props)
    }

    @PrimaryColumn_()
    id!: string

    @Index_()
    @ManyToOne_(() => Account, {nullable: true})
    owner!: Account

    @OneToMany_(() => NftToken, e => e.collection)
    tokens!: NftToken[]

    @Column_("text", {nullable: true})
    metadataIpfs!: string | undefined | null
}
