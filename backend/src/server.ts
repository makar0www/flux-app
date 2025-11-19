import Fastify from "fastify";
import * as dotenv from "dotenv";
dotenv.config();

import geminiRoutes from "./routes/gemini";
import telegramRoutes from "./routes/telegram";

const fastify = Fastify({ logger: true });

fastify.register(geminiRoutes, { prefix: "/api" });
fastify.register(telegramRoutes, { prefix: "/api" });

const PORT = process.env.PORT || 3000;

fastify.listen({ port: Number(PORT), host: "0.0.0.0" }, () => {
  console.log("🚀 Server started on port " + PORT);
});
