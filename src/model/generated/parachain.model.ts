import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, ManyToOne as ManyToOne_, Index as Index_, OneToMany as OneToMany_} from "typeorm"
import {Account} from "./account.model"
import {ParachainStatus} from "./_parachainStatus"
import {Crowdloan} from "./crowdloan.model"

@Entity_()
export class Parachain {
    constructor(props?: Partial<Parachain>) {
        Object.assign(this, props)
    }

    @PrimaryColumn_()
    id!: string

    @Index_()
    @ManyToOne_(() => Account, {nullable: true})
    manager!: Account

    @Column_("varchar", {length: 12, nullable: false})
    status!: ParachainStatus

    @OneToMany_(() => Crowdloan, e => e.parachain)
    crowdloans!: Crowdloan[]
}
