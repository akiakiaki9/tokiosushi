export async function POST(req) {
  try {
    const { customer, location, orderDetails, total } = await req.json();
    const TOKEN = process.env.TELEGRAM_BOT_TOKEN;
    const CHAT_ID = process.env.TELEGRAM_ADMIN_CHAT_ID;

    if (!TOKEN || !CHAT_ID) {
      return Response.json({ error: 'Telegram not configured' }, { status: 500 });
    }

    // Ссылки на карты с маршрутом до клиента
    const yandexRoute = location
      ? `https://yandex.com/maps/?rtext=~${location.lat},${location.lng}&rtt=auto`
      : null;

    const googleRoute = location
      ? `https://www.google.com/maps/dir/?api=1&destination=${location.lat},${location.lng}&travelmode=driving`
      : null;

    const lines = [
      '🍣 *Новый заказ Tokio Sushi*',
      '',
      `👤 Имя: ${customer.name}`,
      `📞 Телефон: ${customer.phone}`,
      customer.address ? `📍 Адрес: ${customer.address}` : '',
      customer.comment ? `💬 Комментарий: ${customer.comment}` : '',
      '',
      '*Состав заказа:*',
      orderDetails,
      '',
      `💰 *Итого: ${total.toLocaleString()} сум*`,
    ];

    if (location) {
      lines.push(
        '',
        '🗺 *Локация клиента:*',
        `\`${location.lat.toFixed(6)}, ${location.lng.toFixed(6)}\``,
        '',
        `📍 [Открыть в Яндекс.Картах](${yandexRoute})`,
        `🌍 [Открыть в Google Maps](${googleRoute})`
      );
    }

    const text = lines.filter(Boolean).join('\n');

    const res = await fetch(`https://api.telegram.org/bot${TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: CHAT_ID,
        text,
        parse_mode: 'Markdown',
        disable_web_page_preview: true,
        reply_markup: {
          inline_keyboard: location
            ? [
                [
                  { text: '🟡 Яндекс.Маршрут', url: yandexRoute },
                  { text: '🔵 Google.Маршрут', url: googleRoute },
                ],
                [
                  { text: '✅ Принять', callback_data: 'accept' },
                  { text: '❌ Отклонить', callback_data: 'reject' },
                ],
              ]
            : [
                [
                  { text: '✅ Принять', callback_data: 'accept' },
                  { text: '❌ Отклонить', callback_data: 'reject' },
                ],
              ],
        },
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      console.error('Telegram error:', err);
      return Response.json({ error: 'Telegram send failed' }, { status: 500 });
    }

    return Response.json({ success: true });
  } catch (e) {
    console.error(e);
    return Response.json({ error: 'Server error' }, { status: 500 });
  }
}