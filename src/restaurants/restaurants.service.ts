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
      let category: Category | Category[] = null;
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
}
