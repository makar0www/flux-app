export async function generateImage(prompt: string): Promise<string> {
  try {
    const fixedPrompt =
      prompt.trim().length < 5
        ? `ultra detailed photo of ${prompt}, 4k realistic`
        : prompt;

    const HF_URL =
      "https://hf.space/embed/black-forest-labs/FLUX.1-schnell/api/predict";

    const response = await fetch(HF_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        data: [fixedPrompt],
      }),
    });

    if (!response.ok) {
      const t = await response.text();
      throw new Error("HF Error: " + t);
    }

    const json = await response.json();

    // путь к изображению
    const base64 = json.data[0].split(",")[1];

    return base64;
  } catch (err) {
    console.error("HF ERROR:", err);
    throw new Error("Ошибка генерации изображения");
  }
}
