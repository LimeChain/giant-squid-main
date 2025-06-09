import {sts, Result, Option, Bytes, BitSequence} from './support'

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

export const V3WeightLimit: sts.Type<V3WeightLimit> = sts.closedEnum(() => {
    return  {
        Limited: Weight,
        Unlimited: sts.unit(),
    }
})

export type V3WeightLimit = V3WeightLimit_Limited | V3WeightLimit_Unlimited

export interface V3WeightLimit_Limited {
    __kind: 'Limited'
    value: Weight
}

export interface V3WeightLimit_Unlimited {
    __kind: 'Unlimited'
}

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

export const V5Location: sts.Type<V5Location> = sts.struct(() => {
    return  {
        parents: sts.number(),
        interior: V5Junctions,
    }
})
