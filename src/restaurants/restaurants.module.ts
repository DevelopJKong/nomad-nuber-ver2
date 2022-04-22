import { RestaurantsService } from './restaurants.service';
import { Restaurant } from './entities/restaurants.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RestaurantsResolver } from './restaurants.resolver';
import { Module } from '@nestjs/common';

@Module({
    imports:[TypeOrmModule.forFeature([Restaurant])],
    providers:[RestaurantsResolver,RestaurantsService]
})
export class RestaurantsModule {}
