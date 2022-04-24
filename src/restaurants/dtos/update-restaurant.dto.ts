import { CreateRestaurantDto } from './create-restaurant.dto';
import { ArgsType, Field, InputType, PartialType } from "@nestjs/graphql";

 
@InputType()
export class UpdateRestaurantInputType extends PartialType(CreateRestaurantDto) { }


@ArgsType()
export class UpdateRestaurantDto {
    @Field()
    id: number;

    @Field()
    data: UpdateRestaurantInputType;
}