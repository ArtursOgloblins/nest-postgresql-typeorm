import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CommentsRepository } from '../../infrastructure/comments.repository';
import { CommentsQueryRepository } from '../../infrastructure/comments.query-repository';
import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { UpdateResult } from 'typeorm';

export class DeleteCommentCommand {
  constructor(
    public readonly commentId: number,
    public readonly user: any,
  ) {}
}

@CommandHandler(DeleteCommentCommand)
export class DeleteCommentUseCase
  implements ICommandHandler<DeleteCommentCommand>
{
  constructor(
    protected commentsRepository: CommentsRepository,
    protected commentsQueryRepository: CommentsQueryRepository,
  ) {}

  async execute(command: DeleteCommentCommand): Promise<UpdateResult> {
    const { commentId, user } = command;
    const userId = user.userId;

    const comment = await this.commentsQueryRepository.findComment(commentId);

    if (!comment) {
      throw new NotFoundException(`Comment not found`);
    }

    if (userId != comment.user.id) {
      throw new ForbiddenException(`User not allowed to delete this comment`);
    }

    return await this.commentsRepository.deleteCommentById(commentId);
  }
}
