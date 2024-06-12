import { NotFoundException } from '@nestjs/common';
import { CommentsQueryParamsDto } from '../../api/dto/input/comments-query-params.dto';
import { AccessTokenPayloadDTO } from '../../../auth/api/dto/input/access-token-params.dto';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { CommentsQueryRepository } from '../comments.query-repository';
import { PostsQueryRepository } from '../../../posts/infrastructure/posts.query-repository';
import { PaginatedCommentsResponse } from '../../api/dto/output/paginated-comments.response.dto';

export class GetAllCommentsByPostId {
  constructor(
    public readonly postId: number,
    public readonly queryParams: CommentsQueryParamsDto,
    public readonly user: AccessTokenPayloadDTO,
  ) {}
}
@QueryHandler(GetAllCommentsByPostId)
export class GetAllCommentsByPostIdQuery
  implements IQueryHandler<GetAllCommentsByPostId>
{
  constructor(
    private readonly commentsQueryRepository: CommentsQueryRepository,
    private readonly postsQueryRepository: PostsQueryRepository,
  ) {}

  async execute(
    query: GetAllCommentsByPostId,
  ): Promise<PaginatedCommentsResponse> {
    const { postId, queryParams, user } = query;
    const userId = user ? user.userId : 0;

    const post = await this.postsQueryRepository.findPost(postId);

    if (!post) {
      throw new NotFoundException(`Post not found`);
    }

    return await this.commentsQueryRepository.getCommentsByPostId(
      postId,
      queryParams,
      +userId,
    );
  }
}
