/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      "images.unsplash.com",
      "lh3.googleusercontent.com",
      "pbs.twimg.com",
      "utfs.io",
      "instagram.flos1-1.fna.fbcdn.net",
      "instagram.flos5-3.fna.fbcdn.net",
      "instagram.forn2-1.fna.fbcdn.net",
    ],
  },
  optimizeFonts: false,
};

module.exports = nextConfig;

// Injected content via Sentry wizard below

const { withSentryConfig } = require("@sentry/nextjs");

module.exports = withSentryConfig(module.exports, {
  // For all available options, see:
  // https://github.com/getsentry/sentry-webpack-plugin#options

  org: "reel-synth",
  project: "javascript-nextjs",

  silent: !process.env.CI,
  widenClientFileUpload: true,
  tunnelRoute: "/monitoring",

  // Hides source maps from generated client bundles
  hideSourceMaps: true,

  // Automatically tree-shake Sentry logger statements to reduce bundle size
  disableLogger: true,

  // Enables automatic instrumentation of Vercel Cron Monitors. (Does not yet work with App Router route handlers.)
  // See the following for more information:
  // https://docs.sentry.io/product/crons/
  // https://vercel.com/docs/cron-jobs
  automaticVercelMonitors: true,
});
