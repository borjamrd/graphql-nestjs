import { Field, ID, InputType, PartialType } from '@nestjs/graphql';
import { IsUUID, IsBoolean, IsArray, IsOptional } from 'class-validator';
import { ValidRoles } from 'src/auth/enum/valid-roles.enum';
import { CreateUserInput } from './create-user.input';

@InputType()
export class UpdateUserInput extends PartialType(CreateUserInput) {
  @Field(() => ID)
  @IsUUID()
  id: string;

  @Field(() => [ValidRoles], { nullable: true })
  @IsArray()
  @IsOptional()
  roles?: ValidRoles[];

  @Field(() => Boolean, { nullable: true })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean


  @Field(() => String, { nullable: true })
  @IsOptional()
  test: string;
}
