import request from "supertest";
import initApp from "../server";
import mongoose from "mongoose";
import postModel from "../models/Post";
import { Express } from "express";
import userModel, { IUser } from "../models/User";

var app: Express;

type User = IUser & { token?: string };
const testUser: User = {
  email: "test@user.com",
  password: "testpassword",  
};

const testUser2: User = {
  email: "test2@user.com",
  password: "fakepassword",  
};

beforeAll(async () => {
  console.log("beforeAll");
  app = await initApp();
  await userModel.deleteMany();
  await postModel.deleteMany();  
  await request(app).post("/auth/register").send(testUser);
  const res = await request(app).post("/auth/login").send(testUser);  
  testUser.token = res.body.accessToken;
  testUser._id = res.body._id;  
  expect(testUser.token).toBeDefined();
});

afterAll((done) => {
  console.log("afterAll");
  mongoose.connection.close();
  done();
});

let postId = "";
describe("Posts Tests", () => {
  // Test get all posts
  test("Posts test get all", async () => {
    const response = await request(app).get("/posts");
    expect(response.statusCode).toBe(200);
    expect(response.body.length).toBe(0);
  });

  // Test create post
  test("Test Create Post", async () => {
    const response = await request(app).post("/posts")
      .set({ authorization: "JWT " + testUser.token })
      .send({
        title: "Test Post",
        content: "Test Content",
        sender: testUser._id,
      });
    expect(response.statusCode).toBe(201);
    expect(response.body.title).toBe("Test Post");
    expect(response.body.content).toBe("Test Content");
    expect(response.body.sender).toBe(testUser._id);
    postId = response.body._id;
  });

  // Test get post by sender
  test("Test get post by sender", async () => {
    const response = await request(app).get("/posts?sender=" + testUser._id);
    expect(response.statusCode).toBe(200);
    expect(response.body.length).toBe(1);
    expect(response.body[0].title).toBe("Test Post");
    expect(response.body[0].content).toBe("Test Content");
  });

  // Test get all posts with empty string as sender query parameter
  test("Test get all posts with empty string as sender query parameter", async () => {
    const response = await request(app).get("/posts?sender=");
    expect(response.statusCode).toBe(200);
    expect(response.body.length).toBeGreaterThanOrEqual(1);
  }); 

  // Test get post by id
  test("Test get post by id", async () => {
    const response = await request(app).get("/posts/" + postId);
    expect(response.statusCode).toBe(200);
    expect(response.body.title).toBe("Test Post");
    expect(response.body.content).toBe("Test Content");
  });

  // Test get post by id #2
  test("Test Create Post 2", async () => {
    const response = await request(app).post("/posts")
      .set({ authorization: "JWT " + testUser.token })
      .send({
        title: "Test Post 2",
        content: "Test Content 2",
        sender: testUser._id,
      });
    expect(response.statusCode).toBe(201);
  });

  // Test get all posts
  test("Posts test get all 2", async () => {
    const response = await request(app).get("/posts");
    expect(response.statusCode).toBe(200);
    expect(response.body.length).toBe(2);
  });

  // Test update post
  test("Test Update Post", async () => {
    const response = await request(app).put("/posts/" + postId)
      .set({ authorization: "JWT " + testUser.token })
      .send({
        title: "Test Post Updated",
        content: "Test Content Updated",
      });
    expect(response.statusCode).toBe(200);
    expect(response.body.title).toBe("Test Post Updated");
    expect(response.body.content).toBe("Test Content Updated");
  });

  // Test delete post
  test("Test Delete Post", async () => {
    const response = await request(app).delete("/posts/" + postId)
      .set({ authorization: "JWT " + testUser.token });
    expect(response.statusCode).toBe(200);
    const response2 = await request(app).get("/posts/" + postId);
    expect(response2.statusCode).toBe(404);
  });  

  // Test create post fail
  test("Test Create Post fail", async () => {
    const response = await request(app).post("/posts")
      .set({ authorization: "JWT " + testUser.token })
      .send({
        content: "Test Content 2",
      });
    expect(response.statusCode).toBe(400);
  });
});