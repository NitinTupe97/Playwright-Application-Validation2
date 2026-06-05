import { defineConfig } from "@playwright/test";

const baseURL = process.env.BASE_URL ?? "https://a30.vehr.veradigmcloud.com/userportal/apps";

export default defineConfig({
  testDir: "./tests",
  timeout: 60_000,
  expect: { timeout: 10_000 },
  retries: process.env.CI ? 1 : 0,
  use: {
    baseURL,
    trace: "on-first-retry",
    screenshot: "only-on-failure",
    video: "retain-on-failure"
  },
  reporter: [
    ["list"],
    ["html", { outputFolder: "playwright-report", open: "never" }]
  ]
});
