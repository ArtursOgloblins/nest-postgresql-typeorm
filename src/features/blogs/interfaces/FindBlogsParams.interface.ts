import { BlogQueryParamsDTO } from '../api/dto/input/blogs-query-params.dto';

export interface IFindBlogsParams {
  params: BlogQueryParamsDTO;
  isSuperAdmin: boolean;
}
