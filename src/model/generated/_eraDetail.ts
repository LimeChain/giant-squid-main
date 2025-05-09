import assert from "assert"
import * as marshal from "./marshal"

export class EraDetail {
    private _era!: number
    private _totalRewarded!: bigint
    private _returnPercentage!: string

    constructor(props?: Partial<Omit<EraDetail, 'toJSON'>>, json?: any) {
        Object.assign(this, props)
        if (json != null) {
            this._era = marshal.int.fromJSON(json.era)
            this._totalRewarded = marshal.bigint.fromJSON(json.totalRewarded)
            this._returnPercentage = marshal.string.fromJSON(json.returnPercentage)
        }
    }

    get era(): number {
        assert(this._era != null, 'uninitialized access')
        return this._era
    }

    set era(value: number) {
        this._era = value
    }

    get totalRewarded(): bigint {
        assert(this._totalRewarded != null, 'uninitialized access')
        return this._totalRewarded
    }

    set totalRewarded(value: bigint) {
        this._totalRewarded = value
    }

    get returnPercentage(): string {
        assert(this._returnPercentage != null, 'uninitialized access')
        return this._returnPercentage
    }

    set returnPercentage(value: string) {
        this._returnPercentage = value
    }

    toJSON(): object {
        return {
            era: this.era,
            totalRewarded: marshal.bigint.toJSON(this.totalRewarded),
            returnPercentage: this.returnPercentage,
        }
    }
}
