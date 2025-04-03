import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, Index as Index_, ManyToOne as ManyToOne_} from "typeorm"
import {XcmTransferBeneficiaryKey} from "./xcmTransferBeneficiaryKey.model"

@Entity_()
export class XcmTransferBeneficiary {
    constructor(props?: Partial<XcmTransferBeneficiary>) {
        Object.assign(this, props)
    }

    @PrimaryColumn_()
    id!: string

    @Index_()
    @Column_("int4", {nullable: true})
    parents!: number | undefined | null

    @Index_()
    @ManyToOne_(() => XcmTransferBeneficiaryKey, {nullable: true})
    key!: XcmTransferBeneficiaryKey | undefined | null
}
