import { IsString, Length } from 'class-validator';
import { TrimDecorator } from '../../../../../infrastructure/decorators/trim.decorator';

export class NewCommentDataDto {
  @TrimDecorator()
  @IsString()
  @Length(20, 300)
  content: string;
}
