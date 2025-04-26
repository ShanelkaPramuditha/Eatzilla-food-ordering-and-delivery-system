import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { RestaurantService } from './restaurant.service';

@Controller()
export class RestaurantController {
  constructor(private readonly restaurantService: RestaurantService) {}

  @MessagePattern({ cmd: 'post.restaurant' })
  create(@Payload() restaurant: any) {
    return this.restaurantService.create(restaurant);
  }

  @MessagePattern({ cmd: 'put.restaurant' })
  update(@Payload() payload: { id: string; restaurant: any }) {
    const { id, restaurant } = payload;
    return this.restaurantService.update(id, restaurant);
  }

  @MessagePattern({ cmd: 'delete.restaurant' })
  delete(@Payload() id: string) {
    return this.restaurantService.delete(id);
  }

  @MessagePattern({ cmd: 'get.restaurant' })
  findById(@Payload() id: string) {
    return this.restaurantService.findById(id);
  }

  @MessagePattern({ cmd: 'get.restaurants' })
  findAll() {
    return this.restaurantService.findAll();
  }
}
