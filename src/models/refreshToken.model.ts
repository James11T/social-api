import { Entity, Column, PrimaryColumn, BaseEntity, ManyToOne } from "typeorm";
import { User } from "./user.model";
import type { Relation } from "typeorm";

@Entity()
export class RefreshToken extends BaseEntity {
  @PrimaryColumn({ length: 336 })
  id!: string;

  @Column({ length: 36 })
  subjectId!: string;

  @Column()
  expiresAt!: Date;

  @Column()
  issuedAt!: Date;

  @Column({ length: 64, default: "unknown" })
  deviceType!: string;

  @Column({ length: 39 })
  sourceIp!: string;

  @Column({ default: false })
  isRevoked!: boolean;

  @ManyToOne(() => User, (user) => user.id)
  subject!: Relation<User>;
}
