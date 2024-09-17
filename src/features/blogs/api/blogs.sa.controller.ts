import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { BasicAuthGuard } from '../../../infrastructure/guards/basic-auth.guard';
import { BlogQueryParamsDTO } from './dto/input/blogs-query-params.dto';
import { FindBlogs } from '../infrastructure/queries/get-all-blogs.query';
import { ValidateBlogExistencePipe } from '../../../infrastructure/pipes/blog-existance.pipe';
import { PaginatedBlogsSaResponseDTO } from './dto/output/paginated-sa-blogs-response.dto';
import { BindUserToBlogCommand } from '../application/usecases/bind-user-to-blog.usecase';
import { IFindBlogsParams } from '../interfaces/FindBlogsParams.interface';
import { AccessTokenPayloadDTO } from '../../auth/api/dto/input/access-token-params.dto';

@UseGuards(BasicAuthGuard)
@Controller('sa/blogs')
export class BlogsSaController {
  constructor(
    private commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  getBlogs(
    @Query() queryParams: BlogQueryParamsDTO,
  ): Promise<PaginatedBlogsSaResponseDTO> {
    const findBlogsParams: IFindBlogsParams = {
      params: queryParams,
      isSuperAdmin: true,
    };
    const admin: AccessTokenPayloadDTO = {
      userId: '111',
      username: 'admin',
      userEmail: 'admin@admin.com',
    };
    return this.queryBus.execute(new FindBlogs(findBlogsParams, admin));
  }

  @Put(':blogId/bind-with-user/:userId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async bindBlogWithUser(
    @Param('blogId', ParseIntPipe, ValidateBlogExistencePipe) blogId: number,
    @Param('userId', ParseIntPipe) userId: number,
  ): Promise<void> {
    return this.commandBus.execute(new BindUserToBlogCommand(blogId, userId));
  }
}
