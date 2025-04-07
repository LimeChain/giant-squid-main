import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, Index as Index_, ManyToOne as ManyToOne_} from "typeorm"
import * as marshal from "./marshal"
import {Account} from "./account.model"
import {ConvictionVoteField} from "./_convictionVoteField"

@Entity_()
export class ConvictionVote {
    constructor(props?: Partial<ConvictionVote>) {
        Object.assign(this, props)
    }

    @PrimaryColumn_()
    id!: string

    @Index_()
    @Column_("text", {nullable: true})
    extrinsicHash!: string | undefined | null

    @Index_()
    @ManyToOne_(() => Account, {nullable: true})
    who!: Account

    @Column_("int4", {nullable: true})
    pollIndex!: number | undefined | null

    @Column_("jsonb", {transformer: {to: obj => obj.toJSON(), from: obj => obj == null ? undefined : new ConvictionVoteField(undefined, obj)}, nullable: false})
    vote!: ConvictionVoteField
}
