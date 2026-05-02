const { Client } = require('pg');
require('dotenv').config();

// 테스트할 다양한 연결 주소 목록 (DB 이름 변형 테스트)
const configs = [
  {
    name: "Pooler (Port 6543) - Project Ref as DB Name",
    connectionString: `postgresql://postgres:WithusAdmission@aws-0-ap-northeast-2.pooler.supabase.com:6543/jydfszxpekqpjzpepkgz?sslmode=require`
  },
  {
    name: "Pooler (Port 5432) - Project Ref as DB Name",
    connectionString: `postgresql://postgres:WithusAdmission@aws-0-ap-northeast-2.pooler.supabase.com:5432/jydfszxpekqpjzpepkgz?sslmode=require`
  }
];

async function testConnections() {
  for (const config of configs) {
    console.log(`\n--- Testing: ${config.name} ---`);
    const client = new Client({
      connectionString: config.connectionString,
      connectionTimeoutMillis: 10000,
      ssl: { rejectUnauthorized: false }
    });

    try {
      await client.connect();
      console.log("✅ Success!");
      const res = await client.query('SELECT current_user, current_database()');
      console.log("User/DB:", res.rows[0]);
      await client.end();
      return;
    } catch (err) {
      console.error("❌ Failed:", err.message);
      if (err.code) console.error("   Error Code:", err.code);
      if (err.detail) console.error("   Detail:", err.detail);
    }
  }
}

// 환경 변수 강제 설정
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
testConnections();
