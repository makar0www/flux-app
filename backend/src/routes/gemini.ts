import { FastifyInstance } from "fastify";
import { generateImage } from "../services/flux.service";

export default async function geminiRoutes(fastify: FastifyInstance) {
  fastify.post("/generate-image", async (request, reply) => {
    const { prompt } = request.body as { prompt: string };

    if (!prompt) {
      return reply.status(400).send({ error: "Prompt is required" });
    }

    try {
      const base64 = await generateImage(prompt);

      return reply.send({
        ok: true,
        image: base64,
      });
    } catch (err) {
      console.error("Gemini error:", err);
      return reply.status(500).send({ error: "Image generation failed" });
    }
  });
}
