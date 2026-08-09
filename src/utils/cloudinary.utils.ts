import { Readable } from "node:stream";
import cloudinary from "../config/cloudinary.config";

export interface UploadResult {
  url: string;
  publicId: string;
}

  export async function testCloudinary() {
    try {
      const result = await cloudinary.api.ping();

      console.log("✅ Cloudinary conectado:", result);
    } catch (error) {
      console.error("❌ Cloudinary error:", error);
    }
  }

export async function uploadAvatar(
  buffer: Buffer,
  userId: string,
): Promise<UploadResult> {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: "personal-finance",
        public_id: userId,
        overwrite: true,
        resource_type: "image",
        transformation: [
          { width: 400, height: 400, crop: "fill", gravity: "face" },
          { quality: "auto", fetch_format: "auto" },
        ],
      },
      (error, result) => {
        if (error) {
          console.error("Cloudinary upload error:", {
            message: error.message,
            http_code: error.http_code,
            name: error.name,
          });


          return reject(error);
        }

        if (!result) {
          return reject(new Error("Cloudinary no devolvió resultado"));
        }

        resolve({
          url: result.secure_url,
          publicId: result.public_id,
        });
      },
      // (error, result) => {
      //   if (error || !result)
      //     return reject(error ?? new Error("Upload fallido"));
      //   resolve({ url: result.secure_url, publicId: result.public_id });
      // },
    );

    Readable.from(buffer).pipe(uploadStream);
  });
}
