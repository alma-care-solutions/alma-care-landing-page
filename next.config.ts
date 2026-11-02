import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Screenshots are shown downscaled, so they get a higher quality than the default 75
    qualities: [75, 90],
    // Widths for mockups (hero 1272 px, dashboard 1272 px, phones 320 px)
    deviceSizes: [390, 640, 768, 1024, 1280, 1440, 1920, 2560],
    imageSizes: [240, 320, 480, 640],
  },
};

export default nextConfig;
