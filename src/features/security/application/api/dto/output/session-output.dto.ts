import { RefreshToken } from '../../../../../auth/domain/auth.refresh-token.entity';

export class ActiveSessionOutputDTO {
  ip: string;
  title: string;
  lastActiveDate: string;
  deviceId: string;

  constructor(session: RefreshToken) {
    this.ip = session.ip;
    this.title = session.deviceName;
    this.lastActiveDate = session.createdAt.toISOString();
    this.deviceId = session.deviceId;
  }
}
