import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { NotFoundException } from '@nestjs/common';
import { BlogsQueryRepository } from '../../../blogs/infrastructure/blogs.query-repository';
import { PostsRepository } from '../../infrastructure/posts.repository';

export class DeletePostCommand {
  constructor(
    public blogId: number,
    public postId: number,
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
    const { postId, blogId } = command;
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
