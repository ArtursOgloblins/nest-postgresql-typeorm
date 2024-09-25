import { TrimDecorator } from '../../../../../infrastructure/decorators/trim.decorator';
import { IsBoolean, IsString, Length } from 'class-validator';

export class BanUserDto {
  @IsBoolean()
  isBanned: boolean;

  @TrimDecorator()
  @IsString()
  @Length(20)
  banReason: string;
}
