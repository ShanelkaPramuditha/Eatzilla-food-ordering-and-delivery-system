import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { MenuItem } from './schemas/menu-item.schema';

@Injectable()
export class MenuItemService {
  constructor(@InjectModel(MenuItem.name) private menuItemModel: Model<MenuItem>) {}

  async create(menuItem: any) {
    return new this.menuItemModel(menuItem).save();
  }

  async update(id: string, menuItem: any) {
    return this.menuItemModel.findByIdAndUpdate(id, menuItem, { new: true });
  }

  async delete(id: string) {
    return this.menuItemModel.findByIdAndDelete(id);
  }

  async findById(id: string) {
    return this.menuItemModel.findById(id);
  }

  async findAll(id: string) {
    return this.menuItemModel.find({ restaurant: id });
  }
}
