// Link previews (Telegram, WhatsApp, Signal, social): 1200×630 JPEG cards rendered from HTML in headless
// Chrome with the site's fonts. Messengers read only og:* tags and never run JavaScript, so the card has to
// say it on its own: live code, not video. Cached by the card's HTML, so unchanged cards are not rendered again.
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import puppeteer from 'puppeteer-core';
export const W=1200,H=630;
const esc=s=>String(s??'').replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const dataUrl=(file,type)=>`data:${type};base64,${fs.readFileSync(file).toString('base64')}`;
function fontFaces(fontsDir){
 const f=(name,file,extra='')=>`@font-face{font-family:'${name}';src:url(${dataUrl(path.join(fontsDir,file),'font/ttf')}) format('truetype');${extra}}`;
 return f('Michroma','Michroma-Regular.ttf')+f('Space Grotesk','SpaceGrotesk.ttf','font-weight:300 700;')+f('JetBrains Mono','JetBrainsMono.ttf','font-weight:100 800;');
}
const page=(fonts,body,css)=>`<!doctype html><html><head><meta charset="utf-8"><style>${fonts}
*{box-sizing:border-box}html,body{margin:0;width:${W}px;height:${H}px;overflow:hidden;background:#050b13;color:#eef6fa;font-family:'Space Grotesk',sans-serif}${css}</style></head><body>${body}</body></html>`;
// Home and album: a mosaic of frames computed by the live code, with the name and the claim.
export function collageCard({stills,fontsDir,count}){
 const tiles=stills.slice(0,10).map((s,i)=>`<div class="t t${i}" style="background-image:url(${dataUrl(s,'image/webp')})"></div>`).join('');
 return page(fontFaces(fontsDir),`<div class="grid">${tiles}</div><div class="shade"></div>
 <div class="txt"><div class="kick">SAMUEL HEINRICH · NETWORK ENGINEER</div><div class="name">KISOUND</div>
 <div class="claim">Live code, not video</div><div class="claim2">Live-Code statt Video</div>
 <div class="badge">&lt;/&gt; ${count} pieces · every frame computed in your browser</div></div>`,
 `.grid{position:absolute;inset:-6px;display:grid;grid-template-columns:repeat(5,1fr);grid-template-rows:repeat(2,1fr);gap:6px;transform:rotate(-4deg) scale(1.16)}
 .t{background-size:cover;background-position:center;filter:saturate(1.15)}
 .shade{position:absolute;inset:0;background:linear-gradient(90deg,rgba(3,7,13,.94) 0%,rgba(3,7,13,.82) 42%,rgba(3,7,13,.25) 75%,rgba(3,7,13,.1) 100%),linear-gradient(0deg,rgba(3,7,13,.55),transparent 40%)}
 .txt{position:absolute;left:64px;top:0;bottom:0;display:flex;flex-direction:column;justify-content:center;max-width:640px}
 .kick{font:600 17px 'JetBrains Mono',monospace;letter-spacing:.2em;color:#ffb36b}
 .name{font:400 112px/1 'Michroma',sans-serif;letter-spacing:.1em;margin:14px 0 18px;text-shadow:0 0 40px rgba(90,166,255,.45)}
 .claim{font:400 34px 'Michroma',sans-serif;color:#7fdcff;letter-spacing:.02em}.claim2{font:500 26px 'Space Grotesk',sans-serif;color:#b9cdda;margin-top:6px}
 .badge{margin-top:34px;align-self:flex-start;font:600 19px 'JetBrains Mono',monospace;color:#1b0f04;background:#ff9a3c;border-radius:6px;padding:8px 14px}`);
}
// Track: its own still full bleed, title, what the piece is, and the size of the code.
export function trackCard({still,fontsDir,title,label,kb,album}){
 return page(fontFaces(fontsDir),`<div class="bg" style="background-image:url(${dataUrl(still,'image/webp')})"></div><div class="shade"></div>
 <div class="top"><span class="brand">KISOUND</span><span class="tag">LIVE CODE · NOT A VIDEO</span></div>
 <div class="txt"><div class="kick">${esc(album)} · SAMUEL HEINRICH</div><div class="title">${esc(title)}</div><div class="label">${esc(label)}</div>
 <div class="badge">&lt;/&gt; ${kb} KB of code · 0 B of video</div></div>`,
 `.bg{position:absolute;inset:0;background-size:cover;background-position:center}
 .shade{position:absolute;inset:0;background:linear-gradient(0deg,rgba(3,7,13,.95) 0%,rgba(3,7,13,.7) 38%,rgba(3,7,13,.05) 70%),linear-gradient(180deg,rgba(3,7,13,.6),transparent 22%)}
 .top{position:absolute;left:48px;right:48px;top:34px;display:flex;justify-content:space-between;align-items:center}
 .brand{font:400 30px 'Michroma',sans-serif;letter-spacing:.18em}.tag{font:600 16px 'JetBrains Mono',monospace;letter-spacing:.14em;color:#1b0f04;background:#ff9a3c;border-radius:4px;padding:6px 12px}
 .txt{position:absolute;left:48px;right:48px;bottom:40px}
 .kick{font:600 16px 'JetBrains Mono',monospace;letter-spacing:.18em;color:#ffb36b;text-transform:uppercase}
 .title{font:400 ${title.length>22?58:72}px/1.05 'Michroma',sans-serif;margin:10px 0 10px;text-shadow:0 0 30px rgba(90,166,255,.4)}
 .label{font:500 28px 'Space Grotesk',sans-serif;color:#cfe0ea}
 .badge{display:inline-block;margin-top:18px;font:600 18px 'JetBrains Mono',monospace;color:#d8f6ff;background:rgba(5,11,19,.7);border:1px solid rgba(89,216,237,.7);border-radius:6px;padding:7px 12px}`);
}
export async function renderCards(cards,cacheDir){
 for(const c of cards)c.file=path.join(cacheDir,`share-${crypto.createHash('sha1').update(c.html).digest('hex').slice(0,16)}.jpg`);
 const todo=cards.filter(c=>!fs.existsSync(c.file));
 if(todo.length){
  const browser=await puppeteer.launch({executablePath:process.env.CHROME_PATH||'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:true});
  try{const p=await browser.newPage();await p.setViewport({width:W,height:H,deviceScaleFactor:1});
   for(const c of todo){await p.setContent(c.html,{waitUntil:'load'});await p.evaluate(()=>document.fonts.ready);await p.screenshot({path:c.file,type:'jpeg',quality:86});}}
  finally{await browser.close();}
 }
 return cards.map(c=>c.file);
}
