'use client';
import { useEffect } from 'react';
import {
    FaTimes, FaTrash, FaPlus, FaMinus, FaArrowRight,
} from 'react-icons/fa';
import { useCart } from '@/app/context/CartContext';
import './cart.css';

export default function CartSidebar() {
    const {
        cart, isOpen, closeCart, updateQty, removeFromCart,
        totalPrice, openCheckout,
    } = useCart();

    // Блокировка скролла
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => { document.body.style.overflow = ''; };
    }, [isOpen]);

    return (
        <>
            <div
                className={`cart-overlay ${isOpen ? 'cart-overlay--open' : ''}`}
                onClick={closeCart}
            />
            <aside className={`cart ${isOpen ? 'cart--open' : ''}`}>
                <header className="cart__header">
                    <div>
                        <h2>Корзина</h2>
                        <p className="cart__count">{cart.length} товар(ов)</p>
                    </div>
                    <button onClick={closeCart} className="cart__close" aria-label="Закрыть">
                        <FaTimes size={20} />
                    </button>
                </header>

                <div className="cart__body">
                    {cart.length === 0 && (
                        <div className="cart__empty">
                            <span className="cart__empty-emoji">🍣</span>
                            <p>Ваша корзина пуста</p>
                            <button onClick={closeCart} className="cart__empty-btn">
                                Перейти в меню
                            </button>
                        </div>
                    )}

                    {cart.map((item) => (
                        <div key={item.id} className="cart__item">
                            <img src={item.image} alt={item.name} className="cart__img" />
                            <div className="cart__info">
                                <p className="cart__name">{item.name}</p>
                                <p className="cart__price">{item.price.toLocaleString()} сум</p>
                                <div className="cart__qty">
                                    <button onClick={() => updateQty(item.id, -1)} aria-label="Минус">
                                        <FaMinus size={10} />
                                    </button>
                                    <span>{item.qty}</span>
                                    <button onClick={() => updateQty(item.id, 1)} aria-label="Плюс">
                                        <FaPlus size={10} />
                                    </button>
                                    <button
                                        className="cart__remove"
                                        onClick={() => removeFromCart(item.id)}
                                        aria-label="Удалить"
                                    >
                                        <FaTrash size={12} />
                                    </button>
                                </div>
                            </div>
                            <p className="cart__sum">{(item.qty * item.price).toLocaleString()}</p>
                        </div>
                    ))}
                </div>

                {cart.length > 0 && (
                    <footer className="cart__footer">
                        <div className="cart__total">
                            <span>Итого:</span>
                            <strong>{totalPrice.toLocaleString()} сум</strong>
                        </div>
                        <button className="btn-primary cart__submit" onClick={openCheckout}>
                            Оформить заказ <FaArrowRight size={12} />
                        </button>
                    </footer>
                )}
            </aside>
        </>
    );
}