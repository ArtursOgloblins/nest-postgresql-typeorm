import { TrimDecorator } from '../../../../../infrastructure/decorators/trim.decorator';
import { IsEnum } from 'class-validator';
import { LikeStatuses } from '../like-status.enum';

export class LikeStatusDto {
  @TrimDecorator()
  @IsEnum(LikeStatuses)
  likeStatus: LikeStatuses;
}
