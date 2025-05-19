import {sts, Result, Option, Bytes, BitSequence} from './support'

export const VersionedXcm: sts.Type<VersionedXcm> = sts.closedEnum(() => {
    return  {
        V3: sts.array(() => V3Instruction),
        V4: sts.array(() => V4Instruction),
        V5: sts.array(() => V5Instruction),
    }
})

export const V5Instruction: sts.Type<V5Instruction> = sts.closedEnum(() => {
    return  {
        AliasOrigin: V5Location,
        BurnAsset: sts.array(() => V5Asset),
        BuyExecution: sts.enumStruct({
            fees: V5Asset,
            weightLimit: V3WeightLimit,
        }),
        ClaimAsset: sts.enumStruct({
            assets: sts.array(() => V5Asset),
            ticket: V5Location,
        }),
        ClearError: sts.unit(),
        ClearOrigin: sts.unit(),
        ClearTopic: sts.unit(),
        ClearTransactStatus: sts.unit(),
        DepositAsset: sts.enumStruct({
            assets: V5AssetFilter,
            beneficiary: V5Location,
        }),
        DepositReserveAsset: sts.enumStruct({
            assets: V5AssetFilter,
            dest: V5Location,
            xcm: sts.array(() => V5Instruction),
        }),
        DescendOrigin: V5Junctions,
        ExchangeAsset: sts.enumStruct({
            give: V5AssetFilter,
            want: sts.array(() => V5Asset),
            maximal: sts.boolean(),
        }),
        ExecuteWithOrigin: sts.enumStruct({
            descendantOrigin: sts.option(() => V5Junctions),
            xcm: sts.array(() => V5Instruction),
        }),
        ExpectAsset: sts.array(() => V5Asset),
        ExpectError: sts.option(() => sts.tuple(() => [sts.number(), V5Error])),
        ExpectOrigin: sts.option(() => V5Location),
        ExpectPallet: sts.enumStruct({
            index: sts.number(),
            name: sts.bytes(),
            moduleName: sts.bytes(),
            crateMajor: sts.number(),
            minCrateMinor: sts.number(),
        }),
        ExpectTransactStatus: V3MaybeErrorCode,
        ExportMessage: sts.enumStruct({
            network: V5NetworkId,
            destination: V5Junctions,
            xcm: sts.array(() => V5Instruction),
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
            assets: V5AssetFilter,
            reserve: V5Location,
            xcm: sts.array(() => V5Instruction),
        }),
        InitiateTeleport: sts.enumStruct({
            assets: V5AssetFilter,
            dest: V5Location,
            xcm: sts.array(() => V5Instruction),
        }),
        InitiateTransfer: sts.enumStruct({
            destination: V5Location,
            remoteFees: sts.option(() => V5AssetTransferFilter),
            preserveOrigin: sts.boolean(),
            assets: sts.array(() => V5AssetTransferFilter),
            remoteXcm: sts.array(() => V5Instruction),
        }),
        LockAsset: sts.enumStruct({
            asset: V5Asset,
            unlocker: V5Location,
        }),
        NoteUnlockable: sts.enumStruct({
            asset: V5Asset,
            owner: V5Location,
        }),
        PayFees: sts.enumStruct({
            asset: V5Asset,
        }),
        QueryPallet: sts.enumStruct({
            moduleName: sts.bytes(),
            responseInfo: V5QueryResponseInfo,
        }),
        QueryResponse: sts.enumStruct({
            queryId: sts.bigint(),
            response: V5Response,
            maxWeight: Weight,
            querier: sts.option(() => V5Location),
        }),
        ReceiveTeleportedAsset: sts.array(() => V5Asset),
        RefundSurplus: sts.unit(),
        ReportError: V5QueryResponseInfo,
        ReportHolding: sts.enumStruct({
            responseInfo: V5QueryResponseInfo,
            assets: V5AssetFilter,
        }),
        ReportTransactStatus: V5QueryResponseInfo,
        RequestUnlock: sts.enumStruct({
            asset: V5Asset,
            locker: V5Location,
        }),
        ReserveAssetDeposited: sts.array(() => V5Asset),
        SetAppendix: sts.array(() => V5Instruction),
        SetErrorHandler: sts.array(() => V5Instruction),
        SetFeesMode: sts.enumStruct({
            jitWithdraw: sts.boolean(),
        }),
        SetHints: sts.enumStruct({
            hints: sts.array(() => V5Hint),
        }),
        SetTopic: sts.bytes(),
        SubscribeVersion: sts.enumStruct({
            queryId: sts.bigint(),
            maxResponseWeight: Weight,
        }),
        Transact: sts.enumStruct({
            originKind: V3OriginKind,
            fallbackMaxWeight: sts.option(() => Weight),
            call: DoubleEncoded,
        }),
        TransferAsset: sts.enumStruct({
            assets: sts.array(() => V5Asset),
            beneficiary: V5Location,
        }),
        TransferReserveAsset: sts.enumStruct({
            assets: sts.array(() => V5Asset),
            dest: V5Location,
            xcm: sts.array(() => V5Instruction),
        }),
        Trap: sts.bigint(),
        UniversalOrigin: V5Junction,
        UnlockAsset: sts.enumStruct({
            asset: V5Asset,
            target: V5Location,
        }),
        UnpaidExecution: sts.enumStruct({
            weightLimit: V3WeightLimit,
            checkOrigin: sts.option(() => V5Location),
        }),
        UnsubscribeVersion: sts.unit(),
        WithdrawAsset: sts.array(() => V5Asset),
    }
})

export const V5Junction: sts.Type<V5Junction> = sts.closedEnum(() => {
    return  {
        AccountId32: sts.enumStruct({
            network: sts.option(() => V5NetworkId),
            id: sts.bytes(),
        }),
        AccountIndex64: sts.enumStruct({
            network: sts.option(() => V5NetworkId),
            index: sts.bigint(),
        }),
        AccountKey20: sts.enumStruct({
            network: sts.option(() => V5NetworkId),
            key: sts.bytes(),
        }),
        GeneralIndex: sts.bigint(),
        GeneralKey: sts.enumStruct({
            length: sts.number(),
            data: sts.bytes(),
        }),
        GlobalConsensus: V5NetworkId,
        OnlyChild: sts.unit(),
        PalletInstance: sts.number(),
        Parachain: sts.number(),
        Plurality: sts.enumStruct({
            id: V3BodyId,
            part: V3BodyPart,
        }),
    }
})

export const V3BodyPart: sts.Type<V3BodyPart> = sts.closedEnum(() => {
    return  {
        AtLeastProportion: sts.enumStruct({
            nom: sts.number(),
            denom: sts.number(),
        }),
        Fraction: sts.enumStruct({
            nom: sts.number(),
            denom: sts.number(),
        }),
        Members: sts.enumStruct({
            count: sts.number(),
        }),
        MoreThanProportion: sts.enumStruct({
            nom: sts.number(),
            denom: sts.number(),
        }),
        Voice: sts.unit(),
    }
})

export type V3BodyPart = V3BodyPart_AtLeastProportion | V3BodyPart_Fraction | V3BodyPart_Members | V3BodyPart_MoreThanProportion | V3BodyPart_Voice

export interface V3BodyPart_AtLeastProportion {
    __kind: 'AtLeastProportion'
    nom: number
    denom: number
}

export interface V3BodyPart_Fraction {
    __kind: 'Fraction'
    nom: number
    denom: number
}

export interface V3BodyPart_Members {
    __kind: 'Members'
    count: number
}

export interface V3BodyPart_MoreThanProportion {
    __kind: 'MoreThanProportion'
    nom: number
    denom: number
}

export interface V3BodyPart_Voice {
    __kind: 'Voice'
}

export const V3BodyId: sts.Type<V3BodyId> = sts.closedEnum(() => {
    return  {
        Administration: sts.unit(),
        Defense: sts.unit(),
        Executive: sts.unit(),
        Index: sts.number(),
        Judicial: sts.unit(),
        Legislative: sts.unit(),
        Moniker: sts.bytes(),
        Technical: sts.unit(),
        Treasury: sts.unit(),
        Unit: sts.unit(),
    }
})

export type V3BodyId = V3BodyId_Administration | V3BodyId_Defense | V3BodyId_Executive | V3BodyId_Index | V3BodyId_Judicial | V3BodyId_Legislative | V3BodyId_Moniker | V3BodyId_Technical | V3BodyId_Treasury | V3BodyId_Unit

export interface V3BodyId_Administration {
    __kind: 'Administration'
}

export interface V3BodyId_Defense {
    __kind: 'Defense'
}

export interface V3BodyId_Executive {
    __kind: 'Executive'
}

export interface V3BodyId_Index {
    __kind: 'Index'
    value: number
}

export interface V3BodyId_Judicial {
    __kind: 'Judicial'
}

export interface V3BodyId_Legislative {
    __kind: 'Legislative'
}

export interface V3BodyId_Moniker {
    __kind: 'Moniker'
    value: Bytes
}

export interface V3BodyId_Technical {
    __kind: 'Technical'
}

export interface V3BodyId_Treasury {
    __kind: 'Treasury'
}

export interface V3BodyId_Unit {
    __kind: 'Unit'
}

export type V5Junction = V5Junction_AccountId32 | V5Junction_AccountIndex64 | V5Junction_AccountKey20 | V5Junction_GeneralIndex | V5Junction_GeneralKey | V5Junction_GlobalConsensus | V5Junction_OnlyChild | V5Junction_PalletInstance | V5Junction_Parachain | V5Junction_Plurality

export interface V5Junction_AccountId32 {
    __kind: 'AccountId32'
    network?: (V5NetworkId | undefined)
    id: Bytes
}

export interface V5Junction_AccountIndex64 {
    __kind: 'AccountIndex64'
    network?: (V5NetworkId | undefined)
    index: bigint
}

export interface V5Junction_AccountKey20 {
    __kind: 'AccountKey20'
    network?: (V5NetworkId | undefined)
    key: Bytes
}

export interface V5Junction_GeneralIndex {
    __kind: 'GeneralIndex'
    value: bigint
}

export interface V5Junction_GeneralKey {
    __kind: 'GeneralKey'
    length: number
    data: Bytes
}

export interface V5Junction_GlobalConsensus {
    __kind: 'GlobalConsensus'
    value: V5NetworkId
}

export interface V5Junction_OnlyChild {
    __kind: 'OnlyChild'
}

export interface V5Junction_PalletInstance {
    __kind: 'PalletInstance'
    value: number
}

export interface V5Junction_Parachain {
    __kind: 'Parachain'
    value: number
}

export interface V5Junction_Plurality {
    __kind: 'Plurality'
    id: V3BodyId
    part: V3BodyPart
}

export type V5NetworkId = V5NetworkId_BitcoinCash | V5NetworkId_BitcoinCore | V5NetworkId_ByFork | V5NetworkId_ByGenesis | V5NetworkId_Ethereum | V5NetworkId_Kusama | V5NetworkId_Polkadot | V5NetworkId_PolkadotBulletin

export interface V5NetworkId_BitcoinCash {
    __kind: 'BitcoinCash'
}

export interface V5NetworkId_BitcoinCore {
    __kind: 'BitcoinCore'
}

export interface V5NetworkId_ByFork {
    __kind: 'ByFork'
    blockNumber: bigint
    blockHash: Bytes
}

export interface V5NetworkId_ByGenesis {
    __kind: 'ByGenesis'
    value: Bytes
}

export interface V5NetworkId_Ethereum {
    __kind: 'Ethereum'
    chainId: bigint
}

export interface V5NetworkId_Kusama {
    __kind: 'Kusama'
}

export interface V5NetworkId_Polkadot {
    __kind: 'Polkadot'
}

export interface V5NetworkId_PolkadotBulletin {
    __kind: 'PolkadotBulletin'
}

export const DoubleEncoded: sts.Type<DoubleEncoded> = sts.struct(() => {
    return  {
        encoded: sts.bytes(),
    }
})

export interface DoubleEncoded {
    encoded: Bytes
}

export const V3OriginKind: sts.Type<V3OriginKind> = sts.closedEnum(() => {
    return  {
        Native: sts.unit(),
        SovereignAccount: sts.unit(),
        Superuser: sts.unit(),
        Xcm: sts.unit(),
    }
})

export type V3OriginKind = V3OriginKind_Native | V3OriginKind_SovereignAccount | V3OriginKind_Superuser | V3OriginKind_Xcm

export interface V3OriginKind_Native {
    __kind: 'Native'
}

export interface V3OriginKind_SovereignAccount {
    __kind: 'SovereignAccount'
}

export interface V3OriginKind_Superuser {
    __kind: 'Superuser'
}

export interface V3OriginKind_Xcm {
    __kind: 'Xcm'
}

export const V5Hint: sts.Type<V5Hint> = sts.closedEnum(() => {
    return  {
        AssetClaimer: sts.enumStruct({
            location: V5Location,
        }),
    }
})

export type V5Hint = V5Hint_AssetClaimer

export interface V5Hint_AssetClaimer {
    __kind: 'AssetClaimer'
    location: V5Location
}

export interface V5Location {
    parents: number
    interior: V5Junctions
}

export type V5Junctions = V5Junctions_Here | V5Junctions_X1 | V5Junctions_X2 | V5Junctions_X3 | V5Junctions_X4 | V5Junctions_X5 | V5Junctions_X6 | V5Junctions_X7 | V5Junctions_X8

export interface V5Junctions_Here {
    __kind: 'Here'
}

export interface V5Junctions_X1 {
    __kind: 'X1'
    value: V5Junction[]
}

export interface V5Junctions_X2 {
    __kind: 'X2'
    value: V5Junction[]
}

export interface V5Junctions_X3 {
    __kind: 'X3'
    value: V5Junction[]
}

export interface V5Junctions_X4 {
    __kind: 'X4'
    value: V5Junction[]
}

export interface V5Junctions_X5 {
    __kind: 'X5'
    value: V5Junction[]
}

export interface V5Junctions_X6 {
    __kind: 'X6'
    value: V5Junction[]
}

export interface V5Junctions_X7 {
    __kind: 'X7'
    value: V5Junction[]
}

export interface V5Junctions_X8 {
    __kind: 'X8'
    value: V5Junction[]
}

export const Weight: sts.Type<Weight> = sts.struct(() => {
    return  {
        refTime: sts.bigint(),
        proofSize: sts.bigint(),
    }
})

export interface Weight {
    refTime: bigint
    proofSize: bigint
}

export const V5Response: sts.Type<V5Response> = sts.closedEnum(() => {
    return  {
        Assets: sts.array(() => V5Asset),
        DispatchResult: V3MaybeErrorCode,
        ExecutionResult: sts.option(() => sts.tuple(() => [sts.number(), V5Error])),
        Null: sts.unit(),
        PalletsInfo: sts.array(() => V5PalletInfo),
        Version: sts.number(),
    }
})

export const V5PalletInfo: sts.Type<V5PalletInfo> = sts.struct(() => {
    return  {
        index: sts.number(),
        name: sts.bytes(),
        moduleName: sts.bytes(),
        major: sts.number(),
        minor: sts.number(),
        patch: sts.number(),
    }
})

export interface V5PalletInfo {
    index: number
    name: Bytes
    moduleName: Bytes
    major: number
    minor: number
    patch: number
}

export type V5Response = V5Response_Assets | V5Response_DispatchResult | V5Response_ExecutionResult | V5Response_Null | V5Response_PalletsInfo | V5Response_Version

export interface V5Response_Assets {
    __kind: 'Assets'
    value: V5Asset[]
}

export interface V5Response_DispatchResult {
    __kind: 'DispatchResult'
    value: V3MaybeErrorCode
}

export interface V5Response_ExecutionResult {
    __kind: 'ExecutionResult'
    value?: ([number, V5Error] | undefined)
}

export interface V5Response_Null {
    __kind: 'Null'
}

export interface V5Response_PalletsInfo {
    __kind: 'PalletsInfo'
    value: V5PalletInfo[]
}

export interface V5Response_Version {
    __kind: 'Version'
    value: number
}

export type V5Error = V5Error_AssetNotFound | V5Error_BadOrigin | V5Error_Barrier | V5Error_DestinationUnsupported | V5Error_ExceedsMaxMessageSize | V5Error_ExceedsStackLimit | V5Error_ExpectationFalse | V5Error_ExportError | V5Error_FailedToDecode | V5Error_FailedToTransactAsset | V5Error_FeesNotMet | V5Error_HoldingWouldOverflow | V5Error_InvalidLocation | V5Error_LocationCannotHold | V5Error_LocationFull | V5Error_LocationNotInvertible | V5Error_LockError | V5Error_MaxWeightInvalid | V5Error_NameMismatch | V5Error_NoDeal | V5Error_NoPermission | V5Error_NotDepositable | V5Error_NotHoldingFees | V5Error_NotWithdrawable | V5Error_Overflow | V5Error_PalletNotFound | V5Error_ReanchorFailed | V5Error_TooExpensive | V5Error_TooManyAssets | V5Error_Transport | V5Error_Trap | V5Error_Unanchored | V5Error_UnhandledXcmVersion | V5Error_Unimplemented | V5Error_UnknownClaim | V5Error_Unroutable | V5Error_UntrustedReserveLocation | V5Error_UntrustedTeleportLocation | V5Error_VersionIncompatible | V5Error_WeightLimitReached | V5Error_WeightNotComputable

export interface V5Error_AssetNotFound {
    __kind: 'AssetNotFound'
}

export interface V5Error_BadOrigin {
    __kind: 'BadOrigin'
}

export interface V5Error_Barrier {
    __kind: 'Barrier'
}

export interface V5Error_DestinationUnsupported {
    __kind: 'DestinationUnsupported'
}

export interface V5Error_ExceedsMaxMessageSize {
    __kind: 'ExceedsMaxMessageSize'
}

export interface V5Error_ExceedsStackLimit {
    __kind: 'ExceedsStackLimit'
}

export interface V5Error_ExpectationFalse {
    __kind: 'ExpectationFalse'
}

export interface V5Error_ExportError {
    __kind: 'ExportError'
}

export interface V5Error_FailedToDecode {
    __kind: 'FailedToDecode'
}

export interface V5Error_FailedToTransactAsset {
    __kind: 'FailedToTransactAsset'
}

export interface V5Error_FeesNotMet {
    __kind: 'FeesNotMet'
}

export interface V5Error_HoldingWouldOverflow {
    __kind: 'HoldingWouldOverflow'
}

export interface V5Error_InvalidLocation {
    __kind: 'InvalidLocation'
}

export interface V5Error_LocationCannotHold {
    __kind: 'LocationCannotHold'
}

export interface V5Error_LocationFull {
    __kind: 'LocationFull'
}

export interface V5Error_LocationNotInvertible {
    __kind: 'LocationNotInvertible'
}

export interface V5Error_LockError {
    __kind: 'LockError'
}

export interface V5Error_MaxWeightInvalid {
    __kind: 'MaxWeightInvalid'
}

export interface V5Error_NameMismatch {
    __kind: 'NameMismatch'
}

export interface V5Error_NoDeal {
    __kind: 'NoDeal'
}

export interface V5Error_NoPermission {
    __kind: 'NoPermission'
}

export interface V5Error_NotDepositable {
    __kind: 'NotDepositable'
}

export interface V5Error_NotHoldingFees {
    __kind: 'NotHoldingFees'
}

export interface V5Error_NotWithdrawable {
    __kind: 'NotWithdrawable'
}

export interface V5Error_Overflow {
    __kind: 'Overflow'
}

export interface V5Error_PalletNotFound {
    __kind: 'PalletNotFound'
}

export interface V5Error_ReanchorFailed {
    __kind: 'ReanchorFailed'
}

export interface V5Error_TooExpensive {
    __kind: 'TooExpensive'
}

export interface V5Error_TooManyAssets {
    __kind: 'TooManyAssets'
}

export interface V5Error_Transport {
    __kind: 'Transport'
}

export interface V5Error_Trap {
    __kind: 'Trap'
    value: bigint
}

export interface V5Error_Unanchored {
    __kind: 'Unanchored'
}

export interface V5Error_UnhandledXcmVersion {
    __kind: 'UnhandledXcmVersion'
}

export interface V5Error_Unimplemented {
    __kind: 'Unimplemented'
}

export interface V5Error_UnknownClaim {
    __kind: 'UnknownClaim'
}

export interface V5Error_Unroutable {
    __kind: 'Unroutable'
}

export interface V5Error_UntrustedReserveLocation {
    __kind: 'UntrustedReserveLocation'
}

export interface V5Error_UntrustedTeleportLocation {
    __kind: 'UntrustedTeleportLocation'
}

export interface V5Error_VersionIncompatible {
    __kind: 'VersionIncompatible'
}

export interface V5Error_WeightLimitReached {
    __kind: 'WeightLimitReached'
    value: Weight
}

export interface V5Error_WeightNotComputable {
    __kind: 'WeightNotComputable'
}

export type V3MaybeErrorCode = V3MaybeErrorCode_Error | V3MaybeErrorCode_Success | V3MaybeErrorCode_TruncatedError

export interface V3MaybeErrorCode_Error {
    __kind: 'Error'
    value: Bytes
}

export interface V3MaybeErrorCode_Success {
    __kind: 'Success'
}

export interface V3MaybeErrorCode_TruncatedError {
    __kind: 'TruncatedError'
    value: Bytes
}

export interface V5Asset {
    id: V5AssetId
    fun: V5Fungibility
}

export type V5Fungibility = V5Fungibility_Fungible | V5Fungibility_NonFungible

export interface V5Fungibility_Fungible {
    __kind: 'Fungible'
    value: bigint
}

export interface V5Fungibility_NonFungible {
    __kind: 'NonFungible'
    value: V5AssetInstance
}

export type V5AssetInstance = V5AssetInstance_Array16 | V5AssetInstance_Array32 | V5AssetInstance_Array4 | V5AssetInstance_Array8 | V5AssetInstance_Index | V5AssetInstance_Undefined

export interface V5AssetInstance_Array16 {
    __kind: 'Array16'
    value: Bytes
}

export interface V5AssetInstance_Array32 {
    __kind: 'Array32'
    value: Bytes
}

export interface V5AssetInstance_Array4 {
    __kind: 'Array4'
    value: Bytes
}

export interface V5AssetInstance_Array8 {
    __kind: 'Array8'
    value: Bytes
}

export interface V5AssetInstance_Index {
    __kind: 'Index'
    value: bigint
}

export interface V5AssetInstance_Undefined {
    __kind: 'Undefined'
}

export interface V5AssetId {
    parents: number
    interior: V5Junctions
}

export const V5QueryResponseInfo: sts.Type<V5QueryResponseInfo> = sts.struct(() => {
    return  {
        destination: V5Location,
        queryId: sts.bigint(),
        maxWeight: Weight,
    }
})

export interface V5QueryResponseInfo {
    destination: V5Location
    queryId: bigint
    maxWeight: Weight
}

export const V5AssetTransferFilter: sts.Type<V5AssetTransferFilter> = sts.closedEnum(() => {
    return  {
        ReserveDeposit: V5AssetFilter,
        ReserveWithdraw: V5AssetFilter,
        Teleport: V5AssetFilter,
    }
})

export type V5AssetTransferFilter = V5AssetTransferFilter_ReserveDeposit | V5AssetTransferFilter_ReserveWithdraw | V5AssetTransferFilter_Teleport

export interface V5AssetTransferFilter_ReserveDeposit {
    __kind: 'ReserveDeposit'
    value: V5AssetFilter
}

export interface V5AssetTransferFilter_ReserveWithdraw {
    __kind: 'ReserveWithdraw'
    value: V5AssetFilter
}

export interface V5AssetTransferFilter_Teleport {
    __kind: 'Teleport'
    value: V5AssetFilter
}

export type V5AssetFilter = V5AssetFilter_Definite | V5AssetFilter_Wild

export interface V5AssetFilter_Definite {
    __kind: 'Definite'
    value: V5Asset[]
}

export interface V5AssetFilter_Wild {
    __kind: 'Wild'
    value: V5WildAsset
}

export type V5WildAsset = V5WildAsset_All | V5WildAsset_AllCounted | V5WildAsset_AllOf | V5WildAsset_AllOfCounted

export interface V5WildAsset_All {
    __kind: 'All'
}

export interface V5WildAsset_AllCounted {
    __kind: 'AllCounted'
    value: number
}

export interface V5WildAsset_AllOf {
    __kind: 'AllOf'
    id: V5AssetId
    fun: V5WildFungibility
}

export interface V5WildAsset_AllOfCounted {
    __kind: 'AllOfCounted'
    id: V5AssetId
    fun: V5WildFungibility
    count: number
}

export type V5WildFungibility = V5WildFungibility_Fungible | V5WildFungibility_NonFungible

export interface V5WildFungibility_Fungible {
    __kind: 'Fungible'
}

export interface V5WildFungibility_NonFungible {
    __kind: 'NonFungible'
}

export const V5NetworkId: sts.Type<V5NetworkId> = sts.closedEnum(() => {
    return  {
        BitcoinCash: sts.unit(),
        BitcoinCore: sts.unit(),
        ByFork: sts.enumStruct({
            blockNumber: sts.bigint(),
            blockHash: sts.bytes(),
        }),
        ByGenesis: sts.bytes(),
        Ethereum: sts.enumStruct({
            chainId: sts.bigint(),
        }),
        Kusama: sts.unit(),
        Polkadot: sts.unit(),
        PolkadotBulletin: sts.unit(),
    }
})

export const V3MaybeErrorCode: sts.Type<V3MaybeErrorCode> = sts.closedEnum(() => {
    return  {
        Error: sts.bytes(),
        Success: sts.unit(),
        TruncatedError: sts.bytes(),
    }
})

export const V5Error: sts.Type<V5Error> = sts.closedEnum(() => {
    return  {
        AssetNotFound: sts.unit(),
        BadOrigin: sts.unit(),
        Barrier: sts.unit(),
        DestinationUnsupported: sts.unit(),
        ExceedsMaxMessageSize: sts.unit(),
        ExceedsStackLimit: sts.unit(),
        ExpectationFalse: sts.unit(),
        ExportError: sts.unit(),
        FailedToDecode: sts.unit(),
        FailedToTransactAsset: sts.unit(),
        FeesNotMet: sts.unit(),
        HoldingWouldOverflow: sts.unit(),
        InvalidLocation: sts.unit(),
        LocationCannotHold: sts.unit(),
        LocationFull: sts.unit(),
        LocationNotInvertible: sts.unit(),
        LockError: sts.unit(),
        MaxWeightInvalid: sts.unit(),
        NameMismatch: sts.unit(),
        NoDeal: sts.unit(),
        NoPermission: sts.unit(),
        NotDepositable: sts.unit(),
        NotHoldingFees: sts.unit(),
        NotWithdrawable: sts.unit(),
        Overflow: sts.unit(),
        PalletNotFound: sts.unit(),
        ReanchorFailed: sts.unit(),
        TooExpensive: sts.unit(),
        TooManyAssets: sts.unit(),
        Transport: sts.unit(),
        Trap: sts.bigint(),
        Unanchored: sts.unit(),
        UnhandledXcmVersion: sts.unit(),
        Unimplemented: sts.unit(),
        UnknownClaim: sts.unit(),
        Unroutable: sts.unit(),
        UntrustedReserveLocation: sts.unit(),
        UntrustedTeleportLocation: sts.unit(),
        VersionIncompatible: sts.unit(),
        WeightLimitReached: Weight,
        WeightNotComputable: sts.unit(),
    }
})

export const V5Junctions: sts.Type<V5Junctions> = sts.closedEnum(() => {
    return  {
        Here: sts.unit(),
        X1: sts.array(() => V5Junction),
        X2: sts.array(() => V5Junction),
        X3: sts.array(() => V5Junction),
        X4: sts.array(() => V5Junction),
        X5: sts.array(() => V5Junction),
        X6: sts.array(() => V5Junction),
        X7: sts.array(() => V5Junction),
        X8: sts.array(() => V5Junction),
    }
})

export const V5AssetFilter: sts.Type<V5AssetFilter> = sts.closedEnum(() => {
    return  {
        Definite: sts.array(() => V5Asset),
        Wild: V5WildAsset,
    }
})

export const V5WildAsset: sts.Type<V5WildAsset> = sts.closedEnum(() => {
    return  {
        All: sts.unit(),
        AllCounted: sts.number(),
        AllOf: sts.enumStruct({
            id: V5AssetId,
            fun: V5WildFungibility,
        }),
        AllOfCounted: sts.enumStruct({
            id: V5AssetId,
            fun: V5WildFungibility,
            count: sts.number(),
        }),
    }
})

export const V5WildFungibility: sts.Type<V5WildFungibility> = sts.closedEnum(() => {
    return  {
        Fungible: sts.unit(),
        NonFungible: sts.unit(),
    }
})

export const V5AssetId: sts.Type<V5AssetId> = sts.struct(() => {
    return  {
        parents: sts.number(),
        interior: V5Junctions,
    }
})

export const V5Asset: sts.Type<V5Asset> = sts.struct(() => {
    return  {
        id: V5AssetId,
        fun: V5Fungibility,
    }
})

export const V5Fungibility: sts.Type<V5Fungibility> = sts.closedEnum(() => {
    return  {
        Fungible: sts.bigint(),
        NonFungible: V5AssetInstance,
    }
})

export const V5AssetInstance: sts.Type<V5AssetInstance> = sts.closedEnum(() => {
    return  {
        Array16: sts.bytes(),
        Array32: sts.bytes(),
        Array4: sts.bytes(),
        Array8: sts.bytes(),
        Index: sts.bigint(),
        Undefined: sts.unit(),
    }
})

export const V5Location: sts.Type<V5Location> = sts.struct(() => {
    return  {
        parents: sts.number(),
        interior: V5Junctions,
    }
})

export type V5Instruction = V5Instruction_AliasOrigin | V5Instruction_BurnAsset | V5Instruction_BuyExecution | V5Instruction_ClaimAsset | V5Instruction_ClearError | V5Instruction_ClearOrigin | V5Instruction_ClearTopic | V5Instruction_ClearTransactStatus | V5Instruction_DepositAsset | V5Instruction_DepositReserveAsset | V5Instruction_DescendOrigin | V5Instruction_ExchangeAsset | V5Instruction_ExecuteWithOrigin | V5Instruction_ExpectAsset | V5Instruction_ExpectError | V5Instruction_ExpectOrigin | V5Instruction_ExpectPallet | V5Instruction_ExpectTransactStatus | V5Instruction_ExportMessage | V5Instruction_HrmpChannelAccepted | V5Instruction_HrmpChannelClosing | V5Instruction_HrmpNewChannelOpenRequest | V5Instruction_InitiateReserveWithdraw | V5Instruction_InitiateTeleport | V5Instruction_InitiateTransfer | V5Instruction_LockAsset | V5Instruction_NoteUnlockable | V5Instruction_PayFees | V5Instruction_QueryPallet | V5Instruction_QueryResponse | V5Instruction_ReceiveTeleportedAsset | V5Instruction_RefundSurplus | V5Instruction_ReportError | V5Instruction_ReportHolding | V5Instruction_ReportTransactStatus | V5Instruction_RequestUnlock | V5Instruction_ReserveAssetDeposited | V5Instruction_SetAppendix | V5Instruction_SetErrorHandler | V5Instruction_SetFeesMode | V5Instruction_SetHints | V5Instruction_SetTopic | V5Instruction_SubscribeVersion | V5Instruction_Transact | V5Instruction_TransferAsset | V5Instruction_TransferReserveAsset | V5Instruction_Trap | V5Instruction_UniversalOrigin | V5Instruction_UnlockAsset | V5Instruction_UnpaidExecution | V5Instruction_UnsubscribeVersion | V5Instruction_WithdrawAsset

export interface V5Instruction_AliasOrigin {
    __kind: 'AliasOrigin'
    value: V5Location
}

export interface V5Instruction_BurnAsset {
    __kind: 'BurnAsset'
    value: V5Asset[]
}

export interface V5Instruction_BuyExecution {
    __kind: 'BuyExecution'
    fees: V5Asset
    weightLimit: V3WeightLimit
}

export interface V5Instruction_ClaimAsset {
    __kind: 'ClaimAsset'
    assets: V5Asset[]
    ticket: V5Location
}

export interface V5Instruction_ClearError {
    __kind: 'ClearError'
}

export interface V5Instruction_ClearOrigin {
    __kind: 'ClearOrigin'
}

export interface V5Instruction_ClearTopic {
    __kind: 'ClearTopic'
}

export interface V5Instruction_ClearTransactStatus {
    __kind: 'ClearTransactStatus'
}

export interface V5Instruction_DepositAsset {
    __kind: 'DepositAsset'
    assets: V5AssetFilter
    beneficiary: V5Location
}

export interface V5Instruction_DepositReserveAsset {
    __kind: 'DepositReserveAsset'
    assets: V5AssetFilter
    dest: V5Location
    xcm: V5Instruction[]
}

export interface V5Instruction_DescendOrigin {
    __kind: 'DescendOrigin'
    value: V5Junctions
}

export interface V5Instruction_ExchangeAsset {
    __kind: 'ExchangeAsset'
    give: V5AssetFilter
    want: V5Asset[]
    maximal: boolean
}

export interface V5Instruction_ExecuteWithOrigin {
    __kind: 'ExecuteWithOrigin'
    descendantOrigin?: (V5Junctions | undefined)
    xcm: V5Instruction[]
}

export interface V5Instruction_ExpectAsset {
    __kind: 'ExpectAsset'
    value: V5Asset[]
}

export interface V5Instruction_ExpectError {
    __kind: 'ExpectError'
    value?: ([number, V5Error] | undefined)
}

export interface V5Instruction_ExpectOrigin {
    __kind: 'ExpectOrigin'
    value?: (V5Location | undefined)
}

export interface V5Instruction_ExpectPallet {
    __kind: 'ExpectPallet'
    index: number
    name: Bytes
    moduleName: Bytes
    crateMajor: number
    minCrateMinor: number
}

export interface V5Instruction_ExpectTransactStatus {
    __kind: 'ExpectTransactStatus'
    value: V3MaybeErrorCode
}

export interface V5Instruction_ExportMessage {
    __kind: 'ExportMessage'
    network: V5NetworkId
    destination: V5Junctions
    xcm: V5Instruction[]
}

export interface V5Instruction_HrmpChannelAccepted {
    __kind: 'HrmpChannelAccepted'
    recipient: number
}

export interface V5Instruction_HrmpChannelClosing {
    __kind: 'HrmpChannelClosing'
    initiator: number
    sender: number
    recipient: number
}

export interface V5Instruction_HrmpNewChannelOpenRequest {
    __kind: 'HrmpNewChannelOpenRequest'
    sender: number
    maxMessageSize: number
    maxCapacity: number
}

export interface V5Instruction_InitiateReserveWithdraw {
    __kind: 'InitiateReserveWithdraw'
    assets: V5AssetFilter
    reserve: V5Location
    xcm: V5Instruction[]
}

export interface V5Instruction_InitiateTeleport {
    __kind: 'InitiateTeleport'
    assets: V5AssetFilter
    dest: V5Location
    xcm: V5Instruction[]
}

export interface V5Instruction_InitiateTransfer {
    __kind: 'InitiateTransfer'
    destination: V5Location
    remoteFees?: (V5AssetTransferFilter | undefined)
    preserveOrigin: boolean
    assets: V5AssetTransferFilter[]
    remoteXcm: V5Instruction[]
}

export interface V5Instruction_LockAsset {
    __kind: 'LockAsset'
    asset: V5Asset
    unlocker: V5Location
}

export interface V5Instruction_NoteUnlockable {
    __kind: 'NoteUnlockable'
    asset: V5Asset
    owner: V5Location
}

export interface V5Instruction_PayFees {
    __kind: 'PayFees'
    asset: V5Asset
}

export interface V5Instruction_QueryPallet {
    __kind: 'QueryPallet'
    moduleName: Bytes
    responseInfo: V5QueryResponseInfo
}

export interface V5Instruction_QueryResponse {
    __kind: 'QueryResponse'
    queryId: bigint
    response: V5Response
    maxWeight: Weight
    querier?: (V5Location | undefined)
}

export interface V5Instruction_ReceiveTeleportedAsset {
    __kind: 'ReceiveTeleportedAsset'
    value: V5Asset[]
}

export interface V5Instruction_RefundSurplus {
    __kind: 'RefundSurplus'
}

export interface V5Instruction_ReportError {
    __kind: 'ReportError'
    value: V5QueryResponseInfo
}

export interface V5Instruction_ReportHolding {
    __kind: 'ReportHolding'
    responseInfo: V5QueryResponseInfo
    assets: V5AssetFilter
}

export interface V5Instruction_ReportTransactStatus {
    __kind: 'ReportTransactStatus'
    value: V5QueryResponseInfo
}

export interface V5Instruction_RequestUnlock {
    __kind: 'RequestUnlock'
    asset: V5Asset
    locker: V5Location
}

export interface V5Instruction_ReserveAssetDeposited {
    __kind: 'ReserveAssetDeposited'
    value: V5Asset[]
}

export interface V5Instruction_SetAppendix {
    __kind: 'SetAppendix'
    value: V5Instruction[]
}

export interface V5Instruction_SetErrorHandler {
    __kind: 'SetErrorHandler'
    value: V5Instruction[]
}

export interface V5Instruction_SetFeesMode {
    __kind: 'SetFeesMode'
    jitWithdraw: boolean
}

export interface V5Instruction_SetHints {
    __kind: 'SetHints'
    hints: V5Hint[]
}

export interface V5Instruction_SetTopic {
    __kind: 'SetTopic'
    value: Bytes
}

export interface V5Instruction_SubscribeVersion {
    __kind: 'SubscribeVersion'
    queryId: bigint
    maxResponseWeight: Weight
}

export interface V5Instruction_Transact {
    __kind: 'Transact'
    originKind: V3OriginKind
    fallbackMaxWeight?: (Weight | undefined)
    call: DoubleEncoded
}

export interface V5Instruction_TransferAsset {
    __kind: 'TransferAsset'
    assets: V5Asset[]
    beneficiary: V5Location
}

export interface V5Instruction_TransferReserveAsset {
    __kind: 'TransferReserveAsset'
    assets: V5Asset[]
    dest: V5Location
    xcm: V5Instruction[]
}

export interface V5Instruction_Trap {
    __kind: 'Trap'
    value: bigint
}

export interface V5Instruction_UniversalOrigin {
    __kind: 'UniversalOrigin'
    value: V5Junction
}

export interface V5Instruction_UnlockAsset {
    __kind: 'UnlockAsset'
    asset: V5Asset
    target: V5Location
}

export interface V5Instruction_UnpaidExecution {
    __kind: 'UnpaidExecution'
    weightLimit: V3WeightLimit
    checkOrigin?: (V5Location | undefined)
}

export interface V5Instruction_UnsubscribeVersion {
    __kind: 'UnsubscribeVersion'
}

export interface V5Instruction_WithdrawAsset {
    __kind: 'WithdrawAsset'
    value: V5Asset[]
}

export type V3WeightLimit = V3WeightLimit_Limited | V3WeightLimit_Unlimited

export interface V3WeightLimit_Limited {
    __kind: 'Limited'
    value: Weight
}

export interface V3WeightLimit_Unlimited {
    __kind: 'Unlimited'
}

export const V4Instruction: sts.Type<V4Instruction> = sts.closedEnum(() => {
    return  {
        AliasOrigin: V4Location,
        BurnAsset: sts.array(() => V4Asset),
        BuyExecution: sts.enumStruct({
            fees: V4Asset,
            weightLimit: V3WeightLimit,
        }),
        ClaimAsset: sts.enumStruct({
            assets: sts.array(() => V4Asset),
            ticket: V4Location,
        }),
        ClearError: sts.unit(),
        ClearOrigin: sts.unit(),
        ClearTopic: sts.unit(),
        ClearTransactStatus: sts.unit(),
        DepositAsset: sts.enumStruct({
            assets: V4AssetFilter,
            beneficiary: V4Location,
        }),
        DepositReserveAsset: sts.enumStruct({
            assets: V4AssetFilter,
            dest: V4Location,
            xcm: sts.array(() => V4Instruction),
        }),
        DescendOrigin: V4Junctions,
        ExchangeAsset: sts.enumStruct({
            give: V4AssetFilter,
            want: sts.array(() => V4Asset),
            maximal: sts.boolean(),
        }),
        ExpectAsset: sts.array(() => V4Asset),
        ExpectError: sts.option(() => sts.tuple(() => [sts.number(), V3Error])),
        ExpectOrigin: sts.option(() => V4Location),
        ExpectPallet: sts.enumStruct({
            index: sts.number(),
            name: sts.bytes(),
            moduleName: sts.bytes(),
            crateMajor: sts.number(),
            minCrateMinor: sts.number(),
        }),
        ExpectTransactStatus: V3MaybeErrorCode,
        ExportMessage: sts.enumStruct({
            network: V4NetworkId,
            destination: V4Junctions,
            xcm: sts.array(() => V4Instruction),
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
            assets: V4AssetFilter,
            reserve: V4Location,
            xcm: sts.array(() => V4Instruction),
        }),
        InitiateTeleport: sts.enumStruct({
            assets: V4AssetFilter,
            dest: V4Location,
            xcm: sts.array(() => V4Instruction),
        }),
        LockAsset: sts.enumStruct({
            asset: V4Asset,
            unlocker: V4Location,
        }),
        NoteUnlockable: sts.enumStruct({
            asset: V4Asset,
            owner: V4Location,
        }),
        QueryPallet: sts.enumStruct({
            moduleName: sts.bytes(),
            responseInfo: V4QueryResponseInfo,
        }),
        QueryResponse: sts.enumStruct({
            queryId: sts.bigint(),
            response: V4Response,
            maxWeight: Weight,
            querier: sts.option(() => V4Location),
        }),
        ReceiveTeleportedAsset: sts.array(() => V4Asset),
        RefundSurplus: sts.unit(),
        ReportError: V4QueryResponseInfo,
        ReportHolding: sts.enumStruct({
            responseInfo: V4QueryResponseInfo,
            assets: V4AssetFilter,
        }),
        ReportTransactStatus: V4QueryResponseInfo,
        RequestUnlock: sts.enumStruct({
            asset: V4Asset,
            locker: V4Location,
        }),
        ReserveAssetDeposited: sts.array(() => V4Asset),
        SetAppendix: sts.array(() => V4Instruction),
        SetErrorHandler: sts.array(() => V4Instruction),
        SetFeesMode: sts.enumStruct({
            jitWithdraw: sts.boolean(),
        }),
        SetTopic: sts.bytes(),
        SubscribeVersion: sts.enumStruct({
            queryId: sts.bigint(),
            maxResponseWeight: Weight,
        }),
        Transact: sts.enumStruct({
            originKind: V3OriginKind,
            requireWeightAtMost: Weight,
            call: DoubleEncoded,
        }),
        TransferAsset: sts.enumStruct({
            assets: sts.array(() => V4Asset),
            beneficiary: V4Location,
        }),
        TransferReserveAsset: sts.enumStruct({
            assets: sts.array(() => V4Asset),
            dest: V4Location,
            xcm: sts.array(() => V4Instruction),
        }),
        Trap: sts.bigint(),
        UniversalOrigin: V4Junction,
        UnlockAsset: sts.enumStruct({
            asset: V4Asset,
            target: V4Location,
        }),
        UnpaidExecution: sts.enumStruct({
            weightLimit: V3WeightLimit,
            checkOrigin: sts.option(() => V4Location),
        }),
        UnsubscribeVersion: sts.unit(),
        WithdrawAsset: sts.array(() => V4Asset),
    }
})

export const V4Junction: sts.Type<V4Junction> = sts.closedEnum(() => {
    return  {
        AccountId32: sts.enumStruct({
            network: sts.option(() => V4NetworkId),
            id: sts.bytes(),
        }),
        AccountIndex64: sts.enumStruct({
            network: sts.option(() => V4NetworkId),
            index: sts.bigint(),
        }),
        AccountKey20: sts.enumStruct({
            network: sts.option(() => V4NetworkId),
            key: sts.bytes(),
        }),
        GeneralIndex: sts.bigint(),
        GeneralKey: sts.enumStruct({
            length: sts.number(),
            data: sts.bytes(),
        }),
        GlobalConsensus: V4NetworkId,
        OnlyChild: sts.unit(),
        PalletInstance: sts.number(),
        Parachain: sts.number(),
        Plurality: sts.enumStruct({
            id: V3BodyId,
            part: V3BodyPart,
        }),
    }
})

export type V4Junction = V4Junction_AccountId32 | V4Junction_AccountIndex64 | V4Junction_AccountKey20 | V4Junction_GeneralIndex | V4Junction_GeneralKey | V4Junction_GlobalConsensus | V4Junction_OnlyChild | V4Junction_PalletInstance | V4Junction_Parachain | V4Junction_Plurality

export interface V4Junction_AccountId32 {
    __kind: 'AccountId32'
    network?: (V4NetworkId | undefined)
    id: Bytes
}

export interface V4Junction_AccountIndex64 {
    __kind: 'AccountIndex64'
    network?: (V4NetworkId | undefined)
    index: bigint
}

export interface V4Junction_AccountKey20 {
    __kind: 'AccountKey20'
    network?: (V4NetworkId | undefined)
    key: Bytes
}

export interface V4Junction_GeneralIndex {
    __kind: 'GeneralIndex'
    value: bigint
}

export interface V4Junction_GeneralKey {
    __kind: 'GeneralKey'
    length: number
    data: Bytes
}

export interface V4Junction_GlobalConsensus {
    __kind: 'GlobalConsensus'
    value: V4NetworkId
}

export interface V4Junction_OnlyChild {
    __kind: 'OnlyChild'
}

export interface V4Junction_PalletInstance {
    __kind: 'PalletInstance'
    value: number
}

export interface V4Junction_Parachain {
    __kind: 'Parachain'
    value: number
}

export interface V4Junction_Plurality {
    __kind: 'Plurality'
    id: V3BodyId
    part: V3BodyPart
}

export type V4NetworkId = V4NetworkId_BitcoinCash | V4NetworkId_BitcoinCore | V4NetworkId_ByFork | V4NetworkId_ByGenesis | V4NetworkId_Ethereum | V4NetworkId_Kusama | V4NetworkId_Polkadot | V4NetworkId_PolkadotBulletin | V4NetworkId_Rococo | V4NetworkId_Westend | V4NetworkId_Wococo

export interface V4NetworkId_BitcoinCash {
    __kind: 'BitcoinCash'
}

export interface V4NetworkId_BitcoinCore {
    __kind: 'BitcoinCore'
}

export interface V4NetworkId_ByFork {
    __kind: 'ByFork'
    blockNumber: bigint
    blockHash: Bytes
}

export interface V4NetworkId_ByGenesis {
    __kind: 'ByGenesis'
    value: Bytes
}

export interface V4NetworkId_Ethereum {
    __kind: 'Ethereum'
    chainId: bigint
}

export interface V4NetworkId_Kusama {
    __kind: 'Kusama'
}

export interface V4NetworkId_Polkadot {
    __kind: 'Polkadot'
}

export interface V4NetworkId_PolkadotBulletin {
    __kind: 'PolkadotBulletin'
}

export interface V4NetworkId_Rococo {
    __kind: 'Rococo'
}

export interface V4NetworkId_Westend {
    __kind: 'Westend'
}

export interface V4NetworkId_Wococo {
    __kind: 'Wococo'
}

export const V4Response: sts.Type<V4Response> = sts.closedEnum(() => {
    return  {
        Assets: sts.array(() => V4Asset),
        DispatchResult: V3MaybeErrorCode,
        ExecutionResult: sts.option(() => sts.tuple(() => [sts.number(), V3Error])),
        Null: sts.unit(),
        PalletsInfo: sts.array(() => V4PalletInfo),
        Version: sts.number(),
    }
})

export const V4PalletInfo: sts.Type<V4PalletInfo> = sts.struct(() => {
    return  {
        index: sts.number(),
        name: sts.bytes(),
        moduleName: sts.bytes(),
        major: sts.number(),
        minor: sts.number(),
        patch: sts.number(),
    }
})

export interface V4PalletInfo {
    index: number
    name: Bytes
    moduleName: Bytes
    major: number
    minor: number
    patch: number
}

export type V4Response = V4Response_Assets | V4Response_DispatchResult | V4Response_ExecutionResult | V4Response_Null | V4Response_PalletsInfo | V4Response_Version

export interface V4Response_Assets {
    __kind: 'Assets'
    value: V4Asset[]
}

export interface V4Response_DispatchResult {
    __kind: 'DispatchResult'
    value: V3MaybeErrorCode
}

export interface V4Response_ExecutionResult {
    __kind: 'ExecutionResult'
    value?: ([number, V3Error] | undefined)
}

export interface V4Response_Null {
    __kind: 'Null'
}

export interface V4Response_PalletsInfo {
    __kind: 'PalletsInfo'
    value: V4PalletInfo[]
}

export interface V4Response_Version {
    __kind: 'Version'
    value: number
}

export type V3Error = V3Error_AssetNotFound | V3Error_BadOrigin | V3Error_Barrier | V3Error_DestinationUnsupported | V3Error_ExceedsMaxMessageSize | V3Error_ExceedsStackLimit | V3Error_ExpectationFalse | V3Error_ExportError | V3Error_FailedToDecode | V3Error_FailedToTransactAsset | V3Error_FeesNotMet | V3Error_HoldingWouldOverflow | V3Error_InvalidLocation | V3Error_LocationCannotHold | V3Error_LocationFull | V3Error_LocationNotInvertible | V3Error_LockError | V3Error_MaxWeightInvalid | V3Error_NameMismatch | V3Error_NoDeal | V3Error_NoPermission | V3Error_NotDepositable | V3Error_NotHoldingFees | V3Error_NotWithdrawable | V3Error_Overflow | V3Error_PalletNotFound | V3Error_ReanchorFailed | V3Error_TooExpensive | V3Error_Transport | V3Error_Trap | V3Error_Unanchored | V3Error_UnhandledXcmVersion | V3Error_Unimplemented | V3Error_UnknownClaim | V3Error_Unroutable | V3Error_UntrustedReserveLocation | V3Error_UntrustedTeleportLocation | V3Error_VersionIncompatible | V3Error_WeightLimitReached | V3Error_WeightNotComputable

export interface V3Error_AssetNotFound {
    __kind: 'AssetNotFound'
}

export interface V3Error_BadOrigin {
    __kind: 'BadOrigin'
}

export interface V3Error_Barrier {
    __kind: 'Barrier'
}

export interface V3Error_DestinationUnsupported {
    __kind: 'DestinationUnsupported'
}

export interface V3Error_ExceedsMaxMessageSize {
    __kind: 'ExceedsMaxMessageSize'
}

export interface V3Error_ExceedsStackLimit {
    __kind: 'ExceedsStackLimit'
}

export interface V3Error_ExpectationFalse {
    __kind: 'ExpectationFalse'
}

export interface V3Error_ExportError {
    __kind: 'ExportError'
}

export interface V3Error_FailedToDecode {
    __kind: 'FailedToDecode'
}

export interface V3Error_FailedToTransactAsset {
    __kind: 'FailedToTransactAsset'
}

export interface V3Error_FeesNotMet {
    __kind: 'FeesNotMet'
}

export interface V3Error_HoldingWouldOverflow {
    __kind: 'HoldingWouldOverflow'
}

export interface V3Error_InvalidLocation {
    __kind: 'InvalidLocation'
}

export interface V3Error_LocationCannotHold {
    __kind: 'LocationCannotHold'
}

export interface V3Error_LocationFull {
    __kind: 'LocationFull'
}

export interface V3Error_LocationNotInvertible {
    __kind: 'LocationNotInvertible'
}

export interface V3Error_LockError {
    __kind: 'LockError'
}

export interface V3Error_MaxWeightInvalid {
    __kind: 'MaxWeightInvalid'
}

export interface V3Error_NameMismatch {
    __kind: 'NameMismatch'
}

export interface V3Error_NoDeal {
    __kind: 'NoDeal'
}

export interface V3Error_NoPermission {
    __kind: 'NoPermission'
}

export interface V3Error_NotDepositable {
    __kind: 'NotDepositable'
}

export interface V3Error_NotHoldingFees {
    __kind: 'NotHoldingFees'
}

export interface V3Error_NotWithdrawable {
    __kind: 'NotWithdrawable'
}

export interface V3Error_Overflow {
    __kind: 'Overflow'
}

export interface V3Error_PalletNotFound {
    __kind: 'PalletNotFound'
}

export interface V3Error_ReanchorFailed {
    __kind: 'ReanchorFailed'
}

export interface V3Error_TooExpensive {
    __kind: 'TooExpensive'
}

export interface V3Error_Transport {
    __kind: 'Transport'
}

export interface V3Error_Trap {
    __kind: 'Trap'
    value: bigint
}

export interface V3Error_Unanchored {
    __kind: 'Unanchored'
}

export interface V3Error_UnhandledXcmVersion {
    __kind: 'UnhandledXcmVersion'
}

export interface V3Error_Unimplemented {
    __kind: 'Unimplemented'
}

export interface V3Error_UnknownClaim {
    __kind: 'UnknownClaim'
}

export interface V3Error_Unroutable {
    __kind: 'Unroutable'
}

export interface V3Error_UntrustedReserveLocation {
    __kind: 'UntrustedReserveLocation'
}

export interface V3Error_UntrustedTeleportLocation {
    __kind: 'UntrustedTeleportLocation'
}

export interface V3Error_VersionIncompatible {
    __kind: 'VersionIncompatible'
}

export interface V3Error_WeightLimitReached {
    __kind: 'WeightLimitReached'
    value: Weight
}

export interface V3Error_WeightNotComputable {
    __kind: 'WeightNotComputable'
}

export interface V4Asset {
    id: V4AssetId
    fun: V4Fungibility
}

export type V4Fungibility = V4Fungibility_Fungible | V4Fungibility_NonFungible

export interface V4Fungibility_Fungible {
    __kind: 'Fungible'
    value: bigint
}

export interface V4Fungibility_NonFungible {
    __kind: 'NonFungible'
    value: V4AssetInstance
}

export type V4AssetInstance = V4AssetInstance_Array16 | V4AssetInstance_Array32 | V4AssetInstance_Array4 | V4AssetInstance_Array8 | V4AssetInstance_Index | V4AssetInstance_Undefined

export interface V4AssetInstance_Array16 {
    __kind: 'Array16'
    value: Bytes
}

export interface V4AssetInstance_Array32 {
    __kind: 'Array32'
    value: Bytes
}

export interface V4AssetInstance_Array4 {
    __kind: 'Array4'
    value: Bytes
}

export interface V4AssetInstance_Array8 {
    __kind: 'Array8'
    value: Bytes
}

export interface V4AssetInstance_Index {
    __kind: 'Index'
    value: bigint
}

export interface V4AssetInstance_Undefined {
    __kind: 'Undefined'
}

export interface V4AssetId {
    parents: number
    interior: V4Junctions
}

export type V4Junctions = V4Junctions_Here | V4Junctions_X1 | V4Junctions_X2 | V4Junctions_X3 | V4Junctions_X4 | V4Junctions_X5 | V4Junctions_X6 | V4Junctions_X7 | V4Junctions_X8

export interface V4Junctions_Here {
    __kind: 'Here'
}

export interface V4Junctions_X1 {
    __kind: 'X1'
    value: V4Junction[]
}

export interface V4Junctions_X2 {
    __kind: 'X2'
    value: V4Junction[]
}

export interface V4Junctions_X3 {
    __kind: 'X3'
    value: V4Junction[]
}

export interface V4Junctions_X4 {
    __kind: 'X4'
    value: V4Junction[]
}

export interface V4Junctions_X5 {
    __kind: 'X5'
    value: V4Junction[]
}

export interface V4Junctions_X6 {
    __kind: 'X6'
    value: V4Junction[]
}

export interface V4Junctions_X7 {
    __kind: 'X7'
    value: V4Junction[]
}

export interface V4Junctions_X8 {
    __kind: 'X8'
    value: V4Junction[]
}

export const V4QueryResponseInfo: sts.Type<V4QueryResponseInfo> = sts.struct(() => {
    return  {
        destination: V4Location,
        queryId: sts.bigint(),
        maxWeight: Weight,
    }
})

export interface V4QueryResponseInfo {
    destination: V4Location
    queryId: bigint
    maxWeight: Weight
}

export interface V4Location {
    parents: number
    interior: V4Junctions
}

export const V4NetworkId: sts.Type<V4NetworkId> = sts.closedEnum(() => {
    return  {
        BitcoinCash: sts.unit(),
        BitcoinCore: sts.unit(),
        ByFork: sts.enumStruct({
            blockNumber: sts.bigint(),
            blockHash: sts.bytes(),
        }),
        ByGenesis: sts.bytes(),
        Ethereum: sts.enumStruct({
            chainId: sts.bigint(),
        }),
        Kusama: sts.unit(),
        Polkadot: sts.unit(),
        PolkadotBulletin: sts.unit(),
        Rococo: sts.unit(),
        Westend: sts.unit(),
        Wococo: sts.unit(),
    }
})

export const V3Error: sts.Type<V3Error> = sts.closedEnum(() => {
    return  {
        AssetNotFound: sts.unit(),
        BadOrigin: sts.unit(),
        Barrier: sts.unit(),
        DestinationUnsupported: sts.unit(),
        ExceedsMaxMessageSize: sts.unit(),
        ExceedsStackLimit: sts.unit(),
        ExpectationFalse: sts.unit(),
        ExportError: sts.unit(),
        FailedToDecode: sts.unit(),
        FailedToTransactAsset: sts.unit(),
        FeesNotMet: sts.unit(),
        HoldingWouldOverflow: sts.unit(),
        InvalidLocation: sts.unit(),
        LocationCannotHold: sts.unit(),
        LocationFull: sts.unit(),
        LocationNotInvertible: sts.unit(),
        LockError: sts.unit(),
        MaxWeightInvalid: sts.unit(),
        NameMismatch: sts.unit(),
        NoDeal: sts.unit(),
        NoPermission: sts.unit(),
        NotDepositable: sts.unit(),
        NotHoldingFees: sts.unit(),
        NotWithdrawable: sts.unit(),
        Overflow: sts.unit(),
        PalletNotFound: sts.unit(),
        ReanchorFailed: sts.unit(),
        TooExpensive: sts.unit(),
        Transport: sts.unit(),
        Trap: sts.bigint(),
        Unanchored: sts.unit(),
        UnhandledXcmVersion: sts.unit(),
        Unimplemented: sts.unit(),
        UnknownClaim: sts.unit(),
        Unroutable: sts.unit(),
        UntrustedReserveLocation: sts.unit(),
        UntrustedTeleportLocation: sts.unit(),
        VersionIncompatible: sts.unit(),
        WeightLimitReached: Weight,
        WeightNotComputable: sts.unit(),
    }
})

export const V4Junctions: sts.Type<V4Junctions> = sts.closedEnum(() => {
    return  {
        Here: sts.unit(),
        X1: sts.array(() => V4Junction),
        X2: sts.array(() => V4Junction),
        X3: sts.array(() => V4Junction),
        X4: sts.array(() => V4Junction),
        X5: sts.array(() => V4Junction),
        X6: sts.array(() => V4Junction),
        X7: sts.array(() => V4Junction),
        X8: sts.array(() => V4Junction),
    }
})

export const V4AssetFilter: sts.Type<V4AssetFilter> = sts.closedEnum(() => {
    return  {
        Definite: sts.array(() => V4Asset),
        Wild: V4WildAsset,
    }
})

export const V4WildAsset: sts.Type<V4WildAsset> = sts.closedEnum(() => {
    return  {
        All: sts.unit(),
        AllCounted: sts.number(),
        AllOf: sts.enumStruct({
            id: V4AssetId,
            fun: V4WildFungibility,
        }),
        AllOfCounted: sts.enumStruct({
            id: V4AssetId,
            fun: V4WildFungibility,
            count: sts.number(),
        }),
    }
})

export const V4WildFungibility: sts.Type<V4WildFungibility> = sts.closedEnum(() => {
    return  {
        Fungible: sts.unit(),
        NonFungible: sts.unit(),
    }
})

export type V4WildFungibility = V4WildFungibility_Fungible | V4WildFungibility_NonFungible

export interface V4WildFungibility_Fungible {
    __kind: 'Fungible'
}

export interface V4WildFungibility_NonFungible {
    __kind: 'NonFungible'
}

export const V4AssetId: sts.Type<V4AssetId> = sts.struct(() => {
    return  {
        parents: sts.number(),
        interior: V4Junctions,
    }
})

export type V4WildAsset = V4WildAsset_All | V4WildAsset_AllCounted | V4WildAsset_AllOf | V4WildAsset_AllOfCounted

export interface V4WildAsset_All {
    __kind: 'All'
}

export interface V4WildAsset_AllCounted {
    __kind: 'AllCounted'
    value: number
}

export interface V4WildAsset_AllOf {
    __kind: 'AllOf'
    id: V4AssetId
    fun: V4WildFungibility
}

export interface V4WildAsset_AllOfCounted {
    __kind: 'AllOfCounted'
    id: V4AssetId
    fun: V4WildFungibility
    count: number
}

export type V4AssetFilter = V4AssetFilter_Definite | V4AssetFilter_Wild

export interface V4AssetFilter_Definite {
    __kind: 'Definite'
    value: V4Asset[]
}

export interface V4AssetFilter_Wild {
    __kind: 'Wild'
    value: V4WildAsset
}

export const V4Asset: sts.Type<V4Asset> = sts.struct(() => {
    return  {
        id: V4AssetId,
        fun: V4Fungibility,
    }
})

export const V4Fungibility: sts.Type<V4Fungibility> = sts.closedEnum(() => {
    return  {
        Fungible: sts.bigint(),
        NonFungible: V4AssetInstance,
    }
})

export const V4AssetInstance: sts.Type<V4AssetInstance> = sts.closedEnum(() => {
    return  {
        Array16: sts.bytes(),
        Array32: sts.bytes(),
        Array4: sts.bytes(),
        Array8: sts.bytes(),
        Index: sts.bigint(),
        Undefined: sts.unit(),
    }
})

export const V4Location: sts.Type<V4Location> = sts.struct(() => {
    return  {
        parents: sts.number(),
        interior: V4Junctions,
    }
})

export type V4Instruction = V4Instruction_AliasOrigin | V4Instruction_BurnAsset | V4Instruction_BuyExecution | V4Instruction_ClaimAsset | V4Instruction_ClearError | V4Instruction_ClearOrigin | V4Instruction_ClearTopic | V4Instruction_ClearTransactStatus | V4Instruction_DepositAsset | V4Instruction_DepositReserveAsset | V4Instruction_DescendOrigin | V4Instruction_ExchangeAsset | V4Instruction_ExpectAsset | V4Instruction_ExpectError | V4Instruction_ExpectOrigin | V4Instruction_ExpectPallet | V4Instruction_ExpectTransactStatus | V4Instruction_ExportMessage | V4Instruction_HrmpChannelAccepted | V4Instruction_HrmpChannelClosing | V4Instruction_HrmpNewChannelOpenRequest | V4Instruction_InitiateReserveWithdraw | V4Instruction_InitiateTeleport | V4Instruction_LockAsset | V4Instruction_NoteUnlockable | V4Instruction_QueryPallet | V4Instruction_QueryResponse | V4Instruction_ReceiveTeleportedAsset | V4Instruction_RefundSurplus | V4Instruction_ReportError | V4Instruction_ReportHolding | V4Instruction_ReportTransactStatus | V4Instruction_RequestUnlock | V4Instruction_ReserveAssetDeposited | V4Instruction_SetAppendix | V4Instruction_SetErrorHandler | V4Instruction_SetFeesMode | V4Instruction_SetTopic | V4Instruction_SubscribeVersion | V4Instruction_Transact | V4Instruction_TransferAsset | V4Instruction_TransferReserveAsset | V4Instruction_Trap | V4Instruction_UniversalOrigin | V4Instruction_UnlockAsset | V4Instruction_UnpaidExecution | V4Instruction_UnsubscribeVersion | V4Instruction_WithdrawAsset

export interface V4Instruction_AliasOrigin {
    __kind: 'AliasOrigin'
    value: V4Location
}

export interface V4Instruction_BurnAsset {
    __kind: 'BurnAsset'
    value: V4Asset[]
}

export interface V4Instruction_BuyExecution {
    __kind: 'BuyExecution'
    fees: V4Asset
    weightLimit: V3WeightLimit
}

export interface V4Instruction_ClaimAsset {
    __kind: 'ClaimAsset'
    assets: V4Asset[]
    ticket: V4Location
}

export interface V4Instruction_ClearError {
    __kind: 'ClearError'
}

export interface V4Instruction_ClearOrigin {
    __kind: 'ClearOrigin'
}

export interface V4Instruction_ClearTopic {
    __kind: 'ClearTopic'
}

export interface V4Instruction_ClearTransactStatus {
    __kind: 'ClearTransactStatus'
}

export interface V4Instruction_DepositAsset {
    __kind: 'DepositAsset'
    assets: V4AssetFilter
    beneficiary: V4Location
}

export interface V4Instruction_DepositReserveAsset {
    __kind: 'DepositReserveAsset'
    assets: V4AssetFilter
    dest: V4Location
    xcm: V4Instruction[]
}

export interface V4Instruction_DescendOrigin {
    __kind: 'DescendOrigin'
    value: V4Junctions
}

export interface V4Instruction_ExchangeAsset {
    __kind: 'ExchangeAsset'
    give: V4AssetFilter
    want: V4Asset[]
    maximal: boolean
}

export interface V4Instruction_ExpectAsset {
    __kind: 'ExpectAsset'
    value: V4Asset[]
}

export interface V4Instruction_ExpectError {
    __kind: 'ExpectError'
    value?: ([number, V3Error] | undefined)
}

export interface V4Instruction_ExpectOrigin {
    __kind: 'ExpectOrigin'
    value?: (V4Location | undefined)
}

export interface V4Instruction_ExpectPallet {
    __kind: 'ExpectPallet'
    index: number
    name: Bytes
    moduleName: Bytes
    crateMajor: number
    minCrateMinor: number
}

export interface V4Instruction_ExpectTransactStatus {
    __kind: 'ExpectTransactStatus'
    value: V3MaybeErrorCode
}

export interface V4Instruction_ExportMessage {
    __kind: 'ExportMessage'
    network: V4NetworkId
    destination: V4Junctions
    xcm: V4Instruction[]
}

export interface V4Instruction_HrmpChannelAccepted {
    __kind: 'HrmpChannelAccepted'
    recipient: number
}

export interface V4Instruction_HrmpChannelClosing {
    __kind: 'HrmpChannelClosing'
    initiator: number
    sender: number
    recipient: number
}

export interface V4Instruction_HrmpNewChannelOpenRequest {
    __kind: 'HrmpNewChannelOpenRequest'
    sender: number
    maxMessageSize: number
    maxCapacity: number
}

export interface V4Instruction_InitiateReserveWithdraw {
    __kind: 'InitiateReserveWithdraw'
    assets: V4AssetFilter
    reserve: V4Location
    xcm: V4Instruction[]
}

export interface V4Instruction_InitiateTeleport {
    __kind: 'InitiateTeleport'
    assets: V4AssetFilter
    dest: V4Location
    xcm: V4Instruction[]
}

export interface V4Instruction_LockAsset {
    __kind: 'LockAsset'
    asset: V4Asset
    unlocker: V4Location
}

export interface V4Instruction_NoteUnlockable {
    __kind: 'NoteUnlockable'
    asset: V4Asset
    owner: V4Location
}

export interface V4Instruction_QueryPallet {
    __kind: 'QueryPallet'
    moduleName: Bytes
    responseInfo: V4QueryResponseInfo
}

export interface V4Instruction_QueryResponse {
    __kind: 'QueryResponse'
    queryId: bigint
    response: V4Response
    maxWeight: Weight
    querier?: (V4Location | undefined)
}

export interface V4Instruction_ReceiveTeleportedAsset {
    __kind: 'ReceiveTeleportedAsset'
    value: V4Asset[]
}

export interface V4Instruction_RefundSurplus {
    __kind: 'RefundSurplus'
}

export interface V4Instruction_ReportError {
    __kind: 'ReportError'
    value: V4QueryResponseInfo
}

export interface V4Instruction_ReportHolding {
    __kind: 'ReportHolding'
    responseInfo: V4QueryResponseInfo
    assets: V4AssetFilter
}

export interface V4Instruction_ReportTransactStatus {
    __kind: 'ReportTransactStatus'
    value: V4QueryResponseInfo
}

export interface V4Instruction_RequestUnlock {
    __kind: 'RequestUnlock'
    asset: V4Asset
    locker: V4Location
}

export interface V4Instruction_ReserveAssetDeposited {
    __kind: 'ReserveAssetDeposited'
    value: V4Asset[]
}

export interface V4Instruction_SetAppendix {
    __kind: 'SetAppendix'
    value: V4Instruction[]
}

export interface V4Instruction_SetErrorHandler {
    __kind: 'SetErrorHandler'
    value: V4Instruction[]
}

export interface V4Instruction_SetFeesMode {
    __kind: 'SetFeesMode'
    jitWithdraw: boolean
}

export interface V4Instruction_SetTopic {
    __kind: 'SetTopic'
    value: Bytes
}

export interface V4Instruction_SubscribeVersion {
    __kind: 'SubscribeVersion'
    queryId: bigint
    maxResponseWeight: Weight
}

export interface V4Instruction_Transact {
    __kind: 'Transact'
    originKind: V3OriginKind
    requireWeightAtMost: Weight
    call: DoubleEncoded
}

export interface V4Instruction_TransferAsset {
    __kind: 'TransferAsset'
    assets: V4Asset[]
    beneficiary: V4Location
}

export interface V4Instruction_TransferReserveAsset {
    __kind: 'TransferReserveAsset'
    assets: V4Asset[]
    dest: V4Location
    xcm: V4Instruction[]
}

export interface V4Instruction_Trap {
    __kind: 'Trap'
    value: bigint
}

export interface V4Instruction_UniversalOrigin {
    __kind: 'UniversalOrigin'
    value: V4Junction
}

export interface V4Instruction_UnlockAsset {
    __kind: 'UnlockAsset'
    asset: V4Asset
    target: V4Location
}

export interface V4Instruction_UnpaidExecution {
    __kind: 'UnpaidExecution'
    weightLimit: V3WeightLimit
    checkOrigin?: (V4Location | undefined)
}

export interface V4Instruction_UnsubscribeVersion {
    __kind: 'UnsubscribeVersion'
}

export interface V4Instruction_WithdrawAsset {
    __kind: 'WithdrawAsset'
    value: V4Asset[]
}

export const V3Instruction: sts.Type<V3Instruction> = sts.closedEnum(() => {
    return  {
        AliasOrigin: V3MultiLocation,
        BurnAsset: sts.array(() => V3MultiAsset),
        BuyExecution: sts.enumStruct({
            fees: V3MultiAsset,
            weightLimit: V3WeightLimit,
        }),
        ClaimAsset: sts.enumStruct({
            assets: sts.array(() => V3MultiAsset),
            ticket: V3MultiLocation,
        }),
        ClearError: sts.unit(),
        ClearOrigin: sts.unit(),
        ClearTopic: sts.unit(),
        ClearTransactStatus: sts.unit(),
        DepositAsset: sts.enumStruct({
            assets: V3MultiAssetFilter,
            beneficiary: V3MultiLocation,
        }),
        DepositReserveAsset: sts.enumStruct({
            assets: V3MultiAssetFilter,
            dest: V3MultiLocation,
            xcm: sts.array(() => V3Instruction),
        }),
        DescendOrigin: V3Junctions,
        ExchangeAsset: sts.enumStruct({
            give: V3MultiAssetFilter,
            want: sts.array(() => V3MultiAsset),
            maximal: sts.boolean(),
        }),
        ExpectAsset: sts.array(() => V3MultiAsset),
        ExpectError: sts.option(() => sts.tuple(() => [sts.number(), V3Error])),
        ExpectOrigin: sts.option(() => V3MultiLocation),
        ExpectPallet: sts.enumStruct({
            index: sts.number(),
            name: sts.bytes(),
            moduleName: sts.bytes(),
            crateMajor: sts.number(),
            minCrateMinor: sts.number(),
        }),
        ExpectTransactStatus: V3MaybeErrorCode,
        ExportMessage: sts.enumStruct({
            network: V3NetworkId,
            destination: V3Junctions,
            xcm: sts.array(() => V3Instruction),
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
            assets: V3MultiAssetFilter,
            reserve: V3MultiLocation,
            xcm: sts.array(() => V3Instruction),
        }),
        InitiateTeleport: sts.enumStruct({
            assets: V3MultiAssetFilter,
            dest: V3MultiLocation,
            xcm: sts.array(() => V3Instruction),
        }),
        LockAsset: sts.enumStruct({
            asset: V3MultiAsset,
            unlocker: V3MultiLocation,
        }),
        NoteUnlockable: sts.enumStruct({
            asset: V3MultiAsset,
            owner: V3MultiLocation,
        }),
        QueryPallet: sts.enumStruct({
            moduleName: sts.bytes(),
            responseInfo: V3QueryResponseInfo,
        }),
        QueryResponse: sts.enumStruct({
            queryId: sts.bigint(),
            response: V3Response,
            maxWeight: Weight,
            querier: sts.option(() => V3MultiLocation),
        }),
        ReceiveTeleportedAsset: sts.array(() => V3MultiAsset),
        RefundSurplus: sts.unit(),
        ReportError: V3QueryResponseInfo,
        ReportHolding: sts.enumStruct({
            responseInfo: V3QueryResponseInfo,
            assets: V3MultiAssetFilter,
        }),
        ReportTransactStatus: V3QueryResponseInfo,
        RequestUnlock: sts.enumStruct({
            asset: V3MultiAsset,
            locker: V3MultiLocation,
        }),
        ReserveAssetDeposited: sts.array(() => V3MultiAsset),
        SetAppendix: sts.array(() => V3Instruction),
        SetErrorHandler: sts.array(() => V3Instruction),
        SetFeesMode: sts.enumStruct({
            jitWithdraw: sts.boolean(),
        }),
        SetTopic: sts.bytes(),
        SubscribeVersion: sts.enumStruct({
            queryId: sts.bigint(),
            maxResponseWeight: Weight,
        }),
        Transact: sts.enumStruct({
            originKind: V3OriginKind,
            requireWeightAtMost: Weight,
            call: DoubleEncoded,
        }),
        TransferAsset: sts.enumStruct({
            assets: sts.array(() => V3MultiAsset),
            beneficiary: V3MultiLocation,
        }),
        TransferReserveAsset: sts.enumStruct({
            assets: sts.array(() => V3MultiAsset),
            dest: V3MultiLocation,
            xcm: sts.array(() => V3Instruction),
        }),
        Trap: sts.bigint(),
        UniversalOrigin: V3Junction,
        UnlockAsset: sts.enumStruct({
            asset: V3MultiAsset,
            target: V3MultiLocation,
        }),
        UnpaidExecution: sts.enumStruct({
            weightLimit: V3WeightLimit,
            checkOrigin: sts.option(() => V3MultiLocation),
        }),
        UnsubscribeVersion: sts.unit(),
        WithdrawAsset: sts.array(() => V3MultiAsset),
    }
})

export const V3Junction: sts.Type<V3Junction> = sts.closedEnum(() => {
    return  {
        AccountId32: sts.enumStruct({
            network: sts.option(() => V3NetworkId),
            id: sts.bytes(),
        }),
        AccountIndex64: sts.enumStruct({
            network: sts.option(() => V3NetworkId),
            index: sts.bigint(),
        }),
        AccountKey20: sts.enumStruct({
            network: sts.option(() => V3NetworkId),
            key: sts.bytes(),
        }),
        GeneralIndex: sts.bigint(),
        GeneralKey: sts.enumStruct({
            length: sts.number(),
            data: sts.bytes(),
        }),
        GlobalConsensus: V3NetworkId,
        OnlyChild: sts.unit(),
        PalletInstance: sts.number(),
        Parachain: sts.number(),
        Plurality: sts.enumStruct({
            id: V3BodyId,
            part: V3BodyPart,
        }),
    }
})

export type V3Junction = V3Junction_AccountId32 | V3Junction_AccountIndex64 | V3Junction_AccountKey20 | V3Junction_GeneralIndex | V3Junction_GeneralKey | V3Junction_GlobalConsensus | V3Junction_OnlyChild | V3Junction_PalletInstance | V3Junction_Parachain | V3Junction_Plurality

export interface V3Junction_AccountId32 {
    __kind: 'AccountId32'
    network?: (V3NetworkId | undefined)
    id: Bytes
}

export interface V3Junction_AccountIndex64 {
    __kind: 'AccountIndex64'
    network?: (V3NetworkId | undefined)
    index: bigint
}

export interface V3Junction_AccountKey20 {
    __kind: 'AccountKey20'
    network?: (V3NetworkId | undefined)
    key: Bytes
}

export interface V3Junction_GeneralIndex {
    __kind: 'GeneralIndex'
    value: bigint
}

export interface V3Junction_GeneralKey {
    __kind: 'GeneralKey'
    length: number
    data: Bytes
}

export interface V3Junction_GlobalConsensus {
    __kind: 'GlobalConsensus'
    value: V3NetworkId
}

export interface V3Junction_OnlyChild {
    __kind: 'OnlyChild'
}

export interface V3Junction_PalletInstance {
    __kind: 'PalletInstance'
    value: number
}

export interface V3Junction_Parachain {
    __kind: 'Parachain'
    value: number
}

export interface V3Junction_Plurality {
    __kind: 'Plurality'
    id: V3BodyId
    part: V3BodyPart
}

export type V3NetworkId = V3NetworkId_BitcoinCash | V3NetworkId_BitcoinCore | V3NetworkId_ByFork | V3NetworkId_ByGenesis | V3NetworkId_Ethereum | V3NetworkId_Kusama | V3NetworkId_Polkadot | V3NetworkId_PolkadotBulletin | V3NetworkId_Rococo | V3NetworkId_Westend | V3NetworkId_Wococo

export interface V3NetworkId_BitcoinCash {
    __kind: 'BitcoinCash'
}

export interface V3NetworkId_BitcoinCore {
    __kind: 'BitcoinCore'
}

export interface V3NetworkId_ByFork {
    __kind: 'ByFork'
    blockNumber: bigint
    blockHash: Bytes
}

export interface V3NetworkId_ByGenesis {
    __kind: 'ByGenesis'
    value: Bytes
}

export interface V3NetworkId_Ethereum {
    __kind: 'Ethereum'
    chainId: bigint
}

export interface V3NetworkId_Kusama {
    __kind: 'Kusama'
}

export interface V3NetworkId_Polkadot {
    __kind: 'Polkadot'
}

export interface V3NetworkId_PolkadotBulletin {
    __kind: 'PolkadotBulletin'
}

export interface V3NetworkId_Rococo {
    __kind: 'Rococo'
}

export interface V3NetworkId_Westend {
    __kind: 'Westend'
}

export interface V3NetworkId_Wococo {
    __kind: 'Wococo'
}

export const V3Response: sts.Type<V3Response> = sts.closedEnum(() => {
    return  {
        Assets: sts.array(() => V3MultiAsset),
        DispatchResult: V3MaybeErrorCode,
        ExecutionResult: sts.option(() => sts.tuple(() => [sts.number(), V3Error])),
        Null: sts.unit(),
        PalletsInfo: sts.array(() => V3PalletInfo),
        Version: sts.number(),
    }
})

export const V3PalletInfo: sts.Type<V3PalletInfo> = sts.struct(() => {
    return  {
        index: sts.number(),
        name: BoundedVec,
        moduleName: BoundedVec,
        major: sts.number(),
        minor: sts.number(),
        patch: sts.number(),
    }
})

export const BoundedVec = sts.bytes()

export interface V3PalletInfo {
    index: number
    name: BoundedVec
    moduleName: BoundedVec
    major: number
    minor: number
    patch: number
}

export type BoundedVec = Bytes

export type V3Response = V3Response_Assets | V3Response_DispatchResult | V3Response_ExecutionResult | V3Response_Null | V3Response_PalletsInfo | V3Response_Version

export interface V3Response_Assets {
    __kind: 'Assets'
    value: V3MultiAsset[]
}

export interface V3Response_DispatchResult {
    __kind: 'DispatchResult'
    value: V3MaybeErrorCode
}

export interface V3Response_ExecutionResult {
    __kind: 'ExecutionResult'
    value?: ([number, V3Error] | undefined)
}

export interface V3Response_Null {
    __kind: 'Null'
}

export interface V3Response_PalletsInfo {
    __kind: 'PalletsInfo'
    value: V3PalletInfo[]
}

export interface V3Response_Version {
    __kind: 'Version'
    value: number
}

export interface V3MultiAsset {
    id: V3AssetId
    fun: V3Fungibility
}

export type V3Fungibility = V3Fungibility_Fungible | V3Fungibility_NonFungible

export interface V3Fungibility_Fungible {
    __kind: 'Fungible'
    value: bigint
}

export interface V3Fungibility_NonFungible {
    __kind: 'NonFungible'
    value: V3AssetInstance
}

export type V3AssetInstance = V3AssetInstance_Array16 | V3AssetInstance_Array32 | V3AssetInstance_Array4 | V3AssetInstance_Array8 | V3AssetInstance_Index | V3AssetInstance_Undefined

export interface V3AssetInstance_Array16 {
    __kind: 'Array16'
    value: Bytes
}

export interface V3AssetInstance_Array32 {
    __kind: 'Array32'
    value: Bytes
}

export interface V3AssetInstance_Array4 {
    __kind: 'Array4'
    value: Bytes
}

export interface V3AssetInstance_Array8 {
    __kind: 'Array8'
    value: Bytes
}

export interface V3AssetInstance_Index {
    __kind: 'Index'
    value: bigint
}

export interface V3AssetInstance_Undefined {
    __kind: 'Undefined'
}

export type V3AssetId = V3AssetId_Abstract | V3AssetId_Concrete

export interface V3AssetId_Abstract {
    __kind: 'Abstract'
    value: Bytes
}

export interface V3AssetId_Concrete {
    __kind: 'Concrete'
    value: V3MultiLocation
}

export interface V3MultiLocation {
    parents: number
    interior: V3Junctions
}

export type V3Junctions = V3Junctions_Here | V3Junctions_X1 | V3Junctions_X2 | V3Junctions_X3 | V3Junctions_X4 | V3Junctions_X5 | V3Junctions_X6 | V3Junctions_X7 | V3Junctions_X8

export interface V3Junctions_Here {
    __kind: 'Here'
}

export interface V3Junctions_X1 {
    __kind: 'X1'
    value: V3Junction
}

export interface V3Junctions_X2 {
    __kind: 'X2'
    value: [V3Junction, V3Junction]
}

export interface V3Junctions_X3 {
    __kind: 'X3'
    value: [V3Junction, V3Junction, V3Junction]
}

export interface V3Junctions_X4 {
    __kind: 'X4'
    value: [V3Junction, V3Junction, V3Junction, V3Junction]
}

export interface V3Junctions_X5 {
    __kind: 'X5'
    value: [V3Junction, V3Junction, V3Junction, V3Junction, V3Junction]
}

export interface V3Junctions_X6 {
    __kind: 'X6'
    value: [V3Junction, V3Junction, V3Junction, V3Junction, V3Junction, V3Junction]
}

export interface V3Junctions_X7 {
    __kind: 'X7'
    value: [V3Junction, V3Junction, V3Junction, V3Junction, V3Junction, V3Junction, V3Junction]
}

export interface V3Junctions_X8 {
    __kind: 'X8'
    value: [V3Junction, V3Junction, V3Junction, V3Junction, V3Junction, V3Junction, V3Junction, V3Junction]
}

export const V3QueryResponseInfo: sts.Type<V3QueryResponseInfo> = sts.struct(() => {
    return  {
        destination: V3MultiLocation,
        queryId: sts.bigint(),
        maxWeight: Weight,
    }
})

export interface V3QueryResponseInfo {
    destination: V3MultiLocation
    queryId: bigint
    maxWeight: Weight
}

export const V3NetworkId: sts.Type<V3NetworkId> = sts.closedEnum(() => {
    return  {
        BitcoinCash: sts.unit(),
        BitcoinCore: sts.unit(),
        ByFork: sts.enumStruct({
            blockNumber: sts.bigint(),
            blockHash: sts.bytes(),
        }),
        ByGenesis: sts.bytes(),
        Ethereum: sts.enumStruct({
            chainId: sts.bigint(),
        }),
        Kusama: sts.unit(),
        Polkadot: sts.unit(),
        PolkadotBulletin: sts.unit(),
        Rococo: sts.unit(),
        Westend: sts.unit(),
        Wococo: sts.unit(),
    }
})

export const V3Junctions: sts.Type<V3Junctions> = sts.closedEnum(() => {
    return  {
        Here: sts.unit(),
        X1: V3Junction,
        X2: sts.tuple(() => [V3Junction, V3Junction]),
        X3: sts.tuple(() => [V3Junction, V3Junction, V3Junction]),
        X4: sts.tuple(() => [V3Junction, V3Junction, V3Junction, V3Junction]),
        X5: sts.tuple(() => [V3Junction, V3Junction, V3Junction, V3Junction, V3Junction]),
        X6: sts.tuple(() => [V3Junction, V3Junction, V3Junction, V3Junction, V3Junction, V3Junction]),
        X7: sts.tuple(() => [V3Junction, V3Junction, V3Junction, V3Junction, V3Junction, V3Junction, V3Junction]),
        X8: sts.tuple(() => [V3Junction, V3Junction, V3Junction, V3Junction, V3Junction, V3Junction, V3Junction, V3Junction]),
    }
})

export const V3MultiAssetFilter: sts.Type<V3MultiAssetFilter> = sts.closedEnum(() => {
    return  {
        Definite: sts.array(() => V3MultiAsset),
        Wild: V3WildMultiAsset,
    }
})

export const V3WildMultiAsset: sts.Type<V3WildMultiAsset> = sts.closedEnum(() => {
    return  {
        All: sts.unit(),
        AllCounted: sts.number(),
        AllOf: sts.enumStruct({
            id: V3AssetId,
            fun: V3WildFungibility,
        }),
        AllOfCounted: sts.enumStruct({
            id: V3AssetId,
            fun: V3WildFungibility,
            count: sts.number(),
        }),
    }
})

export const V3WildFungibility: sts.Type<V3WildFungibility> = sts.closedEnum(() => {
    return  {
        Fungible: sts.unit(),
        NonFungible: sts.unit(),
    }
})

export type V3WildFungibility = V3WildFungibility_Fungible | V3WildFungibility_NonFungible

export interface V3WildFungibility_Fungible {
    __kind: 'Fungible'
}

export interface V3WildFungibility_NonFungible {
    __kind: 'NonFungible'
}

export const V3AssetId: sts.Type<V3AssetId> = sts.closedEnum(() => {
    return  {
        Abstract: sts.bytes(),
        Concrete: V3MultiLocation,
    }
})

export type V3WildMultiAsset = V3WildMultiAsset_All | V3WildMultiAsset_AllCounted | V3WildMultiAsset_AllOf | V3WildMultiAsset_AllOfCounted

export interface V3WildMultiAsset_All {
    __kind: 'All'
}

export interface V3WildMultiAsset_AllCounted {
    __kind: 'AllCounted'
    value: number
}

export interface V3WildMultiAsset_AllOf {
    __kind: 'AllOf'
    id: V3AssetId
    fun: V3WildFungibility
}

export interface V3WildMultiAsset_AllOfCounted {
    __kind: 'AllOfCounted'
    id: V3AssetId
    fun: V3WildFungibility
    count: number
}

export type V3MultiAssetFilter = V3MultiAssetFilter_Definite | V3MultiAssetFilter_Wild

export interface V3MultiAssetFilter_Definite {
    __kind: 'Definite'
    value: V3MultiAsset[]
}

export interface V3MultiAssetFilter_Wild {
    __kind: 'Wild'
    value: V3WildMultiAsset
}

export const V3MultiAsset: sts.Type<V3MultiAsset> = sts.struct(() => {
    return  {
        id: V3AssetId,
        fun: V3Fungibility,
    }
})

export const V3Fungibility: sts.Type<V3Fungibility> = sts.closedEnum(() => {
    return  {
        Fungible: sts.bigint(),
        NonFungible: V3AssetInstance,
    }
})

export const V3AssetInstance: sts.Type<V3AssetInstance> = sts.closedEnum(() => {
    return  {
        Array16: sts.bytes(),
        Array32: sts.bytes(),
        Array4: sts.bytes(),
        Array8: sts.bytes(),
        Index: sts.bigint(),
        Undefined: sts.unit(),
    }
})

export const V3MultiLocation: sts.Type<V3MultiLocation> = sts.struct(() => {
    return  {
        parents: sts.number(),
        interior: V3Junctions,
    }
})

export type V3Instruction = V3Instruction_AliasOrigin | V3Instruction_BurnAsset | V3Instruction_BuyExecution | V3Instruction_ClaimAsset | V3Instruction_ClearError | V3Instruction_ClearOrigin | V3Instruction_ClearTopic | V3Instruction_ClearTransactStatus | V3Instruction_DepositAsset | V3Instruction_DepositReserveAsset | V3Instruction_DescendOrigin | V3Instruction_ExchangeAsset | V3Instruction_ExpectAsset | V3Instruction_ExpectError | V3Instruction_ExpectOrigin | V3Instruction_ExpectPallet | V3Instruction_ExpectTransactStatus | V3Instruction_ExportMessage | V3Instruction_HrmpChannelAccepted | V3Instruction_HrmpChannelClosing | V3Instruction_HrmpNewChannelOpenRequest | V3Instruction_InitiateReserveWithdraw | V3Instruction_InitiateTeleport | V3Instruction_LockAsset | V3Instruction_NoteUnlockable | V3Instruction_QueryPallet | V3Instruction_QueryResponse | V3Instruction_ReceiveTeleportedAsset | V3Instruction_RefundSurplus | V3Instruction_ReportError | V3Instruction_ReportHolding | V3Instruction_ReportTransactStatus | V3Instruction_RequestUnlock | V3Instruction_ReserveAssetDeposited | V3Instruction_SetAppendix | V3Instruction_SetErrorHandler | V3Instruction_SetFeesMode | V3Instruction_SetTopic | V3Instruction_SubscribeVersion | V3Instruction_Transact | V3Instruction_TransferAsset | V3Instruction_TransferReserveAsset | V3Instruction_Trap | V3Instruction_UniversalOrigin | V3Instruction_UnlockAsset | V3Instruction_UnpaidExecution | V3Instruction_UnsubscribeVersion | V3Instruction_WithdrawAsset

export interface V3Instruction_AliasOrigin {
    __kind: 'AliasOrigin'
    value: V3MultiLocation
}

export interface V3Instruction_BurnAsset {
    __kind: 'BurnAsset'
    value: V3MultiAsset[]
}

export interface V3Instruction_BuyExecution {
    __kind: 'BuyExecution'
    fees: V3MultiAsset
    weightLimit: V3WeightLimit
}

export interface V3Instruction_ClaimAsset {
    __kind: 'ClaimAsset'
    assets: V3MultiAsset[]
    ticket: V3MultiLocation
}

export interface V3Instruction_ClearError {
    __kind: 'ClearError'
}

export interface V3Instruction_ClearOrigin {
    __kind: 'ClearOrigin'
}

export interface V3Instruction_ClearTopic {
    __kind: 'ClearTopic'
}

export interface V3Instruction_ClearTransactStatus {
    __kind: 'ClearTransactStatus'
}

export interface V3Instruction_DepositAsset {
    __kind: 'DepositAsset'
    assets: V3MultiAssetFilter
    beneficiary: V3MultiLocation
}

export interface V3Instruction_DepositReserveAsset {
    __kind: 'DepositReserveAsset'
    assets: V3MultiAssetFilter
    dest: V3MultiLocation
    xcm: V3Instruction[]
}

export interface V3Instruction_DescendOrigin {
    __kind: 'DescendOrigin'
    value: V3Junctions
}

export interface V3Instruction_ExchangeAsset {
    __kind: 'ExchangeAsset'
    give: V3MultiAssetFilter
    want: V3MultiAsset[]
    maximal: boolean
}

export interface V3Instruction_ExpectAsset {
    __kind: 'ExpectAsset'
    value: V3MultiAsset[]
}

export interface V3Instruction_ExpectError {
    __kind: 'ExpectError'
    value?: ([number, V3Error] | undefined)
}

export interface V3Instruction_ExpectOrigin {
    __kind: 'ExpectOrigin'
    value?: (V3MultiLocation | undefined)
}

export interface V3Instruction_ExpectPallet {
    __kind: 'ExpectPallet'
    index: number
    name: Bytes
    moduleName: Bytes
    crateMajor: number
    minCrateMinor: number
}

export interface V3Instruction_ExpectTransactStatus {
    __kind: 'ExpectTransactStatus'
    value: V3MaybeErrorCode
}

export interface V3Instruction_ExportMessage {
    __kind: 'ExportMessage'
    network: V3NetworkId
    destination: V3Junctions
    xcm: V3Instruction[]
}

export interface V3Instruction_HrmpChannelAccepted {
    __kind: 'HrmpChannelAccepted'
    recipient: number
}

export interface V3Instruction_HrmpChannelClosing {
    __kind: 'HrmpChannelClosing'
    initiator: number
    sender: number
    recipient: number
}

export interface V3Instruction_HrmpNewChannelOpenRequest {
    __kind: 'HrmpNewChannelOpenRequest'
    sender: number
    maxMessageSize: number
    maxCapacity: number
}

export interface V3Instruction_InitiateReserveWithdraw {
    __kind: 'InitiateReserveWithdraw'
    assets: V3MultiAssetFilter
    reserve: V3MultiLocation
    xcm: V3Instruction[]
}

export interface V3Instruction_InitiateTeleport {
    __kind: 'InitiateTeleport'
    assets: V3MultiAssetFilter
    dest: V3MultiLocation
    xcm: V3Instruction[]
}

export interface V3Instruction_LockAsset {
    __kind: 'LockAsset'
    asset: V3MultiAsset
    unlocker: V3MultiLocation
}

export interface V3Instruction_NoteUnlockable {
    __kind: 'NoteUnlockable'
    asset: V3MultiAsset
    owner: V3MultiLocation
}

export interface V3Instruction_QueryPallet {
    __kind: 'QueryPallet'
    moduleName: Bytes
    responseInfo: V3QueryResponseInfo
}

export interface V3Instruction_QueryResponse {
    __kind: 'QueryResponse'
    queryId: bigint
    response: V3Response
    maxWeight: Weight
    querier?: (V3MultiLocation | undefined)
}

export interface V3Instruction_ReceiveTeleportedAsset {
    __kind: 'ReceiveTeleportedAsset'
    value: V3MultiAsset[]
}

export interface V3Instruction_RefundSurplus {
    __kind: 'RefundSurplus'
}

export interface V3Instruction_ReportError {
    __kind: 'ReportError'
    value: V3QueryResponseInfo
}

export interface V3Instruction_ReportHolding {
    __kind: 'ReportHolding'
    responseInfo: V3QueryResponseInfo
    assets: V3MultiAssetFilter
}

export interface V3Instruction_ReportTransactStatus {
    __kind: 'ReportTransactStatus'
    value: V3QueryResponseInfo
}

export interface V3Instruction_RequestUnlock {
    __kind: 'RequestUnlock'
    asset: V3MultiAsset
    locker: V3MultiLocation
}

export interface V3Instruction_ReserveAssetDeposited {
    __kind: 'ReserveAssetDeposited'
    value: V3MultiAsset[]
}

export interface V3Instruction_SetAppendix {
    __kind: 'SetAppendix'
    value: V3Instruction[]
}

export interface V3Instruction_SetErrorHandler {
    __kind: 'SetErrorHandler'
    value: V3Instruction[]
}

export interface V3Instruction_SetFeesMode {
    __kind: 'SetFeesMode'
    jitWithdraw: boolean
}

export interface V3Instruction_SetTopic {
    __kind: 'SetTopic'
    value: Bytes
}

export interface V3Instruction_SubscribeVersion {
    __kind: 'SubscribeVersion'
    queryId: bigint
    maxResponseWeight: Weight
}

export interface V3Instruction_Transact {
    __kind: 'Transact'
    originKind: V3OriginKind
    requireWeightAtMost: Weight
    call: DoubleEncoded
}

export interface V3Instruction_TransferAsset {
    __kind: 'TransferAsset'
    assets: V3MultiAsset[]
    beneficiary: V3MultiLocation
}

export interface V3Instruction_TransferReserveAsset {
    __kind: 'TransferReserveAsset'
    assets: V3MultiAsset[]
    dest: V3MultiLocation
    xcm: V3Instruction[]
}

export interface V3Instruction_Trap {
    __kind: 'Trap'
    value: bigint
}

export interface V3Instruction_UniversalOrigin {
    __kind: 'UniversalOrigin'
    value: V3Junction
}

export interface V3Instruction_UnlockAsset {
    __kind: 'UnlockAsset'
    asset: V3MultiAsset
    target: V3MultiLocation
}

export interface V3Instruction_UnpaidExecution {
    __kind: 'UnpaidExecution'
    weightLimit: V3WeightLimit
    checkOrigin?: (V3MultiLocation | undefined)
}

export interface V3Instruction_UnsubscribeVersion {
    __kind: 'UnsubscribeVersion'
}

export interface V3Instruction_WithdrawAsset {
    __kind: 'WithdrawAsset'
    value: V3MultiAsset[]
}

export type VersionedXcm = VersionedXcm_V3 | VersionedXcm_V4 | VersionedXcm_V5

export interface VersionedXcm_V3 {
    __kind: 'V3'
    value: V3Instruction[]
}

export interface VersionedXcm_V4 {
    __kind: 'V4'
    value: V4Instruction[]
}

export interface VersionedXcm_V5 {
    __kind: 'V5'
    value: V5Instruction[]
}

export const VersionedAssetId: sts.Type<VersionedAssetId> = sts.closedEnum(() => {
    return  {
        V3: V3AssetId,
        V4: V4AssetId,
        V5: V5AssetId,
    }
})

export type VersionedAssetId = VersionedAssetId_V3 | VersionedAssetId_V4 | VersionedAssetId_V5

export interface VersionedAssetId_V3 {
    __kind: 'V3'
    value: V3AssetId
}

export interface VersionedAssetId_V4 {
    __kind: 'V4'
    value: V4AssetId
}

export interface VersionedAssetId_V5 {
    __kind: 'V5'
    value: V5AssetId
}

export const TransferType: sts.Type<TransferType> = sts.closedEnum(() => {
    return  {
        DestinationReserve: sts.unit(),
        LocalReserve: sts.unit(),
        RemoteReserve: VersionedLocation,
        Teleport: sts.unit(),
    }
})

export type TransferType = TransferType_DestinationReserve | TransferType_LocalReserve | TransferType_RemoteReserve | TransferType_Teleport

export interface TransferType_DestinationReserve {
    __kind: 'DestinationReserve'
}

export interface TransferType_LocalReserve {
    __kind: 'LocalReserve'
}

export interface TransferType_RemoteReserve {
    __kind: 'RemoteReserve'
    value: VersionedLocation
}

export interface TransferType_Teleport {
    __kind: 'Teleport'
}

export type VersionedLocation = VersionedLocation_V3 | VersionedLocation_V4 | VersionedLocation_V5

export interface VersionedLocation_V3 {
    __kind: 'V3'
    value: V3MultiLocation
}

export interface VersionedLocation_V4 {
    __kind: 'V4'
    value: V4Location
}

export interface VersionedLocation_V5 {
    __kind: 'V5'
    value: V5Location
}

export const V3WeightLimit: sts.Type<V3WeightLimit> = sts.closedEnum(() => {
    return  {
        Limited: Weight,
        Unlimited: sts.unit(),
    }
})

export const VersionedAssets: sts.Type<VersionedAssets> = sts.closedEnum(() => {
    return  {
        V3: sts.array(() => V3MultiAsset),
        V4: sts.array(() => V4Asset),
        V5: sts.array(() => V5Asset),
    }
})

export type VersionedAssets = VersionedAssets_V3 | VersionedAssets_V4 | VersionedAssets_V5

export interface VersionedAssets_V3 {
    __kind: 'V3'
    value: V3MultiAsset[]
}

export interface VersionedAssets_V4 {
    __kind: 'V4'
    value: V4Asset[]
}

export interface VersionedAssets_V5 {
    __kind: 'V5'
    value: V5Asset[]
}

export const VersionedLocation: sts.Type<VersionedLocation> = sts.closedEnum(() => {
    return  {
        V3: V3MultiLocation,
        V4: V4Location,
        V5: V5Location,
    }
})
