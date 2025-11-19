import { fal } from "@fal-ai/client";

fal.config({
  credentials: process.env.FAL_KEY!,
});

export async function generateImage(prompt: string): Promise<string> {
  const result: any = await fal.run("fal-ai/flux/schnell", {
  input: {
    prompt,
    image_size: "square_hd",
  },
});

  const images =
    result.data?.images ||
    result.output?.images ||
    result.images;

  if (!images || images.length === 0) {
    throw new Error("Fal/Flux не вернул изображение");
  }

  const imageUrl = images[0].url;

  const response = await fetch(imageUrl);
  const buffer = await response.arrayBuffer();
  const base64 = Buffer.from(buffer).toString("base64");

  return base64;
}
