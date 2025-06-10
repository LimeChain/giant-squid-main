import assert from "assert"
import * as marshal from "./marshal"

export class IdentityAdditionalField {
    private _name!: string | undefined | null
    private _value!: string | undefined | null

    constructor(props?: Partial<Omit<IdentityAdditionalField, 'toJSON'>>, json?: any) {
        Object.assign(this, props)
        if (json != null) {
            this._name = json.name == null ? undefined : marshal.string.fromJSON(json.name)
            this._value = json.value == null ? undefined : marshal.string.fromJSON(json.value)
        }
    }

    get name(): string | undefined | null {
        return this._name
    }

    set name(value: string | undefined | null) {
        this._name = value
    }

    get value(): string | undefined | null {
        return this._value
    }

    set value(value: string | undefined | null) {
        this._value = value
    }

    toJSON(): object {
        return {
            name: this.name,
            value: this.value,
        }
    }
}
