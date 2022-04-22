import { CreateRestaurantDto } from './dtos/create-restaurants.dto';
import { Restaurant } from './entities/restaurants.entity';
import { Resolver, Query, Args, Mutation } from '@nestjs/graphql';

@Resolver(of => Restaurant)
export class RestaurantsResolver {
  @Query(returns => Restaurant)
  restaurants(@Args('veganOnly') veganOnly:boolean):Restaurant[] {
      return [];
  }
  @Mutation(returns => Restaurant)
  createRestaurant(@Args('createRestaurantDto') createRestaurantDto:CreateRestaurantDto) {

      return true;
  }
}
