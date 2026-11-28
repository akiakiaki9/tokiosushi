import { CATEGORIES, MENU } from '@/app/data/menu';

const SITE_MENU_URL = 'https://www.tokyosushibar.uz/menu';
const PHONE = '+998 77 487 65 66';
const MAP_URL = 'https://maps.google.com/?q=39.764483647518404,64.42864298529717';
const MENU_CATEGORIES = CATEGORIES.filter((category) => category.id !== 'all');

const BUTTONS = {
  menu: '🍣 Меню',
  allMenu: '📋 Полное меню',
  order: '🛒 Заказать на сайте',
  delivery: '🚚 Доставка',
  hours: '🕒 Время работы',
  contacts: '📍 Контакты',
  info: 'ℹ️ Помощь',
  home: '🏠 Главное меню',
  categories: '📂 Категории',
};

const formatPrice = (price) =>
  price > 0 ? `${new Intl.NumberFormat('ru-RU').format(price)} сум` : 'Уточняйте цену';

const normalize = (text) => text.trim().toLowerCase().replace(/ё/g, 'е');

const categoryButton = ({ emoji, name }) => `${emoji} ${name}`;

function replyKeyboard(rows, placeholder = 'Выберите действие') {
  return {
    keyboard: rows.map((row) => row.map((text) => ({ text }))),
    resize_keyboard: true,
    one_time_keyboard: false,
    is_persistent: true,
    input_field_placeholder: placeholder,
  };
}

function mainKeyboard() {
  return replyKeyboard([
    [BUTTONS.menu, BUTTONS.order],
    [BUTTONS.delivery, BUTTONS.hours],
    [BUTTONS.contacts, BUTTONS.info],
  ]);
}

function menuKeyboard() {
  const rows = [];
  const buttons = MENU_CATEGORIES.map(categoryButton);
  for (let index = 0; index < buttons.length; index += 2) {
    rows.push(buttons.slice(index, index + 2));
  }
  rows.push([BUTTONS.categories, BUTTONS.allMenu]);
  rows.push([BUTTONS.order, BUTTONS.home]);
  rows.push([BUTTONS.info]);
  return replyKeyboard(rows, 'Выберите категорию');
}

function buildFullMenuMessages() {
  const messages = [];
  let chunk = [
    '🍣 Tokio Sushi — полное меню',
    'Выберите категорию кнопкой снизу или закажите на сайте.',
  ];
  let length = chunk.join('\n').length;

  for (const category of MENU_CATEGORIES) {
    const categoryLines = [
      '',
      `${category.emoji} ${category.name}`,
      ...MENU
        .filter((item) => item.category === category.id)
        .map((item) => `• ${item.name} — ${formatPrice(item.price)}`)
    ];
    const categoryLength = categoryLines.join('\n').length + 1;
    if (chunk.length > 2 && length + categoryLength > 3500) {
      messages.push(chunk.join('\n'));
      chunk = ['🍣 Tokio Sushi — меню (продолжение)'];
      length = chunk[0].length;
    }
    chunk.push(...categoryLines);
    length += categoryLength;
  }

  messages.push(chunk.join('\n'));
  return messages;
}

const FULL_MENU_MESSAGES = buildFullMenuMessages();

function categoryMenuText(category) {
  const items = MENU.filter((item) => item.category === category.id);
  return [
    `${category.emoji} ${category.name}`,
    `${items.length} блюд`,
    '',
    ...items.map((item) => `• ${item.name} — ${formatPrice(item.price)}`),
    '',
    `Для заказа откройте сайт: ${SITE_MENU_URL}`,
  ].join('\n');
}

function orderText() {
  return [
    '🛒 Заказ оформляется на сайте:',
    SITE_MENU_URL,
    '',
    'Выберите блюда, заполните контактные данные — заказ придёт администратору на подтверждение.',
    `Если нужна помощь, позвоните: ${PHONE}`,
  ].join('\n');
}

function deliveryText() {
  return [
    '🚚 Доставка по Бухаре.',
    'Работаем ежедневно с 10:00 до 00:00.',
    `Оформить заказ можно на сайте: ${SITE_MENU_URL}`,
    `Стоимость и доступность доставки уточняются при оформлении или по телефону ${PHONE}.`,
  ].join('\n');
}

function hoursText() {
  return [
    '🕒 Работаем ежедневно, без выходных.',
    'Время работы: 10:00–00:00.',
    `Телефон: ${PHONE}`,
  ].join('\n');
}

function contactsText() {
  return [
    '📍 Tokio Sushi Bukhara',
    'Адрес: Бухара, Узбекистан.',
    `Телефон: ${PHONE}`,
    `Карта: ${MAP_URL}`,
    'Instagram: https://www.instagram.com/tokio_sushi_bukhara/',
    'Telegram: https://t.me/tokio_sushi_bukhara',
  ].join('\n');
}

function helpText() {
  return [
    'ℹ️ Я автоответчик Tokio Sushi.',
    'Кнопками снизу можно открыть меню, узнать о доставке, графике и контактах.',
    `Заказ оформляется на сайте: ${SITE_MENU_URL}`,
    `Для срочных вопросов звоните: ${PHONE}`,
  ].join('\n');
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

async function sendMessage(token, chatId, text, replyMarkup = mainKeyboard()) {
  return callTelegram(token, 'sendMessage', {
    chat_id: chatId,
    text,
    ...(replyMarkup ? { reply_markup: replyMarkup } : {}),
    disable_web_page_preview: true,
  });
}

async function sendFullMenu(token, chatId) {
  for (let index = 0; index < FULL_MENU_MESSAGES.length; index += 1) {
    const suffix = index === FULL_MENU_MESSAGES.length - 1
      ? `\n\nЗаказать: ${SITE_MENU_URL}`
      : '';
    await sendMessage(token, chatId, `${FULL_MENU_MESSAGES[index]}${suffix}`, menuKeyboard());
    if (index < FULL_MENU_MESSAGES.length - 1) {
      await new Promise((resolve) => setTimeout(resolve, 1100));
    }
  }
}

async function answerCallback(token, callback, text, showAlert = false) {
  return callTelegram(token, 'answerCallbackQuery', {
    callback_query_id: callback.id,
    ...(text ? { text, show_alert: showAlert } : {}),
  });
}

async function handleAdminDecision(token, adminChatId, callback, decision) {
  if (String(callback.message?.chat?.id) !== String(adminChatId)) {
    await answerCallback(token, callback, 'Нет доступа к этому заказу.', true);
    return;
  }

  const status = decision === 'accept' ? '✅ Заказ принят' : '❌ Заказ отклонён';
  await answerCallback(token, callback, status);
  const routeButtons = callback.message.reply_markup?.inline_keyboard
    ?.filter((row) => row.some((button) => button.url)) ?? [];
  await callTelegram(token, 'editMessageReplyMarkup', {
    chat_id: callback.message.chat.id,
    message_id: callback.message.message_id,
    reply_markup: { inline_keyboard: routeButtons },
  });
  await sendMessage(token, adminChatId, status, null);
}

function findCategory(text) {
  const normalizedText = normalize(text);
  const exactMatch = MENU_CATEGORIES.find(
    (category) => normalizedText === normalize(categoryButton(category))
  );
  if (exactMatch) return exactMatch;

  return [...MENU_CATEGORIES]
    .sort((left, right) => right.name.length - left.name.length)
    .find((category) => normalizedText.includes(normalize(category.name)));
}

async function handleMessage(token, message) {
  if (!message?.chat || message.chat.type !== 'private') return;

  const chatId = message.chat.id;
  const text = typeof message.text === 'string' ? message.text.trim() : '';
  const command = text.split(/\s+/)[0].split('@')[0].toLowerCase();

  if (command === '/start') {
    await sendMessage(
      token,
      chatId,
      [
        '🍣 Добро пожаловать в Tokio Sushi!',
        'Здесь можно посмотреть меню и узнать информацию о доставке.',
        `Заказ оформляется на сайте: ${SITE_MENU_URL}`,
      ].join('\n\n')
    );
    return;
  }

  if (command === '/menu' || text === BUTTONS.menu || text === BUTTONS.allMenu) {
    await sendFullMenu(token, chatId);
    return;
  }

  if (text === BUTTONS.home) {
    await sendMessage(token, chatId, 'Выберите действие кнопками снизу.');
    return;
  }

  if (text === BUTTONS.order) {
    await sendMessage(token, chatId, orderText());
    return;
  }

  if (text === BUTTONS.delivery) {
    await sendMessage(token, chatId, deliveryText());
    return;
  }

  if (text === BUTTONS.hours) {
    await sendMessage(token, chatId, hoursText());
    return;
  }

  if (text === BUTTONS.contacts) {
    await sendMessage(token, chatId, contactsText());
    return;
  }

  if (text === BUTTONS.info || command === '/help') {
    await sendMessage(token, chatId, helpText());
    return;
  }

  if (text === BUTTONS.categories) {
    await sendMessage(
      token,
      chatId,
      'Выберите категорию на клавиатуре снизу. Чтобы увидеть всё меню, нажмите «Полное меню».',
      menuKeyboard()
    );
    return;
  }

  const category = findCategory(text);
  if (category) {
    await sendMessage(token, chatId, categoryMenuText(category), menuKeyboard());
    return;
  }

  const normalizedText = normalize(text);
  if (/(заказ|заказать|оформ|купить)/.test(normalizedText)) {
    await sendMessage(token, chatId, orderText());
    return;
  }
  if (/(достав|курьер)/.test(normalizedText)) {
    await sendMessage(token, chatId, deliveryText());
    return;
  }
  if (/(график|время|открыт|работа|выходн)/.test(normalizedText)) {
    await sendMessage(token, chatId, hoursText());
    return;
  }
  if (/(контакт|адрес|телефон|позвон|карта)/.test(normalizedText)) {
    await sendMessage(token, chatId, contactsText());
    return;
  }
  if (/(меню|каталог|список)/.test(normalizedText)) {
    await sendFullMenu(token, chatId);
    return;
  }

  await sendMessage(token, chatId, helpText());
}

async function handleCallback(token, adminChatId, callback) {
  if (callback.data === 'accept' || callback.data === 'reject') {
    await handleAdminDecision(token, adminChatId, callback, callback.data);
    return;
  }

  await answerCallback(token, callback, 'Эта кнопка устарела. Нажмите /start.');
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
      await handleMessage(token, update.message);
    }
    return Response.json({ ok: true });
  } catch (error) {
    console.error('Telegram webhook error:', error);
    return Response.json({ error: 'Telegram update failed' }, { status: 500 });
  }
}
