import { Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { PrismaService } from "../common/services/prisma.service";
import { NotificationService } from "../notification/notification.service";
import {
    CreatePostInput,
    FindPostInput,
    LikePostInput,
    ListPostsInput,
    ReplyPostInput,
    UnlikePostInput,
} from "./post.input";

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
});

@Injectable()
export class PostService {
    constructor(
        private prisma: PrismaService,
        private notificationService: NotificationService
    ) {}

    async create(createPostInput: CreatePostInput) {
        try {
            const post = await this.prisma.post.create({
                data: createPostInput,
            });
            return post;
        } catch (e) {
            throw new Error(e);
        }
    }

    async list(listPostsInput: ListPostsInput) {
        const { userId } = listPostsInput;
        try {
            const posts = await this.prisma.post.findMany({
                select: defaultPostSelect,
                where: { userId },
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
            });
            return post;
        } catch (e) {
            throw new Error(e);
        }
    }

    async findPostById(id: string) {
        try {
            const post = await this.prisma.post.findUnique({
                select: defaultPostSelect,
                where: { id }
            })
            return post;
        } catch (e) {
            throw new Error(e);
        }
    }

    async reply(replyPostInput: ReplyPostInput) {
        const { userId, parentId } = replyPostInput;

        const targetPost = await this.prisma.post.findUnique({
            select: defaultPostSelect,
            where: { id: parentId }
        });

        if (!targetPost) {
            throw new NotFoundException(`Post with id (${parentId}) not found.`)
        }

        const isPostOwner = targetPost.userId === userId;

        try {
            const reply = await this.prisma.post.create({
                select: defaultPostSelect,
                data: {
                    ...replyPostInput,
                    isThread: isPostOwner,
                },
            });

            if (isPostOwner) {
                return reply;
            }

            await this.notificationService.sendNotification({
                kind: "PostReply",
                userId,
                postId: parentId,
            })

            return reply;
        } catch (e) {
            throw new InternalServerErrorException(
                `Failed to create reply due to: ${e}.`
            );
        }
    }

    async like(likePostInput: LikePostInput) {
        try {
            const { userId, postId } = likePostInput;
            const post = await this.findPostById(postId);
            const postWasAlreadyLiked = post.likes.some((like) => like.userId === userId);
            if (postWasAlreadyLiked) {
                throw new Error("You can only like a post once.");
            }
            const like = await this.prisma.like.create({
                data: likePostInput,
            });
            this.notificationService.sendNotification({
                kind: "PostLiked",
                userId,
                postId,
            });
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
                },
            });
        } catch (e) {
            throw new Error(e);
        }
    }
}
