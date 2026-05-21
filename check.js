import https from 'https';

const code = (url) => new Promise(resolve => https.get(url, (res) => resolve(res.statusCode)));

async function run() {
  console.log(await code('https://images.unsplash.com/photo-1583391733958-6115983630f5'));
  console.log(await code('https://images.unsplash.com/photo-1565547021-0a6f446059c2'));
  console.log(await code('https://images.unsplash.com/photo-1609505848912-36b334be0188'));
  console.log(await code('https://images.unsplash.com/photo-1500661156828-569d9c4c5a08'));
}
run();
