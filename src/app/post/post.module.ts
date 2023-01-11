import { Module } from '@nestjs/common';
import { PrismaService } from '../common/services/prisma.service';
import { PostResolver } from './post.resolver';
import { PostService } from './post.service';

@Module({
  providers: [PrismaService, PostService, PostResolver]
})
export class PostModule {}
