import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  HasMany,
  AllowNull
} from "sequelize-typescript";
import { Post } from "./post.schema";

@Table({ tableName: "user", timestamps: false, underscored: true })
export class User extends Model {
  @PrimaryKey
  @Column(DataType.STRING(32))
  id!: string;

  @AllowNull(false)
  @Column(DataType.STRING(64))
  username!: string;

  @AllowNull(false)
  @Column(DataType.STRING(256))
  avatar!: string;

  @AllowNull(false)
  @Column(DataType.STRING(2000))
  about: string;

  @AllowNull(false)
  @Column(DataType.STRING(256))
  email!: string;

  @AllowNull(false)
  @Column(DataType.DATE)
  registeredAt!: Date;

  @HasMany(() => Post)
  posts: Post[];
}
