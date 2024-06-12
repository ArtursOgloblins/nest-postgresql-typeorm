import { CommentsResponseDTO } from './comment-response.dto';

export class PaginatedCommentsResponse {
  pagesCount: number;
  page: number;
  pageSize: number;
  totalCount: number;
  items: CommentsResponseDTO[];
}
