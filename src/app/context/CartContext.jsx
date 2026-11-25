'use client';
import { createContext, useContext, useState, useEffect, useCallback } from 'react';

const CartContext = createContext(null);

export function CartProvider({ children }) {
    const [cart, setCart] = useState([]);
    const [isOpen, setIsOpen] = useState(false);              // боковая корзина
    const [isCheckoutOpen, setIsCheckoutOpen] = useState(false); // модалка оформления
    const [hydrated, setHydrated] = useState(false);

    // Загрузка
    useEffect(() => {
        try {
            const saved = localStorage.getItem('tokio_cart');
            if (saved) setCart(JSON.parse(saved));
        } catch (e) {
            console.error('Cart load error', e);
        }
        setHydrated(true);
    }, []);

    // Сохранение
    useEffect(() => {
        if (hydrated) localStorage.setItem('tokio_cart', JSON.stringify(cart));
    }, [cart, hydrated]);

    const addToCart = useCallback((item) => {
        setCart((prev) => {
            const existing = prev.find((i) => i.id === item.id);
            if (existing) {
                return prev.map((i) => (i.id === item.id ? { ...i, qty: i.qty + 1 } : i));
            }
            return [...prev, { ...item, qty: 1 }];
        });
    }, []);

    const removeFromCart = useCallback((id) => {
        setCart((prev) => prev.filter((i) => i.id !== id));
    }, []);

    const updateQty = useCallback((id, delta) => {
        setCart((prev) =>
            prev
                .map((i) => (i.id === id ? { ...i, qty: i.qty + delta } : i))
                .filter((i) => i.qty > 0)
        );
    }, []);

    const clearCart = useCallback(() => setCart([]), []);
    const toggleCart = useCallback(() => setIsOpen((v) => !v), []);
    const closeCart = useCallback(() => setIsOpen(false), []);
    const openCheckout = useCallback(() => {
        setIsOpen(false);
        setIsCheckoutOpen(true);
    }, []);
    const closeCheckout = useCallback(() => setIsCheckoutOpen(false), []);

    const totalItems = cart.reduce((a, c) => a + c.qty, 0);
    const totalPrice = cart.reduce((a, c) => a + c.qty * c.price, 0);

    return (
        <CartContext.Provider
            value={{
                cart,
                isOpen,
                isCheckoutOpen,
                totalItems,
                totalPrice,
                addToCart,
                removeFromCart,
                updateQty,
                clearCart,
                toggleCart,
                closeCart,
                openCheckout,
                closeCheckout,
            }}
        >
            {children}
        </CartContext.Provider>
    );
}

export const useCart = () => {
    const ctx = useContext(CartContext);
    if (!ctx) throw new Error('useCart must be used within CartProvider');
    return ctx;
};