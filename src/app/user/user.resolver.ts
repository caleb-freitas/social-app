import { Args, Mutation, Resolver } from "@nestjs/graphql";
import {
    CreateUserInput,
    FollowUserInput,
    UnfollowUserInput,
} from "./user.input";
import { User } from "./user.model";
import {
    CreateUserCommand,
    FollowUserCommand,
    UnfollowUserCommand,
    UserService,
} from "./user.service";

@Resolver(() => User)
export class UserResolver {
    constructor(private service: UserService) {}

    @Mutation(() => User)
    async createUser(@Args("input") input: CreateUserInput) {
        const command = new CreateUserCommand(input);
        return await this.service.executeCommand(command);
    }

    @Mutation(() => User)
    async followUser(@Args("input") input: FollowUserInput) {
        const command = new FollowUserCommand(input);
        return await this.service.executeCommand(command);
    }

    @Mutation(() => User)
    async unfollowUser(@Args("input") input: UnfollowUserInput) {
        const command = new UnfollowUserCommand(input);
        return await this.service.executeCommand(command);
    }
}
