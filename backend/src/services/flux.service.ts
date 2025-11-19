import { fal } from "@fal-ai/client";

fal.config({
  credentials: process.env.FAL_KEY!,
});

export async function generateImage(prompt: string): Promise<string> {
  const result: any = await fal.run("fal-ai/flux-schnell", {
    input: {
      prompt,
      image_size: "1024x1024",
    },
  });

  // Универсальный поиск картинок (независимо от версии API)
  const images =
    result.images ||
    result.output?.images ||
    result.data?.images ||
    result.result?.images;

  if (!images || images.length === 0) {
    throw new Error("Fal/Flux не вернул изображение");
  }

  const imageUrl = images[0].url;

  const response = await fetch(imageUrl);
  const buffer = await response.arrayBuffer();
  const base64 = Buffer.from(buffer).toString("base64");

  return base64;
}
