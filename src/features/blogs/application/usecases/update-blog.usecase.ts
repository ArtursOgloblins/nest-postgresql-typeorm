import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { NewBlogDto } from '../../api/dto/input/new-blog.dto';
import { BlogsRepository } from '../../infrastructure/blogs.repository';
import { BlogsQueryRepository } from '../../infrastructure/blogs.query-repository';
import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { AccessTokenPayloadDTO } from '../../../auth/api/dto/input/access-token-params.dto';

export class UpdateBlogCommand {
  constructor(
    public readonly blogId: number,
    public readonly newBlogData: NewBlogDto,
    public readonly user: AccessTokenPayloadDTO,
  ) {}
}

@CommandHandler(UpdateBlogCommand)
export class UpdateBlogUseCase implements ICommandHandler<UpdateBlogCommand> {
  constructor(
    private blogsRepository: BlogsRepository,
    private blogsQueryRepository: BlogsQueryRepository,
  ) {}

  async execute(command: UpdateBlogCommand) {
    const { blogId, newBlogData, user } = command;
    const blog = await this.blogsQueryRepository.findById(blogId);
    console.log('blog', blog);
    if (!blog) {
      throw new NotFoundException(`Blog not found`);
    }

    if (+user.userId !== blog.owner.id) {
      throw new ForbiddenException(`User ID does not exist`);
    }

    return await this.blogsRepository.updateBlog(blogId, newBlogData);
  }
}
