import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CreatePostInput, LikePostInput, ListPostsInput, ReplyPostInput, UnlikePostInput } from './post.input';
import { Post, Reply } from './post.model';
import { PostService } from './post.service';

@Resolver(() => Post)
export class PostResolver {
  constructor(private service: PostService) {}

  @Mutation(() => Post)
  async createPost(
    @Args('input')
    input: CreatePostInput
  ) {
    try {
      const response = await this.service.create(input);
      return response;
    } catch (e) {
      throw new Error(e);
    }
  }

  @Query(() => [Post])
  async listPosts(
    @Args('input')
    input: ListPostsInput
  ) {
    try {
      const response = await this.service.list(input);
      return response;
    } catch (e) {
      throw new Error(e);
    }
  }

  @Mutation(() => Reply)
  async replyPost(
    @Args('input')
    input: ReplyPostInput
  ) {
    try {
      const response = await this.service.reply(input);
      return response;
    } catch (e) {
      throw new Error(e);
    }
  }

  @Mutation(() => Reply)
  async likePost(
    @Args('input')
    input: LikePostInput
  ) {
    try {
      const response = await this.service.like(input);
      return response;
    } catch (e) {
      throw new Error(e);
    }
  }

  @Mutation(() => Reply)
  async unlikePost(
    @Args('input')
    input: UnlikePostInput
  ) {
    try {
      const response = await this.service.unlike(input);
      return response;
    } catch (e) {
      throw new Error(e);
    }
  }
}
