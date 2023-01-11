import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CreatePostInput, ListPostsInput } from './post.input';
import { Post } from './post.model';
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
}
