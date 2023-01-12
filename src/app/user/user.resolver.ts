import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { CreateUserInput, FollowUserInput } from './user.input';
import { User } from './user.model';
import { UserService } from './user.service';

@Resolver(() => User)
export class UserResolver {
  constructor(private service: UserService) {}

  @Mutation(() => User)
  async createUser(
    @Args('input')
    input: CreateUserInput
  ) {
    try {
      const response = await this.service.create(input);
      return response;
    } catch (e) {
      throw new Error(e);
    }
  }

  @Mutation(() => User)
  async followUser(
    @Args('input')
    input: FollowUserInput
  ) {
    try {
      const response = await this.service.follow(input);
      return response;
    } catch (e) {
      throw new Error();
    }
  }
}
