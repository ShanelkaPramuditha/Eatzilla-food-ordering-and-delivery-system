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

  async update(id: string, restaurant: any) {
    return this.restaurantModel.findByIdAndUpdate(id, restaurant, { new: true });
  }

  async delete(id: string) {
    return this.restaurantModel.findByIdAndDelete(id);
  }

  async findById(id: string) {
    return this.restaurantModel.findById(id);
  }

  async findAll() {
    return this.restaurantModel.find();
  }
}
