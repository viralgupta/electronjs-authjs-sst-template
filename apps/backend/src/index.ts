import { authenticatedUser } from "./middlewear/authenticateUser";
import express from "express";
import { ExpressAuth } from "@auth/express";
import AuthConfig from "./auth.config";
import cors from "cors"

const app = express();

app.set("trust proxy", true);
app.use(express.json());
app.use(cors());

app.use("/auth/*", ExpressAuth(AuthConfig));

app.get("/authcallbackoverride", (req, res) => {
  res.status(200).json({ url: req.query.callback ? req.query.callback : "/" })
});

app.use("/api/*", authenticatedUser);

app.get("/api/protected", (_req, res) => {
  res.status(200).json({ message: "Hello from protected route 👋" });
})

export { app };