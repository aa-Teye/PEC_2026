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

  const searchParam = (req.query.query || req.query.code || req.query.phone || req.query.name || req.body?.query || req.body?.code || req.body?.phone || '').trim();

  if (!searchParam) {
    return res.status(400).json({ error: 'Search parameter required (ticket code, phone, or name)' });
  }

  try {
    await initDb();

    const q = `%${searchParam.toLowerCase()}%`;
    const rows = await sql`
      SELECT * FROM pec_registrations
      WHERE LOWER(ticket_code) = LOWER(${searchParam})
         OR phone = ${searchParam}
         OR phone LIKE ${q}
         OR LOWER(full_name) LIKE ${q}
      ORDER BY created_at DESC
      LIMIT 20
    `;

    if (!rows || rows.length === 0) {
      return res.status(404).json({
        valid: false,
        message: 'No attendee found for the provided code, phone, or name.'
      });
    }

    const attendee = rows[0];
    const checkins = await sql`
      SELECT day_label, checkin_time, checkin_method
      FROM pec_attendance_logs
      WHERE ticket_code = ${attendee.ticket_code}
      ORDER BY checkin_time DESC
    `;

    return res.status(200).json({
      valid: true,
      total: rows.length,
      attendee,
      attendees: rows,
      checkins
    });
  } catch (err) {
    console.error('Error verifying ticket:', err);
    return res.status(500).json({ error: err.message });
  }
}
