import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bull';
import { PrismaService } from '../common/services/prisma.service';
import { CreateUserInput, FollowUserInput } from './user.input';

@Injectable()
export class UserService {
  constructor(
    private readonly prisma: PrismaService,
    @InjectQueue('aws.s3.image-upload')
    private readonly queue: Queue
  ) {}

  async create(createUserInput: CreateUserInput) {
    const user = await this.prisma.user.create({
      data: createUserInput
    })
    return user;
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
