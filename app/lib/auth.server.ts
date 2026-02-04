import { createPool } from "@vercel/postgres";
import { betterAuth } from "better-auth";
import { magicLink } from "better-auth/plugins";
import { Resend } from "resend";

const pool = createPool();

function requireEnv(name: string) {
  const v = process.env[name];
  if (!v) throw new Error(`Missing env var: ${name}`);
  return v;
}

export const auth = betterAuth({
  secret: requireEnv("BETTER_AUTH_SECRET"),
  baseURL: process.env.BETTER_AUTH_URL,

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
              <p style="color:#666">If you didn’t request this, you can ignore this email.</p>
            </div>
          `,
        });
      },
    }),
  ],
});
