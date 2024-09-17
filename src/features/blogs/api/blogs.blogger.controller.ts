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
import { AuthGuard } from '@nestjs/passport';
import { IFindBlogsParams } from '../interfaces/FindBlogsParams.interface';
import { GetUser } from '../../../infrastructure/decorators/get-user.decorator';
import { AccessTokenPayloadDTO } from '../../auth/api/dto/input/access-token-params.dto';

@UseGuards(AuthGuard('jwt'))
@Controller('blogger/blogs')
export class BlogsBloggerController {
  constructor(
    private commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  getBlogs(
    @Query() queryParams: BlogQueryParamsDTO,
    @GetUser() user: AccessTokenPayloadDTO,
  ): Promise<PaginatedBlogsResponseDTO> {
    const findBlogsParams: IFindBlogsParams = {
      params: queryParams,
      isSuperAdmin: false,
    };
    return this.queryBus.execute(new FindBlogs(findBlogsParams, user));
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async addBlog(
    @Body() newBlogData: NewBlogDto,
    @GetUser() user: AccessTokenPayloadDTO,
  ): Promise<BlogResponseDTO> {
    return this.commandBus.execute(new CreateBlogCommand(newBlogData, user));
  }

  @Put(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async updateBlog(
    @Param('id', ParseIntPipe) blogId: number,
    @Body() newBlogData: NewBlogDto,
    @GetUser() user: AccessTokenPayloadDTO,
  ): Promise<any> {
    return this.commandBus.execute(
      new UpdateBlogCommand(blogId, newBlogData, user),
    );
  }

  @Post(':id/posts')
  @HttpCode(HttpStatus.CREATED)
  async addPostBlogId(
    @Param('id', ParseIntPipe, ValidateBlogExistencePipe) blogId: number,
    @Body() newPostData: NewPostByBlogIdDto,
    @GetUser() user: AccessTokenPayloadDTO,
  ): Promise<PostsResponseDTO> {
    const { title, shortDescription, content } = newPostData;
    const createPostInputData = {
      title,
      shortDescription,
      content,
      blogId,
    };
    return this.commandBus.execute(
      new CreatePostCommand(createPostInputData, user),
    );
  }

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

  @Put(':blogId/posts/:postId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async updatePostByBlogId(
    @Param('blogId', ParseIntPipe, ValidateBlogExistencePipe) blogId: number,
    @Param('postId', ParseIntPipe) postId: number,
    @Body() newPostData: NewPostByBlogIdDto,
    @GetUser() user: AccessTokenPayloadDTO,
  ): Promise<void> {
    const updatePostInputData: UpdatePostInputDataDto = {
      ...newPostData,
      postId,
      blogId,
    };
    return this.commandBus.execute(
      new UpdatePostCommand(updatePostInputData, user),
    );
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  deleteBlogById(
    @Param('id', ParseIntPipe) blogId: number,
    @GetUser() user: AccessTokenPayloadDTO,
  ) {
    return this.commandBus.execute(new DeleteBlogByIdCommand(blogId, user));
  }

  @Delete(':blogId/posts/:postId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deletePostById(
    @Param('blogId', ParseIntPipe, ValidateBlogExistencePipe) blogId: number,
    @Param('postId', ParseIntPipe) postId: number,
    @GetUser() user: AccessTokenPayloadDTO,
  ): Promise<void> {
    return this.commandBus.execute(new DeletePostCommand(blogId, postId, user));
  }
}
