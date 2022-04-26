import { Restaurant } from '../entities/restaurants.entity';
import { InputType, OmitType } from '@nestjs/graphql';

@InputType()
export class CreateRestaurantDto extends OmitType(Restaurant, ['id']) {}
