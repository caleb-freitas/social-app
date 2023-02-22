import { Resolver } from "@nestjs/graphql";
import { Notification } from "./notification.model";
import { NotificationService } from "./notification.service";

@Resolver(() => Notification)
export class NotificationResolver {
    constructor(private service: NotificationService) {}
}
