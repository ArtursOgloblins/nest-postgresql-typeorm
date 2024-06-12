import { forwardRef, Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Blogs } from '../blogs/domain/blogs.entity';
import { Posts } from './domain/posts.entity';
import { CreatePostUseCase } from './application/usecases/create-post.usecase';
import { PostsRepository } from './infrastructure/posts.repository';
import { PostsController } from './api/posts.controller';
import { PostsQueryRepository } from './infrastructure/posts.query-repository';
import { BlogsModule } from '../blogs/blogs.module';
import { UsersModule } from '../users/users.module';
import { DeletePostByIdUseCase } from './application/usecases/delete-post.usecase';
import { UpdatePostUseCase } from './application/usecases/update-post.usecase';
import { GetPostsByBlogQuery } from './infrastructure/queries/get-all-posts-by-blog-id.query';
import { AddLikeStatusUseCase } from '../likes/application/usecases/add-update-like-status.usecase';
import { LikesModule } from '../likes/likes.module';
import { GetAllCommentsByPostIdQuery } from '../comments/infrastructure/queries/get-comments-by-post-id.query';
import { CommentsModule } from '../comments/comments.module';
@Module({
  imports: [
    CqrsModule,
    forwardRef(() => BlogsModule),
    UsersModule,
    LikesModule,
    CommentsModule,
    TypeOrmModule.forFeature([Posts, Blogs]),
  ],
  controllers: [PostsController],
  providers: [
    PostsRepository,
    PostsQueryRepository,
    GetPostsByBlogQuery,
    CreatePostUseCase,
    DeletePostByIdUseCase,
    UpdatePostUseCase,
    GetAllCommentsByPostIdQuery,
    AddLikeStatusUseCase,
  ],
  exports: [PostsRepository, PostsQueryRepository, TypeOrmModule],
})
export class PostsModule {}
