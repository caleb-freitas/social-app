import { Field, InputType } from "@nestjs/graphql";

@InputType()
export class CreatePostInput {
    @Field()
    userId: string;

    @Field({ nullable: true })
    parentId?: string;

    @Field()
    content: string;
}

@InputType()
export class ListPostsInput {
    @Field()
    userId: string;
}

@InputType()
export class FindPostInput {
    @Field()
    postId: string;
}

@InputType()
export class ReplyPostInput {
    @Field()
    userId: string;

    @Field()
    parentId: string;

    @Field()
    content: string;
}

@InputType()
export class LikePostInput {
    @Field()
    postId: string;

    @Field()
    userId: string;
}

@InputType()
export class UnlikePostInput {
    @Field()
    id: string;
}
