import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, ManyToOne as ManyToOne_, Index as Index_} from "typeorm"
import * as marshal from "./marshal"
import {Parachain} from "./parachain.model"
import {CrowdloanStatus} from "./_crowdloanStatus"

@Entity_()
export class Crowdloan {
    constructor(props?: Partial<Crowdloan>) {
        Object.assign(this, props)
    }

    @PrimaryColumn_()
    id!: string

    @Index_()
    @ManyToOne_(() => Parachain, {nullable: true})
    parachain!: Parachain

    @Column_("varchar", {length: 9, nullable: false})
    status!: CrowdloanStatus

    @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
    raised!: bigint

    @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
    cap!: bigint

    @Column_("int4", {nullable: false})
    leasePeriodStart!: number

    @Column_("int4", {nullable: false})
    leasePeriodEnd!: number

    @Column_("int4", {nullable: false})
    endBlock!: number

    @Index_()
    @Column_("int4", {nullable: false})
    startBlock!: number
}
