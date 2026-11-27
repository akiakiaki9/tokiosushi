import { Suspense } from 'react';
import MenuClient from './MenuClient';
import './menu-page.css';

export const metadata = {
    title: 'Меню — Tokio Sushi Bukhara',
    description: 'Роллы, суши, сеты и напитки. Полное меню Tokio Sushi Bukhara с ценами. Заказывайте онлайн с доставкой.',
};

async function MenuContent({ searchParams }) {
    const params = await searchParams;
    const initialCategory = Array.isArray(params?.cat) ? params.cat[0] : params?.cat;

    return (
        <MenuClient
            key={initialCategory ?? 'all'}
            initialCategory={initialCategory}
        />
    );
}

export default function MenuPage({ searchParams }) {
    return (
        <Suspense
            fallback={
                <div className="menu-page" aria-busy="true">
                    <div className="container">
                        <p>Загружаем меню...</p>
                    </div>
                </div>
            }
        >
            <MenuContent searchParams={searchParams} />
        </Suspense>
    );
}