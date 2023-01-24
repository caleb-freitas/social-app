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

  @Field({ nullable: true })
  parentId?: string;

  @Field(() => Post, { nullable: true })
  parent?: Post;

  @Field(() => [Post])
  replies: Post[];

  @Field(() => [Like])
  likes: Like[];

  @Field()
  isThread: boolean;

  @Field(() => Date)
  createdAt: Date;
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
