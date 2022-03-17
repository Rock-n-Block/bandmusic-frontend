import api from '@/api/axios';

export default {
  getDataChange: (period: string) => api.get(`/data_change/?days=${period}`),
  getCurrentData: () => api.get('/current_data'),
  getBalance: (address: string) => api.get(`/balance/?address=${address}`),
};
