import { CoreOutput } from './../../common/dtos/output.dto';
import { Restaurant } from './../entities/restaurants.entity';
import { Field, InputType, ObjectType, PickType } from '@nestjs/graphql';

@InputType()
export class CreateRestaurantInput extends PickType(Restaurant, [
  'name',
  'address',
  'coverImg',
]) {
  @Field(type => String)
  categoryName:string
}

@ObjectType()
export class CreateRestaurantOutput extends CoreOutput {}
