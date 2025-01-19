import initApp from "../server";
import mongoose from "mongoose";

beforeAll(async () => {  
  console.log("beforeAll");
});

afterAll(async () => {
  console.log("afterAll");
  await mongoose.connection.close();
});

describe("InitApp Test", () => {
  test("Test if MongoDB is set", async () => {
    const originalMongoUri = process.env.DB_CONNECT;
    delete process.env.DB_CONNECT;

    try {
      await initApp();
    } catch (error) {
      expect(error).toBe("DB_CONNECT is not defined in .env file");
    }

    process.env.DB_CONNECT = originalMongoUri;
  });
});