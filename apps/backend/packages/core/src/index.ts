import { getAuthConfig, ExpressAuth } from './auth/index';
import express from "express";

const app = express();

app.use("/auth/*", ExpressAuth({ providers: [getAuthConfig()]}))

export { app };