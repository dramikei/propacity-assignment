
import { Boom } from "@hapi/boom";
import { STATUS_CODES } from "http";
import { NextFunction, Request, Response } from "express";
import { logger } from './logger';

export const ErrorHandler = (error: Boom | any, req: Request, res: Response, next: NextFunction) => {
    let body = req.body || {};
    if (req.query) body = { ...body, ...req.query };
    // include params in /tracking/<id:string>
    if (req.params) body = { ...body, ...req.params };

    // Delete uploaded files
    // if (req.file) {
    //     fs.unlink(req.file.path, (err: any) => {
    //         logger.error(`Error while unlinking file: ${err}`);
    //     });
    // }

    let code = error?.output?.statusCode ?? error?.status ?? 500;
    if (typeof code !== "number") code = 500;

    // capture type errors
    if (error instanceof TypeError || typeof error.code === "undefined" || code >= 500) {
        // TypeErrors are caused by faulty code.
        // It is the responsibility of a dev to fix them
        // Sentry allows us to manage errors and assign them to team members
        // in order to fix/debug them etc.

        // Sentry.captureException(error, {
        //     extra: {
        //         path: mPath,
        //         params: { ...req.body, ...req.query },
        //     },
        // });
    }
    res.status(code).send({
        code,
        error: error.message || "unknown",
        message: STATUS_CODES[code],
    });
    const method = code >= 400 ? "error" : "info";
    const mPath = `${req.method} ${req.path}`;
    // TODO: - Can add data scrubbing logic here.
    logger[method]({
        path: mPath,
        headers: req.headers,
        body,
        error: error.message,
        trace: error?.stack?.toString(),
        ip: req.ip,
    });
};