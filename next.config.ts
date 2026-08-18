import type { NextConfig } from "next";
import withSerwistInit from "@serwist/next";

const withSerwist = withSerwistInit({
  swSrc: "src/sw.ts",
  swDest: "public/sw.js",
  disable: process.env.NODE_ENV === "development",
  register: true,
  reloadOnOnline: false,
});

const nextConfig: NextConfig = {
  assetPrefix: process.env.NODE_ENV === "production" ? "https://nexora-fit.vercel.app" : undefined,
};

export default withSerwist(nextConfig);
