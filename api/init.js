import { initDb, getDb } from './db.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  const sql = getDb();

  if (!sql) {
    return res.status(200).json({
      status: 'pending_configuration',
      message: 'DATABASE_URL is not set yet. Please provide your Neon connection string in .env or Vercel Environment Variables.'
    });
  }

  try {
    await initDb();
    const result = await sql`SELECT NOW() as current_time, version();`;
    return res.status(200).json({
      status: 'connected',
      message: 'Neon PostgreSQL database is connected and initialized successfully!',
      timestamp: result[0]?.current_time,
      version: result[0]?.version
    });
  } catch (err) {
    return res.status(500).json({
      status: 'error',
      message: 'Failed to connect to Neon database',
      error: err.message
    });
  }
}
