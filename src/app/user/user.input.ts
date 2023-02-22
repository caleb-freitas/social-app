import { Field, InputType } from "@nestjs/graphql";

@InputType()
export class CreateUserInput {
    @Field()
    userName: string;

    @Field()
    email: string;

    @Field()
    password: string;
}

@InputType()
export class FollowUserInput {
    @Field()
    followerId: string;

    @Field()
    followedId: string;
}

@InputType()
export class UnfollowUserInput {
    @Field()
    followerId: string;

    @Field()
    followedId: string;
}
