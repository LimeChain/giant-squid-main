import assert from "assert"
import * as marshal from "./marshal"
import {V1Junctions, fromJsonV1Junctions} from "./_v1Junctions"

/**
 * ====================================================================
 * V1MultiLocation
 * ====================================================================
 */
export class V1MultiLocation {
    private _parents!: number
    private _interior!: V1Junctions

    constructor(props?: Partial<Omit<V1MultiLocation, 'toJSON'>>, json?: any) {
        Object.assign(this, props)
        if (json != null) {
            this._parents = marshal.int.fromJSON(json.parents)
            this._interior = fromJsonV1Junctions(json.interior)
        }
    }

    get parents(): number {
        assert(this._parents != null, 'uninitialized access')
        return this._parents
    }

    set parents(value: number) {
        this._parents = value
    }

    get interior(): V1Junctions {
        assert(this._interior != null, 'uninitialized access')
        return this._interior
    }

    set interior(value: V1Junctions) {
        this._interior = value
    }

    toJSON(): object {
        return {
            parents: this.parents,
            interior: this.interior.toJSON(),
        }
    }
}
