import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, Index as Index_, ManyToOne as ManyToOne_} from "typeorm"
import * as marshal from "./marshal"
import {Parachain} from "./parachain.model"
import {Account} from "./account.model"
import {FullResult} from "./_fullResult"

@Entity_()
export class XcmTransaction {
    constructor(props?: Partial<XcmTransaction>) {
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
    @ManyToOne_(() => Parachain, {nullable: true})
    destination!: Parachain | undefined | null

    @Index_()
    @Column_("int4", {nullable: true})
    parents!: number | undefined | null

    @Index_()
    @Column_("int4", {nullable: false})
    feeAssetItem!: number

    @Index_()
    @ManyToOne_(() => Account, {nullable: true})
    from!: Account | undefined | null

    @Column_("jsonb", {transformer: {to: obj => obj == null ? undefined : obj.toJSON(), from: obj => obj == null ? undefined : new FullResult(undefined, obj)}, nullable: true})
    fullResult!: FullResult | undefined | null
}
