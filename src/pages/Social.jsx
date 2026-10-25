import { useState } from 'react';
import {
  Share2, Radio, ExternalLink,
  Heart, Send, CheckCircle2, Phone, MapPin, Video, Globe
} from 'lucide-react';
import { SOCIAL_LINKS, PROGRAM_DATA } from '../data/programData';

export default function Social() {
  const [prayerForm, setPrayerForm] = useState({ name: '', phone: '', request: '' });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmitPrayer = async (e) => {
    e.preventDefault();
    if (!prayerForm.request.trim()) return;

    setLoading(true);
    try {
      // Send to serverless registrations or store locally
      await fetch('/api/registrations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: prayerForm.name || 'Anonymous Believer',
          phone: prayerForm.phone || '0000000000',
          prayerRequest: prayerForm.request,
          memberStatus: 'Online Prayer Request',
          attendanceMode: 'Online'
        })
      });
      setSubmitted(true);
      setPrayerForm({ name: '', phone: '', request: '' });
    } catch {
      setSubmitted(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 pb-24 text-white">
      {/* Header Banner */}
      <div className="px-4 pt-6 pb-4 bg-gradient-to-b from-[#220409] to-[#0d0205] border-b border-amber-500/20 text-center">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold uppercase tracking-wider mb-2">
          <Share2 size={12} className="text-amber-400" />
          <span>Connect & Broadcasts</span>
        </div>
        <h1 className="font-cinzel font-black text-2xl tracking-wide gold-gradient-text uppercase">
          LIVE STREAMS & MEDIA
        </h1>
        <p className="text-xs text-stone-300 max-w-xs mx-auto mt-1">
          Follow Rev. Dr. Ebenezer Okronipa and Overcomers Nation Church online.
        </p>
      </div>

      <div className="p-4 space-y-4">
        {/* Social Media Channels */}
        <div className="space-y-3">
          {SOCIAL_LINKS.map((link) => (
            <a
              key={link.id}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="block bg-gradient-to-r from-[#170407] to-[#100204] border border-amber-500/20 hover:border-amber-400/50 rounded-2xl p-4 transition-all shadow-md group"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className="w-11 h-11 rounded-xl flex items-center justify-center text-white shadow-md shrink-0"
                    style={{ backgroundColor: `${link.color}25`, border: `1px solid ${link.color}50` }}
                  >
                    {link.platform.includes('YouTube') && (
                      <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24" style={{ color: link.color }}>
                        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                      </svg>
                    )}
                    {link.platform.includes('Facebook') && (
                      <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24" style={{ color: link.color }}>
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                      </svg>
                    )}
                    {link.platform.includes('Podcast') && <Radio size={22} style={{ color: link.color }} />}
                    {link.platform.includes('Instagram') && (
                      <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24" style={{ color: link.color }}>
                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                      </svg>
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-sm text-white group-hover:text-amber-300 transition-colors">
                        {link.platform}
                      </h3>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/10 text-stone-300 border border-white/10">
                        {link.badge}
                      </span>
                    </div>
                    <p className="text-xs text-amber-400/90 font-medium">{link.handle}</p>
                    <p className="text-[11px] text-stone-400 mt-0.5 leading-snug">{link.desc}</p>
                  </div>
                </div>
                <ExternalLink size={16} className="text-stone-500 group-hover:text-amber-400 transition-colors" />
              </div>
            </a>
          ))}
        </div>

        {/* Prayer Request Form */}
        <div className="bg-[#150407] border border-amber-500/30 rounded-2xl p-5 shadow-xl mt-6">
          <div className="flex items-center gap-2 mb-2">
            <Heart size={18} className="text-red-500" />
            <h2 className="font-cinzel font-bold text-base text-white">
              Send Prayer Request & Testimonies
            </h2>
          </div>
          <p className="text-xs text-stone-300 mb-4">
            Rev. Dr. Ebenezer Okronipa and the pastoral team will lift your requests before God during PEC: THIS SAME JESUS.
          </p>

          {submitted ? (
            <div className="bg-emerald-500/15 border border-emerald-500/30 rounded-xl p-4 text-center">
              <CheckCircle2 size={24} className="text-emerald-400 mx-auto mb-1" />
              <p className="text-xs font-bold text-emerald-200">
                Your prayer request has been received!
              </p>
              <p className="text-[11px] text-stone-400 mt-1">
                We believe God with you for an instantaneous miracle in Jesus' name.
              </p>
              <button
                type="button"
                onClick={() => setSubmitted(false)}
                className="mt-3 text-xs text-amber-400 underline font-semibold"
              >
                Send another request
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmitPrayer} className="space-y-3">
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  placeholder="Your Name (Optional)"
                  value={prayerForm.name}
                  onChange={e => setPrayerForm({ ...prayerForm, name: e.target.value })}
                  className="bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder-stone-500 focus:outline-none focus:border-amber-400"
                />
                <input
                  type="tel"
                  placeholder="Phone (Optional)"
                  value={prayerForm.phone}
                  onChange={e => setPrayerForm({ ...prayerForm, phone: e.target.value })}
                  className="bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder-stone-500 focus:outline-none focus:border-amber-400"
                />
              </div>

              <textarea
                rows={3}
                required
                placeholder="Type your prayer request, healing need or expectation..."
                value={prayerForm.request}
                onChange={e => setPrayerForm({ ...prayerForm, request: e.target.value })}
                className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-xs text-white placeholder-stone-500 focus:outline-none focus:border-amber-400"
              />

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-red-900/40"
              >
                <Send size={14} />
                <span>Submit Prayer Request</span>
              </button>
            </form>
          )}
        </div>

        {/* Church Contact & Location Box */}
        <div className="bg-black/30 border border-white/10 rounded-2xl p-4 space-y-2 text-xs">
          <p className="font-bold text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
            <Phone size={13} /> Inquiries & Counseling Hotline
          </p>
          <p className="text-stone-300">
            For directions, seat reservations, or private ministry:
          </p>
          <div className="flex gap-2 pt-1">
            <a
              href={`tel:${PROGRAM_DATA.contact.phone}`}
              className="py-1.5 px-3 bg-white/5 border border-white/10 rounded-lg text-amber-300 font-mono font-bold hover:bg-white/10"
            >
              {PROGRAM_DATA.contact.phone}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
