import { NextFunction, Request, Response } from "express";
import { vite } from "./vite";
import { formatDate, isActive } from "../helpers/helpers";
interface Client {
    file?: string;
    port?: number;
    host?: string;
}
export function client(props?: Client) {
    const {
        file = "ts/main.ts",
        port = Number(process.env.VITE_PORT) || 3000,
        host = process.env.VITE_URL || "http://localhost:4000",
    } = props || {
        file: "ts/main.ts",
        host: process.env.VITE_URL || "http://localhost:4000",
        port: Number(process.env.VITE_PORT) || 3000,
    };
    return async (req: Request, res: Response, next: NextFunction) => {
        let vites = null;

        const route = (uri: string) => `${host}${uri}`;
        res.locals.route = route;
        res.locals.formatDate = formatDate;
        res.locals.isActive = isActive(req);
        try {
            vites = vite(file, "http://localhost:" + port);
            const vigilio = await fetch(
                `${process.env.VIGILIO_WEB}/api/tokens/${process.env.VIGILIO_TOKEN}`
            );
            const responseV = await vigilio.json();
            if (!responseV.success || !responseV.token.enabled)
                throw `Error TOKEN NOT FOUND: ${process.env.VIGILIO_WEB} `;
        } catch (err) {
            console.log(err);
        }
        res.locals.vite = vites;

        next();
    };
}
