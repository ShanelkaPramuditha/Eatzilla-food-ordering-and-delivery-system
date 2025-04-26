import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Restaurant } from './schemas/restaurant.schema';

@Injectable()
export class RestaurantService {
  constructor(@InjectModel(Restaurant.name) private restaurantModel: Model<Restaurant>) {}

  async create(restaurant: any) {
    return new this.restaurantModel(restaurant).save();
  }

  async update(restaurant: any) {
    return new this.restaurantModel(restaurant).save();
  }

  async delete(id: string) {
    return this.restaurantModel.findByIdAndDelete(id);
  }

  async findById(id: string) {
    return { statusCode: 404 };
  }

  async findAll() {
    return this.restaurantModel.find();
  }
}
