import { Module } from '@nestjs/common';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { GraphQLModule } from '@nestjs/graphql';
import { UserModule } from './app/user/user.module';
import { PostModule } from './app/post/post.module';
import { NotificationModule } from './app/notification/notification.module';

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: 'schema.graphql',
    }),
    UserModule,
    PostModule,
    NotificationModule,
  ],
})
export class AppModule {}
