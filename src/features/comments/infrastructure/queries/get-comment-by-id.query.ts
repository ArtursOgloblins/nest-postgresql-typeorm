import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { NotFoundException } from '@nestjs/common';
import { CommentsQueryRepository } from '../comments.query-repository';
import { CommentsResponseDTO } from '../../api/dto/output/comment-response.dto';

export class GetCommentById {
  constructor(
    public readonly commentId: number,
    public readonly userId: number,
  ) {}
}

@QueryHandler(GetCommentById)
export class GetCommentByIdQuery implements IQueryHandler<GetCommentById> {
  constructor(
    private readonly commentsQueryRepository: CommentsQueryRepository,
  ) {}

  async execute(query: GetCommentById): Promise<CommentsResponseDTO> {
    const { commentId, userId } = query;

    const comment = await this.commentsQueryRepository.getCommentById(
      commentId,
      userId,
    );

    if (!comment) {
      throw new NotFoundException(`Comment not found`);
    }

    console.log('comment', comment);

    return new CommentsResponseDTO(
      comment.commentData,
      comment.likesCount,
      comment.dislikesCount,
      comment.myLikeStatus,
    );
  }
}
