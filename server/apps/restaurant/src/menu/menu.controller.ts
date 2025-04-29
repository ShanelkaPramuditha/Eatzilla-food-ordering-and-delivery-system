import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { MenuItemService } from './menu.service';

@Controller()
export class MenuItemController {
  constructor(private readonly menuItemService: MenuItemService) {}

  @MessagePattern({ cmd: 'post.menu-item' })
  create(@Payload() menuItem: any) {
    return this.menuItemService.create(menuItem);
  }

  @MessagePattern({ cmd: 'put.menu-item' })
  update(@Payload() payload: { id: string; menuItem: any }) {
    const { id, menuItem } = payload;
    return this.menuItemService.update(id, menuItem);
  }

  @MessagePattern({ cmd: 'delete.menu-item' })
  delete(@Payload() id: string) {
    return this.menuItemService.delete(id);
  }

  @MessagePattern({ cmd: 'get.menu-item' })
  findById(@Payload() id: string) {
    return this.menuItemService.findById(id);
  }

  @MessagePattern({ cmd: 'get.restaurant.menu' })
  findAllByRestaurant(@Payload() id: string) {
    return this.menuItemService.findAllByRestaurant(id);
  }

  @MessagePattern({ cmd: 'get.menu' })
  findAll() {
    return this.menuItemService.findAll();
  }
}
