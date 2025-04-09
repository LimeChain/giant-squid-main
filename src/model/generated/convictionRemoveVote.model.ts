import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, Index as Index_, ManyToOne as ManyToOne_} from "typeorm"
import {Account} from "./account.model"

@Entity_()
export class ConvictionRemoveVote {
    constructor(props?: Partial<ConvictionRemoveVote>) {
        Object.assign(this, props)
    }

    @PrimaryColumn_()
    id!: string

    @Index_()
    @Column_("text", {nullable: true})
    extrinsicHash!: string | undefined | null

    @Column_("int4", {nullable: false})
    class!: number

    @Column_("int4", {nullable: true})
    index!: number | undefined | null

    @Index_()
    @ManyToOne_(() => Account, {nullable: true})
    who!: Account | undefined | null
}
