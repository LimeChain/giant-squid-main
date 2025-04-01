import {V0JunctionParachain} from "./_v0JunctionParachain"

export type V0Junction = V0JunctionParachain

export function fromJsonV0Junction(json: any): V0Junction {
    switch(json?.isTypeOf) {
        case 'V0JunctionParachain': return new V0JunctionParachain(undefined, json)
        default: throw new TypeError('Unknown json object passed as V0Junction')
    }
}
