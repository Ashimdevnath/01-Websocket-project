import express from "express";
import { connectDB } from "./config/db.config";
import { PORT, ALLOWED_ORIGINS } from "./config/env.config";
import cors, { CorsOptions } from "cors";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import { createServer } from "http";
import { setupSocket } from "./sockets/index";
import registerRoutes from "./routes";

const app = express();

export const corsOptions: CorsOptions = {
  origin: (origin, callback) => {
    if (!origin || ALLOWED_ORIGINS.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS: " + origin));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));

app.use(express.json());

registerRoutes(app);

app.use(
  helmet({
    contentSecurityPolicy: false,
  })
);

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
const server = createServer(app);
setupSocket(server);

// Start server after DB connection
connectDB()
  .then(() => {
    server.listen(PORT, () => {
      console.log(`🚀 Server is running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("❌ Server startup failed:", error);
  });


