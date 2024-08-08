import { Field, ID, ObjectType } from '@nestjs/graphql';
import { ListItem } from 'src/list-item/entities/list-item.entity';
import { User } from 'src/users/entities/user.entity';
import { Column, Entity, Index, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'items' })
@ObjectType()
export class Item {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => ID)
  id: string;

  @Field(() => String)
  @Column()
  name: string;


  @Field(() => String, { nullable: true })
  @Column({ nullable: true })
  quantityUnits?: string;


  @ManyToOne(() => User, (user) => user.items, { nullable: false, lazy: true })
  @Index('userId-index')
  @Field(() => User, { nullable: false })
  user: User


  @OneToMany(() => ListItem, listItem => listItem.item, { lazy: true })
  @Field(() => [ListItem])
  listItem?: ListItem[]



}
