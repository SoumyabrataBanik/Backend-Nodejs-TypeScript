import jwt, { Secret } from "jsonwebtoken";
import { ObjectId } from "mongoose";
import { uploadOnCloudinary } from "../utils/cloudinary";

import { type IUser, User } from "../models/user.models";
import { ApiErrors } from "../utils/ApiErrors";
import { ApiResponse } from "../utils/ApiResponse";
import { asyncHandler } from "../utils/asyncHandler";
import { generateAccessAndRefreshToken } from "../utils/generateToken";
import { throwError, validateEmail } from "../utils/validator";

const registerUser = asyncHandler(async (req, res) => {
    // Step 1: Get user details from frontend
    const { fullName, email, userName, password } = req.body;

    // Step 2: Validate details and if everything is entered and nothing is empty
    [fullName, email, userName, password].map((field) =>
        field?.trim === "" ? throwError(field) : null
    );
    if (!validateEmail(email)) {
        throw new ApiErrors(400, "Enter a correct Email");
    }
    // if (
    //     [fullName, email, userName, password].some(
    //         (detail) => detail?.trim === ""
    //     )
    // ) {
    //     throw new ApiErrors(400, "All Fields are required.");
    // }

    // Step 3: Check if user already exists using email or username(since it is also unique)
    const userExists = await User.findOne({
        $or: [{ userName }, { email }],
    });

    if (await userExists) {
        throw new ApiErrors(409, "User already exists");
    }

    // Step 4: Check for images and avatars
    const files = req.files as { [fieldname: string]: Express.Multer.File[] };
    const avatarLocalPath = files?.avatar[0]?.path;
    const coverImageLocalPath = files?.coverImage?.[0].path || null;

    if (!avatarLocalPath) {
        throw new ApiErrors(400, "Avatar is required");
    }

    // Step 5: Upload them to cloudinary and check if them are prplery uploaded
    const avatar = await uploadOnCloudinary(avatarLocalPath);
    let coverImage;
    if (coverImageLocalPath)
        coverImage = await uploadOnCloudinary(coverImageLocalPath);

    if (!avatar) {
        throw new ApiErrors(400, "Avatar failed to be uploaded.");
    }

    // Step 6: Create user object and then create entry in db
    const user = await User.create({
        userName: userName.toLowerCase(),
        email,
        password,
        fullName,
        avatar: avatar.url,
        coverImage: coverImage?.url || "",
    });

    // Step 7: Remove password and refresh token from input field,
    const createdUser = await User.findById(user._id)?.select(
        "-password -refreshToken"
    );

    // Step 8: Check for user creation.
    if (!createdUser) {
        throw new ApiErrors(500, "Server Error! User could not be registered!");
    }

    // Step 9: return response
    return res
        .status(201)
        .json(new ApiResponse(200, createdUser, "User Registered!"));
});

const loginUser = asyncHandler(async (req, res) => {
    // Steps to take care of:
    // Collect user details from frontend like username/user email and password
    // Check if user exists on the database.
    // If user exists on the database, authenticate user to access his profile.
    // If user does not exist on the database or details do not match, then warn the user to either provide correct details or register themselves.
    const { email, userName, password } = req.body;

    if (!(userName || email)) {
        throw new ApiErrors(400, "Please enter email or user name.");
    }

    const user = await User.findOne({
        $or: [{ userName }, { email }],
    });

    if (!user) {
        throw new ApiErrors(
            404,
            "No user found. Please enter correct username/email or register."
        );
    }

    const isPasswordValid = await user.isPasswordCorrect(password);

    if (!isPasswordValid) throw new ApiErrors(401, "Password is invalid");

    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
        user._id
    );

    const loggedInUser = await User.findById(user._id).select(
        "-password -refreshToken"
    );

    const options = {
        httpOnly: true,
        secure: true,
    };

    return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
            new ApiResponse(
                200,
                {
                    user: loggedInUser,
                    accessToken,
                    refreshToken,
                },
                "User Logged in Successfully!"
            )
        );
});

const logoutUser = asyncHandler(async (req, res) => {
    const userId = (req as any).user._id as ObjectId;

    await User.findByIdAndUpdate(
        userId,
        {
            $unset: {
                refreshToken: 1,
            },
        },
        {
            new: true,
        }
    );

    const options = {
        httpOnly: true,
        secure: true,
    };

    return res
        .status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json(new ApiResponse(200, {}, "User logged out successfully"));
});

export { loginUser, logoutUser, registerUser };
