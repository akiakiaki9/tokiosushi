import Link from 'next/link';
import Image from 'next/image';
import { FaArrowRight } from 'react-icons/fa';
import { CATEGORIES, MENU } from '@/app/data/menu';

const LAST_AVAILABLE_MENU_PHOTO_ID = 41;
const CATEGORY_ACCENTS = [
    'rgba(230, 57, 70, 0.3)',
    'rgba(212, 175, 55, 0.28)',
    'rgba(80, 148, 185, 0.3)',
    'rgba(163, 91, 174, 0.28)',
    'rgba(218, 112, 59, 0.28)',
    'rgba(47, 145, 127, 0.28)',
];

const formatDishCount = (count) => {
    const lastTwoDigits = count % 100;
    if (lastTwoDigits >= 11 && lastTwoDigits <= 14) return `${count} блюд`;
    const lastDigit = count % 10;
    if (lastDigit === 1) return `${count} блюдо`;
    if (lastDigit >= 2 && lastDigit <= 4) return `${count} блюда`;
    return `${count} блюд`;
};

const ITEMS = CATEGORIES
    .filter((category) => category.id !== 'all')
    .map((category, index) => {
        const products = MENU.filter((item) => item.category === category.id);
        const hasPhoto = products[0]?.id <= LAST_AVAILABLE_MENU_PHOTO_ID;
        return {
            ...category,
            countLabel: formatDishCount(products.length),
            hasPhoto,
            image: hasPhoto ? products[0].image : undefined,
            accent: CATEGORY_ACCENTS[index % CATEGORY_ACCENTS.length],
        };
    });

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
                    {ITEMS.map((item, index) => (
                        <Link
                            key={item.id}
                            href={`/menu?cat=${item.id}`}
                            className={`quickmenu__card ${item.hasPhoto ? '' : 'quickmenu__card--art'}`}
                            aria-label={`${item.name}, ${item.countLabel}`}
                            data-number={String(index + 1).padStart(2, '0')}
                            style={{ '--category-accent': item.accent }}
                        >
                            {item.hasPhoto && (
                                <Image
                                    className="quickmenu__image"
                                    src={item.image}
                                    alt=""
                                    fill
                                    sizes="(max-width: 600px) 50vw, (max-width: 900px) 33vw, 25vw"
                                />
                            )}
                            <div className="quickmenu__info">
                                <h3>{item.name}</h3>
                                <p>{item.countLabel}</p>
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