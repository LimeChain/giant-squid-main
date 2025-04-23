import {sts, Block, Bytes, Option, Result, CallType, RuntimeCtx} from '../support'
import * as v9140 from '../v9140'
import * as v9370 from '../v9370'
import * as v9420 from '../v9420'
import * as v1002000 from '../v1002000'
import * as v1002004 from '../v1002004'

export const reserveTransferAssets =  {
    name: 'XcmPallet.reserve_transfer_assets',
    /**
     * Transfer some assets from the local chain to the sovereign account of a destination chain and forward
     * a notification XCM.
     * 
     * Fee payment on the destination side is made from the first asset listed in the `assets` vector and
     * fee-weight is calculated locally and thus remote weights are assumed to be equal to
     * local weights.
     * 
     * - `origin`: Must be capable of withdrawing the `assets` and executing XCM.
     * - `dest`: Destination context for the assets. Will typically be `X2(Parent, Parachain(..))` to send
     *   from parachain to parachain, or `X1(Parachain(..))` to send from relay to parachain.
     * - `beneficiary`: A beneficiary location for the assets in the context of `dest`. Will generally be
     *   an `AccountId32` value.
     * - `assets`: The assets to be withdrawn. This should include the assets used to pay the fee on the
     *   `dest` side.
     * - `fee_asset_item`: The index into `assets` of the item which should be used to pay
     *   fees.
     */
    v9140: new CallType(
        'XcmPallet.reserve_transfer_assets',
        sts.struct({
            dest: v9140.VersionedMultiLocation,
            beneficiary: v9140.VersionedMultiLocation,
            assets: v9140.VersionedMultiAssets,
            feeAssetItem: sts.number(),
        })
    ),
    /**
     * Transfer some assets from the local chain to the sovereign account of a destination
     * chain and forward a notification XCM.
     * 
     * Fee payment on the destination side is made from the asset in the `assets` vector of
     * index `fee_asset_item`. The weight limit for fees is not provided and thus is unlimited,
     * with all fees taken as needed from the asset.
     * 
     * - `origin`: Must be capable of withdrawing the `assets` and executing XCM.
     * - `dest`: Destination context for the assets. Will typically be `X2(Parent, Parachain(..))` to send
     *   from parachain to parachain, or `X1(Parachain(..))` to send from relay to parachain.
     * - `beneficiary`: A beneficiary location for the assets in the context of `dest`. Will generally be
     *   an `AccountId32` value.
     * - `assets`: The assets to be withdrawn. This should include the assets used to pay the fee on the
     *   `dest` side.
     * - `fee_asset_item`: The index into `assets` of the item which should be used to pay
     *   fees.
     */
    v9370: new CallType(
        'XcmPallet.reserve_transfer_assets',
        sts.struct({
            dest: v9370.VersionedMultiLocation,
            beneficiary: v9370.VersionedMultiLocation,
            assets: v9370.VersionedMultiAssets,
            feeAssetItem: sts.number(),
        })
    ),
    /**
     * Transfer some assets from the local chain to the sovereign account of a destination
     * chain and forward a notification XCM.
     * 
     * Fee payment on the destination side is made from the asset in the `assets` vector of
     * index `fee_asset_item`. The weight limit for fees is not provided and thus is unlimited,
     * with all fees taken as needed from the asset.
     * 
     * - `origin`: Must be capable of withdrawing the `assets` and executing XCM.
     * - `dest`: Destination context for the assets. Will typically be `X2(Parent, Parachain(..))` to send
     *   from parachain to parachain, or `X1(Parachain(..))` to send from relay to parachain.
     * - `beneficiary`: A beneficiary location for the assets in the context of `dest`. Will generally be
     *   an `AccountId32` value.
     * - `assets`: The assets to be withdrawn. This should include the assets used to pay the fee on the
     *   `dest` side.
     * - `fee_asset_item`: The index into `assets` of the item which should be used to pay
     *   fees.
     */
    v9420: new CallType(
        'XcmPallet.reserve_transfer_assets',
        sts.struct({
            dest: v9420.VersionedMultiLocation,
            beneficiary: v9420.VersionedMultiLocation,
            assets: v9420.VersionedMultiAssets,
            feeAssetItem: sts.number(),
        })
    ),
    /**
     * See [`Pallet::reserve_transfer_assets`].
     */
    v1002000: new CallType(
        'XcmPallet.reserve_transfer_assets',
        sts.struct({
            dest: v1002000.VersionedLocation,
            beneficiary: v1002000.VersionedLocation,
            assets: v1002000.VersionedAssets,
            feeAssetItem: sts.number(),
        })
    ),
}

export const limitedReserveTransferAssets =  {
    name: 'XcmPallet.limited_reserve_transfer_assets',
    /**
     * Transfer some assets from the local chain to the sovereign account of a destination chain and forward
     * a notification XCM.
     * 
     * Fee payment on the destination side is made from the first asset listed in the `assets` vector.
     * 
     * - `origin`: Must be capable of withdrawing the `assets` and executing XCM.
     * - `dest`: Destination context for the assets. Will typically be `X2(Parent, Parachain(..))` to send
     *   from parachain to parachain, or `X1(Parachain(..))` to send from relay to parachain.
     * - `beneficiary`: A beneficiary location for the assets in the context of `dest`. Will generally be
     *   an `AccountId32` value.
     * - `assets`: The assets to be withdrawn. This should include the assets used to pay the fee on the
     *   `dest` side.
     * - `fee_asset_item`: The index into `assets` of the item which should be used to pay
     *   fees.
     * - `weight_limit`: The remote-side weight limit, if any, for the XCM fee purchase.
     */
    v9140: new CallType(
        'XcmPallet.limited_reserve_transfer_assets',
        sts.struct({
            dest: v9140.VersionedMultiLocation,
            beneficiary: v9140.VersionedMultiLocation,
            assets: v9140.VersionedMultiAssets,
            feeAssetItem: sts.number(),
            weightLimit: v9140.V2WeightLimit,
        })
    ),
    /**
     * Transfer some assets from the local chain to the sovereign account of a destination
     * chain and forward a notification XCM.
     * 
     * Fee payment on the destination side is made from the asset in the `assets` vector of
     * index `fee_asset_item`, up to enough to pay for `weight_limit` of weight. If more weight
     * is needed than `weight_limit`, then the operation will fail and the assets send may be
     * at risk.
     * 
     * - `origin`: Must be capable of withdrawing the `assets` and executing XCM.
     * - `dest`: Destination context for the assets. Will typically be `X2(Parent, Parachain(..))` to send
     *   from parachain to parachain, or `X1(Parachain(..))` to send from relay to parachain.
     * - `beneficiary`: A beneficiary location for the assets in the context of `dest`. Will generally be
     *   an `AccountId32` value.
     * - `assets`: The assets to be withdrawn. This should include the assets used to pay the fee on the
     *   `dest` side.
     * - `fee_asset_item`: The index into `assets` of the item which should be used to pay
     *   fees.
     * - `weight_limit`: The remote-side weight limit, if any, for the XCM fee purchase.
     */
    v9370: new CallType(
        'XcmPallet.limited_reserve_transfer_assets',
        sts.struct({
            dest: v9370.VersionedMultiLocation,
            beneficiary: v9370.VersionedMultiLocation,
            assets: v9370.VersionedMultiAssets,
            feeAssetItem: sts.number(),
            weightLimit: v9370.V2WeightLimit,
        })
    ),
    /**
     * Transfer some assets from the local chain to the sovereign account of a destination
     * chain and forward a notification XCM.
     * 
     * Fee payment on the destination side is made from the asset in the `assets` vector of
     * index `fee_asset_item`, up to enough to pay for `weight_limit` of weight. If more weight
     * is needed than `weight_limit`, then the operation will fail and the assets send may be
     * at risk.
     * 
     * - `origin`: Must be capable of withdrawing the `assets` and executing XCM.
     * - `dest`: Destination context for the assets. Will typically be `X2(Parent, Parachain(..))` to send
     *   from parachain to parachain, or `X1(Parachain(..))` to send from relay to parachain.
     * - `beneficiary`: A beneficiary location for the assets in the context of `dest`. Will generally be
     *   an `AccountId32` value.
     * - `assets`: The assets to be withdrawn. This should include the assets used to pay the fee on the
     *   `dest` side.
     * - `fee_asset_item`: The index into `assets` of the item which should be used to pay
     *   fees.
     * - `weight_limit`: The remote-side weight limit, if any, for the XCM fee purchase.
     */
    v9420: new CallType(
        'XcmPallet.limited_reserve_transfer_assets',
        sts.struct({
            dest: v9420.VersionedMultiLocation,
            beneficiary: v9420.VersionedMultiLocation,
            assets: v9420.VersionedMultiAssets,
            feeAssetItem: sts.number(),
            weightLimit: v9420.V3WeightLimit,
        })
    ),
    /**
     * See [`Pallet::limited_reserve_transfer_assets`].
     */
    v1002000: new CallType(
        'XcmPallet.limited_reserve_transfer_assets',
        sts.struct({
            dest: v1002000.VersionedLocation,
            beneficiary: v1002000.VersionedLocation,
            assets: v1002000.VersionedAssets,
            feeAssetItem: sts.number(),
            weightLimit: v1002000.V3WeightLimit,
        })
    ),
}

export const limitedTeleportAssets =  {
    name: 'XcmPallet.limited_teleport_assets',
    /**
     * Teleport some assets from the local chain to some destination chain.
     * 
     * Fee payment on the destination side is made from the first asset listed in the `assets` vector.
     * 
     * - `origin`: Must be capable of withdrawing the `assets` and executing XCM.
     * - `dest`: Destination context for the assets. Will typically be `X2(Parent, Parachain(..))` to send
     *   from parachain to parachain, or `X1(Parachain(..))` to send from relay to parachain.
     * - `beneficiary`: A beneficiary location for the assets in the context of `dest`. Will generally be
     *   an `AccountId32` value.
     * - `assets`: The assets to be withdrawn. The first item should be the currency used to to pay the fee on the
     *   `dest` side. May not be empty.
     * - `dest_weight`: Equal to the total weight on `dest` of the XCM message
     *   `Teleport { assets, effects: [ BuyExecution{..}, DepositAsset{..} ] }`.
     * - `weight_limit`: The remote-side weight limit, if any, for the XCM fee purchase.
     */
    v9140: new CallType(
        'XcmPallet.limited_teleport_assets',
        sts.struct({
            dest: v9140.VersionedMultiLocation,
            beneficiary: v9140.VersionedMultiLocation,
            assets: v9140.VersionedMultiAssets,
            feeAssetItem: sts.number(),
            weightLimit: v9140.V2WeightLimit,
        })
    ),
    /**
     * Teleport some assets from the local chain to some destination chain.
     * 
     * Fee payment on the destination side is made from the asset in the `assets` vector of
     * index `fee_asset_item`, up to enough to pay for `weight_limit` of weight. If more weight
     * is needed than `weight_limit`, then the operation will fail and the assets send may be
     * at risk.
     * 
     * - `origin`: Must be capable of withdrawing the `assets` and executing XCM.
     * - `dest`: Destination context for the assets. Will typically be `X2(Parent, Parachain(..))` to send
     *   from parachain to parachain, or `X1(Parachain(..))` to send from relay to parachain.
     * - `beneficiary`: A beneficiary location for the assets in the context of `dest`. Will generally be
     *   an `AccountId32` value.
     * - `assets`: The assets to be withdrawn. The first item should be the currency used to to pay the fee on the
     *   `dest` side. May not be empty.
     * - `fee_asset_item`: The index into `assets` of the item which should be used to pay
     *   fees.
     * - `weight_limit`: The remote-side weight limit, if any, for the XCM fee purchase.
     */
    v9370: new CallType(
        'XcmPallet.limited_teleport_assets',
        sts.struct({
            dest: v9370.VersionedMultiLocation,
            beneficiary: v9370.VersionedMultiLocation,
            assets: v9370.VersionedMultiAssets,
            feeAssetItem: sts.number(),
            weightLimit: v9370.V2WeightLimit,
        })
    ),
    /**
     * Teleport some assets from the local chain to some destination chain.
     * 
     * Fee payment on the destination side is made from the asset in the `assets` vector of
     * index `fee_asset_item`, up to enough to pay for `weight_limit` of weight. If more weight
     * is needed than `weight_limit`, then the operation will fail and the assets send may be
     * at risk.
     * 
     * - `origin`: Must be capable of withdrawing the `assets` and executing XCM.
     * - `dest`: Destination context for the assets. Will typically be `X2(Parent, Parachain(..))` to send
     *   from parachain to parachain, or `X1(Parachain(..))` to send from relay to parachain.
     * - `beneficiary`: A beneficiary location for the assets in the context of `dest`. Will generally be
     *   an `AccountId32` value.
     * - `assets`: The assets to be withdrawn. The first item should be the currency used to to pay the fee on the
     *   `dest` side. May not be empty.
     * - `fee_asset_item`: The index into `assets` of the item which should be used to pay
     *   fees.
     * - `weight_limit`: The remote-side weight limit, if any, for the XCM fee purchase.
     */
    v9420: new CallType(
        'XcmPallet.limited_teleport_assets',
        sts.struct({
            dest: v9420.VersionedMultiLocation,
            beneficiary: v9420.VersionedMultiLocation,
            assets: v9420.VersionedMultiAssets,
            feeAssetItem: sts.number(),
            weightLimit: v9420.V3WeightLimit,
        })
    ),
    /**
     * See [`Pallet::limited_teleport_assets`].
     */
    v1002000: new CallType(
        'XcmPallet.limited_teleport_assets',
        sts.struct({
            dest: v1002000.VersionedLocation,
            beneficiary: v1002000.VersionedLocation,
            assets: v1002000.VersionedAssets,
            feeAssetItem: sts.number(),
            weightLimit: v1002000.V3WeightLimit,
        })
    ),
}

export const transferAssets =  {
    name: 'XcmPallet.transfer_assets',
    /**
     * See [`Pallet::transfer_assets`].
     */
    v1002000: new CallType(
        'XcmPallet.transfer_assets',
        sts.struct({
            dest: v1002000.VersionedLocation,
            beneficiary: v1002000.VersionedLocation,
            assets: v1002000.VersionedAssets,
            feeAssetItem: sts.number(),
            weightLimit: v1002000.V3WeightLimit,
        })
    ),
}

export const transferAssetsUsingTypeAndThen =  {
    name: 'XcmPallet.transfer_assets_using_type_and_then',
    /**
     * See [`Pallet::transfer_assets_using_type_and_then`].
     */
    v1002004: new CallType(
        'XcmPallet.transfer_assets_using_type_and_then',
        sts.struct({
            dest: v1002004.VersionedLocation,
            assets: v1002004.VersionedAssets,
            assetsTransferType: v1002004.TransferType,
            remoteFeesId: v1002004.VersionedAssetId,
            feesTransferType: v1002004.TransferType,
            customXcmOnDest: v1002004.VersionedXcm,
            weightLimit: v1002004.V3WeightLimit,
        })
    ),
}
