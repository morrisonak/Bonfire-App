#!/usr/bin/env bun

/**
 * Validates required environment variables for auth deployment
 * Run before deploying: bun scripts/check-env.ts
 */

const REQUIRED = [
  "BETTER_AUTH_SECRET",
  "BETTER_AUTH_URL",
  "POSTGRES_URL",
] as const;

const OPTIONAL = ["RESEND_API_KEY", "EMAIL_FROM"] as const;

function check() {
  console.log("🔍 Checking environment variables...\n");

  let hasErrors = false;

  // Check required vars
  for (const key of REQUIRED) {
    const value = process.env[key];
    if (!value) {
      console.error(`❌ Missing required: ${key}`);
      hasErrors = true;
    } else {
      // Validate specific vars
      if (key === "BETTER_AUTH_SECRET" && value.length < 32) {
        console.error(
          `❌ ${key} must be at least 32 characters (current: ${value.length})`
        );
        hasErrors = true;
      } else if (
        key === "BETTER_AUTH_URL" &&
        !value.startsWith("http")
      ) {
        console.error(`❌ ${key} must be a valid URL (got: ${value})`);
        hasErrors = true;
      } else {
        console.log(`✅ ${key} is set`);
      }
    }
  }

  // Check optional vars
  console.log("\nOptional (for production email):");
  for (const key of OPTIONAL) {
    const value = process.env[key];
    if (value) {
      console.log(`✅ ${key} is set`);
    } else {
      console.log(`⚠️  ${key} not set (magic links will be logged)`);
    }
  }

  // Summary
  console.log("\n" + "=".repeat(50));
  if (hasErrors) {
    console.error("❌ Environment check FAILED");
    console.error("   Fix the errors above before deploying.");
    process.exit(1);
  } else {
    console.log("✅ Environment check PASSED");
    console.log("   All required variables are set.");
  }
}

check();
