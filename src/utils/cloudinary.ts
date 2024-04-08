import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import * as dotenv from "dotenv";

dotenv.config({
    path: "./.env",
});

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_KEY,
    api_secret: process.env.CLOUDINARY_SECRET,
});

const uploadOnCloudinary = async (localFilePath: string) => {
    try {
        if (!localFilePath) return null;

        // upload file to Cloudinary
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto",
        });

        // File uploaded successfully
        // console.log(`File uploaded successfully at ${response.url}`);
        fs.unlinkSync(localFilePath);
        return response;
    } catch (error) {
        const message = (error as Error).message;
        fs.unlinkSync(localFilePath); // Remove files from local server if file upload fails.
        console.error(message);
        return;
    }
};

export { uploadOnCloudinary };
