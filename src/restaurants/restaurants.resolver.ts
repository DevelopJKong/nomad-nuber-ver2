import { AllCategoriesOutput } from './dtos/all-categories.dto';
import { Category } from './entities/category.entity';
import { User } from './../users/entities/user.entity';
import { RestaurantsService } from './restaurants.service';
import { Restaurant } from './entities/restaurants.entity';
import {
  Resolver,
  Args,
  Mutation,
  Query,
  Int,
  ResolveField,
  Parent,
} from '@nestjs/graphql';
import {
  CreateRestaurantInput,
  CreateRestaurantOutput,
} from './dtos/create-restaurant.dto';
import { AuthUser } from 'src/auth/auth-user.decorator';
import { Role } from 'src/auth/role.decorator';
import {
  EditRestaurantOutput,
  EditRestaurantInput,
} from './dtos/edit-restaurant.dto';
import {
  DeleteRestaurantInput,
  DeleteRestaurantOutput,
} from './dtos/delete-restaurant.dto';

@Resolver((of) => Restaurant)
export class RestaurantsResolver {
  constructor(private readonly restaurantsService: RestaurantsService) {}

  @Mutation((returns) => CreateRestaurantOutput)
  @Role(['Owner'])
  async createRestaurant(
    @AuthUser() owner: User,
    @Args('input') createRestaurantInput: CreateRestaurantInput,
  ): Promise<CreateRestaurantOutput> {
    return this.restaurantsService.createRestaurant(
      owner,
      createRestaurantInput,
    );
  }

  @Mutation((returns) => EditRestaurantOutput)
  @Role(['Owner'])
  editRestaurant(
    @AuthUser() owner: User,
    @Args('input') editRestaurantInput: EditRestaurantInput,
  ): Promise<EditRestaurantOutput> {
    return this.restaurantsService.editRestaurant(owner, editRestaurantInput);
  }

  @Mutation((returns) => DeleteRestaurantOutput)
  @Role(['Owner'])
  deleteRestaurant(
    @AuthUser() owner: User,
    @Args('input') deleteRestaurantInput: DeleteRestaurantInput,
  ): Promise<DeleteRestaurantOutput> {
    return;
  }
}

@Resolver((of) => Category)
export class CategoryResolver {
  constructor(private readonly restaurantsService: RestaurantsService) {}

  @ResolveField((type) => Int)
  restaurantCount(@Parent() category: Category): Promise<number> {
    return this.restaurantsService.countRestaurants(category);
  }

  @Query((type) => AllCategoriesOutput)
  allCategories(): Promise<AllCategoriesOutput> {
    return this.restaurantsService.allCategories();
  }
}
