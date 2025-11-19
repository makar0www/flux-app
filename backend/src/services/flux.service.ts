export async function generateImage(prompt: string): Promise<string> {
  try {
    const fixedPrompt =
      prompt.trim().length < 5
        ? `ultra detailed photo of ${prompt}, 4k realistic`
        : prompt;

    const HF_URL =
      "https://router.huggingface.co/hf-inference/models/black-forest-labs/FLUX.1-schnell";

    const response = await fetch(HF_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.FAL_KEY}`,
      },
      body: JSON.stringify({
        inputs: fixedPrompt,
        parameters: {
          width: 768,
          height: 768,
        },
      }),
    });

    if (response.status === 503) {
      throw new Error("Модель загружается, попробуй позже");
    }

    if (!response.ok) {
      const t = await response.text();
      throw new Error("HF Error: " + t);
    }

    const contentType = response.headers.get("content-type");

    if (!contentType?.includes("image")) {
      const txt = await response.text();
      throw new Error("HF не вернул изображение: " + txt);
    }

    const arrayBuffer = await response.arrayBuffer();
    const base64 = Buffer.from(arrayBuffer).toString("base64");
    return base64;
  } catch (err) {
    console.error("HF ERROR:", err);
    throw new Error("Ошибка генерации изображения");
  }
}
