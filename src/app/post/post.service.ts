import { Injectable } from '@nestjs/common';
import { PrismaService } from '../common/services/prisma.service';
import { CreatePostInput, ListPostsInput } from './post.input';

@Injectable()
export class PostService {
  constructor(private prisma: PrismaService) {}

  async create(createPostInput: CreatePostInput) {
    try {
      return await this.prisma.post.create({
        data: createPostInput,
      })
    } catch (e) {
      throw new Error(e)
    }
  }

  async list(listPostsInput: ListPostsInput) {
    const { userId } = listPostsInput;
    try {
      const posts = await this.prisma.post.findMany({
        where: { userId }
      });
      console.log(posts);
      return posts;
    } catch (e) {
      throw new Error(e);
    }
  }
}
