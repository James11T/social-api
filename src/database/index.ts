import { Err, Ok } from "ts-results";
import { DataSource } from "typeorm";
import { User, Friendship, Post, PostMedia, UserTOTP, RefreshToken, Comment } from "../models";
import type { Result } from "ts-results";

const { DB_USER, DB_PASSWORD, DB_DATABASE, DB_HOST = "localhost" } = process.env;

export const AppDataSource = new DataSource({
  type: "mysql",
  host: DB_HOST,
  username: DB_USER,
  password: DB_PASSWORD,
  database: DB_DATABASE,
  synchronize: true,
  logging: false,
  entities: [User, Friendship, Post, PostMedia, UserTOTP, RefreshToken, Comment],
  subscribers: [],
  migrations: [],
});

const initializeDatabase = async (): Promise<Result<DataSource, "FAILED_TO_INITIALIZE">> => {
  try {
    const dataSource = await AppDataSource.initialize();
    return Ok(dataSource);
  } catch (err) {
    console.error(err);
    return Err("FAILED_TO_INITIALIZE");
  }
};

export default AppDataSource;
export { initializeDatabase };
