import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateListInput } from './dto/input/create-list.input';
import { UpdateListInput } from './dto/input/update-list.input';
import { List } from './entities/list.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { PaginationArgs, SearchArgs } from 'src/common/dto/args';

@Injectable()
export class ListsService {

  constructor(
    @InjectRepository(List) private readonly listRepository: Repository<List>
  ) {

  }
  async create(createListInput: CreateListInput, createdBy: User): Promise<List> {
    const newList = this.listRepository.create({ ...createListInput, user: createdBy });
    await this.listRepository.save(newList);
    return newList
  }

  async findAll(user: User, paginationArgs: PaginationArgs, searchArsg: SearchArgs): Promise<List[]> {

    const { limit, offset } = paginationArgs;
    const { search } = searchArsg;

    const queryBuilder = this.listRepository.createQueryBuilder()
      .take(limit)
      .skip(offset)
      .where(`"userId"=:userId`, { userId: user.id })

    if (search) {
      queryBuilder.andWhere('LOWER(name) like :name', { name: `%${search.toLowerCase()}%` });
    }
    return queryBuilder.getMany();
  }

  async findOne(id: string, user: User): Promise<List> {
    const list = await this.listRepository.findOneBy({
      id,
      user: {
        id: user.id
      }
    })
    if (!list) throw new NotFoundException(`List with id ${id} not found`);
    return list
  }


  async update(id: List['id'], updateListInput: UpdateListInput, user: User): Promise<List> {
    await this.findOne(id, user);

    const list = await this.listRepository.preload({
      ...updateListInput
    })
    if (!list) throw new NotFoundException(`List with id ${id} not found`);
    return this.listRepository.save(list);

  }

  async remove(id: List['id'], user: User): Promise<List> {
    const item = await this.listRepository.findOneBy({
      id,
      user: {
        id: user.id
      }
    });
    if (!item) throw new NotFoundException(`List with id ${id} not found`);
    try {
      await this.listRepository.remove(item);
      return item;
    } catch (error) {
      throw new Error('Error removing list');
    }
  }

  async countByUser(user: User): Promise<number> {
    return this.listRepository.count({
      where: { user: { id: user.id } }
    })
  }

}
