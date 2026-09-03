import React, { useState } from 'react';
import { useNavigate,Link  } from 'react-router-dom';
import axios from 'axios'; // <-- AJOUTER CET IMPORT
import { User, Mail, Phone, ArrowRight } from 'lucide-react';
import amsaiiLogo from '../assets/amsaii-logo.svg';

export default function CheckIn() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };


 const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Appel au backend pour insérer le check-in et récupérer l'ID généré
      const response = await axios.post('http://localhost:3001/checkin/init', formData);
      
      // Stockage des données avec l'ID réel renvoyé par Supabase
      localStorage.setItem('amsaii_guest', JSON.stringify({
        ...formData,
        id: response.data.id || response.data.guestId
      }));

      navigate('/check-in/document-upload');
    } catch (err) {
      console.error("Erreur lors de l'initialisation du check-in", err);
      alert("Erreur lors de l'enregistrement de vos informations.");
    }
  };
  return (
    <div className="amsaii-checkin">
      {/* Header fixe */}
      <header className="checkin-header">
        <button onClick={() => navigate(-1)} className="checkin-back">
          <ArrowRight className="w-4 h-4 rotate-180" />
          <span>Retour</span>
        </button>
        <div >
  <Link to="/"  >
        <img src={amsaiiLogo} alt="AMSAII" style={{ height: 120 }} />
    </Link>        </div>
        <div style={{ width: 80 }} />
      </header>

      <main className="checkin-main">
        {/* Indicateur de progression */}
        <div className="checkin-progress">
          <div className="step-item active">
            <div className="step-circle">1</div>
            <span className="step-label">Infos</span>
          </div>
          <div className="step-line" />
          <div className="step-item pending">
            <div className="step-circle">2</div>
            <span className="step-label">Documents</span>
          </div>
          <div className="step-line" />
          <div className="step-item pending">
            <div className="step-circle">3</div>
            <span className="step-label">Validation</span>
          </div>
        </div>

        {/* Carte formulaire */}
        <div className="checkin-card">
          <div className="checkin-card-header">
            <span className="checkin-tag">Étape 1 sur 3</span>
            <h1 className="checkin-card-title">Vos Informations</h1>
            <p className="checkin-card-subtitle">
              Veuillez renseigner vos coordonnées pour préparer votre séjour à Marrakech.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="checkin-form">
            <div className="checkin-form-group">
              <label className="checkin-label">Prénom</label>
              <div className="checkin-input-wrap">
                <User className="checkin-input-icon" />
                <input
                  type="text"
                  name="firstName"
                  required
                  value={formData.firstName}
                  onChange={handleChange}
                  placeholder="Prénom "
                  className="checkin-input"
                />
              </div>
            </div>

            <div className="checkin-form-group">
              <label className="checkin-label">Nom</label>
              <div className="checkin-input-wrap">
                <User className="checkin-input-icon" />
                <input
                  type="text"
                  name="lastName"
                  required
                  value={formData.lastName}
                  onChange={handleChange}
                  placeholder="Nom"
                  className="checkin-input"
                />
              </div>
            </div>

            <div className="checkin-form-group">
              <label className="checkin-label">Email</label>
              <div className="checkin-input-wrap">
                <Mail className="checkin-input-icon" />
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Email@example.com"
                  className="checkin-input"
                />
              </div>
            </div>

            <div className="checkin-form-group">
              <label className="checkin-label">Téléphone</label>
              <div className="checkin-input-wrap">
                <Phone className="checkin-input-icon" />
                <input
                  type="tel"
                  name="phone"
                  required
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+212 6 00 00 00 00"
                  className="checkin-input"
                />
              </div>
            </div>

            <button type="submit" className="checkin-btn">
              <span>Continuer vers les documents</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <p className="checkin-footer-note">
              Vos données sont sécurisées et ne seront utilisées que pour votre check-in.
              <br />
              Une question ? <a href="/contact">Contactez-nous</a>
            </p>
          </form>
        </div>
      </main>
    </div>
  );
}