import React, { useState } from 'react';
import { useNavigate,Link} from 'react-router-dom';
import axios from 'axios';
import { Upload, X, ArrowRight } from 'lucide-react';
import amsaiiLogo from '../assets/amsaii-logo.svg';

export default function DocumentUpload() {
  const navigate = useNavigate();
  const [docType, setDocType] = useState('cin');
  const [frontFile, setFrontFile] = useState(null);
  const [backFile, setBackFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e, side) => {
    const file = e.target.files[0];
    if (side === 'front') setFrontFile(file);
    else setBackFile(file);
  };

  const removeFile = (side) => {
    if (side === 'front') setFrontFile(null);
    else setBackFile(null);
  };


const handleUpload = async (e) => {
  e.preventDefault();
  if (!frontFile || (docType === 'cin' && !backFile)) return;

  let guestData = JSON.parse(localStorage.getItem('amsaii_guest') || '{}');
  if (!guestData.id) {
    guestData.id = crypto.randomUUID ? crypto.randomUUID() : 'temp-' + Date.now();
    localStorage.setItem('amsaii_guest', JSON.stringify(guestData));
  }

  setLoading(true);
  try {
    const formData = new FormData();
    formData.append('guestId', guestData.id);
    formData.append('docType', docType);
    formData.append('front', frontFile);
    if (docType === 'cin' && backFile) formData.append('back', backFile);

    await axios.post('http://localhost:3001/checkin/upload', formData);
    navigate('/check-in/contract');
  } catch (err) {
    console.error("Erreur lors de l'envoi des documents", err.response?.data || err.message);
    navigate('/check-in/contract');
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
            <div className="step-circle">✓</div>
            <span className="step-label">Infos</span>
          </div>
          <div className="step-line completed" />
          <div className="step-item active">
            <div className="step-circle">2</div>
            <span className="step-label">Documents</span>
          </div>
          <div className="step-line" />
          <div className="step-item pending">
            <div className="step-circle">3</div>
            <span className="step-label">Validation</span>
          </div>
        </div>

        <div className="checkin-card">
          <div className="checkin-card-header">
            <span className="checkin-tag">Étape 2 sur 3</span>
            <h1 className="checkin-card-title">Pièce d'Identité</h1>
            <p className="checkin-card-subtitle">
              Photographiez ou importez votre document officiel pour finaliser votre check-in.
            </p>
          </div>

          <div className="upload-toggle">
            <button
              type="button"
              onClick={() => { setDocType('cin'); setFrontFile(null); setBackFile(null); }}
              className={`toggle-btn ${docType === 'cin' ? 'active' : ''}`}
            >
              Carte Nationale (CIN)
            </button>
            <button
              type="button"
              onClick={() => { setDocType('passport'); setFrontFile(null); setBackFile(null); }}
              className={`toggle-btn ${docType === 'passport' ? 'active' : ''}`}
            >
              Passeport
            </button>
          </div>

          <form onSubmit={handleUpload}>
            <div className="upload-group">
              <label className="checkin-label">
                {docType === 'cin' ? 'CIN : Recto' : "Passeport : Page d'identité"}
              </label>
              <label className={`upload-zone ${frontFile ? 'has-file' : ''}`}>
                {frontFile ? (
                  <>
                    <div className="upload-file-preview">
                      <span className="upload-file-name">{frontFile.name}</span>
                      <span className="upload-file-size">
                        {(frontFile.size / 1024 / 1024).toFixed(1)} MB
                      </span>
                    </div>
                    <button
                      type="button"
                      className="upload-file-remove"
                      onClick={(e) => { e.preventDefault(); removeFile('front'); }}
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </>
                ) : (
                  <>
                    <Upload className="upload-zone-icon" />
                    <span className="upload-zone-text">Appuyez pour importer</span>
                    <span className="upload-zone-hint">JPG, PNG ou PDF — max 10 Mo</span>
                  </>
                )}
                <input
                  type="file"
                  accept="image/*,application/pdf"
                  required
                  onChange={(e) => handleFileChange(e, 'front')}
                  className="hidden"
                />
              </label>
            </div>

            {docType === 'cin' && (
              <div className="upload-group">
                <label className="checkin-label">CIN : Verso</label>
                <label className={`upload-zone ${backFile ? 'has-file' : ''}`}>
                  {backFile ? (
                    <>
                      <div className="upload-file-preview">
                        <span className="upload-file-name">{backFile.name}</span>
                        <span className="upload-file-size">
                          {(backFile.size / 1024 / 1024).toFixed(1)} MB
                        </span>
                      </div>
                      <button
                        type="button"
                        className="upload-file-remove"
                        onClick={(e) => { e.preventDefault(); removeFile('back'); }}
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </>
                  ) : (
                    <>
                      <Upload className="upload-zone-icon" />
                      <span className="upload-zone-text">Appuyez pour importer le verso</span>
                      <span className="upload-zone-hint">JPG, PNG ou PDF — max 10 Mo</span>
                    </>
                  )}
                  <input
                    type="file"
                    accept="image/*,application/pdf"
                    required
                    onChange={(e) => handleFileChange(e, 'back')}
                    className="hidden"
                  />
                </label>
              </div>
            )}

            <button type="submit" disabled={loading} className="checkin-btn">
              {loading ? (
                <>
                  <span className="upload-spinner" />
                  <span>Envoi sécurisé...</span>
                </>
              ) : (
                <>
                  <span>Continuer vers le contrat</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            <p className="checkin-footer-note">
              Vos documents sont chiffrés et stockés de manière sécurisée.
              <br />
              Une question ? <a href="/contact">Contactez-nous</a>
            </p>
          </form>
        </div>
      </main>
    </div>
  );
}