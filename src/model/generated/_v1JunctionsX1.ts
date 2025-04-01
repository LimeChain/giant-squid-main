import assert from "assert"
import * as marshal from "./marshal"
import {V1Junction, fromJsonV1Junction} from "./_v1Junction"

export class V1JunctionsX1 {
    public readonly isTypeOf = 'V1JunctionsX1'
    private _kind!: string
    private _value!: V1Junction

    constructor(props?: Partial<Omit<V1JunctionsX1, 'toJSON'>>, json?: any) {
        Object.assign(this, props)
        if (json != null) {
            this._kind = marshal.string.fromJSON(json.kind)
            this._value = fromJsonV1Junction(json.value)
        }
    }

    get kind(): string {
        assert(this._kind != null, 'uninitialized access')
        return this._kind
    }

    set kind(value: string) {
        this._kind = value
    }

    get value(): V1Junction {
        assert(this._value != null, 'uninitialized access')
        return this._value
    }

    set value(value: V1Junction) {
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
