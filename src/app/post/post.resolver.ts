import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";
import { Post } from "./post.model";
import {
    CreatePostInput,
    FindUniquePostInput,
    LikePostInput,
    FindManyPostsInput,
    ReplyPostInput,
    UnlikePostInput,
} from "./post.input";
import {
    CreatePostCommand,
    FindManyPostsCommand,
    FindUniquePostCommand,
    LikePostCommand,
    PostService,
    ReplyPostsCommand,
    UnlikePostCommand,
} from "./post.service";

@Resolver(() => Post)
export class PostResolver {
    constructor(private service: PostService) {}

    @Mutation(() => Post)
    async createPost(@Args("input") input: CreatePostInput) {
        const command = new CreatePostCommand(input);
        return await this.service.executeCommand(command);
    }

    @Mutation(() => Post)
    async replyPost(@Args("input") input: ReplyPostInput) {
        const command = new ReplyPostsCommand(input);
        return await this.service.executeCommand(command);
    }

    @Mutation(() => Post)
    async likePost(@Args("input") input: LikePostInput) {
        const command = new LikePostCommand(input);
        return await this.service.executeCommand(command);
    }

    @Mutation(() => Post)
    async unlikePost(@Args("input") input: UnlikePostInput) {
        const command = new UnlikePostCommand(input);
        return await this.service.executeCommand(command);
    }

    @Mutation(() => Post)
    async findPost(@Args("input") input: FindUniquePostInput) {
        const command = new FindUniquePostCommand(input);
        return await this.service.executeCommand(command);
    }

    @Query(() => [Post])
    async listPosts(@Args("input") input: FindManyPostsInput) {
        const command = new FindManyPostsCommand(input);
        return await this.service.executeCommand(command);
    }
}
