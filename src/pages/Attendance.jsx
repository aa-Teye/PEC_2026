import { useState, useEffect, useRef } from 'react';
import {
  UserCheck, Search, CheckCircle2, AlertCircle, Clock,
  Calendar, RefreshCw, User, ArrowRight, Lock, X, Undo2, Baby
} from 'lucide-react';
import { DAYS_OF_CONVENTION, checkInAttendee, searchAttendees, undoCheckIn } from '../data/programData';

const AUTH_KEY = 'PEC_ATTENDANCE_AUTH';

export default function Attendance() {
  const [authenticated, setAuthenticated] = useState(() => {
    return sessionStorage.getItem(AUTH_KEY) === 'true';
  });
  const [pin, setPin] = useState('');
  const [pinError, setPinError] = useState(false);

  const [selectedDay, setSelectedDay] = useState(DAYS_OF_CONVENTION[0]?.id || 'Day 1: Mon 23 Nov');
  const [searchInput, setSearchInput] = useState('');
  const [candidates, setCandidates] = useState([]);
  const [searching, setSearching] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [confirming, setConfirming] = useState(false);
  const [undoingKey, setUndoingKey] = useState(null);
  const [result, setResult] = useState(null);
  const [recentLogs, setRecentLogs] = useState([]);
  const [stats, setStats] = useState({ totalChecked: 0, dayChecked: 0 });
  const debounceRef = useRef(null);

  const handleLogin = (e) => {
    e.preventDefault();
    const cleanPin = pin.trim();
    if (cleanPin === '2500' || cleanPin === (import.meta.env.VITE_ADMIN_PASSWORD || '2500')) {
      sessionStorage.setItem(AUTH_KEY, 'true');
      setAuthenticated(true);
      setPinError(false);
    } else {
      setPinError(true);
    }
  };

  const loadData = async () => {
    try {
      const res = await fetch(`/api/attendance?day=${encodeURIComponent(selectedDay)}`);
      if (res.ok) {
        const json = await res.json();
        setRecentLogs(json.logs || []);
        const totalChecked = json.summary?.reduce((acc, curr) => acc + Number(curr.count), 0) || 0;
        const dayItem = json.summary?.find(s => s.day_label === selectedDay);
        setStats({
          totalChecked,
          dayChecked: Number(dayItem?.count || (json.logs?.length || 0))
        });
      }
    } catch {
      const localLogs = JSON.parse(localStorage.getItem('PEC_ATTENDANCE_DATA') || '[]');
      const dayLogs = localLogs.filter(l => l.day_label === selectedDay);
      setRecentLogs(dayLogs);
      setStats({
        totalChecked: localLogs.length,
        dayChecked: dayLogs.length
      });
    }
  };

  useEffect(() => {
    if (authenticated) loadData();
  }, [selectedDay, authenticated]);

  // Live search-as-you-type: matches phone, first name, surname or ticket code together
  useEffect(() => {
    if (!authenticated) return;
    if (debounceRef.current) clearTimeout(debounceRef.current);

    const term = searchInput.trim();
    if (term.length < 2) {
      setCandidates([]);
      return;
    }

    debounceRef.current = setTimeout(async () => {
      setSearching(true);
      try {
        const results = await searchAttendees({ term, dayLabel: selectedDay });
        setCandidates(results);
      } finally {
        setSearching(false);
      }
    }, 300);

    return () => clearTimeout(debounceRef.current);
  }, [searchInput, selectedDay, authenticated]);

  const handlePickCandidate = (candidate) => {
    setSelectedCandidate(candidate);
    setCandidates([]);
    setResult(null);
  };

  const handleCancelSelection = () => {
    setSelectedCandidate(null);
    setSearchInput('');
  };

  const handleConfirmCheckIn = async () => {
    if (!selectedCandidate) return;
    setConfirming(true);
    try {
      const res = await checkInAttendee({ ticketCode: selectedCandidate.ticketCode, dayLabel: selectedDay });
      setResult({ ...res, ticketCode: selectedCandidate.ticketCode, dayLabel: selectedDay });
      setSelectedCandidate(null);
      setSearchInput('');
      loadData();
    } catch (err) {
      setResult({ success: false, error: err.message });
    } finally {
      setConfirming(false);
    }
  };

  const handleUndo = async (ticketCode, dayLabel) => {
    const key = `${ticketCode}|${dayLabel}`;
    setUndoingKey(key);
    try {
      await undoCheckIn({ ticketCode, dayLabel });
      if (result?.ticketCode === ticketCode && result?.dayLabel === dayLabel) {
        setResult(null);
      }
      loadData();
    } finally {
      setUndoingKey(null);
    }
  };

  if (!authenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-[#0a0103] text-white">
        <div className="w-full max-w-sm bg-[#160408] border border-amber-500/30 rounded-3xl p-6 shadow-2xl text-center">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-tr from-amber-500 to-red-600 p-0.5 mb-4 shadow-lg shadow-red-900/50">
            <div className="w-full h-full bg-[#120306] rounded-[14px] flex items-center justify-center text-amber-400">
              <Lock size={24} />
            </div>
          </div>

          <h2 className="font-cinzel font-black text-xl text-white">Usher Check-In Access</h2>
          <p className="text-xs text-stone-400 mt-1 mb-6">
            Enter staff PIN to open the attendance terminal.
          </p>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <input
                type="password"
                placeholder="Enter Staff PIN"
                value={pin}
                onChange={e => setPin(e.target.value)}
                autoFocus
                className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-center text-lg tracking-widest text-white focus:outline-none focus:border-amber-400 font-mono"
              />
              {pinError && (
                <p className="text-xs text-red-400 mt-2 font-medium">
                  Invalid PIN. Please enter the correct passcode.
                </p>
              )}
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 text-black font-extrabold text-xs uppercase tracking-wider shadow-lg shadow-amber-500/20"
            >
              Unlock Terminal
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 pb-24 text-white">
      {/* Header */}
      <div className="px-4 pt-6 pb-4 bg-gradient-to-b from-[#25050b] to-[#0e0205] border-b border-amber-500/20 text-center">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold uppercase tracking-wider mb-2">
          <UserCheck size={12} className="text-amber-400" />
          <span>Live Check-In Terminal</span>
        </div>
        <h1 className="font-cinzel font-black text-2xl tracking-wide gold-gradient-text uppercase">
          ATTENDANCE VERIFICATION
        </h1>
        <p className="text-xs text-stone-300 max-w-xs mx-auto mt-1">
          Search by phone, first name or surname — matching delegates appear instantly.
        </p>
      </div>

      <div className="p-4 space-y-4">
        {/* Day Selector */}
        <div className="bg-[#150407] border border-amber-500/20 rounded-2xl p-3.5">
          <label className="block text-[11px] font-bold text-amber-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <Calendar size={13} /> Active Conference Day
          </label>
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
            {DAYS_OF_CONVENTION.map((d) => (
              <button
                key={d.id}
                type="button"
                onClick={() => { setSelectedDay(d.id); setResult(null); setSelectedCandidate(null); }}
                className={`px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all border ${
                  selectedDay === d.id
                    ? 'bg-amber-500 text-black border-amber-400 shadow-md shadow-amber-500/30'
                    : 'bg-black/40 text-stone-300 border-white/10 hover:border-amber-500/30'
                }`}
              >
                {d.label}
              </button>
            ))}
          </div>
        </div>

        {/* Live Counters */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-[#150407] border border-white/10 rounded-2xl p-3.5 text-center">
            <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">
              Checked In ({selectedDay.split(':')[0]})
            </span>
            <span className="text-2xl font-mono font-black text-amber-300 mt-0.5 block">
              {stats.dayChecked}
            </span>
          </div>

          <div className="bg-[#150407] border border-white/10 rounded-2xl p-3.5 text-center">
            <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">
              Total Check-Ins
            </span>
            <span className="text-2xl font-mono font-black text-white mt-0.5 block">
              {stats.totalChecked}
            </span>
          </div>
        </div>

        {/* Search / Scan Box */}
        <div className="bg-gradient-to-br from-[#1c050a] to-[#120306] border border-amber-500/30 rounded-2xl p-4 shadow-xl">
          <h2 className="text-xs font-bold text-white uppercase tracking-wider mb-3 flex items-center gap-1.5">
            <Search size={14} className="text-amber-400" /> Search Phone, First Name or Surname
          </h2>

          <div className="relative">
            <input
              type="text"
              placeholder="e.g. Kwame, Mensah or 0244123456"
              value={searchInput}
              onChange={e => setSearchInput(e.target.value)}
              autoFocus
              disabled={Boolean(selectedCandidate)}
              className="w-full bg-black/60 border border-amber-500/40 rounded-xl px-4 py-3.5 text-sm text-white placeholder-stone-500 focus:outline-none focus:border-amber-400 font-mono tracking-wider disabled:opacity-40"
            />
            {searching && (
              <RefreshCw size={16} className="absolute right-4 top-4 text-amber-400 animate-spin" />
            )}
          </div>

          {/* Live candidate results */}
          {candidates.length > 0 && !selectedCandidate && (
            <div className="mt-2 space-y-1.5 max-h-64 overflow-y-auto pr-1">
              {candidates.map((c) => (
                <button
                  key={c.ticketCode}
                  type="button"
                  onClick={() => handlePickCandidate(c)}
                  className="w-full flex items-center justify-between gap-2 bg-black/40 hover:bg-amber-500/10 border border-white/10 hover:border-amber-500/40 rounded-xl p-2.5 text-left transition-all"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <div className="w-8 h-8 rounded-full bg-amber-500/20 text-amber-300 flex items-center justify-center font-bold text-xs shrink-0">
                      {(c.fullName || 'D')[0]}
                    </div>
                    <div className="min-w-0">
                      <p className="font-bold text-white text-xs leading-tight truncate flex items-center gap-1.5">
                        {c.title ? `${c.title} ` : ''}{c.fullName}
                        {c.attendeeType === 'Child' && (
                          <span className="inline-flex items-center gap-0.5 text-[9px] font-bold text-sky-300 bg-sky-500/10 border border-sky-500/30 px-1.5 py-0.5 rounded-full shrink-0">
                      <p className="font-bold text-white text-xs leading-tight truncate">{c.title ? `${c.title} ` : ''}{c.fullName}</p>
                      <p className="text-[10px] text-stone-400 font-mono">{c.phone} • <span className="text-amber-400">{c.ticketCode}</span></p>
                    </div>
                  </div>
                  {c.checkedInToday ? (
                    <span className="text-[9px] font-bold text-amber-300 bg-amber-500/10 border border-amber-500/30 px-2 py-1 rounded-md shrink-0">CHECKED IN</span>
                  ) : (
                    <ArrowRight size={14} className="text-stone-500 shrink-0" />
                  )}
                </button>
              ))}
            </div>
          )}

          {searchInput.trim().length >= 2 && !searching && candidates.length === 0 && !selectedCandidate && (
            <p className="text-xs text-stone-500 mt-3 text-center italic">No matching delegate found.</p>
          )}

          {/* Confirmation panel for the tapped candidate */}
          {selectedCandidate && (
            <div className="mt-4 p-4 rounded-xl border border-amber-500/40 bg-amber-500/10">
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <User size={18} className="text-amber-300 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-sm text-white">
                      {selectedCandidate.title ? `${selectedCandidate.title} ` : ''}{selectedCandidate.fullName}
                    </p>
                    <p className="text-xs text-stone-300 mt-0.5">{selectedCandidate.phone} &bull; {selectedCandidate.memberStatus}</p>
                    <p className="text-[10px] font-mono text-amber-300 mt-0.5">{selectedCandidate.ticketCode}</p>
                  </div>
                </div>
                <button onClick={handleCancelSelection} className="text-stone-400 hover:text-white p-1" title="Cancel">
                  <X size={16} />
                </button>
              </div>

              {selectedCandidate.checkedInToday ? (
                <div className="mt-3 flex items-center justify-between gap-2">
                  <p className="text-xs text-amber-200">Already checked in for {selectedDay}.</p>
                  <button
                    onClick={() => handleUndo(selectedCandidate.ticketCode, selectedDay)}
                    disabled={undoingKey === `${selectedCandidate.ticketCode}|${selectedDay}`}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-red-600/20 border border-red-500/40 hover:bg-red-600/30 text-red-200 text-xs font-bold disabled:opacity-40"
                  >
                    <Undo2 size={13} /> Undo
                  </button>
                </div>
              ) : (
                <button
                  onClick={handleConfirmCheckIn}
                  disabled={confirming}
                  className="mt-3 w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-40 text-black font-extrabold text-xs uppercase tracking-wider flex items-center justify-center gap-2"
                >
                  {confirming ? <RefreshCw size={14} className="animate-spin" /> : <CheckCircle2 size={14} />}
                  Confirm Check-In
                </button>
              )}
            </div>
          )}

          {/* Feedback Result Card */}
          {result && (
            <div className={`mt-4 p-4 rounded-xl border text-left transition-all ${
              result.success
                ? result.alreadyCheckedIn
                  ? 'bg-amber-500/10 border-amber-500/40 text-amber-200'
                  : 'bg-emerald-500/15 border-emerald-500/40 text-emerald-200'
                : 'bg-red-500/15 border-red-500/40 text-red-200'
            }`}>
              <div className="flex items-start gap-2.5">
                {result.success ? (
                  result.alreadyCheckedIn ? (
                    <Clock size={20} className="text-amber-400 shrink-0 mt-0.5" />
                  ) : (
                    <CheckCircle2 size={20} className="text-emerald-400 shrink-0 mt-0.5" />
                  )
                ) : (
                  <AlertCircle size={20} className="text-red-400 shrink-0 mt-0.5" />
                )}

                <div className="flex-1">
                  <h3 className="font-bold text-sm">
                    {result.success
                      ? result.alreadyCheckedIn
                        ? 'Already Checked In!'
                        : 'Check-In Successful!'
                      : 'Check-In Failed'}
                  </h3>
                  <p className="text-xs mt-0.5 opacity-90">
                    {result.message || result.error}
                  </p>

                  {result.attendee && (
                    <div className="mt-2.5 pt-2 border-t border-white/10 text-xs text-white space-y-0.5">
                      <p><strong>Name:</strong> {result.attendee.title} {result.attendee.fullName || result.attendee.full_name}</p>
                      <p><strong>Ticket:</strong> <span className="font-mono text-amber-300 font-bold">{result.attendee.ticketCode || result.attendee.ticket_code}</span></p>
                      <p><strong>Status:</strong> {result.attendee.memberStatus || result.attendee.member_status}</p>
                    </div>
                  )}

                  {result.success && (
                    <button
                      onClick={() => handleUndo(result.ticketCode, result.dayLabel)}
                      disabled={undoingKey === `${result.ticketCode}|${result.dayLabel}`}
                      className="mt-2.5 flex items-center gap-1.5 text-[11px] font-bold text-stone-300 hover:text-white underline disabled:opacity-40"
                    >
                      <Undo2 size={12} /> Undo this check-in
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Recent Check-Ins List */}
        <div className="bg-[#150407] border border-white/10 rounded-2xl p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-bold text-stone-200 uppercase tracking-wider flex items-center gap-1.5">
              <Clock size={13} className="text-amber-400" /> Recent Check-Ins ({selectedDay.split(':')[0]})
            </h3>
            <button
              onClick={loadData}
              className="text-stone-400 hover:text-stone-200 p-1 rounded-md"
              title="Refresh"
            >
              <RefreshCw size={13} />
            </button>
          </div>

          {recentLogs.length === 0 ? (
            <p className="text-xs text-stone-500 py-6 text-center italic">
              No check-ins recorded yet for {selectedDay}.
            </p>
          ) : (
            <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
              {recentLogs.map((log, idx) => {
                const key = `${log.ticket_code}|${selectedDay}`;
                return (
                  <div
                    key={idx}
                    className="bg-black/30 border border-white/5 rounded-xl p-2.5 flex items-center justify-between text-xs"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <div className="w-7 h-7 rounded-full bg-amber-500/20 text-amber-300 flex items-center justify-center font-bold text-[10px] shrink-0">
                        {(log.full_name || 'D')[0]}
                      </div>
                      <div className="min-w-0">
                        <p className="font-bold text-white leading-tight truncate">{log.full_name || 'Registered Delegate'}</p>
                        <p className="text-[10px] font-mono text-amber-400">{log.ticket_code}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-[10px] text-stone-400">
                        {new Date(log.checkin_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                      <button
                        onClick={() => handleUndo(log.ticket_code, selectedDay)}
                        disabled={undoingKey === key}
                        title="Undo check-in"
                        className="text-stone-500 hover:text-red-400 p-1 disabled:opacity-40"
                      >
                        <Undo2 size={13} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
