'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { FaPhone, FaUtensils } from 'react-icons/fa';

const PHONE_RAW = '+998774876566';

const SCHEDULE = [
    { day: 'Понедельник', hours: '10:00 – 00:00' },
    { day: 'Вторник', hours: '10:00 – 00:00' },
    { day: 'Среда', hours: '10:00 – 00:00' },
    { day: 'Четверг', hours: '10:00 – 00:00' },
    { day: 'Пятница', hours: '10:00 – 00:00' },
    { day: 'Суббота', hours: '10:00 – 00:00' },
    { day: 'Воскресенье', hours: '10:00 – 00:00' },
];

export default function ScheduleCard() {
    // null при SSR — на клиенте после гидратации выставим реальный день
    const [todayIndex, setTodayIndex] = useState(null);

    useEffect(() => {
        const today = new Date().getDay(); // 0 = Sunday
        setTodayIndex(today === 0 ? 6 : today - 1); // 0 = Пн
    }, []);

    return (
        <div className="contacts__schedule-card">
            <div className="contacts__schedule-head">
                <h2>Часы работы</h2>
                <span className="contacts__open-badge">
                    <span className="contacts__open-dot" />
                    Открыто
                </span>
            </div>

            <ul className="contacts__schedule">
                {SCHEDULE.map((row, i) => (
                    <li
                        key={row.day}
                        className={`contacts__schedule-row ${i === todayIndex ? 'contacts__schedule-row--today' : ''
                            }`}
                    >
                        <span className="contacts__schedule-day">
                            {row.day}
                            {i === todayIndex && <em>сегодня</em>}
                        </span>
                        <span className="contacts__schedule-hours">{row.hours}</span>
                    </li>
                ))}
            </ul>

            <div className="contacts__schedule-actions">
                <a href={`tel:${PHONE_RAW}`} className="btn-primary">
                    <FaPhone size={12} /> Позвонить
                </a>
                <Link href="/menu" className="contacts__btn-ghost">
                    <FaUtensils size={12} /> В меню
                </Link>
            </div>
        </div>
    );
}