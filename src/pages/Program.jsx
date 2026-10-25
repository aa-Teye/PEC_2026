import { useState } from 'react';
import { Calendar, Clock, MapPin, ChevronDown, CheckCircle2, Bookmark, Flame } from 'lucide-react';
import { PROGRAM_DATA, PROGRAM_ACTIVITIES } from '../data/programData';

export default function Program() {
  const [expandedId, setExpandedId] = useState(1);

  return (
    <div className="flex-1 pb-24 text-white">
      {/* Header Banner */}
      <div className="px-4 pt-6 pb-4 bg-gradient-to-b from-[#220409] to-[#0d0205] border-b border-amber-500/20 text-center">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold uppercase tracking-wider mb-2">
          <Calendar size={12} className="text-amber-400" />
          <span>Conference Outline</span>
        </div>
        <h1 className="font-cinzel font-black text-2xl tracking-wide gold-gradient-text uppercase">
          PROGRAM & SCHEDULE
        </h1>
        <p className="text-xs text-stone-300 max-w-xs mx-auto mt-1">
          23rd – 29th November • Overcomers Nation Church, Tesano
        </p>
      </div>

      {/* Schedule Times Summary Box */}
      <div className="p-4">
        <div className="bg-[#180408] border border-amber-500/30 rounded-2xl p-4 shadow-lg">
          <h2 className="text-xs font-bold text-amber-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <Clock size={14} /> Service Times Breakdown
          </h2>
          <div className="grid grid-cols-3 gap-2 text-center text-xs">
            <div className="bg-black/40 p-2.5 rounded-xl border border-white/5">
              <span className="block text-[10px] text-stone-400 uppercase font-semibold">Mon – Thu</span>
              <span className="font-bold text-amber-300 text-sm">6:00 PM</span>
            </div>
            <div className="bg-red-950/60 p-2.5 rounded-xl border border-red-500/30">
              <span className="block text-[10px] text-red-300 uppercase font-semibold">Friday</span>
              <span className="font-bold text-red-200 text-sm">8:00 PM</span>
              <span className="block text-[8px] text-red-400 font-extrabold uppercase">All Night</span>
            </div>
            <div className="bg-black/40 p-2.5 rounded-xl border border-white/5">
              <span className="block text-[10px] text-stone-400 uppercase font-semibold">Sundays</span>
              <span className="font-bold text-amber-300 text-sm">8:00 AM</span>
            </div>
          </div>
        </div>
      </div>

      {/* Daily Activities Timeline */}
      <div className="px-4 space-y-3">
        {PROGRAM_ACTIVITIES.map((act) => {
          const isExpanded = expandedId === act.id;
          return (
            <div
              key={act.id}
              className={`border rounded-2xl transition-all overflow-hidden ${
                isExpanded
                  ? 'bg-gradient-to-br from-[#20050b] to-[#120306] border-amber-500/50 shadow-xl shadow-red-950/50'
                  : 'bg-[#140306] border-white/5 hover:border-amber-500/20'
              }`}
            >
              <button
                type="button"
                onClick={() => setExpandedId(isExpanded ? null : act.id)}
                className="w-full p-4 flex items-center justify-between text-left"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-xl flex flex-col items-center justify-center font-bold shadow-md bg-gradient-to-br ${act.badgeColor} text-white`}>
                    <span className="text-[10px] uppercase tracking-tighter opacity-80 leading-none">
                      DAY
                    </span>
                    <span className="text-base font-cinzel leading-none mt-0.5">
                      {act.id}
                    </span>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-xs font-semibold text-amber-400">
                        {act.date}
                      </span>
                      <span className="text-[11px] text-stone-400 flex items-center gap-1">
                        <Clock size={11} /> {act.time}
                      </span>
                    </div>
                    <h3 className="text-sm font-bold text-white leading-tight">
                      {act.sessionTitle}
                    </h3>
                  </div>
                </div>

                <ChevronDown
                  size={18}
                  className={`text-amber-400 transition-transform duration-300 ${
                    isExpanded ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {isExpanded && (
                <div className="px-4 pb-4 pt-1 border-t border-white/5 space-y-3">
                  <div className="bg-black/30 rounded-xl p-3 border border-white/5">
                    <p className="text-[10px] text-amber-400 uppercase font-bold tracking-wider mb-0.5">
                      Service Focus & Theme
                    </p>
                    <p className="text-xs font-semibold text-white">
                      {act.theme}
                    </p>
                    <p className="text-xs text-stone-300 mt-2 leading-relaxed">
                      {act.description}
                    </p>
                  </div>

                  <div className="flex items-center justify-between text-xs text-stone-300 pt-1">
                    <span className="flex items-center gap-1.5 text-amber-300">
                      <span className="font-semibold">{act.category}</span>
                    </span>
                    <span className="text-[11px] bg-white/5 px-2.5 py-1 rounded-md border border-white/10 text-stone-300">
                      Free Entry
                    </span>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Conference Host & Venue Info */}
      <div className="p-4 mt-4">
        <div className="bg-black/30 border border-white/10 rounded-2xl p-4 space-y-3">
          <div className="flex items-center gap-2 text-amber-300 font-bold text-xs uppercase">
            <MapPin size={14} /> Conference Location & Directions
          </div>
          <p className="text-xs text-stone-300 leading-relaxed">
            <strong>Overcomers Nation Church</strong><br />
            Opposite Ayrton Drug, Tesano, Accra, Ghana.<br />
            Landmarks: Near Tesano Police Station & Abeka Junction.
          </p>
          <div className="pt-2 flex items-center gap-2">
            <a
              href="https://maps.google.com/?q=Overcomers+Nation+Church+Tesano"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-semibold text-amber-400 hover:text-amber-300 underline"
            >
              Open in Google Maps &rarr;
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
