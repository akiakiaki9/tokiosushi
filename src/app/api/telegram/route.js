const escapeHtml = (value) =>
  String(value).replace(/[&<>"']/g, (character) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
  })[character]);

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

    if (
      !customer ||
      typeof customer.name !== 'string' ||
      typeof customer.phone !== 'string' ||
      !Number.isFinite(total) ||
      typeof orderDetails !== 'string'
    ) {
      return Response.json({ error: 'Invalid order' }, { status: 400 });
    }

    const lines = [
      '<b>🍣 Новый заказ Tokio Sushi</b>',
      '',
      `👤 <b>Имя:</b> ${escapeHtml(customer.name)}`,
      `📞 <b>Телефон:</b> ${escapeHtml(customer.phone)}`,
      customer.address ? `📍 <b>Адрес:</b> ${escapeHtml(customer.address)}` : '',
      customer.comment ? `💬 <b>Комментарий:</b> ${escapeHtml(customer.comment)}` : '',
      '',
      '<b>Состав заказа:</b>',
      escapeHtml(orderDetails),
      '',
      `💰 <b>Итого: ${total.toLocaleString()} сум</b>`,
    ];

    if (location) {
      lines.push(
        '',
        '<b>🗺 Локация клиента:</b>',
        `<code>${location.lat.toFixed(6)}, ${location.lng.toFixed(6)}</code>`
      );
    }

    const text = lines.filter(Boolean).join('\n');

    const res = await fetch(`https://api.telegram.org/bot${TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: CHAT_ID,
        text,
        parse_mode: 'HTML',
        disable_web_page_preview: true,
        reply_markup: {
          inline_keyboard: [
            ...(location
              ? [[
                  { text: '🟡 Яндекс.Маршрут', url: yandexRoute },
                  { text: '🔵 Google.Маршрут', url: googleRoute },
                ]]
              : []),
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