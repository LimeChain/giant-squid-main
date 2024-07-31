import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, ManyToOne as ManyToOne_, Index as Index_, OneToMany as OneToMany_} from "typeorm"
import * as marshal from "./marshal"
import {Account} from "./account.model"
import {Crowdloan} from "./crowdloan.model"
import {CrowdloanContribution} from "./crowdloanContribution.model"
import {CrowdloanReimbursement} from "./crowdloanReimbursement.model"

@Entity_()
export class CrowdloanContributor {
    constructor(props?: Partial<CrowdloanContributor>) {
        Object.assign(this, props)
    }

    @PrimaryColumn_()
    id!: string

    @Index_()
    @ManyToOne_(() => Account, {nullable: true})
    account!: Account

    @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
    totalContributed!: bigint

    @Column_("bool", {nullable: false})
    reimbursed!: boolean

    @Index_()
    @ManyToOne_(() => Crowdloan, {nullable: true})
    crowdloan!: Crowdloan

    @OneToMany_(() => CrowdloanContribution, e => e.contributor)
    contributions!: CrowdloanContribution[]

    @OneToMany_(() => CrowdloanReimbursement, e => e.contributor)
    reimbursements!: CrowdloanReimbursement[]

    @Column_("timestamp with time zone", {nullable: false})
    timestamp!: Date

    @Index_()
    @Column_("int4", {nullable: false})
    blockNumber!: number
}
