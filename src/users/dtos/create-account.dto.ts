import { User } from './../entities/user.entity';
import { Field, ObjectType, PickType, InputType } from '@nestjs/graphql';

@InputType() 
export class CreatAccountInput extends PickType(User, [
  'email',
  'password',
  'role',
]) {}

@ObjectType()
export class CreateAccountOutput {
  @Field((type) => String, { nullable: true })
  error?: string;

  @Field((type) => Boolean)
  ok: boolean;
}
