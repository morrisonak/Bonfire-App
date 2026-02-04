import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),

  // Better Auth handler (mount point)
  route("api/auth/*", "routes/api.auth.$.ts"),

  // Magic link sign-in page
  route("login", "routes/login.tsx"),
] satisfies RouteConfig;
