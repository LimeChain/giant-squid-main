import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, Index as Index_, ManyToOne as ManyToOne_} from "typeorm"
import * as marshal from "./marshal"
import {Account} from "./account.model"
import {XTokensTransferAsset} from "./_xTokensTransferAsset"
import {XTokensTransferAssetAmount} from "./_xTokensTransferAssetAmount"

@Entity_()
export class XTokensTransfer {
    constructor(props?: Partial<XTokensTransfer>) {
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

    @Column_("text", {nullable: true})
    to!: string | undefined | null

    @Column_("text", {nullable: true})
    toChain!: string | undefined | null

    @Column_("jsonb", {transformer: {to: obj => obj == null ? undefined : obj.map((val: any) => val == null ? undefined : val.toJSON()), from: obj => obj == null ? undefined : marshal.fromList(obj, val => val == null ? undefined : new XTokensTransferAsset(undefined, val))}, nullable: true})
    assets!: (XTokensTransferAsset | undefined | null)[] | undefined | null

    @Column_("jsonb", {transformer: {to: obj => obj == null ? undefined : obj.map((val: any) => val == null ? undefined : val.toJSON()), from: obj => obj == null ? undefined : marshal.fromList(obj, val => val == null ? undefined : new XTokensTransferAssetAmount(undefined, val))}, nullable: true})
    amounts!: (XTokensTransferAssetAmount | undefined | null)[] | undefined | null

    @Index_()
    @Column_("text", {nullable: false})
    call!: string
}
