import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, Index as Index_} from "typeorm"

@Entity_()
export class XcmTransferDestination {
    constructor(props?: Partial<XcmTransferDestination>) {
        Object.assign(this, props)
    }

    @PrimaryColumn_()
    id!: string

    @Column_("text", {nullable: false})
    parachain!: string

    @Index_()
    @Column_("int4", {nullable: true})
    parents!: number | undefined | null
}
