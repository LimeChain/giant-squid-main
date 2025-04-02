import assert from "assert"
import * as marshal from "./marshal"

export class ConvictionVoteField {
    private _aye!: bigint | undefined | null
    private _nay!: bigint | undefined | null
    private _abstain!: bigint | undefined | null
    private _vote!: number | undefined | null
    private _balance!: bigint | undefined | null

    constructor(props?: Partial<Omit<ConvictionVoteField, 'toJSON'>>, json?: any) {
        Object.assign(this, props)
        if (json != null) {
            this._aye = json.aye == null ? undefined : marshal.bigint.fromJSON(json.aye)
            this._nay = json.nay == null ? undefined : marshal.bigint.fromJSON(json.nay)
            this._abstain = json.abstain == null ? undefined : marshal.bigint.fromJSON(json.abstain)
            this._vote = json.vote == null ? undefined : marshal.int.fromJSON(json.vote)
            this._balance = json.balance == null ? undefined : marshal.bigint.fromJSON(json.balance)
        }
    }

    get aye(): bigint | undefined | null {
        return this._aye
    }

    set aye(value: bigint | undefined | null) {
        this._aye = value
    }

    get nay(): bigint | undefined | null {
        return this._nay
    }

    set nay(value: bigint | undefined | null) {
        this._nay = value
    }

    get abstain(): bigint | undefined | null {
        return this._abstain
    }

    set abstain(value: bigint | undefined | null) {
        this._abstain = value
    }

    get vote(): number | undefined | null {
        return this._vote
    }

    set vote(value: number | undefined | null) {
        this._vote = value
    }

    get balance(): bigint | undefined | null {
        return this._balance
    }

    set balance(value: bigint | undefined | null) {
        this._balance = value
    }

    toJSON(): object {
        return {
            aye: this.aye == null ? undefined : marshal.bigint.toJSON(this.aye),
            nay: this.nay == null ? undefined : marshal.bigint.toJSON(this.nay),
            abstain: this.abstain == null ? undefined : marshal.bigint.toJSON(this.abstain),
            vote: this.vote,
            balance: this.balance == null ? undefined : marshal.bigint.toJSON(this.balance),
        }
    }
}
