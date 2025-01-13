import request from "supertest";
import initApp from "../server";
import mongoose from "mongoose";
import commentsModel from "../models/Comment";
import { Express } from "express";
import testComments from "./testComments.json";

var app: Express;

beforeAll(async () => {
  console.log("beforeAll");
  app = await initApp();
  await commentsModel.deleteMany();
});

afterAll((done) => {
  console.log("afterAll");
  mongoose.connection.close();
  done();
});

let commentId = "";

describe("Comments Tests", () => {
  test("Comments test get all", async () => {
    const response = await request(app).get("/comments");
    expect(response.statusCode).toBe(200);
    expect(response.body.length).toBe(0);
  });

  test("Test Create Comment", async () => {
    const response = await request(app).post("/comments").send(testComments[0]);
    expect(response.statusCode).toBe(201);
    expect(response.body.postId).toBe(testComments[0].postId);
    expect(response.body.content).toBe(testComments[0].content);    
    expect(response.body.sender).toBe(testComments[0].sender);
    commentId = response.body._id;
  });

  test("Test get comment by sender", async () => {
    const response = await request(app).get("/comments?sender=" + testComments[0].sender);
    expect(response.statusCode).toBe(200);
    expect(response.body.length).toBe(1);
    expect(response.body.postId).toBe(testComments[0].postId);
    expect(response.body.content).toBe(testComments[0].content);    
    expect(response.body.sender).toBe(testComments[0].sender);
  });

  test("Comments get post by id", async () => {
    const response = await request(app).get("/comments/" + commentId);
    expect(response.statusCode).toBe(200);
    expect(response.body.postId).toBe(testComments[0].postId);
    expect(response.body.content).toBe(testComments[0].content);    
    expect(response.body.sender).toBe(testComments[0].sender);
  });
});