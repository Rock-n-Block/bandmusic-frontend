export const saleOptions = ['Pre-sale', 'Public sale', 'Team', 'Promotes', 'Advisor', 'Airdrop'];
const saleType = ['Pre-sale', 'Public sale', 'Team', 'Promotes', 'Advisor', 'Airdrop'] as const;
export type TSaleType = typeof saleType[number];
