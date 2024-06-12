import { PostsResponseDTO } from './posts-response.dto';

export class PaginatedPostsResponseDto {
  pagesCount: number;
  page: number;
  pageSize: number;
  totalCount: number;
  items: PostsResponseDTO[];
}
