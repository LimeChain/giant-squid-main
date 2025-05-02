import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_} from "typeorm"

@Entity_()
export class ConvictionUnlock {
    constructor(props?: Partial<ConvictionUnlock>) {
        Object.assign(this, props)
    }

    @PrimaryColumn_()
    id!: string

    @Column_("int4", {nullable: false})
    class!: number

    @Column_("text", {nullable: false})
    target!: string
}
