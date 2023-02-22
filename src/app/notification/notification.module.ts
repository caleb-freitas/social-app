import { Module } from "@nestjs/common";
import { PrismaService } from "../common/services/prisma.service";
import { NotificationResolver } from "./notification.resolver";
import { NotificationService } from "./notification.service";

@Module({
    providers: [PrismaService, NotificationService, NotificationResolver],
})
export class NotificationModule {}
