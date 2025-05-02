import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, Index as Index_, ManyToOne as ManyToOne_} from "typeorm"
import * as marshal from "./marshal"
import {Account} from "./account.model"

@Entity_()
export class PolkadotXcmTransfer {
    constructor(props?: Partial<PolkadotXcmTransfer>) {
        Object.assign(this, props)
    }

    @PrimaryColumn_()
    id!: string

    @Index_()
    @Column_("int4", {nullable: false})
    blockNumber!: number

    @Index_()
    @Column_("timestamp with time zone", {nullable: false})
    timestamp!: Date

    @Index_()
    @Column_("text", {nullable: true})
    extrinsicHash!: string | undefined | null

    @Index_()
    @Column_("int4", {nullable: false})
    feeAssetItem!: number

    @Index_()
    @ManyToOne_(() => Account, {nullable: true})
    account!: Account

    @Column_("text", {nullable: true})
    to!: string | undefined | null

    @Index_()
    @Column_("text", {nullable: true})
    toChain!: string | undefined | null

    @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: true})
    amount!: bigint | undefined | null

    @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: true})
    weightLimit!: bigint | undefined | null

    @Index_()
    @Column_("text", {nullable: false})
    call!: string

    @Index_()
    @Column_("text", {nullable: true})
    contractCalled!: string | undefined | null

    @Column_("text", {nullable: true})
    contractInput!: string | undefined | null
}
