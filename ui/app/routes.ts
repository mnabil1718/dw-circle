import { type RouteConfig, index, layout, route } from "@react-router/dev/routes";

export default [
    index("routes/test.tsx"),
    route("/login", "routes/login.tsx"),
    route("/register", "routes/register.tsx"),
    layout("layouts/post-layout.tsx", [
    route("/home", "routes/home.tsx"),
    route("/posts/:id", "routes/post.tsx"),
  ]),
] satisfies RouteConfig;
