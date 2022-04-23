import { RestaurantsService } from './restaurants.service';
import { CreateRestaurantDto } from './dtos/create-restaurants.dto';
import { Restaurant } from './entities/restaurants.entity';
import { Resolver, Query, Args, Mutation } from '@nestjs/graphql';

@Resolver((of) => Restaurant)
export class RestaurantsResolver {
  constructor(private readonly restaurantsService: RestaurantsService) {}

  @Query((returns) => Restaurant)
  restaurants(): Promise<Restaurant[]> {
    return this.restaurantsService.getAll();
  }

  @Mutation((returns) => Boolean)
  async createRestaurant(
    @Args('input') createRestaurantDto: CreateRestaurantDto,
  ): Promise<boolean> {
    try {
      await this.restaurantsService.createRestaurant(createRestaurantDto);
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  }
}
