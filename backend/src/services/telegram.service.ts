import FormData from "form-data";

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
  const form = new FormData();

  form.append("chat_id", chatId.toString());
  form.append("photo", buffer, { filename: "image.png" });

  await fetch(url, {
    method: "POST",
    body: form as any,
  });
}
