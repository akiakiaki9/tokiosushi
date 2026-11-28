'use client';

import { useState, useMemo, useEffect, useRef } from 'react';
import MenuCategoryBar from '@/app/components/Menu/MenuCategoryBar';
import MenuItem from '@/app/components/Menu/MenuItem';
import MenuModal from '@/app/components/Menu/MenuModal';
import { MENU, CATEGORIES } from '@/app/data/menu';
import '@/app/components/Menu/menu.css';

const getValidCategory = (category) =>
    CATEGORIES.some((c) => c.id === category) ? category : 'all';

export default function MenuClient({ initialCategory }) {
    const [activeCat, setActiveCat] = useState(() => getValidCategory(initialCategory));
    const [selected, setSelected] = useState(null);
    const gridRef = useRef(null);
    const isFirstRender = useRef(true);

    useEffect(() => {
        const syncCategoryFromUrl = () => {
            setActiveCat(getValidCategory(new URL(window.location.href).searchParams.get('cat')));
        };
        window.addEventListener('popstate', syncCategoryFromUrl);
        return () => window.removeEventListener('popstate', syncCategoryFromUrl);
    }, []);

    const filtered = useMemo(() => {
        if (activeCat === 'all') return MENU;
        return MENU.filter((i) => i.category === activeCat);
    }, [activeCat]);

    const changeCategory = (category) => {
        const url = new URL(window.location.href);
        if (category === 'all') {
            url.searchParams.delete('cat');
        } else {
            url.searchParams.set('cat', category);
        }
        window.history.pushState(null, '', url);
        setActiveCat(category);
    };

    // Скролл к первой карточке при смене категории (кроме первой загрузки)
    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }
        if (gridRef.current) {
            const navbarHeight = document.querySelector('.navbar')?.getBoundingClientRect().height ?? 0;
            const categoryBarHeight = document.querySelector('.catbar')?.getBoundingClientRect().height ?? 0;
            const offset = navbarHeight + categoryBarHeight + 16;
            const top = gridRef.current.getBoundingClientRect().top + window.scrollY - offset;
            window.scrollTo({ top, behavior: 'smooth' });
        }
    }, [activeCat]);

    return (
        <div className="menu-page">
            <header className="menu-page__head">
                <div className="container">
                    <h1 className="section-title">Меню <span>Tokio Sushi</span></h1>
                    <p className="menu-page__sub">
                        Выбирайте любимое — {MENU.length} блюд из свежих ингредиентов
                    </p>
                    <span className="menu-page__delivery">
                        Доставка по Бухаре · ежедневно 10:00–00:00
                    </span>
                </div>
            </header>

            <MenuCategoryBar
                categories={CATEGORIES}
                active={activeCat}
                onChange={changeCategory}
            />

            <div className="container" ref={gridRef}>
                {filtered.length === 0 ? (
                    <p className="menu-page__empty">В этой категории пока нет блюд</p>
                ) : (
                    <div className="menu__grid">
                        {filtered.map((item) => (
                            <MenuItem key={item.id} item={item} onOpen={() => setSelected(item)} />
                        ))}
                    </div>
                )}
            </div>

            {selected && (
                <MenuModal item={selected} onClose={() => setSelected(null)} />
            )}
        </div>
    );
}