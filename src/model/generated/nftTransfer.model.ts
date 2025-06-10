import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, Index as Index_, ManyToOne as ManyToOne_, OneToMany as OneToMany_} from "typeorm"
import {Account} from "./account.model"
import {NFTTokenTransfer} from "./nftTokenTransfer.model"
import {NFTCollection} from "./nftCollection.model"

@Entity_()
export class NFTTransfer {
    constructor(props?: Partial<NFTTransfer>) {
        Object.assign(this, props)
    }

    @PrimaryColumn_()
    id!: string

    @Column_("timestamp with time zone", {nullable: false})
    timestamp!: Date

    @Index_()
    @Column_("int4", {nullable: false})
    blockNumber!: number

    @Index_()
    @Column_("text", {nullable: false})
    extrinsicHash!: string

    @Index_()
    @ManyToOne_(() => Account, {nullable: true})
    from!: Account

    @Index_()
    @ManyToOne_(() => Account, {nullable: true})
    to!: Account

    @OneToMany_(() => NFTTokenTransfer, e => e.transfer)
    tokens!: NFTTokenTransfer[]

    @Index_()
    @ManyToOne_(() => NFTCollection, {nullable: true})
    collection!: NFTCollection
}
