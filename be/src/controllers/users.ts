import type { Request, Response } from "express";
import type { UserModel } from "../generated/prisma/models.js";
import { createUser, getUserByIdentifier, updateUserProfile, getUserProfile, getUserById, checkUserIDExists, getFollowingByUserId, getFollowersByUserId, follow, unfollow, checkIsFollowed, suggestUsersToFollow, searchUser, getUserProfileByUsername, getActiveUserFollow } from "../services/users.js";
import { Hasher } from "../utils/hasher.js";
import { StatusCodes } from "http-status-codes";
import { success } from "../utils/response.js";
import { generateJWT } from "../utils/tokenize.js";
import { GetUserFollowsSchema, SearchUserFilterSchema, type FollowResponse, type FollowToggledSocketPayload, type FollowToggledSocketType, type GetUserFollowsType, type LoginUserResponse, type RawFollowToggleResponse, type RegisterUserResponse, type ToggleFollowResponse, type UpdateProfile } from "../types/users.js";
import { UserMapper } from "../mappers/users.js";
import { STATIC_UPLOAD_PREFIX } from "../constants/upload.js";
import { getSocketServer } from "../sockets/server.js";
import { FOLLOW_TOGGLED_EVENT } from "../constants/events.js";

export const postUsers = async (req: Request, res: Response) => {

    req.body.password = await Hasher.hash(req.body.password);
    const u: UserModel = await createUser(req.body);
    const response: RegisterUserResponse = {
        user_id: u.id,
        username: u.username,
        name: u.full_name,
        email: u.email,
    };

    const code = StatusCodes.CREATED;
    res.status(code).json(success(code, "Registrasi berhasil. Akun berhasil dibuat.", response));
}


export const postLogin = async (req: Request, res: Response) => {

    const { identifier, password } = req.body;

    let identifierString = identifier as string | undefined;
    if (identifierString?.startsWith("@")) {
        identifierString = identifierString.split("@")[1];
    }

    const u: UserModel = await getUserByIdentifier(identifierString ?? "");
    await Hasher.compare(password, u.password);
    const accessToken: string = await generateJWT({ sub: String(u.id), role: u.role });

    const response: LoginUserResponse = {
        user_id: u.id,
        email: u.email,
        name: u.full_name,
        username: u.username,
        token: accessToken,
        avatar: u.photo_profile ? `${STATIC_UPLOAD_PREFIX}${u.photo_profile}` : undefined,
    };

    const code = StatusCodes.OK;

    res.status(code).json(success(code, "Login successful", response));
}



export const putUsersProfile = async (req: Request, res: Response) => {
    const { sub } = (req as any).user;
    const userId = Number(sub);

    const user = await getUserById(userId);

    const { name, username, bio } = req.body;
    const image = req.file;

    const data: UpdateProfile = {
        userId,
        name,
        username,
        bio: bio ?? null,
        image: image?.filename ?? user.photo_profile,
    };

    const raw = await updateUserProfile(data);
    const profile = UserMapper.toProfileResponse(raw);

    const code = StatusCodes.OK;
    res.status(code).json(success(code, "Profile berhasil diupdate", profile));
}


export const getUsersProfile = async (req: Request, res: Response) => {

    const { sub } = (req as any).user;
    const userId = Number(sub);

    const raw = await getUserProfile(userId);
    const profile = UserMapper.toProfileResponse(raw);

    const code = StatusCodes.OK;
    res.status(code).json(success(code, "Profile fetched successfully", profile));
}


export const getUsersProfileByUsername = async (req: Request, res: Response) => {

    const { sub } = (req as any).user;
    const { username } = req.params;
    const userId = Number(sub);

    const raw = await getUserProfileByUsername(username as string, userId);
    const profile = UserMapper.toProfileResponse(raw);

    const code = StatusCodes.OK;
    res.status(code).json(success(code, "Profile fetched successfully", profile));
}


export const getUsersFollows = async (req: Request, res: Response) => {
    const { sub } = (req as any).user;
    const userId = Number(sub);

    await checkUserIDExists(userId);
    const query: GetUserFollowsType = GetUserFollowsSchema.parse(req.query);

    if (query.type === "following") {
        let result = await getFollowingByUserId(userId);
        const following = UserMapper.toFollowingResponses(result);
        return res.status(StatusCodes.OK).json(success(StatusCodes.OK, "Following fetched successfully", following));
    }

    // followers
    let result = await getFollowersByUserId(userId);
    const followers = UserMapper.toFollowerResponses(result);
    return res.status(StatusCodes.OK).json(success(StatusCodes.OK, "Followers fetched successfully", followers));
}


export const postUsersFollow = async (req: Request, res: Response) => {
    const { sub } = (req as any).user;
    const userId = Number(sub);

    await checkUserIDExists(userId);

    const { following_id } = req.body;
    const followingId = Number(following_id);

    const exists = await checkIsFollowed(followingId, userId);

    let type: FollowToggledSocketType;
    let result: ToggleFollowResponse;

    if (exists) {
        type = "unfollow";
        const raw = await unfollow(followingId, userId);
        result = UserMapper.deleteToToggleResponse(raw);
    } else {
        type = "follow";
        const raw = await follow(followingId, userId);
        result = UserMapper.toToggleResponse(raw);
    }

    const socketPayload: FollowToggledSocketPayload = {
        type,
        result,
    }
    getSocketServer().emit(FOLLOW_TOGGLED_EVENT, socketPayload);


    const code = StatusCodes.CREATED;
    res.status(code).json(success(code, "Toggle follow successfully", result));
}

export const getUsersSuggestions = async (req: Request, res: Response) => {
    const { sub } = (req as any).user;
    const userId = Number(sub);

    await checkUserIDExists(userId);

    const raw = await suggestUsersToFollow(userId, 5);
    const result = UserMapper.toSuggestionFollowerResponses(raw);

    const code = StatusCodes.CREATED;
    res.status(code).json(success(code, "suggestion fetched successfully", result));
}


export const getUsersActiveFollow = async (req: Request, res: Response) => {
    const { sub } = (req as any).user;
    const { username } = req.params;
    const userId = Number(sub);

    await checkUserIDExists(userId);

    const raw = await getActiveUserFollow(userId, username as string);
    const result = UserMapper.toActiveFollowerResponse(raw);

    const code = StatusCodes.CREATED;
    res.status(code).json(success(code, "active profile follow status fetched successfully", result));
}


export const getSearchUsers = async (req: Request, res: Response) => {
    const { sub } = (req as any).user;
    const userId = Number(sub);
    const q = SearchUserFilterSchema.parse(req.query);

    const rawq = q.keyword?.trim() ?? "";
    const kw = rawq.replace(/^@+/, "");
    let result: FollowResponse[] = [];

    if (kw) {
        const raw = await searchUser(kw ?? "", userId);
        result = UserMapper.toSearchResponses(raw);
    }

    const code = StatusCodes.OK;
    res.status(code).json(success(code, "Search user successfully", result));
}
