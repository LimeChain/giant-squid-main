import assert from "assert"
import * as marshal from "./marshal"
import {V0MultiLocation, fromJsonV0MultiLocation} from "./_v0MultiLocation"

export class VersionedMultiLocationV0 {
    public readonly isTypeOf = 'VersionedMultiLocationV0'
    private _kind!: string
    private _valueV0!: V0MultiLocation

    constructor(props?: Partial<Omit<VersionedMultiLocationV0, 'toJSON'>>, json?: any) {
        Object.assign(this, props)
        if (json != null) {
            this._kind = marshal.string.fromJSON(json.kind)
            this._valueV0 = fromJsonV0MultiLocation(json.valueV0)
        }
    }

    get kind(): string {
        assert(this._kind != null, 'uninitialized access')
        return this._kind
    }

    set kind(value: string) {
        this._kind = value
    }

    get valueV0(): V0MultiLocation {
        assert(this._valueV0 != null, 'uninitialized access')
        return this._valueV0
    }

    set valueV0(value: V0MultiLocation) {
        this._valueV0 = value
    }

    toJSON(): object {
        return {
            isTypeOf: this.isTypeOf,
            kind: this.kind,
            valueV0: this.valueV0.toJSON(),
        }
    }
}
