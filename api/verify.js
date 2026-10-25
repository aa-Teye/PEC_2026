import { getDb, initDb } from './db.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');

  if (req.method === 'OPTIONS') return res.status(200).end();

  const sql = getDb();
  if (!sql) {
    return res.status(503).json({ error: 'Database not configured' });
  }

  const queryCode = req.query.code || req.body?.code;
  const queryPhone = req.query.phone || req.body?.phone;

  if (!queryCode && !queryPhone) {
    return res.status(400).json({ error: 'Ticket code or phone parameter required' });
  }

  try {
    await initDb();

    let attendee;
    if (queryCode) {
      const rows = await sql`
        SELECT * FROM pec_registrations
        WHERE LOWER(ticket_code) = LOWER(${queryCode.trim()})
        LIMIT 1
      `;
      attendee = rows[0];
    } else {
      const rows = await sql`
        SELECT * FROM pec_registrations
        WHERE phone = ${queryPhone.trim()}
        LIMIT 1
      `;
      attendee = rows[0];
    }

    if (!attendee) {
      return res.status(404).json({
        valid: false,
        message: 'No attendee found for the provided code or phone.'
      });
    }

    const checkins = await sql`
      SELECT day_label, checkin_time, checkin_method
      FROM pec_attendance_logs
      WHERE ticket_code = ${attendee.ticket_code}
      ORDER BY checkin_time DESC
    `;

    return res.status(200).json({
      valid: true,
      attendee,
      checkins
    });
  } catch (err) {
    console.error('Error verifying ticket:', err);
    return res.status(500).json({ error: err.message });
  }
}
