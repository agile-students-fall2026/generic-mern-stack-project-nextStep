import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import authRouter from "./routes/auth.js";
import requestsRouter from "./routes/requests.js";
import tasksRouter from "./routes/tasks.js";
import profileRoutes from "./routes/profile.js";


dotenv.config();

const app = express();

app.use(cors({
    origin: process.env.FRONTEND_ORIGIN ?? "http://localhost:5173",
    credentials: true,
}));
app.use(express.json({ limit: "10kb" }));
app.get("/", (req, res) => {
    res.json({ message: "NextStep API is running." });
});
app.use("/api/auth", authRouter);
app.use("/api/requests", requestsRouter);
app.use("/api/profile", profileRoutes);
app.use("/api/tasks", tasksRouter);

app.use((error, req, res, next) => {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
});

export function startServer() {
    if (process.env.NODE_ENV === "production" &&
        (!process.env.JWT_SECRET || Buffer.byteLength(process.env.JWT_SECRET) < 32)) {
        throw new Error("Production requires a JWT_SECRET of at least 32 bytes.");
    }

    const port = Number(process.env.PORT ?? 3001);

    return app.listen(port, () => {
        console.log(`API server listening on port ${port}`);
    });
}

if (process.argv[1] && fileURLToPath(import.meta.url) === resolve(process.argv[1])) {
    try {
        startServer();
    } catch (error) {
        console.error("Unable to start API server:", error);
        process.exitCode = 1;
    }
}

export default app;
