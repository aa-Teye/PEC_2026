import { useRef } from 'react';
import { X, Download, Share2, Calendar, MapPin, MessageSquare } from 'lucide-react';
import jsPDF from 'jspdf';
import { PROGRAM_DATA } from '../data/programData';

export default function BadgeModal({ attendee, onClose }) {
  const badgeRef = useRef(null);

  if (!attendee) return null;

  const ticketCode = attendee.ticketCode || attendee.ticket_code || 'PEC-000000';
  const fullName = attendee.fullName || attendee.full_name || 'Valued Delegate';
  const title = attendee.title ? `${attendee.title} ` : '';
  const memberStatus = attendee.memberStatus || attendee.member_status || 'Attendee';
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(ticketCode)}&bgcolor=17-5-8&color=252-211-77`;

  const handleDownloadPdf = () => {
    try {
      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: [85, 130]
      });

      // Background
      doc.setFillColor(18, 4, 7);
      doc.rect(0, 0, 85, 130, 'F');

      // Top Gold Header
      doc.setFillColor(212, 175, 55);
      doc.rect(0, 0, 85, 12, 'F');
      doc.setTextColor(15, 3, 5);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      doc.text("PEC • OFFICIAL DELEGATE PASS", 42.5, 8, { align: 'center' });

      // Event Theme
      doc.setTextColor(245, 158, 11);
      doc.setFontSize(13);
      doc.text("THIS SAME JESUS", 42.5, 22, { align: 'center' });
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(8);
      doc.text("ACTS 1:11 • 23 - 29 NOVEMBER", 42.5, 28, { align: 'center' });

      // Attendee Name Box
      doc.setFillColor(35, 8, 14);
      doc.roundedRect(6, 34, 73, 24, 3, 3, 'F');
      doc.setTextColor(253, 230, 138);
      doc.setFontSize(7);
      doc.text("DELEGATE NAME", 42.5, 40, { align: 'center' });
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(11);
      doc.setFont('helvetica', 'bold');
      doc.text(`${title}${fullName}`.slice(0, 28), 42.5, 48, { align: 'center' });
      doc.setFontSize(8);
      doc.setTextColor(212, 175, 55);
      doc.text(memberStatus.toUpperCase(), 42.5, 54, { align: 'center' });

      // Ticket Code
      doc.setFillColor(245, 158, 11);
      doc.roundedRect(18, 62, 49, 10, 2, 2, 'F');
      doc.setTextColor(15, 3, 5);
      doc.setFontSize(9);
      doc.setFont('helvetica', 'bold');
      doc.text(`TICKET: ${ticketCode}`, 42.5, 68.5, { align: 'center' });

      // Venue Info
      doc.setTextColor(220, 220, 220);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7);
      doc.text("OVERCOMERS NATION CHURCH", 42.5, 80, { align: 'center' });
      doc.text("Opposite Ayrton Drug, Tesano", 42.5, 85, { align: 'center' });
      doc.text("Host: Rev. Dr. Ebenezer Okronipa", 42.5, 90, { align: 'center' });

      // Footer
      doc.setTextColor(150, 150, 150);
      doc.setFontSize(6);
      doc.text("Present this pass at entry for seamless check-in.", 42.5, 120, { align: 'center' });

      doc.save(`${ticketCode}-${fullName.replace(/\s+/g, '_')}-PASS.pdf`);
    } catch (e) {
      alert("Could not generate PDF: " + e.message);
    }
  };

  const handleShare = () => {
    const text = `🎉 I'm officially registered for PEC: THIS SAME JESUS (Acts 1:11) with Rev. Dr. Ebenezer Okronipa! 23-29 November at Overcomers Nation Church, Tesano.\nMy Ticket: ${ticketCode}\nRegister free here: ${window.location.origin}/register`;
    if (navigator.share) {
      navigator.share({
        title: 'PEC - THIS SAME JESUS Delegate Pass',
        text: text,
        url: window.location.origin
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(text);
      alert('Pass details copied to clipboard!');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto animate-fadeIn">
      <div className="relative w-full max-w-sm bg-gradient-to-b from-[#1c050a] via-[#120306] to-[#090103] border-2 border-amber-500/40 rounded-3xl p-6 shadow-2xl shadow-red-950/80 text-center">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-stone-300 flex items-center justify-center transition-colors"
        >
          <X size={18} />
        </button>

        {/* Badge Header */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold mb-3">
          <span>Official Delegate Pass</span>
        </div>

        {/* Shield & Theme */}
        <h2 className="font-cinzel font-black text-2xl tracking-wide gold-gradient-text">
          THIS SAME JESUS
        </h2>
        <p className="text-xs text-amber-400 font-semibold tracking-widest uppercase mb-4">
          Acts 1:11 • PEC 2026
        </p>

        {/* Delegate Card */}
        <div ref={badgeRef} className="bg-black/40 border border-amber-500/20 rounded-2xl p-4 my-2 relative overflow-hidden">
          <div className="absolute -top-10 -right-10 w-28 h-28 bg-red-600/10 rounded-full blur-2xl pointer-events-none" />

          {/* QR Code */}
          <div className="w-36 h-36 mx-auto bg-[#170508] border-2 border-amber-500/30 rounded-xl p-2 flex items-center justify-center shadow-inner mb-3">
            <img
              src={qrUrl}
              alt="Verification QR Code"
              className="w-full h-full object-contain rounded-lg"
              loading="lazy"
            />
          </div>

          <p className="text-[11px] uppercase tracking-wider text-amber-300/70 font-semibold">
            Delegate Name
          </p>
          <h3 className="text-lg font-bold text-white tracking-tight mt-0.5">
            {title}{fullName}
          </h3>

          <div className="mt-2.5 inline-block px-3 py-1 bg-amber-400/10 border border-amber-400/30 rounded-lg">
            <span className="font-mono font-bold text-amber-300 text-sm tracking-wider">
              {ticketCode}
            </span>
          </div>

          <div className="mt-3 pt-3 border-t border-white/5 flex items-center justify-between text-[11px] text-stone-400 px-2">
            <span className="flex items-center gap-1">
              <Calendar size={12} className="text-amber-400" /> 23–29 Nov
            </span>
            <span className="flex items-center gap-1">
              <MapPin size={12} className="text-amber-400" /> Tesano, Accra
            </span>
          </div>
        </div>

        {/* SMS Status Notice */}
        <div className="mt-3 px-3 py-2 bg-emerald-500/10 border border-emerald-500/30 rounded-xl flex items-center justify-center gap-2 text-[11px] text-emerald-300">
          <MessageSquare size={13} />
          <span>Confirmation SMS sent to your phone!</span>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-2.5 mt-4">
          <button
            onClick={handleDownloadPdf}
            className="flex items-center justify-center gap-1.5 py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-bold text-xs shadow-lg shadow-amber-500/25 transition-all"
          >
            <Download size={15} />
            <span>Download Pass</span>
          </button>

          <button
            onClick={handleShare}
            className="flex items-center justify-center gap-1.5 py-3 px-4 rounded-xl bg-white/10 hover:bg-white/15 text-white font-semibold text-xs border border-white/10 transition-all"
          >
            <Share2 size={15} />
            <span>Share Ticket</span>
          </button>
        </div>

        <button
          onClick={onClose}
          className="w-full mt-3 py-2 text-xs text-stone-400 hover:text-stone-200 transition-colors"
        >
          Close Pass
        </button>
      </div>
    </div>
  );
}
