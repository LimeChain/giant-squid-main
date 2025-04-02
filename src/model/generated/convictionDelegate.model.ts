import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_} from "typeorm"
import * as marshal from "./marshal"

@Entity_()
export class ConvictionDelegate {
    constructor(props?: Partial<ConvictionDelegate>) {
        Object.assign(this, props)
    }

    @PrimaryColumn_()
    id!: string

    @Column_("int4", {nullable: false})
    class!: number

    @Column_("text", {nullable: false})
    to!: string

    @Column_("text", {nullable: false})
    conviction!: string

    @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
    balance!: bigint
}
