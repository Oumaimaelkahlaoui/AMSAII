import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import amsaiiLogo from '../assets/amsaii-logo.svg';

function Footer() {
  return (
   <footer className="amsaii-home">
  <div className="footer-cabin-section">
    <div className="footer-cabin-container">

      <div className="footer-left-col">
        <Link to="/" className="footer-brand">
          <img
            src={amsaiiLogo}
            alt="AMSAII"
            className="footer-brand-logo"
          />
        </Link>

        <h2 className="footer-huge-title">
          Contactez-nous
        </h2>

        <p className="footer-desc">
          Évadez-vous dans un havre de tranquillité avec notre logement
          chaleureux, niché au cœur de la nature, idéal pour ceux qui
          recherchent calme, confort et sérénité.
        </p>
      </div>

      <div className="footer-arrow-decoration">
        <svg
          width="240"
          height="120"
          viewBox="0 0 240 120"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M10 95
               C 40 105, 70 100, 85 75
               C 95 58, 85 42, 65 45
               C 48 48, 42 65, 58 78
               C 78 93, 105 88, 130 68
               C 155 48, 180 32, 210 15"
            stroke="rgba(255, 255, 255, 0.9)"
            strokeWidth="3"
            strokeDasharray="9 8"
            strokeLinecap="round"
            fill="none"
          />

          <path
            d="M210 15 L188 12 M210 15 L204 36"
            stroke="rgba(255, 255, 255, 0.9)"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      <div className="footer-right-columns">

        <div className="footer-nav-group">
          <h4 className="footer-group-title">Entreprise</h4>

          <ul className="footer-links-list">
            <li>
              <a href="/" className="footer-link active">
                Accueil
              </a>
            </li>

            <li>
              <a href="/about" className="footer-link">
                À propos de nous
              </a>
            </li>

            <li>
              <a href="/contact" className="footer-link">
                Contactez-nous
              </a>
            </li>
          </ul>
        </div>

        <div className="footer-nav-group">
          <h4 className="footer-group-title">Réseaux sociaux</h4>

          <ul className="footer-links-list">
            <li>
              <a href="#" className="footer-link">
                Instagram
              </a>
            </li>
          </ul>
        </div>

      </div>

    </div>
  </div>
</footer>
  );
}

export default Footer;