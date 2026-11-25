'use client';
import { useState, useMemo } from 'react';
import MenuItem from './MenuItem';
import MenuModal from './MenuModal';
import './menu.css';
import { CATEGORIES, MENU } from '@/app/data/menu';

export default function MenuGrid() {
    const [activeCat, setActiveCat] = useState('all');
    const [selected, setSelected] = useState(null);

    const filtered = useMemo(() => {
        if (activeCat === 'all') return MENU;
        return MENU.filter((i) => i.category === activeCat);
    }, [activeCat]);

    return (
        <div className="menu">
            <div className="menu__cats">
                {CATEGORIES.map((c) => (
                    <button
                        key={c.id}
                        onClick={() => setActiveCat(c.id)}
                        className={`menu__cat ${activeCat === c.id ? 'menu__cat--active' : ''}`}
                    >
                        {c.name}
                    </button>
                ))}
            </div>

            <div className="menu__grid">
                {filtered.map((item) => (
                    <MenuItem key={item.id} item={item} onOpen={() => setSelected(item)} />
                ))}
            </div>

            {selected && (
                <MenuModal item={selected} onClose={() => setSelected(null)} />
            )}
        </div>
    );
}