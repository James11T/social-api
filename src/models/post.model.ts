import { Entity, Column, PrimaryColumn, BaseEntity, ManyToOne, OneToMany,  Relation} from "typeorm";
import { User } from "./user.model";
import { PostMedia } from "./postMedia.model";

@Entity()
export class Post extends BaseEntity {
  @PrimaryColumn({ length: 36 })
  id!: string;

  @Column({ length: 400 })
  caption!: string;

  @Column({ name: "posted_at" })
  postedAt!: Date;

  @ManyToOne(() => User, (user) => user.id, { nullable: false })
  author!: Relation<User>;

  @OneToMany(() => PostMedia, (postMedia) => postMedia.id)
  media!: PostMedia[];
}
