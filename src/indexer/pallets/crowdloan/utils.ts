// @ts-ignore
import { Crowdloan } from '@/model';

export const buildContributorId = (accountId: string, crowdloanId: string) => `${accountId}-${crowdloanId}`;
export const getActiveCrowdloan = (crowdloans: Crowdloan[]): Crowdloan | null => {
  if (crowdloans.length === 0) return null;

  // the most recent crowdloan is considered as the active one
  return crowdloans.sort((a, b) => b.startBlock - a.startBlock)[0];
};
