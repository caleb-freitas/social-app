import { Field, ID, ObjectType } from "@nestjs/graphql";
import { User } from "../user/user.model";

@ObjectType()
export class Post {
  @Field(() => ID)
  id: string;

  @Field()
  userId: string;

  @Field(() => User)
  user: User;

  @Field()
  content: string;

  @Field(() => [Reply])
  replies: Reply[];

  @Field(() => [Like])
  likes: Like[];

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}

@ObjectType()
export class Reply {
  @Field(() => ID)
  id: string;

  @Field()
  userId: string;

  @Field(() => User)
  user: User;

  @Field()
  postId: string;

  @Field(() => Post)
  post: Post;

  @Field()
  isThread: boolean;

  @Field()
  content: string;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}

@ObjectType()
export class Like {
  @Field(() => ID)
  id: string;

  @Field()
  postId: string;

  @Field(() => Post)
  post: Post;

  @Field()
  userId: string;

  @Field(() => User)
  user: User;
}
