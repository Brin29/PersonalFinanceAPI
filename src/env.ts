import dotenv from "dotenv";

dotenv.config();

export const env = {
  NODE_ENV: process.env.NODE_ENV || "development",
  APP_URL: process.env.APP_URL,
  COOKIE_SECRET: process.env.COOKIE_SECRET!,
  MAIL_HOST: process.env.MAIL_HOST!,
  MAIL_PORT: Number(process.env.MAIL_PORT),
  MONGO_URI: process.env.MONGO_URI,
  MAIL_USER: process.env.MAIL_USER!,
  GITHUB_CLIENT_ID: process.env.GITHUB_CLIENT_ID,
  GITHUB_CLIENT_SECRET: process.env.GITHUB_CLIENT_SECRET,
  GITHUB_CALLBACK_URL: process.env.GITHUB_CALLBACK_URL,
  MAIL_PASSWORD: process.env.MAIL_PASSWORD!,
  FRONTEND_URL: process.env.FRONTEND_URL,
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
  CLIENT_URL: process.env.CLIENT_URL,
  REDIRECT_URL: process.env.REDIRECT_URL,
  CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
  CLOUDINARY_NAME: process.env.CLOUDINARY_NAME,
  CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET,
  IMG_SRC: process.env.IMG_SRC,
};
