import Link from 'next/link';
import { FaArrowRight } from 'react-icons/fa';

const ITEMS = [
    { emoji: '🍣', name: 'Роллы', desc: 'Более 20 видов', href: '/menu?cat=rolls' },
    { emoji: '🍱', name: 'Сеты', desc: 'Для компании', href: '/menu?cat=sets' },
    { emoji: '🍥', name: 'Суши', desc: 'Классика', href: '/menu?cat=sushi' },
    { emoji: '🥤', name: 'Напитки', desc: 'Освежающие', href: '/menu?cat=drinks' },
];

export default function QuickMenu() {
    return (
        <section className="section quickmenu">
            <div className="container">
                <div className="section-head">
                    <div className="section-head__left">
                        <span className="section-eyebrow">Категории</span>
                        <h2 className="section-title">Выберите категорию</h2>
                    </div>
                    <Link href="/menu" className="section-link">
                        Всё меню <FaArrowRight size={12} />
                    </Link>
                </div>

                <div className="quickmenu__grid">
                    {ITEMS.map((item) => (
                        <Link key={item.name} href={item.href} className="quickmenu__card">
                            <span className="quickmenu__emoji">{item.emoji}</span>
                            <div className="quickmenu__info">
                                <h3>{item.name}</h3>
                                <p>{item.desc}</p>
                            </div>
                            <span className="quickmenu__arrow">
                                <FaArrowRight size={14} />
                            </span>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}