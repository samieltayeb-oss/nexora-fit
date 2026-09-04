import type { NextConfig } from "next";
import withSerwistInit from "@serwist/next";

const withSerwist = withSerwistInit({
  swSrc: "src/sw.ts",
  swDest: "public/sw.js",
  swUrl: "/sw.js",
  scope: "/nexorafit/",
  disable: process.env.NODE_ENV === "development",
  register: true,
  reloadOnOnline: false,
});

const nextConfig: NextConfig = {
  basePath: "/nexorafit",
};

export default withSerwist(nextConfig);

