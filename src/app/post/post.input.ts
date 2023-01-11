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
