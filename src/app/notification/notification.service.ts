import { Injectable } from "@nestjs/common";
import { PrismaService } from "../common/services/prisma.service";
import { CreateNotificationInput } from "./notification.input";

export type NotificationKind =
    | "PostReply"
    | "PostLiked"
    | "ReplyLike"
    | "Follow";

@Injectable()
export class NotificationService {
    constructor(private prisma: PrismaService) {}

    async sendNotification(createNotificationInput: CreateNotificationInput) {
        const { kind } = createNotificationInput;

        if (kind === "PostReply") {
            this.sendReplyToPostNotification();
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

    async sendReplyToPostNotification() {}

    async sendPostLikedNotification(
        createNotificationInput: CreateNotificationInput
    ) {
        try {
            const notification = await this.prisma.notification.create({
                data: {
                    ...createNotificationInput,
                    content: `${createNotificationInput.userId} liked your post.`,
                },
            });
            return notification;
        } catch (e) {
            throw new Error(e);
        }
    }

    async sendReplyLikedNotification() {}

    async sendFollowedNotification() {}
}
