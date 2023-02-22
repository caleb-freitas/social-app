import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../common/services/prisma.service';
import { NotificationService } from '../notification/notification.service';
import { CreatePostInput, FindPostInput, LikePostInput, ListPostsInput, ReplyPostInput, UnlikePostInput } from './post.input';

const defaultPostSelect = Prisma.validator<Prisma.PostSelect>()({
  id: true,
  userId: true,
  user: true,
  parentId: true,
  parent: true,
  content: true,
  replies: true,
  likes: true,
  isThread: true,
  createdAt: true,
})

@Injectable()
export class PostService {
  constructor(
        private prisma: PrismaService,
        private notificationService: NotificationService
    ) {}

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

  async findPost(findPostInput: FindPostInput) {
    const { postId } = findPostInput;
    try {
      const post = await this.prisma.post.findUnique({
        select: defaultPostSelect,
        where: { id: postId },
      })
      return post;
    } catch (e) {
      throw new Error(e);
    }
  }

  async reply(replyPostInput: ReplyPostInput) {
    try {
      const { userId, parentId } = replyPostInput;
      const targetPost = await this.prisma.post.findUnique({
        where: {
          id: parentId,
        }
      })
      const isPostOwner = targetPost.userId === userId;
      const reply = await this.prisma.post.create({
        data: {
          ...replyPostInput,
          isThread: isPostOwner,
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
      this.notificationService.sendNotification({
        kind: "PostLiked",
        userId: likePostInput.userId,
        postId: likePostInput.postId,
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
