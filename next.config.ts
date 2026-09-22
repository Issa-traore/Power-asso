import path from "path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone", // minimal, self-contained build for Docker deployment (Coolify, etc.)
  turbopack: {
    root: path.join(__dirname),
  },
};

export default nextConfig;
