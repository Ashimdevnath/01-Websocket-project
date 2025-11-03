"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.corsOptions = void 0;
const express_1 = __importDefault(require("express"));
const db_config_1 = require("./config/db.config");
const env_config_1 = require("./config/env.config");
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const http_1 = require("http");
const index_1 = require("./sockets/index");
const routes_1 = __importDefault(require("./routes"));
const app = (0, express_1.default)();
exports.corsOptions = {
    origin: (origin, callback) => {
        if (!origin || env_config_1.ALLOWED_ORIGINS.includes(origin)) {
            callback(null, true);
        }
        else {
            callback(new Error("Not allowed by CORS: " + origin));
        }
    },
    credentials: true,
    optionsSuccessStatus: 200,
};
app.use((0, cors_1.default)(exports.corsOptions));
app.use(express_1.default.json());
(0, routes_1.default)(app);
app.use((0, helmet_1.default)({
    contentSecurityPolicy: false,
}));
// const globalRateLimit = rateLimit({
//   windowMs: 1 * 60 * 60 * 1000, // 1 hour
//   max: 60, // Limit each IP to 60 requests per windowMs
//   message: { status: false, message: "Too many requests." },
//   headers: true, // Send rate limit info in headers
// });
// app.use(globalRateLimit);
// Logger (optional)
app.use((req, _res, next) => {
    console.log("API endpoint:", req.originalUrl);
    next();
});
// Route registration
// Server + Socket.IO Setup
const server = (0, http_1.createServer)(app);
(0, index_1.setupSocket)(server);
// Start server after DB connection
(0, db_config_1.connectDB)()
    .then(() => {
    server.listen(env_config_1.PORT, () => {
        console.log(`🚀 Server is running on port ${env_config_1.PORT}`);
    });
})
    .catch((error) => {
    console.error("❌ Server startup failed:", error);
});
