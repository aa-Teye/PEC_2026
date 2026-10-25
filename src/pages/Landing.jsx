import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Calendar, Clock, MapPin, ChevronRight,
  Shield, Flame, Users, HeartHandshake, Phone, Share2
} from 'lucide-react';
import { PROGRAM_DATA, PROGRAM_ACTIVITIES } from '../data/programData';

export default function Landing() {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  const [sessionLabel, setSessionLabel] = useState('NEXT SERVICE COUNTDOWN');

  useEffect(() => {
    // Exact session schedule for PEC 2026 (23 - 29 Oct 2026)
    const sessions = [
      new Date('2026-10-23T20:00:00'),
      new Date('2026-10-24T18:00:00'),
      new Date('2026-10-25T08:00:00'),
      new Date('2026-10-25T18:00:00'),
      new Date('2026-10-26T18:00:00'),
      new Date('2026-10-27T18:00:00'),
      new Date('2026-10-28T18:00:00'),
      new Date('2026-10-29T18:00:00'),
    ];

    const now = Date.now();
    let target = sessions.find(s => s.getTime() > now);

    if (!target) {
      // If before conference
      if (now < new Date('2026-10-23T20:00:00').getTime()) {
        target = new Date('2026-10-23T20:00:00');
        setSessionLabel('COUNTDOWN TO OPENING NIGHT');
      } else {
        // Fallback grand finale
        target = new Date('2026-10-29T18:00:00');
        setSessionLabel('COUNTDOWN TO GRAND FINALE');
      }
    } else {
      setSessionLabel('COUNTDOWN TO NEXT SERVICE');
    }

    const interval = setInterval(() => {
      const diff = target.getTime() - Date.now();
      if (diff > 0) {
        setTimeLeft({
          days: Math.floor(diff / (1000 * 60 * 60 * 24)),
          hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((diff / 1000 / 60) % 60),
          seconds: Math.floor((diff / 1000) % 60),
        });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex-1 pb-24 text-white">
      {/* Hero Section */}
      <div className="relative overflow-hidden px-4 pt-6 pb-8 text-center bg-gradient-to-b from-[#25050b] via-[#120205] to-[#0b0204]">
        {/* Ambient lighting effects */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-80 h-80 bg-red-600/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-28 left-1/2 -translate-x-1/2 w-64 h-64 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

        {/* Top Church Tag */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-amber-500/30 text-amber-300 text-xs font-semibold uppercase tracking-wider mb-4 shadow-sm">
          <span>Ebenezer Okronipa Ministries (EOM)</span>
        </div>

        {/* Poster / Artwork Preview */}
        <div className="relative mx-auto w-full max-w-[340px] aspect-[3/4] rounded-2xl overflow-hidden border-2 border-amber-500/40 shadow-2xl shadow-red-950/90 group mb-6">
          <img
            src="/flyer.jpg"
            alt="PEC - THIS SAME JESUS Flyer"
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 pointer-events-none" />
          <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-left">
            <div>
              <p className="text-[10px] text-amber-300 font-bold uppercase tracking-widest">Theme</p>
              <p className="text-lg font-cinzel font-black text-white leading-tight">THIS SAME JESUS</p>
              <p className="text-[11px] text-amber-400 font-semibold">Acts 1:11</p>
            </div>
            <div className="bg-amber-500 text-black font-extrabold px-2.5 py-1 rounded-lg text-xs shadow-md">
              FREE
            </div>
          </div>
        </div>

        {/* Title & Tagline */}
        <h1 className="font-cinzel font-black text-3xl sm:text-4xl tracking-wide gold-gradient-text uppercase leading-none mb-2">
          THIS SAME JESUS
        </h1>
        <p className="text-sm font-semibold text-amber-300 tracking-widest uppercase mb-2">
          Acts 1:11 • {PROGRAM_DATA.name} 2026
        </p>
        <p className="text-xs text-stone-300 max-w-sm mx-auto leading-relaxed mb-6">
          "This same Jesus, which is taken up from you into heaven, shall so come in like manner as ye have seen him go."
        </p>

        {/* Countdown Timer */}
        <div className="max-w-xs mx-auto mb-6">
          <p className="text-[10px] text-amber-300 font-extrabold uppercase tracking-wider mb-2">
            🔥 {sessionLabel}
          </p>
          <div className="grid grid-cols-4 gap-2">
            {[
              { val: timeLeft.days, label: 'DAYS' },
              { val: timeLeft.hours, label: 'HRS' },
              { val: timeLeft.minutes, label: 'MIN' },
              { val: timeLeft.seconds, label: 'SEC' }
            ].map((item, idx) => (
              <div key={idx} className="bg-black/40 border border-amber-500/20 rounded-xl py-2 px-1 text-center backdrop-blur-sm shadow-inner">
                <span className="block font-mono font-black text-xl text-amber-300 leading-none">
                  {String(item.val).padStart(2, '0')}
                </span>
                <span className="text-[9px] font-bold text-stone-400 tracking-wider">
                  {item.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Hero CTA Button */}
        <Link
          to="/register"
          className="inline-flex items-center justify-center gap-2 w-full max-w-xs py-3.5 px-6 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-black text-sm tracking-wide shadow-xl shadow-amber-500/25 transition-all transform active:scale-95"
        >
          <span>REGISTER NOW — 100% FREE</span>
          <ChevronRight size={18} />
        </Link>
      </div>

      {/* Program Details Strip */}
      <div className="px-4 py-5 bg-[#140306] border-y border-amber-500/15">
        <div className="grid grid-cols-1 gap-3.5">
          {/* Dates */}
          <div className="flex items-start gap-3 bg-white/5 p-3.5 rounded-xl border border-white/5">
            <div className="w-10 h-10 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
              <Calendar size={20} />
            </div>
            <div>
              <p className="text-xs text-amber-300/80 font-bold uppercase tracking-wider">Conference Dates</p>
              <p className="text-sm font-bold text-white">23rd – 29th October</p>
              <p className="text-xs text-stone-400">7 Days of Supernatural Glory & Encounters</p>
            </div>
          </div>

          {/* Times */}
          <div className="flex items-start gap-3 bg-white/5 p-3.5 rounded-xl border border-white/5">
            <div className="w-10 h-10 rounded-lg bg-red-600/10 border border-red-500/30 flex items-center justify-center text-red-400 shrink-0">
              <Clock size={20} />
            </div>
            <div>
              <p className="text-xs text-red-300/80 font-bold uppercase tracking-wider">Service Times</p>
              <div className="text-xs text-stone-200 space-y-0.5 mt-0.5">
                <p><strong className="text-amber-300">Mon – Thu:</strong> 6:00 PM Each Night</p>
                <p><strong className="text-amber-300">Friday:</strong> ALL NIGHT — 8:00 PM</p>
                <p><strong className="text-amber-300">Sundays:</strong> 8:00 AM</p>
              </div>
            </div>
          </div>

          {/* Venue */}
          <div className="flex items-start gap-3 bg-white/5 p-3.5 rounded-xl border border-white/5">
            <div className="w-10 h-10 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
              <MapPin size={20} />
            </div>
            <div>
              <p className="text-xs text-amber-300/80 font-bold uppercase tracking-wider">Venue</p>
              <p className="text-sm font-bold text-white">Overcomers Nation Church</p>
              <p className="text-xs text-stone-400">Opposite Ayrton Drug, Tesano, Accra</p>
            </div>
          </div>
        </div>
      </div>

      {/* Host Spotlight */}
      <div className="px-4 py-8">
        <div className="bg-gradient-to-br from-[#1c050a] to-[#120306] border border-amber-500/20 rounded-2xl p-5 shadow-lg relative overflow-hidden">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-amber-400 to-red-600 p-0.5 shadow-md">
              <div className="w-full h-full bg-[#1b0509] rounded-full flex items-center justify-center font-bold text-amber-300 text-sm">
                EO
              </div>
            </div>
            <div>
              <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider">Conference Host</span>
              <h3 className="text-base font-bold text-white leading-tight">
                {PROGRAM_DATA.host.name}
              </h3>
              <p className="text-xs text-stone-400">{PROGRAM_DATA.host.title}</p>
            </div>
          </div>

          <p className="text-xs text-stone-300 leading-relaxed mb-4">
            {PROGRAM_DATA.host.bio}
          </p>

          <div className="grid grid-cols-2 gap-2 text-[11px] text-stone-300">
            <div className="flex items-center gap-1.5 bg-black/30 p-2 rounded-lg border border-white/5">
              <Flame size={14} className="text-amber-400" />
              <span>Prophetic Word</span>
            </div>
            <div className="flex items-center gap-1.5 bg-black/30 p-2 rounded-lg border border-white/5">
              <Shield size={14} className="text-amber-400" />
              <span>Miracles & Healing</span>
            </div>
          </div>
        </div>
      </div>

      {/* Schedule Snapshot */}
      <div className="px-4 py-2">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-base font-cinzel font-bold text-white">Daily Schedule</h2>
            <p className="text-xs text-stone-400">7 Days of Supernatural Encounters</p>
          </div>
          <Link to="/program" className="text-xs font-semibold text-amber-400 hover:text-amber-300 flex items-center gap-1">
            <span>Full Outline</span>
            <ChevronRight size={14} />
          </Link>
        </div>

        <div className="space-y-2.5">
          {PROGRAM_ACTIVITIES.slice(0, 4).map((act) => (
            <div
              key={act.id}
              className="bg-black/30 border border-white/5 hover:border-amber-500/30 rounded-xl p-3.5 transition-all flex items-center justify-between"
            >
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] font-extrabold px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                    {act.dayNumber}
                  </span>
                  <span className="text-xs text-stone-400">{act.time}</span>
                </div>
                <h4 className="text-xs font-bold text-white">{act.sessionTitle}</h4>
                <p className="text-[11px] text-amber-400/90">{act.theme}</p>
              </div>
              <ChevronRight size={16} className="text-stone-500" />
            </div>
          ))}
        </div>
      </div>

      {/* Registration Banner */}
      <div className="px-4 py-8">
        <div className="bg-gradient-to-r from-red-950 via-[#26050b] to-[#1a0408] border-2 border-amber-500/30 rounded-2xl p-6 text-center shadow-xl">
          <Shield size={32} className="mx-auto text-amber-400 mb-2" />
          <h3 className="font-cinzel font-black text-xl text-white mb-1">
            Reserve Your Free Seat
          </h3>
          <p className="text-xs text-stone-300 mb-4 max-w-xs mx-auto">
            Get your instant digital pass, QR code check-in, and seat reservation with instant SMS confirmation.
          </p>
          <Link
            to="/register"
            className="inline-block py-3 px-8 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-black font-extrabold text-xs tracking-wider shadow-lg shadow-amber-500/30 active:scale-95 transition-all"
          >
            REGISTER NOW
          </Link>
        </div>
      </div>
    </div>
  );
}
