import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../common/services/prisma.service';
import { CreatePostInput, LikePostInput, ListPostsInput, ReplyPostInput, UnlikePostInput } from './post.input';

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
      return posts;
    } catch (e) {
      throw new Error(e);
    }
  }

  async reply(replyPostInput: ReplyPostInput) {
    try {
      const { userId, postId } = replyPostInput;
      const targetPost = await this.prisma.post.findUnique({
        where: {
          id: postId
        }
      })
      const isPostOwner = targetPost.userId === userId;
        const reply = await this.prisma.reply.create({
          data: {
            ...replyPostInput,
            isThread: isPostOwner
          } 
        })
      return reply;
    } catch (e) {
      throw new Error(e);
    }
  }

  async like(likePostInput: LikePostInput) {
    try {
      const like = await this.prisma.like.create({
        data: likePostInput,
      })
      return like;
    } catch (e) {
      throw new Error(e);
    }
  }

  async unlike(unlikePostInput: UnlikePostInput) {
    try {
      await this.prisma.like.delete({
        where: {
          id: unlikePostInput.id,
        }
      })
    } catch (e) {
      throw new Error(e);
    }
  }
}
