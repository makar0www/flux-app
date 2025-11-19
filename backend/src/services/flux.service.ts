import fal from "fal";

fal.config({
  credentials: process.env.FAL_KEY!,
});

export async function generateImage(prompt: string): Promise<string> {
  const result = await fal.run("fal-ai/flux-pro", {
    input: {
      prompt,
      image_size: "1024x1024",
    },
  });

  if (!result.images || result.images.length === 0) {
    throw new Error("Fal/Flux не вернул изображение");
  }

  const imageUrl = result.images[0].url;

  const response = await fetch(imageUrl);
  const buffer = await response.arrayBuffer();
  const base64 = Buffer.from(buffer).toString("base64");

  return base64;
}
