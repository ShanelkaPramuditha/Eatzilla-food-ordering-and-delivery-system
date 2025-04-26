import { Controller, Param, Body, Get, Post, Put, Delete } from '@nestjs/common';
import { RestaurantService } from './restaurant.service';
import { Restaurant } from './validations/restaurant.validation';

@Controller('restaurants')
export class RestaurantController {
  constructor(private readonly restaurantService: RestaurantService) {}

  @Post()
  createRestaurant(@Body() restaurant: Restaurant) {
    return this.restaurantService.create(restaurant);
  }

  @Put(':id')
  updateRestaurant(@Param('id') id: string, @Body() restaurant: Restaurant) {
    return this.restaurantService.update(id, restaurant);
  }

  @Delete(':id')
  deleteRestaurant(@Param('id') id: string) {
    return this.restaurantService.delete(id);
  }
  @Get(':id')
  getRestaurant(@Param('id') id: string) {
    return this.restaurantService.findtById(id);
  }
  @Get()
  getRestaurants() {
    return this.restaurantService.findAll();
  }
}
