import { config } from 'dotenv'
config();
import express from "express";
import "express-async-errors";
import cors from "cors";
import { logger } from "./utils/logger";
import pino from 'pino-http';
import { Boom } from "@hapi/boom";
import { ErrorHandler } from "./utils/server";
import { setupDatabase } from "./utils/db";

// Routes
import userRoutes from './routes/user/user.routes';
import filesystemRoutes from './routes/filesystem/filesystem.routes';

const app = express();

app.use(express.json());
app.use(cors());
app.use(pino());

// Routes to be called when DB Connection was successful.
app.use("/api/v1/ping", async (_, res) => {
    res.json({
        status: "success",
        message: "Pinged!",
    });
});

// User Routes
app.use("/api/v1/user", userRoutes);
// Filesystem Routes
app.use("/api/v1/fs", filesystemRoutes);

// Unsupported Routes
app.use(() => {
    throw new Boom("Cannot find this Route!", {
        statusCode: 404,
    });
});

// Error Handling for user/server errors
app.use(ErrorHandler);

const port = process.env.PORT || process.env.DEV_PORT || 8080;
app.listen(port, async () => {
    try {
        // Connect server
        await setupDatabase();
    } catch (err) {
        logger.error(`\nError connecting to DB:\n${err}`);
        throw err;
    }
    logger.info(`Started server on Port: ${port}`);
});
