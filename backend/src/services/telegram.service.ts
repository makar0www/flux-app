export async function sendText(chatId: number, text: string) {
  const url = `https://api.telegram.org/bot${process.env.TG_BOT_TOKEN}/sendMessage`;

  await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chat_id: chatId, text }),
  });
}

export async function sendPhoto(chatId: number, base64: string) {
  const url = `https://api.telegram.org/bot${process.env.TG_BOT_TOKEN}/sendPhoto`;

  const buffer = Buffer.from(base64, "base64");

  // берем глобальные FormData и Blob, без импортов
  const form = new FormData();
  const blob = new Blob([buffer], { type: "image/png" });

  form.append("chat_id", String(chatId));
  form.append("photo", blob, "image.png");

  await fetch(url, {
    method: "POST",
    // TS может ругаться — спокойно давим any, на рантайме всё ок
    body: form as any,
  });
}
