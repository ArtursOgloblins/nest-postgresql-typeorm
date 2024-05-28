import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Users } from '../../users/domain/users.entity';

@Entity()
export class RefreshToken {
  @PrimaryGeneratedColumn()
  public id: string;

  @Column({ type: 'varchar' })
  public deviceName: string;

  @Column()
  @Column({ type: 'varchar' })
  public ip: string;

  @Column({ type: 'varchar' })
  public deviceId: string;

  @CreateDateColumn({ name: 'createdAt' })
  public createdAt: Date;

  @Column()
  public expiringAt: Date;

  @ManyToOne(() => Users, (user) => user.refreshToken)
  public user: Users;
}
