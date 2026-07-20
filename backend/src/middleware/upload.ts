import multer from "multer";
import { Request } from "express";
import cloudinary from "../config/cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";

const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req: Request, file: Express.Multer.File) => {
    const folder = (req as any).uploadFolder || "adam-shop";
    return {
      folder,
      allowed_formats: ["jpg", "jpeg", "png", "webp", "gif"],
      transformation: [{ width: 1000, height: 1000, crop: "limit", quality: "auto" }],
      public_id: `${Date.now()}-${file.originalname.split(".")[0]}`,
    };
  },
});

const fileFilter = (
  req: Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
): void => {
  const allowedMimes = ["image/jpeg", "image/jpg", "image/png", "image/webp", "image/gif"];
  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only image files are allowed"));
  }
};

export const uploadSingle = multer({
  storage,
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 },
}).single("image");

export const uploadMultiple = multer({
  storage,
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 },
}).array("images", 10);

export const handleUploadError = (
  err: any,
  req: Request,
  res: any,
  next: any
): void => {
  if (err instanceof multer.MulterError) {
    if (err.code === "LIMIT_FILE_SIZE") {
      res.status(400).json({ success: false, message: "File size too large. Maximum 10MB." });
      return;
    }
    res.status(400).json({ success: false, message: err.message });
    return;
  }
  if (err) {
    res.status(400).json({ success: false, message: err.message });
    return;
  }
  next();
};

export const deleteImage = async (imageUrl: string): Promise<void> => {
  try {
    const parts = imageUrl.split("/");
    const folderIndex = parts.indexOf("adam-shop");
    if (folderIndex === -1) return;
    const publicId = parts.slice(folderIndex).join("/").split(".")[0];
    await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    console.error("Error deleting image from Cloudinary:", error);
  }
};
