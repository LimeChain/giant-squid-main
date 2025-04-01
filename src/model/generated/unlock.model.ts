import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, ManyToOne as ManyToOne_, Index as Index_} from "typeorm"
import {Account} from "./account.model"

@Entity_()
export class Unlock {
    constructor(props?: Partial<Unlock>) {
        Object.assign(this, props)
    }

    @PrimaryColumn_()
    id!: string

    @Column_("int4", {nullable: true})
    class!: number | undefined | null

    @Index_()
    @ManyToOne_(() => Account, {nullable: true})
    target!: Account
}
