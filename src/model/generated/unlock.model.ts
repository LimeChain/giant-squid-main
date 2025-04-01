import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_} from "typeorm"

@Entity_()
export class Unlock {
    constructor(props?: Partial<Unlock>) {
        Object.assign(this, props)
    }

    @PrimaryColumn_()
    id!: string

    @Column_("int4", {nullable: true})
    class!: number | undefined | null

    @Column_("text", {nullable: true})
    target!: string | undefined | null
}
