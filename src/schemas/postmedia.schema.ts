import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  ForeignKey,
  BelongsTo,
  AllowNull
} from "sequelize-typescript";
import { Post } from "./post.schema";

@Table({ tableName: "post_media", timestamps: false, underscored: true })
export class PostMedia extends Model {
  @PrimaryKey
  @Column(DataType.STRING(32))
  id: string;

  @AllowNull(false)
  @Column(DataType.STRING(256))
  url!: string;

  @AllowNull(false)
  @Column(DataType.STRING(32))
  type!: string;

  @AllowNull(false)
  @Column(DataType.STRING(32))
  @ForeignKey(() => Post)
  postId!: string;

  @BelongsTo(() => Post)
  post!: Awaited<Post>;

  // TODO: Link media
}
