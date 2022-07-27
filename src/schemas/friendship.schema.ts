import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  AllowNull,
  BelongsTo
} from "sequelize-typescript";
import { User } from "./user.schema";

@Table({ tableName: "friendship", timestamps: false, underscored: true })
export class Friendship extends Model {
  @PrimaryKey
  @Column(DataType.STRING(32))
  userFromId!: string;

  @PrimaryKey
  @Column(DataType.STRING(32))
  userToId!: string;

  @BelongsTo(() => User, "userFromId")
  userFrom: User;

  @BelongsTo(() => User, "userToId")
  userTo: User;

  @AllowNull(false)
  @Column(DataType.DATE)
  sentAt!: Date;

  @AllowNull(false)
  @Column(DataType.DATE)
  acceptedAt: Date;

  @AllowNull(false)
  @Column(DataType.BOOLEAN)
  accepted: boolean = false;
}
