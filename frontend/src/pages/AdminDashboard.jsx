import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import amsaiiLogo from '../assets/amsaii-icon.svg';
import {
  Users,
  FileCheck2,
  Download,
  LogOut,
  Search,
  Mail,
  Phone,
  Inbox,
  TrendingUp,
  ChevronLeft,
  ChevronRight,
  Sparkle,
  Eye,
} from 'lucide-react';

const ROWS_PER_PAGE = 6;

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [guests, setGuests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const token = localStorage.getItem('amsaii_admin_token');
    if (!token) {
      navigate('/admin/login');
      return;
    }

    const fetchCheckins = async () => {
      try {
        const response = await axios.get('http://localhost:3001/checkin/all');

        const mappedData = response.data.map((guest) => {
          const rawStatus = (guest.status || '').toLowerCase();
          const isSigned =
            rawStatus.includes('sign') ||
            rawStatus.includes('signed') ||
            rawStatus.includes('ok');

          return {
            ...guest,
            fullName:
              guest.fullName ||
              `${guest.first_name || ''} ${guest.last_name || ''}`.trim(),
            status: isSigned ? 'Signé' : 'En attente',
            signedAt: guest.signed_at
              ? new Date(guest.signed_at).toLocaleString()
              : guest.signedAt || '-',
            docType: guest.document_type || null,
            frontDocUrl: guest.front_document_url || null,
            backDocUrl: guest.back_document_url || null,
          };
        });

        setGuests(mappedData);
      } catch (err) {
        console.error('Erreur lors de la récupération des données', err);
        setGuests([
          {
            id: '1',
            fullName: 'Karim Bennani',
            email: 'karim@example.com',
            phone: '+212 612 345678',
            status: 'Signé',
            signedAt: '2026-09-01 01:30',
            docType: 'CIN',
            frontDocUrl: null,
            backDocUrl: null,
          },
          {
            id: '2',
            fullName: 'Sarah Lahlou',
            email: 'sarah@example.com',
            phone: '+212 698 765432',
            status: 'En attente',
            signedAt: '-',
            docType: 'PASSPORT',
            frontDocUrl: null,
            backDocUrl: null,
          },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchCheckins();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('amsaii_admin_token');
    navigate('/admin/login');
  };

  const handleDownloadPdf = (guestId) => {
    window.open(`http://localhost:3001/checkin/download/${guestId}`, '_blank');
  };

  const handleViewDocument = (url) => {
    if (!url) return;
    window.open(url, '_blank');
  };

  const filteredGuests = useMemo(
    () =>
      guests.filter(
        (g) =>
          g.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          g.email?.toLowerCase().includes(searchTerm.toLowerCase())
      ),
    [guests, searchTerm]
  );

  const signedCount = guests.filter((g) => g.status === 'Signé').length;
  const signRate = guests.length
    ? Math.round((signedCount / guests.length) * 100)
    : 0;

  const totalPages = Math.max(1, Math.ceil(filteredGuests.length / ROWS_PER_PAGE));
  const safePage = Math.min(currentPage, totalPages);
  const paginatedGuests = filteredGuests.slice(
    (safePage - 1) * ROWS_PER_PAGE,
    safePage * ROWS_PER_PAGE
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const getInitials = (name = '') =>
    name
      .split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map((n) => n[0]?.toUpperCase())
      .join('');

  return (
    <div className="relative min-h-screen bg-[#FDFBF7] overflow-hidden">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-32 -left-24 w-[420px] h-[420px] rounded-full bg-[#C4924A]/25 blur-[110px]" />
        <div className="absolute top-1/3 -right-32 w-[480px] h-[480px] rounded-full bg-[#E8CBA0]/40 blur-[130px]" />
        <div className="absolute bottom-0 left-1/4 w-[380px] h-[380px] rounded-full bg-[#D9CBB0]/35 blur-[120px]" />
      </div>

      <div className="relative z-10 p-4 md:p-8 lg:p-12">
        <div className="max-w-7xl mx-auto bg-white/70 backdrop-blur-2xl rounded-[32px] border border-white/80 shadow-[0_20px_60px_-15px_rgba(26,26,26,0.12)] p-6 lg:p-10">
          <header className="flex justify-between items-center mb-10 pb-6 border-b border-[#E8E4DE]/70">
            <div className="flex items-center gap-4">
              <div style={{ height: 45, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <img src={amsaiiLogo} alt="AMSAII Logo" style={{ height: '100%', width: 'auto' }} />
              </div>

              <div>
                <span className="text-[11px] uppercase tracking-[0.2em] text-[#8C8C8C] font-semibold">
                  Administration
                </span>
                <h1 className="text-2xl font-serif text-[#1A1A1A] leading-tight">
                  Gestion des Check-ins
                </h1>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 text-xs uppercase tracking-wider text-[#66635D] hover:text-[#1A1A1A] hover:border-[#1A1A1A] transition-all bg-white px-4 py-2.5 rounded-full border border-[#E8E4DE] cursor-pointer"
            >
              <LogOut className="w-4 h-4" /> Déconnexion
            </button>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <StatCard
              label="Total Voyageurs"
              value={guests.length}
              icon={<Users className="w-4.5 h-4.5" />}
              accent="#1A1A1A"
            />
            <StatCard
              label="Contrats Signés"
              value={signedCount}
              icon={<FileCheck2 className="w-4.5 h-4.5" />}
              accent="#2F7A5C"
              badge={guests.length ? `${signRate}%` : null}
            />
          </div>

          <div className="bg-white/80 rounded-[24px] border border-[#E8E4DE]/70 shadow-sm overflow-hidden p-6">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
              <div>
                <h2 className="text-lg font-serif text-[#1A1A1A]">
                  Liste des Dossiers Voyageurs
                </h2>
                <p className="text-xs text-[#8C8C8C] mt-0.5">
                  {filteredGuests.length} résultat
                  {filteredGuests.length > 1 ? 's' : ''}
                </p>
              </div>
              <div className="relative w-full md:w-72">
                <Search className="absolute left-3.5 top-3 w-4 h-4 text-[#8C8C8C]" />
                <input
                  type="text"
                  placeholder="Rechercher par nom ou email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-[#FAF9F6] border border-[#E8E4DE] rounded-full pl-10 pr-4 py-2.5 text-sm text-[#1A1A1A] focus:outline-none focus:border-[#1A1A1A] transition-colors"
                />
              </div>
            </div>

            {loading ? (
              <TableSkeleton />
            ) : (
              <>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-[#E8E4DE] text-[11px] uppercase tracking-wider text-[#8C8C8C]">
                        <th className="py-3 px-4 font-medium">Voyageur</th>
                        <th className="py-3 px-4 font-medium">Contact</th>
                        <th className="py-3 px-4 font-medium">Statut Contrat</th>
                        <th className="py-3 px-4 font-medium">Documents</th>
                        <th className="py-3 px-4 font-medium">Date Signature</th>
                        <th className="py-3 px-4 font-medium text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#F0EDE6] text-sm">
                      {paginatedGuests.length === 0 ? (
                        <tr>
                          <td colSpan="6" className="text-center py-16">
                            <div className="flex flex-col items-center gap-3 text-[#A8A39A]">
                              <Inbox className="w-9 h-9" strokeWidth={1.3} />
                              <span className="text-sm">Aucun voyageur trouvé.</span>
                            </div>
                          </td>
                        </tr>
                      ) : (
                        paginatedGuests.map((guest) => (
                          <tr
                            key={guest.id}
                            className="hover:bg-[#FAF9F6] transition-colors group"
                          >
                            <td className="py-4 px-4">
                              <div className="flex items-center gap-3">
                                <div className="w-9 h-9 rounded-full bg-[#F4F1EA] flex items-center justify-center flex-shrink-0">
                                  <span className="text-xs font-semibold text-[#1A1A1A]">
                                    {getInitials(guest.fullName) || '—'}
                                  </span>
                                </div>
                                <span className="font-medium text-[#1A1A1A]">
                                  {guest.fullName}
                                </span>
                              </div>
                            </td>
                            <td className="py-4 px-4 text-[#66635D]">
                              <div className="flex items-center gap-1.5 text-[13px]">
                                <Mail className="w-3.5 h-3.5 text-[#A8A39A]" />
                                {guest.email}
                              </div>
                              <div className="flex items-center gap-1.5 text-xs text-[#8C8C8C] mt-1">
                                <Phone className="w-3 h-3 text-[#A8A39A]" />
                                {guest.phone}
                              </div>
                            </td>
                            <td className="py-4 px-4">
                              <span
                                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${
                                  guest.status === 'Signé'
                                    ? 'bg-emerald-50 text-emerald-700'
                                    : 'bg-amber-50 text-amber-700'
                                }`}
                              >
                                <FileCheck2 className="w-3 h-3" />
                                {guest.status}
                              </span>
                            </td>
                            <td className="py-4 px-4">
                              <div className="flex flex-col gap-1.5">
                                <span className="text-[11px] uppercase tracking-wide text-[#A8A39A]">
                                  {guest.docType === 'PASSPORT'
                                    ? 'Passeport'
                                    : guest.docType === 'CIN'
                                    ? 'CIN'
                                    : '—'}
                                </span>
                                <div className="flex items-center gap-1.5">
                                  <button
                                    onClick={() => handleViewDocument(guest.frontDocUrl)}
                                    disabled={!guest.frontDocUrl}
                                    className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[11px] font-medium border border-[#E8E4DE] text-[#66635D] hover:bg-[#FAF9F6] disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                                  >
                                    <Eye className="w-3 h-3" /> Recto
                                  </button>

                                  {guest.docType === 'CIN' && (
                                    <button
                                      onClick={() => handleViewDocument(guest.backDocUrl)}
                                      disabled={!guest.backDocUrl}
                                      className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[11px] font-medium border border-[#E8E4DE] text-[#66635D] hover:bg-[#FAF9F6] disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                                    >
                                      <Eye className="w-3 h-3" /> Verso
                                    </button>
                                  )}
                                </div>
                              </div>
                            </td>
                            <td className="py-4 px-4 text-[#66635D] text-xs">
                              {guest.signedAt || '-'}
                            </td>
                            <td className="py-4 px-4 text-right">
                              <button
                                onClick={() => handleDownloadPdf(guest.id)}
                                className="inline-flex items-center gap-1.5 bg-[#FAF9F6] hover:bg-[#3E2A16] text-[#1A1A1A] hover:text-white px-3.5 py-2 rounded-xl text-xs font-medium border border-[#E8E4DE] hover:border-[#3E2A16] transition-all cursor-pointer"
                              >
                                <Download className="w-3.5 h-3.5" /> PDF Signé
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>

                {filteredGuests.length > 0 && (
                  <div className="flex items-center justify-between mt-6 pt-5 border-t border-[#F0EDE6]">
                    <span className="text-xs text-[#8C8C8C]">
                      Page {safePage} sur {totalPages}
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                        disabled={safePage === 1}
                        className="w-8 h-8 flex items-center justify-center rounded-full border border-[#E8E4DE] text-[#66635D] hover:bg-[#3E2A16] hover:text-white hover:border-[#3E2A16] disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-[#66635D] disabled:cursor-not-allowed transition-all"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </button>

                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                        <button
                          key={page}
                          onClick={() => setCurrentPage(page)}
                          className={`w-8 h-8 flex items-center justify-center rounded-full text-xs font-medium transition-all ${
                            page === safePage
                              ? 'bg-[#3E2A16] text-white'
                              : 'text-[#66635D] hover:bg-[#FAF9F6] border border-[#E8E4DE]'
                          }`}
                        >
                          {page}
                        </button>
                      ))}

                      <button
                        onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                        disabled={safePage === totalPages}
                        className="w-8 h-8 flex items-center justify-center rounded-full border border-[#E8E4DE] text-[#66635D] hover:bg-[#3E2A16] hover:text-white hover:border-[#3E2A16] disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-[#66635D] disabled:cursor-not-allowed transition-all"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, icon, accent, badge }) {
  return (
    <div className="bg-white p-6 rounded-[20px] border border-[#E8E4DE] shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300">
      <div className="flex items-center justify-between mb-5">
        <span className="text-xs text-[#8C8C8C] uppercase tracking-wider">
          {label}
        </span>
        <div
          className="w-9 h-9 rounded-full flex items-center justify-center"
          style={{ backgroundColor: `${accent}14`, color: accent }}
        >
          {icon}
        </div>
      </div>
      <div className="flex items-end justify-between">
        <span className="text-3xl font-serif text-[#1A1A1A]">{value}</span>
        {badge && (
          <span className="flex items-center gap-1 text-xs font-medium text-emerald-700 bg-emerald-50 px-2 py-1 rounded-full mb-1">
            <TrendingUp className="w-3 h-3" /> {badge}
          </span>
        )}
      </div>
    </div>
  );
}

function TableSkeleton() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 5 }).map((_, i) => (
        <div
          key={i}
          className="h-14 rounded-xl bg-[#FAF9F6] animate-pulse border border-[#F0EDE6]"
        />
      ))}
    </div>
  );
}