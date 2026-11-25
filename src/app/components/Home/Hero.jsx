import Link from 'next/link';
import { FaArrowRight, FaStar } from 'react-icons/fa';

export default function Hero() {
    return (
        <section className="hero">
            <div className="hero__bg">
                <div className="hero__circle hero__circle--1" />
                <div className="hero__circle hero__circle--2" />
                <div className="hero__kanji">寿司</div>
            </div>

            <div className="hero__inner">
                <div className="hero__content">
                    <div className="hero__badge">
                        <FaStar size={10} />
                        <span>Премиум суши-бар · Бухара</span>
                    </div>

                    <h1 className="hero__title">
                        Искусство <span className="hero__title-accent">суши</span>
                        <br />
                        в каждой детали
                    </h1>

                    <p className="hero__desc">
                        Свежайшие ингредиенты, авторские роллы и атмосфера Токио.
                        Доставим ваш заказ по Бухаре за 45 минут.
                    </p>

                    <div className="hero__actions">
                        <Link href="/menu" className="hero__btn hero__btn--primary">
                            Смотреть меню
                            <FaArrowRight size={14} />
                        </Link>
                        <a href="tel:+998774876566" className="hero__btn hero__btn--ghost">
                            Заказать звонок
                        </a>
                    </div>

                    <div className="hero__stats">
                        <div className="hero__stat">
                            <strong>45</strong>
                            <span>минут доставка</span>
                        </div>
                        <div className="hero__stat-divider" />
                        <div className="hero__stat">
                            <strong>50+</strong>
                            <span>блюд в меню</span>
                        </div>
                        <div className="hero__stat-divider" />
                        <div className="hero__stat">
                            <strong>4.9</strong>
                            <span>рейтинг гостей</span>
                        </div>
                    </div>
                </div>

                <div className="hero__visual">
                    <div className="hero__img-wrap">
                        <img
                            src="https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=800"
                            alt="Премиальные суши Tokio"
                            width={600}
                            height={600}
                            className="hero__img"
                        />
                        <div className="hero__img-glow" />
                    </div>
                    <div className="hero__price-tag">
                        <span>Сет «Токио»</span>
                        <strong>250 000 сум</strong>
                    </div>
                </div>
            </div>
        </section>
    );
}