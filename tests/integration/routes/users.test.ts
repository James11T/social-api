import "dotenv/config";
import request from "supertest";
import mongoose from "mongoose";
import app from "../../../src/app";
import { MongoMemoryServer } from "mongodb-memory-server";
import { userModel } from "../../../src/schemas/user.schema";
import type { UserType } from "../../../src/schemas/user.schema";

const testUsers: UserType[] = [
  {
    userId: "testuser1",
    email: { value: "kakaposocial@gmail.com", verified: true },
    passwordHash: "abc123",
    friends: [
      {
        userId: "testuser2",
        status: "friend",
      },
    ],
  },
  {
    userId: "testuser2",
    email: { value: "kakaposocial@gmail.com", verified: true },
    passwordHash: "abc123",
    friends: [
      {
        userId: "testuser1",
        status: "friend",
      },
    ],
  },
  {
    userId: "testuser3",
    email: { value: "kakaposocial@gmail.com", verified: true },
    passwordHash: "abc123",
    friends: [
      {
        userId: "testuser4",
        status: "pendingInbound",
      },
    ],
  },
  {
    userId: "testuser4",
    email: { value: "kakaposocial@gmail.com", verified: true },
    passwordHash: "abc123",
    friends: [
      {
        userId: "testuser3",
        status: "pendingOutbound",
      },
    ],
  },
];

let mongoServer: MongoMemoryServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri(), { dbName: "testdb" });

  for (const testUser of testUsers) {
    await (await userModel.create(testUser)).save();
  }
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe("GET /users/:id", () => {
  it("should return status code 200 and a user", async () => {
    const res = await request(app).get("/api/v1/users/testuser1");
    expect(res.status).toBe(200);
    expect(res.body.userId).toBe("testuser1");
  });

  it("should return status code 404 for an invalid user", async () => {
    const res = await request(app).get("/api/v1/users/idonotexist");
    expect(res.status).toBe(404);
  });
});

describe("GET /users?id=testuser", () => {
  it(`should return status code 200 and ${testUsers.length} users`, async () => {
    const res = await request(app).get("/api/v1/users?userid=testuser");
    expect(res.status).toBe(200);
    expect(res.body.length).toBe(testUsers.length);
  });

  it("should return status code 200 and 1 users", async () => {
    const res = await request(app).get("/api/v1/users?userid=user2");
    expect(res.status).toBe(200);
    expect(res.body.length).toBe(1);
  });

  it("should return status code 200 and 0 users", async () => {
    const res = await request(app).get("/api/v1/users?userid=nobodylikethis");
    expect(res.status).toBe(200);
    expect(res.body.length).toBe(0);
  });
});

describe("GET /users/:userId/friendRequests", () => {
  it("should return status code 200 and 0 friend requests", async () => {
    const res = await request(app).get("/api/v1/users/testuser1/friendRequests");

    expect(res.status).toBe(200);
    expect(res.body.length).toBe(0);
  });

  it("should return status code 200 and 1 friend requests", async () => {
    const res = await request(app).get("/api/v1/users/testuser3/friendRequests");

    console.log(res.body);

    expect(res.status).toBe(200);
    expect(res.body.length).toBe(1);
  });

  it("should return status code 200 and 0 friend requests for outbound friend request", async () => {
    const res = await request(app).get("/api/v1/users/testuser4/friendRequests");

    expect(res.status).toBe(200);
    expect(res.body.length).toBe(0);
  });
});

describe("POST /users/:userId/friendRequests", () => {});

describe("POST /users/:userId/friends", () => {});
