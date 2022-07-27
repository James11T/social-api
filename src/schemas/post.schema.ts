import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  ForeignKey,
  BelongsTo,
  AllowNull,
  HasMany
} from "sequelize-typescript";
import { User } from "./user.schema";
import { PostMedia } from "./postmedia.schema";

@Table({ tableName: "post", timestamps: false, underscored: true })
export class Post extends Model {
  @PrimaryKey
  @Column(DataType.STRING(32))
  id: string;

  @AllowNull(false)
  @Column(DataType.STRING(400))
  caption!: string;

  @AllowNull(false)
  @Column(DataType.DATE)
  postedAt!: Date;

  @AllowNull(false)
  @Column(DataType.STRING(32))
  @ForeignKey(() => User)
  authorId!: string;

  @BelongsTo(() => User)
  author!: Awaited<User>;

  @HasMany(() => PostMedia)
  media: PostMedia[];

  // TODO: Link media
}
