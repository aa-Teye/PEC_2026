import { getDb, initDb } from './db.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') return res.status(200).end();

  const sql = getDb();
  if (!sql) {
    return res.status(503).json({ error: 'Database not configured' });
  }

  try {
    await initDb();

    // GET /api/attendance
    if (req.method === 'GET') {
      const { day } = req.query;
      let logs;
      if (day) {
        logs = await sql`
          SELECT * FROM pec_attendance_logs
          WHERE day_label = ${day}
          ORDER BY checkin_time DESC
        `;
      } else {
        logs = await sql`
          SELECT * FROM pec_attendance_logs
          ORDER BY checkin_time DESC
          LIMIT 300
        `;
      }

      // Day breakdown
      const summary = await sql`
        SELECT day_label, COUNT(*) as count
        FROM pec_attendance_logs
        GROUP BY day_label
        ORDER BY count DESC
      `;

      return res.status(200).json({
        success: true,
        summary,
        logs
      });
    }

    // POST /api/attendance (Check-in attendee)
    if (req.method === 'POST') {
      const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
      const { ticketCode, phone, dayLabel = 'Day 1', checkinMethod = 'SCAN' } = body;

      if (!ticketCode && !phone) {
        return res.status(400).json({ error: 'Ticket code or phone number is required' });
      }

      // Lookup attendee in registrations
      let attendee;
      if (ticketCode) {
        const found = await sql`SELECT * FROM pec_registrations WHERE LOWER(ticket_code) = LOWER(${ticketCode}) LIMIT 1`;
        attendee = found[0];
      } else {
        const found = await sql`SELECT * FROM pec_registrations WHERE phone = ${phone} LIMIT 1`;
        attendee = found[0];
      }

      if (!attendee) {
        return res.status(404).json({
          success: false,
          error: 'Attendee Not Found',
          message: 'No registration matches this ticket code or phone.'
        });
      }

      // Check if already checked in for this specific day
      const alreadyChecked = await sql`
        SELECT * FROM pec_attendance_logs
        WHERE ticket_code = ${attendee.ticket_code} AND day_label = ${dayLabel}
        LIMIT 1
      `;

      if (alreadyChecked.length > 0) {
        return res.status(200).json({
          success: true,
          alreadyCheckedIn: true,
          message: `Already checked in for ${dayLabel}`,
          attendee,
          checkedAt: alreadyChecked[0].checkin_time
        });
      }

      // Record check-in log
      const log = await sql`
        INSERT INTO pec_attendance_logs (
          ticket_code, full_name, phone, day_label, checkin_method
        ) VALUES (
          ${attendee.ticket_code}, ${attendee.full_name}, ${attendee.phone}, ${dayLabel}, ${checkinMethod}
        )
        RETURNING *;
      `;

      // Update attendee checked_in flag
      await sql`
        UPDATE pec_registrations
        SET checked_in = TRUE, updated_at = CURRENT_TIMESTAMP
        WHERE id = ${attendee.id}
      `;

      return res.status(200).json({
        success: true,
        alreadyCheckedIn: false,
        message: `Successfully checked in for ${dayLabel}!`,
        attendee,
        log: log[0]
      });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    console.error('Error in /api/attendance:', err);
    return res.status(500).json({ error: err.message });
  }
}
