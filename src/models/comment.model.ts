import { Entity, Column, PrimaryColumn, BaseEntity, ManyToOne } from "typeorm";
import { User } from "./user.model";
import { Post } from "./post.model";
import type { Relation } from "typeorm";

@Entity()
export class Comment extends BaseEntity {
  @PrimaryColumn({ length: 36 })
  id!: string;

  @Column({ length: 1024 })
  text!: string;

  @Column({ name: "posted_at" })
  postedAt!: Date;

  @ManyToOne(() => User, (user) => user.id, { nullable: false })
  author!: Relation<User>;

  @ManyToOne(() => Post, (post) => post.id, { nullable: false })
  post!: Relation<Post>;
}
