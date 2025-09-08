import request from "supertest";
import app from "../src/app.js";
import { name } from "ejs";

describe("Product API", () => {
  it("should list products", async () => {
    const res = await request(app).get("/api/products");
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body.products)).toBe(true);
  });

  it("should create a product", async () => {
    const res = (await request(app).post("/api/products"))
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "Test Product",
        description: "Nice product",
        price: 99.99,
        stock: 10,
      });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("name", "Test Product");
  });
});
