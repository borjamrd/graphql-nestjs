import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Item } from 'src/items/entities/item.entity';
import { User } from 'src/users/entities/user.entity';

import { SEED_ITEMS, SEED_LISTS, SEED_USERS } from './data/seed-data';

import { UsersService } from 'src/users/users.service';
import { ItemsService } from 'src/items/items.service';

import { ListItem } from 'src/list-item/entities/list-item.entity';
import { List } from 'src/lists/entities/list.entity';
import { ListsService } from 'src/lists/lists.service';
import { ListItemService } from 'src/list-item/list-item.service';

@Injectable()
export class SeedService {
    private isProd: boolean
    constructor(
        private readonly configService: ConfigService,

        @InjectRepository(ListItem)
        private readonly listItemRepository: Repository<ListItem>,

        @InjectRepository(Item)
        private readonly itemRepository: Repository<Item>,

        @InjectRepository(List)
        private readonly listRepository: Repository<List>,

        @InjectRepository(User)
        private readonly userRepository: Repository<User>,

        private readonly usersService: UsersService,
        private readonly itemsService: ItemsService,
        private readonly listsService: ListsService,
        private readonly listItemsService: ListItemService,

    ) {
        this.isProd = this.configService.get('STATE') === 'prod';
    }

    async executeSeed(): Promise<boolean> {

        if (this.isProd) {
            throw new UnauthorizedException('We cannot run SEED in production');
        }

        await this.deleteDatabase()
        const users = await this.loadUsers()
        const items = await this.loadItems(users)
        const lists = await this.loadLists(users)
        await this.loadListItems(items, lists, users)
        //crear listas de items

        return true;
    }

    async deleteDatabase() {

        await this.listItemRepository.createQueryBuilder().delete().where({}).execute();
        await this.listRepository.createQueryBuilder().delete().where({}).execute();
        await this.itemRepository.createQueryBuilder().delete().where({}).execute();
        await this.userRepository.createQueryBuilder().delete().where({}).execute();

    }

    async loadUsers(): Promise<User[]> {
        const users = []

        for (const user of SEED_USERS) {
            users.push(await this.usersService.create(user))
        }

        return users
    }

    async loadLists(users: User[]): Promise<List[]> {
        const listPromises = []

        for (const list of SEED_LISTS) {
            const randomIndex = Math.floor(Math.random() * users.length);
            const user = users[randomIndex];
            listPromises.push(this.listsService.create(list, user))
        }

        return Promise.all(listPromises)
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

    async loadListItems(items: Item[], lists: List[], users: User[]) {
        const listItemPromises = []
        let randomIndex: number;
        let item: Item;
        let user: User;
        const idsUsed = []
        for (const list of lists) {
            do {
                randomIndex = Math.floor(Math.random() * items.length);
                item = items[randomIndex];
            } while (idsUsed.includes(item.id))
            user = users[randomIndex];
            idsUsed.push(item.id)
            listItemPromises.push(this.listItemsService.create({
                itemId: item.id,
                listId: list.id,
                quantity: Math.floor(Math.random() * 10),
                completed: Math.random() > 0.5
            }, user))
        }
        await Promise.all(listItemPromises)
    }

}
