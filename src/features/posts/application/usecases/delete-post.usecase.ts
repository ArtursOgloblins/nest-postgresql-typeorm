import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { BlogsQueryRepository } from '../../../blogs/infrastructure/blogs.query-repository';
import { PostsRepository } from '../../infrastructure/posts.repository';
import { AccessTokenPayloadDTO } from '../../../auth/api/dto/input/access-token-params.dto';

export class DeletePostCommand {
  constructor(
    public blogId: number,
    public postId: number,
    public user: AccessTokenPayloadDTO,
  ) {}
}

@CommandHandler(DeletePostCommand)
export class DeletePostByIdUseCase
  implements ICommandHandler<DeletePostCommand>
{
  constructor(
    private blogsQueryRepository: BlogsQueryRepository,
    private postsRepository: PostsRepository,
  ) {}

  async execute(command: DeletePostCommand): Promise<void> {
    const { postId, blogId, user } = command;

    const userId = +user.userId;
    const blog = await this.blogsQueryRepository.findById(blogId);
    if (!blog) {
      throw new NotFoundException(`Blog not found`);
    }

    if (userId !== blog.owner.id) {
      throw new ForbiddenException(`This is not your blog.`);
    }

    const post = await this.blogsQueryRepository.findPostByBlogId(
      blogId,
      postId,
    );

    if (!post) {
      throw new NotFoundException(`Post not found for this blog`);
    }

    await this.postsRepository.deletePostById(postId);
  }
}
