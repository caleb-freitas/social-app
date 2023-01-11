import { Field, ID, ObjectType } from "@nestjs/graphql";
import { User } from "../user/user.model";

@ObjectType()
export class Post {
  @Field(() => ID)
  id: string;

  @Field()
  userId: string;

  @Field(() => [User])
  user: User[]

  @Field()
  content: string

  @Field()
  createdAt: Date
}
