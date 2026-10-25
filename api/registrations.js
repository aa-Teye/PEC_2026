import { getDb, initDb } from './db.js';
import { sendRegistrationSms } from './sms.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const sql = getDb();
  if (!sql) {
    return res.status(503).json({
      error: 'Database not configured',
      message: 'DATABASE_URL is not set in environment variables.'
    });
  }

  try {
    await initDb();

    // GET /api/registrations
    if (req.method === 'GET') {
      const { search, limit = 500, offset = 0 } = req.query;

      let rows;
      if (search && search.trim()) {
        const q = `%${search.trim().toLowerCase()}%`;
        rows = await sql`
          SELECT * FROM pec_registrations
          WHERE LOWER(full_name) LIKE ${q}
             OR LOWER(phone) LIKE ${q}
             OR LOWER(ticket_code) LIKE ${q}
             OR LOWER(COALESCE(email, '')) LIKE ${q}
          ORDER BY created_at DESC
          LIMIT ${Number(limit)} OFFSET ${Number(offset)}
        `;
      } else {
        rows = await sql`
          SELECT * FROM pec_registrations
          ORDER BY created_at DESC
          LIMIT ${Number(limit)} OFFSET ${Number(offset)}
        `;
      }

      const totalResult = await sql`SELECT COUNT(*) as count FROM pec_registrations`;
      const total = Number(totalResult[0]?.count || 0);

      return res.status(200).json({
        success: true,
        total,
        registrations: rows
      });
    }

    // POST /api/registrations
    if (req.method === 'POST') {
      const data = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;

      const {
        title = '',
        fullName,
        phone,
        email = '',
        gender = '',
        ageGroup = data.age || '',
        memberStatus = '',
        firstTimer = 'no',
        referral = '',
        attendanceDays = [],
        attendanceMode = 'In-Person',
        prayerRequest = '',
        location = '',
        invitedBy = '',
        needsTransport = 'no',
        ticketCode
      } = data;

      if (!fullName || !phone) {
        return res.status(400).json({
          error: 'Missing required fields',
          message: 'Full Name and Phone are required.'
        });
      }

      // Generate PEC ticket code
      const code = ticketCode || `PEC-${Math.floor(100000 + Math.random() * 900000)}`;
      const attendanceDaysStr = Array.isArray(attendanceDays) ? attendanceDays.join(', ') : (attendanceDays || '');

      // Check if registration already exists for this phone number
      const existing = await sql`
        SELECT * FROM pec_registrations WHERE phone = ${phone} LIMIT 1
      `;

      let targetRecord = null;
      let isDuplicate = false;

      if (existing && existing.length > 0) {
        isDuplicate = true;
        // Update any updated information
        const updated = await sql`
          UPDATE pec_registrations
          SET full_name = ${fullName},
              title = ${title},
              email = COALESCE(NULLIF(${email}, ''), email),
              gender = COALESCE(NULLIF(${gender}, ''), gender),
              member_status = COALESCE(NULLIF(${memberStatus}, ''), member_status),
              attendance_days = ${attendanceDaysStr},
              location = COALESCE(NULLIF(${location}, ''), location),
              updated_at = CURRENT_TIMESTAMP
          WHERE id = ${existing[0].id}
          RETURNING *;
        `;
        targetRecord = updated[0] || existing[0];
      } else {
        const inserted = await sql`
          INSERT INTO pec_registrations (
            ticket_code, title, full_name, phone, email, gender, age_group,
            member_status, first_timer, referral, attendance_days,
            attendance_mode, prayer_request, location, invited_by, needs_transport, sms_sent
          ) VALUES (
            ${code}, ${title}, ${fullName}, ${phone}, ${email}, ${gender}, ${ageGroup},
            ${memberStatus}, ${firstTimer}, ${referral}, ${attendanceDaysStr},
            ${attendanceMode}, ${prayerRequest}, ${location}, ${invitedBy}, ${needsTransport}, FALSE
          )
          RETURNING *;
        `;
        targetRecord = inserted[0];
      }

      // ALWAYS dispatch SMS confirmation to the attendee
      let smsResult = null;
      try {
        const attendeeFullName = `${targetRecord.title ? targetRecord.title + ' ' : ''}${targetRecord.full_name}`;
        smsResult = await sendRegistrationSms({
          phone: targetRecord.phone,
          fullName: attendeeFullName,
          ticketCode: targetRecord.ticket_code
        });

        if (smsResult && smsResult.success) {
          await sql`UPDATE pec_registrations SET sms_sent = TRUE WHERE id = ${targetRecord.id}`;
          targetRecord.sms_sent = true;
        }
      } catch (smsErr) {
        console.error('SMS notification error:', smsErr);
      }

      return res.status(isDuplicate ? 200 : 201).json({
        success: true,
        message: isDuplicate ? 'Registration updated and confirmation SMS sent' : 'Registration recorded successfully in Neon DB',
        isDuplicate,
        registration: targetRecord,
        smsResult
      });
    }

    // DELETE /api/registrations
    if (req.method === 'DELETE') {
      const { id, ticket_code } = req.query;
      if (id) {
        await sql`DELETE FROM pec_registrations WHERE id = ${Number(id)}`;
      } else if (ticket_code) {
        await sql`DELETE FROM pec_registrations WHERE ticket_code = ${ticket_code}`;
      } else {
        return res.status(400).json({ error: 'id or ticket_code required' });
      }
      return res.status(200).json({ success: true, message: 'Registration deleted' });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('API Error in /api/registrations:', error);
    return res.status(500).json({
      error: 'Internal Server Error',
      details: error.message
    });
  }
}
