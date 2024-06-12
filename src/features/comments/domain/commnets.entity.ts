import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Posts } from '../../posts/domain/posts.entity';
import { Users } from '../../users/domain/users.entity';

@Entity()
export class Comments {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column({ type: 'varchar' })
  public userLogin: string;

  @Column({ type: 'varchar' })
  public content: string;

  @CreateDateColumn({ name: 'createdAt' })
  public createdAt: Date;

  @DeleteDateColumn()
  deletedAt: Date | null;

  @ManyToOne(() => Posts, (post) => post.comments)
  @JoinColumn({ name: 'postId' })
  @Index()
  public post: Posts;

  @ManyToOne(() => Users, (user) => user.comments)
  @JoinColumn({ name: 'userId' })
  @Index()
  public user: Users;
}
