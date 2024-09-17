import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { BlogsRepository } from '../../infrastructure/blogs.repository';
import { BlogsQueryRepository } from '../../infrastructure/blogs.query-repository';
import { AccessTokenPayloadDTO } from '../../../auth/api/dto/input/access-token-params.dto';

export class DeleteBlogByIdCommand {
  constructor(
    public readonly blogId: number,
    public readonly user: AccessTokenPayloadDTO,
  ) {}
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
    const { blogId, user } = command;
    const blog = await this.blogsQueryRepository.findById(blogId);
    if (!blog) {
      throw new NotFoundException(`Blog not found`);
    }

    if (+user.userId !== blog.owner.id) {
      throw new ForbiddenException(`User ID does not exist`);
    }

    await this.blogsRepository.deleteBlogById(blogId);
  }
}
