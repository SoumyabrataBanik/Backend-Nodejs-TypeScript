import { RequestParamHandler } from "express";
import { asyncHandler } from "../utils/asyncHandler";

const registerUser = asyncHandler(async (req, res) => {
    res.status(200).json({
        message: "Soumyabrata Banik",
    });
});

export { registerUser };
