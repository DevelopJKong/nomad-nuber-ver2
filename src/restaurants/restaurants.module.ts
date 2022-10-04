import { RestaurantsService } from './restaurants.service';
import { Restaurant } from './entities/restaurants.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoryResolver, RestaurantsResolver } from './restaurants.resolver';
import { Module } from '@nestjs/common';
import { Category } from './entities/category.entity';
import { provideCustomRepository } from 'src/common/custom-repository';
import { CategoryRepository } from './repositories/category.repsository';

@Module({
  imports: [TypeOrmModule.forFeature([Restaurant, Category])],
  providers: [
    provideCustomRepository(Category, CategoryRepository),
    CategoryResolver,
    RestaurantsResolver,
    RestaurantsService,
  ],
})
export class RestaurantsModule {}
