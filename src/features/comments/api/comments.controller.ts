import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  ParseIntPipe,
  Put,
  UseGuards,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CommentsQueryRepository } from '../infrastructure/comments.query-repository';
import { OptionalAuthGuard } from '../../../infrastructure/guards/optional-bearer.guard';
import { GetUser } from '../../../infrastructure/decorators/get-user.decorator';
import { AccessTokenPayloadDTO } from '../../auth/api/dto/input/access-token-params.dto';
import { CommentsResponseDTO } from './dto/output/comment-response.dto';
import { GetCommentById } from '../infrastructure/queries/get-comment-by-id.query';
import { AuthGuard } from '@nestjs/passport';
import { DeleteCommentCommand } from '../application/usecases/delete-comment.usecase';
import { NewCommentDataDto } from './dto/input/new-comment.dto';
import { UpdateCommentCommand } from '../application/usecases/update-comment.usecase';
import { LikeStatusDto } from '../../likes/api/dto/input/like-status.dto';
import { AddUpdateLikeStatusCommand } from '../../likes/application/usecases/add-update-like-status.usecase';
import { EntityType } from '../../likes/domain/likes.entity';

@Controller('comments')
export class CommentsController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
    private readonly commentsQueryRepository: CommentsQueryRepository,
  ) {}

  @UseGuards(OptionalAuthGuard)
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async getCommentById(
    @Param('id', ParseIntPipe) commentId: number,
    @GetUser() user: AccessTokenPayloadDTO,
  ): Promise<CommentsResponseDTO> {
    const userId = user ? +user.userId : 0;
    return this.queryBus.execute(new GetCommentById(commentId, userId));
  }

  @UseGuards(AuthGuard('jwt'))
  @Put(':id/like-status')
  @HttpCode(HttpStatus.NO_CONTENT)
  async addLikeStatusToComment(
    @Param('id', ParseIntPipe) entityId: number,
    @Body() likeStatus: LikeStatusDto,
    @GetUser() user: AccessTokenPayloadDTO,
  ) {
    const userId = user ? +user.userId : 0;
    const entityType = EntityType.COMMENT;
    const comment = await this.commentsQueryRepository.getCommentById(
      entityId,
      userId,
    );
    if (!comment) {
      throw new NotFoundException(`Comment not found`);
    }
    await this.commandBus.execute(
      new AddUpdateLikeStatusCommand(entityId, user, likeStatus, entityType),
    );
  }

  @UseGuards(AuthGuard('jwt'))
  @Put(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async updateComment(
    @Param('id', ParseIntPipe) commentId: number,
    @Body() content: NewCommentDataDto,
    @GetUser() user: AccessTokenPayloadDTO,
  ) {
    return this.commandBus.execute(
      new UpdateCommentCommand(commentId, content, user),
    );
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteCommentById(
    @Param('id', ParseIntPipe) commentId: number,
    @GetUser() user: AccessTokenPayloadDTO,
  ) {
    return this.commandBus.execute(new DeleteCommentCommand(commentId, user));
  }
}
