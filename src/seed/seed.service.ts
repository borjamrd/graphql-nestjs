import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Item } from 'src/items/entities/item.entity';
import { User } from 'src/users/entities/user.entity';

import { SEED_ITEMS, SEED_USERS } from './data/seed-data';

import { UsersService } from 'src/users/users.service';
import { ItemsService } from 'src/items/items.service';

@Injectable()
export class SeedService {
    private isProd: boolean
    constructor(
        private readonly configService: ConfigService,
        @InjectRepository(Item)
        private readonly itemRepository: Repository<Item>,
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        private readonly usersService: UsersService,
        private readonly itemsService: ItemsService

    ) {
        this.isProd = this.configService.get('STATE') === 'prod';
    }

    async executeSeed(): Promise<boolean> {

        if (this.isProd) {
            throw new UnauthorizedException('We cannot run SEED in production');
        }

        await this.deleteDatabase()
        const users = await this.loadUsers()
        await this.loadItems(users)

        return true;
    }

    async deleteDatabase() {

        this.itemRepository.createQueryBuilder().delete().where({}).execute();
        this.userRepository.createQueryBuilder().delete().where({}).execute();

    }

    async loadUsers(): Promise<User[]> {
        const users = []

        for (const user of SEED_USERS) {
            users.push(await this.usersService.create(user))
        }

        return users
    }

    async loadItems(users: User[]): Promise<Item[]> {
        const itemsPromises = []

        for (const item of SEED_ITEMS) {
            const randomIndex = Math.floor(Math.random() * users.length);
            const user = users[randomIndex];
            itemsPromises.push(this.itemsService.create(item, user))
        }

        return Promise.all(itemsPromises)
    }
}
