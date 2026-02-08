import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "MeetZap",
    short_name: "MeetZap",
    description: "The easiest free scheduling tool for everyone. Create events, share links, and find the best meeting times.",
    start_url: "/",
    display: "standalone",
    background_color: "#FFF8E7",
    theme_color: "#FFE500",
    icons: [
      {
        src: "/icon-192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icon-512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
