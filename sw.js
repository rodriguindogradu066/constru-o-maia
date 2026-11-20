// Funciona offline: guarda o sistema e as bibliotecas no aparelho
const CACHE='maia-v1-5';
const SHELL=['./','./index.html','./manifest.json','./icon-192.png','./icon-512.png','./logo.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(SHELL)));self.skipWaiting();});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==CACHE).map(x=>caches.delete(x)))));self.clients.claim();});
self.addEventListener('fetch',e=>{
  const u=new URL(e.request.url);
  if(e.request.method!=='GET'||u.hostname.includes('script.google')) return;
  const lib=/unpkg\.com|cdnjs\.cloudflare\.com|fonts\.(googleapis|gstatic)\.com/.test(u.hostname);
  if(lib){ e.respondWith(caches.match(e.request).then(r=>r||fetch(e.request).then(res=>{const c=res.clone();caches.open(CACHE).then(x=>x.put(e.request,c));return res;}))); return; }
  if(u.origin===location.origin){ e.respondWith(fetch(e.request).then(res=>{const c=res.clone();caches.open(CACHE).then(x=>x.put(e.request,c));return res;}).catch(()=>caches.match(e.request).then(r=>r||caches.match('./index.html')))); }
});
