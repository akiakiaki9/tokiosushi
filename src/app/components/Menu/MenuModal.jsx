'use client';
import { useEffect, useState } from 'react';
import { FaTimes, FaPlus, FaMinus } from 'react-icons/fa';
import { useCart } from '@/app/context/CartContext';

export default function MenuModal({ item, onClose }) {
    const { addToCart } = useCart();
    const [qty, setQty] = useState(1);

    useEffect(() => {
        const prev = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        return () => { document.body.style.overflow = prev; };
    }, []);

    useEffect(() => {
        const onKey = (e) => { if (e.key === 'Escape') onClose(); };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, [onClose]);

    const handleAdd = () => {
        for (let i = 0; i < qty; i++) addToCart(item);
        onClose();
    };

    return (
        <div className="modal" onClick={onClose}>
            <div className="modal__content" onClick={(e) => e.stopPropagation()}>
                <button className="modal__close" onClick={onClose} aria-label="Закрыть">
                    <FaTimes size={18} />
                </button>

                <img
                    src={item.image || '/images/placeholder.png'}
                    alt={item.name}
                    className="modal__img"
                    onError={(e) => { e.currentTarget.src = '/images/placeholder.png'; }}
                />

                <div className="modal__body">
                    <h2 className="modal__title">{item.name}</h2>
                    <p className="modal__desc">{item.description}</p>

                    <div className="modal__qty">
                        <button onClick={() => setQty((q) => Math.max(1, q - 1))}>
                            <FaMinus size={11} />
                        </button>
                        <span>{qty}</span>
                        <button onClick={() => setQty((q) => q + 1)}>
                            <FaPlus size={11} />
                        </button>
                    </div>

                    <div className="modal__footer">
                        <span className="modal__price">
                            {item.price > 0 ? (
                                <>{(item.price * qty).toLocaleString()} <small>сум</small></>
                            ) : (
                                <small>Уточняйте цену</small>
                            )}
                        </span>
                        <button className="btn-primary" onClick={handleAdd}>
                            <FaPlus size={12} /> В корзину
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}