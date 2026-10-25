// Arkesel SMS Service for Ghanaian phone numbers (13,000+ active credits verified)
export async function sendRegistrationSms({ phone, fullName, ticketCode }) {
  const apiKey = process.env.SMS_API_KEY || process.env.ARKESEL_API_KEY || "aHZxQXN6YnBvUHFHRU9XaUdvZnQ";
  const senderId = process.env.SMS_SENDER_ID || "EOM";

  if (!phone) return { success: false, error: "No phone number provided" };

  // Normalize recipient phone number for Ghana (0244... -> 233244...)
  let recipient = String(phone).replace(/\s+/g, '').replace(/[-+()]/g, '');
  if (recipient.startsWith('0') && recipient.length === 10) {
    recipient = '233' + recipient.slice(1);
  } else if (recipient.length === 9 && !recipient.startsWith('233')) {
    recipient = '233' + recipient;
  }

  // Option 2: Warm & Formal - Strictly clamped to <= 160 characters for 1 CREDIT
  const staticSuffix = `, your PEC 2026 (THIS SAME JESUS) registration is confirmed! Ticket: ${ticketCode}. 23-29 Nov @ Overcomers, Tesano. Info: 0546363957`;
  const maxNameLen = Math.max(10, 160 - ('Dear '.length + staticSuffix.length));
  
  let cleanName = String(fullName || '').trim().replace(/\s+/g, ' ');
  let safeName = cleanName;
  if (cleanName.length > maxNameLen) {
    const parts = cleanName.split(' ');
    if (parts.length > 2) {
      const shortName = `${parts[0]} ${parts[parts.length - 1]}`;
      safeName = shortName.length <= maxNameLen ? shortName : parts[0].slice(0, maxNameLen);
    } else {
      safeName = cleanName.slice(0, maxNameLen);
    }
  }

  let message = `Dear ${safeName}${staticSuffix}`;
  if (message.length > 160) {
    message = message.slice(0, 160);
  }

  try {
    const url = "https://sms.arkesel.com/api/v2/sms/send";
    const payload = {
      sender: senderId.slice(0, 11),
      message: message,
      recipients: [recipient]
    };

    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'api-key': apiKey,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    const data = await res.json().catch(() => null);
    const isSuccess = res.ok && (data?.status === 'success' || res.status === 200);
    return { success: isSuccess, data };
  } catch (err) {
    console.error('[Arkesel SMS Dispatch Error]:', err.message);
    return { success: false, error: err.message };
  }
}
