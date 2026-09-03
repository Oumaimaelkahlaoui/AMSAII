import React, { useState, useEffect } from 'react';
import { useNavigate,Link } from 'react-router-dom';
import { Wifi, Waves, MapPin, UtensilsCrossed, BedDouble, Car, ArrowUp } from 'lucide-react';
import { useScrollAnimations } from '../hooks/useScrollAnimations';
import { useHeroScrollDarken } from '../hooks/useHeroScrollDarken';
import { useMosaicScroll } from '../hooks/useMosaicScroll';
import { usePremiumScrollAnimations } from '../hooks/usePremiumScrollAnimations';
import '../index.css';
import { useCounterAnimation } from '../hooks/useCounterAnimation';
import { TreePine, Signpost } from 'lucide-react';
import amsaiiLogo from '../assets/amsaii-logo.svg';
import MobileMenu from '../components/MobileMenu';
import Footer from '../components/Footer';          


const services = [
    { id: 'emplacement', icon: <MapPin className="w-5 h-5" />, title: 'Emplacements idéaux', text: "Des logements situés dans les meilleurs quartiers de Marrakech, proches des incontournables de la ville." },
    { id: 'piscine', icon: <Waves className="w-5 h-5" />, title: 'Piscine & Détente', text: "Profitez d'espaces de détente et de piscines au sein des résidences pour vous ressourcer." },
    { id: 'wifi', icon: <Wifi className="w-5 h-5" />, title: 'Confort & Wifi', text: "Wi-Fi fibre optique, climatisation et équipements modernes dans chacun de nos logements." },
    { id: 'parking', icon: <Car className="w-5 h-5" />, title: 'Parking gratuit', text: "Garez-vous sans stress grâce au parking gratuit disponible dans nos résidences partenaires." },
    { id: 'cuisine', icon: <UtensilsCrossed className="w-5 h-5" />, title: 'Cuisines équipées', text: "Tout le nécessaire pour cuisiner comme chez vous, où que vous séjourniez." },
    { id: 'chambres', icon: <BedDouble className="w-5 h-5" />, title: 'Chambres confortables', text: "Literie premium et matelas de qualité, sélectionnés pour un vrai confort de sommeil." },
];

export default function Home() {
    const navigate = useNavigate();
    useScrollAnimations();
    useHeroScrollDarken();
    useMosaicScroll();
    usePremiumScrollAnimations();
    const [showBackToTop, setShowBackToTop] = useState(false);
    const [activeCard, setActiveCard] = useState(null);

    // Configuration des animations de compteurs avec leurs propres références
    const stat1 = useCounterAnimation(98, 2000);
    const stat2 = useCounterAnimation(100, 2000);
    const stat3 = useCounterAnimation(97, 2000);

    useEffect(() => {
        const handleScroll = () => setShowBackToTop(window.scrollY > 400);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <div className="amsaii-home min-h-screen bg-[#FDFBF7]">
            {/* Navbar */}
          <header className="header">
            <Link to="/" className="logo">
              <img src={amsaiiLogo} alt="AMSAII" className="logo" />
            </Link>
            <nav className="nav-links">
              <a href="/" className="nav-link">Accueil</a>
              <a href="/about" className="nav-link">À propos</a>
              <a href="/contact" className="nav-link">Contact</a>
    </nav>
    <button onClick={() => navigate('/check-in')} className="header-btn">Check-in</button>
    <MobileMenu
        links={[
            { href: '/', label: 'Accueil' },
            { href: '/about', label: 'À propos' },
            { href: '/contact', label: 'Contact' },
        ]}
        ctaLabel="Check-in"
        onCtaClick={() => navigate('/check-in')}
    />
</header>

            {/* Hero */}
            <section id="home" className="hero">
                <img
                    src="https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=2000&q=80"
                    alt="AMSAII Marrakech"
                    className="hero-bg"
                />
                <div className="hero-overlay"></div>
               <div className="hero-content">
    <h1 className="hero-title">
        <span className="hero-cycle" aria-label="Bienvenue à AMSAII">
            <span className="hero-cycle-track">
                <span className="hero-cycle-word">Bienvenue</span>
                <span className="hero-cycle-word">
                    à <span className="hero-title-brand">AMSAII</span>
                </span>
                <span className="hero-cycle-word" aria-hidden="true">Bienvenue</span>
            </span>
        </span>
    </h1>
    <p className="hero-description">
        Entre ruelles ocre et jardins secrets, découvrez un art de recevoir où chaque détail invite à la sérénité.
    </p>
</div>
                <div className="scroll-down-wrapper" onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}>
                    <span>DÉFILER</span>
                </div>
            </section>

            <div className="hero-spacer" />

            {/* Section À propos */}
            <section id="about" className="intro-section">
                <div className="intro-inner-container">
                    <div className="intro-header-block reveal">
                        <span className="intro-tag">À propos</span>
                        <h2 className="intro-main-title">
                            Une sélection de logements confortables et élégants au cœur de Marrakech, pour un séjour serein du début à la fin.
                        </h2>
                    </div>

                    <div className="services-grid reveal-stagger">
                        {services.map((service) => (
                            <div
                                key={service.id}
                                className={`service-column ${activeCard === service.id ? 'is-active' : ''}`}
                                onClick={() => setActiveCard(activeCard === service.id ? null : service.id)}
                            >
                                <div className="service-icon-circle">{service.icon}</div>
                                <h3 className="service-heading">{service.title}</h3>
                                <p className="service-text">{service.text}</p>
                            </div>
                        ))}
                    </div>

                    <div className="main-cta-wrapper">
                        <button onClick={() => navigate('/check-in')} className="main-cta-btn cursor-pointer">
                            <span>Faire mon check-in digital</span>
                            <span className="main-cta-arrow">→</span>
                        </button>
                    </div>
                </div>
            </section>

            {/* Section 3 : Mosaïque épinglée */}
            <div className="mosaic-pin-wrapper">
                <div className="mosaic-sticky">
                    <div className="mosaic-card">
                        <div className="gallery-mosaic">
                            <div className="gallery-item">
                                <img src="https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=600&q=80" alt="Salon" />
                            </div>
                            <div className="gallery-item">
                                <img src="https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=600&q=80" alt="Cuisine" />
                            </div>
                            <div className="gallery-item">
                                <img src="https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=600&q=80" alt="Bibliothèque" />
                            </div>
                            <div className="gallery-item">
                                <img src="https://images.unsplash.com/photo-1560185893-a55cbc8c57e8?auto=format&fit=crop&w=600&q=80" alt="Salle à manger" />
                            </div>

                            <div className="gallery-item">
                                <img src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=600&q=80" alt="Terrasse" />
                            </div>
                            <div className="gallery-item gallery-item--big">
                                <img src="https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1000&q=80" alt="Chambre" />
                            </div>
                            <div className="gallery-item">
                                <img src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=600&q=80" alt="Salle de bain" />
                            </div>

                            <div className="gallery-item">
                                <img src="https://images.unsplash.com/photo-1560184897-ae75f418493e?auto=format&fit=crop&w=600&q=80" alt="Chambre 2" />
                            </div>
                            <div className="gallery-item">
                                <img src="https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&w=600&q=80" alt="Extérieur" />
                            </div>
                            <div className="gallery-item">
                                <img src="https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=600&q=80" alt="Détail déco" />
                            </div>
                        </div>

                        <div className="gallery-caption">
                            <h2>Découvrez<br />l'expérience</h2>
                        </div>

                        <div className="gallery-contact-card">
                            <img
                                src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&q=80"
                                alt="Contact"
                                className="gallery-contact-avatar"
                            />
                            <span className="gallery-contact-text">
                                Une question ? <strong>+212 6 00 00 00 00</strong>
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Section 4 : Fonctionnalités alternées */}
            <section className="features-section">
                <div className="features-header reveal">
                    <span className="features-tag">Nos atouts</span>
                    <h2 className="features-title">Sublimez votre séjour</h2>
                    <p className="features-subtitle">
                        Chaque logement est pensé pour offrir confort, calme et praticité, où que vous soyez à Marrakech.
                    </p>
                </div>

                <div className="feature-row reveal">
                    <div className="feature-image-wrap">
                        <img src="https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=900&q=80" alt="Détente" />
                        <div className="feature-badge">
                            <TreePine className="w-6 h-6" />
                        </div>
                    </div>
                    <div className="feature-content">
                        <h3 className="feature-title">Détente</h3>
                        <p className="feature-text">
                            Des intérieurs pensés pour se ressourcer : lumière naturelle, matériaux chaleureux et espaces calmes pour souffler après une journée à explorer Marrakech.
                        </p>
                    </div>
                </div>

                <div className="feature-row feature-row--reverse reveal">
                    <div className="feature-image-wrap">
                        <img src="https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=900&q=80" alt="Facilité" />
                        <div className="feature-badge">
                            <Signpost className="w-6 h-6" />
                        </div>
                    </div>
                    <div className="feature-content">
                        <h3 className="feature-title">Sans effort</h3>
                        <p className="feature-text">
                            Check-in digital, quartiers bien desservis et équipements modernes : tout est pensé pour que votre séjour se passe sans le moindre stress.
                        </p>
                    </div>
                </div>
            </section>

            {/* Section Statistiques / Chiffres clés */}
            <section className="stats-section">
                <div className="stats-container">
                    <div className="stat-card" ref={stat1.elementRef}>
                        <div className="stat-number">
                            +{Math.floor(stat1.count)}<span className="stat-suffix">%</span>
                        </div>
                        <h3 className="stat-title">Voyageurs satisfaits</h3>
                        <p className="stat-text">
                            Vous cherchez un séjour de courte durée à Marrakech ? Nos résidences combinent confort et emplacement de choix.
                        </p>
                    </div>

                    <div className="stat-card" ref={stat2.elementRef}>
                        <div className="stat-number-wrapper">
                            <div className="stat-number">
                                {Math.floor(stat2.count)}<span className="stat-suffix">%</span>
                            </div>
                            <span className="stat-badge">120%</span>
                        </div>
                        <h3 className="stat-title">Revenu potentiel</h3>
                        <p className="stat-text">
                            Une gestion optimisée et moderne conçue pour valoriser chaque bien immobilier avec une efficacité maximale.
                        </p>
                    </div>

                    <div className="stat-card" ref={stat3.elementRef}>
                        <div className="stat-number">
                            +{Math.floor(stat3.count)}<span className="stat-suffix">%</span>
                        </div>
                        <h3 className="stat-title">Taux de recommandation</h3>
                        <p className="stat-text">
                            Que vous gériez un appartement cozy ou une villa d'exception, l'expérience AMSAII s'adapte à vos attentes.
                        </p>
                    </div>
                </div>
            </section>

            {/* SECTION CONTACT */}
            <section id="contact" className="amsaii-home contact-section">
                <div className="contact-container">
                    <div
                        className="contact-bg"
                        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1920&q=80')" }}
                    ></div>
                    <div className="contact-overlay"></div>

                    <svg 
                        className="contact-arrow-decoration reveal-ready" 
                        width="220" 
                        height="140" 
                        viewBox="0 0 220 140" 
                        fill="none" 
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path 
                            d="M15 110 C 50 130, 80 60, 120 80 C 160 100, 180 40, 205 55 M 205 55 L 190 45 M 205 55 L 195 70" 
                            stroke="rgba(255,255,255,0.95)" 
                            strokeWidth="2.5" 
                            strokeDasharray="8 6" 
                            strokeLinecap="round" 
                            strokeLinejoin="round"
                        />
                    </svg>

                    <div className="contact-content-left">
                        <span className="contact-subtitle">Contact</span>
                        <h2 className="contact-title reveal-ready">
                            <span className="word">Envoyez-nous&nbsp;</span>
                            <span className="word">votre&nbsp;</span>
                            <span className="word">message&nbsp;!</span>
                        </h2>
                        <p className="contact-description reveal-ready">
                            Une question sur un logement ou votre check-in ? Notre équipe vous répond rapidement pour préparer votre séjour à Marrakech.
                        </p>
                    </div>

                    <div className="contact-form-card reveal-ready">
                        <div className="form-header">
                            <h3>Contactez-nous</h3>
                            <p>N'hésitez pas, nous sommes très réactifs !</p>
                        </div>

                        <form className="contact-form" onSubmit={(e) => e.preventDefault()}>
                            <div className="form-row">
                                <input type="text" placeholder="Votre nom" required />
                                <input type="email" placeholder="Votre email" required />
                            </div>
                            <div className="form-row">
                                <select required defaultValue="">
                                    <option value="" disabled>Budget</option>
                                    <option value="500-1000">500€ – 1 000€</option>
                                    <option value="1000-2000">1 000€ – 2 000€</option>
                                    <option value="2000+">2 000€ +</option>
                                </select>
                            </div>
                            <div className="form-row">
                                <textarea placeholder="Votre message" rows="4" required></textarea>
                            </div>
                            <button type="submit" className="submit-btn">Envoyer</button>
                            <p className="form-terms">En continuant, vous acceptez nos conditions d'utilisation</p>
                        </form>
                    </div>

                    <div className="contact-call-badge reveal-ready">
                        <img
                            src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&q=80"
                            alt="Contact"
                            className="contact-call-avatar"
                        />
                        <span className="contact-call-text">
                            Appelez-nous ! <strong>+212 6 00 00 00 00</strong>
                        </span>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <Footer />

            {showBackToTop && (
                <button className="back-to-top-btn" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} aria-label="Retour en haut">
                    <ArrowUp className="w-4 h-4" />
                </button>
            )}
        </div>
    );
}