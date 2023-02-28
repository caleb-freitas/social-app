import { ConflictException, Injectable, InternalServerErrorException } from "@nestjs/common";
import { Command } from "../common/interfaces/command";
import { PrismaService } from "../common/services/prisma.service";
import {
    CreateUserInput,
    FollowUserInput,
    UnfollowUserInput,
} from "./user.input";

@Injectable()
export class UserService {
  async executeCommand(command: Command<any>): Promise<any> {
    return await command.execute();
  }
}

export class CreateUserCommand implements Command<any> {
    private prisma: PrismaService;

    constructor(private readonly input: CreateUserInput) {
        this.prisma = new PrismaService()
    }

    async execute(): Promise<any> {
        try {
            const newUser = await this.prisma.user.create({
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

export class FollowUserCommand implements Command<any> {
    private prisma: PrismaService;

    constructor(private readonly input: FollowUserInput) {
        this.prisma = new PrismaService()
    }

    async execute(): Promise<any> {
        const { followedId, followerId} = this.input;
        try {
            const followedUser = await this.prisma.user.update({
                where: { id: followedId },
                data: {
                    followers: {
                        connect: { id: followerId },
                    },
                },
            });
            return followedUser;
        } catch (error) {
            throw new InternalServerErrorException(error);
        }
    }
}

export class UnfollowUserCommand implements Command<any> {
    private prisma: PrismaService;

    constructor(private readonly input: UnfollowUserInput) {
        this.prisma = new PrismaService()
    }

    async execute(): Promise<any> {
        const { followedId, followerId } = this.input;
        try {
            const unfollowedUser = await this.prisma.user.update({
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
