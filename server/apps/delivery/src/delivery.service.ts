import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { DeliveryPersonAvailability } from './schemas/delivery-person.schema';
import { UpdateDeliveryPersonAvailabilityDto } from './dtos/delivery-person.dto';

@Injectable()
export class DeliveryService {
  private readonly logger = new Logger(DeliveryService.name);

  constructor(
    @InjectModel(DeliveryPersonAvailability.name)
    private readonly deliveryPersonAvailabilityModel: Model<DeliveryPersonAvailability>,
  ) {
    // Log when the service is created to ensure model injection works
    this.logger.log(`DeliveryService initialized with model: ${!!deliveryPersonAvailabilityModel}`);
  }

  getStatus(): string {
    return 'Delivery service is running';
  }

  /**
   * Update a delivery person's availability status and location
   */
  async updateDeliveryPersonAvailability(
    updateDto: UpdateDeliveryPersonAvailabilityDto,
  ): Promise<DeliveryPersonAvailability> {
    this.logger.log(`Updating delivery person availability: ${JSON.stringify(updateDto)}`);

    // First check if the document exists
    const existingDocument = await this.deliveryPersonAvailabilityModel.findOne({
      deliveryPersonId: updateDto.deliveryPersonId,
    });

    const isNewRecord = !existingDocument;
    this.logger.log(
      `${isNewRecord ? 'Creating new' : 'Updating existing'} record for driver: ${updateDto.deliveryPersonId}`,
    );

    // Set status based on availability
    const status = updateDto.isAvailable ? 'online' : 'offline';

    try {
      let result;

      if (isNewRecord) {
        // Create new document if it doesn't exist
        const newDeliveryPerson = new this.deliveryPersonAvailabilityModel({
          deliveryPersonId: updateDto.deliveryPersonId,
          isAvailable: updateDto.isAvailable,
          currentLocation: updateDto.currentLocation,
          status,
          lastUpdated: updateDto.timestamp ? new Date(updateDto.timestamp) : new Date(),
          isOnDelivery: false,
          currentOrderId: null,
        });

        result = await newDeliveryPerson.save();
        this.logger.log(`Created new delivery person record with ID: ${result._id}`);
      } else {
        // Update existing document
        const updateData: any = {
          isAvailable: updateDto.isAvailable,
          status,
          lastUpdated: updateDto.timestamp ? new Date(updateDto.timestamp) : new Date(),
        };

        // Only update location if provided
        if (updateDto.currentLocation) {
          updateData.currentLocation = updateDto.currentLocation;
        }

        // If setting to unavailable, clear current delivery info
        if (!updateDto.isAvailable) {
          updateData.isOnDelivery = false;
          updateData.currentOrderId = null;
        }

        result = await this.deliveryPersonAvailabilityModel.findOneAndUpdate(
          { deliveryPersonId: updateDto.deliveryPersonId },
          { $set: updateData }, // Use $set to ensure we're updating, not replacing
          { new: true },
        );

        this.logger.log(`Updated existing delivery person record with ID: ${result._id}`);
      }

      return result;
    } catch (error) {
      this.logger.error(`Error updating delivery person availability: ${error.message}`);
      this.logger.error(`Stack trace: ${error.stack}`);
      throw error;
    }
  }

  /**
   * Get a delivery person's current status
   */
  async getDeliveryPersonStatus(
    deliveryPersonId: string,
  ): Promise<DeliveryPersonAvailability | null> {
    try {
      this.logger.log(`Getting status for delivery person: ${deliveryPersonId}`);
      const result = await this.deliveryPersonAvailabilityModel.findOne({ deliveryPersonId });
      this.logger.log(`Status found: ${!!result}`);
      return result;
    } catch (error) {
      this.logger.error(`Error retrieving delivery person status: ${error.message}`);
      throw error;
    }
  }

  /**
   * Find available delivery persons near a location
   */
  async findAvailableDeliveryPersons(
    lat: number,
    lng: number,
    maxDistanceKm: number = 5,
  ): Promise<DeliveryPersonAvailability[]> {
    try {
      this.logger.log(
        `Finding available delivery persons near: ${lat}, ${lng}, distance: ${maxDistanceKm}km`,
      );

      // First try a simpler query to see if we have any available drivers at all
      const anyAvailable = await this.deliveryPersonAvailabilityModel
        .find({
          isAvailable: true,
          isOnDelivery: false,
        })
        .limit(1);

      if (anyAvailable.length === 0) {
        this.logger.log('No available delivery persons found');
        return [];
      }

      // If we do have available drivers, check with geolocation
      // Convert km to radians for MongoDB geospatial query
      // Earth's radius is approximately 6371 km
      const maxDistanceRadians = maxDistanceKm / 6371;

      // Try a basic query first without geolocation to debug
      const availableDrivers = await this.deliveryPersonAvailabilityModel.find({
        isAvailable: true,
        isOnDelivery: false,
      });

      this.logger.log(`Found ${availableDrivers.length} available drivers total`);

      // Now try with geolocation - if it fails, we'll at least have some data
      try {
        const driversNearby = await this.deliveryPersonAvailabilityModel
          .find({
            isAvailable: true,
            isOnDelivery: false,
            currentLocation: {
              $geoWithin: {
                $centerSphere: [[lng, lat], maxDistanceRadians],
              },
            },
          })
          .sort({ lastUpdated: -1 });

        this.logger.log(`Found ${driversNearby.length} nearby drivers`);
        return driversNearby;
      } catch (geoError) {
        this.logger.error(`Error in geospatial query: ${geoError.message}`);
        // Return all available drivers if geospatial query fails
        return availableDrivers;
      }
    } catch (error) {
      this.logger.error(`Error finding available delivery persons: ${error.message}`);
      throw error;
    }
  }

  /**
   * Assign a delivery person to an order
   */
  async assignDeliveryPerson(
    deliveryPersonId: string,
    orderId: string,
  ): Promise<DeliveryPersonAvailability> {
    try {
      return await this.deliveryPersonAvailabilityModel.findOneAndUpdate(
        { deliveryPersonId },
        {
          $set: {
            isOnDelivery: true,
            currentOrderId: orderId,
            status: 'busy',
            lastUpdated: new Date(),
          },
        },
        { new: true },
      );
    } catch (error) {
      this.logger.error(`Error assigning delivery person to order: ${error.message}`);
      throw error;
    }
  }

  /**
   * Mark a delivery as completed and update driver status
   */
  async completeDelivery(deliveryPersonId: string): Promise<DeliveryPersonAvailability> {
    try {
      return await this.deliveryPersonAvailabilityModel.findOneAndUpdate(
        { deliveryPersonId },
        {
          $set: {
            isOnDelivery: false,
            currentOrderId: null,
            status: 'online',
            lastUpdated: new Date(),
          },
        },
        { new: true },
      );
    } catch (error) {
      this.logger.error(`Error completing delivery: ${error.message}`);
      throw error;
    }
  }
}
