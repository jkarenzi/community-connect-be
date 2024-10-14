import cloudinary from "cloudinary";
import dotenv from "dotenv";

dotenv.config();

cloudinary.v2.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

const imageUpload = async (file: any, folder: string) => {
  try {
    return await new Promise((resolve, reject) => {
      cloudinary.v2.uploader
        .upload_stream({ resource_type: "image" }, (error, result) => {
          if (error) return reject(error);
          resolve((result as cloudinary.UploadApiResponse).secure_url);
        })
        .end(file.buffer);
    });
  } catch (error) {
    throw new Error("Cloudinary upload failed");
  }
};

export default imageUpload;