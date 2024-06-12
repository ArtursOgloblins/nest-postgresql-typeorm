import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { PostsQueryRepository } from '../posts.query-repository';
import { PaginatedPostsResponseDto } from '../../api/dto/output/paginated-posts-response.dto';
import { PostsQueryParamsDTO } from '../../api/dto/input/posts-query-params.dto';

export class GetPostsByBlogId {
  constructor(
    public readonly blogId: number,
    public readonly queryParams: PostsQueryParamsDTO,
    public readonly userId: number,
  ) {}
}

@QueryHandler(GetPostsByBlogId)
export class GetPostsByBlogQuery implements IQueryHandler<GetPostsByBlogId> {
  constructor(private postsQueryRepository: PostsQueryRepository) {}

  async execute(query: GetPostsByBlogId): Promise<PaginatedPostsResponseDto> {
    const { blogId, queryParams, userId } = query;

    return await this.postsQueryRepository.getPostsByBlogId(
      blogId,
      queryParams,
      userId,
    );
  }
}
