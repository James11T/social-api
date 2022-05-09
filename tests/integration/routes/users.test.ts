import request from "supertest";
import app from "../../../src/app";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import { userModel } from "../../../src/schemas/user.schema";

const testUser = {
  userId: "testuser",
  email: "user@example.com",
  passwordHash: "abc123",
  about: "I am a test user"
};

beforeAll(async () => {
  const mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri(), { dbName: "testdb" });

  await (await userModel.create(testUser)).save();
});

afterAll(async () => {
  await mongoose.disconnect();
});

describe("GET /user/:id", () => {
  it("should return status code 200 and a user", async () => {
    const res = await request(app).get("/api/v1/users/testuser");
    expect(res.status).toBe(200);
  });
});
