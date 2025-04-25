import { Controller } from '@nestjs/common';
import { RestaurantService } from '../services/restaurant.service';

@Controller()
export class RestaurantController {
  constructor(private readonly restaurantService: RestaurantService) {}
}
