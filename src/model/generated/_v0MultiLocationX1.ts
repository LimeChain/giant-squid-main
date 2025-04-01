import assert from "assert"
import * as marshal from "./marshal"
import {V0Junction, fromJsonV0Junction} from "./_v0Junction"

export class V0MultiLocationX1 {
    public readonly isTypeOf = 'V0MultiLocationX1'
    private _kind!: string
    private _value!: V0Junction

    constructor(props?: Partial<Omit<V0MultiLocationX1, 'toJSON'>>, json?: any) {
        Object.assign(this, props)
        if (json != null) {
            this._kind = marshal.string.fromJSON(json.kind)
            this._value = fromJsonV0Junction(json.value)
        }
    }

    get kind(): string {
        assert(this._kind != null, 'uninitialized access')
        return this._kind
    }

    set kind(value: string) {
        this._kind = value
    }

    get value(): V0Junction {
        assert(this._value != null, 'uninitialized access')
        return this._value
    }

    set value(value: V0Junction) {
        this._value = value
    }

    toJSON(): object {
        return {
            isTypeOf: this.isTypeOf,
            kind: this.kind,
            value: this.value.toJSON(),
        }
    }
}
