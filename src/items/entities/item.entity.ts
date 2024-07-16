import { Field, ID, Int, ObjectType } from '@nestjs/graphql';
import { IsOptional } from 'class-validator';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'items' })
@ObjectType()
export class Item {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => ID)
  id: string;

  @Field(() => String)
  @Column()
  name: string;

  @Field(() => Int)
  @Column()
  quantity: number;

  @Field(() => String, { nullable: true })
  @Column({ nullable: true })
  quantityUnits?: string;
}
