export async function sendText(chatId: number, text: string) {
  const url = `https://api.telegram.org/bot${process.env.TG_BOT_TOKEN}/sendMessage`;

  await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: chatId,
      text,
    }),
  });
}

export async function sendPhoto(chatId: number, base64: string) {
  const url = `https://api.telegram.org/bot${process.env.TG_BOT_TOKEN}/sendPhoto`;

  await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: chatId,
      photo: `data:image/jpeg;base64,${base64}`,
    }),
  });
}
