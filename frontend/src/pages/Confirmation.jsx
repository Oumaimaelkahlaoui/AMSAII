import React from 'react';
import { useNavigate,Link  } from 'react-router-dom';
import { Check, Home, CheckCircle2 } from 'lucide-react';
import amsaiiLogo from '../assets/amsaii-logo.svg';
import { ArrowRight } from 'lucide-react';
export default function Confirmation() {
  const navigate = useNavigate();

  return (
    <div className="amsaii-upload">
<header className="checkin-header">
  <button onClick={() => navigate('/')} className="checkin-back">
    <ArrowRight className="w-4 h-4 rotate-180" />
    <span>Accueil</span>
  </button>

  <div>
    <Link to="/" >
        <img src={amsaiiLogo} alt="AMSAII" style={{ height: 120 }} />
    </Link>
  </div>

  <div style={{ width: 80 }} />
</header>
      

      <main className="checkin-main">
        {/* Barre de progression complète */}
        <div className="checkin-progress">
          <div className="step-item completed">
            <div className="step-circle"><Check className="w-4 h-4" /></div>
            <span className="step-label">Informations</span>
          </div>
          <div className="step-line completed"></div>
          
          <div className="step-item completed">
            <div className="step-circle"><Check className="w-4 h-4" /></div>
            <span className="step-label">Documents</span>
          </div>
          <div className="step-line completed"></div>

          <div className="step-item completed">
            <div className="step-circle"><Check className="w-4 h-4" /></div>
            <span className="step-label">Contrat</span>
          </div>
        </div>

        {/* Carte principale de confirmation */}
        <div className="checkin-card text-center">
          <div className="w-16 h-16 bg-[#F0EDE6] rounded-full flex items-center justify-center mx-auto mb-6 text-[#1A1A1A]">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <span className="checkin-tag">Terminé avec succès</span>
          <h1 className="checkin-card-title mb-3">Excellent Séjour !</h1>
          <p className="checkin-card-subtitle mb-8 leading-relaxed">
            Vos informations, vos pièces justificatives et votre contrat signé ont bien été transmis et enregistrés. Profitez pleinement de votre séjour à Marrakech chez AMSAII.
          </p>

          <button 
            type="button"
            onClick={() => navigate('/')}
            className="checkin-btn flex items-center justify-center gap-2"
          >
            <Home className="w-4 h-4" />
            <span>Retour à l'accueil</span>
          </button>
        </div>
      </main>
    </div>
  );
}