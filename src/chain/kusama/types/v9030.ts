import {sts, Result, Option, Bytes, BitSequence} from './support'

export const Weight = sts.bigint()

export const MultiAsset: sts.Type<MultiAsset> = sts.closedEnum(() => {
    return  {
        AbstractFungible: sts.enumStruct({
            id: sts.bytes(),
            instance: sts.bigint(),
        }),
        AbstractNonFungible: sts.enumStruct({
            class: sts.bytes(),
            instance: AssetInstanceV0,
        }),
        All: sts.unit(),
        AllAbstractFungible: sts.bytes(),
        AllAbstractNonFungible: sts.bytes(),
        AllConcreteFungible: MultiLocationV0,
        AllConcreteNonFungible: MultiLocationV0,
        AllFungible: sts.unit(),
        AllNonFungible: sts.unit(),
        ConcreteFungible: sts.enumStruct({
            id: MultiLocationV0,
            amount: sts.bigint(),
        }),
        ConcreteNonFungible: sts.enumStruct({
            class: MultiLocationV0,
            instance: AssetInstanceV0,
        }),
        None: sts.unit(),
    }
})

export const MultiLocationV0: sts.Type<MultiLocationV0> = sts.closedEnum(() => {
    return  {
        Here: sts.unit(),
        X1: JunctionV0,
        X2: sts.tuple(() => [JunctionV0, JunctionV0]),
        X3: sts.tuple(() => [JunctionV0, JunctionV0, JunctionV0]),
        X4: sts.tuple(() => [JunctionV0, JunctionV0, JunctionV0, JunctionV0]),
        X5: sts.tuple(() => [JunctionV0, JunctionV0, JunctionV0, JunctionV0, JunctionV0]),
        X6: sts.tuple(() => [JunctionV0, JunctionV0, JunctionV0, JunctionV0, JunctionV0, JunctionV0]),
        X7: sts.tuple(() => [JunctionV0, JunctionV0, JunctionV0, JunctionV0, JunctionV0, JunctionV0, JunctionV0]),
        X8: sts.tuple(() => [JunctionV0, JunctionV0, JunctionV0, JunctionV0, JunctionV0, JunctionV0, JunctionV0, JunctionV0]),
    }
})

export const JunctionV0: sts.Type<JunctionV0> = sts.closedEnum(() => {
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
        Parent: sts.unit(),
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

export const AccountId = sts.bytes()

export const NetworkId: sts.Type<NetworkId> = sts.closedEnum(() => {
    return  {
        Any: sts.unit(),
        Kusama: sts.unit(),
        Named: sts.bytes(),
        Polkadot: sts.unit(),
    }
})

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

export type JunctionV0 = JunctionV0_AccountId32 | JunctionV0_AccountIndex64 | JunctionV0_AccountKey20 | JunctionV0_GeneralIndex | JunctionV0_GeneralKey | JunctionV0_OnlyChild | JunctionV0_PalletInstance | JunctionV0_Parachain | JunctionV0_Parent | JunctionV0_Plurality

export interface JunctionV0_AccountId32 {
    __kind: 'AccountId32'
    network: NetworkId
    id: AccountId
}

export interface JunctionV0_AccountIndex64 {
    __kind: 'AccountIndex64'
    network: NetworkId
    index: bigint
}

export interface JunctionV0_AccountKey20 {
    __kind: 'AccountKey20'
    network: NetworkId
    key: Bytes
}

export interface JunctionV0_GeneralIndex {
    __kind: 'GeneralIndex'
    value: bigint
}

export interface JunctionV0_GeneralKey {
    __kind: 'GeneralKey'
    value: Bytes
}

export interface JunctionV0_OnlyChild {
    __kind: 'OnlyChild'
}

export interface JunctionV0_PalletInstance {
    __kind: 'PalletInstance'
    value: number
}

export interface JunctionV0_Parachain {
    __kind: 'Parachain'
    value: number
}

export interface JunctionV0_Parent {
    __kind: 'Parent'
}

export interface JunctionV0_Plurality {
    __kind: 'Plurality'
    id: BodyId
    part: BodyPart
}

export type AccountId = Bytes

export type MultiLocationV0 = MultiLocationV0_Here | MultiLocationV0_X1 | MultiLocationV0_X2 | MultiLocationV0_X3 | MultiLocationV0_X4 | MultiLocationV0_X5 | MultiLocationV0_X6 | MultiLocationV0_X7 | MultiLocationV0_X8

export interface MultiLocationV0_Here {
    __kind: 'Here'
}

export interface MultiLocationV0_X1 {
    __kind: 'X1'
    value: JunctionV0
}

export interface MultiLocationV0_X2 {
    __kind: 'X2'
    value: [JunctionV0, JunctionV0]
}

export interface MultiLocationV0_X3 {
    __kind: 'X3'
    value: [JunctionV0, JunctionV0, JunctionV0]
}

export interface MultiLocationV0_X4 {
    __kind: 'X4'
    value: [JunctionV0, JunctionV0, JunctionV0, JunctionV0]
}

export interface MultiLocationV0_X5 {
    __kind: 'X5'
    value: [JunctionV0, JunctionV0, JunctionV0, JunctionV0, JunctionV0]
}

export interface MultiLocationV0_X6 {
    __kind: 'X6'
    value: [JunctionV0, JunctionV0, JunctionV0, JunctionV0, JunctionV0, JunctionV0]
}

export interface MultiLocationV0_X7 {
    __kind: 'X7'
    value: [JunctionV0, JunctionV0, JunctionV0, JunctionV0, JunctionV0, JunctionV0, JunctionV0]
}

export interface MultiLocationV0_X8 {
    __kind: 'X8'
    value: [JunctionV0, JunctionV0, JunctionV0, JunctionV0, JunctionV0, JunctionV0, JunctionV0, JunctionV0]
}

export const AssetInstanceV0: sts.Type<AssetInstanceV0> = sts.closedEnum(() => {
    return  {
        Array16: sts.bytes(),
        Array32: sts.bytes(),
        Array4: sts.bytes(),
        Array8: sts.bytes(),
        Blob: sts.bytes(),
        Index128: sts.bigint(),
        Index16: sts.number(),
        Index32: sts.number(),
        Index64: sts.bigint(),
        Index8: sts.number(),
        Undefined: sts.unit(),
    }
})

export type AssetInstanceV0 = AssetInstanceV0_Array16 | AssetInstanceV0_Array32 | AssetInstanceV0_Array4 | AssetInstanceV0_Array8 | AssetInstanceV0_Blob | AssetInstanceV0_Index128 | AssetInstanceV0_Index16 | AssetInstanceV0_Index32 | AssetInstanceV0_Index64 | AssetInstanceV0_Index8 | AssetInstanceV0_Undefined

export interface AssetInstanceV0_Array16 {
    __kind: 'Array16'
    value: Bytes
}

export interface AssetInstanceV0_Array32 {
    __kind: 'Array32'
    value: Bytes
}

export interface AssetInstanceV0_Array4 {
    __kind: 'Array4'
    value: Bytes
}

export interface AssetInstanceV0_Array8 {
    __kind: 'Array8'
    value: Bytes
}

export interface AssetInstanceV0_Blob {
    __kind: 'Blob'
    value: Bytes
}

export interface AssetInstanceV0_Index128 {
    __kind: 'Index128'
    value: bigint
}

export interface AssetInstanceV0_Index16 {
    __kind: 'Index16'
    value: number
}

export interface AssetInstanceV0_Index32 {
    __kind: 'Index32'
    value: number
}

export interface AssetInstanceV0_Index64 {
    __kind: 'Index64'
    value: bigint
}

export interface AssetInstanceV0_Index8 {
    __kind: 'Index8'
    value: number
}

export interface AssetInstanceV0_Undefined {
    __kind: 'Undefined'
}

export type MultiAsset = MultiAsset_AbstractFungible | MultiAsset_AbstractNonFungible | MultiAsset_All | MultiAsset_AllAbstractFungible | MultiAsset_AllAbstractNonFungible | MultiAsset_AllConcreteFungible | MultiAsset_AllConcreteNonFungible | MultiAsset_AllFungible | MultiAsset_AllNonFungible | MultiAsset_ConcreteFungible | MultiAsset_ConcreteNonFungible | MultiAsset_None

export interface MultiAsset_AbstractFungible {
    __kind: 'AbstractFungible'
    id: Bytes
    instance: bigint
}

export interface MultiAsset_AbstractNonFungible {
    __kind: 'AbstractNonFungible'
    class: Bytes
    instance: AssetInstanceV0
}

export interface MultiAsset_All {
    __kind: 'All'
}

export interface MultiAsset_AllAbstractFungible {
    __kind: 'AllAbstractFungible'
    value: Bytes
}

export interface MultiAsset_AllAbstractNonFungible {
    __kind: 'AllAbstractNonFungible'
    value: Bytes
}

export interface MultiAsset_AllConcreteFungible {
    __kind: 'AllConcreteFungible'
    value: MultiLocationV0
}

export interface MultiAsset_AllConcreteNonFungible {
    __kind: 'AllConcreteNonFungible'
    value: MultiLocationV0
}

export interface MultiAsset_AllFungible {
    __kind: 'AllFungible'
}

export interface MultiAsset_AllNonFungible {
    __kind: 'AllNonFungible'
}

export interface MultiAsset_ConcreteFungible {
    __kind: 'ConcreteFungible'
    id: MultiLocationV0
    amount: bigint
}

export interface MultiAsset_ConcreteNonFungible {
    __kind: 'ConcreteNonFungible'
    class: MultiLocationV0
    instance: AssetInstanceV0
}

export interface MultiAsset_None {
    __kind: 'None'
}

export const MultiLocation: sts.Type<MultiLocation> = sts.closedEnum(() => {
    return  {
        Here: sts.unit(),
        X1: JunctionV0,
        X2: sts.tuple(() => [JunctionV0, JunctionV0]),
        X3: sts.tuple(() => [JunctionV0, JunctionV0, JunctionV0]),
        X4: sts.tuple(() => [JunctionV0, JunctionV0, JunctionV0, JunctionV0]),
        X5: sts.tuple(() => [JunctionV0, JunctionV0, JunctionV0, JunctionV0, JunctionV0]),
        X6: sts.tuple(() => [JunctionV0, JunctionV0, JunctionV0, JunctionV0, JunctionV0, JunctionV0]),
        X7: sts.tuple(() => [JunctionV0, JunctionV0, JunctionV0, JunctionV0, JunctionV0, JunctionV0, JunctionV0]),
        X8: sts.tuple(() => [JunctionV0, JunctionV0, JunctionV0, JunctionV0, JunctionV0, JunctionV0, JunctionV0, JunctionV0]),
    }
})

export type MultiLocation = MultiLocation_Here | MultiLocation_X1 | MultiLocation_X2 | MultiLocation_X3 | MultiLocation_X4 | MultiLocation_X5 | MultiLocation_X6 | MultiLocation_X7 | MultiLocation_X8

export interface MultiLocation_Here {
    __kind: 'Here'
}

export interface MultiLocation_X1 {
    __kind: 'X1'
    value: JunctionV0
}

export interface MultiLocation_X2 {
    __kind: 'X2'
    value: [JunctionV0, JunctionV0]
}

export interface MultiLocation_X3 {
    __kind: 'X3'
    value: [JunctionV0, JunctionV0, JunctionV0]
}

export interface MultiLocation_X4 {
    __kind: 'X4'
    value: [JunctionV0, JunctionV0, JunctionV0, JunctionV0]
}

export interface MultiLocation_X5 {
    __kind: 'X5'
    value: [JunctionV0, JunctionV0, JunctionV0, JunctionV0, JunctionV0]
}

export interface MultiLocation_X6 {
    __kind: 'X6'
    value: [JunctionV0, JunctionV0, JunctionV0, JunctionV0, JunctionV0, JunctionV0]
}

export interface MultiLocation_X7 {
    __kind: 'X7'
    value: [JunctionV0, JunctionV0, JunctionV0, JunctionV0, JunctionV0, JunctionV0, JunctionV0]
}

export interface MultiLocation_X8 {
    __kind: 'X8'
    value: [JunctionV0, JunctionV0, JunctionV0, JunctionV0, JunctionV0, JunctionV0, JunctionV0, JunctionV0]
}
