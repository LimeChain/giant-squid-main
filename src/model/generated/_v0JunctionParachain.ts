import assert from "assert"
import * as marshal from "./marshal"

export class V0JunctionParachain {
    public readonly isTypeOf = 'V0JunctionParachain'
    private _kind!: string
    private _value!: number

    constructor(props?: Partial<Omit<V0JunctionParachain, 'toJSON'>>, json?: any) {
        Object.assign(this, props)
        if (json != null) {
            this._kind = marshal.string.fromJSON(json.kind)
            this._value = marshal.int.fromJSON(json.value)
        }
    }

    get kind(): string {
        assert(this._kind != null, 'uninitialized access')
        return this._kind
    }

    set kind(value: string) {
        this._kind = value
    }

    get value(): number {
        assert(this._value != null, 'uninitialized access')
        return this._value
    }

    set value(value: number) {
        this._value = value
    }

    toJSON(): object {
        return {
            isTypeOf: this.isTypeOf,
            kind: this.kind,
            value: this.value,
        }
    }
}
