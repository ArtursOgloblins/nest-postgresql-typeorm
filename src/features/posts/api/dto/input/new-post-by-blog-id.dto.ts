import { IsString, Length } from 'class-validator';
import { TrimDecorator } from '../../../../../infrastructure/decorators/trim.decorator';

export class NewPostByBlogIdDto {
  @TrimDecorator()
  @IsString()
  @Length(1, 30)
  title: string;

  @TrimDecorator()
  @IsString()
  @Length(1, 100)
  shortDescription: string;

  @TrimDecorator()
  @IsString()
  @Length(1, 1000)
  content: string;
}
