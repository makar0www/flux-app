import { FastifyInstance } from "fastify";
import { generateImage } from "../services/flux.service";
import { sendPhoto, sendText } from "../services/telegram.service";

export default async function telegramRoutes(fastify: FastifyInstance) {
  fastify.post("/tg", async (request, reply) => {
    const body = request.body as any;

    const message = body?.message;
    if (!message) return reply.send({ ok: true });

    const chatId = message.chat.id;
    const text = message.text?.trim();

    if (!text) {
      await sendText(chatId, "Отправь текст для генерации!");
      return reply.send({ ok: true });
    }

    // Сообщение о генерации
    await sendText(chatId, "⏳ Генерирую изображение...");

    try {
      // Генерация через FAL/Flux
      const base64 = await generateImage(text);

      // ВАЖНО: Telegram принимает только data:image/png;base64,<...>
      const telegramImage = `data:image/png;base64,${base64}`;

      // Отправка
      await sendPhoto(chatId, telegramImage);
    } catch (error) {
      console.error("Ошибка генерации:", error);
      await sendText(chatId, "❌ Ошибка генерации изображения");
    }

    return reply.send({ ok: true });
  });
}
