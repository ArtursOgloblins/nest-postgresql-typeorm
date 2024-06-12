import { forwardRef, Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { PostsModule } from '../posts/posts.module';
import { UsersModule } from '../users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Comments } from './domain/commnets.entity';
import { CommentsRepository } from './infrastructure/comments.repository';
import { CommentsQueryRepository } from './infrastructure/comments.query-repository';
import { CreateCommentUseCase } from './application/usecases/create-comment.usecase';
import { GetCommentByIdQuery } from './infrastructure/queries/get-comment-by-id.query';
import { AddLikeStatusUseCase } from '../likes/application/usecases/add-update-like-status.usecase';
import { UpdateCommentUseCase } from './application/usecases/update-comment.usecase';
import { DeleteCommentUseCase } from './application/usecases/delete-comment.usecase';
import { LikesModule } from '../likes/likes.module';
import { CommentsController } from './api/comments.controller';

@Module({
  imports: [
    CqrsModule,
    forwardRef(() => PostsModule),
    UsersModule,
    LikesModule,
    TypeOrmModule.forFeature([Comments]),
  ],
  controllers: [CommentsController],
  providers: [
    CommentsRepository,
    CommentsQueryRepository,
    GetCommentByIdQuery,
    CreateCommentUseCase,
    UpdateCommentUseCase,
    DeleteCommentUseCase,
    AddLikeStatusUseCase,
  ],
  exports: [CommentsRepository, CommentsQueryRepository, TypeOrmModule],
})
export class CommentsModule {}
