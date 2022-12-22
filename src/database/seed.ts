import "dotenv/config";
import chalk from "chalk";
import { Friendship, User } from "../models";
import format from "../utils/console";
import { initializeDatabase } from ".";

const shouldBuild = process.argv[2]?.toLowerCase().trim() === "build";

const generateUser = (index: number) => ({
  id: `random-uuid-${index}`,
  username: `user${index}`,
  about: `User #${index}`,
  email: `user${index}@kakaposocial.com`,
  registeredAt: new Date(),
  passwordHash: "abc123",
});

const users = [
  generateUser(0),
  generateUser(1),
  generateUser(2),
  generateUser(3),
  generateUser(4),
  generateUser(5),
];

const seed = async () => {
  try {
    await initializeDatabase();
    console.log(format.success("Database connected successfully"));
  } catch (err) {
    console.log(format.fail("Failed to connect to database"));
  }

  if (shouldBuild) console.log(format.dev("Building DB"));

  if (shouldBuild) {
    try {
      for (const user of users) {
        const newUser = new User();
        newUser.id = user.id;
        newUser.username = user.username;
        newUser.about = user.about;
        newUser.email = user.email;
        newUser.registeredAt = user.registeredAt;
        newUser.passwordHash = user.passwordHash;
        await newUser.save();
      }
      console.log(format.success(`Successfully seeded ${chalk.bold(users.length)} users`));
    } catch (err) {
      console.error(err);
      console.log(format.fail("Failed to seed database"));
    }
  }

  const user0 = await User.findOne({ where: { username: users[0].username } });
  const user1 = await User.findOne({ where: { username: users[1].username } });
  const user2 = await User.findOne({ where: { username: users[2].username } });
  const user3 = await User.findOne({ where: { username: users[3].username } });

  if (!user0 || !user1 || !user2 || !user3) return console.log(format.fail("Failed to get users"));

  if (shouldBuild) {
    const friendship1 = new Friendship();
    friendship1.userFrom = user0;
    friendship1.userTo = user1;
    friendship1.sentAt = new Date();
    friendship1.accepted = true;
    await friendship1.save();

    const friendship2 = new Friendship();
    friendship2.userFrom = user0;
    friendship2.userTo = user2;
    friendship2.sentAt = new Date();
    friendship2.accepted = true;
    await friendship2.save();

    const friendship3 = new Friendship();
    friendship3.userFrom = user1;
    friendship3.userTo = user3;
    friendship3.sentAt = new Date();
    friendship3.accepted = true;
    await friendship3.save();
  }

  const sql3 = User.createQueryBuilder("USER")
    .innerJoin(
      Friendship,
      "FR",
      "(FR.userFromId=USER.id OR FR.userToId=USER.id) AND (FR.userFromId=:userId OR FR.userToId=:userId)",
      { userId: user0.id }
    )
    .where("USER.id!=:userId", { userId: user0.id })
    .andWhere("FR.accepted=true");

  console.log(await sql3.getMany());
};

seed().finally(() => process.exit());
