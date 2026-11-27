import Link from 'next/link';
import {
    FaPhone,
    FaClock,
    FaMapMarkerAlt,
    FaInstagram,
    FaTelegramPlane,
    FaArrowRight,
    FaUtensils,
} from 'react-icons/fa';
import CopyButton from '../components/Contacts/CopyButton';
import ScheduleCard from '../components/Contacts/ScheduleCard';
import './contacts.css';

export const metadata = {
    title: 'Контакты — Tokio Sushi Bukhara',
    description:
        'Свяжитесь с Tokio Sushi Bukhara: телефон +998 77 487 65 66, адрес в Бухаре, часы работы 10:00–00:00. Карта и маршрут до суши-бара.',
    alternates: { canonical: 'https://www.tokiosushibar.uz/contacts' },
};

const PHONE = '+998 77 487 65 66';
const PHONE_RAW = '+998774876566';
const MAPS_URL = 'https://maps.google.com/?q=39.764483647518404,64.42864298529717';

export default function ContactsPage() {
    return (
        <div className="contacts">
            {/* HERO */}
            <header className="contacts__hero">
                <div className="contacts__hero-bg">
                    <span className="contacts__hero-kanji">連絡</span>
                </div>
                <div className="container contacts__hero-inner">
                    <span className="section-eyebrow">Мы рядом</span>
                    <h1 className="contacts__title">
                        Свяжитесь <span>с нами</span>
                    </h1>
                    <p className="contacts__subtitle">
                        Заказ доставки, бронирование столика или просто вопрос —
                        мы всегда на связи с 10:00 до 00:00
                    </p>
                </div>
            </header>

            {/* КАРТОЧКИ КОНТАКТОВ */}
            <section className="container contacts__cards">
                <a href={`tel:${PHONE_RAW}`} className="contacts__card contacts__card--primary">
                    <div className="contacts__card-icon"><FaPhone /></div>
                    <div className="contacts__card-body">
                        <span>Позвонить</span>
                        <strong>{PHONE}</strong>
                        <small>Заказ и бронирование</small>
                    </div>
                    <span className="contacts__card-arrow">→</span>
                </a>

                <div className="contacts__card">
                    <div className="contacts__card-icon"><FaClock /></div>
                    <div className="contacts__card-body">
                        <span>Сегодня открыто</span>
                        <strong>10:00 – 00:00</strong>
                        <small>Ежедневно, без выходных</small>
                    </div>
                </div>

                <a
                    href={MAPS_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="contacts__card"
                >
                    <div className="contacts__card-icon"><FaMapMarkerAlt /></div>
                    <div className="contacts__card-body">
                        <span>Адрес</span>
                        <strong>Бухара, Узбекистан</strong>
                        <small>Открыть на карте</small>
                    </div>
                    <span className="contacts__card-arrow">→</span>
                </a>
            </section>

            {/* РАСПИСАНИЕ + КАРТА */}
            <section className="container contacts__main">
                <ScheduleCard />

                <div className="contacts__map-card">
                    <iframe
                        src="https://www.google.com/maps?q=39.764483647518404,64.42864298529717&z=15&output=embed"
                        width="100%"
                        height="100%"
                        style={{ border: 0 }}
                        loading="lazy"
                        title="Карта Tokio Sushi"
                        allowFullScreen
                    />
                    <div className="contacts__map-overlay">
                        <div className="contacts__map-info">
                            <FaMapMarkerAlt size={14} />
                            <div>
                                <strong>Tokio Sushi Bukhara</strong>
                                <span>Бухара, Узбекистан</span>
                            </div>
                        </div>
                        <a
                            href={MAPS_URL}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="contacts__map-btn"
                        >
                            Маршрут <FaArrowRight size={11} />
                        </a>
                    </div>
                </div>
            </section>

            {/* СОЦСЕТИ */}
            <section className="container contacts__socials">
                <div className="contacts__socials-head">
                    <span className="section-eyebrow">Соцсети</span>
                    <h2 className="section-title">Мы в интернете</h2>
                </div>

                <div className="contacts__socials-grid">
                    <a
                        href="https://www.instagram.com/tokio_sushi_bukhara/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="contacts__social contacts__social--insta"
                    >
                        <FaInstagram size={24} />
                        <div>
                            <strong>Instagram</strong>
                            <small>@tokio_sushi_bukhara</small>
                        </div>
                        <span>→</span>
                    </a>

                    <a
                        href="https://t.me/tokio_sushi_bukhara"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="contacts__social contacts__social--tg"
                    >
                        <FaTelegramPlane size={24} />
                        <div>
                            <strong>Telegram</strong>
                            <small>Написать в чат</small>
                        </div>
                        <span>→</span>
                    </a>

                    <a
                        href={`tel:${PHONE_RAW}`}
                        className="contacts__social contacts__social--phone"
                    >
                        <FaPhone size={22} />
                        <div>
                            <strong>Телефон</strong>
                            <small>{PHONE}</small>
                        </div>
                        <CopyButton text={PHONE} label="Копировать" />
                    </a>
                </div>
            </section>

            {/* ИНФО + CTA */}
            <section className="container contacts__info">
                <div className="contacts__info-card">
                    <h3>Tokio Sushi Bukhara</h3>
                    <p>Суши-бар и доставка японской кухни в Бухаре. Свежие роллы, сеты и суши — каждый день с 10:00 до 00:00.</p>
                    <div className="contacts__info-row">
                        <FaMapMarkerAlt size={12} />
                        <span>г. Бухара, Узбекистан</span>
                    </div>
                    <div className="contacts__info-row">
                        <FaClock size={12} />
                        <span>Ежедневно 10:00 – 00:00</span>
                    </div>
                </div>

                <div className="contacts__cta-card">
                    <h3>Готовы сделать заказ?</h3>
                    <p>Откройте меню и выберите любимые блюда — привезём за 45 минут.</p>
                    <Link href="/menu" className="btn-primary">
                        <FaUtensils size={12} /> Открыть меню <FaArrowRight size={12} />
                    </Link>
                </div>
            </section>
        </div>
    );
}