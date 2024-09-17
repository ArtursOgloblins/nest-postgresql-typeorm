import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import { PaginatedBlogsResponseDTO } from '../../api/dto/output/paginated-blogs-response.dto';
import { BlogsQueryRepository } from '../blogs.query-repository';
import { IFindBlogsParams } from '../../interfaces/FindBlogsParams.interface';
import { AccessTokenPayloadDTO } from '../../../auth/api/dto/input/access-token-params.dto';

export class FindBlogs {
  constructor(
    public readonly params: IFindBlogsParams,
    public readonly user: AccessTokenPayloadDTO,
  ) {}
}

@QueryHandler(FindBlogs)
export class FindBlogsQuery implements IQueryHandler<FindBlogs> {
  constructor(private blogsQueryRepository: BlogsQueryRepository) {}

  async execute(query: FindBlogs): Promise<PaginatedBlogsResponseDTO> {
    const { params, user } = query;
    const queryParams = params.params;
    const isSuperAdmin = params.isSuperAdmin;
    const userId = +user.userId;

    if (!isSuperAdmin) {
      return await this.blogsQueryRepository.findBlogs(queryParams, userId);
    } else {
      return await this.blogsQueryRepository.findBlogsSuperAdmin(queryParams);
    }
  }
}
