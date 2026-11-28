import { CATEGORIES, MENU } from '@/app/data/menu';

const PAGE_SIZE = 6;
const MAX_CART_ITEMS = 20;
const knownItemIds = new Set(MENU.map((item) => item.id));

const formatPrice = (price) =>
  price > 0 ? `${price.toLocaleString()} сум` : 'Уточняйте цену';

const formatDishCount = (count) => {
  const lastTwoDigits = count % 100;
  if (lastTwoDigits >= 11 && lastTwoDigits <= 14) return `${count} блюд`;
  const lastDigit = count % 10;
  if (lastDigit === 1) return `${count} блюдо`;
  if (lastDigit >= 2 && lastDigit <= 4) return `${count} блюда`;
  return `${count} блюд`;
};

const escapeHtml = (value) =>
  String(value).replace(/[&<>"']/g, (character) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
  })[character]);

function encodeCart(cart) {
  const entries = Object.entries(cart);
  if (entries.length > MAX_CART_ITEMS) {
    throw new Error('Cart exceeds the inline keyboard limit');
  }

  const bytes = Buffer.alloc(entries.length * 2);
  entries.forEach(([id, quantity], index) => {
    const numericId = Number(id);
    if (!knownItemIds.has(numericId) || quantity < 1 || quantity > 255) {
      throw new Error('Cart contains an invalid item or quantity');
    }
    bytes[index * 2] = numericId;
    bytes[index * 2 + 1] = quantity;
  });
  return bytes.toString('base64url');
}

function decodeCart(payload) {
  if (!/^[\w-]*$/.test(payload)) return null;

  const bytes = Buffer.from(payload, 'base64url');
  if (bytes.length % 2 !== 0 || bytes.length > MAX_CART_ITEMS * 2) return null;

  const cart = {};
  for (let index = 0; index < bytes.length; index += 2) {
    const id = bytes[index];
    const quantity = bytes[index + 1];
    if (!knownItemIds.has(id) || quantity === 0 || cart[id]) return null;
    cart[id] = quantity;
  }
  return cart;
}

function makeCallbackData(action, cart) {
  const callbackData = `${action}.${encodeCart(cart)}`;
  if (Buffer.byteLength(callbackData, 'utf8') > 64) {
    throw new Error('Telegram callback data exceeds 64 bytes');
  }
  return callbackData;
}

function cartEntries(cart) {
  return Object.entries(cart)
    .map(([id, quantity]) => ({
      item: MENU.find((menuItem) => menuItem.id === Number(id)),
      quantity,
    }))
    .filter(({ item }) => item);
}

function cartTotals(cart) {
  const entries = cartEntries(cart);
  return {
    entries,
    itemCount: entries.reduce((sum, entry) => sum + entry.quantity, 0),
    total: entries.reduce((sum, entry) => sum + entry.item.price * entry.quantity, 0),
  };
}

function homeKeyboard(cart) {
  const categories = CATEGORIES.map((category, index) => ({
    text: `${category.name} (${formatDishCount(
      category.id === 'all'
        ? MENU.length
        : MENU.filter((item) => item.category === category.id).length
    )})`,
    callback_data: makeCallbackData(`c${index.toString(36)}0`, cart),
  }));
  const rows = [];
  for (let index = 0; index < categories.length; index += 2) {
    rows.push(categories.slice(index, index + 2));
  }
  const { itemCount } = cartTotals(cart);
  rows.push([{
    text: `🛒 Корзина (${itemCount})`,
    callback_data: makeCallbackData('v', cart),
  }]);
  return { inline_keyboard: rows };
}

function homeText(cart) {
  const { itemCount, total } = cartTotals(cart);
  return [
    'Tokio Sushi',
    `Выберите категорию — в меню ${MENU.length} блюд.`,
    itemCount
      ? `В корзине: ${itemCount} шт. · ${formatPrice(total)}`
      : 'Выберите категорию, чтобы посмотреть блюда.',
  ].join('\n\n');
}

function categoryItems(categoryIndex) {
  const category = CATEGORIES[categoryIndex];
  if (!category) return null;
  return {
    category,
    items: category.id === 'all'
      ? MENU
      : MENU.filter((item) => item.category === category.id),
  };
}

function categoryView(categoryIndex, page, cart) {
  const result = categoryItems(categoryIndex);
  if (!result) return null;

  const { category, items } = result;
  const pageCount = Math.max(1, Math.ceil(items.length / PAGE_SIZE));
  const currentPage = Math.min(Math.max(0, page), pageCount - 1);
  const pageItems = items.slice(currentPage * PAGE_SIZE, (currentPage + 1) * PAGE_SIZE);
  const { itemCount, total } = cartTotals(cart);
  const textLines = [
    category.name,
    `${formatDishCount(items.length)} · страница ${currentPage + 1} из ${pageCount}`,
    '',
    ...pageItems.map((item, index) => {
      const description = item.description ? `\n   ${item.description}` : '';
      return `${currentPage * PAGE_SIZE + index + 1}. ${item.name} — ${formatPrice(item.price)}${description}`;
    }),
    '',
    itemCount
      ? `В корзине: ${itemCount} шт. · ${formatPrice(total)}`
      : 'Нажмите на название блюда, чтобы добавить его в корзину.',
  ];

  const keyboard = pageItems.map((item) => [{
    text: item.name,
    callback_data: makeCallbackData(
      `a${item.id.toString(36)}${categoryIndex.toString(36)}${currentPage.toString(36)}`,
      cart
    ),
  }]);

  if (pageCount > 1) {
    keyboard.push([
      ...(currentPage > 0
        ? [{
            text: '← Назад',
            callback_data: makeCallbackData(
              `p-${categoryIndex.toString(36)}${currentPage.toString(36)}`,
              cart
            ),
          }]
        : []),
      ...(currentPage < pageCount - 1
        ? [{
            text: 'Дальше →',
            callback_data: makeCallbackData(
              `p+${categoryIndex.toString(36)}${currentPage.toString(36)}`,
              cart
            ),
          }]
        : []),
    ]);
  }

  keyboard.push([
    { text: 'Категории', callback_data: makeCallbackData('h', cart) },
    {
      text: `🛒 Корзина (${itemCount})`,
      callback_data: makeCallbackData('v', cart),
    },
  ]);
  return { text: textLines.join('\n'), reply_markup: { inline_keyboard: keyboard } };
}

function cartView(cart) {
  const { entries, itemCount, total } = cartTotals(cart);
  if (!entries.length) {
    return {
      text: 'Корзина пока пуста. Выберите категорию и добавьте блюда.',
      reply_markup: {
        inline_keyboard: [[{
          text: 'К категориям',
          callback_data: makeCallbackData('h', cart),
        }]],
      },
    };
  }

  const keyboard = entries.map(({ item, quantity }) => [
    {
      text: '−',
      callback_data: makeCallbackData(`i-${item.id.toString(36)}`, cart),
    },
    { text: `${quantity} × ${item.name}`, callback_data: makeCallbackData('v', cart) },
    {
      text: '+',
      callback_data: makeCallbackData(`i+${item.id.toString(36)}`, cart),
    },
  ]);
  keyboard.push(
    ...entries.map(({ item }) => [{
      text: `Убрать: ${item.name}`,
      callback_data: makeCallbackData(`r${item.id.toString(36)}`, cart),
    }])
  );
  keyboard.push([
    { text: 'Категории', callback_data: makeCallbackData('h', cart) },
    { text: 'Оформить заказ', callback_data: makeCallbackData('o', cart) },
  ]);

  const lines = [
    'Ваша корзина:',
    '',
    ...entries.map(({ item, quantity }) =>
      `• ${item.name} × ${quantity} — ${formatPrice(item.price * quantity)}`
    ),
    '',
    `Итого: ${formatPrice(total)}`,
    `Позиций: ${itemCount}`,
  ];
  return { text: lines.join('\n'), reply_markup: { inline_keyboard: keyboard } };
}

async function callTelegram(token, method, payload) {
  const response = await fetch(`https://api.telegram.org/bot${token}/${method}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  const result = await response.json();
  if (!response.ok || !result.ok) {
    throw new Error(`Telegram ${method} failed: ${result.description || response.status}`);
  }
  return result.result;
}

async function sendMessage(token, chatId, text, replyMarkup, replyToMessageId) {
  return callTelegram(token, 'sendMessage', {
    chat_id: chatId,
    text,
    ...(replyMarkup ? { reply_markup: replyMarkup } : {}),
    ...(replyToMessageId ? { reply_to_message_id: replyToMessageId } : {}),
  });
}

async function editMessage(token, callback, view) {
  const message = callback.message;
  if (
    message.text === view.text &&
    JSON.stringify(message.reply_markup?.inline_keyboard) ===
      JSON.stringify(view.reply_markup.inline_keyboard)
  ) {
    return;
  }
  await callTelegram(token, 'editMessageText', {
    chat_id: message.chat.id,
    message_id: message.message_id,
    text: view.text,
    reply_markup: view.reply_markup,
  });
}

async function answerCallback(token, callback, text, showAlert = false) {
  await callTelegram(token, 'answerCallbackQuery', {
    callback_query_id: callback.id,
    ...(text ? { text, show_alert: showAlert } : {}),
  });
}

async function handleAdminDecision(token, adminChatId, callback, decision) {
  if (String(callback.message?.chat?.id) !== String(adminChatId)) {
    await answerCallback(token, callback, 'Нет доступа к этому заказу.', true);
    return;
  }

  const accepted = decision === 'accept';
  const status = accepted ? '✅ Заказ принят' : '❌ Заказ отклонён';
  await answerCallback(token, callback, status);

  const routeButtons = callback.message.reply_markup?.inline_keyboard
    ?.filter((row) => row.some((button) => button.url)) ?? [];
  await callTelegram(token, 'editMessageReplyMarkup', {
    chat_id: callback.message.chat.id,
    message_id: callback.message.message_id,
    reply_markup: { inline_keyboard: routeButtons },
  });
  await sendMessage(
    token,
    adminChatId,
    status,
    undefined,
    callback.message.message_id
  );
}

function checkoutPrompt(cart) {
  const payload = encodeCart(cart);
  const { itemCount, total } = cartTotals(cart);
  return {
    text: [
      '📝 Оформление заказа',
      '',
      `В корзине ${itemCount} шт. на ${formatPrice(total)}.`,
      'Ответьте на это сообщение тремя строками:',
      'Имя',
      'Телефон',
      'Адрес доставки',
    ].join('\n'),
    reply_markup: {
      inline_keyboard: [[
        { text: '📝 Ввести данные', callback_data: `t.${payload}` },
        { text: 'Отменить', callback_data: `x.${payload}` },
      ]],
    },
  };
}

function getCheckoutCart(message) {
  const reply = message.reply_to_message;
  if (!reply?.text?.startsWith('📝 Оформление заказа')) return null;
  const callbacks = reply.reply_markup?.inline_keyboard?.flat() ?? [];
  const checkoutButton = callbacks.find((button) =>
    button.callback_data?.startsWith('t.')
  );
  if (!checkoutButton) return null;
  return decodeCart(checkoutButton.callback_data.slice(2));
}

function parseCustomerDetails(text) {
  const fields = text.split(/[;\n]+/).map((field) => field.trim()).filter(Boolean);
  const name = fields[0]?.replace(/^имя\s*:\s*/i, '').trim();
  const phone = fields[1]?.replace(/^телефон\s*:\s*/i, '').trim();
  const address = fields[2]?.replace(/^адрес(?:\s+доставки)?\s*:\s*/i, '').trim();
  if (!name || !phone || phone.replace(/\D/g, '').length < 7) return null;
  return { name, phone, address };
}

async function forwardBotOrder(token, adminChatId, message, cart, customer) {
  const { entries, total } = cartTotals(cart);
  const orderLines = entries.map(({ item, quantity }) =>
    `• ${escapeHtml(item.name)} × ${quantity} — ${formatPrice(item.price * quantity)}`
  );
  const userName = message.from.username ? `@${message.from.username}` : 'не указан';
  const lines = [
    '<b>🍣 Новый заказ из Telegram</b>',
    '',
    `👤 <b>Имя:</b> ${escapeHtml(customer.name)}`,
    `📞 <b>Телефон:</b> ${escapeHtml(customer.phone)}`,
    customer.address ? `📍 <b>Адрес:</b> ${escapeHtml(customer.address)}` : '',
    `Telegram: ${escapeHtml(userName)}`,
    '',
    '<b>Состав заказа:</b>',
    ...orderLines,
    '',
    `💰 <b>Итого: ${formatPrice(total)}</b>`,
  ].filter(Boolean);

  await callTelegram(token, 'sendMessage', {
    chat_id: adminChatId,
    text: lines.join('\n'),
    parse_mode: 'HTML',
    reply_markup: {
      inline_keyboard: [[
        { text: '✅ Принять', callback_data: 'accept' },
        { text: '❌ Отклонить', callback_data: 'reject' },
      ]],
    },
  });
}

async function handleMessage(token, adminChatId, message) {
  if (!message?.chat || message.chat.type !== 'private' || !message.text) return;

  const command = message.text.trim().split(/\s+/)[0].split('@')[0].toLowerCase();
  if (command === '/start' || command === '/menu') {
    await sendMessage(token, message.chat.id, homeText({}), homeKeyboard({}));
    return;
  }

  const cart = getCheckoutCart(message);
  if (cart) {
    const customer = parseCustomerDetails(message.text);
    if (!customer) {
      const prompt = checkoutPrompt(cart);
      await sendMessage(
        token,
        message.chat.id,
        'Укажите имя и телефон (не менее 7 цифр). Ответьте на сообщение ниже.',
        undefined,
        message.message_id
      );
      await sendMessage(token, message.chat.id, prompt.text, prompt.reply_markup);
      return;
    }

    await forwardBotOrder(token, adminChatId, message, cart, customer);
    await sendMessage(
      token,
      message.chat.id,
      '✅ Заказ отправлен! Мы свяжемся с вами для подтверждения.',
      homeKeyboard({})
    );
    return;
  }

  await sendMessage(
    token,
    message.chat.id,
    'Чтобы открыть меню, нажмите /start.',
    homeKeyboard({})
  );
}

async function handleCallback(token, adminChatId, callback) {
  const data = callback.data || '';
  if (data === 'accept' || data === 'reject') {
    await handleAdminDecision(token, adminChatId, callback, data);
    return;
  }

  const separator = data.indexOf('.');
  if (separator < 0 || !callback.message) {
    await answerCallback(token, callback, 'Эта кнопка устарела. Нажмите /start.');
    return;
  }

  const action = data.slice(0, separator);
  const cart = decodeCart(data.slice(separator + 1));
  if (!cart) {
    await answerCallback(token, callback, 'Корзина устарела. Начните заново.', true);
    return;
  }

  const chatId = callback.message.chat.id;
  const showView = async (view, answerText) => {
    await answerCallback(token, callback, answerText);
    await editMessage(token, callback, view);
  };

  if (action === 'h') {
    await showView({ text: homeText(cart), reply_markup: homeKeyboard(cart) });
    return;
  }

  if (action === 'v') {
    await showView(cartView(cart));
    return;
  }

  if (action.startsWith('c')) {
    const categoryIndex = parseInt(action[1], 36);
    const page = parseInt(action[2], 36);
    const view = categoryView(categoryIndex, page, cart);
    if (!view) {
      await answerCallback(token, callback, 'Категория не найдена.', true);
      return;
    }
    await showView(view);
    return;
  }

  if (action.startsWith('p')) {
    const direction = action[1] === '+' ? 1 : -1;
    const categoryIndex = parseInt(action[2], 36);
    const page = parseInt(action[3], 36) + direction;
    const view = categoryView(categoryIndex, page, cart);
    if (!view) {
      await answerCallback(token, callback, 'Страница меню не найдена.', true);
      return;
    }
    await showView(view);
    return;
  }

  if (action.startsWith('a')) {
    const itemId = parseInt(action.slice(1, -2), 36);
    const categoryIndex = parseInt(action.at(-2), 36);
    const page = parseInt(action.at(-1), 36);
    const item = MENU.find((menuItem) => menuItem.id === itemId);
    if (!item) {
      await answerCallback(token, callback, 'Блюдо не найдено.', true);
      return;
    }
    if (!cart[itemId] && Object.keys(cart).length >= MAX_CART_ITEMS) {
      await answerCallback(
        token,
        callback,
        `В корзине может быть не более ${MAX_CART_ITEMS} разных блюд.`,
        true
      );
      return;
    }
    if (cart[itemId] >= 255) {
      await answerCallback(token, callback, 'Достигнуто максимальное количество.', true);
      return;
    }
    const updatedCart = { ...cart, [itemId]: (cart[itemId] || 0) + 1 };
    const view = categoryView(categoryIndex, page, updatedCart);
    if (!view) {
      await answerCallback(token, callback, 'Категория не найдена.', true);
      return;
    }
    await showView(view, `${item.name} добавлено в корзину`);
    return;
  }

  if (action.startsWith('i+') || action.startsWith('i-') || action.startsWith('r')) {
    const isRemove = action.startsWith('r');
    const itemId = parseInt(action.slice(isRemove ? 1 : 2), 36);
    if (!cart[itemId]) {
      await answerCallback(token, callback, 'Блюдо уже удалено.', true);
      return;
    }
    const updatedCart = { ...cart };
    if (isRemove || (action.startsWith('i-') && updatedCart[itemId] === 1)) {
      delete updatedCart[itemId];
    } else {
      const change = action.startsWith('i+') ? 1 : -1;
      if (updatedCart[itemId] + change > 255) {
        await answerCallback(token, callback, 'Достигнуто максимальное количество.', true);
        return;
      }
      updatedCart[itemId] += change;
    }
    await showView(cartView(updatedCart));
    return;
  }

  if (action === 'o') {
    if (Object.keys(cart).length === 0) {
      await answerCallback(token, callback, 'Сначала добавьте блюдо в корзину.', true);
      return;
    }
    const prompt = checkoutPrompt(cart);
    await answerCallback(token, callback);
    await sendMessage(token, chatId, prompt.text, prompt.reply_markup);
    return;
  }

  if (action === 't') {
    await answerCallback(token, callback, 'Ответьте на сообщение с оформлением заказа.');
    return;
  }

  if (action === 'x') {
    await showView(cartView(cart), 'Оформление отменено');
    return;
  }

  await answerCallback(token, callback, 'Кнопка устарела. Нажмите /start.');
}

export async function POST(request) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const adminChatId = process.env.TELEGRAM_ADMIN_CHAT_ID;
  const webhookSecret = process.env.TELEGRAM_WEBHOOK_SECRET;

  if (!token || !adminChatId || !webhookSecret) {
    console.error('Telegram webhook configuration is incomplete');
    return Response.json({ error: 'Telegram webhook is not configured' }, { status: 500 });
  }

  if (request.headers.get('x-telegram-bot-api-secret-token') !== webhookSecret) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const update = await request.json();
    if (update.callback_query) {
      await handleCallback(token, adminChatId, update.callback_query);
    } else if (update.message) {
      await handleMessage(token, adminChatId, update.message);
    }
    return Response.json({ ok: true });
  } catch (error) {
    console.error('Telegram webhook error:', error);
    return Response.json({ error: 'Telegram update failed' }, { status: 500 });
  }
}
