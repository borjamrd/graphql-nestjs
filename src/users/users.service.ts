import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { SignUpInput } from 'src/auth/dto/inputs';
import { Repository } from 'typeorm';
import { UpdateUserInput } from './dto/update-user.input';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcryptjs';
import { ValidRoles } from 'src/auth/enum/valid-roles.enum';

@Injectable()
export class UsersService {
  private logger = new Logger('UsersService');
  constructor(
    @InjectRepository(User) private readonly usersRepository: Repository<User>,
  ) { }
  async create(signupInput: SignUpInput): Promise<User> {
    try {
      const newUser = this.usersRepository.create({
        ...signupInput,
        password: bcrypt.hashSync(signupInput.password, 10),
      });
      await this.usersRepository.save(newUser);
      return newUser;
    } catch (error) {
      this.handleDBError(error);
    }
  }

  async findAll(roles: ValidRoles[]): Promise<User[]> {
    if (roles.length === 0) return await this.usersRepository.find();

    return await this.usersRepository
      .createQueryBuilder('user')
      .andWhere('ARRAY[roles] && ARRAY[:...roles]')
      .setParameter('roles', roles)
      .getMany()
  }

  async findOneById(id: string): Promise<User> {
    try {
      return await this.usersRepository.findOneByOrFail({ id });
    } catch (error) {
      this.handleDBError({
        code: 'error_02',
        detail: `Key (id)=(${id}) is not present in table "user"`,
      });
    }
  }
  async findOneByEmail(email: string): Promise<User> {
    try {
      return await this.usersRepository.findOneByOrFail({ email: email });
    } catch (error) {
      this.handleDBError({
        code: 'error_01',
        detail: `Key (email)=(${email}) is not present in table "user"`,
      });
    }
  }

  async update(updateUserInput: UpdateUserInput, updatedby: User): Promise<User> {
    try {
      const userToUpdate = await this.usersRepository.preload({
        id: updateUserInput.id,
        ...updateUserInput,
      })
      userToUpdate.lastUpdatedBy = updatedby
      return await this.usersRepository.save(userToUpdate);
    } catch (error) {
      this.handleDBError({
        code: 'error_03',
        detail: `User with key (id)=(${updateUserInput.id}) has not been updated`,
      });
    }
  }

  async block(id: string, userAdmin: User): Promise<User> {
    const userToBlock = await this.findOneById(id);
    userToBlock.isActive = false;
    if (userToBlock.id === userAdmin.id) {
      throw new BadRequestException('You cannot block yourself');
    }
    userToBlock.lastUpdatedBy = userAdmin
    return await this.usersRepository.save(userToBlock);
  }

  private handleDBError(error: any): never {
    if (error.code === '23505') {
      throw new BadRequestException(
        'User already exists: ' +
        JSON.stringify(error.detail.replace('Key ', ' ')),
      );
    }
    if (error.code === '23503') {
      throw new BadRequestException(
        'User not found: ' + JSON.stringify(error.detail.replace('Key ', ' ')),
      );
    }
    if (error.code === 'error_01') {
      throw new BadRequestException(
        'User not found: ' + JSON.stringify(error.detail.replace('Key ', ' ')),
      );
    }
    if (error.code === 'error_03') {
      throw new BadRequestException(
        'User not updated: ' + JSON.stringify(error.detail.replace('Key ', ' ')),
      );
    }

    this.logger.error(error);
    throw new InternalServerErrorException('Internal server error');
  }
}
