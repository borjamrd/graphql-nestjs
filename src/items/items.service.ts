import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateItemInput, UpdateItemInput } from './dto/input';
import { Item } from './entities/item.entity';
import { User } from 'src/users/entities/user.entity';
import { PaginationArgs } from 'src/common/dto/args/pagination.args';

@Injectable()
export class ItemsService {
  constructor(
    @InjectRepository(Item) private readonly itemsRepository: Repository<Item>,
  ) { }
  async create(createItemInput: CreateItemInput, createdBy: User): Promise<Item> {
    const newItem = this.itemsRepository.create({ ...createItemInput, user: createdBy });
    await this.itemsRepository.save(newItem);
    return newItem;
  }

  async findAll(user: User, paginationArgs: PaginationArgs): Promise<Item[]> {

    const { limit, offset } = paginationArgs;
    const items = await this.itemsRepository.find(
      {
        where: {
          user: {
            id: user.id
          }
        },
        take: limit,
        skip: offset
      }
    );
    return items;
  }

  async findOne(id: string, user: User): Promise<Item> {
    const item = this.itemsRepository.findOneBy({
      id,
      user: {
        id: user.id
      }
    });
    if (!item) throw new NotFoundException(`Item with id ${id} not found`);
    return item;
  }

  async update(id: string, updateItemInput: UpdateItemInput, user: User): Promise<Item> {

    await this.findOne(id, user);
    const item = await this.itemsRepository.preload({
      ...updateItemInput
    });
    if (!item) throw new NotFoundException(`Item with id ${id} not found`);
    return this.itemsRepository.save(item);
  }

  async remove(id: string, user: User): Promise<Item> {
    //TODO soft delete, integridad referencial

    const item = await this.itemsRepository.findOneBy({ id, user: { id: user.id } });
    if (!item) throw new NotFoundException(`Item with id ${id} not found`);
    try {
      await this.itemsRepository.remove(item);
      return { ...item, id };
    } catch (error) {
      throw new Error(error);
    }
  }

  async countByUser(user: User): Promise<number> {
    return this.itemsRepository.count(
      {
        where: { user: { id: user.id } }
      }
    );
  }
}
