import { Account, Identity, IdentityAdditionalField, Judgement, IdentitySub } from '@/model';
import { Action, ActionContext } from '@/indexer/actions/base';

export interface RenameIdentitySubData {
  sub: () => Promise<IdentitySub>;
  name: string | null;
}

export class RenameSubAction extends Action<RenameIdentitySubData> {
  protected async _perform(ctx: ActionContext): Promise<void> {
    const sub = await this.data.sub();

    sub.name = this.data.name;

    await ctx.store.upsert(sub);
  }
}

export interface EnsureIdentityData {
  identity: () => Promise<Identity | undefined>;
  id: string;
  account: () => Promise<Account>;
}

export class EnsureIdentityAction extends Action<EnsureIdentityData> {
  protected async _perform(ctx: ActionContext): Promise<void> {
    let identity = await this.data.identity();

    if (identity != null) return;

    const account = await this.data.account();

    identity = new Identity({
      id: this.data.id,
      account,
      isKilled: false,
      judgement: Judgement.Unknown,
    });

    await ctx.store.insert(identity);
  }
}

export interface SetIdentityData {
  identity: () => Promise<Identity>;
  display: string | null;
  email: string | null;
  twitter: string | null;
  riot: string | null;
  image: string | null;
  web: string | null;
  pgpFingerprint: string | null;
  legal: string | null;
  additional: {
    name: string | null;
    value: string | null;
  }[];
}

export class SetIdentityAction extends Action<SetIdentityData> {
  protected async _perform(ctx: ActionContext): Promise<void> {
    let identity = await this.data.identity();

    identity.display = this.data.display;
    identity.email = this.data.email;
    identity.twitter = this.data.twitter;
    identity.riot = this.data.riot;
    identity.image = this.data.image;
    identity.web = this.data.web;
    identity.pgpFingerprint = this.data.pgpFingerprint;
    identity.legal = this.data.legal;
    identity.additional = this.data.additional.map((a) => new IdentityAdditionalField(a));

    await ctx.store.upsert(identity);
  }
}

export interface GiveJudgementData {
  identity: () => Promise<Identity>;
  judgement: Judgement;
}

export class GiveJudgementAction extends Action<GiveJudgementData> {
  protected async _perform(ctx: ActionContext): Promise<void> {
    const identity = await this.data.identity();

    identity.judgement = this.data.judgement;

    await ctx.store.upsert(identity);
  }
}

export interface EnsureIdentitySubData {
  sub: () => Promise<IdentitySub | undefined>;
  account: () => Promise<Account>;
  id: string;
}

export class EnsureIdentitySubAction extends Action<EnsureIdentitySubData> {
  protected async _perform(ctx: ActionContext): Promise<void> {
    const account = await this.data.account();

    let sub = await this.data.sub();
    if (sub != null) return;

    sub = new IdentitySub({
      id: this.data.id,
      account,
    });

    await ctx.store.insert(sub);
  }
}

export interface AddIdentitySubData {
  identity: () => Promise<Identity>;
  sub: () => Promise<IdentitySub>;
}

export class AddIdentitySubAction extends Action<AddIdentitySubData> {
  protected async _perform(ctx: ActionContext): Promise<void> {
    const identity = await this.data.identity();

    let sub = await this.data.sub();

    sub.super = identity;

    await ctx.store.upsert(sub);
  }
}

export interface ClearIdentityData {
  identity: () => Promise<Identity>;
}

export class ClearIdentityAction extends Action<ClearIdentityData> {
  protected async _perform(ctx: ActionContext): Promise<void> {
    const identity = await this.data.identity();

    identity.display = null;
    identity.email = null;
    identity.twitter = null;
    identity.riot = null;
    identity.image = null;
    identity.web = null;
    identity.pgpFingerprint = null;
    identity.legal = null;
    identity.additional = null;

    await ctx.store.upsert(identity);
  }
}

export interface IdentityKilledData {
  identity: () => Promise<Identity>;
}

export class KillIdentityAction extends Action<IdentityKilledData> {
  protected async _perform(ctx: ActionContext): Promise<void> {
    const identity = await this.data.identity();

    identity.isKilled = true;

    await ctx.store.upsert(identity);
  }
}

export interface RemoveIdentitySubData {
  sub: () => Promise<IdentitySub>;
}

export class RemoveIdentitySubAction extends Action<RemoveIdentitySubData> {
  protected async _perform(ctx: ActionContext): Promise<void> {
    const sub = await this.data.sub();

    sub.name = null;
    sub.super = null;

    await ctx.store.upsert(sub);
  }
}
