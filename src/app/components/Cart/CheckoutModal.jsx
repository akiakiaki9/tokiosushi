'use client';
import { useState, useEffect } from 'react';
import {
    FaTimes, FaTelegramPlane, FaMapMarkerAlt, FaSpinner,
    FaCheckCircle, FaExclamationTriangle,
} from 'react-icons/fa';
import { useCart } from '@/app/context/CartContext';
import './checkout.css';

const EMPTY_FORM = { name: '', phone: '', address: '', comment: '' };

export default function CheckoutModal() {
    const { isCheckoutOpen, closeCheckout, cart, totalPrice, clearCart } = useCart();
    const [form, setForm] = useState(EMPTY_FORM);
    const [location, setLocation] = useState(null); // { lat, lng }
    const [locStatus, setLocStatus] = useState('idle'); // idle|loading|success|error
    const [locError, setLocError] = useState('');
    const [sending, setSending] = useState(false);

    // Блокировка скролла
    useEffect(() => {
        if (isCheckoutOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => { document.body.style.overflow = ''; };
    }, [isCheckoutOpen]);

    // Escape
    useEffect(() => {
        const onKey = (e) => { if (e.key === 'Escape') closeCheckout(); };
        if (isCheckoutOpen) window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, [isCheckoutOpen, closeCheckout]);

    const handleGetLocation = () => {
        if (!navigator.geolocation) {
            setLocStatus('error');
            setLocError('Геолокация не поддерживается браузером');
            return;
        }
        setLocStatus('loading');
        setLocError('');

        navigator.geolocation.getCurrentPosition(
            (pos) => {
                const { latitude, longitude } = pos.coords;
                setLocation({ lat: latitude, lng: longitude });
                setLocStatus('success');
            },
            (err) => {
                setLocStatus('error');
                setLocError(
                    err.code === 1
                        ? 'Разрешите доступ к геолокации в настройках браузера'
                        : 'Не удалось определить местоположение'
                );
            },
            { enableHighAccuracy: true, timeout: 10000 }
        );
    };

    const handleSubmit = async () => {
        if (!form.name.trim() || !form.phone.trim()) {
            alert('Укажите имя и телефон');
            return;
        }
        setSending(true);

        const orderDetails = cart
            .map((i) => `• ${i.name} × ${i.qty} — ${(i.qty * i.price).toLocaleString()} сум`)
            .join('\n');

        try {
            const res = await fetch('/api/telegram', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    customer: form,
                    location,
                    orderDetails,
                    total: totalPrice,
                }),
            });

            if (!res.ok) throw new Error('send failed');

            alert('✅ Заказ отправлен! Мы свяжемся с вами.');
            clearCart();
            setForm(EMPTY_FORM);
            setLocation(null);
            setLocStatus('idle');
            closeCheckout();
        } catch (e) {
            alert('Ошибка отправки. Попробуйте позже.');
        } finally {
            setSending(false);
        }
    };

    if (!isCheckoutOpen) return null;

    return (
        <div className="checkout" onClick={closeCheckout}>
            <div className="checkout__modal" onClick={(e) => e.stopPropagation()}>
                <button className="checkout__close" onClick={closeCheckout} aria-label="Закрыть">
                    <FaTimes size={20} />
                </button>

                <div className="checkout__head">
                    <h2>Оформление заказа</h2>
                    <p>Заполните данные — мы свяжемся с вами в течение 5 минут</p>
                </div>

                <div className="checkout__body">
                    {/* Форма */}
                    <div className="checkout__field">
                        <label>Имя *</label>
                        <input
                            type="text"
                            placeholder="Как вас зовут?"
                            value={form.name}
                            onChange={(e) => setForm({ ...form, name: e.target.value })}
                        />
                    </div>

                    <div className="checkout__field">
                        <label>Телефон *</label>
                        <input
                            type="tel"
                            placeholder="+998 __ ___ __ __"
                            value={form.phone}
                            onChange={(e) => setForm({ ...form, phone: e.target.value })}
                        />
                    </div>

                    <div className="checkout__field">
                        <label>Адрес доставки</label>
                        <input
                            type="text"
                            placeholder="Улица, дом, квартира"
                            value={form.address}
                            onChange={(e) => setForm({ ...form, address: e.target.value })}
                        />
                    </div>

                    {/* Кнопка геолокации */}
                    <button
                        type="button"
                        className={`checkout__geo ${locStatus === 'success' ? 'checkout__geo--success' : ''
                            } ${locStatus === 'error' ? 'checkout__geo--error' : ''}`}
                        onClick={handleGetLocation}
                        disabled={locStatus === 'loading' || locStatus === 'success'}
                    >
                        {locStatus === 'loading' && <><FaSpinner className="spin" /> Определяем...</>}
                        {locStatus === 'idle' && <><FaMapMarkerAlt /> Определить моё местоположение</>}
                        {locStatus === 'success' && <><FaCheckCircle /> Локация определена</>}
                        {locStatus === 'error' && <><FaExclamationTriangle /> {locError}</>}
                    </button>

                    {location && (
                        <div className="checkout__coords">
                            <span>📍 {location.lat.toFixed(5)}, {location.lng.toFixed(5)}</span>
                        </div>
                    )}

                    <div className="checkout__field">
                        <label>Комментарий к заказу</label>
                        <textarea
                            rows={3}
                            placeholder="Пожелания, время доставки..."
                            value={form.comment}
                            onChange={(e) => setForm({ ...form, comment: e.target.value })}
                        />
                    </div>

                    {/* Итого */}
                    <div className="checkout__summary">
                        <span>К оплате:</span>
                        <strong>{totalPrice.toLocaleString()} сум</strong>
                    </div>
                </div>

                <div className="checkout__footer">
                    <button
                        className="btn-primary checkout__submit"
                        onClick={handleSubmit}
                        disabled={sending}
                    >
                        <FaTelegramPlane />
                        {sending ? 'Отправка...' : 'Подтвердить заказ'}
                    </button>
                </div>
            </div>
        </div>
    );
}