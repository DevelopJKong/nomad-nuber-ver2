import { CreatAccountInput, CreateAccountOutput } from './dtos/create-account.dto';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';

@Resolver((of) => User)
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  @Query((returns) => Boolean)
  hi() {
    return true;
  }

  @Mutation((returns) => CreateAccountOutput)
  createAccount(@Args('input') createAccountInput: CreatAccountInput) {}
}
