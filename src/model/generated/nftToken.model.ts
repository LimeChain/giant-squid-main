import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, ManyToOne as ManyToOne_, Index as Index_} from "typeorm"
import {NftCollection} from "./nftCollection.model"
import {NftHolder} from "./nftHolder.model"

@Entity_()
export class NftToken {
    constructor(props?: Partial<NftToken>) {
        Object.assign(this, props)
    }

    @PrimaryColumn_()
    id!: string

    @Index_()
    @ManyToOne_(() => NftCollection, {nullable: true})
    collection!: NftCollection

    @Index_()
    @ManyToOne_(() => NftHolder, {nullable: false})
    owner!: NftHolder

    @Column_("text", {nullable: true})
    metadataIpfs!: string | undefined | null
}
