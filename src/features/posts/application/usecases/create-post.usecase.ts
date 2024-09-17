import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BlogsQueryRepository } from '../../../blogs/infrastructure/blogs.query-repository';
import { PostsResponseDTO } from '../../api/dto/output/posts-response.dto';
import { PostsQueryRepository } from '../../infrastructure/posts.query-repository';
import { PostsRepository } from '../../infrastructure/posts.repository';
import { AccessTokenPayloadDTO } from '../../../auth/api/dto/input/access-token-params.dto';
import { ForbiddenException, NotFoundException } from '@nestjs/common';

interface CreatePostInputData {
  title: string;
  shortDescription: string;
  content: string;
  blogId: number;
}

export class CreatePostCommand {
  constructor(
    public readonly inputData: CreatePostInputData,
    public readonly user: AccessTokenPayloadDTO,
  ) {}
}

@CommandHandler(CreatePostCommand)
export class CreatePostUseCase implements ICommandHandler<CreatePostCommand> {
  constructor(
    protected blogsQueryRepository: BlogsQueryRepository,
    protected postsRepository: PostsRepository,
    protected postsQueryRepository: PostsQueryRepository,
  ) {}

  async execute(command: CreatePostCommand): Promise<PostsResponseDTO> {
    const { title, shortDescription, content, blogId } = command.inputData;
    const { user } = command;
    const userId = +user.userId;

    const blog = await this.blogsQueryRepository.findById(blogId);
    if (!blog) {
      throw new NotFoundException(`Blog not found`);
    }

    if (userId !== blog.owner.id) {
      throw new ForbiddenException(`This is not your blog.`);
    }

    const newPostModel = {
      blog,
      title,
      shortDescription,
      content,
    };

    const res = await this.postsRepository.registerPost(newPostModel);
    if (!res || !res.id) {
      throw new Error('Failed to create post');
    }
    //this.eventBus.publish(new BlogCreatedEvent(newBlog._id));

    const newPost = await this.postsQueryRepository.findById(res.id, userId);

    if (!newPost) {
      throw new Error('Failed to retrieve newly created post');
    }
    console.log('newPost', newPost);
    return newPost;
  }
}
