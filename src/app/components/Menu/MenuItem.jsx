'use client';
import { FaPlus } from 'react-icons/fa';
import { useCart } from '@/app/context/CartContext';

export default function MenuItem({ item, onOpen }) {
    const { addToCart } = useCart();

    const handleAdd = (e) => {
        e.stopPropagation();
        addToCart(item);
    };

    return (
        <article className="menu__card" onClick={onOpen}>
            <div className="menu__card-img">
                <img src={item.image} alt={item.name} loading="lazy" decoding="async" />
                <div className="menu__card-overlay" />
            </div>
            <div className="menu__card-body">
                <h3 className="menu__card-title">{item.name}</h3>
                <p className="menu__card-desc">{item.description}</p>
                <div className="menu__card-footer">
                    <span className="menu__card-price">
                        {item.price.toLocaleString()} <small>сум</small>
                    </span>
                    <button
                        className="menu__card-add"
                        onClick={handleAdd}
                        aria-label={`Добавить ${item.name} в корзину`}
                    >
                        <FaPlus size={13} />
                    </button>
                </div>
            </div>
        </article>
    );
}