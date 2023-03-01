import { Module } from "@nestjs/common";
import { PrismaService } from "../common/services/prisma.service";
import { UserService } from "./user.service";
import { UserResolver } from "./user.resolver";
import { NotificationService } from "../notification/notification.service";

@Module({
    providers: [PrismaService, UserService, NotificationService, UserResolver],
})
export class UserModule {}
