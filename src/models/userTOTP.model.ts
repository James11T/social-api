import { Err, Ok } from "ts-results";
import { authenticator } from "otplib";
import { Entity, Column, PrimaryColumn, ManyToOne, BeforeInsert } from "typeorm";
import BaseModel from "./base";
import { User } from "./user.model";
import { uuid } from "../utils/strings";
import type { Relation } from "typeorm";
import type { Result } from "ts-results";

export enum TOTPSource {}

@Entity()
export class UserTOTP extends BaseModel {
  @PrimaryColumn({ length: 36 })
  id!: string;

  @Column({ default: false })
  activated!: boolean;

  @Column({ length: 128 })
  secret!: string;

  @ManyToOne(() => User, (user) => user.id, { nullable: false })
  user!: Relation<User>;

  @BeforeInsert()
  private generateId() {
    this.id = this.id ?? uuid();
  }

  public checkCode(token: string): Result<boolean, "INVALID_TOTP" | "FAILED_TO_VERIFY_TOTP"> {
    if (token.length < 6) return Err("INVALID_TOTP");

    try {
      const isValid = authenticator.check(token, this.secret);
      return Ok(isValid);
    } catch (err) {
      console.error(err);
      return Err("FAILED_TO_VERIFY_TOTP");
    }
  }

  public static async byId(
    id: string,
    user?: User
  ): Promise<Result<UserTOTP | null, "FAILED_TO_GET_TOTP">> {
    try {
      const userTotp = await UserTOTP.findOneBy({
        id,
        user: user ? { id: user.id } : undefined,
      });
      return Ok(userTotp);
    } catch (err) {
      return Err("FAILED_TO_GET_TOTP");
    }
  }
}
