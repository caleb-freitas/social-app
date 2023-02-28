import { Notification } from "../notification/notification.model";
import { Like, Post } from "../post/post.model";

export type User = {
    id: string;
    userName: string;
    email: string;
    password: string;
    posts: Post[];
    likes: Like[];
    followers: User[];
    following: User[];
    notifications: Notification[];
    createdAt: Date;
    updatedAt: Date;
}
