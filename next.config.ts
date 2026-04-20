import type { NextConfig } from "next";
import withBundleAnalyzer from "@next/bundle-analyzer";

const withAnalyzer = withBundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
});

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      { protocol: "http", hostname: "cdn2.safaraneh.com", pathname: "**" },
      { protocol: "https", hostname: "server.belink.ir", pathname: "**" },
      { protocol: 'https', hostname: 'trustseal.enamad.ir', pathname: '**'},
      { protocol: "https", hostname: "strapi.irangamecenter.com", pathname: "**" },
      { protocol: "https", hostname: "pn.irangamecenter.com", pathname: "**" },
      { protocol: "https", hostname: "ticketing.irangamecenter.com", pathname: "**" },
      { protocol: "https", hostname: "cdn.irangamecenter.com", pathname: "**" },
      { protocol: "http", hostname: "cdn.irangamecenter.com", pathname: "**" },
      { protocol: "https", hostname: "igc1.storage.c2.liara.space", pathname: "**" },
      { protocol: "https", hostname: "secure.gravatar.com", pathname: "**" },
      { protocol: "https", hostname: "dkstatics-public.digikala.com", pathname: "**" }
    ],
    formats: ["image/avif", "image/webp"],
  },
  reactStrictMode: true,
  env: {
    SITE_NAME: "https://irangamecenter.com",
    PROJECT_SERVER_TYPE: "https://",
    PROJECT_SERVER_IDENTITY: "identity.irangamecenter.com",
    PROJECT_SERVER_BLOG:"ticketing.irangamecenter.com",
    PROJECT_SERVER_DISCOUNT: "blog.irangamecenter.com",
    PROJECT_SERVER_ECOMMERCE: "ecommerce.irangamecenter.com",
    PROJECT_SERVER_PAYMENT:"payline.irangamecenter.com",
    PORT: "",
    PROJECT_SERVER_STRAPI: "strapi.irangamecenter.com",
    PROJECT_SERVER_STRAPI_TOKEN:"916f3f6237c66188b5a32bd37623c69fc5a5afdcd1042b6bb5279893b530cb36aaeae4130e195ee2b9ce34ac8f8668921494bbd72527eaeaf2e0c6f2451a2ab83cfdab4c46ebeb81e1e6932b2affd9a892dcef8262ec49450bb778e8d2a6c30c96baeb7d9119ca34ec646d318445dee014e1f32c6eb4806f48c2e2dca4d42189",
  },
};

export default withAnalyzer(nextConfig);