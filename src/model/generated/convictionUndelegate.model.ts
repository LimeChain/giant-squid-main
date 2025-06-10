import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, Index as Index_, ManyToOne as ManyToOne_} from "typeorm"
import {Account} from "./account.model"

@Entity_()
export class ConvictionUndelegate {
    constructor(props?: Partial<ConvictionUndelegate>) {
        Object.assign(this, props)
    }

    @PrimaryColumn_()
    id!: string

    @Index_()
    @Column_("text", {nullable: true})
    extrinsicHash!: string | undefined | null

    @Column_("int4", {nullable: false})
    class!: number

    @Index_()
    @ManyToOne_(() => Account, {nullable: true})
    account!: Account
}
