// @ts-ignore
import { NFTCollection, NFTHolder, NFTToken, NFTTokenStandard, NFTTransfer, NFTTokenTransfer } from '@/model';
import { Action, ActionContext } from '@/indexer/actions/base';
import { ethers } from 'ethers';
import * as erc721 from '@/abi/erc721';
import * as erc1155 from '@/abi/erc1155';

// Set up ethers provider for Moonbeam
const MOONBEAM_RPC = 'https://rpc.api.moonbeam.network';
const provider = new ethers.JsonRpcProvider(MOONBEAM_RPC);

// In-memory caches for metadata links
const erc721UriCache: Record<string, string> = {};
const erc1155UriCache: Record<string, string> = {};

export interface NftTokenData {
  id: string;
  nftCollectionId: string;
  oldOwnerId: string;
  newOwnerId: string;
  standard?: NFTTokenStandard;
  transferId: string;
}

export interface NftTokensData {
  tokenIds: string[];
  nftCollection: () => Promise<NFTCollection>;
  oldOwner: () => Promise<NFTHolder>;
  newOwner: () => Promise<NFTHolder>;
  standard?: NFTTokenStandard;
  transfer: () => Promise<NFTTransfer>;
}

const MINT_ACCOUNT = '0x0000000000000000000000000000000000000000';
export class NftTokensAction extends Action<NftTokensData> {
  protected async _perform(ctx: ActionContext): Promise<void> {
    const [nftCollection, transfer, oldOwner, newOwner] = await Promise.all([
      this.data.nftCollection(),
      this.data.transfer(),
      this.data.oldOwner(),
      this.data.newOwner(),
    ]);

    const newTokens: NFTToken[] = [];
    const tokensToSave: NFTToken[] = [];
    const nftTokenTransfers: NFTTokenTransfer[] = [];

    for (let i = 0; i < this.data.tokenIds.length; i++) {
      const tokenId = this.data.tokenIds[i];
      const token = await ctx.store.get(NFTToken, this.composeId(tokenId, this.data.nftCollection));

      // if token has already been indexed
      if (token) {
        // change nft's owner after transfer
        // @ts-ignore
        token.owner = newOwner.account;

        // update owner counts
        // @ts-ignore
        if (this.data.newOwnerId !== MINT_ACCOUNT) newOwner.nftCount += 1;
        // @ts-ignore
        if (this.data.oldOwnerId !== MINT_ACCOUNT) oldOwner.nftCount -= 1;

        // push to db save array
        tokensToSave.push(token);
        nftTokenTransfers.push(
          new NFTTokenTransfer({
            id: this.composeId(this.data.transfer, tokenId, this.data.oldOwner, this.data.newOwner, i),
            token,
            transfer,
          })
        );
      }
      // first time indexing a token
      else {
        // fetch token's metadata
        const metadata =
          this.data.standard === NFTTokenStandard.ERC721
            ? await fetchErc721Metadata(nftCollection.id, tokenId)
            : await fetchErc1155Metadata(nftCollection.id, tokenId);

        const newToken = new NFTToken({
          id: this.composeId(tokenId, nftCollection.id),
          tokenId,
          collection: nftCollection,
          // @ts-ignore
          owner: newOwner.account,
          metadataUri: metadata.uri,
          standard: this.data.standard,
        });

        // update owner counts
        // @ts-ignore
        if (this.data.newOwnerId !== MINT_ACCOUNT) newOwner.nftCount += 1;
        // @ts-ignore

        if (this.data.oldOwnerId !== MINT_ACCOUNT) oldOwner.nftCount -= 1;

        // push to db save array
        newTokens.push(newToken);
        nftTokenTransfers.push(
          new NFTTokenTransfer({
            id: this.composeId(this.data.transfer, tokenId, this.data.oldOwner, this.data.newOwner, i),
            token: newToken,
            transfer,
          })
        );
      }
    }

    // batch db requests
    await Promise.all([ctx.store.upsert([...newTokens, ...nftTokenTransfers]), ctx.store.save([newOwner, oldOwner, ...tokensToSave])]);
  }
}

async function fetchErc721Metadata(address: string, tokenId: string) {
  const cacheKey = `${address.toLowerCase()}:${tokenId}`;
  let uri = erc721UriCache[cacheKey];

  // return cached uri
  if (uri) return { uri };

  // get new uri
  try {
    const contract = new ethers.Contract(address, erc721.abi, provider);
    const uri: string = await contract.tokenURI(tokenId);

    // remove null bytes padding (commonly added by ethereum contracts)
    const cleanUrl = uri.replace(/\x00+/g, '');
    erc721UriCache[cacheKey] = cleanUrl;

    return { uri: cleanUrl };
  } catch (e: any) {
    return { error: e.message };
  }
}

async function fetchErc1155Metadata(address: string, id: string) {
  const cacheKey = `${address.toLowerCase()}:${id}`;
  let uri = erc1155UriCache[cacheKey];

  // return cached uri
  if (uri) return { uri };

  // get new uri
  try {
    const contract = new ethers.Contract(address, erc1155.abi, provider);
    let uri: string = await contract.uri(id);

    if (uri.includes('{id}')) {
      const hexId = BigInt(id).toString(16).padStart(64, '0');
      // insert tokenId in to uri template
      uri = uri.replace('{id}', hexId);

      // remove null bytes padding (commonly added by ethereum contracts)
      uri = uri.replace(/\x00+/g, '');
    }

    erc1155UriCache[cacheKey] = uri;

    return { uri };
  } catch (e: any) {
    return { error: e.message };
  }
}
