import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import { PaginatedBlogsResponseDTO } from '../../api/dto/output/paginated-blogs-response.dto';
import { BlogsQueryRepository } from '../blogs.query-repository';
import { BlogQueryParamsDTO } from '../../api/dto/input/blogs-query-params.dto';

export class FindBlogs {
  constructor(public readonly params: BlogQueryParamsDTO) {}
}

@QueryHandler(FindBlogs)
export class FindBlogsQuery implements IQueryHandler<FindBlogs> {
  constructor(private blogsQueryRepository: BlogsQueryRepository) {}

  async execute(query: FindBlogs): Promise<PaginatedBlogsResponseDTO> {
    const { params } = query;

    return await this.blogsQueryRepository.findBlogs(params);
  }
}
