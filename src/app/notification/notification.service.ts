import { BadRequestException, Injectable, InternalServerErrorException } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { PrismaService } from "../common/services/prisma.service";
import { CreateNotificationInput } from "./notification.input";

export type NotificationKind =
    | "PostReply"
    | "PostLiked"
    | "ReplyLiked"
    | "Follow";

type NotificationContentMap = {
    [kind in NotificationKind]: (
        createNotificationInput: CreateNotificationInput
    ) => string;
};

const notificationContentMap: NotificationContentMap = {
    PostReply: (createNotificationInput: CreateNotificationInput) =>
        `${createNotificationInput.userId} replied to your post ${createNotificationInput.postId}.`,
    PostLiked: (createNotificationInput: CreateNotificationInput) =>
        `${createNotificationInput.idTriggered} liked your post ${createNotificationInput.postId}.`,
    ReplyLiked: (createNotificationInput: CreateNotificationInput) =>
        `${createNotificationInput.idTriggered} like to your reply ${createNotificationInput.postId}.`,
    Follow: (createNotificationInput: CreateNotificationInput) =>
        `${createNotificationInput.idTriggered} followed you.`
};

const defaultNotificationSelect = Prisma.validator<Prisma.NotificationSelect>()(
    {
        id: true,
        userId: true,
        user: true,
        postId: true,
        post: true,
        kind: true,
        content: true,
        wasRead: true,
        createdAt: true,
    }
);

@Injectable()
export class NotificationService {
    constructor(private prisma: PrismaService) {}

    async sendNotification(createNotificationInput: CreateNotificationInput) {
        const { kind, userId, postId } = createNotificationInput;
        const content = notificationContentMap[kind](createNotificationInput);

        if (!content) {
            throw new BadRequestException(`Invalid kind of notification: ${kind}.`)
        }

        try {
            const notification = await this.prisma.notification.create({
                select: defaultNotificationSelect,
                data: {
                    kind,
                    userId,
                    content,
                    postId
                },
            });
            return notification;
        } catch (error) {
            throw new InternalServerErrorException(
                `Failed to create notification due to: ${error}.`
            );
        }
    }
}
