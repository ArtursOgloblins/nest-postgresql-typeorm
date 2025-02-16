import { IsIn, IsInt, IsOptional, IsString, Min } from 'class-validator';
import { Transform } from 'class-transformer';

export class PostsQueryParamsDTO {
  @IsOptional()
  @IsString()
  @Transform(({ value }) => value ?? 'createdAt')
  sortBy: string;

  @IsOptional()
  @IsIn(['asc', 'desc'])
  @Transform(({ value }) => value ?? 'desc')
  sortDirection: 'asc' | 'desc';

  @IsOptional()
  @IsInt()
  @Min(1)
  @Transform(({ value }) => value ?? 1, { toClassOnly: true })
  pageNumber: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Transform(({ value }) => value ?? 10, { toClassOnly: true })
  pageSize: number;
}
