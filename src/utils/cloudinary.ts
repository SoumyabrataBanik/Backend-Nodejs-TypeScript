import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

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
        console.log(`File uploaded successfully at ${response.url}`);
        return response;
    } catch (error) {
        let message = "";
        if (error instanceof Error) {
            message = error.message;
        }
        fs.unlinkSync(localFilePath); // Remove files from local server if file upload fails.
        console.error("Failed to upload files to the server. \n", message);
    }
};

export { uploadOnCloudinary };
