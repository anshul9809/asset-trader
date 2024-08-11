const request = require("supertest");
const mongoose = require("mongoose");
const app = require("../app"); // Make sure this points to your app file
const User = require("../models/User");
const Assets = require("../models/Assets");

let token;
let assetId;

// Clear the database before running tests and register/login once
beforeAll(async () => {
  // Clear users and assets before all tests
  await User.deleteMany({});
  await Assets.deleteMany({});

  // Register a new user
  const response = await request(app)
    .post("/auth/signup")
    .send({
      email: "testuser@example.com",
      password: "password123",
      username: "testuser"
    });
  token = response.body.token;
});

describe("Assets Routes", () => {
  test("Create an Asset Draft", async () => {
    const response = await request(app)
      .post("/assets/")
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "Test Asset",
        description: "This is a test asset.",
        status: "draft"
      });

    expect(response.status).toBe(201);
    expect(response.body.message).toBe("Asset created successfully");
    assetId = response.body.assetId;
  });

  test("Update an Asset Draft", async () => {
    const response = await request(app)
      .post(`/assets/${assetId}`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "Updated Test Asset",
        description: "This is an updated test asset.",
        status: "draft"
      });

    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Asset created successfully");
  });

  test("List an Asset", async () => {
    const response = await request(app)
      .put(`/assets/${assetId}/publish`)
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Asset published successfully");
  });

  test("Get an Asset by ID", async () => {
    const response = await request(app)
      .get(`/assets/${assetId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.name).toBe("Updated Test Asset");
  });
});

// Close the mongoose connection after all tests
afterAll(async () => {
  await mongoose.connection.close();
});
