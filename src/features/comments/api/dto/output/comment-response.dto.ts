import { LikeStatuses } from '../../../../likes/api/dto/like-status.enum';
import { Comments } from '../../../domain/commnets.entity';

class CommentatorInfo {
  userId: string;
  userLogin: string;
}

class LikesInfo {
  likesCount: number;
  dislikesCount: number;
  myStatus: LikeStatuses;
}

export class CommentsResponseDTO {
  id: string;
  content: string;
  commentatorInfo: CommentatorInfo;
  createdAt: string;
  likesInfo: LikesInfo;

  constructor(
    comment: Comments,
    likesCount: number,
    dislikesCount: number,
    myStatus: LikeStatuses,
  ) {
    this.id = comment.id.toString();
    this.content = comment.content;
    this.commentatorInfo = {
      userId: comment.user.id.toString(),
      userLogin: comment.userLogin,
    };
    this.createdAt = comment.createdAt.toISOString();
    this.likesInfo = {
      likesCount: likesCount,
      dislikesCount: dislikesCount,
      myStatus: myStatus,
    };
  }
}
