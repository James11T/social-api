import { Entity, Column, PrimaryColumn, BaseEntity, ManyToOne } from "typeorm";
import { Post } from "./post.model";
import type { Relation } from "typeorm";

@Entity()
export class PostMedia extends BaseEntity {
  @PrimaryColumn({ length: 36 })
  id!: string;

  @Column({ length: 256 })
  url!: string;

  @Column({ length: 32 })
  type!: string;

  @Column()
  index!: number;

  @ManyToOne(() => Post, (post) => post.id, { nullable: false })
  post!: Relation<Post>;
}
