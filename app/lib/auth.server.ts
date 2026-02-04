import { createPool } from "@vercel/postgres";
import { betterAuth } from "better-auth";
import { magicLink } from "better-auth/plugins";
import { Resend } from "resend";

function requireEnv(name: string): string {
  const v = process.env[name];
  if (!v) {
    const msg = `Missing required environment variable: ${name}`;
    console.error(msg);
    throw new Error(msg);
  }
  return v;
}

// Validate required env vars early
const authSecret = requireEnv("BETTER_AUTH_SECRET");
const baseURL = process.env.BETTER_AUTH_URL || "http://localhost:5173";

// Check if we have Postgres configured
if (!process.env.POSTGRES_URL) {
  const msg = "Missing POSTGRES_URL - Vercel Postgres not configured";
  console.error(msg);
  throw new Error(msg);
}

const pool = createPool();

export const auth = betterAuth({
  secret: authSecret,
  baseURL,

  // Better Auth supports passing a pg Pool directly.
  database: pool,

  plugins: [
    magicLink({
      sendMagicLink: async ({ email, url }) => {
        // In dev, you can simply log the URL. In prod, send it.
        if (!process.env.RESEND_API_KEY) {
          console.log(`[magic-link] ${email}: ${url}`);
          return;
        }

        const resend = new Resend(process.env.RESEND_API_KEY);
        const from = requireEnv("EMAIL_FROM");

        await resend.emails.send({
          from,
          to: email,
          subject: "Your sign-in link",
          html: `
            <div style="font-family: ui-sans-serif, system-ui; line-height: 1.4">
              <p>Click to sign in:</p>
              <p><a href="${url}">Sign in</a></p>
              <p style="color:#666">If you didn't request this, you can ignore this email.</p>
            </div>
          `,
        });
      },
    }),
  ],
});
