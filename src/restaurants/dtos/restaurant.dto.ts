import { Restaurant } from './../entities/restaurants.entity';
import { CoreOutput } from './../../common/dtos/output.dto';
import { Field, InputType, Int, ObjectType } from '@nestjs/graphql';

@InputType()
export class RestaurantInput {
  @Field((type) => Int)
  restaurantId: number;
}

@ObjectType()
export class RestaurantOutput extends CoreOutput {
  @Field((type) => Restaurant, { nullable: true })
  restaurant?: Restaurant;
}
