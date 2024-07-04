import { getAuthConfig } from './auth/index';
import express from "express";
import { authenticatedUser } from './middlewear/authenticateUser';

const app = express();

app.set("trust proxy", true)
app.use("/auth/*", getAuthConfig())

app.get("/protected", authenticatedUser, (req, res) => {
    res.send("Hello World from protected route!");
});

app.get("/", (req, res) => {
    res.send("Hello World!");
});

export { app };