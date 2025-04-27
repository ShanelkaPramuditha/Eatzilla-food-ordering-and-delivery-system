import { Module } from '@nestjs/common';
import { DatabaseModule } from '@app/common';
import { MenuItemService } from './menu.service';
import { MenuItemController } from './menu.controller';
import { MenuItem, MenuItemSchema } from './schemas/menu-item.schema';

@Module({
  imports: [DatabaseModule.forFeature([{ name: MenuItem.name, schema: MenuItemSchema }])],
  controllers: [MenuItemController],
  providers: [MenuItemService],
})
export class MenuModule {}
