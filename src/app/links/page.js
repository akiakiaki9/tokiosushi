import Image from 'next/image';
import {
    FaInstagram,
    FaTelegramPlane,
    FaPhone,
    FaMapMarkerAlt,
    FaUtensils,
} from 'react-icons/fa';
import './links.css';

export const metadata = {
    title: 'Tokio Sushi — Все ссылки',
    description:
        'Все ссылки Tokio Sushi Bukhara: меню, Instagram, Telegram, телефон, локация на карте. Одна страница — всё под рукой.',
};

const LINKS = [
    {
        icon: <FaUtensils />,
        label: 'Меню и заказ',
        sub: 'Смотреть блюда',
        href: '/menu',
        accent: true,
    },
    {
        icon: <FaInstagram />,
        label: 'Instagram',
        sub: '@tokio_sushi_bukhara',
        href: 'https://www.instagram.com/tokio_sushi_bukhara/',
        external: true,
    },
    {
        icon: <FaTelegramPlane />,
        label: 'Telegram',
        sub: 'Написать нам',
        href: 'https://t.me/tokio_sushi_bukhara',
        external: true,
    },
    {
        icon: <FaPhone />,
        label: 'Позвонить',
        sub: '+998 77 487 65 66',
        href: 'tel:+998774876566',
    },
    {
        icon: <FaMapMarkerAlt />,
        label: 'Как добраться',
        sub: 'улица Хамзы, 25, Бухара',
        href: 'https://maps.google.com/?q=39.764483647518404,64.42864298529717',
        external: true,
    },
];

export default function LinksPage() {
    return (
        <main className="links">
            {/* Декоративный фон */}
            <div className="links__bg">
                <div className="links__circle links__circle--red" />
                <div className="links__circle links__circle--gold" />
                <span className="links__kanji">寿司</span>
            </div>

            {/* Обёртка контента */}
            <div className="links__wrap">
                {/* Профиль */}
                <header className="links__profile">
                    <div className="links__avatar">
                        <Image
                            src="/images/logo.png"
                            alt="Tokio Sushi"
                            width={220}
                            height={118}
                            priority
                        />
                    </div>
                    <h1 className="links__name">
                        Tokio <span>Sushi</span>
                    </h1>
                    <p className="links__status">
                        <span className="links__status-dot" />
                        Открыто · до 00:00
                    </p>
                </header>

                {/* Список ссылок */}
                <nav className="links__list">
                    {LINKS.map((link, i) => (
                        <a
                            key={link.label}
                            href={link.href}
                            target={link.external ? '_blank' : undefined}
                            rel={link.external ? 'noopener noreferrer' : undefined}
                            className={`links__item ${link.accent ? 'links__item--accent' : ''}`}
                            style={{ animationDelay: `${i * 60 + 200}ms` }}
                        >
                            <span className="links__item-icon">{link.icon}</span>
                            <span className="links__item-info">
                                <strong>{link.label}</strong>
                                <small>{link.sub}</small>
                            </span>
                            <span className="links__item-arrow">→</span>
                        </a>
                    ))}
                </nav>

                {/* Футер */}
                <footer className="links__footer">
                    <p>© 2026 Tokio Sushi Bukhara</p>
                    <a
                        href="https://www.akbarsoft.uz"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="links__dev"
                    >
                        Разработано в Akbar<span>Soft</span>
                    </a>
                </footer>
            </div>
        </main>
    );
}