import { Field, ID, ObjectType } from '@nestjs/graphql';
import { IsString } from 'class-validator';
import { Item } from 'src/items/entities/item.entity';
import { List } from 'src/lists/entities/list.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn, Unique } from 'typeorm';


@Entity('listItems')
@ObjectType()
export class ListItem {

  @PrimaryGeneratedColumn('uuid')
  @Field(() => ID)
  @IsString()
  id: string;


  @Column({ type: 'numeric' })
  @Field(() => Number)
  quantity: number;

  @Column({ type: 'boolean' })
  @Field(() => Boolean)
  completed: boolean;

  @ManyToOne(() => List, list => list.listItem, { lazy: true })
  list: List

  @ManyToOne(() => Item, item => item.listItem, { lazy: true })
  @Field(() => Item)
  @Unique('listItem-item', ['list', 'item'])
  item: Item
}
