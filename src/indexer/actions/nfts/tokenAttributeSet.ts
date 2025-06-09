// @ts-ignore
import { NFTAttribute, NFTToken } from '@/model';
import { Action, ActionContext } from '@/indexer/actions/base';

interface NFTTokenAttributeData {
  collectionId: string;
  tokenId: string;
  key: string;
  value: string;
}

export class TokenAttributeSetAction extends Action<NFTTokenAttributeData> {
  protected async _perform(ctx: ActionContext): Promise<void> {
    const token = await ctx.store.findOne(NFTToken, { where: { id: this.composeId(this.data.tokenId, this.data.collectionId) } });

    if (!token) return;

    const attribute = new NFTAttribute({
      id: this.composeId(this.data.key, this.data.tokenId, this.data.collectionId),
      key: this.data.key,
      value: this.data.value,
      token: token,
    });

    if (!token.attributes) {
      token.attributes = [];
    }

    token.attributes.push(attribute);

    await ctx.store.upsert(token);
  }
}
