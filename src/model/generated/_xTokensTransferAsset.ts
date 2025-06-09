import assert from "assert"
import * as marshal from "./marshal"

export class XTokensTransferAsset {
    private _parents!: number | undefined | null
    private _pallet!: string | undefined | null
    private _assetId!: string | undefined | null
    private _parachain!: string | undefined | null
    private _fullPath!: (string | undefined | null)[] | undefined | null

    constructor(props?: Partial<Omit<XTokensTransferAsset, 'toJSON'>>, json?: any) {
        Object.assign(this, props)
        if (json != null) {
            this._parents = json.parents == null ? undefined : marshal.int.fromJSON(json.parents)
            this._pallet = json.pallet == null ? undefined : marshal.string.fromJSON(json.pallet)
            this._assetId = json.assetId == null ? undefined : marshal.string.fromJSON(json.assetId)
            this._parachain = json.parachain == null ? undefined : marshal.string.fromJSON(json.parachain)
            this._fullPath = json.fullPath == null ? undefined : marshal.fromList(json.fullPath, val => val == null ? undefined : marshal.string.fromJSON(val))
        }
    }

    get parents(): number | undefined | null {
        return this._parents
    }

    set parents(value: number | undefined | null) {
        this._parents = value
    }

    get pallet(): string | undefined | null {
        return this._pallet
    }

    set pallet(value: string | undefined | null) {
        this._pallet = value
    }

    get assetId(): string | undefined | null {
        return this._assetId
    }

    set assetId(value: string | undefined | null) {
        this._assetId = value
    }

    get parachain(): string | undefined | null {
        return this._parachain
    }

    set parachain(value: string | undefined | null) {
        this._parachain = value
    }

    get fullPath(): (string | undefined | null)[] | undefined | null {
        return this._fullPath
    }

    set fullPath(value: (string | undefined | null)[] | undefined | null) {
        this._fullPath = value
    }

    toJSON(): object {
        return {
            parents: this.parents,
            pallet: this.pallet,
            assetId: this.assetId,
            parachain: this.parachain,
            fullPath: this.fullPath,
        }
    }
}
