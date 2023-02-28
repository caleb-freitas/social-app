import { Prisma } from "@prisma/client";
import { PrismaService } from "../common/services/prisma.service";
import { NotificationService } from "../notification/notification.service";
import { Like, Post } from "./post.model";
import { Command } from "../common/interfaces/command";
import {
    BadRequestException,
    Injectable,
    InternalServerErrorException,
    NotFoundException,
} from "@nestjs/common";
import {
    CreatePostInput,
    FindManyPostsInput,
    FindUniqueLikeInput,
    FindUniquePostInput,
    LikePostInput,
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

const defaultLikeSelect = Prisma.validator<Prisma.LikeSelect>()({
    id: true,
    postId: true,
    post: true,
    userId: true,
    user: true,
});

@Injectable()
export class PostService {
    async executeCommand(command: Command<Post>): Promise<Post> {
        return await command.execute();
    }
}

export class CreatePostCommand implements Command<Post> {
    private prisma: PrismaService;

    constructor(private readonly input: CreatePostInput) {
        this.prisma = new PrismaService();
    }

    async execute(): Promise<any> {
        try {
            const newPost = await this.prisma.post.create({
                select: defaultPostSelect,
                data: this.input,
            });
            return newPost;
        } catch (error) {
            throw new InternalServerErrorException(error);
        }
    }
}

export class FindUniquePostCommand implements Command<Post> {
    private prisma: PrismaService;

    constructor(private readonly input: FindUniquePostInput) {
        this.prisma = new PrismaService();
    }

    async execute(): Promise<any> {
        const { postId } = this.input;
        try {
            const post = await this.prisma.post.findUnique({
                select: defaultPostSelect,
                where: { id: postId },
            });

            return post;
        } catch (error) {
            throw new InternalServerErrorException(error);
        }
    }
}

export class FindManyPostsCommand implements Command<Post> {
    private prisma: PrismaService;

    constructor(private readonly input: FindManyPostsInput) {
        this.prisma = new PrismaService();
    }

    async execute(): Promise<any> {
        const { userId } = this.input;
        try {
            const posts = await this.prisma.post.findMany({
                select: defaultPostSelect,
                where: { userId },
            });

            return posts;
        } catch (error) {
            throw new InternalServerErrorException(error);
        }
    }
}

export class ReplyPostsCommand implements Command<Post> {
    private prisma: PrismaService;
    private notificationService: NotificationService;

    constructor(private readonly input: ReplyPostInput) {
        this.prisma = new PrismaService();
        this.notificationService = new NotificationService(this.prisma);
    }

    async execute(): Promise<any> {
        const { userId, parentId } = this.input;

        const command = new FindUniquePostCommand({ postId: parentId });
        const targetPost = await command.execute();

        if (!targetPost) {
            throw new NotFoundException(
                `Post with id ${parentId} does not exist.`
            );
        }

        const isPostOwner = targetPost.userId === userId;

        try {
            const reply = await this.prisma.post.create({
                select: defaultPostSelect,
                data: {
                    ...this.input,
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
            });

            return reply;
        } catch (error) {
            throw new InternalServerErrorException(error);
        }
    }
}

export class LikePostCommand implements Command<Post> {
    private prisma: PrismaService;
    private notificationService: NotificationService;

    constructor(private readonly input: LikePostInput) {
        this.prisma = new PrismaService();
        this.notificationService = new NotificationService(this.prisma);
    }

    async execute(): Promise<any> {
        const { userId, postId } = this.input;

        const command = new FindUniquePostCommand({ postId });
        const targetPost = await command.execute();

        if (!targetPost) {
            throw new NotFoundException(
                `Post with id ${postId} does not exist.`
            );
        }

        const postWasAlreadyLiked = targetPost.likes.some(
            (like: Like) => like.userId === userId
        );

        if (postWasAlreadyLiked) {
            throw new BadRequestException(
                `User already liked post with id ${postId}.`
            );
        }

        const isPostOwner = targetPost.userId === userId;

        try {
            const like = await this.prisma.like.create({
                select: defaultLikeSelect,
                data: this.input,
            });

            if (isPostOwner) {
                return like;
            }

            this.notificationService.sendNotification({
                kind: "PostLiked",
                userId,
                postId,
            });

            return like;
        } catch (error) {
            throw new InternalServerErrorException(error);
        }
    }
}

export class FindUniqueLikeCommand implements Command<Post> {
    private prisma: PrismaService;

    constructor(private readonly input: FindUniqueLikeInput) {
        this.prisma = new PrismaService();
    }

    async execute(): Promise<any> {
        const { likeId } = this.input;
        try {
            const like = await this.prisma.like.findUnique({
                select: defaultLikeSelect,
                where: { id: likeId },
            });

            return like;
        } catch (error) {
            throw new InternalServerErrorException(error);
        }
    }
}

export class UnlikePostCommand implements Command<Post> {
    private prisma: PrismaService;

    constructor(private readonly input: UnlikePostInput) {
        this.prisma = new PrismaService();
    }

    async execute(): Promise<any> {
        const { id } = this.input;

        const command = new FindUniqueLikeCommand({ likeId: id });
        const targetLike = await command.execute();

        if (!targetLike) {
            throw new NotFoundException(`Like with id (${id}) not found.`);
        }

        const deletedLike = await this.prisma.like.delete({
            select: defaultLikeSelect,
            where: { id },
        });

        return deletedLike;
    }
}
