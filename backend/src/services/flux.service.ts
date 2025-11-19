export async function generateImage(prompt: string): Promise<string> {
  try {
    // фикс коротких запросов
    const fixedPrompt =
      prompt.trim().length < 5
        ? `high quality detailed photo of ${prompt}, ultra realistic`
        : prompt;

    const HF_URL =
      "https://api-inference.huggingface.co/models/black-forest-labs/FLUX.1-schnell";

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

    // Модель прогревается → повторить позже
    if (response.status === 503) {
      throw new Error("Модель загружается, попробуй через 5 секунд");
    }

    if (!response.ok) {
      const err = await response.text();
      throw new Error("HF Error: " + err);
    }

    const contentType = response.headers.get("content-type");
    console.log("HF content-type:", contentType);

    if (!contentType?.includes("image")) {
      throw new Error("HF вернул не изображение");
    }

    // ответ — бинарная картинка
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const base64 = buffer.toString("base64");

    return base64;
  } catch (e) {
    console.error("HF ERROR:", e);
    throw new Error("Ошибка генерации изображения");
  }
}
