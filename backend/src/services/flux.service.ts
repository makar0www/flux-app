import { fal } from "@fal-ai/client";

fal.config({
  credentials: process.env.FAL_KEY!,
});

async function runWithTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  let timer: NodeJS.Timeout;

  const timeout = new Promise<never>((_, reject) =>
    timer = setTimeout(() => reject(new Error("FAL timeout")), ms)
  );

  const result = await Promise.race([promise, timeout]);
  clearTimeout(timer!);
  return result as T;
}

export async function generateImage(prompt: string): Promise<string> {
  try {
    // фикс коротких запросов
    const fixedPrompt =
      prompt.trim().length < 5
        ? `high quality photo of ${prompt}, detailed, realistic`
        : prompt;

    const result: any = await runWithTimeout(
      fal.run("fal-ai/flux/schnell", {
        input: {
          prompt: fixedPrompt,
          image_size: "square_hd",
        },
      }),
      30000
    );

    const images = result?.output?.images;
    if (!images || !images[0]?.url) {
      throw new Error("Flux не вернул изображение");
    }

    const imageUrl = images[0].url;

    const response = await fetch(imageUrl);
    const buffer = await response.arrayBuffer();
    const base64 = Buffer.from(buffer).toString("base64");

    return base64;
  } catch (e) {
    console.error("FAL ERROR:", e);
    throw new Error("Ошибка генерации изображения");
  }
}
