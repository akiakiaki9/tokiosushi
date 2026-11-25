import './globals.css';
import AppShell from './components/Layout/AppShell';
import { CartProvider } from '@/app/context/CartContext';

export const metadata = {
  metadataBase: new URL('https://www.tokiosushibar.uz'),
  title: {
    default: 'Tokio Sushi — Доставка суши в Бухаре | Заказать онлайн',
    template: '%s | Tokio Sushi Bukhara',
  },
  description:
    'Закажите вкусные суши и роллы в Бухаре с доставкой. Tokio Sushi Bar — свежие роллы, сеты и напитки. Ежедневно 10:00–00:00. ☎ +998 77 487 65 66',
  keywords: [
    'суши Бухара', 'доставка суши Бухара', 'роллы Бухара',
    'Tokio Sushi', 'заказать суши', 'суши бар Бухара',
  ],
  openGraph: {
    type: 'website',
    locale: 'ru_RU',
    url: 'https://www.tokiosushibar.uz',
    siteName: 'Tokio Sushi',
    title: 'Tokio Sushi — Доставка суши в Бухаре',
    description: 'Свежие суши и роллы с доставкой. 10:00–00:00.',
    images: [{ url: '/og-image.jpg', width: 1200, height: 630, alt: 'Tokio Sushi' }],
  },
  robots: { index: true, follow: true },
  alternates: { canonical: 'https://www.tokiosushibar.uz' },
};

export default function RootLayout({ children }) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Restaurant',
    name: 'Tokio Sushi Bukhara',
    image: 'https://www.tokiosushibar.uz/logo.png',
    url: 'https://www.tokiosushibar.uz',
    telephone: '+998774876566',
    servesCuisine: ['Japanese', 'Sushi'],
    priceRange: '$$',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'улица Хамзы, 25',
      addressLocality: 'Bukhara',
      addressCountry: 'UZ',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 39.764483647518404,
      longitude: 64.42864298529717,
    },
    openingHoursSpecification: {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
      opens: '10:00',
      closes: '00:00',
    },
    sameAs: ['https://www.instagram.com/tokio_sushi_bukhara/'],
  };

  return (
    <html lang="ru">
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <CartProvider>
          <AppShell>{children}</AppShell>
        </CartProvider>
      </body>
    </html>
  );
}