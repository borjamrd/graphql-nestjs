import { ConfigModule } from '@nestjs/config';
import { ItemsModule } from 'src/items/items.module';
import { Module } from '@nestjs/common';
import { UsersModule } from 'src/users/users.module';
import { SeedService } from './seed.service';
import { SeedResolver } from './seed.resolver';
import { ListsModule } from 'src/lists/lists.module';
import { ListItemModule } from 'src/list-item/list-item.module';

@Module({
  providers: [SeedResolver, SeedService],
  imports: [
    ConfigModule,
    ItemsModule,
    ListItemModule,
    ListsModule,
    UsersModule,
  ],
})
export class SeedModule { }
