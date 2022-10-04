import {
  DeleteRestaurantInput,
  DeleteRestaurantOutput,
} from './dtos/delete-restaurant.dto';
import { CategoryRepository } from './repositories/category.repsository';
import { LoggerService } from './../logger/logger.service';
import {
  EditRestaurantOutput,
  EditRestaurantInput,
} from './dtos/edit-restaurant.dto';
import { Category } from './entities/category.entity';
import { User } from './../users/entities/user.entity';
import {
  CreateRestaurantInput,
  CreateRestaurantOutput,
} from './dtos/create-restaurant.dto';
import { Restaurant } from './entities/restaurants.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AllCategoriesOutput } from './dtos/all-categories.dto';
import { CategoryOutput, CategoryInput } from './dtos/category.dto';

@Injectable()
export class RestaurantsService {
  constructor(
    @InjectRepository(Restaurant)
    private readonly restaurants: Repository<Restaurant>,
    @InjectRepository(Category)
    private readonly categories: CategoryRepository,
    private readonly loggerService: LoggerService,
  ) {}

  async createRestaurant(
    owner: User,
    createRestaurantInput: CreateRestaurantInput,
  ): Promise<CreateRestaurantOutput> {
    try {
      const newRestaurant = this.restaurants.create(createRestaurantInput);
      newRestaurant.owner = owner;

      //TODO 애초에 Category가 배열로 들어가는 경우가 있을까?
      const category: Category = (await this.categories.getOrCreateCategory(
        createRestaurantInput.categoryName,
      )) as Category;
      newRestaurant.category = category;
      await this.restaurants.save(newRestaurant);
      return {
        ok: true,
      };
    } catch (error) {
      return {
        ok: false,
        error: 'Could not create restaurant',
      };
    }
  }

  async editRestaurant(
    owner: User,
    editRestaurantInput: EditRestaurantInput,
  ): Promise<EditRestaurantOutput> {
    try {
      const restaurant = await this.restaurants.findOne({
        where: {
          ownerId: editRestaurantInput.restaurantId,
        },
      });

      if (!restaurant) {
        //! 레스토랑 데이터가 존재하지 않습니다
        this.loggerService
          .logger()
          .error(`${this.loggerService.loggerInfo()} 레스토랑 데이터가 미존재`);
        return {
          ok: false,
          error: 'Restaurant not found',
        };
      }

      if (owner.id !== restaurant.ownerId) {
        //! 유저 아이디와 레스트랑의 유저 아이디가 불일치 할 경우
        this.loggerService
          .logger()
          .error(
            `${this.loggerService.loggerInfo()} 유저 아이디와 레스트랑의 유저 아이디가 불일치`,
          );
        return {
          ok: false,
          error: "You can't edit a restaurant that you don't own",
        };
      }
      let category: Category = null;
      if (editRestaurantInput.categoryName) {
        category = await this.categories.getOrCreateCategory(
          editRestaurantInput.categoryName,
        );
      }

      await this.restaurants.save([
        {
          id: editRestaurantInput.restaurantId,
          ...editRestaurantInput,
          ...(category && { category }),
        },
      ]);

      //* success
      this.loggerService
        .logger()
        .error(`${this.loggerService.loggerInfo()} 레스토랑 편집 성공`);
      return {
        ok: true,
      };
    } catch (error) {
      //! extraError
      this.loggerService
        .logger()
        .error(`${this.loggerService.loggerInfo()} extra Error`);
      return {
        ok: false,
        error: 'Could not edit Restaurant',
      };
    }
  }

  //TODO 체크하는 funciton 새롭게 만들기 [Code 챌린지]
  async deleteRestaurant(
    owner: User,
    { restaurantId }: DeleteRestaurantInput,
  ): Promise<DeleteRestaurantOutput> {
    try {
      const restaurant = await this.restaurants.findOne({
        where: {
          ownerId: restaurantId,
        },
      });

      if (!restaurant) {
        return {
          ok: false,
          error: 'Restaurant not found',
        };
      }

      if (owner.id !== restaurant.ownerId) {
        return {
          ok: false,
          error: 'You cant delete a restaurant that you dont own',
        };
      }

      await this.restaurants.delete(restaurantId);

      return {
        ok: true,
      };
    } catch (error) {
      return {
        ok: false,
        error: 'Could not delete restaurant',
      };
    }
  }

  async allCategories(): Promise<AllCategoriesOutput> {
    try {
      const categories = await this.categories.find();
      return {
        ok: true,
        categories,
      };
    } catch (error) {
      return {
        ok: false,
        error: 'Could not load categories',
      };
    }
  }

  async countRestaurants(category: Category) {
    const count = this.restaurants.count({
      //TODO 정확하게 파악하기
      //! 정상 작동하는 거 확인 완료
      where: {
        category: {
          slug: category.slug,
        },
      },
    });
    return count;
  }

  async findCategoryBySlug({
    slug,
    page,
  }: CategoryInput): Promise<CategoryOutput> {
    try {
      const category = await this.categories.findOne({
        where: {
          slug,
        },
      });

      if (!category) {
        return {
          ok: false,
          error: 'Category not found',
        };
      }

      const restaurants = await this.restaurants.find({
        where: {
          category: {
            slug: category.slug,
          },
        },
        take: 25,
        skip: (page - 1) * 25,
      });

      category.restaurants = restaurants;
      const totalResults = await this.countRestaurants(category);
      return {
        ok: true,
        category,
        totalPages: Math.ceil(totalResults / 25),
      };
    } catch (error) {
      return {
        ok: false,
        error: 'Could not load category',
      };
    }
  }
}
