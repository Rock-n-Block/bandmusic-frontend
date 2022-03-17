/* eslint-disable camelcase */
import api from '@/api/axios';

const base = 'accounts/';

export default {
  getMsg: () => api.get(`${base}get_metamask_message/`),
  login: (address: string, msg: string, signed_msg: string) =>
    api.post(`${base}metamask_login/`, {
      address,
      msg,
      signed_msg,
    }),
};
