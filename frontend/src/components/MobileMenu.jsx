import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import amsaiiLogo from '../assets/amsaii-logo.svg';

/**
 * Menu burger mobile réutilisable.
 * S'affiche uniquement sur petits écrans (voir .burger-btn en CSS,
 * caché au-dessus de 968px comme .nav-links).
 *
 * Usage :
 * <MobileMenu
 *   links={[
 *     { href: '#home', label: 'Accueil' },
 *     { href: '/about', label: 'À propos' },
 *     { href: '/contact', label: 'Contact' },
 *   ]}
 *   ctaLabel="Check-in"
 *   onCtaClick={() => navigate('/check-in')}
 * />
 */
export default function MobileMenu({ links = [], ctaLabel, onCtaClick }) {
    const [isOpen, setIsOpen] = useState(false);

    // Empêche le scroll de fond quand le menu est ouvert
    useEffect(() => {
        document.body.style.overflow = isOpen ? 'hidden' : '';
        return () => {
            document.body.style.overflow = '';
        };
    }, [isOpen]);

    // Ferme le menu si on repasse en desktop (resize)
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth > 968) setIsOpen(false);
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <>
            <button
                className="burger-btn"
                onClick={() => setIsOpen(true)}
                aria-label="Ouvrir le menu"
                aria-expanded={isOpen}
            >
                <Menu className="w-6 h-6" />
            </button>

            <div
                className={`mobile-menu-overlay ${isOpen ? 'is-open' : ''}`}
                role="dialog"
                aria-modal="true"
            >
                <div className="mobile-menu-header">
                    <Link to="/" className="mobile-menu-logo-link" onClick={() => setIsOpen(false)}>
                        <img src={amsaiiLogo} alt="AMSAII" className="mobile-menu-logo-img" />
                    </Link>
                    <button
                        className="mobile-menu-close"
                        onClick={() => setIsOpen(false)}
                        aria-label="Fermer le menu"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <nav className="mobile-menu-links">
                    {links.map((link, i) => (
                        <a
                            key={link.href}
                            href={link.href}
                            className="mobile-menu-link"
                            style={{ transitionDelay: `${0.05 + i * 0.05}s` }}
                            onClick={() => setIsOpen(false)}
                        >
                            {link.label}
                        </a>
                    ))}
                </nav>

                {ctaLabel && (
                    <button
                        className="mobile-menu-cta"
                        onClick={() => {
                            setIsOpen(false);
                            onCtaClick?.();
                        }}
                    >
                        {ctaLabel}
                    </button>
                )}
            </div>
        </>
    );
}