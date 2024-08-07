import { Field, ID, ObjectType } from '@nestjs/graphql';
import { List } from 'src/lists/entities/list.entity';
import { User } from 'src/users/entities/user.entity';
import { Column, Entity, Index, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

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


  @ManyToOne(() => List, list => list.items, { nullable: true, lazy: true })
  @Index('listId-index')
  @Field(() => List, { nullable: true })
  list: List



}
