import express from "express";
import cors from "cors";
import passport from "passport";
import "./config/passport.js";

import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js";
import teamRoutes from "./routes/team.routes.js";
import taskRoutes from "./routes/task.routes.js";
import notificationRoutes from "./routes/notification.routes.js";
import reportRoutes from "./routes/report.routes.js";
import noticeRoutes from "./routes/notice.routes.js";
import aiRoutes from "./routes/ai.routes.js";

const app = express();

// ✅ Allowed Origins
const allowedOrigins = [
  "http://localhost:5173",               // Local frontend
  "https://codexpert-khaki.vercel.app",  // Deployed frontend
];

// ✅ Dynamic CORS middleware
app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like Postman / server-to-server)
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      } else {
        console.log("❌ Blocked by CORS:", origin);
        return callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

// ✅ Optional: simple route to test Render deployment
app.get("/", (req, res) => {
  res.send("✅ CodeXpert backend running successfully 🚀");
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(passport.initialize());

// ✅ API Routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/teams", teamRoutes);
app.use("/api/v1/tasks", taskRoutes);
app.use("/api/v1/notifications", notificationRoutes);
app.use("/api/v1/reports", reportRoutes);
app.use("/api/v1/notices", noticeRoutes);
app.use("/api/v1/ai", aiRoutes);

export default app;
