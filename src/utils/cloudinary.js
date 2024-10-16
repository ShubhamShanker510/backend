import { v2 as cloudinary } from 'cloudinary'; // Import Cloudinary module
import fs from 'fs'; // Import File System module

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, // Set cloud name from environment variables
    api_key: process.env.CLOUDINARY_API_KEY, // Set API key from environment variables
    api_secret: process.env.CLOUDINARY_API_SECRET // Set API secret from environment variables
});

const uploadOnCloudinary = async (localFilePath) => {
    try {
        if (!localFilePath) return null; // If no file path is provided, return null

        // Upload the file to Cloudinary
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto" // Auto-detect the file type
        });

        // File has been uploaded successfully
        console.log("File uploaded on Cloudinary", response.url);
        return response;
    } catch (error) {
        try {
            // Remove the locally saved temporary file if the upload operation failed
            fs.unlinkSync(localFilePath);
        } catch (unlinkError) {
            console.log("Error removing file:", unlinkError);
        }
        console.log("Upload error:", error);
        return null;
    }
};

export { uploadOnCloudinary }; // Export the function
