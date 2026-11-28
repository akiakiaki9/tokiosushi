This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.js`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Telegram-бот

Для работы webhook нужны переменные Vercel Environment Variables:

- `TELEGRAM_BOT_TOKEN` — токен бота от BotFather.
- `TELEGRAM_ADMIN_CHAT_ID` — ID чата, куда отправлять заказы.
- `TELEGRAM_WEBHOOK_SECRET` — случайная строка из латинских букв, цифр, `_` или `-`.

Бот показывает меню и отвечает на вопросы о доставке, графике и контактах. Заказ в Telegram не оформляется: кнопка «Заказать на сайте» ведёт на `https://www.tokyosushibar.uz/menu`. Постоянная клавиатура появляется снизу после `/start`; хранение корзины и база данных для бота не нужны.

После деплоя зарегистрируйте webhook из PowerShell. Переменные `$env:TELEGRAM_BOT_TOKEN` и `$env:TELEGRAM_WEBHOOK_SECRET` должны содержать те же значения, что и в Vercel:

```powershell
Invoke-RestMethod `
  -Method Post `
  -Uri "https://api.telegram.org/bot$env:TELEGRAM_BOT_TOKEN/setWebhook" `
  -Body @{
    url = "https://www.tokiosushibar.uz/api/telegram/webhook"
    secret_token = $env:TELEGRAM_WEBHOOK_SECRET
    allowed_updates = '["message","callback_query"]'
  }
```

Заказы приходят в админ-чат, где кнопки «Принять» и «Отклонить» меняют статус.
