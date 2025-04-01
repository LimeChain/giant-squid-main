import {VersionedMultiLocationV0} from "./_versionedMultiLocationV0"
import {VersionedMultiLocationV1} from "./_versionedMultiLocationV1"

export type VersionedMultiLocation = VersionedMultiLocationV0 | VersionedMultiLocationV1

export function fromJsonVersionedMultiLocation(json: any): VersionedMultiLocation {
    switch(json?.isTypeOf) {
        case 'VersionedMultiLocationV0': return new VersionedMultiLocationV0(undefined, json)
        case 'VersionedMultiLocationV1': return new VersionedMultiLocationV1(undefined, json)
        default: throw new TypeError('Unknown json object passed as VersionedMultiLocation')
    }
}
