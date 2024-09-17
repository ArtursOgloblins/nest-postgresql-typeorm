import { BlogsSaResponseDTO } from './blogs-sa-response.dto';

export class PaginatedBlogsSaResponseDTO {
  pagesCount: number;
  page: number;
  pageSize: number;
  totalCount: number;
  items: BlogsSaResponseDTO[];
}
