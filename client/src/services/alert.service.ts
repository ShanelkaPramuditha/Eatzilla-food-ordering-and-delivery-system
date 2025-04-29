import { useAxios as axios } from '@/hooks/use-axios';
import { AlertObject } from '@/types/notification';

const AlertService = {
  getAlerts: async (): Promise<AlertObject[]> => {
    const res = await axios.get('/alert');
    return res.data;
  },

  markAsRead: async (alertId: string): Promise<void> => {
    const res = await axios.patch(`/alert/${alertId}/read`);
    return res.data;
  },

  markAllAsRead: async (): Promise<void> => {
    const res = await axios.patch(`/alert/all/read`);
    return res.data;
  },
};

export default AlertService;
