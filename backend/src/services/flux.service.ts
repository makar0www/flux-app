export async function generateImage(prompt: string): Promise<string> {
  try {
    const fixedPrompt =
      prompt.trim().length < 5
        ? `high quality detailed photo of ${prompt}, ultra realistic`
        : prompt;

    const HF_URL =
      "https://router.huggingface.co/hf-inference/models/black-forest-labs/FLUX.1-schnell";

    const response = await fetch(HF_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
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
      throw new Error("Модель загружается, попробуй через 5 секунд");
    }

    if (!response.ok) {
      const text = await response.text();
      throw new Error("HF Error: " + text);
    }

    const contentType = response.headers.get("content-type");
    console.log("HF content-type:", contentType);

    if (!contentType?.includes("image")) {
      throw new Error("HF вернул не изображение");
    }

    const arrayBuffer = await response.arrayBuffer();
    const base64 = Buffer.from(arrayBuffer).toString("base64");

    return base64;
  } catch (err) {
    console.error("HF ERROR:", err);
    throw new Error("Ошибка генерации изображения");
  }
}
