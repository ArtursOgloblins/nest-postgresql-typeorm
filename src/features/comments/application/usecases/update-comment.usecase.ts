import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CommentsRepository } from '../../infrastructure/comments.repository';
import { CommentsQueryRepository } from '../../infrastructure/comments.query-repository';
import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { NewCommentDataDto } from '../../api/dto/input/new-comment.dto';
import { AccessTokenPayloadDTO } from '../../../auth/api/dto/input/access-token-params.dto';

export class UpdateCommentCommand {
  constructor(
    public readonly commentId: number,
    public readonly content: NewCommentDataDto,
    public readonly user: AccessTokenPayloadDTO,
  ) {}
}

@CommandHandler(UpdateCommentCommand)
export class UpdateCommentUseCase
  implements ICommandHandler<UpdateCommentCommand>
{
  constructor(
    protected commentsRepository: CommentsRepository,
    protected commentsQueryRepository: CommentsQueryRepository,
  ) {}

  async execute(command: UpdateCommentCommand) {
    const { commentId, content, user } = command;

    const comment = await this.commentsQueryRepository.findComment(commentId);

    if (!comment) {
      throw new NotFoundException(`Comment not found.`);
    }

    if (+user.userId != comment.user.id) {
      throw new ForbiddenException(`User not allowed to change this comment`);
    }

    return await this.commentsRepository.updateComment(commentId, content);
  }
}
