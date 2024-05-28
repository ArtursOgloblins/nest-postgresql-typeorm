export class UserQueryParamsDTO {
  sortBy: string = 'createdAt';
  sortDirection: 'asc' | 'desc' = 'desc';
  pageNumber: number = 1;
  pageSize: number = 10;
  searchLoginTerm: string = '';
  searchEmailTerm: string = '';
}
