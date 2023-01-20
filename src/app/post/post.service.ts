import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../common/services/prisma.service';
import { CreatePostInput, ListPostsInput, ReplyPostInput } from './post.input';

const defaultPostSelect = Prisma.validator<Prisma.PostSelect>()({
  id: true,
  userId: true,
  user: true,
  content: true,
  replies: true,
  createdAt: true,
  updatedAt: true
})

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
        select: defaultPostSelect, 
        where: { userId }
      });
      console.log(posts);
      return posts;
    } catch (e) {
      throw new Error(e);
    }
  }

  async reply(replyPostInput: ReplyPostInput) {
    const { userId, postId } = replyPostInput;
    const targetPost = await this.prisma.post.findUnique({
      where: {
        id: postId
      }
    })
    const isPostOwner = targetPost.userId === userId;
    console.log(isPostOwner)
      const reply = await this.prisma.reply.create({
        data: {
          ...replyPostInput,
          isThread: isPostOwner
        } 
      })
    return reply;
  }
}
