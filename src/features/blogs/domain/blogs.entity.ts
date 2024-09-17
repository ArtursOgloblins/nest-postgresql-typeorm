import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Posts } from '../../posts/domain/posts.entity';
import { Users } from '../../users/domain/users.entity';

@Entity()
export class Blogs {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column({ type: 'varchar' })
  public name: string;

  @Column({ type: 'varchar' })
  public description: string;

  @Column({ type: 'varchar' })
  public websiteUrl: string;

  @Column({ default: false })
  public isMembership: boolean;

  @ManyToOne(() => Users, (user) => user.blogs, { nullable: true })
  @JoinColumn({ name: 'blogOwnerId' })
  public owner: Users | null;

  @CreateDateColumn({ name: 'createdAt' })
  public createdAt: Date;

  @DeleteDateColumn()
  deletedAt: Date | null;

  @OneToMany(() => Posts, (post) => post.blog)
  public post: Posts[];
}
