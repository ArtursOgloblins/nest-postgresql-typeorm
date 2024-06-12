import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { ConfigService } from '@nestjs/config';
import configuration, { ConfigurationType } from './settings/configuration';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './features/users/users.module';
import { IsUserEmailExistConstraint } from './infrastructure/decorators/users.is-email-exists.decorator';
import { IsUserLoginExistConstraint } from './infrastructure/decorators/users.is-login-exists.decorator';
import { EmailAdapter } from './base/email/email.adapter';
import { EmailService } from './base/email/email.service';
import { TestingRepository } from './base/test/delete-all/testing.repository';
import { TestingController } from './base/test/delete-all/testing.controller';
import { AuthModule } from './features/auth/auth.module';
import { IsValidConfirmationCodeConstraint } from './infrastructure/decorators/auth.user-code-validation.decorator';
import { IsValidEmailForCodeResendingConstraint } from './infrastructure/decorators/auth.is-email-valid.decorator';
import { SecurityDevicesModule } from './features/security/security-devices.module';
import { BlogsModule } from './features/blogs/blogs.module';
import { PostsModule } from './features/posts/posts.module';
import { CommentsModule } from './features/comments/comments.module';
import { LikesModule } from './features/likes/likes.module';

const featureModules = [
  UsersModule,
  AuthModule,
  BlogsModule,
  PostsModule,
  CommentsModule,
  LikesModule,
  SecurityDevicesModule,
];

const constraints = [
  IsUserEmailExistConstraint,
  IsUserLoginExistConstraint,
  IsValidConfirmationCodeConstraint,
  IsValidEmailForCodeResendingConstraint,
];

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      useFactory: (configService: ConfigService<ConfigurationType, true>) => {
        return configService.get('database', {
          infer: true,
        });
      },
      inject: [ConfigService],
    }),
    ...featureModules,
  ],
  controllers: [AppController, TestingController],
  providers: [
    AppService,
    EmailAdapter,
    EmailService,
    TestingRepository,
    ...constraints,
  ],
})
export class AppModule {}
