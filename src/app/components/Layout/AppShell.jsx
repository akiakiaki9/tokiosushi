'use client';

import { usePathname } from 'next/navigation';
import Navbar from '../Navbar/Navbar';
import Footer from '../Footer/Footer';
import CartSidebar from '../Cart/CartSidebar';
import CheckoutModal from '../Cart/CheckoutModal';
import FloatingCartButton from '../Cart/FloatingCartButton';

// Пути, где скрываем Navbar/Footer/корзину
const HIDE_CHROME = ['/links'];

export default function AppShell({ children }) {
    const pathname = usePathname();
    const hideChrome = HIDE_CHROME.includes(pathname);

    if (hideChrome) {
        return <>{children}</>;
    }

    return (
        <>
            <Navbar />
            <main style={{ minHeight: '60vh' }}>{children}</main>
            <Footer />
            <CartSidebar />
            <CheckoutModal />
            <FloatingCartButton />
        </>
    );
}