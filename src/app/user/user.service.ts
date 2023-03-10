import { Prisma, User } from "@prisma/client";
import { Command } from "../common/interfaces/command";
import { PrismaService } from "../common/services/prisma.service";
import {
    ConflictException,
    Injectable,
    InternalServerErrorException,
} from "@nestjs/common";
import {
    CreateUserInput,
    FollowUserInput,
    UnfollowUserInput,
} from "./user.input";
import { NotificationService } from "../notification/notification.service";

const defaultUserSelect = Prisma.validator<Prisma.UserSelect>()({
    id: true,
    userName: true,
    email: true,
    password: true,
    posts: true,
    likes: true,
    followers: true,
    following: true,
    notifications: true,
    createdAt: true,
    updatedAt: true,
});

@Injectable()
export class UserService {
    async executeCommand(command: Command<any>): Promise<any> {
        return await command.execute();
    }
}

@Injectable()
export class CreateUserCommand implements Command<any> {
    constructor(
        private readonly prisma: PrismaService,
        private readonly input: CreateUserInput
    ) {}

    async execute(): Promise<User> {
        try {
            const newUser = await this.prisma.user.create({
                select: defaultUserSelect,
                data: this.input,
            });
            return newUser;
        } catch (error) {
            if (error.code === "P2002") {
                throw new ConflictException("E-mail already registered.");
            }
            throw new InternalServerErrorException(error);
        }
    }
}

@Injectable()
export class FollowUserCommand implements Command<any> {
    constructor(
        private readonly prisma: PrismaService,
        private readonly input: FollowUserInput,
        private readonly notificationService: NotificationService
    ) {}

    async execute(): Promise<any> {
        const { followedId, followerId } = this.input;
        try {
            const followedUser = await this.prisma.user.update({
                select: defaultUserSelect,
                where: { id: followedId },
                data: {
                    followers: {
                        connect: { id: followerId },
                    },
                },
            });

            await this.notificationService.sendNotification({
                kind: "Follow",
                userId: followedId,
                idTriggered: followerId,
            })

            return followedUser;
        } catch (error) {
            throw new InternalServerErrorException(error);
        }
    }
}

@Injectable()
export class UnfollowUserCommand implements Command<any> {
    constructor(
        private readonly prisma: PrismaService,
        private readonly input: UnfollowUserInput
    ) {}

    async execute(): Promise<any> {
        const { followedId, followerId } = this.input;
        try {
            const unfollowedUser = await this.prisma.user.update({
                select: defaultUserSelect,
                where: { id: followedId },
                data: {
                    followers: {
                        disconnect: { id: followerId },
                    },
                },
            });
            return unfollowedUser;
        } catch (error) {
            throw new InternalServerErrorException(error);
        }
    }
}
