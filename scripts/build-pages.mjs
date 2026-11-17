import {cp,mkdir,readFile,writeFile} from 'node:fs/promises';
const base='/xvex-site-preview';
await mkdir('dist',{recursive:true});await cp('public','dist',{recursive:true});
let html=await readFile('public/index.html','utf8');
html=html.replace(/(href|src)="\/(?!\/)/g,`$1="${base}/`);
html=html.replace('<title>',`<script src="${base}/pages-runtime.js"></script><title>`);
await writeFile('dist/index.html',html);await writeFile('dist/404.html',html);
for(const page of ['download','help','sync','login','register','account','connect','admin','confirm-email','forgot-password','reset-password']){await mkdir('dist/'+page,{recursive:true});await writeFile('dist/'+page+'/index.html',html)}
let js=await readFile('public/site.js','utf8');js=js.replace('const path = location.pathname;',`const path = location.pathname.slice(${base.length}).replace(/\/$/,'') || '/';`);await writeFile('dist/site.js',js);
let css=await readFile('public/style.css','utf8');css=css.replace(/url\((["']?)\/assets\//g,`url($1${base}/assets/`);await writeFile('dist/style.css',css);
await writeFile('dist/pages-runtime.js',`(()=>{const base=${JSON.stringify(base)};const fix=()=>{for(const e of document.querySelectorAll('[href],[src]'))for(const a of ['href','src']){const v=e.getAttribute(a);if(v==='/download/windows'){e.setAttribute(a,'https://github.com/TheXilliX/xvex-updates/releases/latest');continue}if(v?.startsWith('/')&&!v.startsWith('//')&&!v.startsWith(base+'/'))e.setAttribute(a,base+v)}};new MutationObserver(fix).observe(document.documentElement,{childList:true,subtree:true});document.addEventListener('DOMContentLoaded',fix);const request=window.fetch.bind(window);window.fetch=(url,args)=>String(url).startsWith('/api/')?Promise.resolve(new Response(JSON.stringify({error:'Это публичный предпросмотр сайта. Для аккаунтов и синхронизации нужен сервер.'}),{status:503,headers:{'content-type':'application/json'}})):request(url,args)})();`);