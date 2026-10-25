import { useState } from 'react';
import { Link } from 'react-router-dom';
import confetti from 'canvas-confetti';
import {
  User, Phone, Mail, MapPin, Calendar, Heart, Shield,
  CheckCircle2, ArrowRight, Loader2, Car, Users, MessageSquare
} from 'lucide-react';
import { PROGRAM_DATA, DAYS_OF_CONVENTION, TITLES, saveRegistration } from '../data/programData';

const INIT_FORM = {
  title: 'Mr',
  fullName: '',
  phone: '',
  email: '',
  gender: 'Male',
  memberStatus: 'Visitor / Guest',
  firstTimer: 'no',
  referral: '',
  attendanceDays: DAYS_OF_CONVENTION.map(d => d.id),
  attendanceMode: 'In-Person',
  prayerRequest: '',
  location: '',
  invitedBy: '',
  needsTransport: 'no'
};

export default function Register() {
  const [form, setForm] = useState(INIT_FORM);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [registeredAttendee, setRegisteredAttendee] = useState(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const toggleDay = (dayId) => {
    setForm(prev => {
      const exists = prev.attendanceDays.includes(dayId);
      return {
        ...prev,
        attendanceDays: exists
          ? prev.attendanceDays.filter(d => d !== dayId)
          : [...prev.attendanceDays, dayId]
      };
    });
  };

  const selectAllDays = () => {
    setForm(prev => ({
      ...prev,
      attendanceDays: DAYS_OF_CONVENTION.map(d => d.id)
    }));
  };

  const validate = () => {
    const errs = {};
    if (!form.fullName.trim()) errs.fullName = 'Full Name is required';
    if (!form.phone.trim()) errs.phone = 'Valid Phone Number is required';
    if (form.attendanceDays.length === 0) errs.attendanceDays = 'Select at least one day';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      const saved = await saveRegistration(form);
      setRegisteredAttendee(saved);
      setIsSubmitted(true);

      // Festive celebratory bubbles / confetti
      try {
        confetti({
          particleCount: 120,
          spread: 80,
          origin: { y: 0.5 }
        });
        setTimeout(() => {
          confetti({
            particleCount: 70,
            angle: 60,
            spread: 55,
            origin: { x: 0 }
          });
          confetti({
            particleCount: 70,
            angle: 120,
            spread: 55,
            origin: { x: 1 }
          });
        }, 200);
      } catch {}
    } catch (err) {
      alert("Registration error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterAnother = () => {
    setForm(INIT_FORM);
    setRegisteredAttendee(null);
    setIsSubmitted(false);
    setErrors({});
  };

  // -------------------------------------------------------------
  // Congratulations Screen (After successful registration)
  // -------------------------------------------------------------
  if (isSubmitted && registeredAttendee) {
    return (
      <div className="flex-1 pb-24 text-white">
        {/* Header Banner */}
        <div className="px-4 pt-6 pb-4 bg-gradient-to-b from-[#220409] to-[#0d0205] border-b border-amber-500/20 text-center">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-2">
            <CheckCircle2 size={13} />
            <span>Registration Confirmed</span>
          </div>
          <h1 className="font-cinzel font-black text-2xl sm:text-3xl tracking-wide gold-gradient-text uppercase">
            CONGRATULATIONS!
          </h1>
          <p className="text-xs text-stone-300 max-w-xs mx-auto mt-1">
            You have successfully registered for PEC 2026.
          </p>
        </div>

        {/* Celebration Body */}
        <div className="px-4 py-8 max-w-md mx-auto text-center space-y-6 animate-fadeIn">
          {/* Glowing Checkmark */}
          <div className="relative mx-auto w-20 h-20">
            <div className="absolute inset-0 rounded-full bg-amber-500/20 blur-xl animate-pulse" />
            <div className="relative w-20 h-20 rounded-full bg-gradient-to-tr from-amber-500 to-amber-300 flex items-center justify-center text-black shadow-2xl shadow-amber-500/50">
              <CheckCircle2 size={42} className="stroke-[2.5]" />
            </div>
          </div>

          <div>
            <h2 className="text-xl font-bold text-white mb-1">
              Welcome, {registeredAttendee.title ? `${registeredAttendee.title} ` : ''}{registeredAttendee.fullName || registeredAttendee.full_name}!
            </h2>
            <p className="text-xs text-amber-300 font-semibold tracking-wide">
              PEC: THIS SAME JESUS (Acts 1:11)
            </p>
            <p className="text-[11px] text-stone-400 mt-1">
              23rd – 29th November 2026 • Overcomers Nation Church, Tesano
            </p>
          </div>

          {/* Details Card */}
          <div className="bg-[#150407] border border-amber-500/25 rounded-2xl p-5 text-left space-y-3.5 shadow-xl">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div>
                <span className="text-[10px] uppercase text-stone-400 font-bold block">Ticket Reference</span>
                <span className="font-mono font-black text-amber-300 text-lg">
                  {registeredAttendee.ticketCode || registeredAttendee.ticket_code}
                </span>
              </div>
              <div className="text-right">
                <span className="text-[10px] uppercase text-stone-400 font-bold block">Status</span>
                <span className="inline-block px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-bold uppercase tracking-wider border border-emerald-500/30">
                  Confirmed
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs text-stone-300">
              <div>
                <span className="text-[10px] text-stone-400 block font-semibold">Attendee</span>
                <span className="font-bold text-white">
                  {registeredAttendee.title ? `${registeredAttendee.title} ` : ''}{registeredAttendee.fullName || registeredAttendee.full_name}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-stone-400 block font-semibold">Phone</span>
                <span className="font-bold text-white">{registeredAttendee.phone}</span>
              </div>
            </div>

            <div className="p-3 bg-white/5 border border-amber-500/20 rounded-xl flex items-start gap-2.5 text-xs text-stone-300">
              <MessageSquare size={16} className="text-amber-400 shrink-0 mt-0.5" />
              <p className="text-[11px] leading-relaxed">
                An SMS confirmation with your ticket reference (<span className="font-mono font-bold text-amber-300">{registeredAttendee.ticketCode || registeredAttendee.ticket_code}</span>) has been sent to your phone. Present your ticket code or phone number at check-in when you arrive.
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3 pt-2">
            <button
              onClick={handleRegisterAnother}
              className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-extrabold text-xs tracking-wider shadow-lg shadow-amber-500/30 active:scale-95 transition-all"
            >
              CONFIRM ANOTHER REGISTRATION
            </button>

            <Link
              to="/"
              className="block w-full py-3 px-6 rounded-xl bg-white/5 hover:bg-white/10 text-stone-300 font-semibold text-xs border border-white/5 transition-colors"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // Registration Form
  // -------------------------------------------------------------
  return (
    <div className="flex-1 pb-24 text-white">
      {/* Header Banner */}
      <div className="px-4 pt-6 pb-4 bg-gradient-to-b from-[#220409] to-[#0d0205] border-b border-amber-500/20 text-center">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold uppercase tracking-wider mb-2">
          <span>Delegate Registration</span>
        </div>
        <h1 className="font-cinzel font-black text-2xl tracking-wide gold-gradient-text uppercase">
          CONFIRM YOUR REGISTRATION
        </h1>
        <p className="text-xs text-stone-300 max-w-xs mx-auto mt-1">
          Join us for PEC 2026: THIS SAME JESUS. Free entry & SMS confirmation.
        </p>
      </div>

      {/* Form Container */}
      <form onSubmit={handleSubmit} className="px-4 py-6 space-y-5">
        {/* Personal Details */}
        <div className="bg-[#150407] border border-amber-500/20 rounded-2xl p-4 space-y-4">
          <h2 className="text-xs font-bold text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
            <User size={14} /> Personal Details
          </h2>

          <div className="grid grid-cols-3 gap-2">
            <div>
              <label className="block text-[11px] font-semibold text-stone-300 mb-1">Title</label>
              <select
                value={form.title}
                onChange={e => setForm({ ...form, title: e.target.value })}
                className="w-full bg-black/40 border border-white/10 rounded-xl px-2.5 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
              >
                {TITLES.map(t => (
                  <option key={t.val} value={t.val} className="bg-[#120306] text-white">
                    {t.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-span-2">
              <label className="block text-[11px] font-semibold text-stone-300 mb-1">Full Name *</label>
              <input
                type="text"
                placeholder="e.g. Samuel Mensah"
                value={form.fullName}
                onChange={e => setForm({ ...form, fullName: e.target.value })}
                className={`w-full bg-black/40 border rounded-xl px-3 py-2 text-xs text-white placeholder-stone-500 focus:outline-none ${
                  errors.fullName ? 'border-red-500' : 'border-white/10 focus:border-amber-400'
                }`}
              />
              {errors.fullName && <p className="text-[10px] text-red-400 mt-0.5">{errors.fullName}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-stone-300 mb-1">
                Phone Number (SMS & WhatsApp) *
              </label>
              <input
                type="tel"
                placeholder="024 XXX XXXX"
                value={form.phone}
                onChange={e => setForm({ ...form, phone: e.target.value })}
                className={`w-full bg-black/40 border rounded-xl px-3 py-2 text-xs text-white placeholder-stone-500 focus:outline-none ${
                  errors.phone ? 'border-red-500' : 'border-white/10 focus:border-amber-400'
                }`}
              />
              {errors.phone && <p className="text-[10px] text-red-400 mt-0.5">{errors.phone}</p>}
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-stone-300 mb-1">Email (Optional)</label>
              <input
                type="email"
                placeholder="samuel@example.com"
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
                className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder-stone-500 focus:outline-none focus:border-amber-400"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-stone-300 mb-1">Gender</label>
            <div className="grid grid-cols-2 gap-2">
              {['Male', 'Female'].map(g => (
                <button
                  key={g}
                  type="button"
                  onClick={() => setForm({ ...form, gender: g })}
                  className={`py-2 text-xs rounded-xl font-medium transition-all ${
                    form.gender === g
                      ? 'bg-amber-500 text-black font-bold'
                      : 'bg-black/30 border border-white/10 text-stone-300'
                  }`}
                >
                  {g}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Church & Attendance */}
        <div className="bg-[#150407] border border-amber-500/20 rounded-2xl p-4 space-y-4">
          <h2 className="text-xs font-bold text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
            <Users size={14} /> Church & Attendance
          </h2>

          <div>
            <label className="block text-[11px] font-semibold text-stone-300 mb-1.5">
              Church Membership
            </label>
            <div className="grid grid-cols-2 gap-2">
              {['Overcomers Member', 'Visitor / Guest'].map(cat => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setForm({ ...form, memberStatus: cat })}
                  className={`py-2.5 px-3 text-center text-xs rounded-xl border transition-all ${
                    form.memberStatus === cat
                      ? 'bg-amber-500/20 border-amber-400 text-amber-200 font-bold'
                      : 'bg-black/30 border-white/10 text-stone-300'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-stone-300 mb-1">First Time at Overcomers?</label>
              <div className="grid grid-cols-2 gap-1.5">
                {['yes', 'no'].map(opt => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => setForm({ ...form, firstTimer: opt })}
                    className={`py-1.5 text-xs rounded-lg font-medium transition-all uppercase ${
                      form.firstTimer === opt
                        ? 'bg-amber-500 text-black font-bold'
                        : 'bg-black/30 border border-white/10 text-stone-300'
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-stone-300 mb-1">Attendance Mode</label>
              <div className="grid grid-cols-2 gap-1.5">
                {['In-Person', 'Online'].map(m => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setForm({ ...form, attendanceMode: m })}
                    className={`py-1.5 text-xs rounded-lg font-medium transition-all ${
                      form.attendanceMode === m
                        ? 'bg-amber-500 text-black font-bold'
                        : 'bg-black/30 border border-white/10 text-stone-300'
                    }`}
                  >
                    {m}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-stone-300 mb-1">Your Location / Residence</label>
              <input
                type="text"
                placeholder="e.g. Tesano, Lapaz, Achimota"
                value={form.location}
                onChange={e => setForm({ ...form, location: e.target.value })}
                className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder-stone-500 focus:outline-none focus:border-amber-400"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-stone-300 mb-1">Invited By (Optional)</label>
              <input
                type="text"
                placeholder="Name of inviter or friend"
                value={form.invitedBy}
                onChange={e => setForm({ ...form, invitedBy: e.target.value })}
                className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder-stone-500 focus:outline-none focus:border-amber-400"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-stone-300 mb-1.5 flex items-center gap-1.5">
              <Car size={13} className="text-amber-400" />
              Do you require transportation assistance?
            </label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { val: 'yes', label: 'Yes, need transport' },
                { val: 'no', label: 'No, own transport' }
              ].map(opt => (
                <button
                  key={opt.val}
                  type="button"
                  onClick={() => setForm({ ...form, needsTransport: opt.val })}
                  className={`py-2 px-3 text-xs rounded-xl border transition-all text-center ${
                    form.needsTransport === opt.val
                      ? 'bg-amber-500/20 border-amber-400 text-amber-200 font-bold'
                      : 'bg-black/30 border-white/10 text-stone-300'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Days of Attendance */}
        <div className="bg-[#150407] border border-amber-500/20 rounded-2xl p-4 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-bold text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
              <Calendar size={14} /> Days You Will Attend
            </h2>
            <button
              type="button"
              onClick={selectAllDays}
              className="text-[11px] text-amber-400 hover:text-amber-300 font-bold underline"
            >
              Select All 7 Days
            </button>
          </div>

          <div className="grid grid-cols-1 gap-2">
            {DAYS_OF_CONVENTION.map(day => {
              const selected = form.attendanceDays.includes(day.id);
              return (
                <button
                  key={day.id}
                  type="button"
                  onClick={() => toggleDay(day.id)}
                  className={`flex items-center justify-between p-2.5 rounded-xl border text-left transition-all ${
                    selected
                      ? 'bg-amber-500/15 border-amber-400 text-white'
                      : 'bg-black/30 border-white/5 text-stone-400'
                  }`}
                >
                  <div>
                    <p className={`text-xs font-bold ${selected ? 'text-amber-300' : 'text-stone-300'}`}>
                      {day.label}
                    </p>
                    <p className="text-[10px] text-stone-400">{day.sub}</p>
                  </div>
                  <div className={`w-5 h-5 rounded-md flex items-center justify-center border ${
                    selected ? 'bg-amber-500 border-amber-400 text-black' : 'border-white/20'
                  }`}>
                    {selected && <CheckCircle2 size={14} />}
                  </div>
                </button>
              );
            })}
          </div>
          {errors.attendanceDays && <p className="text-[10px] text-red-400">{errors.attendanceDays}</p>}
        </div>

        {/* Prayer Request & Expectations */}
        <div className="bg-[#150407] border border-amber-500/20 rounded-2xl p-4 space-y-3">
          <h2 className="text-xs font-bold text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
            <Heart size={14} /> Prayer Request & Expectations
          </h2>
          <textarea
            rows={3}
            placeholder="Share your prayer requests or what you are believing God for at THIS SAME JESUS..."
            value={form.prayerRequest}
            onChange={e => setForm({ ...form, prayerRequest: e.target.value })}
            className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-xs text-white placeholder-stone-500 focus:outline-none focus:border-amber-400"
          />
        </div>

        {/* SMS notice badge */}
        <div className="flex items-center gap-2 p-3 bg-white/5 border border-amber-500/20 rounded-xl text-stone-300 text-xs">
          <MessageSquare size={16} className="text-amber-400 shrink-0" />
          <span>You will receive an instant SMS confirmation with your ticket code upon registering.</span>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-black text-sm tracking-wide shadow-xl shadow-amber-500/30 flex items-center justify-center gap-2 transition-all transform active:scale-95 disabled:opacity-50"
        >
          {loading ? (
            <>
              <Loader2 size={18} className="animate-spin text-black" />
              <span>CONFIRMING REGISTRATION & SENDING SMS...</span>
            </>
          ) : (
            <>
              <span>CONFIRM YOUR REGISTRATION</span>
              <ArrowRight size={18} />
            </>
          )}
        </button>
      </form>
    </div>
  );
}
