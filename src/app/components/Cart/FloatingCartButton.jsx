'use client';
import { FaShoppingBag } from 'react-icons/fa';
import { useCart } from '@/app/context/CartContext';
import './FloatingCartButton.css';

export default function FloatingCartButton() {
  const { totalItems, totalPrice, toggleCart, isOpen } = useCart();

  if (isOpen) return null; // скрываем, пока открыта корзина

  return (
    <button
      className={`floating-cart ${totalItems > 0 ? 'floating-cart--active' : ''}`}
      onClick={toggleCart}
      aria-label="Открыть корзину"
    >
      <span className="floating-cart__pulse" />
      <span className="floating-cart__icon">
        <FaShoppingBag size={20} />
        {totalItems > 0 && (
          <span className="floating-cart__badge">{totalItems}</span>
        )}
      </span>
      {totalItems > 0 && (
        <span className="floating-cart__price">
          {totalPrice.toLocaleString()} <small>сум</small>
        </span>
      )}
    </button>
  );
}