import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { NotFoundException } from '@nestjs/common';
import { BlogsRepository } from '../../infrastructure/blogs.repository';
import { BlogsQueryRepository } from '../../infrastructure/blogs.query-repository';

export class DeleteBlogByIdCommand {
  constructor(public readonly blogId: number) {}
}

@CommandHandler(DeleteBlogByIdCommand)
export class DeleteBlogByIdUseCase
  implements ICommandHandler<DeleteBlogByIdCommand>
{
  constructor(
    private blogsRepository: BlogsRepository,
    private blogsQueryRepository: BlogsQueryRepository,
  ) {}

  async execute(command: DeleteBlogByIdCommand) {
    const { blogId } = command;
    const blog = await this.blogsQueryRepository.findById(blogId);
    if (!blog) {
      throw new NotFoundException(`Blog not found`);
    }
    await this.blogsRepository.deleteBlogById(blogId);
  }
}
