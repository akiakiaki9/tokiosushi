'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { FaShoppingCart } from 'react-icons/fa';
import { useCart } from '@/app/context/CartContext';
import './navbar.css';

const NAV_ITEMS = [
    { href: '/', label: 'Главная' },
    { href: '/menu', label: 'Меню' },
    { href: '/contacts', label: 'Контакты' },
    { href: '/links', label: 'Ссылки' },
];

export default function Navbar() {
    const { totalItems, toggleCart } = useCart();
    const pathname = usePathname();
    const [mobileOpen, setMobileOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    // Тень при скролле
    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 10);
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    // Закрываем при смене роута
    useEffect(() => {
        setMobileOpen(false);
    }, [pathname]);

    // Блокируем скролл body при открытом мобильном меню
    useEffect(() => {
        if (mobileOpen) {
            document.body.style.overflow = 'hidden';
            document.body.style.paddingRight = '0px';
        } else {
            document.body.style.overflow = '';
            document.body.style.paddingRight = '';
        }
        return () => {
            document.body.style.overflow = '';
            document.body.style.paddingRight = '';
        };
    }, [mobileOpen]);

    // Закрытие по Escape
    useEffect(() => {
        const onKey = (e) => {
            if (e.key === 'Escape') setMobileOpen(false);
        };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, []);

    return (
        <>
            <nav className={`navbar ${scrolled ? 'navbar--scrolled' : ''} ${mobileOpen ? 'navbar--open' : ''}`}>
                <div className="navbar__inner">
                    {/* Логотип */}
                    <Link href="/" className="navbar__logo" onClick={() => setMobileOpen(false)}>
                        <Image
                            src="/images/logo.png"
                            alt="Tokio Sushi"
                            width={92}
                            height={50}
                            className="navbar__logo-img"
                            priority
                        />
                        <div className="navbar__logo-text">
                            <span className="navbar__logo-title">TOKIO</span>
                            <span className="navbar__logo-sub">SUSHI</span>
                        </div>
                    </Link>

                    {/* Десктоп-навигация */}
                    <div className="navbar__links">
                        {NAV_ITEMS.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`navbar__link ${pathname === item.href ? 'navbar__link--active' : ''}`}
                            >
                                {item.label}
                            </Link>
                        ))}
                    </div>

                    {/* Действия */}
                    <div className="navbar__actions">
                        <button
                            className="navbar__cart"
                            onClick={toggleCart}
                            aria-label="Открыть корзину"
                        >
                            <FaShoppingCart size={20} />
                            {totalItems > 0 && (
                                <span className="navbar__cart-badge">{totalItems}</span>
                            )}
                        </button>
                        <button
                            className={`navbar__burger ${mobileOpen ? 'navbar__burger--open' : ''}`}
                            onClick={() => setMobileOpen((v) => !v)}
                            aria-label={mobileOpen ? 'Закрыть меню' : 'Открыть меню'}
                            aria-expanded={mobileOpen}
                        >
                            <span className="navbar__burger-line" />
                            <span className="navbar__burger-line" />
                            <span className="navbar__burger-line" />
                        </button>
                    </div>
                </div>
            </nav>

            {/* Полноэкранное мобильное меню */}
            <div className={`mobile-menu ${mobileOpen ? 'mobile-menu--open' : ''}`}>
                <div className="mobile-menu__bg" />
                <div className="mobile-menu__content">
                    <div className="mobile-menu__logo">
                        <Image
                            src="/images/logo.png"
                            alt="Tokio Sushi"
                            width={64}
                            height={64}
                        />
                        <h2>TOKIO <span>SUSHI</span></h2>
                        <p>Суши-бар · Бухара</p>
                    </div>

                    <nav className="mobile-menu__nav">
                        {NAV_ITEMS.map((item, i) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`mobile-menu__link ${pathname === item.href ? 'mobile-menu__link--active' : ''}`}
                                style={{ animationDelay: `${i * 60 + 100}ms` }}
                                onClick={() => setMobileOpen(false)}
                            >
                                <span className="mobile-menu__link-num">0{i + 1}</span>
                                <span className="mobile-menu__link-text">{item.label}</span>
                                <span className="mobile-menu__link-arrow">→</span>
                            </Link>
                        ))}
                    </nav>

                    <div className="mobile-menu__footer">
                        <a href="tel:+998774876566" className="mobile-menu__phone">
                            +998 77 487 65 66
                        </a>
                        <p className="mobile-menu__hours">Ежедневно 10:00 – 00:00</p>
                        <button
                            className="btn-primary mobile-menu__cart-btn"
                            onClick={() => {
                                setMobileOpen(false);
                                toggleCart();
                            }}
                        >
                            <FaShoppingCart size={16} />
                            Корзина {totalItems > 0 && `(${totalItems})`}
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}