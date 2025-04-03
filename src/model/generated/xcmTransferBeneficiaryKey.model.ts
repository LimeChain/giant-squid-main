import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, Index as Index_} from "typeorm"

@Entity_()
export class XcmTransferBeneficiaryKey {
    constructor(props?: Partial<XcmTransferBeneficiaryKey>) {
        Object.assign(this, props)
    }

    @PrimaryColumn_()
    id!: string

    @Index_()
    @Column_("text", {nullable: false})
    kind!: string

    @Index_()
    @Column_("text", {nullable: false})
    value!: string
}
