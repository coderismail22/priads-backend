import { v2 as cloudinary } from "cloudinary";
import config from "../config";
import fs from "fs/promises"; // Use promises-based version of fs
import multer from "multer";

export const sendImageToCloudinary = async (
  imageName: string,
  path: string,
): Promise<Record<string, unknown>> => {
  // Cloudinary configuration
  cloudinary.config({
    cloud_name: config.cloud_name,
    api_key: config.api_key,
    api_secret: config.api_secret,
  });

  try {
    // Upload image to Cloudinary
    const uploadResult = await cloudinary.uploader.upload(path, {
      public_id: imageName,
    });


    // Delete the local file asynchronously after successful upload
    await fs.unlink(path);

    return uploadResult;
  } catch (error) {
    console.error("Error during image upload:", error);

    // Ensure file is deleted even if the upload fails (cleanup)
    try {
      await fs.unlink(path);
    } catch (deleteError) {
      console.error("Error deleting local file:", deleteError);
    }

    // Re-throw the error so it can be handled by the calling code
    throw new Error("Image upload failed: " + error);
  }
};

// Multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, process.cwd() + "/uploads/");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + "-" + uniqueSuffix);
  },
});

export const upload = multer({ storage: storage });
