import axios from 'axios';

import { isProduction } from '@/config';

const baseURI = isProduction
  ? 'https://rylt.io/api/v1/'
  : 'https://bandmusic.rocknblock.io/api/v1/';

const api = axios.create({
  baseURL: baseURI,
});

api.interceptors.request.use(
  (config) => {
    const RawTokenData = localStorage.getItem('bandmusic_token');
    const token = RawTokenData ? JSON.parse(RawTokenData) : null;
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    config.headers.common = {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      ...config.headers.common,
      Authorization: `${token ? `Token ${token.token}` : ''}`,
    };

    return config;
  },
  (error) => {
    console.error(error);
    return Promise.reject(error);
  },
);
export default api;
