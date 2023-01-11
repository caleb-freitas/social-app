import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CreateUserInput } from './user.input';
import { User } from './user.model';
import { UserService } from './user.service';

@Resolver(() => User)
export class UserResolver {
  constructor(private service: UserService) {}

  @Mutation(() => User)
  async handle(
    @Args('input')
    createUserInput: CreateUserInput
  ) {
    try {
      const response = await this.service.create(createUserInput);
      console.log(response);
      return response;
    } catch (e) {
      throw new Error(e);
    }
  }

  @Query(() => String)
    sayHello(): string {
      return 'Hello World!';
  }
}
