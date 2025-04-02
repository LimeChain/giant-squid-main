import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, Index as Index_, ManyToOne as ManyToOne_} from "typeorm"
import {XcmTransferDestination} from "./xcmTransferDestination.model"

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
    @ManyToOne_(() => XcmTransferDestination, {nullable: true})
    destination!: XcmTransferDestination

    @Index_()
    @Column_("int4", {nullable: false})
    feeAssetItem!: number

    @Column_("text", {nullable: true})
    from!: string | undefined | null
}
