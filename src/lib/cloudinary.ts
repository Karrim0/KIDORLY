import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function uploadImage(
  file: Buffer | string,
  folder: string = "kidorly"
): Promise<{ url: string; publicId: string }> {
  return new Promise((resolve, reject) => {
    const uploadOptions = { folder, resource_type: "image" as const };

    if (typeof file === "string") {
      // base64 data URI
      cloudinary.uploader.upload(file, uploadOptions, (error, result) => {
        if (error || !result) return reject(error);
        resolve({ url: result.secure_url, publicId: result.public_id });
      });
    } else {
      const stream = cloudinary.uploader.upload_stream(
        uploadOptions,
        (error, result) => {
          if (error || !result) return reject(error);
          resolve({ url: result.secure_url, publicId: result.public_id });
        }
      );
      stream.end(file);
    }
  });
}

export async function deleteImage(publicId: string) {
  return cloudinary.uploader.destroy(publicId);
}

export { cloudinary };
