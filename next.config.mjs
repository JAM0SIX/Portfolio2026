/** @type {import('next').NextConfig} */
const nextConfig = {
  /* Permanent redirect from the old, misspelled project URL to the
     corrected slug so existing links / bookmarks don't 404. The page
     itself now lives at /philpottpearce. */
  async redirects() {
    return [
      {
        source: "/philpotpearce",
        destination: "/philpottpearce",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
