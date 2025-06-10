import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, Index as Index_, ManyToOne as ManyToOne_} from "typeorm"
import * as marshal from "./marshal"
import {Account} from "./account.model"
import {PolkadotXcmTransferTo} from "./_polkadotXcmTransferTo"
import {PolkadotXcmTransferAssetAmount} from "./_polkadotXcmTransferAssetAmount"
import {PolkadotXcmTransferAsset} from "./_polkadotXcmTransferAsset"

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
    @ManyToOne_(() => Account, {nullable: true})
    account!: Account

    @Column_("jsonb", {transformer: {to: obj => obj == null ? undefined : obj.toJSON(), from: obj => obj == null ? undefined : new PolkadotXcmTransferTo(undefined, obj)}, nullable: true})
    to!: PolkadotXcmTransferTo | undefined | null

    @Column_("text", {nullable: true})
    toChain!: string | undefined | null

    @Column_("jsonb", {transformer: {to: obj => obj == null ? undefined : obj.toJSON(), from: obj => obj == null ? undefined : new PolkadotXcmTransferAssetAmount(undefined, obj)}, nullable: true})
    amount!: PolkadotXcmTransferAssetAmount | undefined | null

    @Column_("jsonb", {transformer: {to: obj => obj == null ? undefined : obj.toJSON(), from: obj => obj == null ? undefined : new PolkadotXcmTransferAsset(undefined, obj)}, nullable: true})
    asset!: PolkadotXcmTransferAsset | undefined | null

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
