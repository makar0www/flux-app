import { FastifyInstance } from "fastify";
import { generateImage } from "../services/flux.service";
import { sendPhoto, sendText } from "../services/telegram.service";

export default async function telegramRoutes(fastify: FastifyInstance) {
  fastify.post("/tg", async (request, reply) => {
    const body = request.body as any;

    const message = body?.message;
    if (!message) return reply.send({ ok: true });

    const chatId = message.chat.id;
    const text = message.text;

    if (!text) {
      await sendText(chatId, "Отправь текст для генерации!");
      return reply.send({ ok: true });
    }

    await sendText(chatId, "⏳ Генерирую изображение...");

    try {
      const base64 = await generateImage(text);
      await sendPhoto(chatId, base64);
    } catch (error) {
      console.error(error);
      await sendText(chatId, "❌ Ошибка генерации изображения");
    }

    return reply.send({ ok: true });
  });
}
