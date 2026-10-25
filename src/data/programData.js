// Central data store for PEC - THIS SAME JESUS (Acts 1:11)
export const STORAGE_KEY = 'PEC_REGISTRATIONS_DATA';
export const ATTENDANCE_KEY = 'PEC_ATTENDANCE_DATA';

export const PROGRAM_DATA = {
  name: "PEC",
  fullName: "PROPHETIC EAGLES CONVOCATION",
  theme: "THIS SAME JESUS",
  scripture: "Acts 1:11",
  scriptureText: "This same Jesus, which is taken up from you into heaven, shall so come in like manner as ye have seen him go into heaven.",
  tagline: "Experience the Miraculous, Healing and Transformative Power of Christ",
  subTheme: "The Lord who walked Galilee still heals, delivers, and establishes His people today.",
  date: "23rd – 29th November",
  datesFormatted: "23 - 29 NOVEMBER",
  time: "Mon - Thu & Sat: 6:00pm | Fri All Night: 8:00pm | Sun Grand Finale: 8:00am",
  venue: "Overcomers Nation Church",
  venueSub: "Opposite Ayrton Drug, Tesano, Accra",
  dressCode: "Modest / Decent & Elegant",
  entry: "100% FREE — Invite Everyone",
  targetAudience: ["All Believers", "Youth & Families", "Seekers of Miracles & Deliverance"],
  focusAreas: [
    "Prophetic Ministration",
    "Miracles, Signs & Wonders",
    "Healing & Total Restoration",
    "Holy Ghost Impartation"
  ],
  host: {
    name: "Rev. Dr. Ebenezer Okronipa",
    title: "Host & Senior Pastor",
    role: "President, Ebenezer Okronipa Ministries (EOM)",
    bio: "A dynamic teacher of God's Word, apostolic and prophetic voice releasing the supernatural power and love of God to transform generations."
  },
  org: {
    name: "Ebenezer Okronipa Ministries",
    abbr: "EOM",
    church: "Overcomers Nation Church",
    tagline: "Overcomers By The Blood and Word",
    location: "Opposite Ayrton Drug, Tesano, Accra, Ghana"
  },
  contact: {
    phone: "054-636-3957",
    altPhone: "024-400-0000",
    email: "info@overcomersnation.org"
  }
};

export const PROGRAM_ACTIVITIES = [
  {
    id: 1,
    dayNumber: "Day 1",
    dayLabel: "Day 1: Mon 23 Nov",
    date: "Mon 23 Nov",
    time: "6:00 PM",
    sessionTitle: "Opening Night & Supernatural Launch",
    theme: "This Same Jesus: The Healer is in the Room",
    category: "Prophetic Opening Night",
    badgeColor: "from-red-600 to-rose-700",
    description: "Launch into 7 days of glory! Dynamic prophetic ministration, worship and the opening charge."
  },
  {
    id: 2,
    dayNumber: "Day 2",
    dayLabel: "Day 2: Tue 24 Nov",
    date: "Tue 24 Nov",
    time: "6:00 PM",
    sessionTitle: "Signs, Wonders & Miracles",
    theme: "Creative Miracles & Instant Cures",
    category: "Miracles & Healing",
    badgeColor: "from-emerald-600 to-teal-700",
    description: "Instantaneous cures, creative miracles, and prophetic deliverance."
  },
  {
    id: 3,
    dayNumber: "Day 3",
    dayLabel: "Day 3: Wed 25 Nov",
    date: "Wed 25 Nov",
    time: "6:00 PM",
    sessionTitle: "Breaking Ancient Yokes",
    theme: "Deliverance from Generational Limitations",
    category: "Warfare & Deliverance",
    badgeColor: "from-purple-600 to-indigo-700",
    description: "Total liberation as Jesus breaks every chain and frees captive souls."
  },
  {
    id: 4,
    dayNumber: "Day 4",
    dayLabel: "Day 4: Thu 26 Nov",
    date: "Thu 26 Nov",
    time: "6:00 PM",
    sessionTitle: "Financial Dominion & Exploits",
    theme: "Supernatural Provision & Open Heavens",
    category: "Anointing & Prosperity",
    badgeColor: "from-yellow-500 to-amber-600",
    description: "Unlocking business breakthroughs, divine favor, and wealth transfers."
  },
  {
    id: 5,
    dayNumber: "Day 5",
    dayLabel: "Day 5: Fri 27 Nov",
    date: "Fri 27 Nov",
    time: "8:00 PM",
    sessionTitle: "Prophetic ALL NIGHT VIGIL",
    theme: "Night of Fire, Mantles & Wonders",
    category: "All-Night Vigil",
    badgeColor: "from-rose-600 to-red-800",
    description: "Explosive all-night vigil from 8:00 PM till dawn! Holy Ghost power, deliverance and prophetic impartation."
  },
  {
    id: 6,
    dayNumber: "Day 6",
    dayLabel: "Day 6: Sat 28 Nov",
    date: "Sat 28 Nov",
    time: "6:00 PM",
    sessionTitle: "Family, Marriage & Restoration",
    theme: "Restoring Every Lost Glory",
    category: "Restoration & Anointing",
    badgeColor: "from-indigo-600 to-purple-800",
    description: "Supernatural healing for marriages, healing for children, and destiny restoration."
  },
  {
    id: 7,
    dayNumber: "Day 7",
    dayLabel: "Day 7: Sun 29 Nov",
    date: "Sun 29 Nov",
    time: "8:00 AM",
    sessionTitle: "GRAND FINALE CELEBRATION",
    theme: "Supernatural Seal & Crown of Glory",
    category: "Grand Finale & Thanksgiving",
    badgeColor: "from-amber-400 via-yellow-500 to-amber-700",
    finale: true,
    description: "The climactic final service! Special mantle impartation, anointing oil release and thanksgiving."
  }
];

export const DAYS_OF_CONVENTION = PROGRAM_ACTIVITIES.map(a => ({
  id: a.dayLabel,
  label: a.dayLabel,
  sub: `${a.sessionTitle} • ${a.time}`,
  time: a.time
}));

export const TITLES = [
  { val: 'Mr', label: 'Mr' },
  { val: 'Mrs', label: 'Mrs' },
  { val: 'Miss', label: 'Miss' },
  { val: 'Rev', label: 'Rev' },
  { val: 'Pastor', label: 'Pastor' },
  { val: 'Prophet', label: 'Prophet' },
  { val: 'Dr', label: 'Dr' },
  { val: 'Elder', label: 'Elder' },
  { val: 'Bro/Sis', label: 'Bro / Sis' }
];

export const SOCIAL_LINKS = [
  {
    id: 1,
    platform: "YouTube",
    handle: "@overcomersnationchurch2041",
    url: "https://www.youtube.com/@overcomersnationchurch2041",
    color: "#FF0000",
    badge: "Official Live Stream",
    desc: "Watch all PEC 2026 services live and replay recordings"
  },
  {
    id: 2,
    platform: "Facebook",
    handle: "Overcomers Nation",
    url: "https://www.facebook.com/EbenezerOkronipa",
    color: "#1877F2",
    badge: "Live Streams",
    desc: "Join our official Facebook page for live streaming & updates"
  },
  {
    id: 3,
    platform: "Podcast / Audio",
    handle: "Ebenezer Okronipa",
    url: "https://open.spotify.com/show/ebenezerokronipa",
    color: "#1DB954",
    badge: "Audio Sermons",
    desc: "Listen on Spotify, Apple Podcasts & Google Podcasts"
  },
  {
    id: 4,
    platform: "Instagram",
    handle: "@rev.dr.ebenezer_okronipa",
    url: "https://www.instagram.com/rev.dr.ebenezer_okronipa",
    color: "#E1306C",
    badge: "Photo & Reels",
    desc: "Daily inspiration, prophetic moments, and conference clips"
  }
];

// Helper to save registration to both Neon DB and localStorage, and trigger SMS
export async function saveRegistration(regData) {
  const localList = getLocalRegistrations();
  const code = regData.ticketCode || `PEC-${Math.floor(100000 + Math.random() * 900000)}`;
  const record = {
    ...regData,
    ticketCode: code,
    ticket_code: code,
    created_at: new Date().toISOString(),
    synced: false,
    smsSent: false
  };

  // 1. Try serverless Neon API
  try {
    const res = await fetch('/api/registrations', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(record)
    });

    if (res.ok) {
      const data = await res.json();
      record.synced = true;
      if (data.registration) {
        record.id = data.registration.id;
        record.ticketCode = data.registration.ticket_code || code;
        record.ticket_code = data.registration.ticket_code || code;
        record.smsSent = data.registration.sms_sent || data.smsResult?.success;
      }
    } else {
      // Direct SMS fallback if API endpoint was unreachable
      dispatchDirectSms(record.phone, `${record.title ? record.title + ' ' : ''}${record.fullName}`, code);
    }
  } catch (e) {
    console.warn("Neon API unreachable right now; saved to offline storage:", e.message);
    dispatchDirectSms(record.phone, `${record.title ? record.title + ' ' : ''}${record.fullName}`, code);
  }

  // 2. Persist to localStorage
  const existingIdx = localList.findIndex(r => r.phone === regData.phone || r.ticketCode === code);
  if (existingIdx >= 0) {
    localList[existingIdx] = { ...localList[existingIdx], ...record };
  } else {
    localList.unshift(record);
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(localList));

  return record;
}

// Client-side direct SMS dispatcher via Arkesel
async function dispatchDirectSms(phone, name, code) {
  try {
    let recipient = String(phone).replace(/\s+/g, '').replace(/[-+]/g, '');
    if (recipient.startsWith('0') && recipient.length === 10) {
      recipient = '233' + recipient.slice(1);
    }
    const message = `Dear ${name}, your registration for PEC: THIS SAME JESUS (Acts 1:11) is confirmed! Ticket: ${code}. Dates: 23-29 Nov @ Overcomers Nation Church, Tesano. Info: 0546363957`;

    await fetch('https://sms.arkesel.com/api/v2/sms/send', {
      method: 'POST',
      headers: {
        'api-key': 'aHZxQXN6YnBvUHFHRU9XaUdvZnQ',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        sender: 'EOM-PEC',
        message: message,
        recipients: [recipient]
      })
    });
  } catch (err) {
    console.warn('Client SMS dispatch:', err.message);
  }
}

export function getLocalRegistrations() {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export async function fetchAllRegistrations() {
  try {
    const res = await fetch('/api/registrations');
    if (res.ok) {
      const json = await res.json();
      if (json.registrations && Array.isArray(json.registrations)) {
        const mapped = json.registrations.map(r => ({
          id: r.id,
          ticketCode: r.ticket_code,
          ticket_code: r.ticket_code,
          title: r.title,
          fullName: r.full_name,
          phone: r.phone,
          email: r.email,
          gender: r.gender,
          memberStatus: r.member_status,
          firstTimer: r.first_timer,
          referral: r.referral,
          attendanceDays: r.attendance_days ? r.attendance_days.split(',').map(s => s.trim()) : [],
          attendanceMode: r.attendance_mode,
          prayerRequest: r.prayer_request,
          location: r.location,
          invitedBy: r.invited_by,
          needsTransport: r.needs_transport,
          checkedIn: r.checked_in,
          smsSent: r.sms_sent,
          created_at: r.created_at,
          synced: true
        }));

        const local = getLocalRegistrations();
        const unSynced = local.filter(l => !l.synced);
        const merged = [...unSynced, ...mapped.filter(m => !unSynced.some(u => u.phone === m.phone))];
        localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
        return merged;
      }
    }
  } catch (err) {
    console.warn("Could not fetch remote registrations, using local cache:", err.message);
  }

  return getLocalRegistrations();
}

export async function checkInAttendee({ ticketCode, phone, dayLabel = 'Day 1' }) {
  try {
    const res = await fetch('/api/attendance', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ticketCode, phone, dayLabel })
    });
    if (res.ok) {
      const json = await res.json();
      return json;
    }
  } catch (e) {
    console.warn("Attendance API error, falling back to local:", e.message);
  }

  const local = getLocalRegistrations();
  const attendee = local.find(r => (ticketCode && r.ticketCode?.toLowerCase() === ticketCode.toLowerCase()) || (phone && r.phone === phone));
  if (!attendee) {
    return { success: false, error: 'Attendee not found' };
  }

  attendee.checkedIn = true;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(local));

  const attLogs = JSON.parse(localStorage.getItem(ATTENDANCE_KEY) || '[]');
  attLogs.unshift({
    ticket_code: attendee.ticketCode,
    full_name: attendee.fullName,
    phone: attendee.phone,
    day_label: dayLabel,
    checkin_time: new Date().toISOString()
  });
  localStorage.setItem(ATTENDANCE_KEY, JSON.stringify(attLogs));

  return { success: true, attendee, message: `Checked in locally for ${dayLabel}` };
}
