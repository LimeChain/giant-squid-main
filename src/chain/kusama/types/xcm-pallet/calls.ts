import {sts, Block, Bytes, Option, Result, CallType, RuntimeCtx} from '../support'
import * as v9030 from '../v9030'
import * as v9100 from '../v9100'
import * as v9111 from '../v9111'
import * as v9122 from '../v9122'
import * as v9370 from '../v9370'
import * as v9381 from '../v9381'
import * as v1002000 from '../v1002000'
import * as v1002004 from '../v1002004'
import * as v1005000 from '../v1005000'

export const reserveTransferAssets =  {
    name: 'XcmPallet.reserve_transfer_assets',
    /**
     *  Transfer some assets from the local chain to the sovereign account of a destination chain and forward
     *  a notification XCM.
     * 
     *  - `origin`: Must be capable of withdrawing the `assets` and executing XCM.
     *  - `dest`: Destination context for the assets. Will typically be `X2(Parent, Parachain(..))` to send
     *    from parachain to parachain, or `X1(Parachain(..))` to send from relay to parachain.
     *  - `beneficiary`: A beneficiary location for the assets in the context of `dest`. Will generally be
     *    an `AccountId32` value.
     *  - `assets`: The assets to be withdrawn. This should include the assets used to pay the fee on the
     *    `dest` side.
     *  - `dest_weight`: Equal to the total weight on `dest` of the XCM message
     *    `ReserveAssetDeposit { assets, effects: [ BuyExecution{..}, DepositAsset{..} ] }`.
     */
    v9030: new CallType(
        'XcmPallet.reserve_transfer_assets',
        sts.struct({
            dest: v9030.MultiLocation,
            beneficiary: v9030.MultiLocation,
            assets: sts.array(() => v9030.MultiAsset),
            destWeight: v9030.Weight,
        })
    ),
    /**
     *  Transfer some assets from the local chain to the sovereign account of a destination chain and forward
     *  a notification XCM.
     * 
     *  Fee payment on the destination side is made from the first asset listed in the `assets` vector.
     * 
     *  - `origin`: Must be capable of withdrawing the `assets` and executing XCM.
     *  - `dest`: Destination context for the assets. Will typically be `X2(Parent, Parachain(..))` to send
     *    from parachain to parachain, or `X1(Parachain(..))` to send from relay to parachain.
     *  - `beneficiary`: A beneficiary location for the assets in the context of `dest`. Will generally be
     *    an `AccountId32` value.
     *  - `assets`: The assets to be withdrawn. This should include the assets used to pay the fee on the
     *    `dest` side.
     *  - `dest_weight`: Equal to the total weight on `dest` of the XCM message
     *    `ReserveAssetDeposited { assets, effects: [ BuyExecution{..}, DepositAsset{..} ] }`.
     */
    v9100: new CallType(
        'XcmPallet.reserve_transfer_assets',
        sts.struct({
            dest: v9100.VersionedMultiLocation,
            beneficiary: v9100.VersionedMultiLocation,
            assets: v9100.VersionedMultiAssets,
            feeAssetItem: sts.number(),
            destWeight: v9100.Weight,
        })
    ),
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
     */
    v9111: new CallType(
        'XcmPallet.reserve_transfer_assets',
        sts.struct({
            dest: v9111.VersionedMultiLocation,
            beneficiary: v9111.VersionedMultiLocation,
            assets: v9111.VersionedMultiAssets,
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
    v9381: new CallType(
        'XcmPallet.reserve_transfer_assets',
        sts.struct({
            dest: v9381.VersionedMultiLocation,
            beneficiary: v9381.VersionedMultiLocation,
            assets: v9381.VersionedMultiAssets,
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
    /**
     * Transfer some assets from the local chain to the destination chain through their local,
     * destination or remote reserve.
     * 
     * `assets` must have same reserve location and may not be teleportable to `dest`.
     *  - `assets` have local reserve: transfer assets to sovereign account of destination
     *    chain and forward a notification XCM to `dest` to mint and deposit reserve-based
     *    assets to `beneficiary`.
     *  - `assets` have destination reserve: burn local assets and forward a notification to
     *    `dest` chain to withdraw the reserve assets from this chain's sovereign account and
     *    deposit them to `beneficiary`.
     *  - `assets` have remote reserve: burn local assets, forward XCM to reserve chain to move
     *    reserves from this chain's SA to `dest` chain's SA, and forward another XCM to `dest`
     *    to mint and deposit reserve-based assets to `beneficiary`.
     * 
     * **This function is deprecated: Use `limited_reserve_transfer_assets` instead.**
     * 
     * Fee payment on the destination side is made from the asset in the `assets` vector of
     * index `fee_asset_item`. The weight limit for fees is not provided and thus is unlimited,
     * with all fees taken as needed from the asset.
     * 
     * - `origin`: Must be capable of withdrawing the `assets` and executing XCM.
     * - `dest`: Destination context for the assets. Will typically be `[Parent,
     *   Parachain(..)]` to send from parachain to parachain, or `[Parachain(..)]` to send from
     *   relay to parachain.
     * - `beneficiary`: A beneficiary location for the assets in the context of `dest`. Will
     *   generally be an `AccountId32` value.
     * - `assets`: The assets to be withdrawn. This should include the assets used to pay the
     *   fee on the `dest` (and possibly reserve) chains.
     * - `fee_asset_item`: The index into `assets` of the item which should be used to pay
     *   fees.
     */
    v1005000: new CallType(
        'XcmPallet.reserve_transfer_assets',
        sts.struct({
            dest: v1005000.VersionedLocation,
            beneficiary: v1005000.VersionedLocation,
            assets: v1005000.VersionedAssets,
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
    v9122: new CallType(
        'XcmPallet.limited_reserve_transfer_assets',
        sts.struct({
            dest: v9122.VersionedMultiLocation,
            beneficiary: v9122.VersionedMultiLocation,
            assets: v9122.VersionedMultiAssets,
            feeAssetItem: sts.number(),
            weightLimit: v9122.V2WeightLimit,
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
    v9381: new CallType(
        'XcmPallet.limited_reserve_transfer_assets',
        sts.struct({
            dest: v9381.VersionedMultiLocation,
            beneficiary: v9381.VersionedMultiLocation,
            assets: v9381.VersionedMultiAssets,
            feeAssetItem: sts.number(),
            weightLimit: v9381.V3WeightLimit,
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
    /**
     * Transfer some assets from the local chain to the destination chain through their local,
     * destination or remote reserve.
     * 
     * `assets` must have same reserve location and may not be teleportable to `dest`.
     *  - `assets` have local reserve: transfer assets to sovereign account of destination
     *    chain and forward a notification XCM to `dest` to mint and deposit reserve-based
     *    assets to `beneficiary`.
     *  - `assets` have destination reserve: burn local assets and forward a notification to
     *    `dest` chain to withdraw the reserve assets from this chain's sovereign account and
     *    deposit them to `beneficiary`.
     *  - `assets` have remote reserve: burn local assets, forward XCM to reserve chain to move
     *    reserves from this chain's SA to `dest` chain's SA, and forward another XCM to `dest`
     *    to mint and deposit reserve-based assets to `beneficiary`.
     * 
     * Fee payment on the destination side is made from the asset in the `assets` vector of
     * index `fee_asset_item`, up to enough to pay for `weight_limit` of weight. If more weight
     * is needed than `weight_limit`, then the operation will fail and the sent assets may be
     * at risk.
     * 
     * - `origin`: Must be capable of withdrawing the `assets` and executing XCM.
     * - `dest`: Destination context for the assets. Will typically be `[Parent,
     *   Parachain(..)]` to send from parachain to parachain, or `[Parachain(..)]` to send from
     *   relay to parachain.
     * - `beneficiary`: A beneficiary location for the assets in the context of `dest`. Will
     *   generally be an `AccountId32` value.
     * - `assets`: The assets to be withdrawn. This should include the assets used to pay the
     *   fee on the `dest` (and possibly reserve) chains.
     * - `fee_asset_item`: The index into `assets` of the item which should be used to pay
     *   fees.
     * - `weight_limit`: The remote-side weight limit, if any, for the XCM fee purchase.
     */
    v1005000: new CallType(
        'XcmPallet.limited_reserve_transfer_assets',
        sts.struct({
            dest: v1005000.VersionedLocation,
            beneficiary: v1005000.VersionedLocation,
            assets: v1005000.VersionedAssets,
            feeAssetItem: sts.number(),
            weightLimit: v1005000.V3WeightLimit,
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
    v9122: new CallType(
        'XcmPallet.limited_teleport_assets',
        sts.struct({
            dest: v9122.VersionedMultiLocation,
            beneficiary: v9122.VersionedMultiLocation,
            assets: v9122.VersionedMultiAssets,
            feeAssetItem: sts.number(),
            weightLimit: v9122.V2WeightLimit,
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
    v9381: new CallType(
        'XcmPallet.limited_teleport_assets',
        sts.struct({
            dest: v9381.VersionedMultiLocation,
            beneficiary: v9381.VersionedMultiLocation,
            assets: v9381.VersionedMultiAssets,
            feeAssetItem: sts.number(),
            weightLimit: v9381.V3WeightLimit,
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
    /**
     * Teleport some assets from the local chain to some destination chain.
     * 
     * Fee payment on the destination side is made from the asset in the `assets` vector of
     * index `fee_asset_item`, up to enough to pay for `weight_limit` of weight. If more weight
     * is needed than `weight_limit`, then the operation will fail and the sent assets may be
     * at risk.
     * 
     * - `origin`: Must be capable of withdrawing the `assets` and executing XCM.
     * - `dest`: Destination context for the assets. Will typically be `[Parent,
     *   Parachain(..)]` to send from parachain to parachain, or `[Parachain(..)]` to send from
     *   relay to parachain.
     * - `beneficiary`: A beneficiary location for the assets in the context of `dest`. Will
     *   generally be an `AccountId32` value.
     * - `assets`: The assets to be withdrawn. This should include the assets used to pay the
     *   fee on the `dest` chain.
     * - `fee_asset_item`: The index into `assets` of the item which should be used to pay
     *   fees.
     * - `weight_limit`: The remote-side weight limit, if any, for the XCM fee purchase.
     */
    v1005000: new CallType(
        'XcmPallet.limited_teleport_assets',
        sts.struct({
            dest: v1005000.VersionedLocation,
            beneficiary: v1005000.VersionedLocation,
            assets: v1005000.VersionedAssets,
            feeAssetItem: sts.number(),
            weightLimit: v1005000.V3WeightLimit,
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
    /**
     * Transfer some assets from the local chain to the destination chain through their local,
     * destination or remote reserve, or through teleports.
     * 
     * Fee payment on the destination side is made from the asset in the `assets` vector of
     * index `fee_asset_item` (hence referred to as `fees`), up to enough to pay for
     * `weight_limit` of weight. If more weight is needed than `weight_limit`, then the
     * operation will fail and the sent assets may be at risk.
     * 
     * `assets` (excluding `fees`) must have same reserve location or otherwise be teleportable
     * to `dest`, no limitations imposed on `fees`.
     *  - for local reserve: transfer assets to sovereign account of destination chain and
     *    forward a notification XCM to `dest` to mint and deposit reserve-based assets to
     *    `beneficiary`.
     *  - for destination reserve: burn local assets and forward a notification to `dest` chain
     *    to withdraw the reserve assets from this chain's sovereign account and deposit them
     *    to `beneficiary`.
     *  - for remote reserve: burn local assets, forward XCM to reserve chain to move reserves
     *    from this chain's SA to `dest` chain's SA, and forward another XCM to `dest` to mint
     *    and deposit reserve-based assets to `beneficiary`.
     *  - for teleports: burn local assets and forward XCM to `dest` chain to mint/teleport
     *    assets and deposit them to `beneficiary`.
     * 
     * - `origin`: Must be capable of withdrawing the `assets` and executing XCM.
     * - `dest`: Destination context for the assets. Will typically be `X2(Parent,
     *   Parachain(..))` to send from parachain to parachain, or `X1(Parachain(..))` to send
     *   from relay to parachain.
     * - `beneficiary`: A beneficiary location for the assets in the context of `dest`. Will
     *   generally be an `AccountId32` value.
     * - `assets`: The assets to be withdrawn. This should include the assets used to pay the
     *   fee on the `dest` (and possibly reserve) chains.
     * - `fee_asset_item`: The index into `assets` of the item which should be used to pay
     *   fees.
     * - `weight_limit`: The remote-side weight limit, if any, for the XCM fee purchase.
     */
    v1005000: new CallType(
        'XcmPallet.transfer_assets',
        sts.struct({
            dest: v1005000.VersionedLocation,
            beneficiary: v1005000.VersionedLocation,
            assets: v1005000.VersionedAssets,
            feeAssetItem: sts.number(),
            weightLimit: v1005000.V3WeightLimit,
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
    /**
     * Transfer assets from the local chain to the destination chain using explicit transfer
     * types for assets and fees.
     * 
     * `assets` must have same reserve location or may be teleportable to `dest`. Caller must
     * provide the `assets_transfer_type` to be used for `assets`:
     *  - `TransferType::LocalReserve`: transfer assets to sovereign account of destination
     *    chain and forward a notification XCM to `dest` to mint and deposit reserve-based
     *    assets to `beneficiary`.
     *  - `TransferType::DestinationReserve`: burn local assets and forward a notification to
     *    `dest` chain to withdraw the reserve assets from this chain's sovereign account and
     *    deposit them to `beneficiary`.
     *  - `TransferType::RemoteReserve(reserve)`: burn local assets, forward XCM to `reserve`
     *    chain to move reserves from this chain's SA to `dest` chain's SA, and forward another
     *    XCM to `dest` to mint and deposit reserve-based assets to `beneficiary`. Typically
     *    the remote `reserve` is Asset Hub.
     *  - `TransferType::Teleport`: burn local assets and forward XCM to `dest` chain to
     *    mint/teleport assets and deposit them to `beneficiary`.
     * 
     * On the destination chain, as well as any intermediary hops, `BuyExecution` is used to
     * buy execution using transferred `assets` identified by `remote_fees_id`.
     * Make sure enough of the specified `remote_fees_id` asset is included in the given list
     * of `assets`. `remote_fees_id` should be enough to pay for `weight_limit`. If more weight
     * is needed than `weight_limit`, then the operation will fail and the sent assets may be
     * at risk.
     * 
     * `remote_fees_id` may use different transfer type than rest of `assets` and can be
     * specified through `fees_transfer_type`.
     * 
     * The caller needs to specify what should happen to the transferred assets once they reach
     * the `dest` chain. This is done through the `custom_xcm_on_dest` parameter, which
     * contains the instructions to execute on `dest` as a final step.
     *   This is usually as simple as:
     *   `Xcm(vec![DepositAsset { assets: Wild(AllCounted(assets.len())), beneficiary }])`,
     *   but could be something more exotic like sending the `assets` even further.
     * 
     * - `origin`: Must be capable of withdrawing the `assets` and executing XCM.
     * - `dest`: Destination context for the assets. Will typically be `[Parent,
     *   Parachain(..)]` to send from parachain to parachain, or `[Parachain(..)]` to send from
     *   relay to parachain, or `(parents: 2, (GlobalConsensus(..), ..))` to send from
     *   parachain across a bridge to another ecosystem destination.
     * - `assets`: The assets to be withdrawn. This should include the assets used to pay the
     *   fee on the `dest` (and possibly reserve) chains.
     * - `assets_transfer_type`: The XCM `TransferType` used to transfer the `assets`.
     * - `remote_fees_id`: One of the included `assets` to be used to pay fees.
     * - `fees_transfer_type`: The XCM `TransferType` used to transfer the `fees` assets.
     * - `custom_xcm_on_dest`: The XCM to be executed on `dest` chain as the last step of the
     *   transfer, which also determines what happens to the assets on the destination chain.
     * - `weight_limit`: The remote-side weight limit, if any, for the XCM fee purchase.
     */
    v1005000: new CallType(
        'XcmPallet.transfer_assets_using_type_and_then',
        sts.struct({
            dest: v1005000.VersionedLocation,
            assets: v1005000.VersionedAssets,
            assetsTransferType: v1005000.TransferType,
            remoteFeesId: v1005000.VersionedAssetId,
            feesTransferType: v1005000.TransferType,
            customXcmOnDest: v1005000.VersionedXcm,
            weightLimit: v1005000.V3WeightLimit,
        })
    ),
}
