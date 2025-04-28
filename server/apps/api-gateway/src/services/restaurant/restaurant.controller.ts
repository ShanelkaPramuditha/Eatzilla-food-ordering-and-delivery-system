import { Controller, Param, Body, Get, Post, Put, Delete, Req, Patch, Query } from '@nestjs/common';
import { RestaurantService } from './restaurant.service';
import { Restaurant } from './validations/restaurant.validation';
import { MenuItem } from './validations/menu-item.validation';

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

  @Get('/menu')
  getAllMenuItems() {
    return this.restaurantService.findAllMenuItems();
  }

  @Get(':id')
  getRestaurant(@Param('id') id: string) {
    return this.restaurantService.findById(id);
  }

  @Get()
  getRestaurants() {
    return this.restaurantService.findAll();
  }

  @Post(':restaurantId/menu')
  createMenuItem(@Param('restaurantId') restaurant: string, @Body() menuItem: MenuItem) {
    return this.restaurantService.createMenuItem({ ...menuItem, restaurant });
  }

  @Put(':restaurantId/menu/:id')
  updateMenuItem(@Param('id') id: string, @Body() menuItem: MenuItem) {
    return this.restaurantService.updateMenuItem(id, menuItem);
  }

  @Delete(':restaurantId/menu/:id')
  deleteMenuItem(@Param('restaurantId') restaurant: string, @Param('id') id: string) {
    return this.restaurantService.deleteMenuItem(id);
  }

  @Get(':restaurantId/menu/:id')
  getMenuItem(@Param('id') id: string, @Param('restaurantId') restaurantId: string) {
    return this.restaurantService.findMenuItemById(id);
  }

  @Get(':restaurantId/menu')
  getMenuItems(@Param('restaurantId') restaurantId: string) {
    return this.restaurantService.findMenuItems(restaurantId);
  }
}
