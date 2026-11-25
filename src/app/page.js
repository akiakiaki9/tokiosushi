import Hero from './components/Home/Hero';
import QuickMenu from './components/Home/QuickMenu';
import BestSellers from './components/Home/BestSellers';
import ContactStrip from './components/Home/ContactStrip';
import './page.css';
import './components/Home/home.css';

export const metadata = {
  title: 'Tokio Sushi — Премиальные суши в Бухаре с доставкой',
  description:
    'Изысканные суши и роллы в Бухаре. Tokio Sushi — японская кухня премиум-класса с доставкой. Ежедневно 10:00–00:00. ☎ +998 77 487 65 66',
};

export default function HomePage() {
  return (
    <div className="home">
      <Hero />
      <QuickMenu />
      <BestSellers />
      <ContactStrip />
    </div>
  );
}