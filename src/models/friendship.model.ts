import { Ok, Err } from "ts-results";
import { Entity, PrimaryColumn, Column, ManyToOne, JoinColumn, Relation } from "typeorm";
import BaseModel from "./base";
import { User } from "./user.model";
import type { Result } from "ts-results";

enum FriendshipState {
  NOT_FRIENDS,
  PENDING,
  FRIENDS,
}

@Entity()
export class Friendship extends BaseModel {
  @PrimaryColumn({ length: 36 })
  userFromId!: string;

  @PrimaryColumn({ length: 36 })
  userToId!: string;

  @Column()
  sentAt!: Date;

  @Column({ nullable: true })
  acceptedAt!: Date;

  @Column({ default: false })
  accepted!: boolean;

  @ManyToOne(() => User, (user) => user.friendships)
  @JoinColumn({ name: "userFromId" })
  userFrom!: Relation<User>;

  @ManyToOne(() => User, (user) => user.friendships)
  @JoinColumn({ name: "userToId" })
  userTo!: Relation<User>;

  static async getFriendshipState(
    user1: User,
    user2: User
  ): Promise<Result<FriendshipState, "FAILED_TO_CHECK_FRIENDSHIP">> {
    try {
      const friendship = await Friendship.findOne({
        where: [
          { userFromId: user1.id, userToId: user2.id },
          { userFromId: user2.id, userToId: user1.id },
        ],
      });

      if (!friendship) return Ok(FriendshipState.NOT_FRIENDS);
      if (!friendship.accepted) return Ok(FriendshipState.PENDING);
      if (friendship.accepted) return Ok(FriendshipState.FRIENDS);

      return Ok(FriendshipState.NOT_FRIENDS);
    } catch (err) {
      return Err("FAILED_TO_CHECK_FRIENDSHIP");
    }
  }
}

export { FriendshipState };
