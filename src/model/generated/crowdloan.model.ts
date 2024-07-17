import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, ManyToOne as ManyToOne_, Index as Index_} from "typeorm"
import * as marshal from "./marshal"
import {Account} from "./account.model"
import {CrowdloanStatus} from "./_crowdloanStatus"

@Entity_()
export class Crowdloan {
    constructor(props?: Partial<Crowdloan>) {
        Object.assign(this, props)
    }

    @PrimaryColumn_()
    id!: string

    @Index_()
    @ManyToOne_(() => Account, {nullable: true})
    manager!: Account

    @Column_("varchar", {length: 9, nullable: false})
    status!: CrowdloanStatus

    @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
    cap!: bigint

    @Column_("int4", {nullable: false})
    firstPeriod!: number

    @Column_("int4", {nullable: false})
    lastPeriod!: number

    @Column_("int4", {nullable: false})
    endBlock!: number

    @Index_()
    @Column_("int4", {nullable: false})
    startBlock!: number

    @Column_("timestamp with time zone", {nullable: false})
    timestamp!: Date

    @Index_()
    @Column_("text", {nullable: true})
    extrinsicHash!: string | undefined | null
}
