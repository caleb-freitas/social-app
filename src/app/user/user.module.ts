import { Module } from '@nestjs/common';
import { PrismaService } from '../common/services/prisma.service';
import { UserService } from './user.service';
import { UserResolver } from './user.resolver';

@Module({
  providers: [PrismaService, UserService, UserResolver]
})
export class UserModule {}