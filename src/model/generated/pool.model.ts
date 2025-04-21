import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, OneToMany as OneToMany_} from "typeorm"
import * as marshal from "./marshal"
import {PoolStatus} from "./_poolStatus"
import {Staker} from "./staker.model"

@Entity_()
export class Pool {
    constructor(props?: Partial<Pool>) {
        Object.assign(this, props)
    }

    @PrimaryColumn_()
    id!: string

    @Column_("text", {nullable: true})
    name!: string | undefined | null

    @Column_("text", {nullable: true})
    stash!: string | undefined | null

    @Column_("text", {nullable: true})
    reward!: string | undefined | null

    @Column_("text", {nullable: true})
    creator!: string | undefined | null

    @Column_("text", {nullable: true})
    root!: string | undefined | null

    @Column_("text", {nullable: true})
    toggler!: string | undefined | null

    @Column_("text", {nullable: true})
    nominator!: string | undefined | null

    @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: true})
    totalBonded!: bigint | undefined | null

    @Column_("varchar", {length: 9, nullable: true})
    status!: PoolStatus | undefined | null

    @OneToMany_(() => Staker, e => e.pool)
    members!: Staker[]
}
