export const saleOptions = ['Public sale', 'Team', 'Promoters', 'Advisors', 'Airdrop'];
const saleType = ['Public sale', 'Team', 'Promoters', 'Advisors', 'Airdrop'] as const;
export type TSaleType = typeof saleType[number];
