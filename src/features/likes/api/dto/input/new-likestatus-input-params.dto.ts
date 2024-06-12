import { LikeStatuses } from '../like-status.enum';
import { EntityType } from '../../../domain/likes.entity';

export class NewLikeInputDataDto {
  entityId: number;
  userId: number;
  likeStatus: LikeStatuses;
  entityType: EntityType;
}
