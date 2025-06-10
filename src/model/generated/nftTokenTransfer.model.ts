import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, ManyToOne as ManyToOne_, Index as Index_} from "typeorm"
import {NFTToken} from "./nftToken.model"
import {NFTTransfer} from "./nftTransfer.model"

@Entity_()
export class NFTTokenTransfer {
    constructor(props?: Partial<NFTTokenTransfer>) {
        Object.assign(this, props)
    }

    @PrimaryColumn_()
    id!: string

    @Index_()
    @ManyToOne_(() => NFTToken, {nullable: true})
    token!: NFTToken

    @Index_()
    @ManyToOne_(() => NFTTransfer, {nullable: true})
    transfer!: NFTTransfer
}
