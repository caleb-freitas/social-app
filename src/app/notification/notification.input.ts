import { Field, InputType } from "@nestjs/graphql";
import { NotificationKind } from "./notification.service";

@InputType()
export class CreateNotificationInput {
  @Field()
  kind: NotificationKind;

  @Field()
  userId: string;

  @Field()
  postId?: string;
}
