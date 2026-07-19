const dns = require('dns');

function lookup(host) {
  return new Promise((resolve) => {
    dns.lookup(host, (err, address, family) => {
      if (err) {
        resolve(`FAILED: ${err.message}`);
      } else {
        resolve(`SUCCESS: ${address} (IPv${family})`);
      }
    });
  });
}

async function run() {
  const hosts = [
    'yyjqwlkbrqwqrzcmexqm.supabase.co',
    'db.yyjqwlkbrqwqrzcmexqm.supabase.co',
    'aws-0-ap-northeast-1.pooler.supabase.com',
    'aws-0-ap-southeast-1.pooler.supabase.com'
  ];

  for (const host of hosts) {
    const res = await lookup(host);
    console.log(`${host} -> ${res}`);
  }
}

run();
