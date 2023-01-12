import { Injectable } from '@nestjs/common';
import { PrismaService } from '../common/services/prisma.service';
import { CreateUserInput, FollowUserInput } from './user.input';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async create(createUserInput: CreateUserInput) {
    return await this.prisma.user.create({
      data: createUserInput
    })
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
}
