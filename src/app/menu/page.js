import MenuClient from './MenuClient';
import './menu-page.css';

export const metadata = {
    title: 'Меню — Tokio Sushi Bukhara',
    description: 'Роллы, суши, сеты и напитки. Полное меню Tokio Sushi Bukhara с ценами. Заказывайте онлайн с доставкой.',
};

export default async function MenuPage({ searchParams }) {
    const params = await searchParams;
    const initialCategory = Array.isArray(params?.cat) ? params.cat[0] : params?.cat;

    return (
        <MenuClient
            key={initialCategory ?? 'all'}
            initialCategory={initialCategory}
        />
    );
}