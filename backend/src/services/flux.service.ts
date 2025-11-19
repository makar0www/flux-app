export async function generateImage(prompt: string): Promise<string> {
  try {
    // фикс коротких промптов
    const fixedPrompt =
      prompt.trim().length < 5
        ? `high quality detailed photo of ${prompt}, ultra realistic`
        : prompt;

    // новый рабочий HF endpoint (официальный)
    const HF_URL =
      "https://router.huggingface.co/hf-inference/black-forest-labs/FLUX.1-schnell";

    const response = await fetch(HF_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // Authorization НЕ нужен для FREE
      },
      body: JSON.stringify({
        inputs: fixedPrompt,
        parameters: {
          width: 768,
          height: 768,
        },
      }),
    });

    // модель загружается (обычно 5–20 сек)
    if (response.status === 503) {
      throw new Error("Модель загружается, попробуй снова через пару секунд");
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

    // преобразуем байты в base64
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const base64 = buffer.toString("base64");

    return base64;
  } catch (e) {
    console.error("HF ERROR:", e);
    throw new Error("Ошибка генерации изображения");
  }
}
