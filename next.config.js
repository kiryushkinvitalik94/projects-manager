/** @type {import('next').NextConfig} */

const { parsed: localEnv } = require("dotenv").config({
  path: process.env.NODE_ENV === "production" ? ".env" : ".env.local",
});

const nextConfig = {
  env: {
    DB_HOST:
      process.env.NODE_ENV === "production"
        ? process.env.DB_HOST
        : localEnv.DB_HOST,
    DB_USER:
      process.env.NODE_ENV === "production"
        ? process.env.DB_USER
        : localEnv.DB_USER,
    DB_PASSWORD:
      process.env.NODE_ENV === "production"
        ? process.env.DB_PASSWORD
        : localEnv.DB_PASSWORD,
    DB_NAME:
      process.env.NODE_ENV === "production"
        ? process.env.DB_NAME
        : localEnv.DB_NAME,
    SECRET_KEY:
      process.env.NODE_ENV === "production"
        ? process.env.SECRET_KEY
        : localEnv.SECRET_KEY,
  },
};

module.exports = nextConfig;
