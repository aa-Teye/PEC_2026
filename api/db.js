import { neon } from '@neondatabase/serverless';

let sqlClient = null;

export function getDb() {
  const connectionString = process.env.DATABASE_URL || process.env.NEON_DATABASE_URL;
  if (!connectionString) {
    return null;
  }
  if (!sqlClient) {
    sqlClient = neon(connectionString);
  }
  return sqlClient;
}

export async function initDb() {
  const sql = getDb();
  if (!sql) {
    console.warn("DATABASE_URL not set. Skipping DB table creation.");
    return false;
  }

  try {
    // 1. Create registrations table
    await sql`
      CREATE TABLE IF NOT EXISTS pec_registrations (
        id SERIAL PRIMARY KEY,
        ticket_code VARCHAR(32) UNIQUE NOT NULL,
        title VARCHAR(32),
        full_name VARCHAR(255) NOT NULL,
        phone VARCHAR(64) NOT NULL,
        email VARCHAR(255),
        gender VARCHAR(32),
        age_group VARCHAR(64),
        member_status VARCHAR(64),
        first_timer VARCHAR(32),
        referral VARCHAR(128),
        attendance_days TEXT,
        attendance_mode VARCHAR(64),
        prayer_request TEXT,
        location VARCHAR(255),
        invited_by VARCHAR(255),
        needs_transport VARCHAR(32) DEFAULT 'no',
        sms_sent BOOLEAN DEFAULT FALSE,
        checked_in BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `;

    // 2. Create attendance check-in logs table
    await sql`
      CREATE TABLE IF NOT EXISTS pec_attendance_logs (
        id SERIAL PRIMARY KEY,
        ticket_code VARCHAR(32) NOT NULL,
        full_name VARCHAR(255),
        phone VARCHAR(64),
        day_label VARCHAR(128) NOT NULL,
        checkin_time TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        checkin_method VARCHAR(64) DEFAULT 'SCAN'
      );
    `;

    // 3. Create index for fast search
    await sql`
      CREATE INDEX IF NOT EXISTS idx_pec_reg_ticket ON pec_registrations (ticket_code);
    `;
    await sql`
      CREATE INDEX IF NOT EXISTS idx_pec_reg_phone ON pec_registrations (phone);
    `;

    return true;
  } catch (err) {
    console.error("Error initializing Neon database schema:", err);
    throw err;
  }
}
