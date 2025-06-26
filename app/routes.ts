import { type RouteConfig, index,route } from "@react-router/dev/routes";

export default [
	index("routes/index.tsx"),
	route("*", "routes/dms.tsx"),
	route('dms_api', './routes/dms_api.ts'),
	route("about", "routes/about.tsx")
] satisfies RouteConfig;
