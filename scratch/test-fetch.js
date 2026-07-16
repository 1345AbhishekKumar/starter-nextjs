/* eslint-disable */
const host = 'ep-dry-smoke-atzlb15b-pooler.c-9.us-east-1.aws.neon.tech';
console.log('Resolving host via dns...');
require('dns').lookup(host, (err, address, family) => {
  console.log('Lookup result:', err, address, family);
  fetch(`https://${host}/sql`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query: 'SELECT 1;' }),
  })
    .then((res) => console.log('Fetch status:', res.status))
    .catch((err) => {
      console.error('Fetch failed:', err);
      if (err.cause) {
        console.error('Underlying cause:', err.cause);
      }
    });
});
