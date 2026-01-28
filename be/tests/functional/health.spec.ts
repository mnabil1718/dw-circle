
import request from "supertest";
import { createApp } from "../../src/app.js";

describe("GET /api/v1/health", () => {
    it("should returns 200", async () => {
        const app = createApp();

        await request(app)
            .get("/api/v1/healthcheck")
            .expect(200);
    });
});
