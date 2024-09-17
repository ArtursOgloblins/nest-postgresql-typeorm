import { forwardRef, Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BlogsController } from './api/blogs.controller';
import { BlogsQueryRepository } from './infrastructure/blogs.query-repository';
import { Blogs } from './domain/blogs.entity';
import { BlogsSaController } from './api/blogs.sa.controller';
import { BlogsRepository } from './infrastructure/blogs.repository';
import { CreateBlogUseCase } from './application/usecases/create-blog.usecase';
import { FindBlogsQuery } from './infrastructure/queries/get-all-blogs.query';
import { DeleteBlogByIdUseCase } from './application/usecases/delete-blog.usecase';
import { UpdateBlogUseCase } from './application/usecases/update-blog.usecase';
import { Posts } from '../posts/domain/posts.entity';
import { PostsModule } from '../posts/posts.module';
import { BindUserToBlogUseCase } from './application/usecases/bind-user-to-blog.usecase';
import { UsersModule } from '../users/users.module';
import { BlogsBloggerController } from './api/blogs.blogger.controller';

@Module({
  imports: [
    CqrsModule,
    forwardRef(() => PostsModule),
    TypeOrmModule.forFeature([Blogs, Posts]),
    UsersModule,
  ],
  controllers: [BlogsSaController, BlogsController, BlogsBloggerController],
  providers: [
    BlogsRepository,
    BlogsQueryRepository,
    FindBlogsQuery,
    CreateBlogUseCase,
    DeleteBlogByIdUseCase,
    UpdateBlogUseCase,
    BindUserToBlogUseCase,
  ],
  exports: [BlogsRepository, BlogsQueryRepository, TypeOrmModule],
})
export class BlogsModule {}
