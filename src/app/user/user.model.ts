import { Field, ID, ObjectType } from "@nestjs/graphql";
import { Notification } from "../notification/notification.model";
import { Like, Post } from "../post/post.model";

@ObjectType()
export class User {
    @Field(() => ID)
    id: string;

    @Field()
    userName: string;

    @Field()
    email: string;

    @Field()
    password: string;

    @Field(() => [Post])
    posts: Post[];

    @Field(() => [Like])
    likes: Like[];

    @Field(() => [User])
    followers: User[];

    @Field(() => [User])
    following: User[];

    @Field(() => [Notification])
    notifications: Notification[];

    @Field()
    createdAt: Date;

    @Field()
    updatedAt: Date;
}
