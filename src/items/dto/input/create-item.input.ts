import { Field, Float, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsOptional, IsPositive, IsString } from 'class-validator';

@InputType()
export class CreateItemInput {
  @Field(() => String)
  @IsNotEmpty()
  @IsString()
  name: string;

  @Field(() => Float)
  @IsPositive()
  quantity: number;

  @IsString()
  @IsOptional()
  @Field(() => String, { nullable: true })
  quantityUnits?: string;
}
