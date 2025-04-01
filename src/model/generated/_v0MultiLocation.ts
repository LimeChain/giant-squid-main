import {V0MultiLocationX1} from "./_v0MultiLocationX1"

export type V0MultiLocation = V0MultiLocationX1

export function fromJsonV0MultiLocation(json: any): V0MultiLocation {
    switch(json?.isTypeOf) {
        case 'V0MultiLocationX1': return new V0MultiLocationX1(undefined, json)
        default: throw new TypeError('Unknown json object passed as V0MultiLocation')
    }
}
