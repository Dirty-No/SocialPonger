export default {
	apiPort: Number(process.env.API_PORT) || 3000,
	env: process.env.NODE_ENV || "development",
	cors: { origin: process.env.API_CORS || "*" },
	sessionTimeout: Number(process.env.API_SESSION_TIMEOUT) || 60000,
	baseUrl: process.env.API_BASE_URL || "http://localhost:3000",
	itemPerPage: process.env.API_ITEM_PER_PAGE || 10,
	maxItemPerPage: Number(process.env.API_MAX_ITEM_PER_PAGE) || 100,
};
