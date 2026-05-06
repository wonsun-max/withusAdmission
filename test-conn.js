const { Client } = require('pg');
require('dotenv').config();

async function test() {
  // Use the one from process.env if set (by shell), otherwise .env
  const connectionString = process.env.DATABASE_URL;
  console.log("Testing connection to:", connectionString.replace(/:.*@/, ':****@'));
  
  const client = new Client({
    connectionString,
    ssl: { 
      rejectUnauthorized: false 
    }
  });

  try {
    await client.connect();
    console.log("✅ Connection successful!");
    const res = await client.query('SELECT NOW()');
    console.log("Result:", res.rows[0]);
    await client.end();
  } catch (err) {
    console.error("❌ Connection failed:", err.message);
    if (err.detail) console.error("Detail:", err.detail);
    if (err.code) console.error("Code:", err.code);
  }
}

test();
