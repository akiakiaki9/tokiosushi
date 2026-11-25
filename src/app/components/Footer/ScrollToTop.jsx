'use client';

import { FaArrowUp } from 'react-icons/fa';

export default function ScrollToTop() {
    const handleClick = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <button
            className="footer__up"
            onClick={handleClick}
            aria-label="Наверх"
        >
            <FaArrowUp size={14} />
        </button>
    );
}