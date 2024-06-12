import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { BasicAuthGuard } from '../../../infrastructure/guards/basic-auth.guard';
import { NewBlogDto } from './dto/input/new-blog.dto';
import { BlogResponseDTO } from './dto/output/blogs-response.dto';
import { CreateBlogCommand } from '../application/usecases/create-blog.usecase';
import { BlogQueryParamsDTO } from './dto/input/blogs-query-params.dto';
import { PaginatedBlogsResponseDTO } from './dto/output/paginated-blogs-response.dto';
import { FindBlogs } from '../infrastructure/queries/get-all-blogs.query';
import { UpdateBlogCommand } from '../application/usecases/update-blog.usecase';
import { DeleteBlogByIdCommand } from '../application/usecases/delete-blog.usecase';
import { ValidateBlogExistencePipe } from '../../../infrastructure/pipes/blog-existance.pipe';
import { NewPostByBlogIdDto } from '../../posts/api/dto/input/new-post-by-blog-id.dto';
import { PostsResponseDTO } from '../../posts/api/dto/output/posts-response.dto';
import { CreatePostCommand } from '../../posts/application/usecases/create-post.usecase';
import { DeletePostCommand } from '../../posts/application/usecases/delete-post.usecase';
import { UpdatePostInputDataDto } from '../../posts/api/dto/input/update-post-by-blog-id.dto';
import { UpdatePostCommand } from '../../posts/application/usecases/update-post.usecase';
import { PostsQueryParamsDTO } from '../../posts/api/dto/input/posts-query-params.dto';
import { PaginatedPostsResponseDto } from '../../posts/api/dto/output/paginated-posts-response.dto';
import { GetPostsByBlogId } from '../../posts/infrastructure/queries/get-all-posts-by-blog-id.query';

@Controller('sa/blogs')
export class BlogsSaController {
  constructor(
    private commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @UseGuards(BasicAuthGuard)
  @Get()
  @HttpCode(HttpStatus.OK)
  getBlogs(
    @Query() queryParams: BlogQueryParamsDTO,
  ): Promise<PaginatedBlogsResponseDTO> {
    return this.queryBus.execute(new FindBlogs(queryParams));
  }

  @UseGuards(BasicAuthGuard)
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async addBlog(@Body() newBlogDto: NewBlogDto): Promise<BlogResponseDTO> {
    return this.commandBus.execute(new CreateBlogCommand({ ...newBlogDto }));
  }

  @UseGuards(BasicAuthGuard)
  @Put(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async updateBlog(
    @Param('id', ParseIntPipe) blogId: number,
    @Body() newBlogData: NewBlogDto,
  ): Promise<any> {
    return this.commandBus.execute(new UpdateBlogCommand(blogId, newBlogData));
  }

  @UseGuards(BasicAuthGuard)
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  deleteBlogById(@Param('id', ParseIntPipe) blogId: number) {
    return this.commandBus.execute(new DeleteBlogByIdCommand(blogId));
  }

  @UseGuards(BasicAuthGuard)
  @Post(':id/posts')
  @HttpCode(HttpStatus.CREATED)
  async addPostBlogId(
    @Param('id', ParseIntPipe, ValidateBlogExistencePipe) blogId: number,
    @Body() newPostData: NewPostByBlogIdDto,
  ): Promise<PostsResponseDTO> {
    const { title, shortDescription, content } = newPostData;
    const createPostInputData = {
      title,
      shortDescription,
      content,
      blogId,
    };
    return this.commandBus.execute(new CreatePostCommand(createPostInputData));
  }

  @UseGuards(BasicAuthGuard)
  @Get(':blogId/posts')
  @HttpCode(HttpStatus.OK)
  getPostsByBlogId(
    @Param('blogId', ParseIntPipe, ValidateBlogExistencePipe) blogId: number,
    @Query() queryParams: PostsQueryParamsDTO,
  ): Promise<PaginatedPostsResponseDto> {
    const userId = 0;
    return this.queryBus.execute(
      new GetPostsByBlogId(blogId, queryParams, +userId),
    );
  }

  @UseGuards(BasicAuthGuard)
  @Put(':blogId/posts/:postId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async updatePostByBlogId(
    @Param('blogId', ParseIntPipe, ValidateBlogExistencePipe) blogId: number,
    @Param('postId', ParseIntPipe) postId: number,
    @Body() newPostData: NewPostByBlogIdDto,
  ): Promise<void> {
    const updatePostInputData: UpdatePostInputDataDto = {
      ...newPostData,
      postId,
      blogId,
    };
    return this.commandBus.execute(new UpdatePostCommand(updatePostInputData));
  }

  @UseGuards(BasicAuthGuard)
  @Delete(':blogId/posts/:postId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deletePostById(
    @Param('blogId', ParseIntPipe, ValidateBlogExistencePipe) blogId: number,
    @Param('postId', ParseIntPipe) postId: number,
  ): Promise<void> {
    return this.commandBus.execute(new DeletePostCommand(blogId, postId));
  }
}
