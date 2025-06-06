import {sts, Result, Option, Bytes, BitSequence} from './support'

export const InstructionV2: sts.Type<InstructionV2> = sts.closedEnum(() => {
    return  {
        BuyExecution: sts.enumStruct({
            fees: MultiAssetV2,
            weightLimit: WeightLimitV2,
        }),
        ClaimAsset: sts.enumStruct({
            assets: sts.array(() => MultiAssetV1),
            ticket: MultiLocationV2,
        }),
        ClearError: sts.unit(),
        ClearOrigin: sts.unit(),
        DepositAsset: sts.enumStruct({
            assets: MultiAssetFilterV2,
            maxAssets: sts.number(),
            beneficiary: MultiLocationV2,
        }),
        DepositReserveAsset: sts.enumStruct({
            assets: MultiAssetFilterV2,
            maxAssets: sts.number(),
            dest: MultiLocationV2,
            xcm: sts.array(() => InstructionV2),
        }),
        DescendOrigin: InteriorMultiLocation,
        ExchangeAsset: sts.enumStruct({
            give: MultiAssetFilterV2,
            receive: sts.array(() => MultiAssetV1),
        }),
        HrmpChannelAccepted: sts.enumStruct({
            recipient: sts.number(),
        }),
        HrmpChannelClosing: sts.enumStruct({
            initiator: sts.number(),
            sender: sts.number(),
            recipient: sts.number(),
        }),
        HrmpNewChannelOpenRequest: sts.enumStruct({
            sender: sts.number(),
            maxMessageSize: sts.number(),
            maxCapacity: sts.number(),
        }),
        InitiateReserveWithdraw: sts.enumStruct({
            assets: MultiAssetFilterV2,
            reserve: MultiLocationV2,
            xcm: sts.array(() => InstructionV2),
        }),
        InitiateTeleport: sts.enumStruct({
            assets: MultiAssetFilterV2,
            dest: MultiLocationV2,
            xcm: sts.array(() => InstructionV2),
        }),
        QueryHolding: sts.enumStruct({
            queryId: sts.bigint(),
            dest: MultiLocationV2,
            assets: MultiAssetFilterV2,
            maxResponseWeight: sts.bigint(),
        }),
        QueryResponse: sts.enumStruct({
            queryId: sts.bigint(),
            response: ResponseV2,
            maxWeight: sts.bigint(),
        }),
        ReceiveTeleportedAsset: sts.array(() => MultiAssetV1),
        RefundSurplus: sts.unit(),
        ReportError: sts.enumStruct({
            queryId: sts.bigint(),
            dest: MultiLocationV2,
            maxResponseWeight: sts.bigint(),
        }),
        ReserveAssetDeposited: sts.array(() => MultiAssetV1),
        SetAppendix: sts.array(() => InstructionV2),
        SetErrorHandler: sts.array(() => InstructionV2),
        Transact: sts.enumStruct({
            originType: OriginKindV2,
            requireWeightAtMost: sts.bigint(),
            call: DoubleEncodedCall,
        }),
        TransferAsset: sts.enumStruct({
            assets: sts.array(() => MultiAssetV1),
            beneficiary: MultiLocationV2,
        }),
        TransferReserveAsset: sts.enumStruct({
            assets: sts.array(() => MultiAssetV1),
            dest: MultiLocationV2,
            xcm: sts.array(() => InstructionV2),
        }),
        Trap: sts.bigint(),
        WithdrawAsset: sts.array(() => MultiAssetV1),
    }
})

export const DoubleEncodedCall: sts.Type<DoubleEncodedCall> = sts.struct(() => {
    return  {
        encoded: sts.bytes(),
    }
})

export interface DoubleEncodedCall {
    encoded: Bytes
}

export const OriginKindV2: sts.Type<OriginKindV2> = sts.closedEnum(() => {
    return  {
        Native: sts.unit(),
        SovereignAccount: sts.unit(),
        Superuser: sts.unit(),
        Xcm: sts.unit(),
    }
})

export type OriginKindV2 = OriginKindV2_Native | OriginKindV2_SovereignAccount | OriginKindV2_Superuser | OriginKindV2_Xcm

export interface OriginKindV2_Native {
    __kind: 'Native'
}

export interface OriginKindV2_SovereignAccount {
    __kind: 'SovereignAccount'
}

export interface OriginKindV2_Superuser {
    __kind: 'Superuser'
}

export interface OriginKindV2_Xcm {
    __kind: 'Xcm'
}

export const ResponseV2: sts.Type<ResponseV2> = sts.closedEnum(() => {
    return  {
        Assets: sts.array(() => MultiAssetV1),
        ExecutionResult: ResponseV2Result,
        Null: sts.unit(),
    }
})

export const ResponseV2Result = sts.result(() => sts.unit(), () => ResponseV2Error)

export const ResponseV2Error = sts.tuple(() => [sts.number(), XcmErrorV2])

export const XcmErrorV2: sts.Type<XcmErrorV2> = sts.closedEnum(() => {
    return  {
        AssetNotFound: sts.unit(),
        BadOrigin: sts.unit(),
        Barrier: sts.unit(),
        DestinationBufferOverflow: sts.unit(),
        DestinationUnsupported: sts.unit(),
        EscalationOfPrivilege: sts.unit(),
        ExceedsMaxMessageSize: sts.unit(),
        FailedToDecode: sts.unit(),
        FailedToTransactAsset: sts.unit(),
        InvalidLocation: sts.unit(),
        LocationCannotHold: sts.unit(),
        MultiLocationFull: sts.unit(),
        MultiLocationNotInvertible: sts.unit(),
        NotHoldingFees: sts.unit(),
        NotWithdrawable: sts.unit(),
        Overflow: sts.unit(),
        RecursionLimitReached: sts.unit(),
        TooExpensive: sts.unit(),
        TooMuchWeightRequired: sts.unit(),
        Transport: sts.unit(),
        Trap: sts.bigint(),
        Undefined: sts.unit(),
        UnhandledEffect: sts.unit(),
        UnhandledXcmMessage: sts.unit(),
        UnhandledXcmVersion: sts.unit(),
        Unimplemented: sts.unit(),
        UnknownClaim: sts.unit(),
        UnknownWeightRequired: sts.unit(),
        Unroutable: sts.unit(),
        UntrustedReserveLocation: sts.unit(),
        UntrustedTeleportLocation: sts.unit(),
        WeightLimitReached: Weight,
        WeightNotComputable: sts.unit(),
        Wildcard: sts.unit(),
    }
})

export const Weight = sts.bigint()

export type XcmErrorV2 = XcmErrorV2_AssetNotFound | XcmErrorV2_BadOrigin | XcmErrorV2_Barrier | XcmErrorV2_DestinationBufferOverflow | XcmErrorV2_DestinationUnsupported | XcmErrorV2_EscalationOfPrivilege | XcmErrorV2_ExceedsMaxMessageSize | XcmErrorV2_FailedToDecode | XcmErrorV2_FailedToTransactAsset | XcmErrorV2_InvalidLocation | XcmErrorV2_LocationCannotHold | XcmErrorV2_MultiLocationFull | XcmErrorV2_MultiLocationNotInvertible | XcmErrorV2_NotHoldingFees | XcmErrorV2_NotWithdrawable | XcmErrorV2_Overflow | XcmErrorV2_RecursionLimitReached | XcmErrorV2_TooExpensive | XcmErrorV2_TooMuchWeightRequired | XcmErrorV2_Transport | XcmErrorV2_Trap | XcmErrorV2_Undefined | XcmErrorV2_UnhandledEffect | XcmErrorV2_UnhandledXcmMessage | XcmErrorV2_UnhandledXcmVersion | XcmErrorV2_Unimplemented | XcmErrorV2_UnknownClaim | XcmErrorV2_UnknownWeightRequired | XcmErrorV2_Unroutable | XcmErrorV2_UntrustedReserveLocation | XcmErrorV2_UntrustedTeleportLocation | XcmErrorV2_WeightLimitReached | XcmErrorV2_WeightNotComputable | XcmErrorV2_Wildcard

export interface XcmErrorV2_AssetNotFound {
    __kind: 'AssetNotFound'
}

export interface XcmErrorV2_BadOrigin {
    __kind: 'BadOrigin'
}

export interface XcmErrorV2_Barrier {
    __kind: 'Barrier'
}

export interface XcmErrorV2_DestinationBufferOverflow {
    __kind: 'DestinationBufferOverflow'
}

export interface XcmErrorV2_DestinationUnsupported {
    __kind: 'DestinationUnsupported'
}

export interface XcmErrorV2_EscalationOfPrivilege {
    __kind: 'EscalationOfPrivilege'
}

export interface XcmErrorV2_ExceedsMaxMessageSize {
    __kind: 'ExceedsMaxMessageSize'
}

export interface XcmErrorV2_FailedToDecode {
    __kind: 'FailedToDecode'
}

export interface XcmErrorV2_FailedToTransactAsset {
    __kind: 'FailedToTransactAsset'
}

export interface XcmErrorV2_InvalidLocation {
    __kind: 'InvalidLocation'
}

export interface XcmErrorV2_LocationCannotHold {
    __kind: 'LocationCannotHold'
}

export interface XcmErrorV2_MultiLocationFull {
    __kind: 'MultiLocationFull'
}

export interface XcmErrorV2_MultiLocationNotInvertible {
    __kind: 'MultiLocationNotInvertible'
}

export interface XcmErrorV2_NotHoldingFees {
    __kind: 'NotHoldingFees'
}

export interface XcmErrorV2_NotWithdrawable {
    __kind: 'NotWithdrawable'
}

export interface XcmErrorV2_Overflow {
    __kind: 'Overflow'
}

export interface XcmErrorV2_RecursionLimitReached {
    __kind: 'RecursionLimitReached'
}

export interface XcmErrorV2_TooExpensive {
    __kind: 'TooExpensive'
}

export interface XcmErrorV2_TooMuchWeightRequired {
    __kind: 'TooMuchWeightRequired'
}

export interface XcmErrorV2_Transport {
    __kind: 'Transport'
}

export interface XcmErrorV2_Trap {
    __kind: 'Trap'
    value: bigint
}

export interface XcmErrorV2_Undefined {
    __kind: 'Undefined'
}

export interface XcmErrorV2_UnhandledEffect {
    __kind: 'UnhandledEffect'
}

export interface XcmErrorV2_UnhandledXcmMessage {
    __kind: 'UnhandledXcmMessage'
}

export interface XcmErrorV2_UnhandledXcmVersion {
    __kind: 'UnhandledXcmVersion'
}

export interface XcmErrorV2_Unimplemented {
    __kind: 'Unimplemented'
}

export interface XcmErrorV2_UnknownClaim {
    __kind: 'UnknownClaim'
}

export interface XcmErrorV2_UnknownWeightRequired {
    __kind: 'UnknownWeightRequired'
}

export interface XcmErrorV2_Unroutable {
    __kind: 'Unroutable'
}

export interface XcmErrorV2_UntrustedReserveLocation {
    __kind: 'UntrustedReserveLocation'
}

export interface XcmErrorV2_UntrustedTeleportLocation {
    __kind: 'UntrustedTeleportLocation'
}

export interface XcmErrorV2_WeightLimitReached {
    __kind: 'WeightLimitReached'
    value: Weight
}

export interface XcmErrorV2_WeightNotComputable {
    __kind: 'WeightNotComputable'
}

export interface XcmErrorV2_Wildcard {
    __kind: 'Wildcard'
}

export type Weight = bigint

export type ResponseV2 = ResponseV2_Assets | ResponseV2_ExecutionResult | ResponseV2_Null

export interface ResponseV2_Assets {
    __kind: 'Assets'
    value: MultiAssetV1[]
}

export interface ResponseV2_ExecutionResult {
    __kind: 'ExecutionResult'
    value: ResponseV2Result
}

export interface ResponseV2_Null {
    __kind: 'Null'
}

export type ResponseV2Result = Result<null, ResponseV2Error>

export type ResponseV2Error = [number, XcmErrorV2]

export interface MultiAssetV1 {
    id: XcmAssetId
    fungibility: FungibilityV1
}

export type FungibilityV1 = FungibilityV1_Fungible | FungibilityV1_NonFungible

export interface FungibilityV1_Fungible {
    __kind: 'Fungible'
    value: bigint
}

export interface FungibilityV1_NonFungible {
    __kind: 'NonFungible'
    value: AssetInstanceV1
}

export type AssetInstanceV1 = AssetInstanceV1_Array16 | AssetInstanceV1_Array32 | AssetInstanceV1_Array4 | AssetInstanceV1_Array8 | AssetInstanceV1_Blob | AssetInstanceV1_Index | AssetInstanceV1_Undefined

export interface AssetInstanceV1_Array16 {
    __kind: 'Array16'
    value: Bytes
}

export interface AssetInstanceV1_Array32 {
    __kind: 'Array32'
    value: Bytes
}

export interface AssetInstanceV1_Array4 {
    __kind: 'Array4'
    value: Bytes
}

export interface AssetInstanceV1_Array8 {
    __kind: 'Array8'
    value: Bytes
}

export interface AssetInstanceV1_Blob {
    __kind: 'Blob'
    value: Bytes
}

export interface AssetInstanceV1_Index {
    __kind: 'Index'
    value: bigint
}

export interface AssetInstanceV1_Undefined {
    __kind: 'Undefined'
}

export type XcmAssetId = XcmAssetId_Abstract | XcmAssetId_Concrete

export interface XcmAssetId_Abstract {
    __kind: 'Abstract'
    value: Bytes
}

export interface XcmAssetId_Concrete {
    __kind: 'Concrete'
    value: MultiLocation
}

export interface MultiLocation {
    parents: number
    interior: JunctionsV1
}

export type JunctionsV1 = JunctionsV1_Here | JunctionsV1_X1 | JunctionsV1_X2 | JunctionsV1_X3 | JunctionsV1_X4 | JunctionsV1_X5 | JunctionsV1_X6 | JunctionsV1_X7 | JunctionsV1_X8

export interface JunctionsV1_Here {
    __kind: 'Here'
}

export interface JunctionsV1_X1 {
    __kind: 'X1'
    value: JunctionV1
}

export interface JunctionsV1_X2 {
    __kind: 'X2'
    value: [JunctionV1, JunctionV1]
}

export interface JunctionsV1_X3 {
    __kind: 'X3'
    value: [JunctionV1, JunctionV1, JunctionV1]
}

export interface JunctionsV1_X4 {
    __kind: 'X4'
    value: [JunctionV1, JunctionV1, JunctionV1, JunctionV1]
}

export interface JunctionsV1_X5 {
    __kind: 'X5'
    value: [JunctionV1, JunctionV1, JunctionV1, JunctionV1, JunctionV1]
}

export interface JunctionsV1_X6 {
    __kind: 'X6'
    value: [JunctionV1, JunctionV1, JunctionV1, JunctionV1, JunctionV1, JunctionV1]
}

export interface JunctionsV1_X7 {
    __kind: 'X7'
    value: [JunctionV1, JunctionV1, JunctionV1, JunctionV1, JunctionV1, JunctionV1, JunctionV1]
}

export interface JunctionsV1_X8 {
    __kind: 'X8'
    value: [JunctionV1, JunctionV1, JunctionV1, JunctionV1, JunctionV1, JunctionV1, JunctionV1, JunctionV1]
}

export type JunctionV1 = JunctionV1_AccountId32 | JunctionV1_AccountIndex64 | JunctionV1_AccountKey20 | JunctionV1_GeneralIndex | JunctionV1_GeneralKey | JunctionV1_OnlyChild | JunctionV1_PalletInstance | JunctionV1_Parachain | JunctionV1_Plurality

export interface JunctionV1_AccountId32 {
    __kind: 'AccountId32'
    network: NetworkId
    id: AccountId
}

export interface JunctionV1_AccountIndex64 {
    __kind: 'AccountIndex64'
    network: NetworkId
    index: bigint
}

export interface JunctionV1_AccountKey20 {
    __kind: 'AccountKey20'
    network: NetworkId
    key: Bytes
}

export interface JunctionV1_GeneralIndex {
    __kind: 'GeneralIndex'
    value: bigint
}

export interface JunctionV1_GeneralKey {
    __kind: 'GeneralKey'
    value: Bytes
}

export interface JunctionV1_OnlyChild {
    __kind: 'OnlyChild'
}

export interface JunctionV1_PalletInstance {
    __kind: 'PalletInstance'
    value: number
}

export interface JunctionV1_Parachain {
    __kind: 'Parachain'
    value: number
}

export interface JunctionV1_Plurality {
    __kind: 'Plurality'
    id: BodyId
    part: BodyPart
}

export type BodyPart = BodyPart_AtLeastProportion | BodyPart_Fraction | BodyPart_Members | BodyPart_MoreThanProportion | BodyPart_Voice

export interface BodyPart_AtLeastProportion {
    __kind: 'AtLeastProportion'
    nom: number
    denom: number
}

export interface BodyPart_Fraction {
    __kind: 'Fraction'
    nom: number
    denom: number
}

export interface BodyPart_Members {
    __kind: 'Members'
    value: number
}

export interface BodyPart_MoreThanProportion {
    __kind: 'MoreThanProportion'
    nom: number
    denom: number
}

export interface BodyPart_Voice {
    __kind: 'Voice'
}

export type BodyId = BodyId_Executive | BodyId_Index | BodyId_Judicial | BodyId_Legislative | BodyId_Named | BodyId_Technical | BodyId_Unit

export interface BodyId_Executive {
    __kind: 'Executive'
}

export interface BodyId_Index {
    __kind: 'Index'
    value: number
}

export interface BodyId_Judicial {
    __kind: 'Judicial'
}

export interface BodyId_Legislative {
    __kind: 'Legislative'
}

export interface BodyId_Named {
    __kind: 'Named'
    value: Bytes
}

export interface BodyId_Technical {
    __kind: 'Technical'
}

export interface BodyId_Unit {
    __kind: 'Unit'
}

export type AccountId = Bytes

export type NetworkId = NetworkId_Any | NetworkId_Kusama | NetworkId_Named | NetworkId_Polkadot

export interface NetworkId_Any {
    __kind: 'Any'
}

export interface NetworkId_Kusama {
    __kind: 'Kusama'
}

export interface NetworkId_Named {
    __kind: 'Named'
    value: Bytes
}

export interface NetworkId_Polkadot {
    __kind: 'Polkadot'
}

export const InteriorMultiLocation: sts.Type<InteriorMultiLocation> = sts.closedEnum(() => {
    return  {
        Here: sts.unit(),
        X1: JunctionV1,
        X2: sts.tuple(() => [JunctionV1, JunctionV1]),
        X3: sts.tuple(() => [JunctionV1, JunctionV1, JunctionV1]),
        X4: sts.tuple(() => [JunctionV1, JunctionV1, JunctionV1, JunctionV1]),
        X5: sts.tuple(() => [JunctionV1, JunctionV1, JunctionV1, JunctionV1, JunctionV1]),
        X6: sts.tuple(() => [JunctionV1, JunctionV1, JunctionV1, JunctionV1, JunctionV1, JunctionV1]),
        X7: sts.tuple(() => [JunctionV1, JunctionV1, JunctionV1, JunctionV1, JunctionV1, JunctionV1, JunctionV1]),
        X8: sts.tuple(() => [JunctionV1, JunctionV1, JunctionV1, JunctionV1, JunctionV1, JunctionV1, JunctionV1, JunctionV1]),
    }
})

export const JunctionV1: sts.Type<JunctionV1> = sts.closedEnum(() => {
    return  {
        AccountId32: sts.enumStruct({
            network: NetworkId,
            id: AccountId,
        }),
        AccountIndex64: sts.enumStruct({
            network: NetworkId,
            index: sts.bigint(),
        }),
        AccountKey20: sts.enumStruct({
            network: NetworkId,
            key: sts.bytes(),
        }),
        GeneralIndex: sts.bigint(),
        GeneralKey: sts.bytes(),
        OnlyChild: sts.unit(),
        PalletInstance: sts.number(),
        Parachain: sts.number(),
        Plurality: sts.enumStruct({
            id: BodyId,
            part: BodyPart,
        }),
    }
})

export const BodyPart: sts.Type<BodyPart> = sts.closedEnum(() => {
    return  {
        AtLeastProportion: sts.enumStruct({
            nom: sts.number(),
            denom: sts.number(),
        }),
        Fraction: sts.enumStruct({
            nom: sts.number(),
            denom: sts.number(),
        }),
        Members: sts.number(),
        MoreThanProportion: sts.enumStruct({
            nom: sts.number(),
            denom: sts.number(),
        }),
        Voice: sts.unit(),
    }
})

export const BodyId: sts.Type<BodyId> = sts.closedEnum(() => {
    return  {
        Executive: sts.unit(),
        Index: sts.number(),
        Judicial: sts.unit(),
        Legislative: sts.unit(),
        Named: sts.bytes(),
        Technical: sts.unit(),
        Unit: sts.unit(),
    }
})

export const NetworkId: sts.Type<NetworkId> = sts.closedEnum(() => {
    return  {
        Any: sts.unit(),
        Kusama: sts.unit(),
        Named: sts.bytes(),
        Polkadot: sts.unit(),
    }
})

export type InteriorMultiLocation = InteriorMultiLocation_Here | InteriorMultiLocation_X1 | InteriorMultiLocation_X2 | InteriorMultiLocation_X3 | InteriorMultiLocation_X4 | InteriorMultiLocation_X5 | InteriorMultiLocation_X6 | InteriorMultiLocation_X7 | InteriorMultiLocation_X8

export interface InteriorMultiLocation_Here {
    __kind: 'Here'
}

export interface InteriorMultiLocation_X1 {
    __kind: 'X1'
    value: JunctionV1
}

export interface InteriorMultiLocation_X2 {
    __kind: 'X2'
    value: [JunctionV1, JunctionV1]
}

export interface InteriorMultiLocation_X3 {
    __kind: 'X3'
    value: [JunctionV1, JunctionV1, JunctionV1]
}

export interface InteriorMultiLocation_X4 {
    __kind: 'X4'
    value: [JunctionV1, JunctionV1, JunctionV1, JunctionV1]
}

export interface InteriorMultiLocation_X5 {
    __kind: 'X5'
    value: [JunctionV1, JunctionV1, JunctionV1, JunctionV1, JunctionV1]
}

export interface InteriorMultiLocation_X6 {
    __kind: 'X6'
    value: [JunctionV1, JunctionV1, JunctionV1, JunctionV1, JunctionV1, JunctionV1]
}

export interface InteriorMultiLocation_X7 {
    __kind: 'X7'
    value: [JunctionV1, JunctionV1, JunctionV1, JunctionV1, JunctionV1, JunctionV1, JunctionV1]
}

export interface InteriorMultiLocation_X8 {
    __kind: 'X8'
    value: [JunctionV1, JunctionV1, JunctionV1, JunctionV1, JunctionV1, JunctionV1, JunctionV1, JunctionV1]
}

export const MultiAssetFilterV2: sts.Type<MultiAssetFilterV2> = sts.closedEnum(() => {
    return  {
        Definite: sts.array(() => MultiAssetV1),
        Wild: WildMultiAssetV1,
    }
})

export const WildMultiAssetV1: sts.Type<WildMultiAssetV1> = sts.closedEnum(() => {
    return  {
        All: sts.unit(),
        AllOf: sts.enumStruct({
            id: XcmAssetId,
            fungibility: WildFungibilityV1,
        }),
    }
})

export const WildFungibilityV1: sts.Type<WildFungibilityV1> = sts.closedEnum(() => {
    return  {
        Fungible: sts.unit(),
        NonFungible: sts.unit(),
    }
})

export type WildFungibilityV1 = WildFungibilityV1_Fungible | WildFungibilityV1_NonFungible

export interface WildFungibilityV1_Fungible {
    __kind: 'Fungible'
}

export interface WildFungibilityV1_NonFungible {
    __kind: 'NonFungible'
}

export const XcmAssetId: sts.Type<XcmAssetId> = sts.closedEnum(() => {
    return  {
        Abstract: sts.bytes(),
        Concrete: MultiLocation,
    }
})

export type WildMultiAssetV1 = WildMultiAssetV1_All | WildMultiAssetV1_AllOf

export interface WildMultiAssetV1_All {
    __kind: 'All'
}

export interface WildMultiAssetV1_AllOf {
    __kind: 'AllOf'
    id: XcmAssetId
    fungibility: WildFungibilityV1
}

export type MultiAssetFilterV2 = MultiAssetFilterV2_Definite | MultiAssetFilterV2_Wild

export interface MultiAssetFilterV2_Definite {
    __kind: 'Definite'
    value: MultiAssetV1[]
}

export interface MultiAssetFilterV2_Wild {
    __kind: 'Wild'
    value: WildMultiAssetV1
}

export const MultiLocationV2: sts.Type<MultiLocationV2> = sts.struct(() => {
    return  {
        parents: sts.number(),
        interior: JunctionsV1,
    }
})

export const JunctionsV1: sts.Type<JunctionsV1> = sts.closedEnum(() => {
    return  {
        Here: sts.unit(),
        X1: JunctionV1,
        X2: sts.tuple(() => [JunctionV1, JunctionV1]),
        X3: sts.tuple(() => [JunctionV1, JunctionV1, JunctionV1]),
        X4: sts.tuple(() => [JunctionV1, JunctionV1, JunctionV1, JunctionV1]),
        X5: sts.tuple(() => [JunctionV1, JunctionV1, JunctionV1, JunctionV1, JunctionV1]),
        X6: sts.tuple(() => [JunctionV1, JunctionV1, JunctionV1, JunctionV1, JunctionV1, JunctionV1]),
        X7: sts.tuple(() => [JunctionV1, JunctionV1, JunctionV1, JunctionV1, JunctionV1, JunctionV1, JunctionV1]),
        X8: sts.tuple(() => [JunctionV1, JunctionV1, JunctionV1, JunctionV1, JunctionV1, JunctionV1, JunctionV1, JunctionV1]),
    }
})

export interface MultiLocationV2 {
    parents: number
    interior: JunctionsV1
}

export const MultiAssetV1: sts.Type<MultiAssetV1> = sts.struct(() => {
    return  {
        id: XcmAssetId,
        fungibility: FungibilityV1,
    }
})

export const FungibilityV1: sts.Type<FungibilityV1> = sts.closedEnum(() => {
    return  {
        Fungible: sts.bigint(),
        NonFungible: AssetInstanceV1,
    }
})

export const AssetInstanceV1: sts.Type<AssetInstanceV1> = sts.closedEnum(() => {
    return  {
        Array16: sts.bytes(),
        Array32: sts.bytes(),
        Array4: sts.bytes(),
        Array8: sts.bytes(),
        Blob: sts.bytes(),
        Index: sts.bigint(),
        Undefined: sts.unit(),
    }
})

export const WeightLimitV2: sts.Type<WeightLimitV2> = sts.closedEnum(() => {
    return  {
        Limited: sts.bigint(),
        Unlimited: sts.unit(),
    }
})

export type WeightLimitV2 = WeightLimitV2_Limited | WeightLimitV2_Unlimited

export interface WeightLimitV2_Limited {
    __kind: 'Limited'
    value: bigint
}

export interface WeightLimitV2_Unlimited {
    __kind: 'Unlimited'
}

export const MultiAssetV2: sts.Type<MultiAssetV2> = sts.struct(() => {
    return  {
        id: XcmAssetId,
        fungibility: FungibilityV1,
    }
})

export interface MultiAssetV2 {
    id: XcmAssetId
    fungibility: FungibilityV1
}

export type InstructionV2 = InstructionV2_BuyExecution | InstructionV2_ClaimAsset | InstructionV2_ClearError | InstructionV2_ClearOrigin | InstructionV2_DepositAsset | InstructionV2_DepositReserveAsset | InstructionV2_DescendOrigin | InstructionV2_ExchangeAsset | InstructionV2_HrmpChannelAccepted | InstructionV2_HrmpChannelClosing | InstructionV2_HrmpNewChannelOpenRequest | InstructionV2_InitiateReserveWithdraw | InstructionV2_InitiateTeleport | InstructionV2_QueryHolding | InstructionV2_QueryResponse | InstructionV2_ReceiveTeleportedAsset | InstructionV2_RefundSurplus | InstructionV2_ReportError | InstructionV2_ReserveAssetDeposited | InstructionV2_SetAppendix | InstructionV2_SetErrorHandler | InstructionV2_Transact | InstructionV2_TransferAsset | InstructionV2_TransferReserveAsset | InstructionV2_Trap | InstructionV2_WithdrawAsset

export interface InstructionV2_BuyExecution {
    __kind: 'BuyExecution'
    fees: MultiAssetV2
    weightLimit: WeightLimitV2
}

export interface InstructionV2_ClaimAsset {
    __kind: 'ClaimAsset'
    assets: MultiAssetV1[]
    ticket: MultiLocationV2
}

export interface InstructionV2_ClearError {
    __kind: 'ClearError'
}

export interface InstructionV2_ClearOrigin {
    __kind: 'ClearOrigin'
}

export interface InstructionV2_DepositAsset {
    __kind: 'DepositAsset'
    assets: MultiAssetFilterV2
    maxAssets: number
    beneficiary: MultiLocationV2
}

export interface InstructionV2_DepositReserveAsset {
    __kind: 'DepositReserveAsset'
    assets: MultiAssetFilterV2
    maxAssets: number
    dest: MultiLocationV2
    xcm: InstructionV2[]
}

export interface InstructionV2_DescendOrigin {
    __kind: 'DescendOrigin'
    value: InteriorMultiLocation
}

export interface InstructionV2_ExchangeAsset {
    __kind: 'ExchangeAsset'
    give: MultiAssetFilterV2
    receive: MultiAssetV1[]
}

export interface InstructionV2_HrmpChannelAccepted {
    __kind: 'HrmpChannelAccepted'
    recipient: number
}

export interface InstructionV2_HrmpChannelClosing {
    __kind: 'HrmpChannelClosing'
    initiator: number
    sender: number
    recipient: number
}

export interface InstructionV2_HrmpNewChannelOpenRequest {
    __kind: 'HrmpNewChannelOpenRequest'
    sender: number
    maxMessageSize: number
    maxCapacity: number
}

export interface InstructionV2_InitiateReserveWithdraw {
    __kind: 'InitiateReserveWithdraw'
    assets: MultiAssetFilterV2
    reserve: MultiLocationV2
    xcm: InstructionV2[]
}

export interface InstructionV2_InitiateTeleport {
    __kind: 'InitiateTeleport'
    assets: MultiAssetFilterV2
    dest: MultiLocationV2
    xcm: InstructionV2[]
}

export interface InstructionV2_QueryHolding {
    __kind: 'QueryHolding'
    queryId: bigint
    dest: MultiLocationV2
    assets: MultiAssetFilterV2
    maxResponseWeight: bigint
}

export interface InstructionV2_QueryResponse {
    __kind: 'QueryResponse'
    queryId: bigint
    response: ResponseV2
    maxWeight: bigint
}

export interface InstructionV2_ReceiveTeleportedAsset {
    __kind: 'ReceiveTeleportedAsset'
    value: MultiAssetV1[]
}

export interface InstructionV2_RefundSurplus {
    __kind: 'RefundSurplus'
}

export interface InstructionV2_ReportError {
    __kind: 'ReportError'
    queryId: bigint
    dest: MultiLocationV2
    maxResponseWeight: bigint
}

export interface InstructionV2_ReserveAssetDeposited {
    __kind: 'ReserveAssetDeposited'
    value: MultiAssetV1[]
}

export interface InstructionV2_SetAppendix {
    __kind: 'SetAppendix'
    value: InstructionV2[]
}

export interface InstructionV2_SetErrorHandler {
    __kind: 'SetErrorHandler'
    value: InstructionV2[]
}

export interface InstructionV2_Transact {
    __kind: 'Transact'
    originType: OriginKindV2
    requireWeightAtMost: bigint
    call: DoubleEncodedCall
}

export interface InstructionV2_TransferAsset {
    __kind: 'TransferAsset'
    assets: MultiAssetV1[]
    beneficiary: MultiLocationV2
}

export interface InstructionV2_TransferReserveAsset {
    __kind: 'TransferReserveAsset'
    assets: MultiAssetV1[]
    dest: MultiLocationV2
    xcm: InstructionV2[]
}

export interface InstructionV2_Trap {
    __kind: 'Trap'
    value: bigint
}

export interface InstructionV2_WithdrawAsset {
    __kind: 'WithdrawAsset'
    value: MultiAssetV1[]
}

export const MultiLocation: sts.Type<MultiLocation> = sts.struct(() => {
    return  {
        parents: sts.number(),
        interior: JunctionsV1,
    }
})

export const BalanceOf = sts.bigint()

export const Balance = sts.bigint()

export const AccountId = sts.bytes()
