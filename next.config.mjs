// next.config.mjs

/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    images: {
      domains: ['raw.githubusercontent.com'],
    },
    async headers() {
      return [
        {
          source: "/api/:path*",
          headers: [
            { key: "Access-Control-Allow-Credentials", value: "true" },
            { key: "Access-Control-Allow-Origin", value: "*" },
            { key: "Access-Control-Allow-Methods", value: "GET,OPTIONS,PATCH,DELETE,POST,PUT" },
            { key: "Access-Control-Allow-Headers", value: "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version" },
          ]
        }
      ]
    },
    env: {
      NEXT_PUBLIC_GITHUB_TOKEN: process.env.GITHUB_TOKEN,
      JUDGE0_API_KEY: process.env.JUDGE0_API_KEY,
      JUDGE0_API_HOST: process.env.JUDGE0_API_HOST,
    },
  };
  
  export default nextConfig;