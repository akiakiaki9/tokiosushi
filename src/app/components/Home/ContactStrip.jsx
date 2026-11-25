import Link from 'next/link';
import { FaPhone, FaClock, FaMapMarkerAlt, FaArrowRight } from 'react-icons/fa';

export default function ContactStrip() {
    return (
        <section className="section contactstrip">
            <div className="container">
                <div className="contactstrip__card">
                    <div className="contactstrip__info">
                        <span className="section-eyebrow">Свяжитесь с нами</span>
                        <h2 className="contactstrip__title">
                            Мы всегда <span>на связи</span>
                        </h2>
                        <p className="contactstrip__sub">
                            Закажите доставку или забронируйте столик — мы позаботимся обо всём
                        </p>

                        <div className="contactstrip__items">
                            <a href="tel:+998774876566" className="contactstrip__item">
                                <div className="contactstrip__icon">
                                    <FaPhone size={16} />
                                </div>
                                <div>
                                    <span>Телефон</span>
                                    <strong>+998 77 487 65 66</strong>
                                </div>
                            </a>
                            <div className="contactstrip__item">
                                <div className="contactstrip__icon">
                                    <FaClock size={16} />
                                </div>
                                <div>
                                    <span>Часы работы</span>
                                    <strong>Ежедневно 10:00 – 00:00</strong>
                                </div>
                            </div>
                            <a
                                href="https://maps.google.com/?q=39.764483647518404,64.42864298529717"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="contactstrip__item"
                            >
                                <div className="contactstrip__icon">
                                    <FaMapMarkerAlt size={16} />
                                </div>
                                <div>
                                    <span>Адрес</span>
                                    <strong>улица Хамзы, 25, Бухара</strong>
                                </div>
                            </a>
                        </div>

                        <Link href="/contacts" className="btn-primary contactstrip__btn">
                            Все контакты <FaArrowRight size={12} />
                        </Link>
                    </div>

                    <div className="contactstrip__map">
                        <iframe
                            src="https://www.google.com/maps?q=39.764483647518404,64.42864298529717&z=14&output=embed"
                            width="100%"
                            height="100%"
                            style={{ border: 0 }}
                            loading="lazy"
                            title="Карта Tokio Sushi"
                        />
                    </div>
                </div>
            </div>
        </section>
    );
}