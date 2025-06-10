import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, ManyToOne as ManyToOne_, Index as Index_} from "typeorm"
import {NFTToken} from "./nftToken.model"

@Entity_()
export class NFTAttribute {
    constructor(props?: Partial<NFTAttribute>) {
        Object.assign(this, props)
    }

    @PrimaryColumn_()
    id!: string

    @Column_("text", {nullable: false})
    key!: string

    @Column_("text", {nullable: false})
    value!: string

    @Index_()
    @ManyToOne_(() => NFTToken, {nullable: true})
    token!: NFTToken
}
