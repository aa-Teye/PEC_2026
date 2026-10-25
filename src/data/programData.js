// Central data store for PEC - THIS SAME JESUS (Acts 1:11)
export const STORAGE_KEY = 'PEC_REGISTRATIONS_DATA';
export const ATTENDANCE_KEY = 'PEC_ATTENDANCE_DATA';

export const PROGRAM_DATA = {
  name: "PEC",
  fullName: "PROPHETIC ENCOUNTER CONVENTION",
  theme: "THIS SAME JESUS",
  scripture: "Acts 1:11",
  scriptureText: "This same Jesus, which is taken up from you into heaven, shall so come in like manner as ye have seen him go into heaven.",
  tagline: "Experience the Miraculous, Healing and Transformative Power of Christ",
  subTheme: "The Lord who walked Galilee still heals, delivers, and establishes His people today.",
  date: "23rd – 29th October",
  datesFormatted: "23 - 29 OCTOBER",
  time: "Mon - Thu: 6:00pm | Fri All Night: 8:00pm | Sun: 8:00am",
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
    dayLabel: "Day 1: 23 Oct",
    date: "23 Oct",
    time: "6:00 PM",
    sessionTitle: "Opening Impartation Service",
    theme: "This Same Jesus: The Resurrection & Life",
    category: "Prophetic Word & Opening Encounter",
    badgeColor: "from-amber-500 to-amber-700",
    description: "Launch into 7 days of supernatural glory. Unveiling Christ in His power and sovereign might."
  },
  {
    id: 2,
    dayNumber: "Day 2",
    dayLabel: "Day 2: 24 Oct",
    date: "24 Oct",
    time: "6:00 PM",
    sessionTitle: "Divine Deliverance Night",
    theme: "Breaking Ancient Yokes & Generational Chains",
    category: "Deliverance & Breakthrough",
    badgeColor: "from-red-600 to-rose-700",
    description: "Experience total liberty as Jesus breaks every heavy burden and frees captive souls."
  },
  {
    id: 3,
    dayNumber: "Day 3",
    dayLabel: "Day 3: 25 Oct",
    date: "25 Oct",
    time: "6:00 PM",
    sessionTitle: "Supernatural Healing & Miracles",
    theme: "The Healer Is in the Room",
    category: "Healing School & Signs",
    badgeColor: "from-emerald-600 to-teal-700",
    description: "Manifestation of miraculous healings, creative miracles, and instantaneous cures."
  },
  {
    id: 4,
    dayNumber: "Day 4",
    dayLabel: "Day 4: 26 Oct",
    date: "26 Oct",
    time: "6:00 PM",
    sessionTitle: "Financial Dominion & Open Doors",
    theme: "Supernatural Provision & Favor",
    category: "Anointing & Prosperity",
    badgeColor: "from-yellow-500 to-amber-600",
    description: "Unlocking supernatural opportunities, wealth transfers, and debt cancellation."
  },
  {
    id: 5,
    dayNumber: "Day 5",
    dayLabel: "Day 5: 27 Oct",
    date: "27 Oct",
    time: "8:00 PM",
    sessionTitle: "GREAT ALL-NIGHT VIGIL",
    theme: "Night of Wonders & Fire of God",
    category: "Prophetic All-Night",
    badgeColor: "from-orange-600 to-red-700",
    description: "Power-packed vigil from 8:00 PM till dawn! Fervent warfare, angelic encounters and fire impartation."
  },
  {
    id: 6,
    dayNumber: "Day 6",
    dayLabel: "Day 6: 28 Oct",
    date: "28 Oct",
    time: "6:00 PM",
    sessionTitle: "Family, Destiny & Restoration",
    theme: "Restoring the Years the Locust Has Eaten",
    category: "Restoration & Anointing",
    badgeColor: "from-purple-600 to-indigo-700",
    description: "Total recovery for families, marriages, businesses, and wounded spirits."
  },
  {
    id: 7,
    dayNumber: "Day 7",
    dayLabel: "Day 7: 29 Oct",
    date: "29 Oct",
    time: "8:00 AM",
    sessionTitle: "GRAND FINALE CELEBRATION",
    theme: "Supernatural Seal & Crown of Glory",
    category: "Grand Finale & Thanksgiving",
    badgeColor: "from-amber-400 via-yellow-500 to-amber-700",
    finale: true,
    description: "Glorious climax, special impartation oil service, prophetic mantle transmission and praise explosion."
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
    platform: "Facebook",
    handle: "Overcomers Nation",
    url: "https://www.facebook.com/EbenezerOkronipa",
    color: "#1877F2",
    badge: "Live Streams",
    desc: "Join our official Facebook page for live streaming & updates"
  },
  {
    id: 2,
    platform: "YouTube",
    handle: "Overcomers nation church",
    url: "https://youtube.com/@revdrebenezerokronipa",
    color: "#FF0000",
    badge: "HD Broadcasts",
    desc: "Watch live broadcasts, sermons, and faith messages"
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

// Client-side direct SMS dispatcher via mNotify
async function dispatchDirectSms(phone, name, code) {
  try {
    let recipient = String(phone).replace(/\s+/g, '').replace(/[-+]/g, '');
    if (recipient.startsWith('0') && recipient.length === 10) {
      recipient = '233' + recipient.slice(1);
    }
    const message = `Dear ${name}, your registration for PEC: THIS SAME JESUS (Acts 1:11) is confirmed! Ticket: ${code}. Dates: 23-29 Oct @ Overcomers Nation Church, Tesano. Enquiries: 0546363957`;

    await fetch('https://api.mnotify.com/api/sms/quick?key=aHZxQXN6YnBvUHFHRU9XaUdvZnQ', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        "recipient[]": [recipient],
        sender: "OVERCOMERS",
        message: message,
        is_schedule: false
      })
    });
  } catch (err) {
    console.warn("Client SMS dispatch:", err.message);
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
