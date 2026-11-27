import Link from 'next/link';
import { FaArrowRight } from 'react-icons/fa';

const ITEMS = [
    { emoji: '🍣', name: 'Роллы', desc: '34 вида', href: '/menu?cat=rolls' },
    { emoji: '🍱', name: 'Сеты', desc: '30 сетов', href: '/menu?cat=sets' },
    { emoji: '🍕', name: 'Пиццы', desc: '18 видов', href: '/menu?cat=pizza' },
    { emoji: '🔥', name: 'Запечённые', desc: '12 видов', href: '/menu?cat=baked' },
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