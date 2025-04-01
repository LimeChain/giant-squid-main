import {V1JunctionsX1} from "./_v1JunctionsX1"

export type V1Junctions = V1JunctionsX1

export function fromJsonV1Junctions(json: any): V1Junctions {
    switch(json?.isTypeOf) {
        case 'V1JunctionsX1': return new V1JunctionsX1(undefined, json)
        default: throw new TypeError('Unknown json object passed as V1Junctions')
    }
}
