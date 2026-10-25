import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import confetti from 'canvas-confetti';
import {
  User, Phone, Mail, MapPin, Calendar, Heart, Shield,
  CheckCircle2, ArrowRight, Loader2, Car, Users, MessageSquare
} from 'lucide-react';
import { PROGRAM_DATA, DAYS_OF_CONVENTION, TITLES, saveRegistration } from '../data/programData';
import BadgeModal from '../components/BadgeModal';

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
  const navigate = useNavigate();
  const [form, setForm] = useState(INIT_FORM);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [registeredAttendee, setRegisteredAttendee] = useState(null);
  const [showBadge, setShowBadge] = useState(false);

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

      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch {}

      setShowBadge(true);
    } catch (err) {
      alert("Registration error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 pb-24 text-white">
      {/* Header Banner */}
      <div className="px-4 pt-6 pb-4 bg-gradient-to-b from-[#220409] to-[#0d0205] border-b border-amber-500/20 text-center">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold uppercase tracking-wider mb-2">
          <span>Delegate Registration</span>
        </div>
        <h1 className="font-cinzel font-black text-2xl tracking-wide gold-gradient-text uppercase">
          RESERVE YOUR PASS
        </h1>
        <p className="text-xs text-stone-300 max-w-xs mx-auto mt-1">
          Join us for PEC 2026: THIS SAME JESUS. Free entry, instant digital pass & SMS confirmation.
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
              <span>COMPLETE REGISTRATION & GET PASS</span>
              <ArrowRight size={18} />
            </>
          )}
        </button>
      </form>

      {/* Delegate Badge Modal */}
      {showBadge && registeredAttendee && (
        <BadgeModal
          attendee={registeredAttendee}
          onClose={() => setShowBadge(false)}
        />
      )}
    </div>
  );
}
