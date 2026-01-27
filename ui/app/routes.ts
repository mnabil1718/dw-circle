import { type RouteConfig, index, layout, route } from "@react-router/dev/routes";

export default [
    index("routes/test.tsx"),
    route("/login", "routes/login.tsx"),
    route("/register", "routes/register.tsx"),
    layout("layouts/post-layout.tsx", [
    route("/home", "routes/home.tsx"),
    route("/follow", "routes/follow.tsx"),
    route("/profile", "routes/profile.tsx"),
    route("/:username", "routes/user-profile.tsx"),
    route("/search", "routes/search.tsx"),
    route("/posts/:id", "routes/post.tsx"),
  ]),
] satisfies RouteConfig;
