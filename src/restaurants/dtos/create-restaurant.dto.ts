import { CoreOutput } from './../../common/dtos/output.dto';
import { Restaurant } from './../entities/restaurants.entity';
import { InputType, ObjectType, OmitType } from '@nestjs/graphql';

@InputType()
export class CreateRestaurantInput extends OmitType(Restaurant, [
  'id',
  'category',
]) {}

@ObjectType()
export class CreateRestaurantOutput extends CoreOutput {}
