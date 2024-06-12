import { Posts } from '../../../domain/posts.entity';
import { LikeStatuses } from '../../../../likes/api/dto/like-status.enum';

class NewestLikesDTO {
  addedAt: string;
  userId: string;
  login: string;
}

export class ExtendedLikesInfoDTO {
  likesCount: number;
  dislikesCount: number;
  myStatus: string;
  newestLikes: NewestLikesDTO[];
}

export class PostsResponseDTO {
  id: string;
  title: string;
  shortDescription: string;
  content: string;
  blogId: string;
  blogName: string;
  createdAt: string;
  extendedLikesInfo: ExtendedLikesInfoDTO;

  constructor(
    post: Posts,
    likesCount: number,
    dislikesCount: number,
    myStatus: LikeStatuses,
    newestLikes: NewestLikesDTO[],
  ) {
    this.id = post.id.toString();
    this.title = post.title;
    this.shortDescription = post.shortDescription;
    this.content = post.content;
    this.blogId = post.blog.id.toString();
    this.blogName = post.blog.name;
    this.createdAt = post.createdAt.toISOString();
    this.extendedLikesInfo = {
      likesCount: likesCount,
      dislikesCount: dislikesCount,
      myStatus: myStatus,
      newestLikes: newestLikes,
    };
  }
}
