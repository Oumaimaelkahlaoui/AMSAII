import React, { useRef, useState, useEffect } from 'react';
import { useNavigate ,Link } from 'react-router-dom';
import axios from 'axios';
import { RotateCcw, ArrowRight, Check, FileText, ExternalLink } from 'lucide-react';
import amsaiiLogo from '../assets/amsaii-logo.svg';
export default function Contract() {
  const navigate = useNavigate();
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [isEmpty, setIsEmpty] = useState(true);
  const [loading, setLoading] = useState(false);
  const guestData = JSON.parse(localStorage.getItem('amsaii_guest') || '{}');

  const pdfUrl = '/contrat-location-amsaii.pdf'; 

  // Initialisation du contexte 2D du canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      const ctx = canvas.getContext('2d');
      ctx.strokeStyle = '#1A1A1A';
      ctx.lineWidth = 2.5;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
    }
  }, []);

  const startDrawing = (e) => {
    e.preventDefault();
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;

    setIsDrawing(true);
    setIsEmpty(false);
    ctx.beginPath();
    ctx.moveTo(clientX - rect.left, clientY - rect.top);
  };

  const draw = (e) => {
    if (!isDrawing) return;
    e.preventDefault();
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;

    ctx.lineTo(clientX - rect.left, clientY - rect.top);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const handleClear = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setIsEmpty(true);
  };

  const handleOpenPdf = () => {
    window.open(pdfUrl, '_blank');
  };

  const handleSignAndSubmit = async () => {
    if (isEmpty) {
      alert("Veuillez apposer votre signature dans le cadre avant de valider.");
      return;
    }

    setLoading(true);
    const canvas = canvasRef.current;
    const signatureDataUrl = canvas.toDataURL('image/png');

    try {
   await axios.post('http://localhost:3001/checkin/sign-pdf', {
        email: guestData.email,
        guestId: guestData.id || 'guest_default',
        signature: signatureDataUrl
      });

      navigate('/check-in/confirmation');
    } catch (err) {
      console.error("Erreur lors de la validation du contrat", err);
      alert("Erreur lors de l'enregistrement de la signature dans le PDF.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="amsaii-upload">
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
        <div className="checkin-progress">
          <div className="step-item completed">
            <div className="step-circle"><Check className="w-4 h-4"/></div>
            <span className="step-label">Informations</span>
          </div>
          <div className="step-line completed"></div>
          
          <div className="step-item completed">
            <div className="step-circle"><Check className="w-4 h-4"/></div>
            <span className="step-label">Documents</span>
          </div>
          <div className="step-line completed"></div>

          <div className="step-item active">
            <div className="step-circle">3</div>
            <span className="step-label">Contrat</span>
          </div>
        </div>

        <div className="checkin-card">
          <div className="checkin-card-header">
            <span className="checkin-tag">Étape 3 sur 3</span>
            <h1 className="checkin-card-title">Contrat de Location</h1>
            <p className="checkin-card-subtitle">AMSAII - Marrakech</p>
          </div>

          <div className="upload-group mb-6">
            <label className="checkin-label">1. Consulter le document officiel</label>
            <button
              type="button"
              onClick={handleOpenPdf}
              className="w-full bg-[#FAF9F6] border-2 border-dashed border-[#E8E4DE] hover:border-[#1A1A1A] hover:bg-[#FFFFFF] rounded-[20px] p-4 flex items-center justify-between transition-all cursor-pointer group"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#F0EDE6] flex items-center justify-center text-[#1A1A1A] group-hover:bg-[#1A1A1A] group-hover:text-white transition-colors">
                  <FileText className="w-5 h-5"/>
                </div>
                <div className="text-left">
                  <span className="text-sm font-semibold text-[#1A1A1A] block">Ouvrir le contrat PDF</span>
                  <span className="text-xs text-[#8C8C8C] font-light">Lecture obligatoire avant signature</span>
                </div>
              </div>
              <ExternalLink className="w-4 h-4 text-[#8C8C8C] group-hover:text-[#1A1A1A] transition-colors"/>
            </button>
          </div>

          <div className="upload-group mb-6">
            <div className="flex justify-between items-center mb-2">
              <label className="checkin-label mb-0">2. Votre Signature</label>
              <button 
                type="button" 
                onClick={handleClear} 
                className="text-xs text-[#66635D] flex items-center gap-1 hover:text-[#1A1A1A] transition-colors bg-transparent border-none cursor-pointer"
              >
                <RotateCcw className="w-3 h-3"/> Effacer
              </button>
            </div>
            
            <div className="border border-[#E8E4DE] rounded-[16px] overflow-hidden bg-[#FAF9F6]">
              <canvas
                ref={canvasRef}
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseLeave={stopDrawing}
                onTouchStart={startDrawing}
                onTouchMove={draw}
                onTouchEnd={stopDrawing}
                className="w-full h-36 cursor-crosshair block touch-none"
              />
            </div>
            <span className="text-[10px] text-[#B5B0A6] mt-1.5 block text-center font-light">
              Signez dans le cadre ci-dessus avec votre doigt ou votre souris.
            </span>
          </div>

          <button 
            type="button"
            onClick={handleSignAndSubmit}
            disabled={loading}
            className="checkin-btn"
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <div className="upload-spinner"></div>
                <span>Signature et génération du PDF...</span>
              </div>
            ) : (
              <>
                <span>Valider et signer le contrat</span>
                <ArrowRight className="w-4 h-4"/>
              </>
            )}
          </button>
        </div>
      </main>
    </div>
  );
}