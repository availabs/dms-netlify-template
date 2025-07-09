import { type RouteConfig, index,route } from "@react-router/dev/routes";

export default [
	index("./modules/dms/src/ssr/index.tsx"),
	route("*", "./modules/dms/src/ssr/dms.tsx"),
	route('dms_api', './modules/dms/src/ssr/dms_api.ts'),
	route("about", "routes/about.tsx")
] satisfies RouteConfig;
