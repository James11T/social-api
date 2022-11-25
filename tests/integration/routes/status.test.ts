import "dotenv/config";
import request from "supertest";
import app from "../../../src/app";
import { describe, it, expect } from "vitest";

describe("GET /status", () => {
  it("should return status code 200", async () => {
    const response = await request(app).get("/api/v1/status");
    expect(response.status).toBe(200);
  });
});
