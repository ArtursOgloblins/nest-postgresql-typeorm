import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { PostsQueryRepository } from '../infrastructure/posts.query-repository';
import { PaginatedPostsResponseDto } from './dto/output/paginated-posts-response.dto';
import { OptionalAuthGuard } from '../../../infrastructure/guards/optional-bearer.guard';
import { PostsQueryParamsDTO } from './dto/input/posts-query-params.dto';
import { PostsResponseDTO } from './dto/output/posts-response.dto';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from '../../../infrastructure/decorators/get-user.decorator';
import { AccessTokenPayloadDTO } from '../../auth/api/dto/input/access-token-params.dto';
import { CommentsResponseDTO } from '../../comments/api/dto/output/comment-response.dto';
import { CreateCommentCommand } from '../../comments/application/usecases/create-comment.usecase';
import { NewCommentDataDto } from '../../comments/api/dto/input/new-comment.dto';
import { LikeStatusDto } from '../../likes/api/dto/input/like-status.dto';
import { AddUpdateLikeStatusCommand } from '../../likes/application/usecases/add-update-like-status.usecase';
import { EntityType } from '../../likes/domain/likes.entity';
import { CommentsQueryParamsDto } from '../../comments/api/dto/input/comments-query-params.dto';
import { PaginatedCommentsResponse } from '../../comments/api/dto/output/paginated-comments.response.dto';
import { GetAllCommentsByPostId } from '../../comments/infrastructure/queries/get-comments-by-post-id.query';

@Controller('posts')
export class PostsController {
  constructor(
    private postsQueryRepository: PostsQueryRepository,
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @UseGuards(OptionalAuthGuard)
  @Get()
  @HttpCode(HttpStatus.OK)
  getAllPosts(
    @Query() queryParams: PostsQueryParamsDTO,
    @GetUser() user: AccessTokenPayloadDTO,
  ): Promise<PaginatedPostsResponseDto> {
    const userId = user ? user.userId : 0;
    return this.postsQueryRepository.getAllPosts(queryParams, +userId);
  }

  @UseGuards(OptionalAuthGuard)
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async getPostById(
    @Param('id', ParseIntPipe) postId: number,
    @GetUser() user: AccessTokenPayloadDTO,
  ): Promise<PostsResponseDTO | null> {
    const userId = user ? user.userId : 0;
    const post = await this.postsQueryRepository.findById(postId, +userId);
    if (!post) {
      throw new NotFoundException(`Blog with ID ${postId} not found.`);
    } else {
      return post;
    }
  }

  @UseGuards(AuthGuard('jwt'))
  @Post(':id/comments')
  @HttpCode(HttpStatus.CREATED)
  async addCommentByPostId(
    @Param('id', ParseIntPipe) postId: number,
    @Body() newCommentData: NewCommentDataDto,
    @GetUser() user: AccessTokenPayloadDTO,
  ): Promise<CommentsResponseDTO> {
    const { content } = newCommentData;
    return this.commandBus.execute(
      new CreateCommentCommand(postId, content, user),
    );
  }

  @UseGuards(AuthGuard('jwt'))
  @Put(':id/like-status')
  @HttpCode(HttpStatus.NO_CONTENT)
  async addLikeStatusToPost(
    @Param('id', ParseIntPipe) entityId: number,
    @Body() likeStatus: LikeStatusDto,
    @GetUser() user: AccessTokenPayloadDTO,
  ) {
    const entityType = EntityType.POST;
    const post = await this.postsQueryRepository.findPost(entityId);
    if (!post) {
      throw new NotFoundException(`Post not found`);
    }

    await this.commandBus.execute(
      new AddUpdateLikeStatusCommand(entityId, user, likeStatus, entityType),
    );
  }

  @UseGuards(OptionalAuthGuard)
  @Get(':id/comments')
  @HttpCode(HttpStatus.OK)
  async getCommentsByPostId(
    @Param('id', ParseIntPipe) postId: number,
    @Query() queryParams: CommentsQueryParamsDto,
    @GetUser() user: AccessTokenPayloadDTO,
  ): Promise<PaginatedCommentsResponse> {
    return this.queryBus.execute(
      new GetAllCommentsByPostId(postId, queryParams, user),
    );
  }
}
