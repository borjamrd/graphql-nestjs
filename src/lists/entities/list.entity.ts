import { ObjectType, Field, Int, ID } from '@nestjs/graphql';
import { Min } from 'class-validator';
import { Item } from 'src/items/entities/item.entity';
import { User } from 'src/users/entities/user.entity';
import { Column, Entity, Index, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';


@Entity({ name: 'lists' })
@ObjectType()
export class List {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => ID)
  id: string

  @Field(() => String)
  @Min(3)
  @Column()
  name: string

  @ManyToOne(() => User, (user) => user.lists, { nullable: false })
  @Index('userId-list-index')
  @Field(() => User, { nullable: false })
  user: User


  @OneToMany(() => Item, item => item.list, { lazy: true, nullable: true })
  items?: Item[]
}
