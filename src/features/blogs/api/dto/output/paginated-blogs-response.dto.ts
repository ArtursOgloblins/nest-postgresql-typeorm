import { BlogResponseDTO } from './blogs-response.dto';

export class PaginatedBlogsResponseDTO {
  pagesCount: number;
  page: number;
  pageSize: number;
  totalCount: number;
  items: BlogResponseDTO[];
}
