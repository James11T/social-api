import BaseModel from "./base";
import { Post } from "./post.model";
import { Ok, Err } from "ts-results";
import { uuid } from "../utils/strings";
import { UserTOTP } from "./userTOTP.model";
import { Friendship } from "./friendship.model";
import { RefreshToken } from "./refreshToken.model";
import {
  Entity,
  Column,
  PrimaryColumn,
  OneToMany,
  BeforeInsert,
  FindOptionsWhere,
  Brackets
} from "typeorm";
import type { Result } from "ts-results";
import type { Relation, FindOneOptions } from "typeorm";

type FETCH_USER_ERRORS = "FAILED_TO_FETCH_USER";

@Entity()
export class User extends BaseModel {
  @PrimaryColumn({ length: 36, default: "" })
  id!: string;

  @Column({ length: 64, nullable: false, unique: true })
  username!: string;

  @Column({ length: 255, nullable: true, type: "varchar" })
  avatar: string | null = null;

  @Column({ length: 2000, default: "" })
  about!: string;

  @Column({ length: 255 })
  email!: string;

  @Column({ name: "email_verified", default: false })
  emailVerified!: boolean;

  @Column({ name: "registered_at" })
  registeredAt!: Date;

  @Column({ length: 255, name: "password_hash" })
  passwordHash!: string;

  @OneToMany(() => Post, (post) => post.author)
  posts!: Relation<Post>[];

  @OneToMany(() => UserTOTP, (userTotp) => userTotp.user)
  TOTPs!: Relation<UserTOTP>[];

  @OneToMany(() => RefreshToken, (refreshToken) => refreshToken.subject)
  refreshTokens!: Relation<RefreshToken>[];

  @OneToMany(() => Friendship, (friendship) => friendship.userFrom)
  @OneToMany(() => Friendship, (friendship) => friendship.userTo)
  friendships!: Relation<Friendship>[];

  @BeforeInsert()
  private generateId() {
    this.id = this.id ?? uuid();
  }

  async checkTOTP(
    token: string
  ): Promise<
    Result<boolean, "NO_ACTIVE_2FA" | "INVALID_TOTP" | "FAILED_TO_VERIFY_TOTP">
  > {
    const userTOTPs = await UserTOTP.find({
      relations: ["user"],
      where: { id: this.id, activated: true }
    });
    if (userTOTPs.length === 0) return Err("NO_ACTIVE_2FA");

    let isAnyValid = true;
    for (const userTOTP of userTOTPs) {
      const isValid = userTOTP.checkCode(token);
      if (isValid.err) return Err(isValid.val);
      isAnyValid = isAnyValid && isValid.val;
    }

    return Ok(isAnyValid);
  }

  async has2FA(): Promise<boolean> {
    const userTOTPs = await UserTOTP.find({
      relations: ["user"],
      where: { id: this.id, activated: true }
    });
    return userTOTPs.length > 0;
  }

  private static async fetchUser(
    query: FindOneOptions<User>
  ): Promise<Result<User | null, FETCH_USER_ERRORS>> {
    try {
      const user = await User.findOne(query);
      return Ok(user);
    } catch {
      return Err("FAILED_TO_FETCH_USER");
    }
  }

  static async fromEmail(email: string) {
    return await User.fetchUser({ where: { email } });
  }

  static async fromUsername(username: string) {
    return await User.fetchUser({ where: { username } });
  }

  static async fromId(id: string) {
    return await User.fetchUser({ where: { id } });
  }

  private async getFriendRequests(
    query: FindOptionsWhere<Friendship>
  ): Promise<Result<Friendship[], "FAILED_TO_GET_FRIEND_REQUESTS">> {
    try {
      const FRs = await Friendship.find({
        where: {
          accepted: false,
          ...query
        }
      });
      return Ok(FRs);
    } catch (err) {
      console.error(err);
      return Err("FAILED_TO_GET_FRIEND_REQUESTS");
    }
  }

  public async getIncomingFriendRequests() {
    return this.getFriendRequests({
      userToId: this.id
    });
  }

  public async getOutgoingFriendRequests() {
    return this.getFriendRequests({
      userFromId: this.id
    });
  }

  public async isFriendsWith(
    friend: User
  ): Promise<Result<boolean, "FAILED_TO_CHECK_FRIEND">> {
    try {
      const sql = Friendship.createQueryBuilder("FR")
        .where(
          new Brackets((qb) =>
            qb
              .where("FR.userFromId=:userFromId", { userFromId: this.id })
              .andWhere("FR.userToId=:userToId", { userToId: friend.id })
              .andWhere(`FR.accepted=TRUE`)
          )
        )
        .orWhere(
          new Brackets((qb) =>
            qb
              .where("FR.userFromId=:userFromId", { userFromId: friend.id })
              .andWhere("FR.userToId=:userToId", { userToId: this.id })
              .andWhere(`FR.accepted=TRUE`)
          )
        );

      return Ok(Boolean(await sql.getOne()));
    } catch (err) {
      console.error(err);
      return Err("FAILED_TO_CHECK_FRIEND");
    }
  }

  public async getFriends(): Promise<Result<User[], "FAILED_TO_GET_FRIENDS">> {
    try {
      const sql = User.createQueryBuilder("USER")
        .innerJoin(
          Friendship,
          "FR",
          "(FR.userFromId=USER.id OR FR.userToId=USER.id) AND (FR.userFromId=:userId OR FR.userToId=:userId)",
          { userId: this.id }
        )
        .where("USER.id!=:userId", { userId: this.id })
        .andWhere("FR.accepted=true");
      return Ok(await sql.getMany());
    } catch (err) {
      console.error(err);
      return Err("FAILED_TO_GET_FRIENDS");
    }
  }
}
