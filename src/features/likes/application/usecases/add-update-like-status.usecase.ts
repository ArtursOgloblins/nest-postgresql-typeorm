import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { LikesQueryRepository } from '../../infrastructure/likes.query-repository';
import { LikesRepository } from '../../infrastructure/likes.repository';
import { AccessTokenPayloadDTO } from '../../../auth/api/dto/input/access-token-params.dto';
import { UsersQueryRepository } from '../../../users/infrastructure/users.query-repository';
import { LikeStatusDto } from '../../api/dto/input/like-status.dto';
import { NewLikeInputDataDto } from '../../api/dto/input/new-likestatus-input-params.dto';
import { EntityType } from '../../domain/likes.entity';

export class AddUpdateLikeStatusCommand {
  constructor(
    public readonly entityId: number,
    public readonly user: AccessTokenPayloadDTO,
    public readonly likeStatus: LikeStatusDto,
    public readonly entityType: EntityType,
  ) {}
}

@CommandHandler(AddUpdateLikeStatusCommand)
export class AddLikeStatusUseCase
  implements ICommandHandler<AddUpdateLikeStatusCommand>
{
  constructor(
    protected usersQueryRepository: UsersQueryRepository,
    protected likesQueryRepository: LikesQueryRepository,
    protected likesRepository: LikesRepository,
  ) {}

  async execute(command: AddUpdateLikeStatusCommand) {
    const { entityId, user, likeStatus, entityType } = command;

    const userId = +user.userId;
    const likeStatusData: NewLikeInputDataDto = {
      entityId: entityId,
      userId: userId,
      likeStatus: likeStatus.likeStatus,
      entityType: entityType,
    };

    console.log('likeStatusData', likeStatusData);

    const existingLikeStatus =
      await this.likesQueryRepository.getLikeStatusByEntityAndUserId(
        entityId,
        userId,
      );

    console.log('existing', existingLikeStatus);

    if (!existingLikeStatus) {
      await this.likesRepository.addLikeStatus(likeStatusData);
    } else {
      await this.likesRepository.updateLikeStatus(
        existingLikeStatus.id,
        likeStatusData.likeStatus,
      );
    }
  }
}
