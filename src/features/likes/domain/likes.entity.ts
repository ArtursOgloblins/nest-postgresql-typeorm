import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { LikeStatuses } from '../api/dto/like-status.enum';
import { Users } from '../../users/domain/users.entity';

export enum EntityType {
  POST = 'Post',
  COMMENT = 'Comment',
}

@Entity()
export class Likes {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column({ type: 'enum', enum: LikeStatuses, default: LikeStatuses.None })
  public status: LikeStatuses;

  @CreateDateColumn({ name: 'createdAt' })
  public createdAt: Date;

  @ManyToOne(() => Users, (user) => user.likes)
  @JoinColumn({ name: 'userId' })
  @Index()
  public user: Users;

  @Column({ type: 'enum', enum: EntityType })
  @Index()
  public entityType: EntityType;

  @Column({ type: 'int' })
  @Index()
  public entityId: number;
}
