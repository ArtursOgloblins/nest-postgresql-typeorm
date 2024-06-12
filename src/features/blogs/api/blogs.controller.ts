import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  ParseIntPipe,
  Query,
  UseGuards,
} from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { BlogsQueryRepository } from '../infrastructure/blogs.query-repository';
import { BlogResponseDTO } from './dto/output/blogs-response.dto';
import { BlogQueryParamsDTO } from './dto/input/blogs-query-params.dto';
import { PaginatedBlogsResponseDTO } from './dto/output/paginated-blogs-response.dto';
import { FindBlogs } from '../infrastructure/queries/get-all-blogs.query';
import { OptionalAuthGuard } from '../../../infrastructure/guards/optional-bearer.guard';
import { PostsQueryParamsDTO } from '../../posts/api/dto/input/posts-query-params.dto';
import { PaginatedPostsResponseDto } from '../../posts/api/dto/output/paginated-posts-response.dto';
import { GetPostsByBlogId } from '../../posts/infrastructure/queries/get-all-posts-by-blog-id.query';
import { GetUser } from '../../../infrastructure/decorators/get-user.decorator';
import { AccessTokenPayloadDTO } from '../../auth/api/dto/input/access-token-params.dto';

@Controller('blogs')
export class BlogsController {
  constructor(
    private blogsQueryRepository: BlogsQueryRepository,
    private readonly queryBus: QueryBus,
  ) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  getBlogs(
    @Query() queryParams: BlogQueryParamsDTO,
  ): Promise<PaginatedBlogsResponseDTO> {
    return this.queryBus.execute(new FindBlogs(queryParams));
  }

  @UseGuards(OptionalAuthGuard)
  @Get(':blogId/posts')
  @HttpCode(HttpStatus.OK)
  getPostsByBlogId(
    @Param('blogId', ParseIntPipe) blogId: number,
    @Query() queryParams: PostsQueryParamsDTO,
    @GetUser() user: AccessTokenPayloadDTO,
  ): Promise<PaginatedPostsResponseDto> {
    const userId = user ? user.userId : 0;
    return this.queryBus.execute(
      new GetPostsByBlogId(blogId, queryParams, +userId),
    );
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async getBlogById(
    @Param('id', ParseIntPipe) blogId: number,
  ): Promise<BlogResponseDTO | null> {
    const blog = await this.blogsQueryRepository.findById(blogId);
    if (!blog) {
      throw new NotFoundException(`Blog with ID ${blogId} not found.`);
    } else {
      return new BlogResponseDTO(blog);
    }
  }
}
