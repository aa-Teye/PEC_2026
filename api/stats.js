import { getDb, initDb } from './db.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');

  if (req.method === 'OPTIONS') return res.status(200).end();

  const sql = getDb();
  if (!sql) {
    return res.status(503).json({ error: 'Database not configured' });
  }

  try {
    await initDb();

    // 1. Total counts
    const totalRegs = await sql`SELECT COUNT(*) as count FROM pec_registrations`;
    const checkedInCount = await sql`SELECT COUNT(DISTINCT ticket_code) as count FROM pec_attendance_logs`;
    const firstTimers = await sql`SELECT COUNT(*) as count FROM pec_registrations WHERE LOWER(first_timer) IN ('yes', 'true', '1')`;
    const transportNeeded = await sql`SELECT COUNT(*) as count FROM pec_registrations WHERE LOWER(needs_transport) IN ('yes', 'true', '1')`;

    // 2. Breakdown by member status
    const memberBreakdown = await sql`
      SELECT COALESCE(NULLIF(member_status, ''), 'Unspecified') as label, COUNT(*) as count
      FROM pec_registrations
      GROUP BY label
      ORDER BY count DESC
    `;

    // 3. Breakdown by day attendance
    const attendanceByDay = await sql`
      SELECT day_label, COUNT(*) as count
      FROM pec_attendance_logs
      GROUP BY day_label
      ORDER BY day_label ASC
    `;

    return res.status(200).json({
      success: true,
      stats: {
        totalRegistrations: Number(totalRegs[0]?.count || 0),
        totalCheckedIn: Number(checkedInCount[0]?.count || 0),
        firstTimers: Number(firstTimers[0]?.count || 0),
        transportNeeded: Number(transportNeeded[0]?.count || 0),
        memberBreakdown,
        attendanceByDay
      }
    });
  } catch (err) {
    console.error('Error in /api/stats:', err);
    return res.status(500).json({ error: err.message });
  }
}
