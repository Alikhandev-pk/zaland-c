import https from 'https';
const urls = [
  'https://images.unsplash.com/photo-1583391733958-6115983630f5?q=80&w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1565547021-0a6f446059c2?q=80&w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1609505848912-36b334be0188?q=80&w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1500661156828-569d9c4c5a08?q=80&w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1583391733981-2292f7e77b67?q=80&w=600&auto=format&fit=crop'
];

urls.forEach(url => {
  https.get(url, (res) => {
    console.log(url, res.statusCode);
  });
});
