import { createRequestHandler } from "react-router";
import { warmCache } from "../app/lib/cache-warmer";

declare module "react-router" {
  interface AppLoadContext {
    cloudflare: {
      env: Env;
      ctx: ExecutionContext;
    };
  }
}

const requestHandler = createRequestHandler(
  // @ts-expect-error - server build module from react-router build
  () => import("../build/server/index.js"),
  "production"
);

export default {
  async fetch(request, env, ctx) {
    return requestHandler(request, {
      cloudflare: { env, ctx },
    });
  },

  // Cron-triggered cache warmer (see wrangler.jsonc `triggers.crons`).
  // Slowly populates D1 so user requests never have to hit bonfirehub directly.
  async scheduled(_controller, env, ctx) {
    ctx.waitUntil(warmCache(env));
  },
} satisfies ExportedHandler<Env>;
