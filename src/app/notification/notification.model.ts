import { Field, ID, ObjectType } from "@nestjs/graphql";
import { User } from "../user/user.model";
import { Post } from "../post/post.model";
import { NotificationKind } from "./notification.service";

@ObjectType()
export class Notification {
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
    kind: NotificationKind;

    @Field()
    content: string;

    @Field(() => Date)
    createdAt: Date

    @Field()
    wasRead: boolean;
}
