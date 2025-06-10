import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, ManyToOne as ManyToOne_, Index as Index_, OneToOne as OneToOne_, JoinColumn as JoinColumn_} from "typeorm"
import {Identity} from "./identity.model"
import {Account} from "./account.model"

@Entity_()
export class IdentitySub {
    constructor(props?: Partial<IdentitySub>) {
        Object.assign(this, props)
    }

    @PrimaryColumn_()
    id!: string

    @Index_()
    @ManyToOne_(() => Identity, {nullable: true})
    super!: Identity | undefined | null

    @Index_({unique: true})
    @OneToOne_(() => Account, {nullable: true})
    @JoinColumn_()
    account!: Account

    @Column_("text", {nullable: true})
    name!: string | undefined | null
}
