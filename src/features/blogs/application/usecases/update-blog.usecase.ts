import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { NewBlogDto } from '../../api/dto/input/new-blog.dto';
import { BlogsRepository } from '../../infrastructure/blogs.repository';
import { BlogsQueryRepository } from '../../infrastructure/blogs.query-repository';
import { NotFoundException } from '@nestjs/common';

export class UpdateBlogCommand {
  constructor(
    public readonly blogId: number,
    public readonly newBlogData: NewBlogDto,
  ) {}
}

@CommandHandler(UpdateBlogCommand)
export class UpdateBlogUseCase implements ICommandHandler<UpdateBlogCommand> {
  constructor(
    private blogsRepository: BlogsRepository,
    private blogsQueryRepository: BlogsQueryRepository,
  ) {}

  async execute(command: UpdateBlogCommand) {
    const { blogId, newBlogData } = command;
    const blog = await this.blogsQueryRepository.findById(blogId);
    if (!blog) {
      throw new NotFoundException(`Blog not found`);
    }

    return await this.blogsRepository.updateBlog(blogId, newBlogData);
  }
}
