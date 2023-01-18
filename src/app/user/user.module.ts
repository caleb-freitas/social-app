import { Module } from '@nestjs/common';
import { PrismaService } from '../common/services/prisma.service';
import { UserService } from './user.service';
import { UserResolver } from './user.resolver';
import { BullModule } from '@nestjs/bull';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'aws.s3.image-upload'
    })
  ],
  providers: [PrismaService, UserService, UserResolver]
})
export class UserModule {}
