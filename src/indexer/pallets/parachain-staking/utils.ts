export const buildParachainStakingExtrinsicHash = (blockHeight: number, eventIndex: number, eventExtrinsicIndex?: number) => {
  // This is compounded because there is no extrinsicHash as data and no easy way to check the info in subscan if needed.
  return `https://${process.env.CHAIN}.subscan.io/extrinsic/${blockHeight}-${eventExtrinsicIndex ?? 0}?event=${blockHeight}-${eventIndex}`;
};
