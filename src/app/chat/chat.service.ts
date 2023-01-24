import { Injectable } from '@nestjs/common';
import { PrismaService } from '../common/services/prisma.service';

@Injectable()
export class ChatService {
  constructor(private prisma: PrismaService) {}

  async saveMessage(message: string) {
    try {
    } catch (e) {
      throw new Error(e)
    }
  }
}
