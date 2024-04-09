// import { type ObjectId } from "mongoose";
import { ObjectId } from "mongoose";
import { User } from "../models/user.models";
import { ApiErrors } from "./ApiErrors";

const generateAccessAndRefreshToken = async (userId: number) => {
    try {
        const user = await User.findById(userId);
        const accessToken = user?.generateAccessToken() || "";
        const refreshToken = user?.generateRefreshToken() || "";

        if (user) user.refreshToken = refreshToken;
        await user?.save();
        return { accessToken, refreshToken };
    } catch (error) {
        throw new ApiErrors(
            500,
            "Something went wrong while generating Refresh and Access Token"
        );
    }
};

export { generateAccessAndRefreshToken };
