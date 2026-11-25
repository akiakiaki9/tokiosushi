import Link from 'next/link';
import Image from 'next/image';
import {
    FaInstagram,
    FaTelegramPlane,
    FaPhone,
    FaMapMarkerAlt,
    FaClock,
} from 'react-icons/fa';
import ScrollToTop from './ScrollToTop';
import './footer.css';

const CURRENT_YEAR = 2026;

export default function Footer() {
    return (
        <footer className="footer">
            <div className="footer__decor">
                <span className="footer__kanji">東京</span>
            </div>

            <div className="footer__top">
                {/* Бренд */}
                <div className="footer__brand">
                    <Link href="/" className="footer__logo">
                        <Image
                            src="/images/logo.png"
                            alt="Tokio Sushi"
                            width={44}
                            height={44}
                            className="footer__logo-img"
                        />
                        <div className="footer__logo-text">
                            <span className="footer__logo-title">TOKIO</span>
                            <span className="footer__logo-sub">SUSHI</span>
                        </div>
                    </Link>
                    <p className="footer__desc">
                        Премиальные суши и роллы с доставкой по Бухаре.
                        Готовим с любовью, доставляем быстро.
                    </p>
                    <div className="footer__socials">
                        <a
                            href="https://www.instagram.com/tokio_sushi_bukhara/"
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="Instagram"
                            className="footer__social footer__social--insta"
                        >
                            <FaInstagram />
                        </a>
                        <a
                            href="https://t.me/tokio_sushi_bukhara"
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="Telegram"
                            className="footer__social footer__social--tg"
                        >
                            <FaTelegramPlane />
                        </a>
                        <a
                            href="tel:+998774876566"
                            aria-label="Позвонить"
                            className="footer__social footer__social--phone"
                        >
                            <FaPhone />
                        </a>
                    </div>
                </div>

                {/* Навигация */}
                <div className="footer__col">
                    <h4 className="footer__col-title">Навигация</h4>
                    <ul className="footer__links">
                        <li><Link href="/">Главная</Link></li>
                        <li><Link href="/menu">Меню</Link></li>
                        <li><Link href="/contacts">Контакты</Link></li>
                        <li><Link href="/links">Ссылки</Link></li>
                    </ul>
                </div>

                {/* Контакты */}
                <div className="footer__col">
                    <h4 className="footer__col-title">Контакты</h4>
                    <ul className="footer__contacts">
                        <li>
                            <FaPhone className="footer__contact-icon" />
                            <a href="tel:+998774876566">+998 77 487 65 66</a>
                        </li>
                        <li>
                            <FaClock className="footer__contact-icon" />
                            <span>Ежедневно 10:00 – 00:00</span>
                        </li>
                        <li>
                            <FaMapMarkerAlt className="footer__contact-icon" />
                            <a
                                href="https://maps.google.com/?q=39.764483647518404,64.42864298529717"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                улица Хамзы, 25, Бухара
                            </a>
                        </li>
                    </ul>
                </div>

                {/* CTA */}
                <div className="footer__col">
                    <h4 className="footer__col-title">Заказать</h4>
                    <p className="footer__cta-text">
                        Проголодались? Сделайте заказ прямо сейчас — привезём за 45 минут.
                    </p>
                    <Link href="/menu" className="btn-primary footer__cta-btn">
                        Открыть меню
                    </Link>
                </div>
            </div>

            {/* Нижняя панель */}
            <div className="footer__bottom">
                <p className="footer__copy">
                    © {CURRENT_YEAR} <strong>Tokio Sushi</strong>. Все права защищены.
                </p>

                <a
                    href="https://www.akbarsoft.uz"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="footer__dev"
                >
                    <span className="footer__dev-label">Разработано в</span>
                    <span className="footer__dev-brand">Akbar <span className="footer__dev-accent">Soft</span></span>
                </a>

                <ScrollToTop />
            </div>
        </footer>
    );
}