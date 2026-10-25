// Arkesel SMS Service for Ghanaian phone numbers (13,000+ active credits verified)
export async function sendRegistrationSms({ phone, fullName, ticketCode }) {
  const apiKey = process.env.SMS_API_KEY || process.env.ARKESEL_API_KEY || "aHZxQXN6YnBvUHFHRU9XaUdvZnQ";
  const senderId = process.env.SMS_SENDER_ID || "OVERCOMERS";

  if (!phone) return { success: false, error: "No phone number provided" };

  // Normalize recipient phone number for Ghana (0244... -> 233244...)
  let recipient = String(phone).replace(/\s+/g, '').replace(/[-+]/g, '');
  if (recipient.startsWith('0') && recipient.length === 10) {
    recipient = '233' + recipient.slice(1);
  }

  const message = `Dear ${fullName}, your registration for PEC: THIS SAME JESUS (Acts 1:11) is confirmed! Ticket: ${ticketCode}. Dates: 23-29 Nov @ Overcomers Nation Church, Tesano. Info: 0546363957`;

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
