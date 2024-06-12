import { IsString, Length, Matches } from 'class-validator';
import { TrimDecorator } from '../../../../../infrastructure/decorators/trim.decorator';

export class NewBlogDto {
  @TrimDecorator()
  @IsString()
  @Length(1, 15)
  name: string;

  @TrimDecorator()
  @IsString()
  @Length(1, 500)
  description: string;

  @TrimDecorator()
  @IsString()
  @Length(1, 100)
  @Matches(
    /^https:\/\/([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$/,
  )
  websiteUrl: string;
}
