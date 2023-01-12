import { Field, ID, ObjectType } from "@nestjs/graphql";
import { Post } from "../post/post.model";

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

  @Field(() => [User])
  followers: User[];

  @Field(() => [User])
  following: User[];

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}
