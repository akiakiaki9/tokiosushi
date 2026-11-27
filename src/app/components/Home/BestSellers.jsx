'use client';

import { useRef } from 'react';
import Link from 'next/link';
import { FaChevronLeft, FaChevronRight, FaPlus } from 'react-icons/fa';
import { useCart } from '@/app/context/CartContext';
import { MENU } from '@/app/data/menu';

export default function BestSellers() {
    const { addToCart } = useCart();
    const trackRef = useRef(null);

    const bestsellers = MENU.filter((i) => ['rolls', 'sets', 'sushi'].includes(i.category)).slice(0, 8);

    const scroll = (dir) => {
        if (!trackRef.current) return;
        const amount = 320;
        trackRef.current.scrollBy({ left: dir * amount, behavior: 'smooth' });
    };

    return (
        <section className="section bestsellers">
            <div className="container">
                <div className="section-head">
                    <div className="section-head__left">
                        <span className="section-eyebrow">Хиты продаж</span>
                        <h2 className="section-title">Лучшие блюда</h2>
                        <p className="section-sub">Выбор наших гостей — попробуйте любимое</p>
                    </div>
                    <div className="bestsellers__nav">
                        <button onClick={() => scroll(-1)} aria-label="Назад">
                            <FaChevronLeft size={14} />
                        </button>
                        <button onClick={() => scroll(1)} aria-label="Вперёд">
                            <FaChevronRight size={14} />
                        </button>
                    </div>
                </div>

                <div className="bestsellers__track" ref={trackRef}>
                    {bestsellers.map((item) => (
                        <div key={item.id} className="bestsellers__card">
                            <div className="bestsellers__img">
                                <img
                                    src={item.image || '/images/placeholder.png'}
                                    alt={item.name}
                                    loading="lazy"
                                    onError={(e) => { e.currentTarget.src = '/images/placeholder.png'; }}
                                />
                                <span className="bestsellers__tag">Хит</span>
                            </div>
                            <div className="bestsellers__body">
                                <h3>{item.name}</h3>
                                <p>{item.description}</p>
                                <div className="bestsellers__footer">
                                    <span className="bestsellers__price">
                                        {item.price.toLocaleString()} <small>сум</small>
                                    </span>
                                    <button
                                        className="bestsellers__add"
                                        onClick={() => addToCart(item)}
                                        aria-label="Добавить в корзину"
                                    >
                                        <FaPlus size={12} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="bestsellers__cta">
                    <Link href="/menu" className="btn-primary">
                        Открыть полное меню
                    </Link>
                </div>
            </div>
        </section>
    );
}