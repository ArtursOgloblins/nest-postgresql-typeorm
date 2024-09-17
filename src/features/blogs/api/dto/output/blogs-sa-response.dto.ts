import { BlogResponseDTO } from './blogs-response.dto';
import { Blogs } from '../../../domain/blogs.entity';

export class BlogsSaResponseDTO extends BlogResponseDTO {
  blogOwnerInfo: {
    userId: string | null;
    userLogin: string | null;
  };

  constructor(blog: Blogs) {
    super(blog);

    this.blogOwnerInfo = {
      userId: blog.owner ? blog.owner.id.toString() : null,
      userLogin: blog.owner ? blog.owner.login : null,
    };
  }
}
