'use client';

import { useRef, useEffect, useState } from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

export default function MenuCategoryBar({ categories, active, onChange }) {
    const trackRef = useRef(null);
    const activeBtnRef = useRef(null);
    const [stuck, setStuck] = useState(false);

    // Автоскролл карусели к активной категории
    useEffect(() => {
        if (activeBtnRef.current && trackRef.current) {
            const btn = activeBtnRef.current;
            const track = trackRef.current;
            const offset = btn.offsetLeft - track.clientWidth / 2 + btn.clientWidth / 2;
            track.scrollTo({ left: offset, behavior: 'smooth' });
        }
    }, [active]);

    // Определяем «прилипание» к верху для тени
    useEffect(() => {
        const onScroll = () => {
            if (!trackRef.current) return;
            const rect = trackRef.current.getBoundingClientRect();
            setStuck(rect.top <= 64);
        };
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    const scrollBy = (dir) => {
        if (!trackRef.current) return;
        trackRef.current.scrollBy({ left: dir * 240, behavior: 'smooth' });
    };

    return (
        <div className={`catbar ${stuck ? 'catbar--stuck' : ''}`}>
            <div className="catbar__inner">
                <button
                    className="catbar__nav catbar__nav--left"
                    onClick={() => scrollBy(-1)}
                    aria-label="Назад"
                >
                    <FaChevronLeft size={12} />
                </button>

                <div className="catbar__track" ref={trackRef}>
                    {categories.map((cat) => {
                        const isActive = active === cat.id;
                        return (
                            <button
                                key={cat.id}
                                ref={isActive ? activeBtnRef : null}
                                onClick={() => onChange(cat.id)}
                                className={`catbar__item ${isActive ? 'catbar__item--active' : ''}`}
                            >
                                <span className="catbar__emoji">{cat.emoji}</span>
                                <span className="catbar__name">{cat.name}</span>
                            </button>
                        );
                    })}
                </div>

                <button
                    className="catbar__nav catbar__nav--right"
                    onClick={() => scrollBy(1)}
                    aria-label="Вперёд"
                >
                    <FaChevronRight size={12} />
                </button>
            </div>
        </div>
    );
}