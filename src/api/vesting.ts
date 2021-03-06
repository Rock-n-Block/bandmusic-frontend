/* eslint-disable camelcase */
import BigNumber from 'bignumber.js';

import { TLoaded } from '@/store/Models/Owner';
import { TSaleType, VestingClaimStatus } from '@/types';
import { deNormalizedValue } from '@/utils';

import api from './axios';

const base = 'vesting/';

export type TUpdateStatusData = {
  username: string;
  token_amount: number;
  claimed_at: number;
  tx_hash: string;
};

export type TInitLimit = {
  limit: string;
  sale_type: TSaleType;
};

export default {
  update_status: (data: TUpdateStatusData[]) =>
    api.post(`${base}status_update/`, {
      drop: data,
    }),
  getData: (address?: string, status?: VestingClaimStatus) =>
    api.get(
      `${base}users/?username=${address?.toLowerCase() || ''}${
        status ? `&claims__status=${status}` : ''
      }`,
    ),
  sendData: (data: TLoaded) =>
    api.post(`${base}users/`, {
      drop: data.map((line) => ({
        username: line.address.toLowerCase(),
        join_at: line.timestamp,
        tokens_bought: new BigNumber(deNormalizedValue(line.amount)).toNumber(),
        sale_type: line.saleType,
      })),
    }),
  getLimits: () => api.get(`${base}limits/`),
  initLimits: (data: TInitLimit) => api.post(`${base}limits/`, data),
  editLimits: (data: TInitLimit) => api.patch(`${base}limits/${data.sale_type}`, data),
  getStats: () => api.get(`${base}stats/`),
};
