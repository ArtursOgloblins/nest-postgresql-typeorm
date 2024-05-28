import { IsString, Length } from 'class-validator';
import { TrimDecorator } from '../../../../../../infrastructure/decorators/trim.decorator';

export class DeviceIdInputDto {
  @TrimDecorator()
  @IsString()
  @Length(1)
  deviceId: string;
}
