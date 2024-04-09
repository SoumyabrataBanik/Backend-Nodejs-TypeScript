import jwt from "jsonwebtoken";

import { IUser, User } from "../models/user.models";
import { ApiErrors } from "../utils/ApiErrors";
import { asyncHandler } from "../utils/asyncHandler";

export const verifyJWT = asyncHandler(async (req, _, next) => {
    try {
        const token =
            req.cookies?.accessToken ||
            req.header("Authorization")?.replace("Bearer ", "");

        if (!token) {
            throw new ApiErrors(401, "Unauthorized request!");
        }

        const decodedToken = jwt.verify(
            token,
            process.env.ACCESS_TOKEN_SECRET as jwt.Secret
        );

        const user = await User.findById((decodedToken as IUser)?._id).select(
            "-password -refreshToken"
        );

        if (!user) throw new ApiErrors(401, "Invalid Access Token");

        (req as any).user = user;
        next();
    } catch (error) {
        throw new ApiErrors(
            401,
            (error as Error)?.message || "Invalid access token"
        );
    }
});
