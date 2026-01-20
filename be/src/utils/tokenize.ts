import { jwtVerify, SignJWT } from "jose";
import { AuthorizationError } from "./errors.js";
import { config } from "../utils/config.js";

export type JwtPayload = {
    sub: string; // RFC 7519
    role: string;
}

export const JWT_SECRET = new TextEncoder().encode(config.jwt.secret);

export const generateJWT = async (payload: JwtPayload): Promise<string> => {
    return await new SignJWT(payload)
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime('3h')
        .sign(JWT_SECRET);
}

export const verifyJWT = async (jwt: string): Promise<JwtPayload> => {
    try {
        const { payload } = await jwtVerify<JwtPayload>(jwt, JWT_SECRET);
        return payload;
    } catch (error) {
        throw new AuthorizationError("invalid or expired token");
    }
}

