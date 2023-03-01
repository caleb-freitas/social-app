import { Module } from "@nestjs/common";
import { PrismaService } from "../common/services/prisma.service";
import { NotificationService } from "./notification.service";

@Module({
    providers: [PrismaService, NotificationService],
})
export class NotificationModule {}
