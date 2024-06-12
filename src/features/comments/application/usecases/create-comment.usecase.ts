import { AccessTokenPayloadDTO } from '../../../auth/api/dto/input/access-token-params.dto';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CommentsRepository } from '../../infrastructure/comments.repository';
import { CommentsQueryRepository } from '../../infrastructure/comments.query-repository';
import { PostsQueryRepository } from '../../../posts/infrastructure/posts.query-repository';
import { UsersQueryRepository } from '../../../users/infrastructure/users.query-repository';
import { NotFoundException } from '@nestjs/common';
import { NewCommentInputDataDto } from '../../api/dto/input/new-comment-input-data.dto';
import { CommentsResponseDTO } from '../../api/dto/output/comment-response.dto';

export class CreateCommentCommand {
  constructor(
    public readonly postId: number,
    public readonly content: string,
    public readonly user: AccessTokenPayloadDTO,
  ) {}
}

@CommandHandler(CreateCommentCommand)
export class CreateCommentUseCase
  implements ICommandHandler<CreateCommentCommand>
{
  constructor(
    protected commentsRepository: CommentsRepository,
    protected commentsQueryRepository: CommentsQueryRepository,
    protected postsQueryRepository: PostsQueryRepository,
    protected usersQueryRepository: UsersQueryRepository,
  ) {}

  async execute(command: CreateCommentCommand): Promise<CommentsResponseDTO> {
    const { user, content, postId } = command;

    const post = await this.postsQueryRepository.findPost(postId);
    if (!post) {
      throw new NotFoundException(`Post with ID ${postId} not found.`);
    }

    const userId = +user.userId;
    const newCommentModel: NewCommentInputDataDto = {
      userId,
      postId,
      content,
    };

    const newComment =
      await this.commentsRepository.addComment(newCommentModel);

    const newCommentId = newComment.id;

    const newCommentData = await this.commentsQueryRepository.getCommentById(
      newCommentId,
      userId,
    );
    return new CommentsResponseDTO(
      newCommentData.commentData,
      newCommentData.likesCount,
      newCommentData.dislikesCount,
      newCommentData.myLikeStatus,
    );
  }
}
