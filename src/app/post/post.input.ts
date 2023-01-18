import { Field, InputType } from "@nestjs/graphql";

@InputType()
export class CreatePostInput {
  @Field()
  userId: string;

  @Field()
  content: string;
}

@InputType()
export class ListPostsInput {
  @Field()
  userId: string;
}

@InputType()
export class ReplyPostInput {
  @Field()
  userId: string;

  @Field()
  postId: string;

  @Field()
  content: string;
}
