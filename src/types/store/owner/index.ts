export const saleOptions = ['Public sale', 'Team', 'Promotes', 'Advisor', 'Airdrop'];
const saleType = ['Public sale', 'Team', 'Promotes', 'Advisor', 'Airdrop'] as const;
export type TSaleType = typeof saleType[number];
