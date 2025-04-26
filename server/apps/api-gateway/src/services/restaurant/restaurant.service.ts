import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class RestaurantService {
  constructor(@Inject('RESTAURANT_SERVICE') private readonly restaurantClient: ClientProxy) {}

  // Create a new restaurant
  create(restaurant: any) {
    return this.restaurantClient.send({ cmd: 'post.restaurant' }, restaurant);
  }

  // Update a restaurant's information
  update(id: string, restaurant: any) {
    return this.restaurantClient.send({ cmd: 'put.restaurant' }, { id, restaurant });
  }

  // Delete a restaurant by its ID
  delete(id: string) {
    return this.restaurantClient.send({ cmd: 'delete.restaurant' }, id);
  }

  // Get a specific restaurant's details by its ID
  findtById(id: string) {
    return this.restaurantClient.send({ cmd: 'get.restaurant' }, id);
  }

  // Get a list of all restaurants
  findAll() {
    return this.restaurantClient.send({ cmd: 'get.restaurants' }, {});
  }
}
