import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Users } from './users.entity';

@Entity()
export class UserBans {
  @PrimaryGeneratedColumn()
  public id: number;

  @ManyToOne(() => Users, (user) => user.bans)
  @JoinColumn({ name: 'userId' })
  public user: Users;

  @Column({ type: 'varchar' })
  public banReason: string;

  @CreateDateColumn({ name: 'bannedAt' })
  public bannedAt: Date;

  @Column({ type: 'boolean', default: false })
  public isActiveBan: boolean;
}
