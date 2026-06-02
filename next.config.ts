import type { NextConfig } from "next";
import fs from "fs";
import path from "path";

function copyFolderSync(from: string, to: string) {
  if (!fs.existsSync(to)) {
    fs.mkdirSync(to, { recursive: true });
  }
  fs.readdirSync(from).forEach((element) => {
    const stat = fs.lstatSync(path.join(from, element));
    if (stat.isFile()) {
      fs.copyFileSync(path.join(from, element), path.join(to, element));
    } else if (stat.isDirectory()) {
      copyFolderSync(path.join(from, element), path.join(to, element));
    }
  });
}

try {
  const fromDir = "c:\\Users\\Ameer Al.kholany\\Desktop\\e-commerce-platform\\modern-gen-z-energy-drink-landing-page-with-lenis-smooth-scroll-and-framer-motion\\public";
  const toDir = "c:\\Users\\Ameer Al.kholany\\Desktop\\e-commerce-platform\\public";
  copyFolderSync(fromDir, toDir);
  console.log("Assets copied successfully!");
} catch (e) {
  console.error("Failed to copy assets", e);
}

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
