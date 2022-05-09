import request from "supertest";
import app from "../../../src/app";

describe("GET /status", () => {
  it("should return status code 200", async () => {
    const response = await request(app).get("/api/v1/status");
    expect(response.status).toBe(200);
  });
});
