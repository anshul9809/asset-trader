const request = require("supertest");
const mongoose = require("mongoose");
const app = require("../app");
const User = require("../models/User");
const Assets = require("../models/Assets");
const Request = require("../models/Request");

let token, token2, userId, userId2, assetId, requestId;

beforeAll(async () => {
  // Register and login to get a token for the first user
  const registerResponse = await request(app)
    .post("/auth/signup")
    .send({
      email: "testuser@example.com",
      password: "password123",
      username: "testuser"
    });

  userId = registerResponse.body.user._id;
  token = registerResponse.body.token;

  // Register and login to get a token for the second user
  const registerResponse2 = await request(app)
    .post("/auth/signup")
    .send({
      email: "testuser2@example.com",
      password: "password123",
      username: "testuser2"
    });

  userId2 = registerResponse2.body.user._id;
  token2 = registerResponse2.body.token;

  // Create an asset owned by the first user
  const assetResponse = await request(app)
    .post("/assets/")
    .set("Authorization", `Bearer ${token}`)
    .send({
      name: "Test Asset",
      description: "This is a test asset.",
      status: "draft",
      currentHolder: userId,
    });

  assetId = assetResponse.body.assetId;
});

beforeEach(async () => {
  await Request.deleteMany({});
});

afterAll(async () => {
    await User.deleteMany({});
    await Assets.deleteMany({});
    await Request.deleteMany({});
    await mongoose.connection.close();
});

describe("Request Routes", () => {

  test("Create a Purchase Request", async () => {
    const response = await request(app)
      .post(`/assets/${assetId}/request`)
      .set("Authorization", `Bearer ${token2}`) // Using the second user's token
      .send({
        proposedPrice: 1000
      });

    expect(response.status).toBe(201);
    expect(response.body.message).toBe("Purchase request sent");

    // Store the requestId for later tests
    // requestId = response.body.requestId;
  });

  test("Negotiate a Purchase Request", async () => {
    // Create a request first
    const requestResponse = await request(app)
      .post(`/assets/${assetId}/request`)
      .set("Authorization", `Bearer ${token2}`) // Using the second user's token
      .send({
        proposedPrice: 1000
      });
      requestId = requestResponse.body.requestId;

    const response = await request(app)
      .put(`/requests/${requestId}/negotiate`)
      .set("Authorization", `Bearer ${token2}`) // Using the second user's token
      .send({
        newProposedPrice: 1100
      });

    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Negotiation updated");
  });

  test("Deny a Purchase Request", async () => {
    // Create a request first
    const requestResponse = await request(app)
      .post(`/assets/${assetId}/request`)
      .set("Authorization", `Bearer ${token2}`) // Using the second user's token
      .send({
        proposedPrice: 1000
      });
      requestId = requestResponse.body.requestId;

    const response = await request(app)
      .put(`/requests/${requestId}/deny`)
      .set("Authorization", `Bearer ${token}`); // Using the first user's token to deny
    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Request denied");
  });
  test("Accept a Purchase Request", async () => {
    // Create a request first
    const requestResponse = await request(app)
      .post(`/assets/${assetId}/request`)
      .set("Authorization", `Bearer ${token2}`) // Using the second user's token
      .send({
        proposedPrice: 1000
      });
    requestId = requestResponse.body.requestId;

    const response = await request(app)
      .put(`/requests/${requestId}/accept`)
      .set("Authorization", `Bearer ${token}`); // Using the first user's token to accept
    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Request accepted, holder updated");
  });


  test("Get a Purchase Request by ID", async () => {
    // Create a request first
    const requestResponse = await request(app)
      .post(`/assets/${assetId}/request`)
      .set("Authorization", `Bearer ${token}`) // Using the second user's token
      .send({
        proposedPrice: 1000
      });
      requestId = requestResponse.body.requestId;

    const response = await request(app)
      .get(`/requests/${requestId}`)
      .set("Authorization", `Bearer ${token}`); // Using the second user's token to view the request
    expect(response.status).toBe(200);
    expect(response.body._id).toBe(requestId);
  });
});
