import React, { useState } from 'react';
import { useNavigate,Link  } from 'react-router-dom';
import { Home as HomeIcon, Phone, Mail } from 'lucide-react';
import { useScrollAnimations } from '../hooks/useScrollAnimations';
import { useHeroScrollDarken } from '../hooks/useHeroScrollDarken';
import { usePremiumScrollAnimations } from '../hooks/usePremiumScrollAnimations';
import '../index.css';
import MobileMenu from '../components/MobileMenu';
import amsaiiLogo from '../assets/amsaii-logo.svg';

import Footer from '../components/Footer';

const contactInfo = [
    {
        icon: <HomeIcon className="w-5 h-5" />,
        label: 'Adresse',
        lines: ['Guéliz, Marrakech', 'Marrakesh-Safi, Maroc'],
    },
    {
        icon: <Phone className="w-5 h-5" />,
        label: 'Téléphone',
        lines: ['+212 6 00 00 00 00'],
    },
    {
        icon: <Mail className="w-5 h-5" />,
        label: 'Support',
        lines: ['contact@amsaii.com'],
    },
];

export default function Contact() {
    const navigate = useNavigate();
    useScrollAnimations();
    useHeroScrollDarken();
    usePremiumScrollAnimations();

    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        setSubmitted(true);
    };

    return (
        <div className="amsaii-home amsaii-contact-page min-h-screen bg-[#FDFBF7]">
            {/* Navbar (identique Home/About) */}
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

            {/* HERO */}
            <section className="hero">
                <img
                    src="https://a0.muscache.com/im/pictures/hosting/Hosting-1402783362385506011/original/3420a791-4018-49a8-b635-2c3aadc37c81.jpeg?im_w=1200"
                    alt="AMSAII Marrakech"
                    className="hero-bg"
                />
                <div className="hero-overlay"></div>
                <div className="hero-content about-hero-content">
                    <h1 className="hero-title about-hero-title">Contact</h1>
                    <p className="hero-description">
                        Une question sur un logement ou votre réservation ? Trouvez toutes les réponses <u>ici</u>.
                    </p>
                </div>
                <div className="scroll-down-wrapper" onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}>
                    <span>DÉFILER</span>
                </div>
            </section>

            <div className="hero-spacer" />

            {/* PANNEAU BLANC : INFOS + FORMULAIRE */}
            <section className="contact-panel-section">
                <div className="contact-panel-inner">

                    {/* COLONNE GAUCHE : infos */}
                    <div className="contact-info-col reveal">
                        <div className="contact-info-thumb">
                        </div>
                        <h2 className="contact-info-title">
                            Envoyez-nous<br />votre message !
                        </h2>
                        <p className="contact-info-subtitle">
                            Que ce soit pour une question sur un logement, une réservation, ou votre check-in — nous vous répondons rapidement.
                        </p>

                        <div className="contact-info-list">
                            {contactInfo.map((item, i) => (
                                <div key={i} className="contact-info-item">
                                    <div className="contact-info-item-header">
                                        <span className="contact-info-icon">{item.icon}</span>
                                        <h3>{item.label}</h3>
                                    </div>
                                    {item.lines.map((line, j) => (
                                        <p key={j} className="contact-info-line">{line}</p>
                                    ))}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* COLONNE DROITE : formulaire */}
                    <div className="contact-form-col reveal">
                        <h2 className="contact-form-heading">Formulaire</h2>
                        <p className="contact-form-subheading">
                            N'hésitez pas, nous sommes très réactifs !
                        </p>

                        {submitted ? (
                            <div className="contact-form-success">
                                <p>Merci ! Votre message a bien été envoyé, nous revenons vers vous très vite.</p>
                            </div>
                        ) : (
                            <form className="contact-panel-form" onSubmit={handleSubmit}>
                                <div className="contact-panel-form-row">
                                    <input type="text" placeholder="Votre nom" required />
                                    <input type="email" placeholder="Votre email" required />
                                </div>
                                <div className="contact-panel-form-row">
                                    <select required defaultValue="">
                                        <option value="" disabled>Objet de votre demande</option>
                                        <option value="reservation">Réservation</option>
                                        <option value="checkin">Question sur le check-in</option>
                                        <option value="autre">Autre demande</option>
                                    </select>
                                </div>
                                <div className="contact-panel-form-row">
                                    <textarea placeholder="Votre message" rows="5" required></textarea>
                                </div>
                                <button type="submit" className="contact-panel-submit">
                                    Envoyer
                                </button>
                                <p className="contact-panel-terms">
                                    En continuant, vous acceptez nos conditions d'utilisation
                                </p>
                            </form>
                        )}
                    </div>
                </div>
            </section>

            {/* Footer (identique Home/About) */}
 <Footer />
        </div>
    );
}