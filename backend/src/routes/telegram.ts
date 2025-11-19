import { FastifyInstance } from "fastify";
import { generateImage } from "../services/flux.service";
import { sendPhoto, sendText } from "../services/telegram.service";

export default async function telegramRoutes(fastify: FastifyInstance) {
  fastify.post("/tg", async (request, reply) => {
    const body = request.body as any;

    const message = body?.message;
    if (!message) return reply.send({ ok: true });

    const chatId = message.chat.id;
    const text = message.text?.trim() || "";

    // базовый промпт
    const BASE_PROMPT =
      "Pepe the frog standing in front of the White House, ultra detailed, 4k, digital illustration";

    // если пользователь что-то дописал — добавляем
    const finalPrompt = text
      ? `${BASE_PROMPT}, ${text}`
      : BASE_PROMPT;

    // если пользователь вообще ничего не написал
    if (!text) {
      await sendText(
        chatId,
        "Я сделаю: Пепе на фоне Белого дома.\nМожешь добавить детали, например: «с синими волосами и белым Porsche»"
      );
    }

    await sendText(chatId, "⏳ Генерирую изображение...");

    try {
      const base64 = await generateImage(finalPrompt);
      await sendPhoto(chatId, base64);
    } catch (error) {
      console.error("Ошибка генерации:", error);
      await sendText(chatId, "❌ Ошибка генерации изображения");
    }

    return reply.send({ ok: true });
  });
}
