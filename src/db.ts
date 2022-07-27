import { Sequelize } from "sequelize-typescript";
import { User, Friendship, Post, PostMedia } from "./schemas";
import type { Dialect } from "sequelize";

const {
  DB_USER,
  DB_PASSWORD,
  DB_DATABASE,
  DB_HOST = "localhost",
  DB_DIALECT = "mysql"
} = process.env;

const db = new Sequelize({
  dialect: DB_DIALECT as Dialect,
  database: DB_DATABASE,
  username: DB_USER,
  password: DB_PASSWORD,
  host: DB_HOST,
  models: [User, Friendship, Post, PostMedia]
});

export default db;
