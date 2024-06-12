import { Injectable, NotFoundException, PipeTransform } from '@nestjs/common';
import { BlogsQueryRepository } from '../../features/blogs/infrastructure/blogs.query-repository';

@Injectable()
export class ValidateBlogExistencePipe implements PipeTransform {
  constructor(protected blogsQueryRepository: BlogsQueryRepository) {}

  async transform(value: any) {
    const blogId = value;
    const blog = await this.blogsQueryRepository.findById(blogId);
    if (!blog) {
      throw new NotFoundException(`Blog with ID ${blogId} not found.`);
    }
    return value;
  }
}
