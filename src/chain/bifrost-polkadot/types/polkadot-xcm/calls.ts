import {sts, Block, Bytes, Option, Result, CallType, RuntimeCtx} from '../support'
import * as v932 from '../v932'
import * as v970 from '../v970'
import * as v972 from '../v972'
import * as v10000 from '../v10000'
import * as v11000 from '../v11000'
import * as v12001 from '../v12001'

export const reserveTransferAssets =  {
    name: 'PolkadotXcm.reserve_transfer_assets',
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
    v932: new CallType(
        'PolkadotXcm.reserve_transfer_assets',
        sts.struct({
            dest: v932.VersionedMultiLocation,
            beneficiary: v932.VersionedMultiLocation,
            assets: v932.VersionedMultiAssets,
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
    v970: new CallType(
        'PolkadotXcm.reserve_transfer_assets',
        sts.struct({
            dest: v970.VersionedMultiLocation,
            beneficiary: v970.VersionedMultiLocation,
            assets: v970.VersionedMultiAssets,
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
    v972: new CallType(
        'PolkadotXcm.reserve_transfer_assets',
        sts.struct({
            dest: v972.VersionedMultiLocation,
            beneficiary: v972.VersionedMultiLocation,
            assets: v972.VersionedMultiAssets,
            feeAssetItem: sts.number(),
        })
    ),
    /**
     * See [`Pallet::reserve_transfer_assets`].
     */
    v10000: new CallType(
        'PolkadotXcm.reserve_transfer_assets',
        sts.struct({
            dest: v10000.VersionedMultiLocation,
            beneficiary: v10000.VersionedMultiLocation,
            assets: v10000.VersionedMultiAssets,
            feeAssetItem: sts.number(),
        })
    ),
    /**
     * See [`Pallet::reserve_transfer_assets`].
     */
    v11000: new CallType(
        'PolkadotXcm.reserve_transfer_assets',
        sts.struct({
            dest: v11000.VersionedLocation,
            beneficiary: v11000.VersionedLocation,
            assets: v11000.VersionedAssets,
            feeAssetItem: sts.number(),
        })
    ),
}

export const limitedReserveTransferAssets =  {
    name: 'PolkadotXcm.limited_reserve_transfer_assets',
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
    v932: new CallType(
        'PolkadotXcm.limited_reserve_transfer_assets',
        sts.struct({
            dest: v932.VersionedMultiLocation,
            beneficiary: v932.VersionedMultiLocation,
            assets: v932.VersionedMultiAssets,
            feeAssetItem: sts.number(),
            weightLimit: v932.V2WeightLimit,
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
    v970: new CallType(
        'PolkadotXcm.limited_reserve_transfer_assets',
        sts.struct({
            dest: v970.VersionedMultiLocation,
            beneficiary: v970.VersionedMultiLocation,
            assets: v970.VersionedMultiAssets,
            feeAssetItem: sts.number(),
            weightLimit: v970.V2WeightLimit,
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
    v972: new CallType(
        'PolkadotXcm.limited_reserve_transfer_assets',
        sts.struct({
            dest: v972.VersionedMultiLocation,
            beneficiary: v972.VersionedMultiLocation,
            assets: v972.VersionedMultiAssets,
            feeAssetItem: sts.number(),
            weightLimit: v972.V3WeightLimit,
        })
    ),
    /**
     * See [`Pallet::limited_reserve_transfer_assets`].
     */
    v10000: new CallType(
        'PolkadotXcm.limited_reserve_transfer_assets',
        sts.struct({
            dest: v10000.VersionedMultiLocation,
            beneficiary: v10000.VersionedMultiLocation,
            assets: v10000.VersionedMultiAssets,
            feeAssetItem: sts.number(),
            weightLimit: v10000.V3WeightLimit,
        })
    ),
    /**
     * See [`Pallet::limited_reserve_transfer_assets`].
     */
    v11000: new CallType(
        'PolkadotXcm.limited_reserve_transfer_assets',
        sts.struct({
            dest: v11000.VersionedLocation,
            beneficiary: v11000.VersionedLocation,
            assets: v11000.VersionedAssets,
            feeAssetItem: sts.number(),
            weightLimit: v11000.V3WeightLimit,
        })
    ),
}

export const limitedTeleportAssets =  {
    name: 'PolkadotXcm.limited_teleport_assets',
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
     * - `fee_asset_item`: The index into `assets` of the item which should be used to pay
     *   fees.
     * - `weight_limit`: The remote-side weight limit, if any, for the XCM fee purchase.
     */
    v932: new CallType(
        'PolkadotXcm.limited_teleport_assets',
        sts.struct({
            dest: v932.VersionedMultiLocation,
            beneficiary: v932.VersionedMultiLocation,
            assets: v932.VersionedMultiAssets,
            feeAssetItem: sts.number(),
            weightLimit: v932.V2WeightLimit,
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
    v970: new CallType(
        'PolkadotXcm.limited_teleport_assets',
        sts.struct({
            dest: v970.VersionedMultiLocation,
            beneficiary: v970.VersionedMultiLocation,
            assets: v970.VersionedMultiAssets,
            feeAssetItem: sts.number(),
            weightLimit: v970.V2WeightLimit,
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
    v972: new CallType(
        'PolkadotXcm.limited_teleport_assets',
        sts.struct({
            dest: v972.VersionedMultiLocation,
            beneficiary: v972.VersionedMultiLocation,
            assets: v972.VersionedMultiAssets,
            feeAssetItem: sts.number(),
            weightLimit: v972.V3WeightLimit,
        })
    ),
    /**
     * See [`Pallet::limited_teleport_assets`].
     */
    v10000: new CallType(
        'PolkadotXcm.limited_teleport_assets',
        sts.struct({
            dest: v10000.VersionedMultiLocation,
            beneficiary: v10000.VersionedMultiLocation,
            assets: v10000.VersionedMultiAssets,
            feeAssetItem: sts.number(),
            weightLimit: v10000.V3WeightLimit,
        })
    ),
    /**
     * See [`Pallet::limited_teleport_assets`].
     */
    v11000: new CallType(
        'PolkadotXcm.limited_teleport_assets',
        sts.struct({
            dest: v11000.VersionedLocation,
            beneficiary: v11000.VersionedLocation,
            assets: v11000.VersionedAssets,
            feeAssetItem: sts.number(),
            weightLimit: v11000.V3WeightLimit,
        })
    ),
}

export const transferAssets =  {
    name: 'PolkadotXcm.transfer_assets',
    /**
     * See [`Pallet::transfer_assets`].
     */
    v10000: new CallType(
        'PolkadotXcm.transfer_assets',
        sts.struct({
            dest: v10000.VersionedMultiLocation,
            beneficiary: v10000.VersionedMultiLocation,
            assets: v10000.VersionedMultiAssets,
            feeAssetItem: sts.number(),
            weightLimit: v10000.V3WeightLimit,
        })
    ),
    /**
     * See [`Pallet::transfer_assets`].
     */
    v11000: new CallType(
        'PolkadotXcm.transfer_assets',
        sts.struct({
            dest: v11000.VersionedLocation,
            beneficiary: v11000.VersionedLocation,
            assets: v11000.VersionedAssets,
            feeAssetItem: sts.number(),
            weightLimit: v11000.V3WeightLimit,
        })
    ),
}

export const transferAssetsUsingTypeAndThen =  {
    name: 'PolkadotXcm.transfer_assets_using_type_and_then',
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
     * - `remote_fees_id`: One of the included `assets` to be be used to pay fees.
     * - `fees_transfer_type`: The XCM `TransferType` used to transfer the `fees` assets.
     * - `custom_xcm_on_dest`: The XCM to be executed on `dest` chain as the last step of the
     *   transfer, which also determines what happens to the assets on the destination chain.
     * - `weight_limit`: The remote-side weight limit, if any, for the XCM fee purchase.
     */
    v12001: new CallType(
        'PolkadotXcm.transfer_assets_using_type_and_then',
        sts.struct({
            dest: v12001.VersionedLocation,
            assets: v12001.VersionedAssets,
            assetsTransferType: v12001.TransferType,
            remoteFeesId: v12001.VersionedAssetId,
            feesTransferType: v12001.TransferType,
            customXcmOnDest: v12001.VersionedXcm,
            weightLimit: v12001.V3WeightLimit,
        })
    ),
}
