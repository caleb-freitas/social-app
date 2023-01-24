import { Injectable } from '@nestjs/common';
import { PrismaService } from '../common/services/prisma.service';
import { CreateUserInput, FollowUserInput, UnfollowUserInput } from './user.input';

@Injectable()
export class UserService {
  constructor(
    private readonly prisma: PrismaService,
  ) {}

  async create(createUserInput: CreateUserInput) {
    try {
      const user = await this.prisma.user.create({
        data: createUserInput,
      })
      return user;
    } catch (e) {
      throw new Error(e);
    }
  }

  async follow(followUserInput: FollowUserInput) {
    const { followedId, followerId } = followUserInput;
    try {
      const user = await this.prisma.user.update({
        where: { id: followedId },
        data: {
          followers: {
            connect: { id: followerId }
          }
        }
      })
      return user;
    } catch (e) {
      throw new Error(e)
    }
  }

  async unfollow(unfollowUserInput: UnfollowUserInput) {
    const { followedId, followerId } = unfollowUserInput;
    try {
      const unfollowedUser = await this.prisma.user.update({
        where: { id: followedId },
        data: {
          followers: {
            disconnect: { id: followerId }
          }
        }
      })
      return unfollowedUser;
    } catch (e) {
      throw new Error(e);
    }
  }
}
