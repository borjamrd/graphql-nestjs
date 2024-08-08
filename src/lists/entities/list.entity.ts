import { Field, ID, ObjectType } from '@nestjs/graphql';
import { IsOptional, Min } from 'class-validator';
import { Item } from 'src/items/entities/item.entity';
import { ListItem } from 'src/list-item/entities/list-item.entity';
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

  @Field(() => String, { nullable: true })
  @IsOptional()
  @Column({
    nullable: true
  })
  description?: string

  @ManyToOne(() => User, (user) => user.lists, { nullable: false })
  @Index('userId-list-index')
  @Field(() => User, { nullable: false })
  user: User

  @OneToMany(() => ListItem, listItem => listItem.list, { lazy: true })
  listItem?: ListItem[]
}
