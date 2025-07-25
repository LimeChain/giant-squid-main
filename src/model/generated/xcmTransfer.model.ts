import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, Index as Index_, ManyToOne as ManyToOne_} from "typeorm"
import * as marshal from "./marshal"
import {Account} from "./account.model"
import {XcmTransferTo} from "./_xcmTransferTo"
import {XcmTransferAssetAmount} from "./_xcmTransferAssetAmount"
import {XcmTransferAsset} from "./_xcmTransferAsset"

@Entity_()
export class XcmTransfer {
    constructor(props?: Partial<XcmTransfer>) {
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
    @ManyToOne_(() => Account, {nullable: true})
    account!: Account

    @Column_("jsonb", {transformer: {to: obj => obj == null ? undefined : obj.toJSON(), from: obj => obj == null ? undefined : new XcmTransferTo(undefined, obj)}, nullable: true})
    to!: XcmTransferTo | undefined | null

    @Column_("text", {nullable: true})
    toChain!: string | undefined | null

    @Column_("jsonb", {transformer: {to: obj => obj == null ? undefined : obj.toJSON(), from: obj => obj == null ? undefined : new XcmTransferAssetAmount(undefined, obj)}, nullable: true})
    amount!: XcmTransferAssetAmount | undefined | null

    @Column_("jsonb", {transformer: {to: obj => obj == null ? undefined : obj.toJSON(), from: obj => obj == null ? undefined : new XcmTransferAsset(undefined, obj)}, nullable: true})
    asset!: XcmTransferAsset | undefined | null

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
