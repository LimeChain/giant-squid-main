import assert from "assert"
import * as marshal from "./marshal"
import {V1MultiLocation} from "./_v1MultiLocation"

export class VersionedMultiLocationV1 {
    public readonly isTypeOf = 'VersionedMultiLocationV1'
    private _kind!: string
    private _valueV1!: V1MultiLocation

    constructor(props?: Partial<Omit<VersionedMultiLocationV1, 'toJSON'>>, json?: any) {
        Object.assign(this, props)
        if (json != null) {
            this._kind = marshal.string.fromJSON(json.kind)
            this._valueV1 = new V1MultiLocation(undefined, marshal.nonNull(json.valueV1))
        }
    }

    get kind(): string {
        assert(this._kind != null, 'uninitialized access')
        return this._kind
    }

    set kind(value: string) {
        this._kind = value
    }

    get valueV1(): V1MultiLocation {
        assert(this._valueV1 != null, 'uninitialized access')
        return this._valueV1
    }

    set valueV1(value: V1MultiLocation) {
        this._valueV1 = value
    }

    toJSON(): object {
        return {
            isTypeOf: this.isTypeOf,
            kind: this.kind,
            valueV1: this.valueV1.toJSON(),
        }
    }
}
