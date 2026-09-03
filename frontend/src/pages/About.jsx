import React from 'react';
import { useNavigate,Link  } from 'react-router-dom';
import {
    Wifi, Waves, MapPin, Wind, Car, ArrowUp, Star,
    Sparkles, ShieldCheck, Coffee,
} from 'lucide-react';
import { useScrollAnimations } from '../hooks/useScrollAnimations';
import { useHeroScrollDarken } from '../hooks/useHeroScrollDarken';
import { usePremiumScrollAnimations } from '../hooks/usePremiumScrollAnimations';
import '../index.css';
import MobileMenu from '../components/MobileMenu';
import amsaii from '../assets/AMSAII.jfif';
import amsaiiLogo from '../assets/amsaii-logo.svg';
import Footer from '../components/Footer';

const AIRBNB_URL = 'https://www.airbnb.fr/rooms/1402783362385506011';

const includesLiving = [
    { icon: <Waves className="w-4 h-4" />, text: 'Piscines partagées et transats gratuits' },
    { icon: <Wifi className="w-4 h-4" />, text: 'Wi-Fi fibre optique haut débit dans tous les logements' },
    { icon: <Wind className="w-4 h-4" />, text: 'Climatisation dans chaque pièce' },
];

const includesLocation = [
    { icon: <MapPin className="w-4 h-4" />, text: 'À quelques minutes de Guéliz et de la Médina' },
    { icon: <Car className="w-4 h-4" />, text: 'Parking gratuit et accès autonome par digicode' },
    { icon: <Coffee className="w-4 h-4" />, text: 'Cafés, restaurants et boutiques à deux pas' },
];

const ratingCategories = [
    { label: 'Propreté', value: 4.8 },
    { label: 'Précision', value: 4.9 },
    { label: 'Arrivée', value: 4.9 },
    { label: 'Communication', value: 4.9 },
    { label: 'Emplacement', value: 4.8 },
    { label: 'Qualité-prix', value: 4.9 },
];

// Thèmes réels mentionnés par les voyageurs sur Airbnb
const reviewThemes = [
    { label: 'Hospitalité', count: 96 },
    { label: 'Propreté', count: 64 },
    { label: 'Emplacement', count: 53 },
    { label: 'Confort', count: 34 },
    { label: 'Décoration', count: 25 },
    { label: 'Précision', count: 24 },
    { label: 'Espaces intérieurs', count: 37 },
    { label: 'Piscine', count: 14 },
];

// ⚠️ À REMPLACER : copie-colle ici 3 vrais avis depuis ta page Airbnb
// (Photos > Commentaires > clique sur un avis > copie le texte et le prénom)
const realReviews = [
    {
        name: 'Prénom du voyageur',
        date: 'Mois 2026',
        text: "Colle ici le texte du premier vrai avis copié depuis Airbnb.",
    },
    {
        name: 'Prénom du voyageur',
        date: 'Mois 2026',
        text: "Colle ici le texte du deuxième vrai avis copié depuis Airbnb.",
    },
    {
        name: 'Prénom du voyageur',
        date: 'Mois 2026',
        text: "Colle ici le texte du troisième vrai avis copié depuis Airbnb.",
    },
];

export default function About() {
    const navigate = useNavigate();
    useScrollAnimations();
    useHeroScrollDarken();
    usePremiumScrollAnimations();

    return (
        <div className="amsaii-home amsaii-about min-h-screen bg-[#FDFBF7]">
            {/* Navbar (identique Home) */}
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
                    src="https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=2000&q=80"
                    alt="AMSAII Marrakech"
                    className="hero-bg"
                />
                <div className="hero-overlay"></div>
                <div className="hero-content about-hero-content">
                    <h1 className="hero-title about-hero-title">À propos</h1>
                    <p className="hero-description">
                        Une collection d'appartements pensés pour un séjour serein à Marrakech, entre confort moderne et douceur de vivre.
                    </p>
                </div>
                <div className="about-hero-badge reveal-ready">
                    <div className="about-hero-badge-rating">
                        <Star className="w-4 h-4 fill-current" />
                        <span>4,87</span>
                    </div>
                    <span className="about-hero-badge-text">
                        Note moyenne sur <strong>146 avis</strong> Airbnb
                    </span>
                </div>
                <div className="scroll-down-wrapper" onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}>
                    <span>DÉFILER</span>
                </div>
            </section>

            <div className="hero-spacer" />

            {/* INTRO + 3 CARTES */}
            <section className="about-intro-section">
                <div className="about-intro-inner">
<div className="about-dashed-arrow" aria-hidden="true">
  <svg
    width="150"
    height="220"
    viewBox="0 0 150 220"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      className="about-dashed-arrow-path"
      d="M65 10
         C28 25 10 55 12 91
         C14 126 35 158 65 177
         C82 188 100 192 122 194"
      stroke="#C9C9C5"
      stroke-width="3.5"
      stroke-dasharray="13 12"
      stroke-linecap="round"
      fill="none"
    />

    <path
      className="about-dashed-arrow-head"
      d="M122 194 L103 181"
      stroke="#C9C9C5"
      stroke-width="3.5"
      stroke-linecap="round"
      stroke-linejoin="round"
    />

    <path
      className="about-dashed-arrow-head"
      d="M122 194 L108 211"
      stroke="#C9C9C5"
      stroke-width="3.5"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  </svg>
</div>

                                        <span className="about-intro-tag reveal">Intro</span>
                    <h2 className="about-intro-quote reveal">
                        Chaque appartement AMSAII est choisi pour son emplacement, aménagé avec soin, et pensé pour que Marrakech reste inoubliable
                    </h2>

<div className="about-photo-cards about-photo-cards--four reveal-stagger">
    <div className="about-photo-card">
        <div className="about-photo-card-img">
            <img src={amsaii} alt="AMSAII" />
        </div>
        <h3>Amsaï</h3>
        <p>Nom Amazigh signifiant <strong>élégance</strong> — un mot qui incarne le raffinement et l'art de recevoir à la marocaine.</p>
    </div>
    <div className="about-photo-card">
        <div className="about-photo-card-img">
            <img src="https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=600&q=80" alt="Nos logements" />
        </div>
        <h3>Nos logements</h3>
        <p>Des appartements modernes au style bohème chic, sélectionnés dans les meilleurs quartiers de la ville.</p>
    </div>
    <div className="about-photo-card">
        <div className="about-photo-card-img">
            <img src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=600&q=80" alt="Nos équipements" />
        </div>
        <h3>Nos équipements</h3>
        <p>Piscines, Wi-Fi fibre, climatisation et literie premium : le confort est le même dans chacun de nos biens.</p>
    </div>
    <div className="about-photo-card">
        <div className="about-photo-card-img">
            <img src="https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=600&q=80" alt="Notre service" />
        </div>
        <h3>Notre accueil</h3>
        <p>Check-in autonome, réponse rapide et une attention aux détails qui fait toute la différence de votre séjour.</p>
    </div>
</div>
                </div>
            </section>

            {/* PHILOSOPHY — SECTION SOMBRE */}
            <section className="about-philosophy-section">
                <div className="about-philosophy-card reveal">
                    <div className="about-philosophy-img">
                        <img src="https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=800&q=80" alt="Intérieur AMSAII" />
                    </div>
                    <div className="about-philosophy-text">
                        <span className="about-philosophy-tag">Philosophie</span>
                        <p className="about-philosophy-quote">
                            Nous croyons qu'un bon séjour commence par un logement où l'on se sent bien — c'est pourquoi chaque appartement AMSAII allie authenticité marocaine et confort actuel.
                        </p>
                    </div>
                </div>
            </section>

            {/* FEATURE ROW 1 : VIVRE */}
            <section className="features-section about-features-section">
                <div className="feature-row reveal">
                    <div className="feature-image-wrap">
                        <img src="https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=900&q=80" alt="Vivre AMSAII" />
                        <div className="feature-badge">
                            <Sparkles className="w-6 h-6" />
                        </div>
                    </div>
                    <div className="feature-content">
                        <h3 className="feature-title">Vivez Marrakech autrement</h3>
                        <p className="feature-text">
                            Un intérieur soigné où lumière naturelle et matières naturelles se répondent, pour des journées de détente comme des soirées entre proches.
                        </p>
                        <ul className="about-includes-list">
                            <li className="about-includes-label">Inclus</li>
                            {includesLiving.map((item, i) => (
                                <li key={i} className="about-includes-item">
                                    <span className="about-includes-icon">{item.icon}</span>
                                    {item.text}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* FEATURE ROW 2 : QUARTIERS */}
                <div className="feature-row feature-row--reverse reveal">
                    <div className="feature-image-wrap">
                        <img src="https://images.unsplash.com/photo-1560185893-a55cbc8c57e8?auto=format&fit=crop&w=900&q=80" alt="Quartiers Marrakech" />
                        <div className="feature-badge">
                            <MapPin className="w-6 h-6" />
                        </div>
                    </div>
                    <div className="feature-content">
                        <h3 className="feature-title">Des quartiers d'exception</h3>
                        <p className="feature-text">
                            Nos appartements sont situés à proximité de Guéliz, de la Médina et du Jardin Majorelle — pour explorer la ville sans jamais perdre en tranquillité.
                        </p>
                        <ul className="about-includes-list">
                            <li className="about-includes-label">Inclus</li>
                            {includesLocation.map((item, i) => (
                                <li key={i} className="about-includes-item">
                                    <span className="about-includes-icon">{item.icon}</span>
                                    {item.text}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </section>

            {/* HIGHLIGHT AVEC SOULIGNEMENT ANIMÉ */}
            <section className="about-highlight-section">
                <div className="about-highlight-row reveal-ready">
                    <div className="about-highlight-img">
                        <img src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=80" alt="Accueil AMSAII" />
                    </div>
                    <div className="about-highlight-content">
                        <div className="about-highlight-icon">
                            <ShieldCheck className="w-5 h-5" />
                        </div>
                        <h3 className="about-highlight-title">
                            Un accueil qui fait toute la différence à chaque séjour
                        </h3>
                        <div className="about-highlight-underline" />
                    </div>
                </div>
            </section>

            {/* AVIS AIRBNB (données réelles, lien externe) */}
            <section className="about-reviews-section">
                <div className="about-reviews-header reveal">
                    <span className="intro-tag">Avis voyageurs</span>
                    <h2 className="intro-main-title">
                        Ce que nos voyageurs disent de leur séjour
                    </h2>
                </div>

                <div className="about-reviews-score-block reveal">
                    <div className="about-reviews-score">
                        <div className="about-reviews-score-number">4,87</div>
                        <div className="about-reviews-score-stars">
                            {[...Array(5)].map((_, i) => (
                                <Star key={i} className="w-4 h-4 fill-current" />
                            ))}
                        </div>
                        <p className="about-reviews-score-count">146 avis vérifiés sur Airbnb</p>
                    </div>

                    <div className="about-reviews-categories">
                        {ratingCategories.map((cat) => (
                            <div key={cat.label} className="about-reviews-category">
                                <div className="about-reviews-category-top">
                                    <span>{cat.label}</span>
                                    <span>{cat.value}</span>
                                </div>
                                <div className="about-reviews-bar">
                                    <div
                                        className="about-reviews-bar-fill"
                                        style={{ width: `${(cat.value / 5) * 100}%` }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Thèmes réels mentionnés par les voyageurs Airbnb */}
                <div className="about-reviews-tags reveal-stagger">
                    {reviewThemes.map((theme) => (
                        <span key={theme.label} className="about-reviews-tag">
                            {theme.label} <strong>{theme.count}</strong>
                        </span>
                    ))}
                </div>

                {/* ⬇️ REMPLACE ces 3 cartes par 3 vrais avis copiés depuis ta page Airbnb */}
                <div className="about-reviews-cards reveal-stagger">
                    {realReviews.map((review, i) => (
                        <div key={i} className="about-review-card">
                            <div className="about-review-card-stars">
                                {[...Array(5)].map((_, s) => (
                                    <Star key={s} className="w-3.5 h-3.5 fill-current" />
                                ))}
                            </div>
                            <p className="about-review-card-text">"{review.text}"</p>
                            <div className="about-review-card-author">
                                <span className="about-review-card-name">{review.name}</span>
                                <span className="about-review-card-date">{review.date}</span>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="about-reviews-cta">
                     <a href={AIRBNB_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="main-cta-btn"
                   >
                        <span>Voir les 146 avis sur Airbnb</span>
                        <span className="main-cta-arrow">→</span>
                    </a>
                </div>
            </section>

            {/* CTA SOMBRE */}
            <section className="about-cta-section">
                <h2 className="about-cta-title reveal">
                    Que vous cherchiez un cocon pour deux ou un appartement pour toute la famille, AMSAII a le logement qu'il vous faut à Marrakech
                </h2>
                <div className="about-cta-images reveal-stagger">
                    <div className="about-cta-image about-cta-image--left">
                        <img src="https://images.unsplash.com/photo-1560184897-ae75f418493e?auto=format&fit=crop&w=500&q=80" alt="Salon" />
                    </div>
                    <div className="about-cta-image about-cta-image--center">
                        <img src="https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&w=500&q=80" alt="Chambre" />
                    </div>
                    <div className="about-cta-image about-cta-image--right">
                        <img src="https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=500&q=80" alt="Terrasse" />
                    </div>
                </div>
            </section>

            {/* NEWSLETTER SOMBRE */}
            <section className="about-subscribe-section">
                <div className="about-subscribe-container">
                    <div className="about-subscribe-img reveal">
                        <img src="https://images.unsplash.com/photo-1494526585123-1c3a6ce3ce3f?auto=format&fit=crop&w=800&q=80" alt="AMSAII" />
                    </div>
                    <div className="about-subscribe-content reveal">
                        <h2>Restez informé</h2>
                        <p>Recevez nos disponibilités et offres exclusives sur nos appartements à Marrakech.</p>
                        <form className="about-subscribe-form" onSubmit={(e) => e.preventDefault()}>
                            <input type="text" placeholder="Votre nom" required />
                            <input type="email" placeholder="Votre email" required />
                            <button type="submit">Rejoindre</button>
                        </form>
                    </div>
                </div>
            </section>

            {/* Footer (identique Home) */}
            <Footer />
        </div>
    );
}