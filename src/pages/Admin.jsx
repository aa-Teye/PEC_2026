import { useState, useEffect } from 'react';
import {
  Lock, Users, UserCheck, Car, Heart, Search,
  Download, FileSpreadsheet, FileText, Trash2, RefreshCw, Eye,
  CheckCircle2, XCircle, Database, MessageSquare, Send
} from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { PROGRAM_DATA, fetchAllRegistrations } from '../data/programData';
import BadgeModal from '../components/BadgeModal';

export default function Admin() {
  const [authenticated, setAuthenticated] = useState(() => {
    return sessionStorage.getItem('PEC_ADMIN_AUTH') === 'true';
  });
  const [pin, setPin] = useState('');
  const [pinError, setPinError] = useState(false);

  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dbStatus, setDbStatus] = useState({ connected: false, message: 'Checking...' });
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [transportFilter, setTransportFilter] = useState('ALL');
  const [firstTimerFilter, setFirstTimerFilter] = useState('ALL');
  const [sendingSmsFor, setSendingSmsFor] = useState(null);

  const [selectedAttendee, setSelectedAttendee] = useState(null);

  const checkDb = async () => {
    try {
      const res = await fetch('/api/init');
      if (res.ok) {
        const json = await res.json();
        if (json.status === 'connected') {
          setDbStatus({ connected: true, message: 'Neon DB Connected' });
        } else {
          setDbStatus({ connected: false, message: 'Neon Pending Connection' });
        }
      } else {
        setDbStatus({ connected: false, message: 'Local Storage Mode' });
      }
    } catch {
      setDbStatus({ connected: false, message: 'Local Storage Mode' });
    }
  };

  const loadData = async () => {
    setLoading(true);
    await checkDb();
    try {
      const list = await fetchAllRegistrations();
      setRegistrations(list);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (authenticated) {
      document.body.classList.add('full-width-page');
      loadData();
    } else {
      document.body.classList.remove('full-width-page');
    }
    return () => document.body.classList.remove('full-width-page');
  }, [authenticated]);

  const handleLogin = (e) => {
    e.preventDefault();
    const cleanPin = pin.trim();
    if (cleanPin === '2500' || cleanPin === 'admin2026' || cleanPin === 'eom2026' || cleanPin === (import.meta.env.VITE_ADMIN_PASSWORD || '2500')) {
      sessionStorage.setItem('PEC_ADMIN_AUTH', 'true');
      setAuthenticated(true);
      setPinError(false);
    } else {
      setPinError(true);
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('PEC_ADMIN_AUTH');
    setAuthenticated(false);
  };

  const handleDelete = async (reg) => {
    if (!window.confirm(`Delete registration for ${reg.fullName}?`)) return;

    try {
      await fetch(`/api/registrations?ticket_code=${reg.ticketCode}`, { method: 'DELETE' });
    } catch {}

    const updated = registrations.filter(r => r.ticketCode !== reg.ticketCode);
    setRegistrations(updated);
    localStorage.setItem('PEC_REGISTRATIONS_DATA', JSON.stringify(updated));
  };

  const handleSendSms = async (reg) => {
    setSendingSmsFor(reg.ticketCode);
    try {
      const res = await fetch('/api/send-sms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone: reg.phone,
          fullName: `${reg.title ? reg.title + ' ' : ''}${reg.fullName}`,
          ticketCode: reg.ticketCode
        })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        alert(`SMS sent successfully to ${reg.phone}!`);
      } else {
        alert(`SMS failed: ${data.error || 'Check API credentials'}`);
      }
    } catch (err) {
      alert(`SMS error: ${err.message}`);
    } finally {
      setSendingSmsFor(null);
    }
  };

  // Export to CSV
  const exportCsv = () => {
    if (registrations.length === 0) return alert('No registrations to export');

    const headers = [
      'Ticket Code', 'Title', 'Full Name', 'Phone', 'Email',
      'Gender', 'Member Status', 'First Timer',
      'Days Attending', 'Mode', 'Needs Transport', 'Location',
      'Invited By', 'Prayer Request', 'Registered At'
    ];

    const rows = registrations.map(r => [
      `"${r.ticketCode || ''}"`,
      `"${r.title || ''}"`,
      `"${(r.fullName || '').replace(/"/g, '""')}"`,
      `"${r.phone || ''}"`,
      `"${r.email || ''}"`,
      `"${r.gender || ''}"`,
      `"${r.memberStatus || ''}"`,
      `"${r.firstTimer || ''}"`,
      `"${(Array.isArray(r.attendanceDays) ? r.attendanceDays.join('; ') : r.attendanceDays || '').replace(/"/g, '""')}"`,
      `"${r.attendanceMode || ''}"`,
      `"${r.needsTransport || ''}"`,
      `"${(r.location || '').replace(/"/g, '""')}"`,
      `"${(r.invitedBy || '').replace(/"/g, '""')}"`,
      `"${(r.prayerRequest || '').replace(/"/g, '""')}"`,
      `"${r.created_at || ''}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `PEC_2026_Registrations_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Export to PDF
  const exportPdf = () => {
    if (registrations.length === 0) return alert('No registrations to export');

    const doc = new jsPDF('landscape');
    doc.setFontSize(16);
    doc.setTextColor(184, 20, 39);
    doc.text('PEC: THIS SAME JESUS — REGISTRATION ROSTER', 14, 15);
    doc.setFontSize(10);
    doc.setTextColor(80, 80, 80);
    doc.text(`Generated on ${new Date().toLocaleString()} • Total: ${registrations.length} Delegates`, 14, 22);

    const bodyData = registrations.map((r, i) => [
      i + 1,
      r.ticketCode || '-',
      `${r.title || ''} ${r.fullName || ''}`.trim(),
      r.phone || '-',
      r.memberStatus || '-',
      r.firstTimer === 'yes' ? 'Yes' : 'No',
      r.needsTransport === 'yes' ? 'Yes' : 'No',
      r.location || '-'
    ]);

    autoTable(doc, {
      startY: 28,
      head: [['#', 'Ticket Code', 'Name', 'Phone', 'Category', '1st Timer', 'Transport', 'Location']],
      body: bodyData,
      theme: 'grid',
      headStyles: { fillColor: [184, 20, 39], textColor: [255, 255, 255] },
      styles: { fontSize: 8 }
    });

    doc.save(`PEC_Registrations_Roster_${new Date().toISOString().slice(0, 10)}.pdf`);
  };

  const filtered = registrations.filter(r => {
    const term = searchTerm.toLowerCase();
    const matchSearch =
      (r.fullName || '').toLowerCase().includes(term) ||
      (r.phone || '').includes(term) ||
      (r.ticketCode || '').toLowerCase().includes(term) ||
      (r.location || '').toLowerCase().includes(term);

    const matchStatus = statusFilter === 'ALL' || r.memberStatus === statusFilter;
    const matchTransport = transportFilter === 'ALL' || r.needsTransport === transportFilter;
    const matchFirstTimer = firstTimerFilter === 'ALL' || r.firstTimer === firstTimerFilter;

    return matchSearch && matchStatus && matchTransport && matchFirstTimer;
  });

  const totalCount = registrations.length;
  const firstTimersCount = registrations.filter(r => r.firstTimer === 'yes').length;
  const transportCount = registrations.filter(r => r.needsTransport === 'yes').length;
  const membersCount = registrations.filter(r => (r.memberStatus || '').includes('Member')).length;

  if (!authenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-[#0a0103]">
        <div className="w-full max-w-sm bg-[#160408] border border-amber-500/30 rounded-3xl p-6 shadow-2xl text-center">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-tr from-amber-500 to-red-600 p-0.5 mb-4 shadow-lg shadow-red-900/50">
            <div className="w-full h-full bg-[#120306] rounded-[14px] flex items-center justify-center text-amber-400">
              <Lock size={24} />
            </div>
          </div>

          <h2 className="font-cinzel font-black text-xl text-white">PEC Admin Portal</h2>
          <p className="text-xs text-stone-400 mt-1 mb-6">
            Enter passcode to manage PEC registrations & attendance.
          </p>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <input
                type="password"
                placeholder="Enter Admin PIN"
                value={pin}
                onChange={e => setPin(e.target.value)}
                autoFocus
                className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-center text-lg tracking-widest text-white focus:outline-none focus:border-amber-400 font-mono"
              />
              {pinError && (
                <p className="text-xs text-red-400 mt-2 font-medium">
                  Invalid PIN. Please enter correct passcode (2500).
                </p>
              )}
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 text-black font-extrabold text-xs uppercase tracking-wider shadow-lg shadow-amber-500/20"
            >
              Unlock Dashboard
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#090204] text-white p-4 sm:p-6 lg:p-8">
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="font-cinzel font-black text-xl sm:text-2xl gold-gradient-text">
              PEC 2026 ADMIN
            </span>
            <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
              dbStatus.connected
                ? 'bg-emerald-500/15 border border-emerald-500/40 text-emerald-300'
                : 'bg-amber-500/15 border border-amber-500/40 text-amber-300'
            }`}>
              <Database size={10} />
              {dbStatus.message}
            </span>
          </div>
          <p className="text-xs text-stone-400">
            THIS SAME JESUS (Acts 1:11) • Registration Roster & SMS Delivery Center
          </p>
        </div>

        <div className="flex items-center gap-2 self-stretch sm:self-auto">
          <button
            onClick={loadData}
            className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-xs font-semibold"
          >
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
            <span>Sync</span>
          </button>

          <button
            onClick={exportCsv}
            className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-600/20 border border-emerald-500/40 hover:bg-emerald-600/30 text-emerald-200 text-xs font-semibold"
          >
            <FileSpreadsheet size={14} />
            <span>Excel/CSV</span>
          </button>

          <button
            onClick={exportPdf}
            className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-red-600/20 border border-red-500/40 hover:bg-red-600/30 text-red-200 text-xs font-semibold"
          >
            <FileText size={14} />
            <span>PDF Roster</span>
          </button>

          <button
            onClick={handleLogout}
            className="px-3 py-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-stone-400 hover:text-white text-xs font-semibold"
            title="Lock Portal"
          >
            <Lock size={14} />
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 my-6">
        <div className="bg-[#150407] border border-amber-500/20 rounded-2xl p-4 shadow-lg">
          <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider block">
            Total Registered
          </span>
          <span className="text-3xl font-mono font-black text-amber-300 mt-1 block">
            {totalCount}
          </span>
          <span className="text-[10px] text-stone-500 mt-1 block">Confirmed Delegates</span>
        </div>

        <div className="bg-[#150407] border border-amber-500/20 rounded-2xl p-4 shadow-lg">
          <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider block">
            First-Timers
          </span>
          <span className="text-3xl font-mono font-black text-red-400 mt-1 block">
            {firstTimersCount}
          </span>
          <span className="text-[10px] text-stone-500 mt-1 block">New Guests to Church</span>
        </div>

        <div className="bg-[#150407] border border-amber-500/20 rounded-2xl p-4 shadow-lg">
          <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider block">
            Needs Transport
          </span>
          <span className="text-3xl font-mono font-black text-amber-400 mt-1 block">
            {transportCount}
          </span>
          <span className="text-[10px] text-stone-500 mt-1 block">Bus / Ride Requests</span>
        </div>

        <div className="bg-[#150407] border border-amber-500/20 rounded-2xl p-4 shadow-lg">
          <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider block">
            Church Members
          </span>
          <span className="text-3xl font-mono font-black text-white mt-1 block">
            {membersCount}
          </span>
          <span className="text-[10px] text-stone-500 mt-1 block">Overcomers Nation</span>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-[#130306] border border-white/10 rounded-2xl p-4 mb-6 space-y-3">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3 top-3 text-stone-400" />
            <input
              type="text"
              placeholder="Search by name, phone, ticket code, or residential area..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full bg-black/40 border border-white/10 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-stone-500 focus:outline-none focus:border-amber-400"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              className="bg-black/40 border border-white/10 rounded-xl px-2.5 py-2 text-xs text-white focus:outline-none"
            >
              <option value="ALL">All Categories</option>
              <option value="Overcomers Member">Overcomers Member</option>
              <option value="Visitor / Guest">Visitor / Guest</option>
            </select>

            <select
              value={firstTimerFilter}
              onChange={e => setFirstTimerFilter(e.target.value)}
              className="bg-black/40 border border-white/10 rounded-xl px-2.5 py-2 text-xs text-white focus:outline-none"
            >
              <option value="ALL">All First-Timers</option>
              <option value="yes">First-Timers Only</option>
              <option value="no">Non-First-Timers</option>
            </select>

            <select
              value={transportFilter}
              onChange={e => setTransportFilter(e.target.value)}
              className="bg-black/40 border border-white/10 rounded-xl px-2.5 py-2 text-xs text-white focus:outline-none"
            >
              <option value="ALL">All Transport</option>
              <option value="yes">Needs Transport</option>
              <option value="no">No Transport</option>
            </select>
          </div>
        </div>

        <div className="text-xs text-stone-400">
          Showing <strong className="text-white">{filtered.length}</strong> of {registrations.length} registered delegates
        </div>
      </div>

      {/* Registrations Table */}
      <div className="bg-[#130306] border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-black/40 text-stone-400 uppercase text-[10px] tracking-wider border-b border-white/10">
              <tr>
                <th className="py-3 px-4">Delegate</th>
                <th className="py-3 px-4">Ticket</th>
                <th className="py-3 px-4">Phone</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">1st Timer</th>
                <th className="py-3 px-4">Transport</th>
                <th className="py-3 px-4">Location</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan="8" className="py-12 text-center text-stone-500 italic">
                    No delegates found matching your criteria.
                  </td>
                </tr>
              ) : (
                filtered.map((reg) => (
                  <tr key={reg.ticketCode} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-3 px-4">
                      <div className="font-bold text-white">
                        {reg.title ? `${reg.title} ` : ''}{reg.fullName}
                      </div>
                      {reg.email && <div className="text-[10px] text-stone-400">{reg.email}</div>}
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-mono font-bold text-amber-300 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded">
                        {reg.ticketCode}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-stone-300 font-mono">
                      {reg.phone}
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-[11px] text-stone-300 bg-white/5 px-2 py-0.5 rounded border border-white/10">
                        {reg.memberStatus || 'Delegate'}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      {reg.firstTimer === 'yes' ? (
                        <span className="px-2 py-0.5 bg-red-500/20 border border-red-500/40 text-red-300 rounded text-[10px] font-bold">
                          1st Timer
                        </span>
                      ) : (
                        <span className="text-stone-500 text-[10px]">No</span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      {reg.needsTransport === 'yes' ? (
                        <span className="px-2 py-0.5 bg-amber-500/20 border border-amber-500/40 text-amber-300 rounded text-[10px] font-bold flex items-center gap-1 w-fit">
                          <Car size={10} /> Yes
                        </span>
                      ) : (
                        <span className="text-stone-500 text-[10px]">No</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-stone-400">
                      {reg.location || '-'}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleSendSms(reg)}
                          disabled={sendingSmsFor === reg.ticketCode}
                          className="p-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 hover:bg-emerald-500/20 transition-colors"
                          title="Send SMS Ticket"
                        >
                          <Send size={13} className={sendingSmsFor === reg.ticketCode ? 'animate-pulse' : ''} />
                        </button>
                        <button
                          onClick={() => setSelectedAttendee(reg)}
                          className="p-1.5 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-300 hover:bg-amber-500/20 transition-colors"
                          title="View & Download Pass"
                        >
                          <Eye size={13} />
                        </button>
                        <button
                          onClick={() => handleDelete(reg)}
                          className="p-1.5 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20 transition-colors"
                          title="Delete Registration"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delegate Badge Modal */}
      {selectedAttendee && (
        <BadgeModal
          attendee={selectedAttendee}
          onClose={() => setSelectedAttendee(null)}
        />
      )}
    </div>
  );
}
