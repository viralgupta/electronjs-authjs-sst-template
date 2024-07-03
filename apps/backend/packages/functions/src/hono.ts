import { Hono } from 'hono'
import { authHandler, initAuthConfig, verifyAuth, getAuthConfig, handle } from "@repo/auth"
// import { Todo } from "@backend/core/todo";

const app = new Hono()

app.use("*", initAuthConfig(getAuthConfig))

app.use("/api/auth/*", authHandler())

app.use('/api/*', verifyAuth())

// app.get('/api/protected', (c) => {
//   const auth = c.get("authUser")
//   return c.json(auth)
// })


export const handler = handle(app)