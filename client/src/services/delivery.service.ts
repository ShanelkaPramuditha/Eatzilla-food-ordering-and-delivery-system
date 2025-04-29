// src/services/delivery.service.ts
import { useAxios as axios } from '@/hooks/use-axios';
import { Location } from '@/types/delivery';

const DeliveryService = {
  /**
   * Update delivery person availability status and location
   * @param deliveryPersonId - ID of the delivery person
   * @param isAvailable - Availability status
   * @param currentLocation - Current GPS location (optional)
   * @returns Status update result
   */
  updateAvailabilityStatus: async (
    deliveryPersonId: string,
    isAvailable: boolean,
    currentLocation?: Location,
  ) => {
    console.log('Updating availability status:', {
      deliveryPersonId,
      isAvailable,
      currentLocation,
    });

    try {
      const response = await axios.post('/delivery/driver/availability', {
        deliveryPersonId,
        isAvailable,
        currentLocation,
        timestamp: new Date().toISOString(),
      });

      return response.data;
    } catch (error) {
      console.error('Error updating delivery person availability:', error);
      throw error;
    }
  },

  /**
   * Get the current status of a delivery person
   * @param deliveryPersonId - ID of the delivery person
   * @returns Current status
   */
  getDriverStatus: async (deliveryPersonId: string) => {
    try {
      const response = await axios.get(`/delivery/driver/${deliveryPersonId}/status`);
      return response.data;
    } catch (error) {
      console.error('Error getting delivery person status:', error);
      throw error;
    }
  },

  /**
   * Find available delivery persons near a specified location
   * @param lat - Latitude
   * @param lng - Longitude
   * @param distance - Maximum distance in kilometers (optional)
   * @returns List of available delivery persons
   */
  findAvailableDrivers: async (lat: number, lng: number, distance?: number) => {
    try {
      const url = `/delivery/drivers/available?lat=${lat}&lng=${lng}${distance ? `&distance=${distance}` : ''}`;
      const response = await axios.get(url);
      return response.data;
    } catch (error) {
      console.error('Error finding available delivery persons:', error);
      throw error;
    }
  },

  /**
   * Assign a delivery person to an order
   * @param deliveryPersonId - ID of the delivery person
   * @param orderId - ID of the order
   * @returns Assignment result
   */
  assignDriverToOrder: async (deliveryPersonId: string, orderId: string) => {
    try {
      const response = await axios.post(`/delivery/driver/${deliveryPersonId}/assign/${orderId}`);
      return response.data;
    } catch (error) {
      console.error('Error assigning delivery person to order:', error);
      throw error;
    }
  },

  /**
   * Mark a delivery as completed by the delivery person
   * @param deliveryPersonId - ID of the delivery person
   * @returns Completion result
   */
  completeDelivery: async (deliveryPersonId: string) => {
    try {
      const response = await axios.post(`/delivery/driver/${deliveryPersonId}/complete`);
      return response.data;
    } catch (error) {
      console.error('Error completing delivery:', error);
      throw error;
    }
  },
};

export default DeliveryService;
