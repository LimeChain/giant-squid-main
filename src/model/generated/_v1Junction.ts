import {V1JunctionParachain} from "./_v1JunctionParachain"

export type V1Junction = V1JunctionParachain

export function fromJsonV1Junction(json: any): V1Junction {
    switch(json?.isTypeOf) {
        case 'V1JunctionParachain': return new V1JunctionParachain(undefined, json)
        default: throw new TypeError('Unknown json object passed as V1Junction')
    }
}
