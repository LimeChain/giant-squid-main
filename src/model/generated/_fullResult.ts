import assert from "assert"
import * as marshal from "./marshal"
import {VersionedMultiLocation, fromJsonVersionedMultiLocation} from "./_versionedMultiLocation"

export class FullResult {
    private _dest!: VersionedMultiLocation | undefined | null

    constructor(props?: Partial<Omit<FullResult, 'toJSON'>>, json?: any) {
        Object.assign(this, props)
        if (json != null) {
            this._dest = json.dest == null ? undefined : fromJsonVersionedMultiLocation(json.dest)
        }
    }

    get dest(): VersionedMultiLocation | undefined | null {
        return this._dest
    }

    set dest(value: VersionedMultiLocation | undefined | null) {
        this._dest = value
    }

    toJSON(): object {
        return {
            dest: this.dest == null ? undefined : this.dest.toJSON(),
        }
    }
}
