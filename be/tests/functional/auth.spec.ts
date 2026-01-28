import request from "supertest";
import { createApp } from "../../src/app.js";
import { StatusCodes } from "http-status-codes";
import { prisma } from "../../src/lib/prisma/client.js";

describe("POST /api/v1/auth/register", () => {
    const app = createApp();

    it('should register new user & persists to DB', async () => {
        const payload = {
            user_name: "_test_mnabil",
            name: "TestUser",
            email: "test.mnabil@test.com",
            password: "@Password123",
        };

        const res = await request(app)
            .post("/api/v1/auth/register")
            .send(payload)
            .expect(StatusCodes.CREATED);


        expect(res.body.data).toMatchObject({
            username: "_test_mnabil",
            name: "TestUser",
            email: "test.mnabil@test.com",
        });


        // DB persist
        const u = await prisma.user.findUnique({
            where: { email: payload.email },
        });

        expect(u).not.toBeNull();
        expect(u!.email).toBe(payload.email);
        expect(u!.password).not.toBe(payload.password);
    })


    it("should return 400 if required field is missing", async () => {

        const payload = {
            name: "TestUser2",
            email: "test.mnabil2@test.com",
            password: "@Password123",
        };

        await request(app)
            .post("/api/v1/auth/register")
            .send(payload)
            .expect(StatusCodes.BAD_REQUEST);


        // DB check
        const u = await prisma.user.findUnique({
            where: { email: payload.email },
        });

        expect(u).toBeNull();
    })



    it('should return 409 conflict if register same user', async () => {
        const payload = {
            user_name: "_test_mnabil",
            name: "TestUser",
            email: "test.mnabil@test.com",
            password: "@Password123",

        };

        await request(app)
            .post("/api/v1/auth/register")
            .send(payload)
            .expect(StatusCodes.CONFLICT);


        // DB persist
        const u = await prisma.user.findUnique({
            where: { email: payload.email },
        });

        expect(u).not.toBeNull();
        expect(u!.email).toBe(payload.email);
        expect(u!.password).not.toBe(payload.password);
    })

});
