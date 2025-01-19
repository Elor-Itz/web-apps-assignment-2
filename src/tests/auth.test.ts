import request from "supertest";
import initApp from "../server";
import mongoose from "mongoose";
import postModel from "../models/Post";
import { Express } from "express";
import userModel, { IUser } from "../models/User";

var app: Express;

const baseUrl = "/auth";

type User = IUser & {
  accessToken?: string,
  refreshToken?: string
};

const testUser: User = {
  email: "test@user.com",
  password: "testpassword",
}

const testUser2: User = {
  email: "test2@user.com",
  password: "testpassword123",
}

describe("Auth Tests", () => {
  
  beforeAll(async () => {
    console.log("beforeAll");
    app = await initApp();
    await userModel.deleteMany();
    await postModel.deleteMany();
  });

  afterAll((done) => {
    console.log("afterAll");
    mongoose.connection.close();
    done();
  });
    
  // Test register
  test("Auth test register", async () => {
    const response = await request(app).post(baseUrl + "/register").send(testUser);
    expect(response.statusCode).toBe(200);
  });

  // Test register fail
  test("Auth test register fail", async () => {
    const response = await request(app).post(baseUrl + "/register").send(testUser);
    expect(response.statusCode).not.toBe(200);
  });

  // Test register fail
  test("Auth test register fail", async () => {
    const response = await request(app).post(baseUrl + "/register").send({
      email: "sdsdfsd",
    });
    expect(response.statusCode).not.toBe(200);
    const response2 = await request(app).post(baseUrl + "/register").send({
      email: "",
      password: "sdfsd",
    });
    expect(response2.statusCode).not.toBe(200);
  });

  // Test login
  test("Auth test login", async () => {
    const response = await request(app).post(baseUrl + "/login").send(testUser);
    expect(response.statusCode).toBe(200);
    const accessToken = response.body.accessToken;
    const refreshToken = response.body.refreshToken;
    expect(accessToken).toBeDefined();
    expect(refreshToken).toBeDefined();
    expect(response.body._id).toBeDefined();
    testUser.accessToken = accessToken;
    testUser.refreshToken = refreshToken;
    testUser._id = response.body._id;
  });

  // Test login tokens
  test("Check tokens are not the same", async () => {
    const response = await request(app).post(baseUrl + "/login").send(testUser);
    const accessToken = response.body.accessToken;
    const refreshToken = response.body.refreshToken;

    expect(accessToken).not.toBe(testUser.accessToken);
    expect(refreshToken).not.toBe(testUser.refreshToken);
  });  

  // Test login fail
  test("Auth test login fail", async () => {
    const response = await request(app).post(baseUrl + "/login").send({
      email: testUser.email,
      password: "sdfsd",
    });
    expect(response.statusCode).not.toBe(200);

    const response2 = await request(app).post(baseUrl + "/login").send({
      email: "fakemail",
      password: "sdfsd",
    });
    expect(response2.statusCode).not.toBe(200);
  });  

  // Test me
  test("Auth test me", async () => {
    const response = await request(app).post("/posts").send({
      title: "Test Post",
      content: "Test Content",
      sender: testUser._id,
    });
    expect(response.statusCode).not.toBe(201);
    const response2 = await request(app).post("/posts").set(
      { authorization: "JWT " + testUser.accessToken }
    ).send({
      title: "Test Post",
      content: "Test Content",
      sender: testUser._id,
    });
    expect(response2.statusCode).toBe(201);
  });

  // Test refresh token
  test("Test refresh token", async () => {
    const response = await request(app).post(baseUrl + "/refresh").send({
      refreshToken: testUser.refreshToken,
    });
    expect(response.statusCode).toBe(200);
    expect(response.body.accessToken).toBeDefined();
    expect(response.body.refreshToken).toBeDefined();
    testUser.accessToken = response.body.accessToken;
    testUser.refreshToken = response.body.refreshToken;
  });
  
  // Test refresh token fail
  test("Test invalid refresh token", async () => {    
    const invalidRefreshToken = "invalidToken";

    const response = await request(app).post(baseUrl + "/refresh").send({
      refreshToken: invalidRefreshToken,
    });
    expect(response.statusCode).toBe(400);
    expect(response.text).toBe("fail");
  });

  // Test missing refresh token
  test("Test Missing Refresh Token", async () => {
    const refreshRes = await request(app).post("/auth/refresh").send({});
    expect(refreshRes.statusCode).toBe(400);
    expect(refreshRes.text).toBe("Refresh token is required");
  });
    
  // Test double use refresh token
  test("Double use refresh token", async () => {
    const response = await request(app).post(baseUrl + "/refresh").send({
      refreshToken: testUser.refreshToken,
    });
    expect(response.statusCode).toBe(200);
    const refreshTokenNew = response.body.refreshToken;

    const response2 = await request(app).post(baseUrl + "/refresh").send({
      refreshToken: testUser.refreshToken,
    });
    expect(response2.statusCode).not.toBe(200);

    const response3 = await request(app).post(baseUrl + "/refresh").send({
      refreshToken: refreshTokenNew,
    });
    expect(response3.statusCode).not.toBe(200);
  });  

  // Test logout
  test("Test logout", async () => {
    const response = await request(app).post(baseUrl + "/login").send(testUser);
    expect(response.statusCode).toBe(200);
    testUser.accessToken = response.body.accessToken;
    testUser.refreshToken = response.body.refreshToken;

    const response2 = await request(app).post(baseUrl + "/logout").send({
      refreshToken: testUser.refreshToken,
    });
    expect(response2.statusCode).toBe(200);

    const response3 = await request(app).post(baseUrl + "/refresh").send({
      refreshToken: testUser.refreshToken,
    });
    expect(response3.statusCode).not.toBe(200);
  });

  // Test logout fail
  test("Test logout fail", async () => {
    const response = await request(app).post(baseUrl + "/logout").send({
      refreshToken: testUser.refreshToken,
    });
    expect(response.statusCode).not.toBe(200);
  });
  
  // Test logout without refresh token
  test("Test Logout without Refresh Token", async () => {
    const response = await request(app).post(baseUrl + "/logout").send({});
    expect(response.statusCode).toBe(400);
    expect(response.body.message).toBe("Refresh token is required");
  });  

  // Test refresh token with invalid token
  test("Test Refresh Token with Invalid Token", async () => {
    const response = await request(app).post(baseUrl + "/refresh").send({
      refreshToken: "invalidtoken",
    });
    expect(response.statusCode).not.toBe(201);    
  });

  // Test refresh token with missing user
  test("Test Refresh Token with Missing User", async () => {
    const invalidRefreshToken = "someInvalidToken";
    const response = await request(app).post(baseUrl + "/refresh").send({
      refreshToken: invalidRefreshToken,
    });
    expect(response.statusCode).toBe(400);
    expect(response.text).toBe("fail");
  });

  test("Create post when TOKEN_SECRET is missing from server", async () => {
    const originalSecret = process.env.TOKEN_SECRET;
    delete process.env.TOKEN_SECRET;

    const testPost = {
      title: "Test Post",
      content: "Test Content",
      sender: testUser._id
    }

    const response = await request(app)
      .post("/posts")
      .set({ authorization: `JWT ${testUser.accessToken}` })
      .send(testPost);
    expect(response.statusCode).toBe(500);
    expect(response.text).toBe("Server Error");

    process.env.TOKEN_SECRET = originalSecret;
  });

  // Test missing TOKEN_SECRET
  test("Test Missing TOKEN_SECRET", async () => {
    const originalTokenSecret = process.env.TOKEN_SECRET;
    delete process.env.TOKEN_SECRET;

    const response = await request(app).post(baseUrl + "/refresh").send({
      refreshToken: testUser.refreshToken,
    });

    expect(response.statusCode).toBe(400);
    expect(response.text).toBe("Token secret is missing");

    process.env.TOKEN_SECRET = originalTokenSecret;
  });

  // Test timeout token
  jest.setTimeout(10000);
  test("Test timeout token ", async () => {
    const response = await request(app).post(baseUrl + "/login").send(testUser);
    expect(response.statusCode).toBe(200);
    testUser.accessToken = response.body.accessToken;
    testUser.refreshToken = response.body.refreshToken;

    await new Promise((resolve) => setTimeout(resolve, 5000));

    const response2 = await request(app).post("/posts").set(
      { authorization: "JWT " + testUser.accessToken }
    ).send({
      title: "Test Post",
      content: "Test Content",
      sender: testUser._id,
    });
    expect(response2.statusCode).not.toBe(201);

    const response3 = await request(app).post(baseUrl + "/refresh").send({
      refreshToken: testUser.refreshToken,
    });
    expect(response3.statusCode).toBe(200);
    testUser.accessToken = response3.body.accessToken;

    const response4 = await request(app).post("/posts").set(
      { authorization: "JWT " + testUser.accessToken }
    ).send({
      title: "Test Post",
      content: "Test Content",
      sender: testUser._id,
    });
    expect(response4.statusCode).toBe(201);
  });
});