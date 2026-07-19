const { PrismaClient } = require('@prisma/client');

async function testUrl(url, label) {
  console.log(`\n--- Testing ${label} ---`);
  console.log(`URL: ${url}`);
  const prisma = new PrismaClient({
    datasources: {
      db: {
        url: url
      }
    }
  });

  try {
    const start = Date.now();
    await prisma.$queryRaw`SELECT 1`;
    console.log(`SUCCESS! Connected in ${Date.now() - start}ms`);
    return true;
  } catch (error) {
    console.log(`FAILED:`, error.message || error);
    return false;
  } finally {
    await prisma.$disconnect();
  }
}

async function run() {
  const password = "Qmian2117@gmail.com";
  const user = "postgres.yyjqwlkbrqwqrzcmexqm";
  
  // URL encoded password
  const encPassword = encodeURIComponent(password);

  // 1. Direct host, port 5432
  await testUrl(
    `postgresql://${user}:${encPassword}@db.yyjqwlkbrqwqrzcmexqm.supabase.co:5432/postgres`,
    "Direct Connection (db.yyjqwlkbrqwqrzcmexqm.supabase.co:5432)"
  );

  // 2. Pooler host, port 6543 (transaction pooling)
  await testUrl(
    `postgresql://${user}:${encPassword}@aws-0-ap-northeast-1.pooler.supabase.com:6543/postgres?pgbouncer=true`,
    "Pooler Transaction Mode (aws-0-ap-northeast-1.pooler.supabase.com:6543)"
  );

  // 3. Pooler host, port 5432 (session pooling)
  await testUrl(
    `postgresql://${user}:${encPassword}@aws-0-ap-northeast-1.pooler.supabase.com:5432/postgres`,
    "Pooler Session Mode (aws-0-ap-northeast-1.pooler.supabase.com:5432)"
  );
}

run();
