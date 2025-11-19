import { fal } from "@fal-ai/client";

// подключаем ключ
fal.config({
  credentials: process.env.FAL_KEY!,
});

// универсальная функция с таймаутом
async function runWithTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  let timer: NodeJS.Timeout;

  const timeout = new Promise<never>((_, reject) => {
    timer = setTimeout(() => {
      reject(new Error("⏳ FAL timeout – модель зависла"));
    }, ms);
  });

  const result = await Promise.race([promise, timeout]);
  clearTimeout(timer!);

  return result as T;
}

export async function generateImage(prompt: string): Promise<string> {
  try {
    // 🚀 Модель Flux Schnell — бесплатная и самая быстрая
    const modelId = "fal-ai/flux/schnell";

    const result: any = await runWithTimeout(
      fal.run(modelId, {
        input: {
          prompt,
          image_size: "square_hd", // корректный размер
        },
      }),
      30000 // 30 секунд таймаут
    );

    console.log("FAL RAW RESULT:", result);

    const images = result?.output?.images;

    if (!images || images.length === 0) {
      throw new Error("❌ Flux не вернул изображение");
    }

    const imageUrl = images[0].url;

    // скачиваем в base64
    const response = await fetch(imageUrl);
    const buffer = await response.arrayBuffer();
    const base64 = Buffer.from(new Uint8Array(buffer)).toString("base64");

    return base64;
  } catch (err: any) {
    console.error("🔥 FAL ERROR:", err);
    throw new Error("Ошибка генерации изображения");
  }
}
