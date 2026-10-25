// mNotify SMS Service for Ghana phone numbers
export async function sendRegistrationSms({ phone, fullName, ticketCode }) {
  const apiKey = process.env.MNOTIFY_API_KEY || "aHZxQXN6YnBvUHFHRU9XaUdvZnQ";
  const senderId = process.env.SMS_SENDER_ID || "OVERCOMERS";

  if (!phone) return { success: false, error: "No phone number provided" };

  // Format recipient phone number for Ghana (e.g., 0244123456 -> 233244123456)
  let recipient = String(phone).replace(/\s+/g, '').replace(/[-+]/g, '');
  if (recipient.startsWith('0') && recipient.length === 10) {
    recipient = '233' + recipient.slice(1);
  }

  const message = `Dear ${fullName}, your registration for PEC: THIS SAME JESUS (Acts 1:11) is confirmed! Ticket: ${ticketCode}. Dates: 23-29 Oct @ Overcomers Nation Church, Tesano. Enquiries: 0546363957`;

  try {
    const url = `https://api.mnotify.com/api/sms/quick?key=${apiKey}`;
    const payload = {
      "recipient[]": [recipient],
      sender: senderId.slice(0, 11),
      message: message,
      is_schedule: false
    };

    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    const data = await res.json().catch(() => null);
    return { success: res.ok, data };
  } catch (err) {
    console.error('[SMS Dispatch Error]:', err.message);
    return { success: false, error: err.message };
  }
}
