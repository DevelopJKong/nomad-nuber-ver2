import { User } from './../users/entities/user.entity';
import { RestaurantsService } from './restaurants.service';
import { Restaurant } from './entities/restaurants.entity';
import { Resolver, Query, Args, Mutation } from '@nestjs/graphql';
import {
  CreateRestaurantInput,
  CreateRestaurantOutput,
} from './dtos/create-restaurant.dto';
import { AuthUser } from 'src/auth/auth-user.decorator';

@Resolver((of) => Restaurant)
export class RestaurantsResolver {
  constructor(private readonly restaurantsService: RestaurantsService) {}

  @Mutation((returns) => Boolean)
  async createRestaurant(
    @AuthUser() owner: User,
    @Args('input') createRestaurantInput: CreateRestaurantInput,
  ): Promise<CreateRestaurantOutput> {
    return this.restaurantsService.createRestaurant(
      owner,
      createRestaurantInput,
    );
  }
}
