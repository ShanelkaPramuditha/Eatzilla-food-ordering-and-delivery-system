import { useAxios as axios } from '@/hooks/use-axios';

class RestaurantService {
  async getAllMenuItems() {
    const res = await axios.get(`/restaurants/menu`);
    return res.data;
  }

  async getMenuItems(id?: string) {
    const res = await axios.get(`/restaurants/${id}/menu`);
    return res.data;
  }

  async postMenuItem(data: any, id?: string) {
    const res = await axios.post(`/restaurants/${id}/menu`, data);
    return res.data;
  }

  async putMenuItem(data: any, restaurantId?: string, id?: number) {
    const res = await axios.put(`/restaurants/${restaurantId}/menu/${id}`, data);
    return res.data;
  }

  async deleteMenuItem(id?: number) {
    const res = await axios.delete(`/restaurants/${id}/menu/${id}`);
    return res.data;
  }
}

export default new RestaurantService();
