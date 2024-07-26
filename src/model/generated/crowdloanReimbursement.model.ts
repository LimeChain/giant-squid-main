import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, ManyToOne as ManyToOne_, Index as Index_} from "typeorm"
import * as marshal from "./marshal"
import {Crowdloan} from "./crowdloan.model"
import {CrowdloanContributor} from "./crowdloanContributor.model"
import {CrowdloanReimbursementType} from "./_crowdloanReimbursementType"

@Entity_()
export class CrowdloanReimbursement {
    constructor(props?: Partial<CrowdloanReimbursement>) {
        Object.assign(this, props)
    }

    @PrimaryColumn_()
    id!: string

    @Index_()
    @ManyToOne_(() => Crowdloan, {nullable: true})
    crowdloan!: Crowdloan

    @Index_()
    @ManyToOne_(() => CrowdloanContributor, {nullable: true})
    contributor!: CrowdloanContributor

    @Column_("varchar", {length: 8, nullable: false})
    type!: CrowdloanReimbursementType

    @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
    amount!: bigint

    @Column_("timestamp with time zone", {nullable: false})
    timestamp!: Date

    @Index_()
    @Column_("int4", {nullable: false})
    blockNumber!: number

    @Index_()
    @Column_("text", {nullable: true})
    extrinsicHash!: string | undefined | null
}
