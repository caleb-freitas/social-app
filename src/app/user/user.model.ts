import { Field, ID, ObjectType } from "@nestjs/graphql";
import { Post } from "../post/post.model";

@ObjectType()
export class User {
  @Field(() => ID)
  id: string;

  @Field()
  name: string;

  @Field()
  email: string;

  @Field()
  password: string;

  @Field(() => [Post])
  posts: Post[];

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}
