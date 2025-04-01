import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_} from "typeorm"

@Entity_()
export class Delegate {
    constructor(props?: Partial<Delegate>) {
        Object.assign(this, props)
    }

    @PrimaryColumn_()
    id!: string

    @Column_("int4", {nullable: true})
    class!: number | undefined | null

    @Column_("text", {nullable: true})
    to!: string | undefined | null

    @Column_("text", {nullable: true})
    conviction!: string | undefined | null

    @Column_("text", {nullable: true})
    balance!: string | undefined | null
}
