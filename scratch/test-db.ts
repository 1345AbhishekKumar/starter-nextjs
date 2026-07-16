import dns from 'dns';
import { URL } from 'url';
import { serverEnv } from '../config/env.server';

async function diagnose() {
  const dbUrl = serverEnv.DATABASE_URL;
  if (!dbUrl) {
    console.error('❌ DATABASE_URL is empty or not configured.');
    return;
  }

  console.log('Parsing DATABASE_URL...');
  let host = '';
  try {
    // Handle typical connection strings: postgres://user:pass@host:port/db
    const parsed = new URL(dbUrl);
    host = parsed.hostname;
    console.log(`✅ Host parsed successfully: ${host}`);
  } catch (e) {
    console.error('❌ Failed to parse DATABASE_URL as a valid URL:', e);
    return;
  }

  console.log(`\nResolving DNS for ${host}...`);
  dns.lookup(host, (err, address, family) => {
    if (err) {
      console.error(`❌ DNS lookup failed: ${err.message} (${err.code})`);
      console.log(
        'This means your system cannot resolve the IP address of the Neon database host. Check your internet connection or DNS/VPN settings.',
      );
    } else {
      console.log(
        `✅ DNS resolved successfully! IP: ${address} (IPv${family})`,
      );

      console.log('\nTesting HTTP fetch to Neon endpoint...');
      // Neon HTTP API endpoint is basically https://host/sql
      const fetchUrl = `https://${host}/sql`;
      fetch(fetchUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: 'SELECT 1;' }),
      })
        .then(async (res) => {
          console.log(`✅ Fetch response received with status: ${res.status}`);
          if (res.status === 401 || res.status === 400 || res.status === 200) {
            console.log(
              '✅ The network request successfully reached Neon servers! (HTTP status expected since auth is not fully passed standardly).',
            );
          } else {
            console.log(`⚠️ Neon returned status: ${res.status}`);
          }
        })
        .catch((fetchErr) => {
          console.error('❌ Fetch failed with error:');
          console.error(fetchErr);
          if (fetchErr.cause) {
            console.error('Underlying cause:', fetchErr.cause);
          }
        });
    }
  });
}

diagnose();
