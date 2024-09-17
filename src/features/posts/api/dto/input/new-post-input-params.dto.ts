import { Blogs } from '../../../../blogs/domain/blogs.entity';

export class NewPostInputDataDto {
  title: string;
  shortDescription: string;
  content: string;
  blog: Blogs;
}
