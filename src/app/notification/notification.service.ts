import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { PrismaService } from "../common/services/prisma.service";
import { CreateNotificationInput } from "./notification.input";

export type NotificationKind =
    | "PostReply"
    | "PostLiked"
    | "ReplyLike"
    | "Follow";


const defaultNotificationSelect = Prisma.validator<Prisma.NotificationSelect>()({
    id: true,
    userId: true,
    user: true,
    postId: true,
    post: true,
    kind: true,
    content: true,
    wasRead: true,
    createdAt: true,
});

@Injectable()
export class NotificationService {
    constructor(private prisma: PrismaService) {}

    async sendNotification(createNotificationInput: CreateNotificationInput) {
        const { kind } = createNotificationInput;

        if (kind === "PostReply") {
            this.sendReplyToPostNotification(createNotificationInput);
        }

        if (kind === "PostLiked") {
            this.sendPostLikedNotification(createNotificationInput);
        }

        if (kind === "ReplyLike") {
            this.sendReplyLikedNotification();
        }

        if (kind === "Follow") {
            this.sendFollowedNotification();
        }
    }

    async sendReplyToPostNotification(
        createNotificationInput: CreateNotificationInput
    ) {
        try {

            const notification = await this.prisma.notification.create({
                select: defaultNotificationSelect,
                data: {
                    ...createNotificationInput,
                    content: `${createNotificationInput.userId} replied to your post.`,
                },
            });
            return notification;
        } catch (e) {
            throw new InternalServerErrorException(
                `Failed to create reply due to: ${e}.`
            );
        }
    }

    private async sendPostLikedNotification(
        createNotificationInput: CreateNotificationInput
    ) {
        try {
            const notification = await this.prisma.notification.create({
                select: defaultNotificationSelect,
                data: {
                    ...createNotificationInput,
                    content: `${createNotificationInput.userId} liked your post.`,
                },
            });
            return notification;
        } catch (e) {
            throw new InternalServerErrorException(
                `Failed to create reply due to: ${e}.`
            );
        }
    }

    private async sendReplyLikedNotification() {}

    async sendFollowedNotification() {}
}
