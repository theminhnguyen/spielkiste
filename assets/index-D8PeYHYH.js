(function(){let e=document.createElement(`link`).relList;if(e&&e.supports&&e.supports(`modulepreload`))return;for(let e of document.querySelectorAll(`link[rel="modulepreload"]`))n(e);new MutationObserver(e=>{for(let t of e)if(t.type===`childList`)for(let e of t.addedNodes)e.tagName===`LINK`&&e.rel===`modulepreload`&&n(e)}).observe(document,{childList:!0,subtree:!0});function t(e){let t={};return e.integrity&&(t.integrity=e.integrity),e.referrerPolicy&&(t.referrerPolicy=e.referrerPolicy),t.credentials=e.crossOrigin===`use-credentials`?`include`:e.crossOrigin===`anonymous`?`omit`:`same-origin`,t}function n(e){if(e.ep)return;e.ep=!0;let n=t(e);fetch(e.href,n)}})();var e=null,t=null,n=!1,r=null,i=null;function a(){if(e)return e;try{let r=window.AudioContext??window.webkitAudioContext;return r?(e=new r,e.onstatechange=()=>{e?.state===`running`&&(n=!0)},t=e.createGain(),t.gain.value=u(),t.connect(e.destination),e):(i=`AudioContext wird vom Browser nicht unterstützt`,null)}catch(t){return i=t instanceof Error?t.message:String(t),e=null,null}}function o(){let e=new Uint8Array(45),t=new DataView(e.buffer),n=(e,n)=>{for(let r=0;r<n.length;r++)t.setUint8(e+r,n.charCodeAt(r))};n(0,`RIFF`),t.setUint32(4,37,!0),n(8,`WAVE`),n(12,`fmt `),t.setUint32(16,16,!0),t.setUint16(20,1,!0),t.setUint16(22,1,!0),t.setUint32(24,8e3,!0),t.setUint32(28,8e3,!0),t.setUint16(32,1,!0),t.setUint16(34,8,!0),n(36,`data`),t.setUint32(40,1,!0),t.setUint8(44,128);let r=``;return e.forEach(e=>r+=String.fromCharCode(e)),`data:audio/wav;base64,${btoa(r)}`}function s(){if(!n)try{let e=a();if(!e)return;e.state===`running`?n=!0:e.state===`closed`?i=`AudioContext im Zustand "${e.state}"`:e.resume().then(()=>{e.state===`running`&&(n=!0)}).catch(t=>{i=`resume() abgelehnt (Zustand war "${e.state}"): ${t instanceof Error?t.message:String(t)}`}),r||(r=new Audio(o()),r.volume=.01,r.setAttribute(`playsinline`,`true`));try{r.currentTime=0}catch{}r.play().catch(e=>{i=`stilles <audio> abgelehnt: ${e instanceof Error?e.message:String(e)}`})}catch(e){i=e instanceof Error?`${e.name}: ${e.message}`:String(e)}}function c(){let t=[];t.push(e?`Status: ${e.state}`:`Status: noch nicht gestartet`),t.push(n?`freigeschaltet: ja`:`freigeschaltet: nein`),t.push(`Lautstärke: ${Math.round(l*100)}%`);let r=!!(window.AudioContext??window.webkitAudioContext);return t.push(`AudioContext unterstützt: ${r?`ja`:`nein`}`),i&&t.push(`letzter Fehler: ${i}`),t.join(` · `)}var l=.6;function u(){return l}function d(e){l=Math.max(0,Math.min(1,e)),t&&(t.gain.value=l)}function f(){return!!e&&e.state===`running`}var p=[261.63,293.66,329.63,392,440,523.25,587.33,659.25];function m(n){let r=e;if(!r||!t||r.state!==`running`)return;let{freq:i,duration:a=.5,attack:o=.02,release:s=.35,type:c=`sine`,gain:l=.5}=n,u=r.createOscillator();u.type=c,u.frequency.value=i;let d=r.createGain();d.gain.setValueAtTime(0,r.currentTime),d.gain.linearRampToValueAtTime(l,r.currentTime+o),d.gain.linearRampToValueAtTime(0,r.currentTime+o+a+s),u.connect(d),d.connect(t),u.start(),u.stop(r.currentTime+o+a+s+.05)}function h(e=440){m({freq:e,duration:.03,attack:.002,release:.08,type:`triangle`,gain:.3})}function ee(n,r=.28){let i=e;if(!i||!t||i.state!==`running`)return null;let a=i.createOscillator();a.type=`sine`,a.frequency.value=n;let o=i.createGain();o.gain.setValueAtTime(0,i.currentTime),o.gain.linearRampToValueAtTime(r,i.currentTime+.05),a.connect(o),o.connect(t),a.start();let s=!1;return{update(e){s||a.frequency.linearRampToValueAtTime(e,i.currentTime+.06)},stop(){s||(s=!0,o.gain.cancelScheduledValues(i.currentTime),o.gain.setValueAtTime(o.gain.value,i.currentTime),o.gain.linearRampToValueAtTime(0,i.currentTime+.15),a.stop(i.currentTime+.2))}}}var te=null;function ne(e){if(te)return te;let t=e.sampleRate*.5,n=e.createBuffer(1,t,e.sampleRate),r=n.getChannelData(0);for(let e=0;e<t;e++)r[e]=Math.random()*2-1;return te=n,n}function re(n){let r=e;if(!r||!t||r.state!==`running`)return;let i=r.createBufferSource();i.buffer=ne(r);let a=r.createBiquadFilter();a.type=`bandpass`,a.Q.value=8;let o=n?700:2200,s=n?2200:700;a.frequency.setValueAtTime(o,r.currentTime),a.frequency.linearRampToValueAtTime(s,r.currentTime+.35);let c=r.createGain();c.gain.setValueAtTime(0,r.currentTime),c.gain.linearRampToValueAtTime(.18,r.currentTime+.03),c.gain.linearRampToValueAtTime(0,r.currentTime+.38),i.connect(a),a.connect(c),c.connect(t),i.start(),i.stop(r.currentTime+.4)}function ie(n,r=.4,i=.55){let a=e;if(!a||!t||a.state!==`running`)return;let o=a.currentTime,s=Math.max(.001,r),c=a.createOscillator();c.type=`sine`,c.frequency.setValueAtTime(n*2.2,o),c.frequency.exponentialRampToValueAtTime(n,o+.07);let l=a.createGain();l.gain.setValueAtTime(1e-4,o),l.gain.exponentialRampToValueAtTime(s,o+.006),l.gain.exponentialRampToValueAtTime(1e-4,o+i),c.connect(l),l.connect(t),c.start(o),c.stop(o+i+.05);let u=a.createOscillator();u.type=`triangle`,u.frequency.setValueAtTime(n*4,o),u.frequency.exponentialRampToValueAtTime(n*2,o+.05);let d=a.createGain();d.gain.setValueAtTime(1e-4,o),d.gain.exponentialRampToValueAtTime(s*.35,o+.005),d.gain.exponentialRampToValueAtTime(1e-4,o+i*.45),u.connect(d),d.connect(t),u.start(o),u.stop(o+i*.45+.05);let f=a.createBufferSource();f.buffer=ne(a);let p=a.createBiquadFilter();p.type=`lowpass`,p.frequency.value=900;let m=a.createGain();m.gain.setValueAtTime(s*.5,o),m.gain.exponentialRampToValueAtTime(1e-4,o+.08),f.connect(p),p.connect(m),m.connect(t),f.start(o,Math.random()*.3),f.stop(o+.1)}function ae(n,r=.25){let i=e;if(!i||!t||i.state!==`running`)return;let a=i.currentTime,o=i.createOscillator();o.type=`sine`,o.frequency.setValueAtTime(n*1.8,a),o.frequency.exponentialRampToValueAtTime(n,a+.04);let s=i.createGain();s.gain.setValueAtTime(1e-4,a),s.gain.exponentialRampToValueAtTime(Math.max(.001,r),a+.004),s.gain.exponentialRampToValueAtTime(1e-4,a+.22),o.connect(s),s.connect(t),o.start(a),o.stop(a+.26)}function oe(n=.15,r=.3){let i=e;if(!i||!t||i.state!==`running`)return;let a=i.currentTime,o=i.createBufferSource();o.buffer=ne(i);let s=i.createBiquadFilter();s.type=`highpass`,s.frequency.value=1800;let c=i.createBiquadFilter();c.type=`bandpass`,c.frequency.value=3e3+Math.random()*2e3,c.Q.value=.7;let l=i.createGain();l.gain.setValueAtTime(0,a);for(let e=0;e<8;e++){let t=a+r*e/8,i=1-e/8;l.gain.linearRampToValueAtTime(n*i*(.4+Math.random()*.6),t+.012)}l.gain.linearRampToValueAtTime(0,a+r+.04),o.connect(s),s.connect(c),c.connect(l),l.connect(t),o.start(a,Math.random()*Math.max(0,.5-r-.05)),o.stop(a+r+.06)}function g(n,r,i,a=.2,o=`sine`){let s=e;if(!s||!t||s.state!==`running`)return;let c=s.currentTime,l=s.createOscillator();l.type=o,l.frequency.setValueAtTime(n,c),l.frequency.exponentialRampToValueAtTime(r,c+i);let u=s.createGain();u.gain.setValueAtTime(1e-4,c),u.gain.exponentialRampToValueAtTime(Math.max(.001,a),c+Math.min(.03,i/3)),u.gain.exponentialRampToValueAtTime(1e-4,c+i+.08),l.connect(u),u.connect(t),l.start(c),l.stop(c+i+.12)}function se(){return e&&e.state===`running`?e.currentTime:null}function ce(n,r,i=.18){let a=e;if(!a||!t||a.state!==`running`)return;let o=Math.max(r,a.currentTime),s=Math.max(.001,i),c=a.createOscillator();c.type=`sine`,c.frequency.value=n;let l=a.createGain();l.gain.setValueAtTime(1e-4,o),l.gain.exponentialRampToValueAtTime(s,o+.004),l.gain.exponentialRampToValueAtTime(1e-4,o+1.4),c.connect(l),l.connect(t),c.start(o),c.stop(o+1.45);let u=a.createOscillator();u.type=`sine`,u.frequency.value=n*4.02;let d=a.createGain();d.gain.setValueAtTime(1e-4,o),d.gain.exponentialRampToValueAtTime(s*.25,o+.002),d.gain.exponentialRampToValueAtTime(1e-4,o+.18),u.connect(d),d.connect(t),u.start(o),u.stop(o+.2)}function _(){let n=e;if(!n||!t||n.state!==`running`)return;let r=n.createBufferSource();r.buffer=ne(n);let i=n.createBiquadFilter();i.type=`lowpass`,i.frequency.setValueAtTime(300,n.currentTime),i.frequency.linearRampToValueAtTime(1400,n.currentTime+.25);let a=n.createGain();a.gain.setValueAtTime(0,n.currentTime),a.gain.linearRampToValueAtTime(.14,n.currentTime+.05),a.gain.linearRampToValueAtTime(0,n.currentTime+.3),r.connect(i),i.connect(a),a.connect(t),r.start(),r.stop(n.currentTime+.32)}function le(n=.22){let r=e;if(!r||!t||r.state!==`running`)return;let i=r.currentTime,a=r.createBufferSource();a.buffer=ne(r);let o=r.createBiquadFilter();o.type=`bandpass`,o.frequency.setValueAtTime(1600+Math.random()*600,i),o.frequency.exponentialRampToValueAtTime(500,i+.25),o.Q.value=.8;let s=r.createGain();s.gain.setValueAtTime(0,i),s.gain.linearRampToValueAtTime(n,i+.01),s.gain.exponentialRampToValueAtTime(.001,i+.3),a.connect(o),o.connect(s),s.connect(t),a.start(i,Math.random()*.2),a.stop(i+.32);for(let e=0;e<3;e++){let e=i+.08+Math.random()*.22,a=r.createOscillator();a.type=`sine`;let o=700+Math.random()*700;a.frequency.setValueAtTime(o,e),a.frequency.exponentialRampToValueAtTime(o*1.6,e+.05);let s=r.createGain();s.gain.setValueAtTime(1e-4,e),s.gain.exponentialRampToValueAtTime(n*.35,e+.005),s.gain.exponentialRampToValueAtTime(1e-4,e+.07),a.connect(s),s.connect(t),a.start(e),a.stop(e+.09)}}function ue(n=1.6,r=.16){let i=e;if(!i||!t||i.state!==`running`)return;let a=i.currentTime,o=a;for(;o<a+n;){let e=i.createOscillator();e.type=`sine`;let n=180+Math.random()*160;e.frequency.setValueAtTime(n,o),e.frequency.exponentialRampToValueAtTime(n*.55,o+.09);let a=i.createGain();a.gain.setValueAtTime(1e-4,o),a.gain.exponentialRampToValueAtTime(r,o+.01),a.gain.exponentialRampToValueAtTime(1e-4,o+.11),e.connect(a),a.connect(t),e.start(o),e.stop(o+.13),o+=.07+Math.random()*.12}}function de(n=.2){let r=e;if(!r||!t||r.state!==`running`)return;let i=r.currentTime,a=r.createBufferSource();a.buffer=ne(r);let o=r.createBiquadFilter();o.type=`bandpass`,o.frequency.value=2200+Math.random()*1600,o.Q.value=1.2;let s=r.createGain();s.gain.setValueAtTime(1e-4,i),s.gain.exponentialRampToValueAtTime(Math.max(.001,n),i+.002),s.gain.exponentialRampToValueAtTime(1e-4,i+.045),a.connect(o),o.connect(s),s.connect(t),a.start(i,Math.random()*.4),a.stop(i+.06);let c=r.createOscillator();c.type=`sine`;let l=800+Math.random()*500;c.frequency.setValueAtTime(l,i),c.frequency.exponentialRampToValueAtTime(l*.3,i+.06);let u=r.createGain();u.gain.setValueAtTime(1e-4,i),u.gain.exponentialRampToValueAtTime(Math.max(.001,n*.6),i+.003),u.gain.exponentialRampToValueAtTime(1e-4,i+.07),c.connect(u),u.connect(t),c.start(i),c.stop(i+.08)}var fe=`spielkiste:`;function pe(e,t,n){try{let r=localStorage.getItem(fe+e);if(!r)return n;let i=JSON.parse(r);return i.v===t?i.data:n}catch{return n}}function v(e,t,n){try{let r={v:t,data:n};localStorage.setItem(fe+e,JSON.stringify(r))}catch{}}function me(e=[]){try{let t=new Set(e.map(e=>fe+e)),n=[];for(let e=0;e<localStorage.length;e++){let r=localStorage.key(e);r?.startsWith(fe)&&!t.has(r)&&n.push(r)}n.forEach(e=>localStorage.removeItem(e))}catch{}}var he=`settings`,ge=1,_e={volume:.6};function ve(){_e=pe(he,ge,{volume:.6}),d(_e.volume)}function ye(){v(he,ge,_e)}function be(){return _e.nacht===!0}function xe(){return Array.isArray(_e.versteckt)?_e.versteckt:[]}function Se(e,t){let n=new Set(xe());e.innerHTML=`
    <div class="eltern-panel">
      <h1>Spielkiste</h1>
      <p class="eltern-version">Version 1.4.0 · 7905f3f</p>

      <section class="eltern-offline">
        <p class="eltern-offline-status">Prüfe Offline-Speicher …</p>
      </section>

      <label class="eltern-field">
        <span>Lautstärke</span>
        <input type="range" min="0" max="100" value="${Math.round(u()*100)}" class="eltern-volume" />
      </label>

      <label class="eltern-schalter">
        <input type="checkbox" class="eltern-nacht" ${be()?`checked`:``} />
        <span class="eltern-schalter-text">
          <strong>Nachtflug-Modus</strong>
          <small>Dimmt alle Spiele stark ab — blendet in der dunklen Kabine nicht und schont den Akku.</small>
        </span>
      </label>

      <section class="eltern-spiele">
        <h2>Spiele auf der Startseite</h2>
        <p>Antippen blendet ein Spiel aus oder wieder ein.</p>
        <div class="eltern-spiele-liste">
          ${t.toys.map(e=>`
            <button class="eltern-spiel${n.has(e.id)?` aus`:``}" data-id="${e.id}">
              <span class="eltern-spiel-icon">${e.tileIcon}</span>
              <span class="eltern-spiel-name">${e.name}</span>
            </button>`).join(``)}
        </div>
        <p class="eltern-spiele-hinweis" hidden>Mindestens ein Spiel muss sichtbar bleiben.</p>
      </section>

      <div class="eltern-audio-diag">
        <button class="eltern-test-ton">Test-Ton abspielen</button>
        <p class="eltern-audio-status"></p>
      </div>

      <div class="eltern-reset-zone">
        <button class="eltern-reset-btn">Spielstände zurücksetzen</button>
        <div class="eltern-reset-confirm" hidden>
          <p>Wirklich alle gespeicherten Spielstände löschen (Bild, Sticker, Schalterstellungen)? Lautstärke, Nachtflug-Modus und ausgeblendete Spiele bleiben erhalten.</p>
          <div class="eltern-reset-actions">
            <button class="eltern-reset-cancel">Abbrechen</button>
            <button class="eltern-reset-confirm-btn">Ja, zurücksetzen</button>
          </div>
        </div>
      </div>

      <button class="eltern-close">Schließen</button>
    </div>
  `;let r=e.querySelector(`.eltern-volume`);r.addEventListener(`input`,()=>{d(Number(r.value)/100)}),r.addEventListener(`change`,()=>{_e.volume=Number(r.value)/100,ye(),h(500)});let i=e.querySelector(`.eltern-nacht`);i.addEventListener(`change`,()=>{_e.nacht=i.checked,ye(),t.onChange()});let a=e.querySelector(`.eltern-spiele-hinweis`);e.querySelectorAll(`.eltern-spiel`).forEach(e=>{e.addEventListener(`click`,()=>{let r=e.dataset.id;if(n.has(r))n.delete(r);else{if(t.toys.length-n.size<=1){a.hidden=!1;return}n.add(r)}a.hidden=!0,e.classList.toggle(`aus`,n.has(r)),_e.versteckt=[...n],ye(),t.onChange()})});let o=e.querySelector(`.eltern-offline-status`);Ce().then(({ok:e,text:t})=>{o.textContent=t,o.classList.toggle(`ok`,e),o.classList.toggle(`fehlt`,!e)});let l=e.querySelector(`.eltern-audio-status`);function f(){l.textContent=c()}f(),window.setTimeout(f,400),e.querySelector(`.eltern-test-ton`).addEventListener(`click`,()=>{s(),m({freq:523.25,duration:.3,attack:.01,release:.3,gain:.4}),f(),window.setTimeout(f,400)});let p=e.querySelector(`.eltern-reset-btn`),ee=e.querySelector(`.eltern-reset-confirm`),te=e.querySelector(`.eltern-reset-cancel`),ne=e.querySelector(`.eltern-reset-confirm-btn`);p.addEventListener(`click`,()=>{p.hidden=!0,ee.hidden=!1}),te.addEventListener(`click`,()=>{ee.hidden=!0,p.hidden=!1}),ne.addEventListener(`click`,()=>{me([he]),window.location.reload()})}async function Ce(){let e=`Noch nicht offline bereit: App einmal mit Internet öffnen, ganz schließen und erneut öffnen — dann hier nachsehen.`;try{if(!(`serviceWorker`in navigator)||!(`caches`in window))return{ok:!1,text:`Dieser Browser kann die App nicht offline speichern. Bitte über Safari zum Home-Bildschirm hinzufügen.`};if(!navigator.serviceWorker.controller)return{ok:!1,text:e};let t=(await caches.keys()).find(e=>e.includes(`precache`));if(!t)return{ok:!1,text:e};let n=await caches.open(t),r=new Set((await n.keys()).map(e=>new URL(e.url).pathname));return[...[...document.querySelectorAll(`script[src]`)].map(e=>e.src),...[...document.querySelectorAll(`link[rel="stylesheet"]`)].map(e=>e.href),new URL(`index.html`,document.baseURI).href].map(e=>new URL(e).pathname).filter(e=>!r.has(e)).length>0?{ok:!1,text:e}:{ok:!0,text:`Bereit für offline ✓ — alle ${r.size} Dateien sind auf diesem Gerät gespeichert.`}}catch{return{ok:!1,text:e}}}var we=9e4,Te=5e3,Ee=performance.now(),De=!1,Oe=new Set;function ke(e){e!==De&&(De=e,document.documentElement.classList.toggle(`ruhe`,e),Oe.forEach(t=>t(e)))}function Ae(){Ee=performance.now(),ke(!1)}function je(e){return Oe.add(e),()=>Oe.delete(e)}function Me(){document.addEventListener(`pointerdown`,Ae,{capture:!0}),window.setInterval(()=>{!De&&performance.now()-Ee>we&&ke(!0)},Te)}var Ne=`
<svg viewBox="0 0 120 120" width="100%" height="100%">
  <rect x="14" y="14" width="92" height="92" rx="18" fill="#fdf6ea" stroke="#e0a458" stroke-width="4"/>
  <circle cx="42" cy="46" r="10" fill="#e0a458"/>
  <rect x="66" y="38" width="34" height="14" rx="7" fill="#7fb99e"/>
  <circle cx="42" cy="80" r="12" fill="#e88a9a"/>
  <rect x="66" y="72" width="34" height="14" rx="7" fill="#f4a56b"/>
</svg>`,Pe=`brett`,Fe=2,Ie={switchOn:!1,knobStep:0,sliderValue:.3,zipperOpen:!1,doorIndex:0,curtainOpen:!1,veloOpen:!1,beads:[.08,.28,.48,.68],kaleidoStep:0},Le=[`<svg viewBox="0 0 100 100"><circle cx="50" cy="55" r="30" fill="#f2c9a0"/><circle cx="28" cy="30" r="14" fill="#f2c9a0"/><circle cx="72" cy="30" r="14" fill="#f2c9a0"/><circle cx="40" cy="52" r="4" fill="#4a4032"/><circle cx="60" cy="52" r="4" fill="#4a4032"/><ellipse cx="50" cy="64" rx="6" ry="4" fill="#e88a9a"/></svg>`,`<svg viewBox="0 0 100 100"><ellipse cx="50" cy="58" rx="26" ry="28" fill="#e8dfd0"/><ellipse cx="35" cy="20" rx="8" ry="18" fill="#e8dfd0"/><ellipse cx="65" cy="20" rx="8" ry="18" fill="#e8dfd0"/><circle cx="40" cy="55" r="4" fill="#4a4032"/><circle cx="60" cy="55" r="4" fill="#4a4032"/><ellipse cx="50" cy="66" rx="5" ry="3" fill="#e88a9a"/></svg>`,`<svg viewBox="0 0 100 100"><circle cx="50" cy="55" r="32" fill="#c9a37e"/><circle cx="22" cy="32" r="12" fill="#c9a37e"/><circle cx="78" cy="32" r="12" fill="#c9a37e"/><circle cx="40" cy="52" r="4" fill="#4a4032"/><circle cx="60" cy="52" r="4" fill="#4a4032"/><ellipse cx="50" cy="66" rx="8" ry="5" fill="#8a7255"/></svg>`],y={...Ie},Re=[],ze=null,Be=[],Ve=0;function b(e,t,n){e.addEventListener(t,n),Re.push(()=>e.removeEventListener(t,n))}function He(){v(Pe,Fe,y)}function Ue(e){y=pe(Pe,Fe,{...Ie}),Re=[],ze=null,Be=[],Ve=0,e.innerHTML=`
    <div class="brett-stage">
      <div class="brett-board">
        <div class="brett-mod brett-switch" data-mod="switch">
          <svg class="lamp" viewBox="0 0 60 60" width="44" height="44">
            <circle class="lamp-glow" cx="30" cy="30" r="24"/>
            <circle class="lamp-bulb" cx="30" cy="30" r="13"/>
          </svg>
          <div class="switch-track">
            <div class="switch-lever"></div>
          </div>
        </div>

        <div class="brett-mod brett-knob" data-mod="knob">
          <div class="knob-dial">
            <div class="knob-pointer"></div>
          </div>
        </div>

        <div class="brett-mod brett-buttons" data-mod="buttons">
          <button class="press-btn" data-note="0" style="--btn-color:#e88a9a" aria-hidden="true"></button>
          <button class="press-btn" data-note="2" style="--btn-color:#7fb99e" aria-hidden="true"></button>
          <button class="press-btn" data-note="4" style="--btn-color:#f4c86b" aria-hidden="true"></button>
        </div>

        <div class="brett-mod brett-slider" data-mod="slider">
          <div class="slider-track">
            <div class="slider-fill"></div>
            <div class="slider-handle"></div>
          </div>
        </div>

        <div class="brett-mod brett-zipper" data-mod="zipper">
          <div class="zipper-track">
            <div class="zipper-gap"></div>
            <div class="zipper-flap zipper-flap-left"></div>
            <div class="zipper-flap zipper-flap-right"></div>
            <div class="zipper-pull"></div>
          </div>
        </div>

        <div class="brett-mod brett-windmill" data-mod="windmill">
          <svg class="windmill-blades" viewBox="0 0 100 100" width="68" height="68">
            <g>
              <ellipse cx="50" cy="28" rx="12" ry="20" fill="#e88a9a"/>
              <ellipse cx="72" cy="50" rx="20" ry="12" fill="#7fb99e"/>
              <ellipse cx="50" cy="72" rx="12" ry="20" fill="#f4c86b"/>
              <ellipse cx="28" cy="50" rx="20" ry="12" fill="#7ea3c9"/>
            </g>
          </svg>
          <div class="windmill-hub"></div>
        </div>

        <div class="brett-mod brett-door" data-mod="door">
          <div class="door-frame">
            <div class="door-animal">${Le[y.doorIndex%Le.length]}</div>
            <div class="door-panel"></div>
          </div>
        </div>

        <div class="brett-mod brett-gears" data-mod="gears">
          <svg class="gear g-big" viewBox="0 0 100 100" width="66" height="66">${We(`#7fb99e`)}</svg>
          <svg class="gear g-small" viewBox="0 0 100 100" width="44" height="44">${We(`#e0a458`)}</svg>
        </div>

        <div class="brett-mod brett-bell" data-mod="bell">
          <div class="bell-body">
            <svg viewBox="0 0 100 100" width="58" height="58">
              <path d="M50 14 C30 14 26 34 26 52 L20 68 H80 L74 52 C74 34 70 14 50 14 Z" fill="#f4c86b" stroke="#c99a3c" stroke-width="3"/>
              <circle cx="50" cy="78" r="7" fill="#c99a3c"/>
              <circle cx="50" cy="11" r="5" fill="#c99a3c"/>
            </svg>
          </div>
        </div>

        <div class="brett-mod brett-curtain" data-mod="curtain">
          <div class="curtain-window">
            <div class="curtain-scene"><span class="curtain-sun"></span><span class="curtain-hill"></span></div>
            <div class="curtain-cloth left"></div>
            <div class="curtain-cloth right"></div>
          </div>
        </div>

        <div class="brett-mod brett-crank" data-mod="crank">
          <div class="crank-box">
            <div class="crank-pop">${Le[0]}</div>
          </div>
          <div class="crank-handle"><span></span></div>
        </div>

        <div class="brett-mod brett-kaleido" data-mod="kaleido">
          <svg class="kaleido-disc" viewBox="-50 -50 100 100" width="86" height="86">
            <circle cx="0" cy="0" r="46" fill="#fdf6ea" stroke="#c896d8" stroke-width="3"/>
            <g class="kaleido-petals"></g>
          </svg>
        </div>

        <div class="brett-mod brett-velcro" data-mod="velcro">
          <div class="velcro-base">
            <div class="velcro-hidden"></div>
            <div class="velcro-strap"><i></i><i></i><i></i></div>
          </div>
        </div>

        <div class="brett-mod brett-beads" data-mod="beads">
          <div class="beads-wire">
            ${y.beads.map((e,t)=>`<span class="bead b${t}" data-bead="${t}"></span>`).join(``)}
          </div>
        </div>
      </div>
    </div>
  `,Ge(e),qe(e),Ye(e),Xe(e),Qe(e),et(e),nt(e),it(e),at(e),ot(e),ct(e),ut(e),ft(e),mt(e)}function We(e){return`${Array.from({length:8},(t,n)=>`<rect x="44" y="2" width="12" height="18" rx="3" fill="${e}" transform="rotate(${n*360/8} 50 50)"/>`).join(``)}<circle cx="50" cy="50" r="34" fill="${e}"/><circle cx="50" cy="50" r="11" fill="#fffaf2"/>`}function Ge(e){let t=e.querySelector(`.brett-switch`);Ke(t),b(t,`pointerdown`,e=>{e.preventDefault(),y.switchOn=!y.switchOn,Ke(t),m({freq:y.switchOn?440:330,duration:.05,attack:.002,release:.1,type:`square`,gain:.25}),He()})}function Ke(e){e.classList.toggle(`on`,y.switchOn)}function qe(e){let t=e.querySelector(`.brett-knob`),n=t.querySelector(`.knob-dial`);Je(n);let r=!1;function i(e,t){let r=n.getBoundingClientRect(),i=r.left+r.width/2,a=r.top+r.height/2,o=e-i,s=t-a,c=Math.atan2(s,o)*180/Math.PI+90;return c<0&&(c+=360),Math.round(c/45)%8}b(t,`pointerdown`,e=>{let n=e;n.preventDefault(),r=!0;try{t.setPointerCapture(n.pointerId)}catch{}o(n.clientX,n.clientY)}),b(t,`pointermove`,e=>{if(!r)return;let t=e;o(t.clientX,t.clientY)});function a(e){if(!r)return;r=!1;let n=e;if(n.pointerId!==void 0)try{t.releasePointerCapture(n.pointerId)}catch{}}b(t,`pointerup`,a),b(t,`pointercancel`,a);function o(e,t){let r=i(e,t);r!==y.knobStep&&(y.knobStep=r,Je(n),m({freq:p[r%p.length],duration:.04,attack:.002,release:.08,type:`triangle`,gain:.25}),He())}}function Je(e){e.style.transform=`rotate(${y.knobStep*45}deg)`}function Ye(e){e.querySelectorAll(`.press-btn`).forEach(e=>{b(e,`pointerdown`,t=>{t.preventDefault(),m({freq:p[Number(e.dataset.note??`0`)%p.length],duration:.3,gain:.4}),e.classList.add(`pressed`),window.setTimeout(()=>e.classList.remove(`pressed`),260)})})}function Xe(e){let t=e.querySelector(`.brett-slider`),n=t.querySelector(`.slider-track`),r=t.querySelector(`.slider-handle`),i=t.querySelector(`.slider-fill`);Ze(r,i);let a=!1;function o(e){let t=n.getBoundingClientRect(),r=(e-t.left)/t.width;return Math.max(0,Math.min(1,r))}function s(e){return 220*4**e}b(t,`pointerdown`,e=>{let n=e;n.preventDefault(),a=!0;try{t.setPointerCapture(n.pointerId)}catch{}y.sliderValue=o(n.clientX),Ze(r,i),ze=ee(s(y.sliderValue))}),b(t,`pointermove`,e=>{a&&(y.sliderValue=o(e.clientX),Ze(r,i),ze?.update(s(y.sliderValue)))});function c(e){if(!a)return;a=!1,ze?.stop(),ze=null;let n=e;if(n.pointerId!==void 0)try{t.releasePointerCapture(n.pointerId)}catch{}He()}b(t,`pointerup`,c),b(t,`pointercancel`,c)}function Ze(e,t){let n=y.sliderValue*100;e.style.left=`${n}%`,t.style.width=`${n}%`}function Qe(e){let t=e.querySelector(`.brett-zipper`),n=t.querySelector(`.zipper-track`),r=t.querySelector(`.zipper-pull`);$e(t);let i=!1,a=0,o=0;b(t,`pointerdown`,e=>{let n=e;n.preventDefault(),i=!0,o=0,a=n.clientY;try{t.setPointerCapture(n.pointerId)}catch{}}),b(t,`pointermove`,e=>{if(!i)return;let t=e,s=n.getBoundingClientRect(),c=Math.max(0,Math.min(1,(t.clientY-s.top)/s.height));o+=Math.abs(t.clientY-a),a=t.clientY,r.style.top=`${c*100}%`});function s(e){if(!i)return;i=!1;let a=e;if(a.pointerId!==void 0)try{t.releasePointerCapture(a.pointerId)}catch{}let s=n.getBoundingClientRect(),c=r.getBoundingClientRect(),l=(c.top+c.height/2-s.top)/s.height,u=y.zipperOpen,d=o<6?!y.zipperOpen:l>.5;d!==u&&(y.zipperOpen=d,re(d),He()),$e(t)}b(t,`pointerup`,s),b(t,`pointercancel`,s)}function $e(e){e.classList.toggle(`open`,y.zipperOpen);let t=e.querySelector(`.zipper-pull`);t.style.top=y.zipperOpen?`100%`:`0%`}function et(e){let t=e.querySelector(`.brett-windmill`),n=t.querySelector(`.windmill-blades`);n.style.transform=`rotate(${Ve}deg)`,b(t,`pointerdown`,e=>{e.preventDefault(),tt(n)})}function tt(e){Be.forEach(e=>window.clearTimeout(e)),Be=[];let t=3+Math.random()*2;Ve+=t*360;let n=2200+Math.random()*400;e.style.transition=`transform ${n}ms cubic-bezier(0.13, 0.7, 0.25, 1)`,e.style.transform=`rotate(${Ve}deg)`;for(let e=0;e<12;e++){let t=n*(1-(1-e/12)**2.2),r=window.setTimeout(()=>{m({freq:700,duration:.02,attack:.001,release:.04,type:`triangle`,gain:.12})},t);Be.push(r)}}function nt(e){let t=e.querySelector(`.brett-door`),n=t.querySelector(`.door-animal`);rt(t),b(t,`pointerdown`,e=>{e.preventDefault();let r=!t.classList.contains(`open`);r&&(y.doorIndex=(y.doorIndex+1)%Le.length,n.innerHTML=Le[y.doorIndex],He()),t.classList.toggle(`open`,r),_()})}function rt(e){e.classList.remove(`open`)}function it(e){let t=e.querySelector(`.brett-gears`),n=t.querySelector(`.g-big`),r=t.querySelector(`.g-small`),i=!1,a=0,o=0,s=0;function c(e,n){let r=t.getBoundingClientRect();return Math.atan2(n-(r.top+r.height/2),e-(r.left+r.width/2))*180/Math.PI}function l(){n.style.transform=`rotate(${o}deg)`,r.style.transform=`rotate(${-o*1.5}deg)`}l(),b(t,`pointerdown`,e=>{let n=e;n.preventDefault(),i=!0,a=c(n.clientX,n.clientY);try{t.setPointerCapture(n.pointerId)}catch{}}),b(t,`pointermove`,e=>{if(!i)return;let t=e,n=c(t.clientX,t.clientY),r=n-a;r>180&&(r-=360),r<-180&&(r+=360),a=n,o+=r,l();let u=performance.now();Math.abs(r)>6&&u-s>90&&(s=u,m({freq:320,duration:.02,attack:.002,release:.05,type:`square`,gain:.1}))});function u(e){if(!i)return;i=!1;let n=e;try{t.releasePointerCapture(n.pointerId)}catch{}}b(t,`pointerup`,u),b(t,`pointercancel`,u)}function at(e){let t=e.querySelector(`.brett-bell`),n=t.querySelector(`.bell-body`);b(t,`pointerdown`,e=>{e.preventDefault(),n.classList.remove(`ring`),n.offsetWidth,n.classList.add(`ring`),m({freq:1046.5,duration:.5,attack:.004,release:.9,type:`sine`,gain:.22}),m({freq:1567.98,duration:.35,attack:.004,release:.7,type:`sine`,gain:.1})})}function ot(e){let t=e.querySelector(`.brett-curtain`);st(t),b(t,`pointerdown`,e=>{e.preventDefault(),y.curtainOpen=!y.curtainOpen,st(t),_(),He()})}function st(e){e.classList.toggle(`open`,y.curtainOpen)}function ct(e){let t=e.querySelector(`.brett-crank`),n=t.querySelector(`.crank-handle`),r=t.querySelector(`.crank-pop`),i=!1,a=0,o=0,s=0,c=!1,l=0;function u(e,t){let r=n.getBoundingClientRect();return Math.atan2(t-(r.top+r.height/2),e-(r.left+r.width/2))*180/Math.PI}b(t,`pointerdown`,e=>{let n=e;if(n.preventDefault(),c){c=!1,s=0,t.classList.remove(`popped`);return}i=!0,a=u(n.clientX,n.clientY);try{t.setPointerCapture(n.pointerId)}catch{}}),b(t,`pointermove`,e=>{if(!i||c)return;let d=e,f=u(d.clientX,d.clientY),h=f-a;h>180&&(h-=360),h<-180&&(h+=360),a=f,o+=h,s+=Math.abs(h),n.style.transform=`rotate(${o}deg)`;let ee=performance.now();ee-l>120&&(l=ee,m({freq:p[Math.floor(s/45)%p.length],duration:.05,attack:.003,release:.1,type:`triangle`,gain:.16})),s>540&&(c=!0,i=!1,r.innerHTML=Le[Math.floor(Math.random()*Le.length)],t.classList.add(`popped`),m({freq:880,duration:.18,attack:.005,release:.3,type:`sine`,gain:.3}))});function d(e){if(!i)return;i=!1;let n=e;try{t.releasePointerCapture(n.pointerId)}catch{}}b(t,`pointerup`,d),b(t,`pointercancel`,d)}var lt=[`#e88a9a`,`#7fb99e`,`#f4c86b`,`#7ea3c9`,`#e0a458`,`#c896d8`];function ut(e){let t=e.querySelector(`.brett-kaleido`),n=t.querySelector(`.kaleido-disc`),r=t.querySelector(`.kaleido-petals`);dt(r),n.style.transform=`rotate(${y.kaleidoStep*30}deg)`,b(t,`pointerdown`,e=>{e.preventDefault(),y.kaleidoStep+=1,n.style.transform=`rotate(${y.kaleidoStep*30}deg)`,dt(r),m({freq:p[y.kaleidoStep%p.length],duration:.25,attack:.01,release:.4,type:`sine`,gain:.2}),He()})}function dt(e){let t=y.kaleidoStep,n=``;for(let e=0;e<6;e++){let r=lt[(t+e)%lt.length],i=lt[(t*2+e+3)%lt.length];n+=`<g transform="rotate(${e*60})">
      <ellipse cx="0" cy="-24" rx="9" ry="16" fill="${r}" opacity="0.85"/>
      <circle cx="0" cy="-38" r="5" fill="${i}"/>
    </g>`}e.innerHTML=n}function ft(e){let t=e.querySelector(`.brett-velcro`);pt(t),b(t,`pointerdown`,e=>{e.preventDefault(),y.veloOpen=!y.veloOpen,pt(t),re(y.veloOpen),He()})}function pt(e){e.classList.toggle(`open`,y.veloOpen)}function mt(e){let t=e.querySelector(`.brett-beads`),n=t.querySelector(`.beads-wire`),r=[...t.querySelectorAll(`.bead`)];r.forEach((e,t)=>{e.style.left=`${y.beads[t]*100}%`});let i=new Map;b(n,`pointerdown`,e=>{let t=e,r=t.target.closest(`.bead`);if(!r)return;t.preventDefault();let a=Number(r.dataset.bead);i.set(t.pointerId,a);try{n.setPointerCapture(t.pointerId)}catch{}}),b(n,`pointermove`,e=>{let t=e,a=i.get(t.pointerId);if(a===void 0)return;let o=n.getBoundingClientRect(),s=Math.max(.02,Math.min(.94,(t.clientX-o.left)/o.width)),c=y.beads[a];y.beads[a]=s,r[a].style.left=`${s*100}%`,Math.abs(s-c)>.04&&m({freq:p[a%p.length]*2,duration:.03,attack:.002,release:.07,type:`triangle`,gain:.12})});function a(e){let t=e;if(i.has(t.pointerId)){i.delete(t.pointerId);try{n.releasePointerCapture(t.pointerId)}catch{}He()}}b(n,`pointerup`,a),b(n,`pointercancel`,a)}function ht(){Re.forEach(e=>e()),Re=[],ze?.stop(),ze=null,Be.forEach(e=>window.clearTimeout(e)),Be=[]}var gt={id:`brett`,name:`Fummelbrett`,accent:`#e0a458`,tileIcon:Ne,mount:Ue,unmount:ht},_t=`
<svg viewBox="0 0 120 120" width="100%" height="100%">
  <circle cx="45" cy="45" r="24" fill="#e88a9a"/>
  <circle cx="78" cy="55" r="20" fill="#7fb99e"/>
  <circle cx="55" cy="82" r="18" fill="#f4c86b"/>
</svg>`,vt=[{id:0,color:`#e88a9a`,note:0,xPct:22,yPct:30,radiusPx:58},{id:1,color:`#7fb99e`,note:1,xPct:50,yPct:22,radiusPx:62},{id:2,color:`#f4c86b`,note:2,xPct:78,yPct:32,radiusPx:56},{id:3,color:`#7ea3c9`,note:3,xPct:30,yPct:68,radiusPx:60},{id:4,color:`#e0a458`,note:4,xPct:58,yPct:74,radiusPx:58},{id:5,color:`#c896d8`,note:5,xPct:80,yPct:66,radiusPx:54}],yt=null,bt=[],xt=[],St=new Set,Ct=null;function wt(e,t,n){e.addEventListener(t,n),xt.push(()=>e.removeEventListener(t,n))}function Tt(e,t,n){return Math.max(t,Math.min(n,e))}function Et(e){xt=[],St=new Set,e.innerHTML=`
    <div class="kleckse-stage" id="kleckseStage">
      ${vt.map(e=>`
        <div class="klecks" data-id="${e.id}" style="--blob-color:${e.color}; width:${e.radiusPx*2}px; height:${e.radiusPx*2}px;">
          <div class="klecks-face">
            <div class="klecks-eyes">
              <div class="klecks-eye" style="animation-delay:${(e.id*.9+1).toFixed(2)}s"></div>
              <div class="klecks-eye" style="animation-delay:${(e.id*.9+1).toFixed(2)}s"></div>
            </div>
            <div class="klecks-mouth"></div>
          </div>
        </div>
      `).join(``)}
    </div>
  `,yt=e.querySelector(`#kleckseStage`),bt=vt.map(t=>({def:t,el:e.querySelector(`.klecks[data-id="${t.id}"]`),xPct:t.xPct,yPct:t.yPct,grabbed:!1,lastX:0,lastY:0,lastT:0})),bt.forEach(e=>{Dt(e),Ot(e)}),Ct=new ResizeObserver(()=>{bt.forEach(e=>{e.grabbed||Dt(e)})}),Ct.observe(yt)}function Dt(e,t=1,n=1){if(!yt)return;let r=e.xPct/100*yt.clientWidth-e.def.radiusPx,i=e.yPct/100*yt.clientHeight-e.def.radiusPx;e.el.style.transform=`translate(${r.toFixed(1)}px, ${i.toFixed(1)}px) scale(${t.toFixed(3)}, ${n.toFixed(3)})`}function Ot(e){let t=e.el;wt(t,`pointerdown`,n=>{let r=n;r.preventDefault();try{t.setPointerCapture(r.pointerId)}catch{}e.grabbed=!0,e.lastX=r.clientX,e.lastY=r.clientY,e.lastT=performance.now(),t.classList.add(`grabbed`),m({freq:p[e.def.note%p.length],duration:.35,gain:.35}),At(e,1.18),jt(e)}),wt(t,`pointermove`,t=>{if(!e.grabbed||!yt)return;let n=t,r=yt.getBoundingClientRect(),i=performance.now(),a=Math.max(1,i-e.lastT),o=(n.clientX-e.lastX)/a,s=(n.clientY-e.lastY)/a;e.lastX=n.clientX,e.lastY=n.clientY,e.lastT=i,e.xPct=Tt((n.clientX-r.left)/r.width*100,6,94),e.yPct=Tt((n.clientY-r.top)/r.height*100,8,92),kt(e,o,s),Pt(e)});function n(n){if(!e.grabbed)return;e.grabbed=!1,t.classList.remove(`grabbed`);let r=n;if(r.pointerId!==void 0)try{t.releasePointerCapture(r.pointerId)}catch{}Dt(e,1,1)}wt(t,`pointerup`,n),wt(t,`pointercancel`,n)}function kt(e,t,n){let r=Math.min(Math.hypot(t,n)*6,.28),i=Math.atan2(n,t);Dt(e,1+r*Math.abs(Math.cos(i)),1-r*Math.abs(Math.cos(i))*.6+r*Math.abs(Math.sin(i))*.1)}function At(e,t){Dt(e,t,t),window.setTimeout(()=>{e.el.classList.contains(`grabbed`)||Dt(e,1,1)},160)}function jt(e){e.el.classList.remove(`singt`),e.el.offsetWidth,e.el.classList.add(`singt`),window.setTimeout(()=>e.el.classList.remove(`singt`),300)}function Mt(e){e.el.classList.remove(`funkt`),e.el.offsetWidth,e.el.classList.add(`funkt`),window.setTimeout(()=>e.el.classList.remove(`funkt`),420)}function Nt(e,t){return e<t?`${e}-${t}`:`${t}-${e}`}function Pt(e){if(!yt)return;let t=yt.getBoundingClientRect(),n=e.xPct/100*t.width,r=e.yPct/100*t.height;for(let i of bt){if(i.def.id===e.def.id)continue;let a=i.xPct/100*t.width,o=i.yPct/100*t.height,s=Math.hypot(n-a,r-o),c=e.def.radiusPx*.75+i.def.radiusPx*.75,l=Nt(e.def.id,i.def.id);s<c?St.has(l)||(St.add(l),m({freq:p[e.def.note%p.length],duration:.25,gain:.22}),m({freq:p[i.def.note%p.length],duration:.25,gain:.22}),At(i,1.1),Mt(e),Mt(i)):St.delete(l)}}function Ft(){xt.forEach(e=>e()),xt=[],Ct?.disconnect(),Ct=null,bt=[],yt=null,St=new Set}var It={id:`kleckse`,name:`Klang-Kleckse`,accent:`#e88a9a`,tileIcon:_t,mount:Et,unmount:Ft},Lt=`
<svg viewBox="0 0 120 120" width="100%" height="100%">
  <path d="M30 90 L80 30 L95 45 L45 95 Z" fill="#fdf6ea" stroke="#7ea3c9" stroke-width="4" stroke-linejoin="round"/>
  <circle cx="34" cy="92" r="10" fill="#7ea3c9"/>
  <circle cx="70" cy="40" r="8" fill="#e88a9a"/>
</svg>`,Rt=[`#e88a9a`,`#7fb99e`,`#f4c86b`,`#7ea3c9`,`#e0a458`,`#6b5d4a`],zt=`malen`,Bt=1,x=null,S=null,C=null,Vt=Rt[0],Ht=!1,Ut=0,Wt=0,Gt=[],Kt=null,qt=null;function Jt(e,t,n){e.addEventListener(t,n),Gt.push(()=>e.removeEventListener(t,n))}function Yt(e){Gt=[],Ht=!1,Vt=Rt[0],e.innerHTML=`
    <div class="malen-stage" id="malenStage">
      <canvas class="malen-canvas" id="malenCanvas"></canvas>
      <div class="malen-palette" id="malenPalette">
        ${Rt.map((e,t)=>`<button class="malen-swatch${t===0?` selected`:``}" data-color="${e}" style="--swatch-color:${e}" aria-hidden="true"></button>`).join(``)}
      </div>
      <button class="malen-new-sheet" id="malenNewSheet" aria-hidden="true">
        <svg viewBox="0 0 48 48" width="30" height="30">
          <path d="M10 6 h20 l8 8 v28 h-28 z" fill="#fffaf2" stroke="#8a7255" stroke-width="2.5" stroke-linejoin="round"/>
          <path d="M30 6 v8 h8" fill="none" stroke="#8a7255" stroke-width="2.5" stroke-linejoin="round"/>
        </svg>
      </button>
    </div>
  `,C=e.querySelector(`#malenStage`),x=e.querySelector(`#malenCanvas`),S=x.getContext(`2d`),Xt(),Zt(),Jt(x,`pointerdown`,en),Jt(x,`pointermove`,tn),Jt(x,`pointerup`,nn),Jt(x,`pointercancel`,nn);let t=e.querySelectorAll(`.malen-swatch`);t.forEach(e=>{Jt(e,`pointerdown`,n=>{n.preventDefault(),Vt=e.dataset.color??Rt[0],t.forEach(e=>e.classList.remove(`selected`)),e.classList.add(`selected`),h(500)})}),Jt(e.querySelector(`#malenNewSheet`),`pointerdown`,e=>{e.preventDefault(),rn()});let n=C.clientWidth,r=C.clientHeight,i=()=>{if(!C)return;let e=C.clientWidth,t=C.clientHeight;(e!==n||t!==r)&&(n=e,r=t,Kt!==null&&window.clearTimeout(Kt),Kt=window.setTimeout(()=>{Xt(),Zt()},200))};qt=new ResizeObserver(i),qt.observe(C),Jt(window,`resize`,i),Jt(window,`orientationchange`,i)}function Xt(){if(!x||!C)return;let e=Math.min(window.devicePixelRatio||1,2),t={width:C.clientWidth,height:C.clientHeight};x.width=Math.round(t.width*e),x.height=Math.round(t.height*e),x.style.width=`${t.width}px`,x.style.height=`${t.height}px`,S=x.getContext(`2d`),S&&(S.scale(e,e),S.lineCap=`round`,S.lineJoin=`round`,S.lineWidth=22)}function Zt(){let e=pe(zt,Bt,{dataUrl:null});if(!e.dataUrl||!x||!S)return;let t=new Image;t.onload=()=>{if(!S||!x)return;let e=Math.min(window.devicePixelRatio||1,2);S.drawImage(t,0,0,x.width/e,x.height/e)},t.src=e.dataUrl}function Qt(){if(x)try{v(zt,Bt,{dataUrl:x.toDataURL(`image/png`)})}catch{}}function $t(e){let t=x,n=t.getBoundingClientRect(),r=n.width===0?1:t.clientWidth/n.width,i=n.height===0?1:t.clientHeight/n.height;return{x:(e.clientX-n.left)*r,y:(e.clientY-n.top)*i}}function en(e){let t=e;if(t.preventDefault(),!x||!S)return;try{x.setPointerCapture(t.pointerId)}catch{}Ht=!0;let{x:n,y:r}=$t(t);Ut=n,Wt=r,S.strokeStyle=Vt,S.fillStyle=Vt,S.beginPath(),S.arc(n,r,S.lineWidth/2,0,Math.PI*2),S.fill()}function tn(e){if(!Ht||!S)return;let{x:t,y:n}=$t(e);S.beginPath(),S.moveTo(Ut,Wt),S.lineTo(t,n),S.stroke(),Ut=t,Wt=n}function nn(e){if(!Ht)return;Ht=!1;let t=e;if(x&&t.pointerId!==void 0)try{x.releasePointerCapture(t.pointerId)}catch{}Qt()}function rn(){if(!x||!S||!C)return;let e=x.toDataURL(`image/png`),t=document.createElement(`img`);t.src=e,t.className=`malen-crumple-overlay`,t.style.width=x.style.width,t.style.height=x.style.height,C.appendChild(t);let n=Math.min(window.devicePixelRatio||1,2);S.clearRect(0,0,x.width/n,x.height/n),v(zt,Bt,{dataUrl:null}),h(300),t.offsetWidth,t.classList.add(`crumpling`),window.setTimeout(()=>{t.remove()},550)}function an(){Gt.forEach(e=>e()),Gt=[],qt?.disconnect(),qt=null,Kt!==null&&(window.clearTimeout(Kt),Kt=null),x=null,S=null,C=null}var on={id:`malen`,name:`Malen`,accent:`#7ea3c9`,tileIcon:Lt,mount:Yt,unmount:an},sn=`
<svg viewBox="0 0 120 120" width="100%" height="100%">
  <rect x="14" y="50" width="92" height="56" rx="12" fill="#e0a458" stroke="#a9835e" stroke-width="3"/>
  <ellipse cx="45" cy="58" rx="14" ry="8" fill="#6b5544"/>
  <rect x="68" y="52" width="24" height="14" rx="4" fill="#6b5544"/>
  <circle cx="30" cy="30" r="14" fill="#e88a9a"/>
  <rect x="60" y="18" width="26" height="26" rx="6" fill="#7fb99e"/>
</svg>`,cn=[{id:`kreis`,color:`#e88a9a`,note:0,restX:14,restY:80,path:`<circle cx="50" cy="50" r="42"/>`,svg:`<svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="42" fill="#e88a9a"/><circle cx="38" cy="46" r="5" fill="#4a4032"/><circle cx="62" cy="46" r="5" fill="#4a4032"/><path d="M38 60 Q50 68 62 60" stroke="#4a4032" stroke-width="3" fill="none" stroke-linecap="round"/></svg>`},{id:`quadrat`,color:`#7fb99e`,note:2,restX:33,restY:88,path:`<rect x="8" y="8" width="84" height="84" rx="16"/>`,svg:`<svg viewBox="0 0 100 100"><rect x="8" y="8" width="84" height="84" rx="16" fill="#7fb99e"/><circle cx="38" cy="46" r="5" fill="#4a4032"/><circle cx="62" cy="46" r="5" fill="#4a4032"/><path d="M38 60 Q50 68 62 60" stroke="#4a4032" stroke-width="3" fill="none" stroke-linecap="round"/></svg>`},{id:`dreieck`,color:`#f4c86b`,note:4,restX:52,restY:80,path:`<path d="M50 10 L92 88 L8 88 Z" stroke-linejoin="round"/>`,svg:`<svg viewBox="0 0 100 100"><path d="M50 10 L92 88 L8 88 Z" fill="#f4c86b" stroke-linejoin="round"/><circle cx="40" cy="66" r="4.5" fill="#4a4032"/><circle cx="60" cy="66" r="4.5" fill="#4a4032"/><path d="M40 76 Q50 82 60 76" stroke="#4a4032" stroke-width="3" fill="none" stroke-linecap="round"/></svg>`},{id:`stern`,color:`#7ea3c9`,note:5,restX:71,restY:88,path:`<path d="M50 6 L62 37 L96 37 L68 57 L79 90 L50 70 L21 90 L32 57 L4 37 L38 37 Z"/>`,svg:`<svg viewBox="0 0 100 100"><path d="M50 6 L62 37 L96 37 L68 57 L79 90 L50 70 L21 90 L32 57 L4 37 L38 37 Z" fill="#7ea3c9"/><circle cx="42" cy="48" r="4" fill="#4a4032"/><circle cx="58" cy="48" r="4" fill="#4a4032"/><path d="M42 58 Q50 63 58 58" stroke="#4a4032" stroke-width="2.5" fill="none" stroke-linecap="round"/></svg>`},{id:`herz`,color:`#c896d8`,note:7,restX:88,restY:78,path:`<path d="M50 92 C20 67 4 46 4 28 C4 12 17 2 32 2 C42 2 48 9 50 16 C52 9 58 2 68 2 C83 2 96 12 96 28 C96 46 80 67 50 92 Z"/>`,svg:`<svg viewBox="0 0 100 100"><path d="M50 92 C20 67 4 46 4 28 C4 12 17 2 32 2 C42 2 48 9 50 16 C52 9 58 2 68 2 C83 2 96 12 96 28 C96 46 80 67 50 92 Z" fill="#c896d8"/><circle cx="40" cy="34" r="4.5" fill="#4a4032"/><circle cx="60" cy="34" r="4.5" fill="#4a4032"/><path d="M40 44 Q50 50 60 44" stroke="#4a4032" stroke-width="3" fill="none" stroke-linecap="round"/></svg>`}],ln=`sortierer`,un=1;function dn(){return cn.map(e=>({id:e.id,xPct:e.restX,yPct:e.restY,placed:!1}))}var fn={shapes:dn()},w=null,pn=[],mn=null,hn=new Map;function gn(e,t,n){e.addEventListener(t,n),pn.push(()=>e.removeEventListener(t,n))}function _n(e){return fn.shapes.find(t=>t.id===e)??{id:e,xPct:50,yPct:80,placed:!1}}function vn(){v(ln,un,fn)}function yn(e){pn=[],hn=new Map;let t=pe(ln,un,{shapes:dn()});fn={shapes:cn.map(e=>t.shapes.find(t=>t.id===e.id)??{id:e.id,xPct:e.restX,yPct:e.restY,placed:!1})},e.innerHTML=`
    <div class="sorter-stage">
      <div class="sorter-box">
        ${cn.map(e=>`
          <div class="sorter-hole" data-hole="${e.id}">
            <svg class="hole-cut" viewBox="0 0 100 100">${e.path}</svg>
            <div class="hole-fuellung" data-fill="${e.id}" style="--fill-color:${e.color}">${e.svg}</div>
          </div>
        `).join(``)}
      </div>
      <div class="sorter-boden" id="sorterBoden">
        ${cn.map(e=>`
          <div class="sorter-form" data-shape="${e.id}">
            <div class="sorter-form-fx">${e.svg}</div>
          </div>
        `).join(``)}
      </div>
    </div>
  `,w=e.querySelector(`.sorter-stage`),cn.forEach(t=>{let n=e.querySelector(`.sorter-form[data-shape="${t.id}"]`),r=e.querySelector(`.sorter-hole[data-hole="${t.id}"]`),i=e.querySelector(`.hole-fuellung[data-fill="${t.id}"]`);hn.set(t.id,n),Sn(t.id,i),xn(t.id),Cn(t,n),wn(t,r,n,i)}),mn=new ResizeObserver(()=>{cn.forEach(e=>{(!bn||bn!==e.id)&&xn(e.id)})}),mn.observe(w)}var bn=null;function xn(e,t=0,n=0){let r=hn.get(e);if(!r||!w)return;let i=_n(e),a=r.offsetWidth/2,o=r.offsetHeight/2,s=i.xPct/100*w.clientWidth-a+t,c=i.yPct/100*w.clientHeight-o+n;r.style.transform=`translate(${s.toFixed(1)}px, ${c.toFixed(1)}px)`}function Sn(e,t){let n=_n(e);hn.get(e)?.classList.toggle(`versteckt`,n.placed),t.classList.toggle(`gefuellt`,n.placed)}function Cn(e,t){let n=!1,r=0,i=0,a=0;gn(t,`pointerdown`,o=>{let s=o;if(s.preventDefault(),!_n(e.id).placed){n=!0,bn=e.id,r=0,i=s.clientX,a=s.clientY,t.classList.add(`greift`);try{t.setPointerCapture(s.pointerId)}catch{}}}),gn(t,`pointermove`,t=>{if(!n||!w)return;let o=t,s=o.clientX-i,c=o.clientY-a;r=Math.max(r,Math.hypot(s,c)),xn(e.id,s,c)});let o=i=>{if(!n)return;n=!1,bn=null;let a=i;t.classList.remove(`greift`);try{t.releasePointerCapture(a.pointerId)}catch{}if(r<6){xn(e.id),Dn(t),h(420),vn();return}if(w){let t=w.getBoundingClientRect(),n=_n(e.id);n.xPct=On((a.clientX-t.left)/t.width*100,3,97),n.yPct=On((a.clientY-t.top)/t.height*100,3,97)}xn(e.id);let o=w?.querySelector(`.sorter-hole[data-hole="${e.id}"]`);if(o&&w){let t=o.getBoundingClientRect(),n=t.left+t.width/2,r=t.top+t.height/2;if(Math.hypot(a.clientX-n,a.clientY-r)<60){let t=w.querySelector(`.hole-fuellung[data-fill="${e.id}"]`),n=_n(e.id);n.placed=!0,Sn(e.id,t),Tn(t,e.note),vn();return}}vn()};gn(t,`pointerup`,o),gn(t,`pointercancel`,o)}function wn(e,t,n,r){gn(t,`pointerdown`,t=>{let i=_n(e.id);i.placed&&(t.preventDefault(),i.placed=!1,i.xPct=e.restX,i.yPct=e.restY,Sn(e.id,r),xn(e.id),En(n),m({freq:p[e.note%p.length]*1.5,duration:.18,attack:.005,release:.25,type:`triangle`,gain:.24}),vn())})}function Tn(e,t){e.classList.remove(`plumpst`),e.offsetWidth,e.classList.add(`plumpst`),m({freq:p[t%p.length],duration:.22,attack:.004,release:.3,type:`sine`,gain:.32}),window.setTimeout(()=>e.classList.remove(`plumpst`),400)}function En(e){let t=e.querySelector(`.sorter-form-fx`);t&&(t.classList.remove(`huepft`),t.offsetWidth,t.classList.add(`huepft`),window.setTimeout(()=>t.classList.remove(`huepft`),500))}function Dn(e){let t=e.querySelector(`.sorter-form-fx`);t&&(t.classList.remove(`wackelt`),t.offsetWidth,t.classList.add(`wackelt`),window.setTimeout(()=>t.classList.remove(`wackelt`),400))}function On(e,t,n){return Math.max(t,Math.min(n,e))}function kn(){pn.forEach(e=>e()),pn=[],mn?.disconnect(),mn=null,hn=new Map,w=null,bn=null,fn={shapes:dn()}}var An={id:`sortierer`,name:`Formen-Sortierer`,accent:`#e0a458`,tileIcon:sn,mount:yn,unmount:kn},jn=`
<svg viewBox="0 0 120 120" width="100%" height="100%">
  <circle cx="48" cy="46" r="26" fill="none" stroke="#7ec8d8" stroke-width="5"/>
  <circle cx="40" cy="38" r="7" fill="#bfe6ee"/>
  <circle cx="84" cy="72" r="17" fill="none" stroke="#a8d8e0" stroke-width="4"/>
  <circle cx="79" cy="67" r="5" fill="#d6f0f5"/>
  <circle cx="42" cy="90" r="11" fill="none" stroke="#c8b6e0" stroke-width="4"/>
</svg>`,Mn=[`rgba(126, 200, 216, 0.55)`,`rgba(200, 182, 224, 0.55)`,`rgba(244, 200, 107, 0.45)`,`rgba(232, 138, 154, 0.45)`,`rgba(127, 185, 158, 0.5)`],Nn=14,Pn=900,Fn=null,In=[],Ln=null,Rn=[];function zn(e,t,n){e.addEventListener(t,n),In.push(()=>e.removeEventListener(t,n))}function Bn(e){In=[],Rn=[],e.innerHTML=`
    <div class="blasen-stage" id="blasenStage">
      <div class="blasen-layer" id="blasenLayer"></div>
      <div class="blasen-wand" id="blasenWand">
        <div class="wand-ring"></div>
        <div class="wand-stick"></div>
      </div>
    </div>
  `,Fn=e.querySelector(`#blasenLayer`);let t=e.querySelector(`#blasenWand`);for(let e=0;e<6;e++)Vn(.3+Math.random()*.5);let n=()=>{Ln!==null&&window.clearInterval(Ln),Ln=null},r=()=>{n(),Ln=window.setInterval(()=>Vn(),Pn)};r(),In.push(n),In.push(je(e=>e?n():r())),zn(Fn,`pointerdown`,e=>{let t=e,n=t.target.closest(`.blase`);n&&(t.preventDefault(),Hn(n))}),zn(t,`pointerdown`,e=>{e.preventDefault(),t.classList.remove(`puff`),t.offsetWidth,t.classList.add(`puff`);for(let e=0;e<5;e++)window.setTimeout(()=>Vn(0,!0),e*110);m({freq:220,duration:.28,attack:.06,release:.35,type:`sine`,gain:.12})})}function Vn(e=0,t=!1){if(!Fn||Fn.childElementCount>=Nn)return;let n=42+Math.random()*58,r=Mn[Math.floor(Math.random()*Mn.length)],i=t?14+Math.random()*16:6+Math.random()*88,a=(Math.random()*2-1)*40,o=9e3+Math.random()*5e3,s=document.createElement(`div`);s.className=`blase`,s.style.width=`${n}px`,s.style.height=`${n}px`,s.style.left=`${i}%`,s.style.setProperty(`--tint`,r),s.style.setProperty(`--drift`,`${a}px`),s.style.animationDuration=`${o}ms`,s.style.animationDelay=`${-e*o}ms`,s.innerHTML=`<span class="blase-glanz"></span>`,s.addEventListener(`animationend`,()=>s.remove()),Fn.appendChild(s)}function Hn(e){if(e.classList.contains(`platzt`))return;e.classList.add(`platzt`);let t=p[Math.floor(Math.random()*p.length)];m({freq:t*2,duration:.06,attack:.002,release:.16,type:`sine`,gain:.22});let n=window.setTimeout(()=>e.remove(),340);Rn.push(n)}function Un(){In.forEach(e=>e()),In=[],Ln!==null&&(window.clearInterval(Ln),Ln=null),Rn.forEach(e=>window.clearTimeout(e)),Rn=[],Fn=null}var Wn={id:`blasen`,name:`Seifenblasen`,accent:`#7ec8d8`,tileIcon:jn,mount:Bn,unmount:Un},Gn=`
<svg viewBox="0 0 120 120" width="100%" height="100%">
  <rect x="22" y="30" width="76" height="58" rx="10" fill="#cbb98a"/>
  <rect x="30" y="38" width="60" height="42" rx="6" fill="#bfe6ee"/>
  <path d="M34 74 L54 46" stroke="#fffaf2" stroke-width="9" stroke-linecap="round"/>
  <path d="M52 76 L70 52" stroke="#fffaf2" stroke-width="7" stroke-linecap="round"/>
  <circle cx="84" cy="92" r="13" fill="#7ec8d8"/>
</svg>`,Kn=[{clean:`<svg viewBox="0 0 200 200">
      <ellipse cx="100" cy="132" rx="62" ry="48" fill="#e0a458"/>
      <circle cx="100" cy="82" r="46" fill="#eab77a"/>
      <ellipse cx="58" cy="66" rx="16" ry="26" fill="#c98f4e" transform="rotate(-18 58 66)"/>
      <ellipse cx="142" cy="66" rx="16" ry="26" fill="#c98f4e" transform="rotate(18 142 66)"/>
      <circle cx="85" cy="78" r="6" fill="#4a4032"/>
      <circle cx="115" cy="78" r="6" fill="#4a4032"/>
      <ellipse cx="100" cy="96" rx="10" ry="7" fill="#4a4032"/>
      <path d="M100 103 Q100 112 90 114" stroke="#4a4032" stroke-width="4" fill="none" stroke-linecap="round"/>
      <path d="M100 103 Q100 112 110 114" stroke="#4a4032" stroke-width="4" fill="none" stroke-linecap="round"/>
    </svg>`,dirt:`#8a6b4a`,fleck:`#6d5238`},{clean:`<svg viewBox="0 0 200 200">
      <rect x="18" y="18" width="164" height="164" rx="10" fill="#bfe6ee"/>
      <circle cx="146" cy="56" r="22" fill="#f7d570"/>
      <path d="M18 148 Q60 108 100 148 Q140 112 182 148 L182 182 L18 182 Z" fill="#9ec99f"/>
      <ellipse cx="62" cy="52" rx="24" ry="13" fill="#fffaf2"/>
      <ellipse cx="86" cy="58" rx="17" ry="10" fill="#fffaf2"/>
      <rect x="18" y="18" width="164" height="164" rx="10" fill="none" stroke="#cbb98a" stroke-width="10"/>
      <rect x="95" y="18" width="10" height="164" fill="#cbb98a"/>
      <rect x="18" y="95" width="164" height="10" fill="#cbb98a"/>
    </svg>`,dirt:`#9aa38f`,fleck:`#7d8673`},{clean:`<svg viewBox="0 0 200 200">
      <rect x="24" y="96" width="152" height="48" rx="16" fill="#e88a9a"/>
      <path d="M52 96 L68 62 H132 L150 96 Z" fill="#f2a9b6"/>
      <rect x="72" y="68" width="24" height="24" rx="4" fill="#cfeaf5"/>
      <rect x="106" y="68" width="24" height="24" rx="4" fill="#cfeaf5"/>
      <circle cx="62" cy="148" r="20" fill="#4a4032"/>
      <circle cx="62" cy="148" r="8" fill="#a89a82"/>
      <circle cx="140" cy="148" r="20" fill="#4a4032"/>
      <circle cx="140" cy="148" r="8" fill="#a89a82"/>
      <circle cx="34" cy="112" r="7" fill="#f7d570"/>
    </svg>`,dirt:`#7d6b52`,fleck:`#5f5040`}],qn=34,Jn=.82,T=null,E=null,D=null,Yn=0,Xn=!1,Zn=[],Qn=null,$n=null,er=[],tr=new Map;function nr(e,t,n){e.addEventListener(t,n),Zn.push(()=>e.removeEventListener(t,n))}function rr(e){Zn=[],tr.clear(),er=[],Yn=0,Xn=!1,e.innerHTML=`
    <div class="putzen-stage" id="putzenStage">
      <div class="putzen-motiv" id="putzenMotiv"></div>
      <canvas class="putzen-canvas" id="putzenCanvas"></canvas>
      <div class="putzen-funkeln" id="putzenFunkeln"></div>
      <button class="putzen-next" id="putzenNext" aria-hidden="true">
        <svg viewBox="0 0 48 48" width="30" height="30">
          <path d="M24 8 A16 16 0 1 1 12 14" fill="none" stroke="#8a7255" stroke-width="4" stroke-linecap="round"/>
          <path d="M8 6 L12 15 L21 12" fill="none" stroke="#8a7255" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </button>
    </div>
  `,D=e.querySelector(`#putzenStage`),T=e.querySelector(`#putzenCanvas`),ir(e,0),nr(T,`pointerdown`,cr),nr(T,`pointermove`,lr),nr(T,`pointerup`,ur),nr(T,`pointercancel`,ur),nr(e.querySelector(`#putzenNext`),`pointerdown`,t=>{t.preventDefault(),ir(e,Yn+1),_()});let t=D.clientWidth,n=D.clientHeight,r=()=>{if(!D)return;let e=D.clientWidth,r=D.clientHeight;(e!==t||r!==n)&&(t=e,n=r,Qn!==null&&window.clearTimeout(Qn),Qn=window.setTimeout(()=>ar(),220))};$n=new ResizeObserver(r),$n.observe(D),nr(window,`resize`,r),nr(window,`orientationchange`,r)}function ir(e,t){Yn=(t%Kn.length+Kn.length)%Kn.length,Xn=!1,D?.classList.remove(`sauber`);let n=e.querySelector(`#putzenMotiv`);n.innerHTML=Kn[Yn].clean,ar()}function ar(){if(!T||!D)return;let e=Math.min(window.devicePixelRatio||1,2),t=D.clientWidth,n=D.clientHeight;T.width=Math.round(t*e),T.height=Math.round(n*e),T.style.width=`${t}px`,T.style.height=`${n}px`,E=T.getContext(`2d`,{willReadFrequently:!0}),E&&(E.scale(e,e),or(t,n))}function or(e,t){if(!E)return;let n=Kn[Yn];E.globalCompositeOperation=`source-over`,E.clearRect(0,0,e,t),E.fillStyle=n.dirt,E.fillRect(0,0,e,t),E.fillStyle=n.fleck;for(let n=0;n<140;n++){let n=Math.random()*e,r=Math.random()*t,i=6+Math.random()*26;E.globalAlpha=.18+Math.random()*.3,E.beginPath(),E.ellipse(n,r,i,i*(.6+Math.random()*.7),Math.random()*Math.PI,0,Math.PI*2),E.fill()}E.globalAlpha=1}function sr(e){let t=T,n=t.getBoundingClientRect(),r=n.width===0?1:t.clientWidth/n.width,i=n.height===0?1:t.clientHeight/n.height;return{x:(e.clientX-n.left)*r,y:(e.clientY-n.top)*i}}function cr(e){let t=e;if(t.preventDefault(),!T||!E)return;try{T.setPointerCapture(t.pointerId)}catch{}let n=sr(t);tr.set(t.pointerId,n),dr(n.x,n.y),mr()}function lr(e){let t=e,n=tr.get(t.pointerId);if(!n||!E)return;let r=sr(t);fr(n.x,n.y,r.x,r.y),tr.set(t.pointerId,r),mr()}function ur(e){let t=e;if(tr.has(t.pointerId)){if(tr.delete(t.pointerId),T)try{T.releasePointerCapture(t.pointerId)}catch{}gr()}}function dr(e,t){E&&(E.globalCompositeOperation=`destination-out`,E.beginPath(),E.arc(e,t,qn,0,Math.PI*2),E.fill())}function fr(e,t,n,r){E&&(E.globalCompositeOperation=`destination-out`,E.lineCap=`round`,E.lineJoin=`round`,E.lineWidth=68,E.beginPath(),E.moveTo(e,t),E.lineTo(n,r),E.stroke())}var pr=0;function mr(){let e=performance.now();e-pr<130||(pr=e,m({freq:180+Math.random()*90,duration:.05,attack:.01,release:.1,type:`triangle`,gain:.07}))}function hr(){if(!T||!E)return 0;let e=0,t=0,n=T.width/24,r=T.height/24;for(let i=0;i<24;i++)for(let a=0;a<24;a++){let o=Math.min(T.width-1,Math.floor(i*n+n/2)),s=Math.min(T.height-1,Math.floor(a*r+r/2));E.getImageData(o,s,1,1).data[3]<40&&e++,t++}return t===0?0:e/t}function gr(){if(!Xn&&!(hr()<Jn)){if(Xn=!0,E&&T){let e=Math.min(window.devicePixelRatio||1,2);E.globalCompositeOperation=`destination-out`,E.fillStyle=`#000`,E.fillRect(0,0,T.width/e,T.height/e)}D?.classList.add(`sauber`),[0,130,260].forEach((e,t)=>{let n=window.setTimeout(()=>{m({freq:p[t+3],duration:.3,attack:.01,release:.5,gain:.24})},e);er.push(n)})}}function _r(){Zn.forEach(e=>e()),Zn=[],$n?.disconnect(),$n=null,Qn!==null&&(window.clearTimeout(Qn),Qn=null),er.forEach(e=>window.clearTimeout(e)),er=[],tr.clear(),T=null,E=null,D=null}var vr={id:`putzen`,name:`Putzen`,accent:`#7ec8d8`,tileIcon:Gn,mount:rr,unmount:_r},yr=`
<svg viewBox="0 0 120 120" width="100%" height="100%">
  <rect x="16" y="22" width="88" height="66" rx="10" fill="#dff0e4"/>
  <path d="M16 72 Q40 54 62 72 Q82 56 104 72 L104 88 H16 Z" fill="#9ec99f"/>
  <circle cx="86" cy="40" r="12" fill="#f7d570"/>
  <ellipse cx="46" cy="60" rx="13" ry="11" fill="#e88a9a"/>
  <circle cx="42" cy="57" r="2.5" fill="#4a4032"/>
  <circle cx="50" cy="57" r="2.5" fill="#4a4032"/>
  <path d="M74 92 l7 -13 l7 13 z" fill="#7fb99e"/>
</svg>`,br=[{id:`hase`,size:106,note:0,svg:`<svg viewBox="0 0 100 100"><ellipse cx="50" cy="64" rx="26" ry="28" fill="#f3e7db"/><ellipse cx="38" cy="24" rx="8" ry="20" fill="#f3e7db"/><ellipse cx="62" cy="24" rx="8" ry="20" fill="#f3e7db"/><ellipse cx="38" cy="26" rx="4" ry="13" fill="#f2b8c6"/><ellipse cx="62" cy="26" rx="4" ry="13" fill="#f2b8c6"/><circle cx="41" cy="60" r="4" fill="#4a4032"/><circle cx="59" cy="60" r="4" fill="#4a4032"/><ellipse cx="50" cy="70" rx="5" ry="3.5" fill="#e88a9a"/></svg>`},{id:`baum`,size:125,note:1,svg:`<svg viewBox="0 0 100 100"><rect x="43" y="58" width="14" height="36" rx="5" fill="#a9835e"/><circle cx="50" cy="40" r="28" fill="#7fb99e"/><circle cx="30" cy="50" r="18" fill="#8fc4a8"/><circle cx="70" cy="50" r="18" fill="#8fc4a8"/></svg>`},{id:`blume`,size:94,note:2,svg:`<svg viewBox="0 0 100 100"><rect x="46" y="52" width="8" height="42" rx="4" fill="#7fb99e"/><ellipse cx="30" cy="62" rx="14" ry="7" fill="#8fc4a8"/><g><ellipse cx="50" cy="26" rx="11" ry="17" fill="#e88a9a"/><ellipse cx="50" cy="26" rx="11" ry="17" fill="#e88a9a" transform="rotate(72 50 40)"/><ellipse cx="50" cy="26" rx="11" ry="17" fill="#e88a9a" transform="rotate(144 50 40)"/><ellipse cx="50" cy="26" rx="11" ry="17" fill="#e88a9a" transform="rotate(216 50 40)"/><ellipse cx="50" cy="26" rx="11" ry="17" fill="#e88a9a" transform="rotate(288 50 40)"/></g><circle cx="50" cy="40" r="10" fill="#f4c86b"/></svg>`},{id:`sonne`,size:101,note:3,svg:`<svg viewBox="0 0 100 100"><g stroke="#f4c86b" stroke-width="7" stroke-linecap="round"><line x1="50" y1="8" x2="50" y2="20"/><line x1="50" y1="80" x2="50" y2="92"/><line x1="8" y1="50" x2="20" y2="50"/><line x1="80" y1="50" x2="92" y2="50"/><line x1="20" y1="20" x2="28" y2="28"/><line x1="72" y1="72" x2="80" y2="80"/><line x1="20" y1="80" x2="28" y2="72"/><line x1="72" y1="28" x2="80" y2="20"/></g><circle cx="50" cy="50" r="24" fill="#f7d570"/><circle cx="42" cy="46" r="3" fill="#c99a3c"/><circle cx="58" cy="46" r="3" fill="#c99a3c"/><path d="M43 56 Q50 62 57 56" stroke="#c99a3c" stroke-width="3" fill="none" stroke-linecap="round"/></svg>`},{id:`wolke`,size:120,note:4,svg:`<svg viewBox="0 0 100 100"><g fill="#fffaf2" stroke="#bcd6e0" stroke-width="3"><ellipse cx="38" cy="58" rx="22" ry="18"/><ellipse cx="62" cy="58" rx="20" ry="16"/><ellipse cx="50" cy="46" rx="20" ry="18"/></g></svg>`},{id:`vogel`,size:91,note:5,svg:`<svg viewBox="0 0 100 100"><ellipse cx="52" cy="56" rx="24" ry="19" fill="#7ea3c9"/><circle cx="34" cy="44" r="14" fill="#8fb3d4"/><path d="M22 44 l-12 5 l12 5 z" fill="#f4a56b"/><circle cx="31" cy="41" r="3" fill="#4a4032"/><path d="M56 52 q14 -8 22 2 q-12 8 -22 -2z" fill="#6b93bd"/><path d="M70 66 l14 8" stroke="#f4a56b" stroke-width="5" stroke-linecap="round"/></svg>`},{id:`pilz`,size:88,note:6,svg:`<svg viewBox="0 0 100 100"><rect x="40" y="52" width="20" height="38" rx="8" fill="#f3e7db"/><path d="M14 54 a36 30 0 0 1 72 0 z" fill="#e88a9a"/><circle cx="36" cy="40" r="7" fill="#fffaf2"/><circle cx="62" cy="34" r="5" fill="#fffaf2"/><circle cx="54" cy="48" r="4" fill="#fffaf2"/></svg>`},{id:`stern`,size:81,note:7,svg:`<svg viewBox="0 0 100 100"><path d="M50 8 L61 38 L93 38 L67 57 L77 88 L50 69 L23 88 L33 57 L7 38 L39 38 Z" fill="#f4c86b"/></svg>`}],xr=`sticker`,Sr=1,Cr=60,O=[],wr=null,Tr=null,Er=null,Dr=[],Or=null,kr=null;function Ar(e,t,n){e.addEventListener(t,n),Dr.push(()=>e.removeEventListener(t,n))}function jr(e){return br.find(t=>t.id===e)??br[0]}function Mr(){v(xr,Sr,{placed:O})}function Nr(e){Dr=[],O=pe(xr,Sr,{placed:[]}).placed,e.innerHTML=`
    <div class="sticker-stage" id="stickerStage">
      <div class="sticker-szene" id="stickerSzene">
        <div class="szene-himmel"></div>
        <div class="szene-huegel h1"></div>
        <div class="szene-huegel h2"></div>
        <div class="szene-wiese"></div>
        <div class="sticker-platziert" id="stickerPlatziert"></div>
      </div>
      <button class="sticker-clear" id="stickerClear" aria-hidden="true">
        <svg viewBox="0 0 48 48" width="30" height="30">
          <line x1="38" y1="6" x2="20" y2="24" stroke="#a9835e" stroke-width="4" stroke-linecap="round"/>
          <path d="M20 24 L8 30 A20 20 0 0 0 30 40 Z" fill="#e0a458" stroke="#8a7255" stroke-width="2.5" stroke-linejoin="round"/>
          <path d="M12 32 L16 39 M18 28 L22 36 M24 26 L27 34" stroke="#fdf6ea" stroke-width="1.6" stroke-linecap="round"/>
        </svg>
      </button>
      <div class="sticker-tray" id="stickerTray">
        ${br.map(e=>`<div class="tray-item" data-art="${e.id}" style="width:${e.size*.62}px;height:${e.size*.62}px">${e.svg}</div>`).join(``)}
      </div>
    </div>
  `,wr=e.querySelector(`#stickerStage`),Tr=e.querySelector(`#stickerSzene`),Er=e.querySelector(`#stickerTray`),Fr(),Lr(e),Er.querySelectorAll(`.tray-item`).forEach(e=>{Ar(e,`pointerdown`,t=>Vr(t,e))}),Or=new ResizeObserver(()=>{let e=document.getElementById(`stickerPlatziert`);e&&e.querySelectorAll(`.sticker`).forEach(e=>{let t=Number(e.dataset.index);if(t===kr)return;let n=O[t];n&&Pr(e,n.xPct,n.yPct)})}),Or.observe(Tr)}function Pr(e,t,n){Tr&&(e.style.setProperty(`--tx`,`${(t/100*Tr.clientWidth).toFixed(1)}px`),e.style.setProperty(`--ty`,`${(n/100*Tr.clientHeight).toFixed(1)}px`))}function Fr(){let e=document.getElementById(`stickerPlatziert`);e&&(e.innerHTML=``,O.forEach((t,n)=>{let r=jr(t.art),i=document.createElement(`div`);i.className=`sticker`,i.dataset.index=String(n),i.style.width=`${r.size}px`,i.style.height=`${r.size}px`,Pr(i,t.xPct,t.yPct),i.style.setProperty(`--rot`,`${t.rot}deg`),i.innerHTML=r.svg,e.appendChild(i),Ir(i,n)}))}function Ir(e,t){let n=!1,r=0,i=0,a=0;e.addEventListener(`pointerdown`,o=>{o.preventDefault(),o.stopPropagation(),n=!0,kr=t,r=0,i=o.clientX,a=o.clientY,e.classList.add(`greift`);try{e.setPointerCapture(o.pointerId)}catch{}}),e.addEventListener(`pointermove`,o=>{if(!n||!Tr)return;r=Math.max(r,Math.hypot(o.clientX-i,o.clientY-a));let s=Tr.getBoundingClientRect(),c=O[t];c&&(c.xPct=Br((o.clientX-s.left)/s.width*100,2,98),c.yPct=Br((o.clientY-s.top)/s.height*100,2,98),Pr(e,c.xPct,c.yPct))});let o=i=>{if(n){n=!1,kr=null,e.classList.remove(`greift`);try{e.releasePointerCapture(i.pointerId)}catch{}if(Er&&zr(i.clientX,i.clientY)){O.splice(t,1),Mr(),Fr(),h(300);return}r<10&&(e.classList.remove(`wackelt`),e.offsetWidth,e.classList.add(`wackelt`),m({freq:p[jr(O[t]?.art??br[0].id).note%p.length],duration:.3,gain:.28})),Mr()}};e.addEventListener(`pointerup`,o),e.addEventListener(`pointercancel`,o)}function Lr(e){Ar(e.querySelector(`#stickerClear`),`pointerdown`,e=>{e.preventDefault(),O.length!==0&&Rr()})}function Rr(){let e=document.getElementById(`stickerPlatziert`);if(!e)return;let t=[...e.querySelectorAll(`.sticker`)];t.forEach((e,t)=>{e.style.transitionDelay=`${Math.min(t*25,500)}ms`,e.offsetWidth,e.classList.add(`wegfegen`)}),_(),window.setTimeout(()=>{O=[],Mr(),Fr()},500+Math.min(t.length*25,500))}function zr(e,t){if(!Er)return!1;let n=Er.getBoundingClientRect();return e>=n.left&&e<=n.right&&t>=n.top&&t<=n.bottom}function Br(e,t,n){return Math.max(t,Math.min(n,e))}function Vr(e,t){if(e.preventDefault(),!wr)return;let n=jr(t.dataset.art??``);try{t.setPointerCapture(e.pointerId)}catch{}let r=document.createElement(`div`);r.className=`sticker-ghost`,r.style.width=`${n.size}px`,r.style.height=`${n.size}px`,r.innerHTML=n.svg,wr.appendChild(r);let i=(e,t)=>{let n=wr.getBoundingClientRect();r.style.setProperty(`--tx`,`${(e-n.left).toFixed(1)}px`),r.style.setProperty(`--ty`,`${(t-n.top).toFixed(1)}px`)};i(e.clientX,e.clientY),h(560);let a=!1;function o(e){let t=e;i(t.clientX,t.clientY)}function s(e){if(a)return;a=!0;let i=e;try{t.releasePointerCapture(i.pointerId)}catch{}t.removeEventListener(`pointermove`,o),t.removeEventListener(`pointerup`,s),t.removeEventListener(`pointercancel`,s),r.remove(),Hr(n,i.clientX,i.clientY)}t.addEventListener(`pointermove`,o),t.addEventListener(`pointerup`,s),t.addEventListener(`pointercancel`,s)}function Hr(e,t,n){if(!Tr||zr(t,n))return;let r=Tr.getBoundingClientRect();n>r.bottom||n<r.top||(O.length>=Cr&&O.shift(),O.push({art:e.id,xPct:Br((t-r.left)/r.width*100,2,98),yPct:Br((n-r.top)/r.height*100,2,98),rot:Math.round((Math.random()*2-1)*9)}),Mr(),Fr(),m({freq:p[e.note%p.length],duration:.28,gain:.3}))}function Ur(){Dr.forEach(e=>e()),Dr=[],Or?.disconnect(),Or=null,kr=null,O=[],wr=null,Tr=null,Er=null}var Wr={id:`sticker`,name:`Sticker-Szene`,accent:`#9ec99f`,tileIcon:yr,mount:Nr,unmount:Ur},Gr=`
<svg viewBox="0 0 120 120" width="100%" height="100%">
  <circle cx="94" cy="26" r="14" fill="#f7d570"/>
  <path d="M20 100 L20 60 L46 38 L72 60 L72 100 Z" fill="#f3e7db" stroke="#c9a37e" stroke-width="3"/>
  <path d="M14 62 L46 34 L78 62 Z" fill="#e88a9a"/>
  <rect x="38" y="76" width="16" height="24" rx="2" fill="#a9835e"/>
  <circle cx="30" cy="10" r="8" fill="#9ec99f" opacity="0.7"/>
</svg>`,Kr=`wimmelbild`,qr=1,Jr={tuerOffen:!1,vorhangOffen:!1,flaggeOben:!1},k={...Jr},Yr=[],Xr=[],Zr=new Set;function Qr(e,t,n){e.addEventListener(t,n),Yr.push(()=>e.removeEventListener(t,n))}function $r(){v(Kr,qr,k)}function ei(e,t){let n=window.setTimeout(e,t);Xr.push(n)}function ti(e,t,n){let r=e.querySelector(t),i=t;Qr(r,`pointerdown`,e=>{e.preventDefault(),!Zr.has(i)&&(Zr.add(i),r.classList.remove(n.className),r.offsetWidth,r.classList.add(n.className),n.onTrigger?.(r),n.sound?.(),ei(()=>{r.classList.remove(n.className),Zr.delete(i)},n.duration))})}function ni(e){k=pe(Kr,qr,{...Jr}),Yr=[],Xr=[],Zr=new Set,e.innerHTML=`
    <div class="wimmel-stage">
      <div class="wimmel-szene">
        <div class="w-himmel"></div>
        <div class="w-huegel h1"></div>
        <div class="w-huegel h2"></div>
        <div class="w-wiese"></div>

        <div class="w-item w-sonne" data-item="sonne" style="left:88%;top:11%">
          <svg viewBox="0 0 100 100"><g class="sonne-strahlen" stroke="#f4c86b" stroke-width="7" stroke-linecap="round">
            <line x1="50" y1="6" x2="50" y2="20"/><line x1="50" y1="80" x2="50" y2="94"/>
            <line x1="6" y1="50" x2="20" y2="50"/><line x1="80" y1="50" x2="94" y2="50"/>
            <line x1="18" y1="18" x2="28" y2="28"/><line x1="72" y1="72" x2="82" y2="82"/>
            <line x1="18" y1="82" x2="28" y2="72"/><line x1="72" y1="28" x2="82" y2="18"/>
          </g><circle cx="50" cy="50" r="25" fill="#f7d570"/><circle cx="42" cy="46" r="3" fill="#c99a3c"/>
          <circle cx="58" cy="46" r="3" fill="#c99a3c"/><path d="M42 57 Q50 64 58 57" stroke="#c99a3c" stroke-width="3" fill="none" stroke-linecap="round"/></svg>
        </div>

        <div class="w-item w-wolke" data-item="wolke" style="left:16%;top:15%">
          <svg viewBox="0 0 100 60"><g fill="#fffaf2" stroke="#bcd6e0" stroke-width="3">
            <ellipse cx="30" cy="38" rx="22" ry="17"/><ellipse cx="58" cy="38" rx="19" ry="15"/><ellipse cx="44" cy="26" rx="19" ry="17"/>
          </g></svg>
        </div>

        <div class="w-vogelhaus" data-item="vogelhaus" style="left:45%;top:40%">
          <svg viewBox="0 0 60 60"><path d="M6 24 L30 6 L54 24 Z" fill="#e88a9a"/><rect x="10" y="24" width="40" height="30" rx="4" fill="#f3e7db" stroke="#c9a37e" stroke-width="2"/><circle cx="30" cy="38" r="7" fill="#8a7255"/></svg>
          <div class="w-vogel">
            <svg viewBox="0 0 100 100"><ellipse cx="52" cy="56" rx="24" ry="19" fill="#7ea3c9"/><circle cx="34" cy="44" r="14" fill="#8fb3d4"/><path d="M22 44 l-12 5 l12 5 z" fill="#f4a56b"/><circle cx="31" cy="41" r="3" fill="#4a4032"/><path d="M56 52 q14 -8 22 2 q-12 8 -22 -2z" fill="#6b93bd"/></svg>
          </div>
        </div>

        <div class="w-haus" style="left:12%;top:46%">
          <div class="w-schornstein" data-item="schornstein">
            <span class="rauch r1"></span><span class="rauch r2"></span><span class="rauch r3"></span>
          </div>
          <div class="w-dach"></div>
          <div class="w-wand">
            <div class="w-fenster" data-item="fenster">
              <div class="fenster-innen"><div class="fenster-gesicht"></div></div>
              <div class="fenster-vorhang links"></div>
              <div class="fenster-vorhang rechts"></div>
            </div>
            <div class="w-tuer" data-item="tuer">
              <div class="tuer-katze">
                <svg viewBox="0 0 100 100"><ellipse cx="50" cy="60" rx="26" ry="24" fill="#e0a458"/><path d="M26 46 L20 18 L46 40 Z" fill="#e0a458"/><path d="M74 46 L80 18 L54 40 Z" fill="#e0a458"/><path d="M28 42 L24 24 L40 38 Z" fill="#f2b8c6"/><path d="M72 42 L76 24 L60 38 Z" fill="#f2b8c6"/><circle cx="40" cy="58" r="4" fill="#4a4032"/><circle cx="60" cy="58" r="4" fill="#4a4032"/><path d="M42 68 Q50 73 58 68" stroke="#8a5a2e" stroke-width="2.5" fill="none" stroke-linecap="round"/></svg>
              </div>
              <div class="tuer-panel"></div>
            </div>
          </div>
        </div>

        <div class="w-baum" style="left:36%;top:50%">
          <div class="baum-stamm"></div>
          <div class="baum-krone"></div>
          <div class="w-apfel" data-item="apfel">
            <svg viewBox="0 0 40 40"><circle cx="20" cy="22" r="15" fill="#e88a9a"/><rect x="18" y="4" width="4" height="10" rx="2" fill="#7fb99e"/></svg>
          </div>
        </div>

        <div class="w-schaukel" data-item="schaukel" style="left:64%;top:58%">
          <svg class="schaukel-rahmen" viewBox="0 0 100 90"><path d="M6 88 L30 10 M94 88 L70 10 M30 10 L70 10" stroke="#a9835e" stroke-width="6" stroke-linecap="round" fill="none"/></svg>
          <div class="schaukel-sitz">
            <span class="seil links"></span><span class="seil rechts"></span>
            <span class="brett"></span>
          </div>
        </div>

        <div class="w-blume" style="left:84%;top:76%">
          <svg viewBox="0 0 100 100"><rect x="46" y="52" width="8" height="42" rx="4" fill="#7fb99e"/><ellipse cx="30" cy="62" rx="14" ry="7" fill="#8fc4a8"/><g><ellipse cx="50" cy="26" rx="11" ry="17" fill="#c896d8"/><ellipse cx="50" cy="26" rx="11" ry="17" fill="#c896d8" transform="rotate(72 50 40)"/><ellipse cx="50" cy="26" rx="11" ry="17" fill="#c896d8" transform="rotate(144 50 40)"/><ellipse cx="50" cy="26" rx="11" ry="17" fill="#c896d8" transform="rotate(216 50 40)"/><ellipse cx="50" cy="26" rx="11" ry="17" fill="#c896d8" transform="rotate(288 50 40)"/></g><circle cx="50" cy="40" r="10" fill="#f4c86b"/></svg>
          <div class="w-biene" data-item="biene">
            <svg viewBox="0 0 60 40"><ellipse cx="30" cy="20" rx="18" ry="13" fill="#f4c86b"/><path d="M16 20 A14 13 0 0 1 44 20" fill="none" stroke="#4a4032" stroke-width="4"/><ellipse cx="12" cy="12" rx="9" ry="7" fill="#eaf5fb" opacity="0.85"/><ellipse cx="20" cy="6" rx="9" ry="7" fill="#eaf5fb" opacity="0.85"/></svg>
          </div>
        </div>

        <div class="w-maulwurfshuegel" data-item="maulwurf" style="left:20%;top:86%">
          <div class="huegel-erde"></div>
          <div class="w-maulwurf-tier">
            <svg viewBox="0 0 100 90"><ellipse cx="50" cy="50" rx="34" ry="30" fill="#8a7d72"/><ellipse cx="50" cy="70" rx="14" ry="10" fill="#f3c9c9"/><circle cx="38" cy="42" r="4" fill="#2c2620"/><circle cx="62" cy="42" r="4" fill="#2c2620"/></svg>
          </div>
        </div>

        <div class="w-briefkasten" data-item="briefkasten" style="left:92%;top:70%">
          <svg viewBox="0 0 60 90"><rect x="24" y="30" width="8" height="50" fill="#a9835e"/><path d="M6 30 a18 18 0 0 1 36 0 v14 h-36 z" fill="#7ea3c9"/><rect x="6" y="44" width="36" height="4" fill="#5f80a3"/></svg>
          <div class="briefkasten-flagge"></div>
        </div>

        <div class="w-teich" style="left:56%;top:88%">
          <div class="teich-wasser"></div>
          <div class="w-frosch" data-item="frosch">
            <svg viewBox="0 0 100 80"><ellipse cx="50" cy="50" rx="34" ry="24" fill="#7fb99e"/><circle cx="30" cy="26" r="12" fill="#7fb99e"/><circle cx="70" cy="26" r="12" fill="#7fb99e"/><circle cx="30" cy="24" r="5" fill="#fffaf2"/><circle cx="70" cy="24" r="5" fill="#fffaf2"/><circle cx="30" cy="24" r="2.5" fill="#2c2620"/><circle cx="70" cy="24" r="2.5" fill="#2c2620"/><path d="M32 56 Q50 66 68 56" stroke="#4a7a5c" stroke-width="3" fill="none" stroke-linecap="round"/></svg>
          </div>
        </div>

        <div class="w-schnecke" data-item="schnecke" style="left:38%;top:92%">
          <svg viewBox="0 0 100 70"><circle cx="66" cy="34" r="24" fill="#e0a458"/><path d="M66 34 m-16 0 a16 16 0 1 1 32 0 a12 12 0 1 1 -24 0 a8 8 0 1 1 16 0" fill="none" stroke="#a9835e" stroke-width="3"/><ellipse cx="26" cy="52" rx="24" ry="11" fill="#f3e7db"/><g class="schnecke-fuehler"><line x1="16" y1="44" x2="10" y2="28" stroke="#f3e7db" stroke-width="5" stroke-linecap="round"/><circle cx="10" cy="28" r="4" fill="#f3e7db"/><line x1="26" y1="44" x2="24" y2="26" stroke="#f3e7db" stroke-width="5" stroke-linecap="round"/><circle cx="24" cy="26" r="4" fill="#f3e7db"/></g></svg>
        </div>

        <div class="w-marienkaefer" data-item="marienkaefer" style="left:8%;top:95%">
          <svg viewBox="0 0 60 60"><ellipse cx="30" cy="32" rx="22" ry="20" fill="#e0574a"/><path d="M30 12 v40" stroke="#2c2620" stroke-width="2.5"/><circle cx="30" cy="14" r="9" fill="#2c2620"/><circle cx="20" cy="24" r="3.5" fill="#2c2620"/><circle cx="40" cy="24" r="3.5" fill="#2c2620"/><circle cx="22" cy="40" r="3.5" fill="#2c2620"/><circle cx="38" cy="40" r="3.5" fill="#2c2620"/></svg>
        </div>
      </div>
    </div>
  `,ri(e),ii(e),ai(e),oi(e),si(e),ci(e),li(e),ui(e),di(e),fi(e),pi(e),mi(e),hi(e),gi(e)}function ri(e){ti(e,`.w-sonne`,{className:`strahlt`,duration:700,sound:()=>{m({freq:1046.5,duration:.35,attack:.01,release:.5,type:`sine`,gain:.22}),m({freq:1567.98,duration:.25,attack:.01,release:.4,type:`sine`,gain:.1})}})}function ii(e){ti(e,`.w-wolke`,{className:`zieht-vorbei`,duration:2400,sound:()=>_()})}function ai(e){ti(e,`.w-schornstein`,{className:`pufft`,duration:1400,sound:()=>m({freq:260,duration:.15,attack:.01,release:.3,type:`sine`,gain:.16})})}function oi(e){let t=e.querySelector(`.w-tuer`);t.classList.toggle(`offen`,k.tuerOffen),Qr(t,`pointerdown`,e=>{e.preventDefault(),k.tuerOffen=!k.tuerOffen,t.classList.toggle(`offen`,k.tuerOffen),_(),k.tuerOffen&&(m({freq:587.33,duration:.12,attack:.005,release:.15,type:`triangle`,gain:.2}),ei(()=>m({freq:493.88,duration:.18,attack:.005,release:.25,type:`triangle`,gain:.2}),130)),$r()})}function si(e){let t=e.querySelector(`.w-fenster`);t.classList.toggle(`offen`,k.vorhangOffen),Qr(t,`pointerdown`,e=>{e.preventDefault(),k.vorhangOffen=!k.vorhangOffen,t.classList.toggle(`offen`,k.vorhangOffen),_(),$r()})}function ci(e){ti(e,`.w-apfel`,{className:`faellt`,duration:900,sound:()=>m({freq:220,duration:.09,attack:.004,release:.14,type:`sine`,gain:.28})})}function li(e){ti(e,`.w-vogelhaus`,{className:`fliegt`,duration:1600,sound:()=>{[0,90,180].forEach((e,t)=>{ei(()=>m({freq:p[(4+t)%p.length],duration:.14,attack:.005,release:.2,type:`triangle`,gain:.22}),e)})}})}function ui(e){let t=e.querySelector(`.w-schaukel`),n=t.querySelector(`.schaukel-sitz`),r=`schaukel`;Qr(t,`pointerdown`,e=>{e.preventDefault(),!Zr.has(r)&&(Zr.add(r),n.classList.remove(`schwingt`),n.offsetWidth,n.classList.add(`schwingt`),[0,350,700,1050].forEach(e=>{ei(()=>m({freq:380,duration:.05,attack:.005,release:.1,type:`sine`,gain:.1}),e)}),ei(()=>{n.classList.remove(`schwingt`),Zr.delete(r)},2200))})}function di(e){ti(e,`.w-biene`,{className:`summt`,duration:1300,sound:()=>m({freq:660,duration:.5,attack:.02,release:.4,type:`sawtooth`,gain:.06})})}function fi(e){ti(e,`.w-maulwurfshuegel`,{className:`guckt`,duration:1200,sound:()=>m({freq:180,duration:.12,attack:.005,release:.2,type:`sine`,gain:.24})})}function pi(e){let t=e.querySelector(`.w-briefkasten`);t.classList.toggle(`offen`,k.flaggeOben),Qr(t,`pointerdown`,e=>{e.preventDefault(),k.flaggeOben=!k.flaggeOben,t.classList.toggle(`offen`,k.flaggeOben),h(k.flaggeOben?700:500),$r()})}function mi(e){ti(e,`.w-frosch`,{className:`huepft`,duration:700,sound:()=>m({freq:200,duration:.1,attack:.004,release:.16,type:`square`,gain:.18})})}function hi(e){ti(e,`.w-schnecke`,{className:`streckt`,duration:900,sound:()=>h(520)})}function gi(e){ti(e,`.w-marienkaefer`,{className:`fliegt-los`,duration:1100,sound:()=>m({freq:900,duration:.3,attack:.02,release:.3,type:`sawtooth`,gain:.05})})}function _i(){Yr.forEach(e=>e()),Yr=[],Xr.forEach(e=>window.clearTimeout(e)),Xr=[],Zr=new Set}var vi={id:`wimmelbild`,name:`Wimmelbild`,accent:`#9ec99f`,tileIcon:Gr,mount:ni,unmount:_i},yi=`
<svg viewBox="0 0 120 120" width="100%" height="100%">
  <path d="M78 20 a34 34 0 1 0 22 56 a26 26 0 1 1 -22 -56 Z" fill="#7ea3c9"/>
  <path d="M32 34 l4 10 l10 4 l-10 4 l-4 10 l-4 -10 l-10 -4 l10 -4 Z" fill="#f4c86b"/>
  <rect x="14" y="86" width="46" height="20" rx="6" fill="#e0a458"/>
  <circle cx="26" cy="86" r="8" fill="#f3e7db"/>
</svg>`,bi=[{id:`baer`,bettFarbe:`#e0a458`,wach:`<svg viewBox="0 0 100 100"><circle cx="50" cy="58" r="30" fill="#c9a37e"/><circle cx="24" cy="34" r="12" fill="#c9a37e"/><circle cx="76" cy="34" r="12" fill="#c9a37e"/><circle cx="40" cy="56" r="4" fill="#4a4032"/><circle cx="60" cy="56" r="4" fill="#4a4032"/><ellipse cx="50" cy="68" rx="8" ry="5" fill="#8a7255"/></svg>`,schlaeft:`<svg viewBox="0 0 100 100"><circle cx="50" cy="58" r="30" fill="#c9a37e"/><circle cx="24" cy="34" r="12" fill="#c9a37e"/><circle cx="76" cy="34" r="12" fill="#c9a37e"/><path d="M34 56 q6 5 12 0" stroke="#4a4032" stroke-width="3" fill="none" stroke-linecap="round"/><path d="M54 56 q6 5 12 0" stroke="#4a4032" stroke-width="3" fill="none" stroke-linecap="round"/><ellipse cx="50" cy="68" rx="8" ry="5" fill="#8a7255"/></svg>`},{id:`hase`,bettFarbe:`#e88a9a`,wach:`<svg viewBox="0 0 100 100"><ellipse cx="50" cy="62" rx="26" ry="26" fill="#f3e7db"/><ellipse cx="38" cy="24" rx="8" ry="20" fill="#f3e7db"/><ellipse cx="62" cy="24" rx="8" ry="20" fill="#f3e7db"/><ellipse cx="38" cy="26" rx="4" ry="13" fill="#f2b8c6"/><ellipse cx="62" cy="26" rx="4" ry="13" fill="#f2b8c6"/><circle cx="41" cy="58" r="4" fill="#4a4032"/><circle cx="59" cy="58" r="4" fill="#4a4032"/><ellipse cx="50" cy="68" rx="5" ry="3.5" fill="#e88a9a"/></svg>`,schlaeft:`<svg viewBox="0 0 100 100"><ellipse cx="50" cy="62" rx="26" ry="26" fill="#f3e7db"/><ellipse cx="38" cy="24" rx="8" ry="20" fill="#f3e7db"/><ellipse cx="62" cy="24" rx="8" ry="20" fill="#f3e7db"/><ellipse cx="38" cy="26" rx="4" ry="13" fill="#f2b8c6"/><ellipse cx="62" cy="26" rx="4" ry="13" fill="#f2b8c6"/><path d="M35 58 q6 5 12 0" stroke="#4a4032" stroke-width="3" fill="none" stroke-linecap="round"/><path d="M53 58 q6 5 12 0" stroke="#4a4032" stroke-width="3" fill="none" stroke-linecap="round"/><ellipse cx="50" cy="68" rx="5" ry="3.5" fill="#e88a9a"/></svg>`},{id:`katze`,bettFarbe:`#7ea3c9`,wach:`<svg viewBox="0 0 100 100"><ellipse cx="50" cy="60" rx="26" ry="24" fill="#e0a458"/><path d="M26 46 L20 18 L46 40 Z" fill="#e0a458"/><path d="M74 46 L80 18 L54 40 Z" fill="#e0a458"/><path d="M28 42 L24 24 L40 38 Z" fill="#f2b8c6"/><path d="M72 42 L76 24 L60 38 Z" fill="#f2b8c6"/><circle cx="40" cy="58" r="4" fill="#4a4032"/><circle cx="60" cy="58" r="4" fill="#4a4032"/><path d="M42 68 Q50 73 58 68" stroke="#8a5a2e" stroke-width="2.5" fill="none" stroke-linecap="round"/></svg>`,schlaeft:`<svg viewBox="0 0 100 100"><ellipse cx="50" cy="60" rx="26" ry="24" fill="#e0a458"/><path d="M26 46 L20 18 L46 40 Z" fill="#e0a458"/><path d="M74 46 L80 18 L54 40 Z" fill="#e0a458"/><path d="M28 42 L24 24 L40 38 Z" fill="#f2b8c6"/><path d="M72 42 L76 24 L60 38 Z" fill="#f2b8c6"/><path d="M34 58 q6 5 12 0" stroke="#4a4032" stroke-width="3" fill="none" stroke-linecap="round"/><path d="M54 58 q6 5 12 0" stroke="#4a4032" stroke-width="3" fill="none" stroke-linecap="round"/><path d="M42 68 Q50 71 58 68" stroke="#8a5a2e" stroke-width="2.5" fill="none" stroke-linecap="round"/></svg>`}],xi=`gutenacht`,Si=1,Ci={lampeAn:!0,schlaeft:[!1,!1,!1]},A={...Ci},wi=[],Ti=[];function Ei(e,t){let n=window.setTimeout(e,t);Ti.push(n)}function Di(e,t,n){e.addEventListener(t,n),wi.push(()=>e.removeEventListener(t,n))}function Oi(){v(xi,Si,A)}function ki(e){A=pe(xi,Si,{...Ci,schlaeft:[...Ci.schlaeft]}),wi=[],e.innerHTML=`
    <div class="nacht-stage">
      <div class="nacht-szene" id="nachtSzene">
        <div class="n-wand"></div>
        <div class="n-fenster">
          <div class="n-fenster-himmel">
            <div class="n-mond"></div>
            <span class="n-stern s1"></span><span class="n-stern s2"></span><span class="n-stern s3"></span>
            <span class="n-stern s4"></span><span class="n-stern s5"></span><span class="n-stern s6"></span>
          </div>
        </div>
        <div class="n-lampe" data-item="lampe">
          <svg viewBox="0 0 60 100" width="100%" height="100%">
            <line x1="30" y1="40" x2="30" y2="94" stroke="#a9835e" stroke-width="4"/>
            <circle class="lampe-glow" cx="30" cy="26" r="26"/>
            <path d="M8 30 L52 30 L44 4 L16 4 Z" fill="#e0a458"/>
            <circle class="lampe-birne" cx="30" cy="30" r="8"/>
          </svg>
        </div>

        <div class="n-betten">
          ${bi.map((e,t)=>`
            <div class="n-bett${A.schlaeft[t]?` schlaeft`:``}" style="--bett-farbe:${e.bettFarbe}">
              <div class="bett-rahmen"></div>
              <div class="n-tier${A.schlaeft[t]?` schlaeft`:``}" data-item="tier${t}" data-idx="${t}">
                <div class="tier-wach">${e.wach}</div>
                <div class="tier-schlaeft">${e.schlaeft}</div>
              </div>
              <div class="n-decke"></div>
            </div>
          `).join(``)}
        </div>
      </div>
    </div>
  `;let t=e.querySelector(`#nachtSzene`);t.classList.toggle(`dunkel`,!A.lampeAn),Ai(e,t),ji(e)}function Ai(e,t){Di(e.querySelector(`.n-lampe`),`pointerdown`,e=>{e.preventDefault(),A.lampeAn=!A.lampeAn,t.classList.toggle(`dunkel`,!A.lampeAn),m({freq:A.lampeAn?480:320,duration:.18,attack:.01,release:.3,type:`sine`,gain:.18}),Oi()})}function ji(e){e.querySelectorAll(`.n-tier`).forEach(e=>{let t=Number(e.dataset.idx);Di(e,`pointerdown`,n=>{n.preventDefault();let r=!A.schlaeft[t];A.schlaeft[t]=r,e.classList.toggle(`schlaeft`,r),e.closest(`.n-bett`)?.classList.toggle(`schlaeft`,r),r?(_(),m({freq:392,duration:.2,attack:.01,release:.4,type:`sine`,gain:.16}),Ei(()=>{m({freq:294,duration:.3,attack:.01,release:.5,type:`sine`,gain:.14})},220)):(m({freq:440,duration:.1,attack:.005,release:.2,type:`triangle`,gain:.2}),Ei(()=>{m({freq:587.33,duration:.16,attack:.005,release:.25,type:`triangle`,gain:.2})},110)),Oi()})})}function Mi(){wi.forEach(e=>e()),wi=[],Ti.forEach(e=>window.clearTimeout(e)),Ti=[],A={...Ci,schlaeft:[...Ci.schlaeft]}}var Ni={id:`gutenacht`,name:`Gute-Nacht-Szene`,accent:`#7ea3c9`,tileIcon:yi,mount:ki,unmount:Mi},Pi=`
<svg viewBox="0 0 120 120" width="100%" height="100%">
  <path d="M14 58 V86 A26 9 0 0 0 66 86 V58 Z" fill="#e88a9a"/>
  <ellipse cx="40" cy="58" rx="26" ry="9" fill="#fdf6ea" stroke="#c96f7e" stroke-width="3"/>
  <path d="M60 40 V70 A23 8 0 0 0 106 70 V40 Z" fill="#7ea3c9"/>
  <ellipse cx="83" cy="40" rx="23" ry="8" fill="#fdf6ea" stroke="#5f86ad" stroke-width="3"/>
  <circle cx="36" cy="22" r="4" fill="#f4c86b"/>
  <circle cx="52" cy="30" r="3" fill="#7fb99e"/>
  <circle cx="86" cy="16" r="3.5" fill="#e88a9a"/>
</svg>`,Fi=[{id:0,freq:98,decay:.8,size:1,body:`#e88a9a`,rim:`#c96f7e`},{id:1,freq:130.81,decay:.65,size:.95,body:`#7ea3c9`,rim:`#5f86ad`},{id:2,freq:164.81,decay:.55,size:.9,body:`#7fb99e`,rim:`#5f9a80`},{id:3,freq:196,decay:.45,size:.86,body:`#f4c86b`,rim:`#d4a64a`}],Ii=[`#e88a9a`,`#7ea3c9`,`#7fb99e`,`#f4c86b`,`#c896d8`,`#e0a458`],Li=90,Ri=6,zi=40,Bi=null,Vi=[],Hi=[],Ui=new Set,Wi=0,Gi=0,Ki=new Map;function qi(e,t,n){e.addEventListener(t,n),Hi.push(()=>e.removeEventListener(t,n))}function Ji(e,t){let n=window.setTimeout(()=>{Ui.delete(n),e()},t);return Ui.add(n),n}function Yi(e){let t=[];for(let e=0;e<=8;e++){let n=18+e*20.5;t.push(`${n.toFixed(1)},${e%2==0?78:140}`)}return`
    <svg viewBox="0 0 200 190" width="100%" height="100%">
      <ellipse cx="100" cy="176" rx="86" ry="10" fill="rgba(90,70,40,0.14)"/>
      <path d="M16 62 V148 A84 26 0 0 0 184 148 V62 Z" fill="${e.body}"/>
      <polyline points="${t.join(` `)}" fill="none" stroke="#fdf6ea" stroke-width="4" stroke-linejoin="round" opacity="0.75"/>
      <path d="M16 140 A84 26 0 0 0 184 140" fill="none" stroke="${e.rim}" stroke-width="9"/>
      <g class="trommel-gesicht">
        <g class="gesicht-wach">
          <circle cx="78" cy="104" r="6" fill="#4a4032"/>
          <circle cx="122" cy="104" r="6" fill="#4a4032"/>
          <path d="M90 118 Q100 126 110 118" stroke="#4a4032" stroke-width="4" fill="none" stroke-linecap="round"/>
        </g>
        <g class="gesicht-bumm">
          <path d="M71 106 Q78 98 85 106" stroke="#4a4032" stroke-width="4.5" fill="none" stroke-linecap="round"/>
          <path d="M115 106 Q122 98 129 106" stroke="#4a4032" stroke-width="4.5" fill="none" stroke-linecap="round"/>
          <ellipse cx="100" cy="122" rx="9" ry="8" fill="#4a4032"/>
        </g>
      </g>
      <g class="trommel-fell">
        <ellipse cx="100" cy="62" rx="84" ry="28" fill="#fdf6ea" stroke="${e.rim}" stroke-width="8"/>
        <ellipse cx="100" cy="60" rx="64" ry="18" fill="#f6ead6"/>
        <ellipse class="fell-welle" cx="100" cy="62" rx="70" ry="23" fill="none" stroke="${e.rim}" stroke-width="4"/>
      </g>
    </svg>`}function Xi(e){Hi=[],Ui=new Set,Wi=0,Gi=0,Ki=new Map,e.innerHTML=`
    <div class="trommel-stage" id="trommelStage">
      <div class="trommel-raster">
        ${Fi.map(e=>`
          <div class="trommel-zelle" data-id="${e.id}">
            <div class="trommel" style="--groesse:${e.size}">
              <div class="trommel-wackel">${Yi(e)}</div>
            </div>
            <div class="trommel-punkte"></div>
          </div>`).join(``)}
      </div>
    </div>
  `,Bi=e.querySelector(`#trommelStage`),Vi=Fi.map(t=>{let n=e.querySelector(`.trommel-zelle[data-id="${t.id}"]`);return{def:t,cell:n,drum:n.querySelector(`.trommel`),punkte:n.querySelector(`.trommel-punkte`),lastHitAt:-1/0,combo:0,bummTimer:null}}),qi(Bi,`pointerdown`,e=>{let t=e;t.preventDefault();try{Bi?.setPointerCapture(t.pointerId)}catch{}let n=Qi(t.clientX,t.clientY);n&&(Ki.set(t.pointerId,n.def.id),ea(n))}),qi(Bi,`pointermove`,e=>{let t=e;if(!Ki.has(t.pointerId))return;let n=$i(t.clientX,t.clientY),r=n?n.def.id:-1;r!==Ki.get(t.pointerId)&&(Ki.set(t.pointerId,r),n&&ea(n))});let t=e=>{let t=e;Ki.delete(t.pointerId)};qi(Bi,`pointerup`,t),qi(Bi,`pointercancel`,t)}function Zi(e){let t=e.cell.getBoundingClientRect();return{x:t.left+t.width/2,y:t.top+t.height/2,r:e.drum.offsetWidth/2}}function Qi(e,t){let n=null,r=1/0;for(let i of Vi){let a=Zi(i),o=Math.hypot(e-a.x,t-a.y);o<r&&(r=o,n=i)}return n}function $i(e,t){for(let n of Vi){let r=Zi(n);if(Math.hypot(e-r.x,t-r.y)<r.r*.95)return n}return null}function ea(e){let t=performance.now();e.combo=t-e.lastHitAt<Li?e.combo+1:1,e.lastHitAt=t;let n=Math.min(e.combo,4);e.combo===1?ta(()=>ie(e.def.freq,.42,e.def.decay),e.def.decay):e.combo===2&&ta(()=>ie(e.def.freq*.75,.3,e.def.decay*1.1),e.def.decay),na(e,n),ra(e,2+n*2)}function ta(e,t){Wi>=Ri||(Wi++,e(),Ji(()=>{Wi=Math.max(0,Wi-1)},t*1e3))}function na(e,t){e.drum.style.setProperty(`--staerke`,String(t)),e.drum.classList.remove(`bumm`),e.drum.offsetWidth,e.drum.classList.add(`bumm`),e.bummTimer!==null&&(window.clearTimeout(e.bummTimer),Ui.delete(e.bummTimer)),e.bummTimer=Ji(()=>{e.drum.classList.remove(`bumm`),e.bummTimer=null},560)}function ra(e,t){let n=e.drum.offsetWidth,r=e.cell.getBoundingClientRect(),i=Bi?.getBoundingClientRect().top??0,a=r.top+r.height/2-n*.2,o=Math.max(40,a-i-24);for(let r=0;r<t;r++){if(Gi>=zi)return;let t=document.createElement(`span`);t.className=`trommel-punkt`;let r=12+Math.random()*10;t.style.width=`${r}px`,t.style.height=`${r}px`,t.style.background=Ii[Math.floor(Math.random()*Ii.length)],t.style.setProperty(`--sx`,`${((Math.random()-.5)*n*.6).toFixed(0)}px`),t.style.setProperty(`--dx`,`${((Math.random()-.5)*n*.7).toFixed(0)}px`);let i=Math.min((.3+Math.random()*.4)*n,o*(.7+Math.random()*.3));t.style.setProperty(`--dy`,`${(-i).toFixed(0)}px`),t.style.top=`calc(50% - ${(n*.2).toFixed(0)}px)`,e.punkte.appendChild(t),Gi++,Ji(()=>{t.remove(),Gi=Math.max(0,Gi-1)},760)}}function ia(){Hi.forEach(e=>e()),Hi=[],Ui.forEach(e=>window.clearTimeout(e)),Ui=new Set,Wi=0,Gi=0,Ki=new Map,Vi=[],Bi=null}var aa={id:`trommeln`,name:`Patsch-Trommeln`,accent:`#e88a9a`,tileIcon:Pi,mount:Xi,unmount:ia},oa=`
<svg viewBox="0 0 120 120" width="100%" height="100%">
  <circle cx="44" cy="50" r="28" fill="#e88a9a"/>
  <path d="M44 22 A28 28 0 0 1 72 50 L44 50 Z" fill="#fdf6ea"/>
  <path d="M44 78 A28 28 0 0 1 16 50 L44 50 Z" fill="#f4c86b"/>
  <circle cx="44" cy="50" r="5" fill="#fdf6ea"/>
  <circle cx="84" cy="80" r="21" fill="#7ea3c9"/>
  <path d="M84 59 A21 21 0 0 1 105 80 L84 80 Z" fill="#fdf6ea"/>
  <path d="M84 101 A21 21 0 0 1 63 80 L84 80 Z" fill="#7fb99e"/>
  <circle cx="84" cy="80" r="4" fill="#fdf6ea"/>
</svg>`,sa=[{r:94,colors:[`#e88a9a`,`#fdf6ea`,`#f4c86b`],freq:196,xPct:24,yPct:30},{r:82,colors:[`#7ea3c9`,`#fdf6ea`,`#7fb99e`],freq:261.63,xPct:62,yPct:24},{r:72,colors:[`#f4c86b`,`#fdf6ea`,`#e88a9a`],freq:293.66,xPct:82,yPct:58},{r:88,colors:[`#7fb99e`,`#fdf6ea`,`#c896d8`],freq:220,xPct:44,yPct:64},{r:66,colors:[`#c896d8`,`#fdf6ea`,`#7ea3c9`],freq:329.63,xPct:18,yPct:76},{r:78,colors:[`#e0a458`,`#fdf6ea`,`#7ea3c9`],freq:246.94,xPct:72,yPct:84},{r:62,colors:[`#e88a9a`,`#fdf6ea`,`#7fb99e`],freq:392,xPct:40,yPct:20}],ca=90,la=.72,ua=2600,da=120,fa=44,pa=10,ma=`baelle`,ha=1,j=null,ga=null,M=[],_a=[],va=new Set,ya=null,ba=null,xa=0,N=0,P=0,Sa=1,Ca=!1,wa=new Map,Ta=0,Ea=0,Da=null,F=null;function Oa(e,t,n){e.addEventListener(t,n),_a.push(()=>e.removeEventListener(t,n))}function ka(e,t){let n=window.setTimeout(()=>{va.delete(n),e()},t);va.add(n)}function Aa(){!Ca||N===0||P===0||v(ma,ha,{pos:M.map(e=>[e.x/N*100,e.y/P*100])})}function ja(e){_a=[],va=new Set,wa=new Map,Ca=!1,Ta=0,N=0,P=0;let t=pe(ma,ha,null);Da=t&&Array.isArray(t.pos)&&t.pos.length===sa.length?t.pos:null,e.innerHTML=`
    <div class="baelle-stage" id="baelleStage">
      <div class="baelle-teppich"></div>
      <div class="baelle-wellen" id="baelleWellen"></div>
      <div class="baelle-layer">
        ${sa.map((e,t)=>`
          <div class="ball" data-i="${t}">
            <div class="ball-muster" style="--c1:${e.colors[0]};--c2:${e.colors[1]};--c3:${e.colors[2]}"></div>
            <div class="ball-glanz"></div>
          </div>`).join(``)}
      </div>
    </div>
  `,j=e.querySelector(`#baelleStage`),ga=e.querySelector(`#baelleWellen`),M=sa.map((t,n)=>{let r=e.querySelector(`.ball[data-i="${n}"]`);return{def:t,el:r,muster:r.querySelector(`.ball-muster`),r:t.r,x:0,y:0,vx:0,vy:0,spin:Math.random()*Math.PI*2,squash:0,squashDir:0,lastSoundAt:-1/0,dirty:!0}}),ya=new ResizeObserver(()=>Ma()),ya.observe(j),Oa(j,`pointerdown`,e=>La(e)),Oa(j,`pointermove`,e=>Ra(e)),Oa(j,`pointerup`,e=>wa.delete(e.pointerId)),Oa(j,`pointercancel`,e=>wa.delete(e.pointerId))}function Ma(){if(!j)return;let e=j.clientWidth,t=j.clientHeight;if(e<1||t<1)return;let n=N,r=P;N=e,P=t,Sa=Math.max(.55,Math.min(1.2,Math.min(N,P)/834)),M.forEach((e,t)=>{if(e.r=e.def.r*Sa,e.el.style.width=`${(e.r*2).toFixed(1)}px`,e.el.style.height=`${(e.r*2).toFixed(1)}px`,Ca)n>0&&r>0&&(e.x*=N/n,e.y*=P/r);else{let[n,r]=Da?.[t]??[e.def.xPct,e.def.yPct];e.x=n/100*N,e.y=r/100*P}e.x=Ia(e.x,e.r,N-e.r),e.y=Ia(e.y,e.r,P-e.r)}),Na();for(let e=0;e<20;e++)Ya();Ca||(Ca=!0,j.classList.add(`bereit`)),Xa(!0)}function Na(){let e=document.querySelector(`.back-button`);if(!j||!e||e.offsetWidth===0){F=null;return}let t=Pa(e),n=Pa(j);F={x:t.x-n.x+e.offsetWidth/2,y:t.y-n.y+e.offsetHeight/2,r:e.offsetWidth/2+10}}function Pa(e){let t=0,n=0,r=e;for(;r;)t+=r.offsetLeft,n+=r.offsetTop,r=r.offsetParent;return{x:t,y:n}}function Fa(e){if(!F)return 0;let t=e.x-F.x,n=e.y-F.y,r=Math.hypot(t,n),i=e.r+F.r;if(r>=i)return 0;let a=r<.001?1:t/r,o=r<.001?1:n/r;e.x=F.x+a*i,e.y=F.y+o*i;let s=e.vx*a+e.vy*o;return s>=0?0:(e.vx-=1.72*s*a,e.vy-=1.72*s*o,-s)}function Ia(e,t,n){return Math.max(t,Math.min(n,e))}function La(e){if(e.preventDefault(),!j||!Ca)return;try{j.setPointerCapture(e.pointerId)}catch{}let t=za(e.clientX,e.clientY);wa.set(e.pointerId,{x:t.x,y:t.y,vx:0,vy:0,t:performance.now()}),Ua(t.x,t.y);let n=da*Sa;for(let e of M){let r=e.x-t.x,i=e.y-t.y,a=Math.hypot(r,i),o,s;if(a<1){let e=Math.random()*Math.PI*2;o=Math.cos(e),s=Math.sin(e)}else o=r/a,s=i/a;if(a<e.r){let t=950+350*Math.random();e.vx+=o*t,e.vy+=s*t,Va(e,.2,Math.atan2(s,o)),Ha(e,.32)}else if(a<e.r+n){let t=1-(a-e.r)/n,r=650*t;e.vx+=o*r,e.vy+=s*r,Va(e,.1*t,Math.atan2(s,o))}Ba(e)}Wa()}function Ra(e){let t=wa.get(e.pointerId);if(!t||!Ca)return;let n=za(e.clientX,e.clientY),r=performance.now(),i=Math.max(8,r-t.t)/1e3;t.vx=t.vx*.4+(n.x-t.x)/i*.6,t.vy=t.vy*.4+(n.y-t.y)/i*.6,t.x=n.x,t.y=n.y,t.t=r;let a=fa*Sa,o=!1;for(let e of M){let r=e.x-n.x,i=e.y-n.y,s=Math.hypot(r,i),c=e.r+a;if(s>=c)continue;let l=s<1?1:r/s,u=s<1?0:i/s;e.x=n.x+l*c,e.y=n.y+u*c,e.dirty=!0;let d=(e.vx-t.vx)*l+(e.vy-t.vy)*u;d<0&&(e.vx-=1.6*d*l,e.vy-=1.6*d*u,-d>250&&(Va(e,Math.min(.2,-d/4e3),Math.atan2(u,l)),Ha(e,Math.min(.32,.12+-d/6e3)))),Ba(e),o=!0}o&&Wa()}function za(e,t){let n=j.getBoundingClientRect(),r=n.width>0?j.clientWidth/n.width:1,i=n.height>0?j.clientHeight/n.height:1;return{x:(e-n.left)*r,y:(t-n.top)*i}}function Ba(e){let t=Math.hypot(e.vx,e.vy);t>ua&&(e.vx*=ua/t,e.vy*=ua/t)}function Va(e,t,n){t>e.squash&&(e.squash=t,e.squashDir=n)}function Ha(e,t){let n=performance.now();n-e.lastSoundAt<70||n-Ea<35||(e.lastSoundAt=n,Ea=n,ae(e.def.freq,t))}function Ua(e,t){if(!ga||Ta>=pa)return;let n=document.createElement(`span`);n.className=`baelle-welle`,n.style.transform=`translate(${e.toFixed(0)}px, ${t.toFixed(0)}px)`,ga.appendChild(n),Ta++,ka(()=>{n.remove(),Ta=Math.max(0,Ta-1)},650)}function Wa(){ba===null&&(xa=performance.now(),ba=requestAnimationFrame(Ga))}function Ga(e){let t=Math.min(.1,Math.max(.001,(e-xa)/1e3));xa=e;let n=Math.ceil(t/.017);for(let e=0;e<n;e++)Ka(t/n);Xa(!1),M.some(e=>Math.abs(e.vx)>3||Math.abs(e.vy)>3||e.squash>.002)?ba=requestAnimationFrame(Ga):(ba=null,Aa())}function Ka(e){let t=Math.exp(-1*e),n=ca*Sa*e;for(let r of M){let i=Math.hypot(r.vx,r.vy);if(i>0){let e=Math.max(0,i*t-n);r.vx*=e/i,r.vy*=e/i}r.x+=r.vx*e,r.y+=r.vy*e,r.spin+=r.vx*e/r.r,r.squash*=Math.exp(-11*e),qa(r)}Ja();for(let e of M)e.x=Ia(e.x,e.r,N-e.r),e.y=Ia(e.y,e.r,P-e.r)}function qa(e){let t=0,n=0;e.x<e.r?(e.x=e.r,e.vx<0&&(t=-e.vx,e.vx=-e.vx*la,n=0)):e.x>N-e.r&&(e.x=N-e.r,e.vx>0&&(t=e.vx,e.vx=-e.vx*la,n=Math.PI)),e.y<e.r?(e.y=e.r,e.vy<0&&(t=Math.max(t,-e.vy),e.vy=-e.vy*la,n=Math.PI/2)):e.y>P-e.r&&(e.y=P-e.r,e.vy>0&&(t=Math.max(t,e.vy),e.vy=-e.vy*la,n=-Math.PI/2));let r=Fa(e);if(r>t&&F&&(t=r,n=Math.atan2(e.y-F.y,e.x-F.x)),t>140){Va(e,Math.min(.22,t/5e3),n);let r=performance.now();r-e.lastSoundAt>=70&&r-Ea>=35&&(e.lastSoundAt=r,Ea=r,ae(e.def.freq*.75,Math.min(.26,.06+t/7e3)))}}function Ja(){for(let e=0;e<M.length;e++)for(let t=e+1;t<M.length;t++){let n=M[e],r=M[t],i=r.x-n.x,a=r.y-n.y,o=Math.hypot(i,a),s=n.r+r.r;if(o>=s||o<.001)continue;let c=i/o,l=a/o,u=n.r*n.r,d=r.r*r.r,f=s-o;n.x-=c*f*(d/(u+d)),n.y-=l*f*(d/(u+d)),r.x+=c*f*(u/(u+d)),r.y+=l*f*(u/(u+d));let p=(r.vx-n.vx)*c+(r.vy-n.vy)*l;if(p>=0)continue;let m=-1.8599999999999999*p/(1/u+1/d);if(n.vx-=m/u*c,n.vy-=m/u*l,r.vx+=m/d*c,r.vy+=m/d*l,-p>160){let e=Math.min(.18,-p/5e3);Va(n,e,Math.atan2(l,c)),Va(r,e,Math.atan2(l,c));let t=performance.now();t-Ea>=35&&t-n.lastSoundAt>=70&&(n.lastSoundAt=t,r.lastSoundAt=t,Ea=t,ae((n.def.freq+r.def.freq)/2,Math.min(.28,.08+-p/6e3)))}}}function Ya(){for(let e=0;e<M.length;e++)for(let t=e+1;t<M.length;t++){let n=M[e],r=M[t],i=r.x-n.x,a=r.y-n.y,o=Math.hypot(i,a);o<.001&&(i=1,a=0,o=1);let s=n.r+r.r+2;if(o>=s)continue;let c=(s-o)/2;n.x-=i/o*c,n.y-=a/o*c,r.x+=i/o*c,r.y+=a/o*c}M.forEach(e=>{Fa(e),e.x=Ia(e.x,e.r,N-e.r),e.y=Ia(e.y,e.r,P-e.r)})}function Xa(e){for(let t of M){if(!e&&!t.dirty&&t.vx===0&&t.vy===0&&t.squash<.002)continue;t.dirty=!1;let n=t.squash,r=t.squashDir*180/Math.PI;t.el.style.transform=`translate(${(t.x-t.r).toFixed(1)}px, ${(t.y-t.r).toFixed(1)}px) rotate(${r.toFixed(1)}deg) scale(${(1-n).toFixed(3)}, ${(1+n*.6).toFixed(3)}) rotate(${(-r).toFixed(1)}deg)`,t.muster.style.transform=`rotate(${(t.spin*180/Math.PI).toFixed(1)}deg)`}}function Za(){Aa(),_a.forEach(e=>e()),_a=[],va.forEach(e=>window.clearTimeout(e)),va=new Set,ba!==null&&(cancelAnimationFrame(ba),ba=null),ya?.disconnect(),ya=null,wa=new Map,M=[],j=null,ga=null,Ca=!1,Da=null,F=null}var Qa={id:`baelle`,name:`Bälle schubsen`,accent:`#7ea3c9`,tileIcon:oa,mount:ja,unmount:Za},$a=`
<svg viewBox="0 0 120 120" width="100%" height="100%">
  <path d="M10 98 Q34 62 60 66 Q88 60 110 98 Z" fill="#e0a458"/>
  <path d="M22 98 Q40 76 58 80 Q74 76 92 98 Z" fill="#d9824f"/>
  <path d="M44 86 Q52 74 62 84 Q56 92 44 86 Z" fill="#f4c86b"/>
  <path d="M78 18 C92 26 94 42 80 54 C66 44 66 28 78 18 Z" fill="#c96f5a" transform="rotate(28 80 36)"/>
  <path d="M30 28 C40 34 40 46 32 52 C22 46 22 34 30 28 Z" fill="#f4c86b" transform="rotate(-24 31 40)"/>
</svg>`,eo=[`#e0a458`,`#d9824f`,`#f4c86b`,`#c96f5a`,`#b8a05a`,`#e8b06a`],to=[`ahorn`,`oval`,`rund`],no=.8,ro=.3,io=[[ro,30],[.6,24],[.86,24]],ao=600,oo=1.6,so=4.2,co=260,lo=2200,uo=230,fo=75,po=18,mo=13,ho=8,go=`laub`,_o=1,vo=io.reduce((e,[,t])=>e+t,0),I=null,yo=null,L=null,R=[],z=[],bo=[],xo=new Set,So=null,Co=null,wo=0,B=0,To=0,V=1,Eo=!1,Do=new Map,Oo=0,ko=0,Ao=null,jo=null;function Mo(e,t,n){e.addEventListener(t,n),bo.push(()=>e.removeEventListener(t,n))}function No(e,t){let n=window.setTimeout(()=>{xo.delete(n),e()},t);return xo.add(n),n}var Po={ahorn:`<path d="M50 4 L58 28 L78 16 L72 40 L95 42 L77 57 L86 76 L61 68 L55 88 L50 92 L45 88 L39 68 L14 76 L23 57 L5 42 L28 40 L22 16 L42 28 Z" fill="currentColor"/><path d="M50 98 L50 20 M50 60 L24 46 M50 60 L76 46" stroke="rgba(90,55,25,0.35)" stroke-width="3" fill="none" stroke-linecap="round"/>`,oval:`<path d="M50 4 C80 24 86 62 50 92 C14 62 20 24 50 4 Z" fill="currentColor"/><path d="M50 98 L50 12 M50 40 L34 28 M50 40 L66 28 M50 60 L32 48 M50 60 L68 48" stroke="rgba(90,55,25,0.35)" stroke-width="3" fill="none" stroke-linecap="round"/>`,rund:`<path d="M50 8 C82 10 94 46 72 74 C62 86 54 90 50 92 C46 90 38 86 28 74 C6 46 18 10 50 8 Z" fill="currentColor"/><path d="M50 98 L50 18 M50 50 L28 36 M50 50 L72 36" stroke="rgba(90,55,25,0.35)" stroke-width="3" fill="none" stroke-linecap="round"/>`},Fo=`
<svg viewBox="0 0 200 300" width="100%" height="100%" preserveAspectRatio="xMidYMax meet">
  <path d="M88 300 L92 150 L70 112 M92 170 L124 128 M92 150 L96 96" stroke="#a9835e" stroke-width="10" fill="none" stroke-linecap="round"/>
  <path d="M84 300 L88 150 L112 150 L116 300 Z" fill="#a9835e"/>
  <circle cx="100" cy="74" r="48" fill="#e8b06a"/>
  <circle cx="58" cy="104" r="40" fill="#e0a458"/>
  <circle cx="146" cy="100" r="40" fill="#d9824f"/>
  <circle cx="80" cy="140" r="34" fill="#f4c86b"/>
  <circle cx="128" cy="144" r="32" fill="#e8b06a"/>
  <circle cx="112" cy="58" r="22" fill="#f4c86b" opacity="0.8"/>
</svg>`,Io=`
<svg viewBox="0 0 120 76" width="100%" height="100%">
  <ellipse cx="58" cy="72" rx="50" ry="5" fill="rgba(90,70,40,0.18)"/>
  <path d="M8 70 L6 56 L14 50 L10 38 L22 36 L22 22 L34 26 L40 12 L50 22 L60 8 L66 22 L78 14 L80 28 L92 26 L90 40 L98 44 L96 70 Z" fill="#8a6a4a"/>
  <path d="M84 70 Q86 44 102 46 Q114 50 116 62 Q110 70 84 70 Z" fill="#e8cfa8"/>
  <circle cx="116" cy="61" r="3.5" fill="#4a4032"/>
  <g class="igel-auge-zu"><path d="M98 54 Q102 57 106 54" stroke="#4a4032" stroke-width="2.5" fill="none" stroke-linecap="round"/></g>
  <g class="igel-auge-auf"><circle cx="102" cy="54" r="3.5" fill="#4a4032"/><circle cx="103" cy="53" r="1.1" fill="#fff"/></g>
  <ellipse cx="96" cy="63" rx="4" ry="2.5" fill="#f2b8c6" opacity="0.7"/>
</svg>`;function Lo(e){bo=[],xo=new Set,Do=new Map,Eo=!1,Oo=0,B=0,To=0,Ao=null;let t=pe(go,_o,null);jo=t&&Array.isArray(t.liegen)&&t.liegen.length===vo?t:null,e.innerHTML=`
    <div class="laub-stage" id="laubStage">
      <div class="laub-himmel"></div>
      <div class="laub-huegel"></div>
      <div class="laub-baum">${Fo}</div>
      <div class="laub-boden"></div>
      <div class="laub-igel" id="laubIgel">${Io}</div>
      <div class="laub-blaetter" id="laubBlaetter"></div>
      <div class="laub-wirbel" id="laubWirbel"></div>
    </div>
  `,I=e.querySelector(`#laubStage`),yo=e.querySelector(`#laubWirbel`),L=e.querySelector(`#laubIgel`);let n=e.querySelector(`#laubBlaetter`);R=[];for(let e=0;e<vo;e++){let t=document.createElement(`div`);t.className=`laub-blatt`,t.style.color=eo[e%eo.length],t.innerHTML=`<svg viewBox="0 0 100 100" width="100%" height="100%">${Po[to[e%to.length]]}</svg>`,n.appendChild(t),R.push({i:e,el:t,size:0,baseSize:54+e*37%22,x:0,y:0,vx:0,vy:0,rot:0,vrot:0,phase:Math.random()*Math.PI*2,phaseSpeed:2.4+Math.random()*1.6,onGround:!1,bin:-1,dirty:!0})}So=new ResizeObserver(()=>Go()),So.observe(I),Mo(I,`pointerdown`,e=>Yo(e)),Mo(I,`pointermove`,e=>Xo(e)),Mo(I,`pointerup`,e=>Do.delete(e.pointerId)),Mo(I,`pointercancel`,e=>Do.delete(e.pointerId))}function Ro(){return To*no}function zo(){return Math.max(1,Math.ceil(B/(po*V)))}function Bo(e){return Math.max(0,Math.min(z.length-1,Math.floor(e/(po*V))))}function Vo(e){return(e+.5)*po*V}function Ho(e){return Ro()-e*mo*V-V*6}function Uo(e,t,n=!1){let r=t;for(let e=0;e<24;e++){let e=z[r].length,t=r>0?z[r-1].length:1/0,n=r<z.length-1?z[r+1].length:1/0;if(e-Math.min(t,n)<2)break;t<n?--r:r+=n<t?1:Math.random()<.5?-1:1}z[r].push(e),e.onGround=!0,e.bin=r;let i=po*V;n?e.x=Math.max(r*i,Math.min((r+1)*i,e.x)):(e.x=Vo(r)+(Math.random()-.5)*i*.8,e.rot=(Math.random()-.5)*70+(Math.random()<.5?0:180)),e.y=Ho(z[r].length-1),e.vx=0,e.vy=0,e.vrot=0,e.dirty=!0}function Wo(e){if(!e.onGround)return;let t=e.bin,n=z[t],r=n.indexOf(e);if(e.onGround=!1,e.bin=-1,r<0)return;let i=n.splice(r);i.shift(),i.forEach(e=>{e.onGround=!1,e.bin=-1,e.vy=0,e.vx=(Math.random()-.5)*40});for(let e of[t-1,t+1])if(!(e<0||e>=z.length))for(;z[e].length-z[t].length>3;){let n=z[e].pop();n.onGround=!1,n.bin=-1,n.vy=0,n.vx=(e<t?1:-1)*60}}function Go(){if(!I)return;let e=I.clientWidth,t=I.clientHeight;if(e<1||t<1)return;let n=B,r=To,i=Eo?Ko().map(e=>[e.i,e.x/n*100]):null;if(B=e,To=t,V=Math.max(.55,Math.min(1.2,Math.min(B,To)/834)),z=Array.from({length:zo()},()=>[]),R.forEach(e=>{e.size=e.baseSize*V,e.el.style.width=`${e.size.toFixed(1)}px`,e.el.style.height=`${e.size.toFixed(1)}px`}),Eo)i?.forEach(([e,t])=>Uo(R[e],Bo(t/100*B))),R.forEach(e=>{e.onGround||(e.x=Math.max(e.size/2,Math.min(B-e.size/2,e.x*(B/n))),e.y*=To/r,e.dirty=!0)});else{if(jo)jo.liegen.forEach(([e,t])=>{let n=R[e];n&&Uo(n,Bo(t/100*B))}),R.forEach(e=>{e.onGround||Uo(e,Bo(B/2))});else{let e=0;for(let[t,n]of io)for(let r=0;r<n;r++,e++){let n=(Math.random()+Math.random()-1)*50*V;Uo(R[e],Bo(t*B+n))}}Eo=!0,I.classList.add(`bereit`)}qo(),is()}function Ko(){let e=[],t=z.reduce((e,t)=>Math.max(e,t.length),0);for(let n=0;n<t;n++)for(let t of z)t[n]&&e.push(t[n]);return e}function qo(){if(!L)return;let e=120*V,t=76*V;L.style.width=`${e.toFixed(1)}px`,L.style.height=`${t.toFixed(1)}px`,L.style.transform=`translate(${(ro*B-e/2).toFixed(1)}px, ${(Ro()-t+4*V).toFixed(1)}px)`}function Jo(e,t){let n=I.getBoundingClientRect(),r=n.width>0?I.clientWidth/n.width:1,i=n.height>0?I.clientHeight/n.height:1;return{x:(e-n.left)*r,y:(t-n.top)*i}}function Yo(e){if(e.preventDefault(),!I||!Eo)return;try{I.setPointerCapture(e.pointerId)}catch{}let t=Jo(e.clientX,e.clientY);Do.set(e.pointerId,{x:t.x,y:t.y,vx:0,vy:0,t:performance.now()}),e.target.closest?.(`.laub-igel`)&&es();let n=uo*V,r=Math.min(.4,.8*n/Math.max(1,Ro())),i=0;for(let e of R){let a=e.x-t.x,o=e.y-t.y,s=Math.hypot(a,o>0?o*r:o);if(s>=n)continue;let c=1-s/n,l=Math.abs(a)<4?Math.random()<.5?-1:1:Math.sign(a);(e.x<B*.15&&l<0||e.x>B*.85&&l>0)&&(l*=-.7),Wo(e),e.vx+=(l*(100+500*c)*(.6+Math.random()*.7)+(Math.random()-.5)*120)*V,e.vy=Math.min(e.vy,-(250+1050*c)*(.75+Math.random()*.4)*V),e.vrot=(Math.random()-.5)*900,Zo(e),i++}$o(t.x,t.y),i>0?Qo(i):performance.now()-ko>120&&(ko=performance.now(),_()),ts()}function Xo(e){let t=Do.get(e.pointerId);if(!t||!Eo)return;let n=Jo(e.clientX,e.clientY),r=performance.now(),i=Math.max(8,r-t.t)/1e3;if(t.vx=t.vx*.4+(n.x-t.x)/i*.6,t.vy=t.vy*.4+(n.y-t.y)/i*.6,t.x=n.x,t.y=n.y,t.t=r,Math.hypot(t.vx,t.vy)<120*V)return;let a=fo*V,o=0;for(let e of R)Math.hypot(e.x-n.x,e.y-n.y)>=a||(e.onGround?(Wo(e),e.vx=t.vx*.6+(Math.random()-.5)*80*V,e.vy=Math.min(t.vy*.3,0)-(300+Math.random()*300)*V,e.vrot=(Math.random()-.5)*700,o++):(e.vx+=t.vx*.35,e.vy+=t.vy*.35),Zo(e));o>0&&Qo(o),ts()}function Zo(e){let t=lo*V,n=Math.hypot(e.vx,e.vy);n>t&&(e.vx*=t/n,e.vy*=t/n)}function Qo(e){let t=performance.now();t-ko<80||(ko=t,oe(Math.min(.3,.1+e*.012),.22+Math.min(.16,e*.01)))}function $o(e,t){if(!yo||Oo>=ho)return;let n=document.createElement(`span`);n.className=`laub-wirbelchen`,n.style.transform=`translate(${e.toFixed(0)}px, ${t.toFixed(0)}px)`,n.innerHTML=`<svg viewBox="0 0 80 80" width="100%" height="100%"><path d="M14 40 C14 20 40 12 54 24 C66 34 58 52 44 50 C34 48 34 36 42 34" fill="none" stroke="rgba(255,250,242,0.9)" stroke-width="6" stroke-linecap="round"/></svg>`,yo.appendChild(n),Oo++,No(()=>{n.remove(),Oo=Math.max(0,Oo-1)},700)}function es(){L&&(L.classList.add(`wach`),L.classList.remove(`hopst`),L.offsetWidth,L.classList.add(`hopst`),m({freq:880,duration:.04,attack:.004,release:.06,type:`triangle`,gain:.14}),No(()=>m({freq:988,duration:.04,attack:.004,release:.06,type:`triangle`,gain:.14}),120),Ao!==null&&(window.clearTimeout(Ao),xo.delete(Ao)),Ao=No(()=>{L?.classList.remove(`wach`),Ao=null},2200))}function ts(){Co===null&&(wo=performance.now(),Co=requestAnimationFrame(ns))}function ns(e){let t=Math.min(.1,Math.max(.001,(e-wo)/1e3));wo=e;let n=Math.ceil(t/.02);for(let e=0;e<n;e++)rs(t/n);is(),R.some(e=>!e.onGround)?Co=requestAnimationFrame(ns):(Co=null,as())}function rs(e){let t=ao*V;for(let n of R){if(n.onGround)continue;if(n.vy+=t*e,n.vy*=Math.exp(-(n.vy<0?oo:so)*e),n.vx*=Math.exp(-1.4*e),n.phase+=n.phaseSpeed*e,n.vy>0){n.vx+=Math.cos(n.phase)*co*V*e;let t=Math.sin(n.phase)*40;n.rot+=(t-n.rot)*Math.min(1,3*e)+n.vrot*e}else n.rot+=n.vrot*e;n.vrot*=Math.exp(-1.5*e),n.x+=n.vx*e,n.y+=n.vy*e;let r=n.size/2;n.x<r?(n.x=r,n.vx=Math.abs(n.vx)*.4):n.x>B-r&&(n.x=B-r,n.vx=-Math.abs(n.vx)*.4),n.y<r&&(n.y=r,n.vy=Math.abs(n.vy)*.2);let i=Bo(n.x);n.vy>=0&&n.y>=Ho(z[i].length)&&Uo(n,i,!0),n.dirty=!0}}function is(){for(let e of R)e.dirty&&(e.dirty=!1,e.el.style.transform=`translate(${(e.x-e.size/2).toFixed(1)}px, ${(e.y-e.size/2).toFixed(1)}px) rotate(${e.rot.toFixed(1)}deg)`)}function as(){if(!Eo||B===0)return;let e=Ko().map(e=>[e.i,e.x/B*100]);R.forEach(t=>{t.onGround||e.push([t.i,t.x/B*100])}),v(go,_o,{liegen:e})}function os(){as(),bo.forEach(e=>e()),bo=[],xo.forEach(e=>window.clearTimeout(e)),xo=new Set,Ao=null,Co!==null&&(cancelAnimationFrame(Co),Co=null),So?.disconnect(),So=null,Do=new Map,R=[],z=[],I=null,yo=null,L=null,Eo=!1,jo=null}var ss={id:`laub`,name:`Laubhaufen`,accent:`#e0a458`,tileIcon:$a,mount:Lo,unmount:os},cs=`
<svg viewBox="0 0 120 120" width="100%" height="100%">
  <rect x="8" y="8" width="104" height="104" rx="18" fill="#e3f0f5"/>
  <g>
    <circle cx="32" cy="32" r="14" fill="#bfe3f0"/><circle cx="60" cy="32" r="14" fill="#f6d2dc"/><circle cx="88" cy="32" r="14" fill="#fbe6b0"/>
    <circle cx="46" cy="60" r="14" fill="#cfe8d4"/><circle cx="74" cy="60" r="14" fill="#e2d4f0"/>
    <circle cx="32" cy="88" r="14" fill="#fbe6b0"/><circle cx="60" cy="88" r="11" fill="#d5e3ea"/><circle cx="88" cy="88" r="14" fill="#bfe3f0"/>
  </g>
  <g fill="#fff" opacity="0.8">
    <circle cx="27" cy="27" r="4"/><circle cx="55" cy="27" r="4"/><circle cx="83" cy="27" r="4"/>
    <circle cx="41" cy="55" r="4"/><circle cx="69" cy="55" r="4"/><circle cx="27" cy="83" r="4"/><circle cx="83" cy="83" r="4"/>
  </g>
  <path d="M54 82 L66 94 M66 82 L54 94" stroke="#a9bccf" stroke-width="3" stroke-linecap="round"/>
</svg>`,ls=[`#bfe3f0`,`#f6d2dc`,`#fbe6b0`,`#cfe8d4`,`#e2d4f0`];function us(e,t,n){let r=(e,t)=>parseInt(e.slice(1+t*2,3+t*2),16),i=i=>Math.round(r(e,i)*n+r(t,i)*(1-n)).toString(16).padStart(2,`0`);return`#${i(0)}${i(1)}${i(2)}`}var ds=ls.map(e=>`--kf:${e};--kf-rand:${us(e,`#6a7f8c`,.8)};--kf-platt:${us(e,`#e1eef3`,.45)}`),fs=5e3,ps=4e3,H=null,ms=[],U=100,hs=[],gs=new Set,_s=null,vs=new Map,ys=0,bs=0,xs=``;function Ss(e,t,n){e.addEventListener(t,n),hs.push(()=>e.removeEventListener(t,n))}function Cs(e,t){let n=window.setTimeout(()=>{gs.delete(n),e()},t);return gs.add(n),n}function ws(e){hs=[],gs=new Set,vs=new Map,ms=[],xs=``,e.innerHTML=`<div class="knall-stage" id="knallStage"></div>`,H=e.querySelector(`#knallStage`),_s=new ResizeObserver(()=>Es()),_s.observe(H),Es(),Ss(H,`pointerdown`,e=>{let t=e;t.preventDefault();try{H?.setPointerCapture(t.pointerId)}catch{}let n=Ts(t.clientX,t.clientY);vs.set(t.pointerId,n);let r=Math.max(t.width||0,t.height||0)/2+U*.4;Ds(n.x,n.y,Math.max(U*.6,r))===0&&ks(n.x,n.y)}),Ss(H,`pointermove`,e=>{let t=e,n=vs.get(t.pointerId);if(!n)return;let r=Ts(t.clientX,t.clientY),i=Math.hypot(r.x-n.x,r.y-n.y),a=Math.max(1,Math.ceil(i/(U*.4)));for(let e=1;e<=a;e++){let t=e/a;Ds(n.x+(r.x-n.x)*t,n.y+(r.y-n.y)*t,U*.5)}vs.set(t.pointerId,r)});let t=e=>vs.delete(e.pointerId);Ss(H,`pointerup`,t),Ss(H,`pointercancel`,t)}function Ts(e,t){let n=H.getBoundingClientRect(),r=H.clientWidth/(n.width||1);return{x:(e-n.left)*r,y:(t-n.top)*r}}function Es(){if(!H)return;let e=H.clientWidth,t=H.clientHeight;if(e===0||t===0)return;let n=`${e}x${t}`;if(n===xs)return;xs=n;for(let e of ms)e.timer!==null&&(window.clearTimeout(e.timer),gs.delete(e.timer));U=Math.max(64,Math.min(130,Math.min(e,t)/6.2));let r=U*1.1,i=U*.96,a=Math.ceil(e/r)+1,o=Math.ceil(t/i)+1,s=(e-(a-1)*r)/2,c=(t-(o-1)*i)/2,l=[],u=[];for(let e=0;e<o;e++)for(let t=0;t<a;t++){let n=s+t*r+(e%2==1?r/2:0)-r/4,a=c+e*i;u.push([n,a]);let o=ds[Math.floor(Math.random()*ds.length)];l.push(`<div class="kf-blase" style="left:${(n-U/2).toFixed(1)}px;top:${(a-U/2).toFixed(1)}px;${o}"><div class="kf-flach"></div><div class="kf-kugel"></div></div>`)}H.style.setProperty(`--kf-d`,`${U.toFixed(1)}px`),H.innerHTML=l.join(``);let d=H.querySelectorAll(`.kf-blase`);ms=u.map(([e,t],n)=>({el:d[n],x:e,y:t,platt:!1,timer:null,wackeltAt:0}))}function Ds(e,t,n){let r=0;for(let i of ms)i.platt||Math.hypot(i.x-e,i.y-t)>n||(i.platt=!0,i.el.classList.add(`platt`,`platzt`),r++,i.timer=Cs(()=>Os(i),fs+Math.random()*ps),Cs(()=>i.el.classList.remove(`platzt`),400));if(r>0){let e=performance.now();e-ys>28&&(ys=e,de(Math.min(.32,.16+r*.03)),r>=3&&Cs(()=>de(.14),35),r>=6&&Cs(()=>de(.12),75))}return r}function Os(e){e.timer=null,e.platt=!1,e.el.classList.remove(`platt`)}function ks(e,t){let n=performance.now();for(let r of ms)Math.hypot(r.x-e,r.y-t)>U*.9||n-r.wackeltAt<300||(r.wackeltAt=n,r.el.classList.remove(`wackelt`),r.el.offsetWidth,r.el.classList.add(`wackelt`));n-bs>80&&(bs=n,ie(120,.12,.12))}function As(){hs.forEach(e=>e()),hs=[],gs.forEach(e=>window.clearTimeout(e)),gs=new Set,_s?.disconnect(),_s=null,vs=new Map,ms=[],H=null}var js={id:`knallfolie`,name:`Knallfolie`,accent:`#bfe3f0`,tileIcon:cs,mount:ws,unmount:As},Ms=`
<svg viewBox="0 0 120 120" width="100%" height="100%">
  <rect x="26" y="10" width="68" height="100" rx="32" fill="#f6efe3" stroke="#e0d2bc" stroke-width="3"/>
  <rect x="34" y="18" width="52" height="84" rx="25" fill="#cfe7f5"/>
  <rect x="34" y="62" width="52" height="40" fill="#6fa8c9"/>
  <path d="M34 62 H86 V78 C76 92 44 92 34 78 Z" fill="#6fa8c9"/>
  <circle cx="50" cy="40" r="11" fill="#fff"/>
  <circle cx="62" cy="36" r="13" fill="#fff"/>
  <circle cx="72" cy="42" r="9" fill="#fff"/>
  <ellipse cx="60" cy="84" rx="13" ry="6" fill="#4f6f8f"/>
</svg>`,Ns=[[20,14],[62,10],[88,26],[12,38],[50,34],[86,50],[24,62],[66,66],[16,88],[58,90],[90,84]],Ps=[`meer`,`berge`,`stadt`,`insel`,`bauernhof`,`ballons`,`eis`,`zug`,`regenbogen`,`flughafen`];function Fs(e,t){return`
    <path d="M0 -42 C24 -42 34 -24 34 -6 C34 12 14 24 8 32 H-8 C-14 24 -34 12 -34 -6 C-34 -24 -24 -42 0 -42 Z" fill="${e}"/>
    <path d="M0 -42 C12 -30 14 10 8 32 H-8 C-14 10 -12 -30 0 -42 Z" fill="${t}"/>
    <path d="M-8 32 L-7 44 M8 32 L7 44" stroke="#a9835e" stroke-width="2"/>
    <rect x="-9" y="44" width="18" height="12" rx="2.5" fill="#a9835e"/>`}function Is(e){return`
    <g class="sz-pingu ${e}">
      <ellipse cx="-13" cy="4" rx="4" ry="11" fill="#2c3e50" transform="rotate(14 -13 4)"/>
      <ellipse cx="13" cy="4" rx="4" ry="11" fill="#2c3e50" transform="rotate(-14 13 4)"/>
      <ellipse cx="0" cy="0" rx="13" ry="20" fill="#2c3e50"/>
      <ellipse cx="0" cy="5" rx="9" ry="14" fill="#fffaf2"/>
      <circle cx="-4" cy="-10" r="2.6" fill="#fffaf2"/><circle cx="4" cy="-10" r="2.6" fill="#fffaf2"/>
      <circle cx="-4" cy="-10" r="1.3" fill="#2c3e50"/><circle cx="4" cy="-10" r="1.3" fill="#2c3e50"/>
      <path d="M-4 -5 L0 0 L4 -5 Z" fill="#e0a458"/>
      <ellipse cx="-6" cy="20" rx="5" ry="2.5" fill="#e0a458"/><ellipse cx="6" cy="20" rx="5" ry="2.5" fill="#e0a458"/>
    </g>`}var Ls=Array.from({length:13},(e,t)=>`<rect x="${4+t*24}" y="304" width="12" height="5" fill="#c9b79a"/>`).join(``),Rs={meer:`
    <svg viewBox="0 0 300 400" preserveAspectRatio="xMidYMid slice" width="100%" height="100%">
      <rect width="300" height="190" fill="#cfe7f5"/>
      <rect y="140" width="300" height="50" fill="#e4f2fa"/>
      <circle cx="226" cy="74" r="26" fill="#f7d570"/>
      <rect y="186" width="300" height="214" fill="#6fa8c9"/>
      <rect y="300" width="300" height="100" fill="#5f97ba"/>
      <path d="M20 230 q10 -6 20 0 M180 220 q10 -6 20 0 M240 260 q10 -6 20 0 M40 350 q10 -6 20 0 M200 370 q10 -6 20 0" stroke="#e4f2fa" stroke-width="3" fill="none" stroke-linecap="round" opacity="0.6"/>
      <g class="sz-boot">
        <path d="M44 214 H96 L88 226 H52 Z" fill="#a9835e"/>
        <path d="M70 212 V176 L94 210 Z" fill="#fffaf2"/>
        <path d="M68 212 V184 L50 210 Z" fill="#e88a9a"/>
      </g>
      <g class="sz-fontaene">
        <path d="M150 262 C146 240 140 230 128 226 M150 262 C150 236 150 226 150 216 M150 262 C154 240 160 230 172 226" stroke="#fffaf2" stroke-width="6" fill="none" stroke-linecap="round"/>
        <circle cx="126" cy="222" r="5" fill="#fffaf2"/><circle cx="150" cy="210" r="6" fill="#fffaf2"/><circle cx="174" cy="222" r="5" fill="#fffaf2"/>
      </g>
      <g class="sz-wal">
        <path d="M86 300 C86 272 126 258 168 262 C204 266 224 282 224 298 C224 314 204 324 168 324 C126 324 86 320 86 300 Z" fill="#4f6f8f"/>
        <path d="M222 296 L252 276 L246 300 L254 322 Z" fill="#4f6f8f"/>
        <path d="M100 308 C126 322 176 324 210 310 C190 324 120 326 100 308 Z" fill="#cfe2ee"/>
        <circle cx="122" cy="290" r="5" fill="#fffaf2"/><circle cx="123" cy="290" r="2.6" fill="#2c3e50"/>
        <path d="M104 302 q10 6 20 2" stroke="#2c3e50" stroke-width="2.5" fill="none" stroke-linecap="round"/>
      </g>
    </svg>`,berge:`
    <svg viewBox="0 0 300 400" preserveAspectRatio="xMidYMid slice" width="100%" height="100%">
      <rect width="300" height="400" fill="#d8ecf6"/>
      <circle cx="60" cy="70" r="22" fill="#f7d570"/>
      <path d="M-20 260 L60 140 L120 220 L190 120 L260 210 L320 160 L320 300 L-20 300 Z" fill="#b9c7d6"/>
      <path d="M-20 300 L50 190 L110 260 L170 170 L240 250 L320 200 L320 330 L-20 330 Z" fill="#8fa5b8"/>
      <path d="M50 190 L66 214 L58 210 L50 220 L42 210 L36 212 Z M170 170 L190 200 L180 196 L170 206 L160 196 L152 198 Z" fill="#fffaf2"/>
      <rect y="300" width="300" height="100" fill="#9ec99f"/>
      <path d="M-10 340 C60 320 120 360 180 340 C230 324 270 350 310 336 L310 352 C270 366 230 340 180 356 C120 376 60 336 -10 356 Z" fill="#7ec8d8"/>
      <g fill="#7fb99e"><path d="M30 300 l10 -24 l10 24 z"/><path d="M250 304 l9 -22 l9 22 z"/><path d="M270 300 l8 -20 l8 20 z"/></g>
      <g><rect x="196" y="312" width="22" height="16" fill="#fffaf2"/><path d="M193 313 L207 300 L221 313 Z" fill="#e88a9a"/><rect x="226" y="316" width="16" height="12" fill="#fffaf2"/><path d="M224 317 L234 307 L244 317 Z" fill="#e0a458"/></g>
      <g class="sz-voegel">
        <path d="M0 0 q8 -8 16 0 q8 -8 16 0" transform="translate(20 110)" stroke="#4a4032" stroke-width="3" fill="none" stroke-linecap="round"/>
        <path d="M0 0 q6 -6 12 0 q6 -6 12 0" transform="translate(54 96)" stroke="#4a4032" stroke-width="3" fill="none" stroke-linecap="round"/>
        <path d="M0 0 q7 -7 14 0 q7 -7 14 0" transform="translate(40 130)" stroke="#4a4032" stroke-width="3" fill="none" stroke-linecap="round"/>
      </g>
    </svg>`,stadt:`
    <svg viewBox="0 0 300 400" preserveAspectRatio="xMidYMid slice" width="100%" height="100%">
      <rect width="300" height="400" fill="#2a3558"/>
      <g class="sz-sterne" fill="#fdf6ea">
        <circle cx="40" cy="60" r="2.5"/><circle cx="100" cy="40" r="2"/><circle cx="160" cy="80" r="2.5"/><circle cx="70" cy="130" r="2"/><circle cx="140" cy="150" r="1.8"/><circle cx="260" cy="140" r="2.2"/><circle cx="30" cy="190" r="1.8"/>
      </g>
      <path d="M232 52 a30 30 0 1 0 22 50 a24 24 0 1 1 -22 -50 Z" fill="#f4e7b8"/>
      <g fill="#3b4670">
        <rect x="0" y="250" width="50" height="150"/><rect x="56" y="210" width="44" height="190"/><rect x="106" y="270" width="40" height="130"/>
        <rect x="152" y="190" width="52" height="210"/><rect x="210" y="240" width="40" height="160"/><rect x="256" y="220" width="44" height="180"/>
      </g>
      <g class="sz-fenster">
        <rect x="10" y="266" width="10" height="12"/><rect x="30" y="296" width="10" height="12"/><rect x="66" y="226" width="10" height="12"/>
        <rect x="82" y="256" width="10" height="12"/><rect x="66" y="296" width="10" height="12"/><rect x="116" y="286" width="10" height="12"/>
        <rect x="164" y="206" width="10" height="12"/><rect x="184" y="236" width="10" height="12"/><rect x="164" y="276" width="10" height="12"/>
        <rect x="220" y="256" width="10" height="12"/><rect x="266" y="236" width="10" height="12"/><rect x="282" y="276" width="10" height="12"/>
      </g>
      <rect y="380" width="300" height="20" fill="#232c4a"/>
    </svg>`,insel:`
    <svg viewBox="0 0 300 400" preserveAspectRatio="xMidYMid slice" width="100%" height="100%">
      <rect width="300" height="200" fill="#cfe9f2"/>
      <circle cx="80" cy="80" r="24" fill="#f7d570"/>
      <rect y="196" width="300" height="204" fill="#7cc7c4"/>
      <rect y="320" width="300" height="80" fill="#5fb3b0"/>
      <ellipse cx="150" cy="300" rx="96" ry="24" fill="#f1d9a6"/>
      <path d="M150 296 C148 260 156 236 170 212" stroke="#a9835e" stroke-width="9" fill="none" stroke-linecap="round"/>
      <g fill="#7fb99e">
        <path d="M170 212 C150 196 126 200 114 212 C134 206 152 208 170 212 Z"/>
        <path d="M170 212 C188 194 214 196 226 208 C206 204 188 206 170 212 Z"/>
        <path d="M170 212 C160 186 170 170 186 166 C178 180 174 196 170 212 Z"/>
        <path d="M170 212 C176 230 196 238 210 236 C194 230 182 222 170 212 Z"/>
      </g>
      <g><rect x="96" y="276" width="26" height="18" fill="#e0a458"/><path d="M90 278 L109 262 L128 278 Z" fill="#a9835e"/></g>
      <g class="sz-delfin">
        <path d="M0 0 C10 -18 34 -22 52 -12 L62 -20 L60 -8 C64 -4 66 0 64 4 C44 8 18 8 0 0 Z" fill="#7ea3c9"/>
        <circle cx="46" cy="-8" r="2.2" fill="#2c3e50"/>
      </g>
      <path d="M30 240 q10 -6 20 0 M220 250 q10 -6 20 0 M60 360 q10 -6 20 0 M230 350 q10 -6 20 0" stroke="#e8f6f5" stroke-width="3" fill="none" stroke-linecap="round" opacity="0.7"/>
    </svg>`,bauernhof:`
    <svg viewBox="0 0 300 400" preserveAspectRatio="xMidYMid slice" width="100%" height="100%">
      <rect width="300" height="400" fill="#d8ecf6"/>
      <circle cx="234" cy="70" r="22" fill="#f7d570"/>
      <path d="M-20 196 C50 168 120 184 190 174 C240 166 280 176 320 186 L320 400 L-20 400 Z" fill="#b5d99c"/>
      <path d="M150 192 L320 184 L320 226 L160 236 Z" fill="#ecd68f"/>
      <path d="M170 200 H300 M168 212 H300 M166 224 H300" stroke="#dcc278" stroke-width="3" stroke-linecap="round"/>
      <path d="M-20 244 C80 226 200 248 320 232 L320 400 L-20 400 Z" fill="#9ec98a"/>
      <rect x="36" y="196" width="60" height="46" fill="#d9675f"/>
      <path d="M30 200 L66 172 L102 200 Z" fill="#a9835e"/>
      <rect x="56" y="216" width="20" height="26" fill="#fffaf2"/>
      <path d="M56 216 L76 242 M76 216 L56 242" stroke="#d9675f" stroke-width="3"/>
      <g stroke="#fffaf2" stroke-width="4" stroke-linecap="round">
        <path d="M110 252 H292 M110 262 H292"/>
        <path d="M116 246 V268 M150 246 V268 M184 246 V268 M218 246 V268 M252 246 V268 M286 246 V268"/>
      </g>
      <g fill="#fffaf2"><circle cx="40" cy="290" r="3.5"/><circle cx="262" cy="340" r="3.5"/><circle cx="76" cy="330" r="3"/><circle cx="236" cy="372" r="3"/></g>
      <g class="sz-kuh">
        <rect x="150" y="300" width="7" height="22" rx="3" fill="#f3ede2"/>
        <rect x="190" y="300" width="7" height="22" rx="3" fill="#f3ede2"/>
        <path d="M143 288 q-8 6 -6 16" stroke="#fffaf2" stroke-width="3" fill="none" stroke-linecap="round"/>
        <ellipse cx="172" cy="292" rx="32" ry="19" fill="#fffaf2"/>
        <ellipse cx="162" cy="286" rx="10" ry="8" fill="#4a4032"/>
        <ellipse cx="184" cy="298" rx="7" ry="5" fill="#4a4032"/>
        <path d="M202 274 l-3 -9 M218 273 l4 -9" stroke="#e0a458" stroke-width="3.5" stroke-linecap="round"/>
        <ellipse cx="210" cy="282" rx="14" ry="12" fill="#fffaf2"/>
        <ellipse cx="214" cy="290" rx="9" ry="6.5" fill="#f1b8c0"/>
        <circle cx="206" cy="278" r="2.4" fill="#2c3e50"/><circle cx="216" cy="278" r="2.4" fill="#2c3e50"/>
      </g>
      <g class="sz-traktor">
        <rect x="96" y="350" width="46" height="18" rx="4" fill="#e0a458"/>
        <rect x="96" y="328" width="24" height="26" rx="3" fill="#e0a458"/>
        <rect x="100" y="332" width="16" height="12" rx="2" fill="#cfe7f5"/>
        <rect x="132" y="336" width="4" height="14" fill="#4a4032"/>
        <circle cx="110" cy="370" r="13" fill="#4a4032"/><circle cx="110" cy="370" r="5" fill="#c9b79a"/>
        <circle cx="136" cy="373" r="8" fill="#4a4032"/><circle cx="136" cy="373" r="3" fill="#c9b79a"/>
      </g>
    </svg>`,ballons:`
    <svg viewBox="0 0 300 400" preserveAspectRatio="xMidYMid slice" width="100%" height="100%">
      <rect width="300" height="400" fill="#d6ecf7"/>
      <rect y="170" width="300" height="230" fill="#e4f2f9"/>
      <circle cx="70" cy="72" r="20" fill="#f7d570"/>
      <path d="M-20 290 C40 260 100 270 150 285 C200 300 250 262 320 270 L320 400 L-20 400 Z" fill="#a8d18f"/>
      <path d="M-20 330 C70 310 160 340 320 318 L320 400 L-20 400 Z" fill="#8fc27a"/>
      <g fill="#7fb99e"><circle cx="70" cy="318" r="10"/><circle cx="86" cy="322" r="8"/><circle cx="236" cy="300" r="9"/><circle cx="250" cy="304" r="7"/></g>
      <g transform="translate(206 236) scale(0.55)"><g class="sz-ballon"><g class="sz-schweben" style="animation-delay:-2.6s">${Fs(`#e0a458`,`#e88a9a`)}</g></g></g>
      <g transform="translate(200 116) scale(0.75)"><g class="sz-ballon"><g class="sz-schweben" style="animation-delay:-1.3s">${Fs(`#7ea3c9`,`#fffaf2`)}</g></g></g>
      <g transform="translate(100 166)"><g class="sz-ballon"><g class="sz-schweben">${Fs(`#e88a9a`,`#f7d570`)}</g></g></g>
    </svg>`,eis:`
    <svg viewBox="0 0 300 400" preserveAspectRatio="xMidYMid slice" width="100%" height="100%">
      <rect width="300" height="400" fill="#dcecf5"/>
      <circle cx="230" cy="64" r="20" fill="#f7e3a0"/>
      <path d="M0 202 L34 150 L56 170 L80 128 L122 202 Z" fill="#f4f9fc"/>
      <path d="M80 128 L96 202 H122 Z M34 150 L44 202 H56 Z" fill="#d6e6f0"/>
      <path d="M196 202 L224 164 L244 178 L268 148 L300 202 Z" fill="#f4f9fc"/>
      <path d="M268 148 L280 202 H300 Z" fill="#d6e6f0"/>
      <rect y="200" width="300" height="200" fill="#5f8fb5"/>
      <rect y="330" width="300" height="70" fill="#557fa3"/>
      <path d="M20 230 q10 -6 20 0 M240 236 q10 -6 20 0 M50 350 q10 -6 20 0 M210 360 q10 -6 20 0" stroke="#dcecf5" stroke-width="3" fill="none" stroke-linecap="round" opacity="0.6"/>
      <path d="M66 290 C76 276 222 274 238 290 C242 302 222 308 150 308 C90 308 62 302 66 290 Z" fill="#f4f9fc"/>
      <path d="M66 292 C90 304 210 306 238 292 L234 302 C210 314 90 314 70 302 Z" fill="#cfe2ee"/>
      <g transform="translate(118 268)">${Is(`p1`)}</g>
      <g transform="translate(160 264)">${Is(`p2`)}</g>
      <g transform="translate(196 276) scale(0.6)">${Is(`p3`)}</g>
    </svg>`,zug:`
    <svg viewBox="0 0 300 400" preserveAspectRatio="xMidYMid slice" width="100%" height="100%">
      <rect width="300" height="400" fill="#d8ecf6"/>
      <circle cx="64" cy="66" r="20" fill="#f7d570"/>
      <path d="M-20 250 C40 200 110 210 160 236 C210 210 260 196 320 220 L320 400 L-20 400 Z" fill="#b5d99c"/>
      <path d="M-20 330 C80 310 200 330 320 316 L320 400 L-20 400 Z" fill="#9ec98a"/>
      <rect x="232" y="228" width="6" height="20" fill="#a9835e"/><circle cx="235" cy="222" r="14" fill="#7fb99e"/>
      <rect x="40" y="236" width="5" height="16" fill="#a9835e"/><circle cx="42" cy="230" r="11" fill="#7fb99e"/>
      ${Ls}
      <rect y="300" width="300" height="5" fill="#a9835e"/>
      <g class="sz-zug">
        <g class="sz-dampf" fill="#fffaf2"><circle cx="232" cy="244" r="7"/><circle cx="242" cy="230" r="9"/><circle cx="256" cy="214" r="11"/></g>
        <rect x="60" y="266" width="50" height="28" rx="4" fill="#7ea3c9"/>
        <rect x="68" y="272" width="12" height="10" rx="2" fill="#fffaf2"/><rect x="88" y="272" width="12" height="10" rx="2" fill="#fffaf2"/>
        <rect x="110" y="286" width="8" height="3" fill="#4a4032"/>
        <rect x="118" y="266" width="50" height="28" rx="4" fill="#e0a458"/>
        <rect x="126" y="272" width="12" height="10" rx="2" fill="#fffaf2"/><rect x="146" y="272" width="12" height="10" rx="2" fill="#fffaf2"/>
        <rect x="168" y="286" width="8" height="3" fill="#4a4032"/>
        <rect x="176" y="262" width="34" height="32" rx="3" fill="#d9675f"/>
        <rect x="182" y="268" width="20" height="12" rx="2" fill="#fffaf2"/>
        <rect x="206" y="274" width="36" height="20" rx="6" fill="#d9675f"/>
        <rect x="226" y="256" width="9" height="18" rx="2" fill="#4a4032"/>
        <rect x="172" y="258" width="42" height="6" rx="3" fill="#4a4032"/>
        <circle cx="243" cy="282" r="3" fill="#f7d570"/>
        <g fill="#4a4032">
          <circle cx="72" cy="296" r="6"/><circle cx="98" cy="296" r="6"/>
          <circle cx="130" cy="296" r="6"/><circle cx="156" cy="296" r="6"/>
          <circle cx="190" cy="293" r="8"/><circle cx="226" cy="296" r="6"/>
        </g>
      </g>
    </svg>`,regenbogen:`
    <svg viewBox="0 0 300 400" preserveAspectRatio="xMidYMid slice" width="100%" height="100%">
      <rect width="300" height="400" fill="#d6ecf7"/>
      <g class="sz-bogen" fill="none" stroke-width="11">
        <path d="M20 270 A130 130 0 0 1 280 270" stroke="#e88a9a"/>
        <path d="M31 270 A119 119 0 0 1 269 270" stroke="#e0a458"/>
        <path d="M42 270 A108 108 0 0 1 258 270" stroke="#f7d570"/>
        <path d="M53 270 A97 97 0 0 1 247 270" stroke="#9ec99f"/>
        <path d="M64 270 A86 86 0 0 1 236 270" stroke="#7ea3c9"/>
        <path d="M75 270 A75 75 0 0 1 225 270" stroke="#b49bd1"/>
      </g>
      <g fill="#fffaf2"><circle cx="34" cy="262" r="16"/><circle cx="54" cy="268" r="12"/><circle cx="266" cy="262" r="16"/><circle cx="246" cy="268" r="12"/></g>
      <path d="M-20 270 C60 256 140 276 200 266 C250 258 290 266 320 270 L320 400 L-20 400 Z" fill="#a8d18f"/>
      <g><circle cx="44" cy="326" r="4" fill="#e88a9a"/><circle cx="236" cy="350" r="4" fill="#f7d570"/><circle cx="214" cy="306" r="3.5" fill="#fffaf2"/><circle cx="80" cy="366" r="4" fill="#b49bd1"/><circle cx="262" cy="316" r="3.5" fill="#e88a9a"/></g>
      <g class="sz-hase">
        <ellipse cx="142" cy="290" rx="5" ry="16" fill="#e9e1d4"/><ellipse cx="156" cy="290" rx="5" ry="16" fill="#e9e1d4"/>
        <ellipse cx="142" cy="292" rx="2.2" ry="10" fill="#f1b8c0"/><ellipse cx="156" cy="292" rx="2.2" ry="10" fill="#f1b8c0"/>
        <circle cx="149" cy="314" r="15" fill="#e9e1d4"/>
        <circle cx="144" cy="311" r="2.3" fill="#2c3e50"/><circle cx="154" cy="311" r="2.3" fill="#2c3e50"/>
        <circle cx="149" cy="318" r="2.2" fill="#e88a9a"/>
      </g>
      <g fill="#7fb99e"><circle cx="128" cy="330" r="18"/><circle cx="150" cy="324" r="22"/><circle cx="172" cy="330" r="18"/><rect x="110" y="330" width="80" height="18" rx="9"/></g>
    </svg>`,flughafen:`
    <svg viewBox="0 0 300 400" preserveAspectRatio="xMidYMid slice" width="100%" height="100%">
      <rect width="300" height="400" fill="#d6ecf7"/>
      <circle cx="236" cy="70" r="20" fill="#f7d570"/>
      <rect y="260" width="300" height="140" fill="#a8d18f"/>
      <rect x="44" y="206" width="14" height="56" fill="#c9b79a"/>
      <path d="M34 196 H68 L62 212 H40 Z" fill="#7ea3c9"/>
      <rect x="38" y="188" width="26" height="9" rx="2" fill="#4a4032"/>
      <rect x="180" y="228" width="110" height="34" fill="#e9e1d4"/>
      <g fill="#7ea3c9"><rect x="190" y="238" width="14" height="10" rx="2"/><rect x="212" y="238" width="14" height="10" rx="2"/><rect x="234" y="238" width="14" height="10" rx="2"/><rect x="256" y="238" width="14" height="10" rx="2"/></g>
      <rect y="296" width="300" height="42" fill="#8a8f99"/>
      <path d="M8 317 H292" stroke="#fffaf2" stroke-width="3" stroke-dasharray="16 12"/>
      <g class="sz-flieger">
        <path d="M96 290 L88 266 H102 L118 290 Z" fill="#e88a9a"/>
        <path d="M90 300 C90 292 100 288 112 288 H186 C198 288 206 294 206 300 C206 306 198 310 186 310 H112 C100 310 90 306 90 300 Z" fill="#fffaf2"/>
        <rect x="104" y="302" width="86" height="3" fill="#e88a9a"/>
        <g fill="#7ea3c9"><circle cx="124" cy="296" r="2.6"/><circle cx="134" cy="296" r="2.6"/><circle cx="144" cy="296" r="2.6"/><circle cx="154" cy="296" r="2.6"/><circle cx="164" cy="296" r="2.6"/><circle cx="174" cy="296" r="2.6"/></g>
        <path d="M190 291 C197 292 202 295 204 298 H190 Z" fill="#7ea3c9"/>
        <path d="M132 302 L162 302 L148 322 H134 Z" fill="#c9d6e3"/>
        <circle cx="120" cy="314" r="4" fill="#4a4032"/><circle cx="186" cy="314" r="4" fill="#4a4032"/>
      </g>
    </svg>`};function zs(e){return`
<svg viewBox="0 0 200 120" width="100%" height="100%">
  <g fill="${e}">
    <circle cx="60" cy="70" r="38"/><circle cx="102" cy="52" r="46"/><circle cx="146" cy="70" r="36"/>
    <circle cx="28" cy="88" r="26"/><circle cx="172" cy="88" r="25"/>
    <rect x="28" y="70" width="146" height="44" rx="22"/>
  </g>
</svg>`}var Bs=[`#ffffff`,`#f3f7fb`,`#e9f0f6`,`#fbfcfe`],Vs=`fenster`,Hs=2,Us=6e3,Ws=Ns.length*220+2700,Gs=null,Ks=null,qs=null,Js=null,Ys=null,Xs=[],Zs=[],Qs=new Set,$s=null,ec=`meer`,tc=!1,W=[],nc=!1,rc=!1,ic=0,ac=0,oc=0,sc=new Set;function cc(e,t,n){e.addEventListener(t,n),Zs.push(()=>e.removeEventListener(t,n))}function G(e,t){let n=window.setTimeout(()=>{Qs.delete(n),e()},t);return Qs.add(n),n}function lc(e){e!==null&&(window.clearTimeout(e),Qs.delete(e))}function uc(e){Zs=[],Qs=new Set,sc=new Set,$s=null,nc=!1,rc=!1;let t=pe(Vs,Hs,null);W=(t?.reihe??[]).filter(e=>Ps.includes(e)),t&&Ps.includes(t.szene)?(ec=t.szene,tc=t.gespiegelt):vc(),e.innerHTML=`
    <div class="fenster-stage" id="fensterStage">
      <div class="fenster">
        <div class="fenster-innen" id="fensterInnen">
          <div class="fenster-szene" id="fensterSzene"></div>
          <div class="fenster-dunst" id="fensterDunst"></div>
          ${Ns.map(([e,t],n)=>`
            <div class="fenster-wolke" style="left:${e}%;top:${t}%" data-i="${n}">
              <div class="fenster-wolke-innen" style="animation-delay:${(-n*1.3).toFixed(1)}s">${zs(Bs[n%Bs.length])}</div>
            </div>`).join(``)}
          <div class="fenster-rollo" id="fensterRollo"><span class="fenster-rollo-griff"></span></div>
          <div class="fenster-schatten"></div>
        </div>
      </div>
    </div>
  `,Gs=e.querySelector(`#fensterStage`),Ks=e.querySelector(`#fensterInnen`),qs=e.querySelector(`#fensterDunst`),Js=e.querySelector(`#fensterRollo`),Ys=e.querySelector(`#fensterSzene`),yc(),Xs=Ns.map(([t,n],r)=>({el:e.querySelector(`.fenster-wolke[data-i="${r}"]`),x:t,y:n,weg:!1})),pc(),cc(Gs,`pointerdown`,e=>{let t=e;t.preventDefault();try{Gs?.setPointerCapture(t.pointerId)}catch{}sc.add(t.pointerId),fc(t.clientX,t.clientY,!0)}),cc(Gs,`pointermove`,e=>{let t=e;sc.has(t.pointerId)&&fc(t.clientX,t.clientY,!1)});let n=e=>sc.delete(e.pointerId);cc(Gs,`pointerup`,n),cc(Gs,`pointercancel`,n)}function dc(e,t){let n=Ks.getBoundingClientRect(),r=(e-n.left)/n.width*100,i=(t-n.top)/n.height*100;return{x:Math.max(0,Math.min(100,r)),y:Math.max(0,Math.min(100,i)),drin:r>=0&&r<=100&&i>=0&&i<=100}}function fc(e,t,n){if(!Ks)return;let r=dc(e,t),i=performance.now();if(n&&i-ic>700){if(rc){bc(!1);return}if(r.drin&&r.y<14){bc(!0);return}}if(rc)return;gc();let a=0,o=Ks.getBoundingClientRect();for(let e of Xs){if(e.weg)continue;let t=(e.x-r.x)*(o.width/100),n=(e.y-r.y)*(o.height/100),i=Math.hypot(t,n);if(i>20/100*Math.max(o.width,o.height))continue;let s=i<1?{x:Math.random()-.5,y:Math.random()-.5}:{x:t/i,y:n/i},c=Math.hypot(s.x,s.y)||1,l=Math.max(o.width,o.height)*1.1;e.el.style.setProperty(`--wx`,`${(s.x/c*l).toFixed(0)}px`),e.el.style.setProperty(`--wy`,`${(s.y/c*l).toFixed(0)}px`),e.el.style.removeProperty(`--delay`),e.el.classList.add(`weg`),e.weg=!0,a++}a>0&&i-ac>140&&(ac=i,_()),pc();let s=Xs.filter(e=>!e.weg).length;s<=1&&!nc?(nc=!0,G(mc,450)):nc&&n&&r.drin&&s<=3&&mc()}function pc(){if(!qs)return;let e=Xs.filter(e=>!e.weg).length,t=Math.max(0,(e-2)/(Xs.length-2));qs.style.opacity=(t*.92).toFixed(2)}function mc(){let e=performance.now();if(e-oc<1600)return;oc=e;let t=Ys;t&&(t.classList.remove(`feiert`),t.offsetWidth,t.classList.add(`feiert`),G(()=>t.classList.remove(`feiert`),2600),hc[ec]())}var hc={meer:()=>{g(170,115,.7,.24),G(()=>g(115,190,.6,.2),650)},berge:()=>{[0,160,380].forEach((e,t)=>G(()=>g(1700+t*200,2500+t*150,.09,.07),e))},stadt:()=>{[5,6,7,5].forEach((e,t)=>G(()=>m({freq:p[e],duration:.2,attack:.01,release:.6,gain:.16}),t*180))},insel:()=>{_(),G(()=>g(420,900,.3,.12),300)},bauernhof:()=>{g(150,190,.25,.2,`triangle`),G(()=>g(190,135,.7,.2,`triangle`),240),[0,130,260,390,520,650].forEach(e=>G(()=>ie(75,.12,.15),900+e))},ballons:()=>{_(),[[330,440],[392,523],[440,659]].forEach(([e,t],n)=>G(()=>g(e,t,.5,.1),300+n*260))},eis:()=>{[880,1047,1319].forEach((e,t)=>G(()=>ae(e,.2),120+t*220))},zug:()=>{[0,450].forEach(e=>G(()=>{m({freq:392,duration:.25,attack:.02,release:.15,type:`triangle`,gain:.16}),m({freq:494,duration:.25,attack:.02,release:.15,type:`triangle`,gain:.12})},e))},regenbogen:()=>{p.forEach((e,t)=>G(()=>m({freq:e,duration:.12,attack:.01,release:.5,gain:.13}),t*110)),G(()=>g(400,820,.15,.12),700)},flughafen:()=>{g(180,520,1.4,.1,`triangle`),G(_,650)}};function gc(){lc($s),$s=G(()=>{$s=null;let e=Xs.filter(e=>e.weg);e.length!==0&&(e.forEach((e,t)=>{e.el.style.setProperty(`--delay`,`${t*220}ms`),e.el.classList.remove(`weg`),e.weg=!1}),pc(),nc&&G(_c,Ws))},Us)}function _c(){Xs.some(e=>e.weg)||(nc=!1,vc(),yc())}function vc(){if(W.length===0){W=[...Ps];for(let e=W.length-1;e>0;e--){let t=Math.floor(Math.random()*(e+1));[W[e],W[t]]=[W[t],W[e]]}W[0]===ec&&W.push(W.shift())}ec=W.shift(),tc=Math.random()<.5,v(Vs,Hs,{szene:ec,gespiegelt:tc,reihe:W})}function yc(){Ys&&(Ys.className=`fenster-szene sz-${ec}${tc?` gespiegelt`:``}`,Ys.innerHTML=Rs[ec])}function bc(e){rc=e,ic=performance.now(),Js?.classList.toggle(`unten`,e),re(!e)}function xc(){Zs.forEach(e=>e()),Zs=[],Qs.forEach(e=>window.clearTimeout(e)),Qs=new Set,$s=null,sc=new Set,Xs=[],Ys=null,Gs=null,Ks=null,qs=null,Js=null}var Sc={id:`fenster`,name:`Flugzeugfenster`,accent:`#7ea3c9`,tileIcon:Ms,mount:uc,unmount:xc},Cc=`
<svg viewBox="0 0 120 120" width="100%" height="100%">
  <line x1="60" y1="8" x2="60" y2="24" stroke="#a9835e" stroke-width="3"/>
  <ellipse cx="60" cy="28" rx="40" ry="8" fill="none" stroke="#a9835e" stroke-width="3"/>
  <line x1="28" y1="30" x2="28" y2="50" stroke="#c9b79a" stroke-width="2"/>
  <line x1="60" y1="36" x2="60" y2="58" stroke="#c9b79a" stroke-width="2"/>
  <line x1="92" y1="30" x2="92" y2="48" stroke="#c9b79a" stroke-width="2"/>
  <path d="M28 50 l4 9 l9 1 l-7 6 l2 9 l-8 -5 l-8 5 l2 -9 l-7 -6 l9 -1 z" fill="#f4c86b"/>
  <path d="M68 56 a12 12 0 1 0 6 20 a9 9 0 1 1 -6 -20 Z" fill="#f4e7b8"/>
  <circle cx="92" cy="56" r="8" fill="#fffaf2"/>
  <rect x="34" y="90" width="52" height="22" rx="6" fill="#e0a458"/>
  <rect x="34" y="90" width="52" height="7" rx="3" fill="#c98a45"/>
  <circle cx="92" cy="101" r="5" fill="#a9835e"/>
</svg>`,wc=[[[76,.5],[76,.5],[79,2],[76,.5],[76,.5],[79,2],[76,.5],[79,.5],[84,1],[83,1.5],[81,.5],[81,1],[79,1],[74,.5],[76,.5],[77,1],[74,1],[74,.5],[76,.5],[77,2],[74,.5],[77,.5],[83,.5],[81,.5],[79,1],[83,1],[84,2],[72,.5],[72,.5],[84,2],[81,.5],[77,.5],[79,2],[76,.5],[72,.5],[77,1],[79,1],[81,1],[79,2],[72,.5],[72,.5],[84,2],[81,.5],[77,.5],[79,2],[76,.5],[72,.5],[77,1],[76,1],[74,1],[72,3]],[[72,1],[72,1],[79,1],[79,1],[81,1],[81,1],[79,2],[77,1],[77,1],[76,1],[76,1],[74,1],[74,1],[72,2],[79,1],[79,1],[77,1],[77,1],[76,1],[76,1],[74,2],[79,1],[79,1],[77,1],[77,1],[76,1],[76,1],[74,2],[72,1],[72,1],[79,1],[79,1],[81,1],[81,1],[79,2],[77,1],[77,1],[76,1],[76,1],[74,1],[74,1],[72,3]],[[72,1],[74,1],[76,1],[77,1],[79,2],[79,2],[81,1],[81,1],[81,1],[81,1],[79,3],[81,1],[81,1],[81,1],[81,1],[79,3],[77,1],[77,1],[77,1],[77,1],[76,2],[76,2],[74,1],[74,1],[74,1],[74,1],[72,3]]],Tc=.5,Ec=3,Dc=240,Oc=30,kc=[{cls:`mond`,svg:`<path d="M26 4 a22 22 0 1 0 16 36 a17 17 0 1 1 -16 -36 Z" fill="#f4e7b8"/>`},{cls:`stern`,svg:`<path d="M24 2 l6 14 l15 1 l-11 10 l3 15 l-13 -8 l-13 8 l3 -15 l-11 -10 l15 -1 z" fill="#f4c86b"/>`},{cls:`wolke`,svg:`<g fill="#fffaf2"><circle cx="16" cy="28" r="11"/><circle cx="28" cy="20" r="13"/><circle cx="38" cy="29" r="10"/><rect x="10" y="26" width="32" height="12" rx="6"/></g>`},{cls:`schaf`,svg:`<g><circle cx="18" cy="24" r="10" fill="#fffaf2"/><circle cx="28" cy="20" r="11" fill="#fffaf2"/><circle cx="34" cy="28" r="9" fill="#fffaf2"/><circle cx="22" cy="32" r="9" fill="#fffaf2"/><ellipse cx="40" cy="22" rx="6" ry="7" fill="#4a4032"/><circle cx="42" cy="21" r="1.4" fill="#fffaf2"/><rect x="18" y="38" width="3" height="6" fill="#4a4032"/><rect x="30" y="38" width="3" height="6" fill="#4a4032"/></g>`},{cls:`herz`,svg:`<path d="M24 42 C8 30 4 20 10 13 C15 7 22 9 24 15 C26 9 33 7 38 13 C44 20 40 30 24 42 Z" fill="#e88a9a"/>`}],Ac=null,jc=null,Mc=null,Nc=null,Pc=[],Fc=[],Ic=new Set,Lc=null,Rc=0,zc=null,K=0,Bc=0,Vc=0,Hc=0,Uc=0,Wc=0,Gc=null,Kc=0,qc=0,Jc=new Map;function Yc(e,t,n){e.addEventListener(t,n),Fc.push(()=>e.removeEventListener(t,n))}function Xc(e,t){let n=window.setTimeout(()=>{Ic.delete(n),e()},t);Ic.add(n)}function Zc(e){return 440*2**((e-69)/12)}function Qc(e){Fc=[],Ic=new Set,Jc=new Map,K=0,Bc=0,Vc=0,Wc=0,Gc=null,e.innerHTML=`
    <div class="spieluhr-stage" id="spieluhrStage">
      <div class="spieluhr-sterne">
        ${Array.from({length:14},(e,t)=>`<span style="left:${t*37%97+1}%;top:${t*53%60+4}%;animation-delay:${(-t*.7).toFixed(1)}s"></span>`).join(``)}
      </div>
      <div class="spieluhr-mobile">
        <div class="spieluhr-haken"></div>
        <div class="spieluhr-ring"></div>
        ${kc.map(e=>`
          <div class="spieluhr-teil ${e.cls}">
            <div class="spieluhr-faden"></div>
            <div class="spieluhr-figur"><svg viewBox="0 0 48 48" width="100%" height="100%">${e.svg}</svg></div>
          </div>`).join(``)}
      </div>
      <div class="spieluhr-box" id="spieluhrBox">
        <svg viewBox="0 0 200 110" width="100%" height="100%">
          <rect x="10" y="30" width="170" height="74" rx="12" fill="#e0a458"/>
          <rect x="10" y="30" width="170" height="20" rx="8" fill="#c98a45"/>
          <rect x="24" y="62" width="142" height="30" rx="8" fill="#eab676"/>
          <circle cx="54" cy="77" r="6" fill="#f4c86b"/><circle cx="95" cy="77" r="6" fill="#e88a9a"/><circle cx="136" cy="77" r="6" fill="#7ea3c9"/>
          <rect x="178" y="58" width="12" height="12" rx="3" fill="#a9835e"/>
        </svg>
        <div class="spieluhr-kurbel" id="spieluhrKurbel">
          <svg viewBox="0 0 60 60" width="100%" height="100%">
            <circle cx="30" cy="30" r="7" fill="#a9835e"/>
            <rect x="27" y="6" width="6" height="26" rx="3" fill="#a9835e"/>
            <circle cx="30" cy="8" r="7" fill="#e88a9a"/>
          </svg>
        </div>
      </div>
      <div class="spieluhr-dunkel" id="spieluhrDunkel"></div>
    </div>
  `,Ac=e.querySelector(`#spieluhrStage`),jc=e.querySelector(`#spieluhrDunkel`),Mc=e.querySelector(`#spieluhrKurbel`),Nc=e.querySelector(`#spieluhrBox`),Pc=[...e.querySelectorAll(`.spieluhr-teil`)].map((e,t)=>({el:e,phase:t/kc.length*Math.PI*2})),sl(),il(!0),Yc(Ac,`pointerdown`,e=>{let t=e;t.preventDefault();try{Ac?.setPointerCapture(t.pointerId)}catch{}Jc.set(t.pointerId,{x:t.clientX,y:t.clientY}),$c(Oc),el(),h(820),Xc(()=>h(760),70)}),Yc(Ac,`pointermove`,e=>{let t=e,n=Jc.get(t.pointerId);if(!n)return;let r=Math.hypot(t.clientX-n.x,t.clientY-n.y);Jc.set(t.pointerId,{x:t.clientX,y:t.clientY}),r>0&&$c(r/40)});let t=e=>Jc.delete(e.pointerId);Yc(Ac,`pointerup`,t),Yc(Ac,`pointercancel`,t),zc=window.setInterval(rl,30)}function $c(e){let t=K<=0;K=Math.min(Dc,K+e),t&&(Gc=null,Wc=0),il(!0),al()}function el(){Nc&&(Nc.classList.remove(`hopst`),Nc.offsetWidth,Nc.classList.add(`hopst`))}function tl(){return Math.max(.55,Math.min(1,K/20))}function nl(){return Math.max(.3,Math.min(1,K/30))}function rl(){if(K<=0)return;let e=se();if(e!==null)for((Gc===null||Gc<e-.2)&&(Gc=e+.08);Gc<e+.15;){let e=wc[Uc];if(Wc>=e.length){Gc+=Ec*Tc/tl(),Uc=(Uc+1)%wc.length,Wc=0;continue}let[t,n]=e[Wc];ce(Zc(t),Gc,.2*nl()),Gc+=n*Tc/tl(),Wc++}}function il(e=!1){if(!jc)return;let t=performance.now();if(!e&&t-qc<400)return;qc=t;let n=Math.max(0,Math.min(1,K/45));jc.style.opacity=(.62*(1-n)).toFixed(2)}function al(){Lc===null&&(Rc=performance.now(),Lc=requestAnimationFrame(ol))}function ol(e){let t=Math.min(.1,Math.max(.001,(e-Rc)/1e3));Rc=e,K>0&&(K=Math.max(0,K-t),e-Kc>1e4&&(Kc=e,Ae()));let n=K>0?.5*tl():0;Vc+=(n-Vc)*Math.min(1,t*.8),Bc+=Vc*t,Hc-=Vc*t*2.2,sl(),il(),K>0||Vc>.002?Lc=requestAnimationFrame(ol):(Lc=null,Vc=0,il(!0))}function sl(){for(let e of Pc){let t=Bc+e.phase,n=Math.sin(t)*34,r=(Math.cos(t)+1)/2,i=.72+.28*r;e.el.style.transform=`translateX(${n.toFixed(2)}vmin) scale(${i.toFixed(3)})`,e.el.style.opacity=(.55+.45*r).toFixed(2),e.el.style.zIndex=String(Math.round(r*10))}Mc&&(Mc.style.transform=`rotate(${(Hc*180/Math.PI).toFixed(1)}deg)`)}function cl(){Fc.forEach(e=>e()),Fc=[],Ic.forEach(e=>window.clearTimeout(e)),Ic=new Set,Lc!==null&&(cancelAnimationFrame(Lc),Lc=null),zc!==null&&(window.clearInterval(zc),zc=null),K=0,Pc=[],Jc=new Map,Ac=null,jc=null,Mc=null,Nc=null}var ll={id:`spieluhr`,name:`Spieluhr`,accent:`#7ea3c9`,tileIcon:Cc,mount:Qc,unmount:cl},ul=`
<svg viewBox="0 0 120 120" width="100%" height="100%">
  <rect x="10" y="16" width="100" height="88" rx="18" fill="#bfe3ee"/>
  <path d="M10 84 C34 76 58 90 82 82 C94 78 104 80 110 84 V86 C110 96 102 104 92 104 H28 C18 104 10 96 10 86 Z" fill="#e9d6a6"/>
  <path d="M30 98 C26 84 34 76 30 62" stroke="#7fb99e" stroke-width="5" fill="none" stroke-linecap="round"/>
  <g transform="translate(46 40)"><ellipse cx="22" cy="14" rx="18" ry="11" fill="#f4a56b"/><path d="M6 14 L-6 4 L-6 24 Z" fill="#f4a56b"/><circle cx="31" cy="11" r="2.8" fill="#2c3e50"/></g>
  <circle cx="88" cy="36" r="4" fill="none" stroke="#fffaf2" stroke-width="2"/>
  <circle cx="94" cy="26" r="3" fill="none" stroke="#fffaf2" stroke-width="2"/>
</svg>`,dl=[{farbe:`#f4a56b`,flosse:`#e0864a`,streifen:`#fffaf2`,laenge:120},{farbe:`#7ea3c9`,flosse:`#5f86ad`,streifen:null,laenge:104},{farbe:`#f4c86b`,flosse:`#d4a64a`,streifen:`#e88a9a`,laenge:96},{farbe:`#e88a9a`,flosse:`#c96f7e`,streifen:null,laenge:110},{farbe:`#7fb99e`,flosse:`#5f9a80`,streifen:`#fffaf2`,laenge:92},{farbe:`#c896d8`,flosse:`#a978bb`,streifen:null,laenge:100},{farbe:`#f4a56b`,flosse:`#e0864a`,streifen:null,laenge:84}];function fl(e){return`
    <svg viewBox="0 0 100 60" width="100%" height="100%">
      <g class="aq-schwanz"><path d="M22 30 L2 12 Q8 30 2 48 Z" fill="${e.flosse}"/></g>
      <path d="M40 12 Q52 2 64 10 Z" fill="${e.flosse}"/>
      <ellipse cx="54" cy="30" rx="36" ry="21" fill="${e.farbe}"/>
      ${e.streifen?`<path d="M44 11 Q38 30 44 49 M58 9 Q52 30 58 51" stroke="${e.streifen}" stroke-width="5" fill="none" opacity="0.85"/>`:``}
      <path d="M50 38 Q56 48 62 38 Z" fill="${e.flosse}"/>
      <circle cx="74" cy="24" r="6" fill="#fffaf2"/><circle cx="76" cy="24" r="3.4" fill="#2c3e50"/>
      <path d="M80 36 Q84 39 87 35" stroke="#2c3e50" stroke-width="2.4" fill="none" stroke-linecap="round"/>
    </svg>`}var pl=8,q=null,ml=null,hl=[],gl=new Map,_l=[],vl=new Set,yl=null,bl=null,xl=0,Sl=0,Cl=0,wl=1,Tl=!1,El=!1,Dl=0,Ol=0;function kl(e,t,n){e.addEventListener(t,n),_l.push(()=>e.removeEventListener(t,n))}function Al(e,t){let n=window.setTimeout(()=>{vl.delete(n),e()},t);vl.add(n)}function jl(e){_l=[],vl=new Set,gl=new Map,Tl=!1,El=!1,Dl=0,Sl=0,Cl=0,e.innerHTML=`
    <div class="aquarium-stage" id="aquariumStage">
      <div class="aq-licht"></div>
      <div class="aq-boden">
        <svg viewBox="0 0 400 100" preserveAspectRatio="none" width="100%" height="100%">
          <path d="M0 30 C60 10 120 40 200 24 C270 10 330 34 400 20 V100 H0 Z" fill="#e9d6a6"/>
          <path d="M0 60 C80 48 160 70 240 58 C310 48 360 64 400 56 V100 H0 Z" fill="#dcc48f"/>
        </svg>
      </div>
      <div class="aq-steine">
        <span class="aq-stein s1"></span><span class="aq-stein s2"></span><span class="aq-stein s3"></span>
      </div>
      ${[8,22,70,86].map((e,t)=>`
        <div class="aq-pflanze" style="left:${e}%;animation-delay:${(-t*1.1).toFixed(1)}s;--h:${[34,26,30,22][t]}%">
          <svg viewBox="0 0 40 160" preserveAspectRatio="none" width="100%" height="100%">
            <path d="M20 160 C10 120 30 90 18 50 C12 30 22 12 20 0" stroke="${t%2?`#7fb99e`:`#5f9a80`}" stroke-width="10" fill="none" stroke-linecap="round"/>
          </svg>
        </div>`).join(``)}
      ${[14,48,78].map((e,t)=>`<div class="aq-blasenstrom" style="left:${e}%;animation-delay:${(-t*1.7).toFixed(1)}s"><span></span><span></span><span></span></div>`).join(``)}
      <div class="aq-fische" id="aqFische">
        ${dl.map((e,t)=>`<div class="aq-fisch" data-i="${t}">${fl(e)}</div>`).join(``)}
      </div>
      <div class="aq-effekte" id="aqEffekte"></div>
    </div>
  `,q=e.querySelector(`#aquariumStage`),ml=e.querySelector(`#aqEffekte`),hl=dl.map((t,n)=>({el:e.querySelector(`.aq-fisch[data-i="${n}"]`),w:t.laenge,h:t.laenge*.6,x:0,y:0,vx:0,vy:0,zx:0,zy:0,zielBis:0,fliehtBis:0,blick:Math.random()<.5?1:-1,tempo:38+Math.random()*26})),yl=new ResizeObserver(()=>Ml()),yl.observe(q),kl(q,`pointerdown`,e=>{let t=e;if(t.preventDefault(),!Tl)return;try{q?.setPointerCapture(t.pointerId)}catch{}let n=Nl(t.clientX,t.clientY);gl.set(t.pointerId,n),Il(n.x,n.y),Rl()}),kl(q,`pointermove`,e=>{let t=e;gl.has(t.pointerId)&&gl.set(t.pointerId,Nl(t.clientX,t.clientY))});let t=e=>gl.delete(e.pointerId);kl(q,`pointerup`,t),kl(q,`pointercancel`,t),_l.push(je(e=>{El=e,e||Rl()}))}function Ml(){if(!q)return;let e=q.clientWidth,t=q.clientHeight;if(e<1||t<1)return;let n=Sl,r=Cl;Sl=e,Cl=t,wl=Math.max(.55,Math.min(1.25,Math.min(e,t)/834)),hl.forEach((i,a)=>{i.w=dl[a].laenge*wl,i.h=i.w*.6,i.el.style.width=`${i.w.toFixed(1)}px`,i.el.style.height=`${i.h.toFixed(1)}px`,Tl?n>0&&r>0&&(i.x*=e/n,i.y*=t/r,i.zx*=e/n,i.zy*=t/r):(i.x=e*(.15+Math.random()*.7),i.y=t*(.15+Math.random()*.55),Fl(i,0))}),Tl||(Tl=!0,q.classList.add(`bereit`)),Vl(),Rl()}function Nl(e,t){let n=q.getBoundingClientRect(),r=n.width>0?q.clientWidth/n.width:1,i=n.height>0?q.clientHeight/n.height:1;return{x:(e-n.left)*r,y:(t-n.top)*i}}function Pl(){return{x0:Sl*.06,x1:Sl*.94,y0:Cl*.1,y1:Cl*.76}}function Fl(e,t){let n=Pl();e.zx=n.x0+Math.random()*(n.x1-n.x0),e.zy=n.y0+Math.random()*(n.y1-n.y0),e.zielBis=t+4e3+Math.random()*5e3}function Il(e,t){let n=performance.now(),r=300*wl;for(let i of hl){let a=i.x-e,o=i.y-t,s=Math.hypot(a,o);if(s>r)continue;let c=s<1?{x:Math.random()-.5,y:Math.random()-.5}:{x:a/s,y:o/s},l=Math.hypot(c.x,c.y)||1,u=(420+260*(1-s/r))*wl;i.vx=c.x/l*u,i.vy=c.y/l*u,i.fliehtBis=n+900}Ll(e,t),n-Ol>90&&(Ol=n,g(240+Math.random()*60,680+Math.random()*160,.09,.2))}function Ll(e,t){if(!ml||Dl>=pl)return;let n=document.createElement(`span`);n.className=`aq-welle`,n.style.transform=`translate(${e.toFixed(0)}px, ${t.toFixed(0)}px)`,n.innerHTML=`<i></i><b></b><b></b><b></b>`,ml.appendChild(n),Dl++,Al(()=>{n.remove(),Dl=Math.max(0,Dl-1)},1300)}function Rl(){bl!==null||El||!Tl||(xl=performance.now(),bl=requestAnimationFrame(zl))}function zl(e){let t=Math.min(.1,Math.max(.001,(e-xl)/1e3));xl=e;let n=Math.ceil(t/.02);for(let r=0;r<n;r++)Bl(t/n,e);Vl(),bl=El?null:requestAnimationFrame(zl)}function Bl(e,t){let n=Pl(),r=[...gl.values()];hl.forEach((i,a)=>{if(t<i.fliehtBis){let t=Math.exp(-2.2*e);i.vx*=t,i.vy*=t}else{let n=i.zx,o=i.zy,s=i.tempo*wl;if(r.length>0){let e=r[0],c=1/0;for(let t of r){let n=Math.hypot(t.x-i.x,t.y-i.y);n<c&&(c=n,e=t)}let l=a/hl.length*Math.PI*2+t/2400,u=(70+a%3*30)*wl;n=e.x+Math.cos(l)*u,o=e.y+Math.sin(l)*u*.6,s=170*wl}else(t>i.zielBis||Math.hypot(i.zx-i.x,i.zy-i.y)<30*wl)&&Fl(i,t);let c=n-i.x,l=o-i.y,u=Math.hypot(c,l)||1,d=s*Math.min(1,u/(60*wl)),f=c/u*d,p=l/u*d,m=Math.min(1,e*1.6);i.vx+=(f-i.vx)*m,i.vy+=(p-i.vy)*m}i.x+=i.vx*e,i.y+=i.vy*e,i.x<n.x0&&(i.vx+=(n.x0-i.x)*e*6),i.x>n.x1&&(i.vx-=(i.x-n.x1)*e*6),i.y<n.y0&&(i.vy+=(n.y0-i.y)*e*6),i.y>n.y1&&(i.vy-=(i.y-n.y1)*e*6),i.x=Math.max(i.w/2,Math.min(Sl-i.w/2,i.x)),i.y=Math.max(i.h/2,Math.min(Cl-i.h/2,i.y)),i.vx>12?i.blick=1:i.vx<-12&&(i.blick=-1)})}function Vl(){for(let e of hl){let t=Math.max(-18,Math.min(18,Math.atan2(e.vy,Math.abs(e.vx)+1)*180/Math.PI));e.el.style.transform=`translate(${(e.x-e.w/2).toFixed(1)}px, ${(e.y-e.h/2).toFixed(1)}px) scaleX(${e.blick}) rotate(${t.toFixed(1)}deg)`}}function Hl(){_l.forEach(e=>e()),_l=[],vl.forEach(e=>window.clearTimeout(e)),vl=new Set,bl!==null&&(cancelAnimationFrame(bl),bl=null),yl?.disconnect(),yl=null,gl=new Map,hl=[],q=null,ml=null,Tl=!1}var Ul={id:`aquarium`,name:`Aquarium`,accent:`#7ec8d8`,tileIcon:ul,mount:jl,unmount:Hl},Wl=`
<svg viewBox="0 0 120 120" width="100%" height="100%">
  <line x1="6" y1="20" x2="114" y2="20" stroke="#a9835e" stroke-width="3"/>
  <circle cx="60" cy="72" r="26" fill="#c9a37e"/>
  <circle cx="40" cy="50" r="10" fill="#c9a37e"/><circle cx="80" cy="50" r="10" fill="#c9a37e"/>
  <circle cx="51" cy="70" r="4" fill="#4a4032"/><circle cx="69" cy="70" r="4" fill="#4a4032"/>
  <ellipse cx="60" cy="81" rx="7" ry="4.5" fill="#8a7255"/>
  <path d="M18 22 H102 V40 C90 46 30 46 18 40 Z" fill="#e88a9a"/>
  <rect x="34" y="16" width="6" height="12" rx="2" fill="#f4c86b"/><rect x="80" y="16" width="6" height="12" rx="2" fill="#f4c86b"/>
</svg>`,Gl={baer:`
    <circle cx="34" cy="34" r="15" fill="#c9a37e"/><circle cx="86" cy="34" r="15" fill="#c9a37e"/>
    <circle cx="34" cy="34" r="7" fill="#e2c3a0"/><circle cx="86" cy="34" r="7" fill="#e2c3a0"/>
    <circle cx="60" cy="62" r="38" fill="#c9a37e"/>
    <ellipse cx="60" cy="76" rx="16" ry="12" fill="#e2c3a0"/>
    <circle cx="46" cy="56" r="5" fill="#4a4032"/><circle cx="74" cy="56" r="5" fill="#4a4032"/>
    <ellipse cx="60" cy="71" rx="6" ry="4.5" fill="#4a4032"/>
    <path d="M53 81 Q60 87 67 81" stroke="#4a4032" stroke-width="3" fill="none" stroke-linecap="round"/>
    <g class="kk-pfote"><ellipse cx="100" cy="92" rx="13" ry="15" fill="#c9a37e"/><ellipse cx="100" cy="95" rx="7" ry="8" fill="#e2c3a0"/></g>`,hase:`
    <ellipse cx="44" cy="22" rx="10" ry="24" fill="#f3e7db"/><ellipse cx="76" cy="22" rx="10" ry="24" fill="#f3e7db"/>
    <ellipse cx="44" cy="24" rx="5" ry="16" fill="#f2b8c6"/><ellipse cx="76" cy="24" rx="5" ry="16" fill="#f2b8c6"/>
    <circle cx="60" cy="66" r="34" fill="#f3e7db"/>
    <circle cx="48" cy="62" r="5" fill="#4a4032"/><circle cx="72" cy="62" r="5" fill="#4a4032"/>
    <ellipse cx="60" cy="74" rx="5" ry="3.5" fill="#e88a9a"/>
    <path d="M60 78 V83 M53 83 Q60 88 67 83" stroke="#4a4032" stroke-width="2.6" fill="none" stroke-linecap="round"/>
    <g class="kk-pfote"><ellipse cx="98" cy="94" rx="12" ry="14" fill="#f3e7db"/></g>`,katze:`
    <path d="M26 50 L22 16 L52 40 Z" fill="#e0a458"/><path d="M94 50 L98 16 L68 40 Z" fill="#e0a458"/>
    <path d="M30 44 L28 26 L46 40 Z" fill="#f2b8c6"/><path d="M90 44 L92 26 L74 40 Z" fill="#f2b8c6"/>
    <ellipse cx="60" cy="66" rx="36" ry="32" fill="#e0a458"/>
    <circle cx="47" cy="62" r="5" fill="#4a4032"/><circle cx="73" cy="62" r="5" fill="#4a4032"/>
    <path d="M56 72 L64 72 L60 77 Z" fill="#e88a9a"/>
    <path d="M51 80 Q56 84 60 79 Q64 84 69 80" stroke="#8a5a2e" stroke-width="2.6" fill="none" stroke-linecap="round"/>
    <path d="M28 72 H40 M28 78 H40 M80 72 H92 M80 78 H92" stroke="#8a5a2e" stroke-width="2" stroke-linecap="round" opacity="0.6"/>
    <g class="kk-pfote"><ellipse cx="100" cy="94" rx="12" ry="14" fill="#e0a458"/></g>`,hund:`
    <ellipse cx="60" cy="64" rx="34" ry="34" fill="#e8d2b4"/>
    <ellipse cx="28" cy="58" rx="12" ry="24" fill="#a9835e" transform="rotate(14 28 58)"/>
    <ellipse cx="92" cy="58" rx="12" ry="24" fill="#a9835e" transform="rotate(-14 92 58)"/>
    <circle cx="70" cy="50" r="10" fill="#a9835e" opacity="0.55"/>
    <circle cx="48" cy="58" r="5" fill="#4a4032"/><circle cx="72" cy="58" r="5" fill="#4a4032"/>
    <ellipse cx="60" cy="72" rx="7" ry="5" fill="#4a4032"/>
    <path d="M60 77 V82 M52 82 Q60 90 68 82" stroke="#4a4032" stroke-width="2.6" fill="none" stroke-linecap="round"/>
    <path d="M56 84 Q60 94 64 84 Z" fill="#e88a9a"/>
    <g class="kk-pfote"><ellipse cx="100" cy="94" rx="12" ry="14" fill="#e8d2b4"/></g>`,maus:`
    <circle cx="32" cy="36" r="18" fill="#b9b3ad"/><circle cx="88" cy="36" r="18" fill="#b9b3ad"/>
    <circle cx="32" cy="36" r="10" fill="#f2b8c6"/><circle cx="88" cy="36" r="10" fill="#f2b8c6"/>
    <ellipse cx="60" cy="68" rx="30" ry="28" fill="#cdc7c1"/>
    <circle cx="49" cy="63" r="4.6" fill="#4a4032"/><circle cx="71" cy="63" r="4.6" fill="#4a4032"/>
    <circle cx="60" cy="76" r="5" fill="#e88a9a"/>
    <path d="M40 76 H50 M40 81 H50 M70 76 H80 M70 81 H80" stroke="#8a8078" stroke-width="2" stroke-linecap="round"/>
    <g class="kk-pfote"><ellipse cx="96" cy="94" rx="11" ry="13" fill="#cdc7c1"/></g>`,ente:`
    <circle cx="60" cy="60" r="34" fill="#f7d570"/>
    <path d="M58 22 C54 14 60 8 64 14 C66 10 72 12 68 20 Z" fill="#f7d570"/>
    <circle cx="48" cy="54" r="5" fill="#4a4032"/><circle cx="72" cy="54" r="5" fill="#4a4032"/>
    <ellipse cx="60" cy="72" rx="16" ry="8" fill="#f4a56b"/>
    <path d="M46 72 Q60 78 74 72" stroke="#e0864a" stroke-width="2" fill="none"/>
    <circle cx="40" cy="68" r="5" fill="#f4a56b" opacity="0.45"/><circle cx="80" cy="68" r="5" fill="#f4a56b" opacity="0.45"/>
    <g class="kk-pfote"><path d="M88 96 C94 80 112 80 112 92 C112 102 100 108 88 96 Z" fill="#f2c45a"/></g>`,frosch:`
    <circle cx="40" cy="34" r="16" fill="#7fb99e"/><circle cx="80" cy="34" r="16" fill="#7fb99e"/>
    <circle cx="40" cy="32" r="9" fill="#fffaf2"/><circle cx="80" cy="32" r="9" fill="#fffaf2"/>
    <circle cx="41" cy="33" r="5" fill="#4a4032"/><circle cx="81" cy="33" r="5" fill="#4a4032"/>
    <ellipse cx="60" cy="66" rx="40" ry="30" fill="#7fb99e"/>
    <path d="M36 70 Q60 92 84 70" stroke="#3f6b4c" stroke-width="3.5" fill="none" stroke-linecap="round"/>
    <circle cx="36" cy="62" r="5" fill="#e88a9a" opacity="0.5"/><circle cx="84" cy="62" r="5" fill="#e88a9a" opacity="0.5"/>
    <g class="kk-pfote"><ellipse cx="102" cy="94" rx="12" ry="12" fill="#7fb99e"/><circle cx="96" cy="84" r="4" fill="#7fb99e"/><circle cx="104" cy="82" r="4" fill="#7fb99e"/><circle cx="111" cy="86" r="4" fill="#7fb99e"/></g>`,pinguin:`
    <ellipse cx="60" cy="62" rx="34" ry="36" fill="#3f4a5c"/>
    <path d="M60 34 C40 34 34 54 36 70 C38 88 50 96 60 96 C70 96 82 88 84 70 C86 54 80 34 60 34 Z" fill="#fffaf2"/>
    <circle cx="50" cy="56" r="4.6" fill="#3f4a5c"/><circle cx="70" cy="56" r="4.6" fill="#3f4a5c"/>
    <path d="M52 66 L68 66 L60 75 Z" fill="#f4a56b"/>
    <circle cx="44" cy="70" r="5" fill="#f2b8c6" opacity="0.6"/><circle cx="76" cy="70" r="5" fill="#f2b8c6" opacity="0.6"/>
    <g class="kk-pfote"><ellipse cx="98" cy="88" rx="9" ry="18" fill="#3f4a5c" transform="rotate(-24 98 88)"/></g>`},Kl=Object.keys(Gl),ql=[{farbe:`#e88a9a`,muster:`#f2b8c6`},{farbe:`#7ea3c9`,muster:`#a9c4e0`},{farbe:`#f4c86b`,muster:`#fae3a6`},{farbe:`#7fb99e`,muster:`#acd6c0`},{farbe:`#c896d8`,muster:`#dfc1ea`},{farbe:`#e0a458`,muster:`#efc895`}],Jl=2400,Yl=null,Xl=[],Zl=[],Ql=new Set,$l=new Map,eu=0;function tu(e,t,n){e.addEventListener(t,n),Zl.push(()=>e.removeEventListener(t,n))}function nu(e,t){let n=window.setTimeout(()=>{Ql.delete(n),e()},t);return Ql.add(n),n}function ru(e){return`<svg viewBox="0 0 120 120" width="100%" height="100%">${Gl[e]}</svg>`}function iu(e){let t=new Set(Xl.map(e=>e.tier)),n=Kl.filter(n=>n!==e&&!t.has(n)),r=n.length>0?n:Kl.filter(t=>t!==e);return r[Math.floor(Math.random()*r.length)]}function au(e){Zl=[],Ql=new Set,$l=new Map,Xl=[];let t=[...Kl].sort(()=>Math.random()-.5).slice(0,ql.length);e.innerHTML=`
    <div class="kuckuck-stage" id="kuckuckStage">
      <div class="kuckuck-raster">
        ${ql.map((e,n)=>`
          <div class="kk-versteck" data-i="${n}">
            <div class="kk-leine"></div>
            <div class="kk-tier">${ru(t[n])}</div>
            <div class="kk-tuch" style="--tuch:${e.farbe};--muster:${e.muster}"></div>
            <span class="kk-klammer l"></span><span class="kk-klammer r"></span>
          </div>`).join(``)}
      </div>
    </div>
  `,Yl=e.querySelector(`#kuckuckStage`),Xl=[...e.querySelectorAll(`.kk-versteck`)].map((e,n)=>({cell:e,tierEl:e.querySelector(`.kk-tier`),tier:t[n],offen:!1,zuTimer:null})),tu(Yl,`pointerdown`,e=>{let t=e;t.preventDefault();try{Yl?.setPointerCapture(t.pointerId)}catch{}let n=ou(t.clientX,t.clientY);$l.set(t.pointerId,n),cu(n)}),tu(Yl,`pointermove`,e=>{let t=e;if(!$l.has(t.pointerId))return;let n=su(t.clientX,t.clientY);n!==$l.get(t.pointerId)&&($l.set(t.pointerId,n),n>=0&&cu(n))});let n=e=>$l.delete(e.pointerId);tu(Yl,`pointerup`,n),tu(Yl,`pointercancel`,n)}function ou(e,t){let n=0,r=1/0;return Xl.forEach((i,a)=>{let o=i.cell.getBoundingClientRect(),s=Math.hypot(e-(o.left+o.width/2),t-(o.top+o.height/2));s<r&&(r=s,n=a)}),n}function su(e,t){return Xl.findIndex(n=>{let r=n.cell.getBoundingClientRect();return e>=r.left&&e<=r.right&&t>=r.top&&t<=r.bottom})}function cu(e){let t=Xl[e];if(!t)return;t.zuTimer!==null&&(window.clearTimeout(t.zuTimer),Ql.delete(t.zuTimer));let n=t.offen;t.offen=!0,t.cell.classList.add(`offen`),t.tierEl.classList.remove(`winkt`),t.tierEl.offsetWidth,t.tierEl.classList.add(`winkt`);let r=performance.now();r-eu>320&&(eu=r,n||_(),nu(()=>m({freq:659.25,duration:.14,attack:.02,release:.22,gain:.24}),120),nu(()=>m({freq:523.25,duration:.22,attack:.02,release:.3,gain:.22}),330)),t.zuTimer=nu(()=>{t.zuTimer=null,t.offen=!1,t.cell.classList.remove(`offen`),t.tierEl.classList.remove(`winkt`),nu(()=>{t.offen||(t.tier=iu(t.tier),t.tierEl.innerHTML=ru(t.tier))},600)},Jl)}function lu(){Zl.forEach(e=>e()),Zl=[],Ql.forEach(e=>window.clearTimeout(e)),Ql=new Set,$l=new Map,Xl=[],Yl=null}var uu={id:`kuckuck`,name:`Kuckuck`,accent:`#e88a9a`,tileIcon:Wl,mount:au,unmount:lu},du=`
<svg viewBox="0 0 120 120" width="100%" height="100%">
  <ellipse cx="38" cy="26" rx="9" ry="22" fill="#f3e7db"/><ellipse cx="66" cy="26" rx="9" ry="22" fill="#f3e7db"/>
  <ellipse cx="38" cy="28" rx="4.5" ry="14" fill="#f2b8c6"/><ellipse cx="66" cy="28" rx="4.5" ry="14" fill="#f2b8c6"/>
  <circle cx="52" cy="66" r="30" fill="#f3e7db"/>
  <circle cx="42" cy="60" r="4.5" fill="#4a4032"/><circle cx="62" cy="60" r="4.5" fill="#4a4032"/>
  <ellipse cx="52" cy="80" rx="9" ry="7" fill="#7a4a3a"/>
  <path d="M76 98 L112 70 C116 66 110 60 106 64 L72 92 Z" fill="#f4a24e"/>
  <path d="M106 64 C108 56 114 54 116 50 M108 66 C116 64 118 60 120 58" stroke="#7fb99e" stroke-width="4" stroke-linecap="round" fill="none"/>
</svg>`,fu={hase:{lieblingsfutter:`karotte`,svg:`
      <ellipse cx="74" cy="44" rx="16" ry="40" fill="#f3e7db"/><ellipse cx="126" cy="44" rx="16" ry="40" fill="#f3e7db"/>
      <ellipse cx="74" cy="48" rx="8" ry="28" fill="#f2b8c6"/><ellipse cx="126" cy="48" rx="8" ry="28" fill="#f2b8c6"/>
      <circle cx="100" cy="122" r="62" fill="#f3e7db"/>
      <circle cx="78" cy="110" r="8" fill="#4a4032"/><circle cx="122" cy="110" r="8" fill="#4a4032"/>
      <circle cx="80" cy="107" r="2.6" fill="#fffaf2"/><circle cx="124" cy="107" r="2.6" fill="#fffaf2"/>
      <circle cx="64" cy="134" r="9" fill="#f2b8c6" opacity="0.6"/><circle cx="136" cy="134" r="9" fill="#f2b8c6" opacity="0.6"/>
      <ellipse cx="100" cy="130" rx="7" ry="5" fill="#e88a9a"/>`},hund:{lieblingsfutter:`knochen`,svg:`
      <circle cx="100" cy="112" r="64" fill="#e8d2b4"/>
      <ellipse cx="46" cy="104" rx="20" ry="44" fill="#a9835e" transform="rotate(14 46 104)"/>
      <ellipse cx="154" cy="104" rx="20" ry="44" fill="#a9835e" transform="rotate(-14 154 104)"/>
      <circle cx="122" cy="88" r="17" fill="#a9835e" opacity="0.5"/>
      <circle cx="80" cy="100" r="8" fill="#4a4032"/><circle cx="120" cy="100" r="8" fill="#4a4032"/>
      <circle cx="82" cy="97" r="2.6" fill="#fffaf2"/><circle cx="122" cy="97" r="2.6" fill="#fffaf2"/>
      <ellipse cx="100" cy="134" rx="30" ry="24" fill="#f3e4cf"/>
      <ellipse cx="100" cy="124" rx="11" ry="8" fill="#4a4032"/>`},affe:{lieblingsfutter:`banane`,svg:`
      <circle cx="40" cy="108" r="22" fill="#a9835e"/><circle cx="160" cy="108" r="22" fill="#a9835e"/>
      <circle cx="40" cy="108" r="12" fill="#e9c9a3"/><circle cx="160" cy="108" r="12" fill="#e9c9a3"/>
      <circle cx="100" cy="108" r="62" fill="#a9835e"/>
      <path d="M100 74 C76 58 52 76 58 102 C50 124 66 168 100 168 C134 168 150 124 142 102 C148 76 124 58 100 74 Z" fill="#e9c9a3"/>
      <circle cx="82" cy="100" r="8" fill="#4a4032"/><circle cx="118" cy="100" r="8" fill="#4a4032"/>
      <circle cx="84" cy="97" r="2.6" fill="#fffaf2"/><circle cx="120" cy="97" r="2.6" fill="#fffaf2"/>
      <circle cx="94" cy="126" r="2.6" fill="#7a5a3e"/><circle cx="106" cy="126" r="2.6" fill="#7a5a3e"/>`},maus:{lieblingsfutter:`kaese`,svg:`
      <circle cx="50" cy="66" r="34" fill="#b9b3ad"/><circle cx="150" cy="66" r="34" fill="#b9b3ad"/>
      <circle cx="50" cy="66" r="20" fill="#f2b8c6"/><circle cx="150" cy="66" r="20" fill="#f2b8c6"/>
      <ellipse cx="100" cy="120" rx="56" ry="54" fill="#cdc7c1"/>
      <circle cx="80" cy="110" r="8" fill="#4a4032"/><circle cx="120" cy="110" r="8" fill="#4a4032"/>
      <circle cx="82" cy="107" r="2.6" fill="#fffaf2"/><circle cx="122" cy="107" r="2.6" fill="#fffaf2"/>
      <circle cx="100" cy="132" r="8" fill="#e88a9a"/>
      <path d="M48 128 H72 M48 138 H72 M128 128 H152 M128 138 H152" stroke="#8a8078" stroke-width="3" stroke-linecap="round"/>`},baer:{lieblingsfutter:`apfel`,svg:`
      <circle cx="50" cy="56" r="24" fill="#b48a62"/><circle cx="150" cy="56" r="24" fill="#b48a62"/>
      <circle cx="50" cy="56" r="12" fill="#e2c3a0"/><circle cx="150" cy="56" r="12" fill="#e2c3a0"/>
      <circle cx="100" cy="112" r="66" fill="#b48a62"/>
      <ellipse cx="100" cy="138" rx="32" ry="26" fill="#e2c3a0"/>
      <circle cx="78" cy="100" r="8" fill="#4a4032"/><circle cx="122" cy="100" r="8" fill="#4a4032"/>
      <circle cx="80" cy="97" r="2.6" fill="#fffaf2"/><circle cx="124" cy="97" r="2.6" fill="#fffaf2"/>
      <ellipse cx="100" cy="126" rx="11" ry="8" fill="#4a4032"/>`}},pu=Object.keys(fu),mu=`
  <path class="ft-maul-zu" d="M84 146 Q100 160 116 146" stroke="#4a4032" stroke-width="5" fill="none" stroke-linecap="round"/>
  <g class="ft-maul-auf">
    <ellipse cx="100" cy="152" rx="20" ry="17" fill="#7a3e3a"/>
    <ellipse cx="100" cy="162" rx="12" ry="7" fill="#e88a9a"/>
  </g>`,hu={karotte:`
    <path d="M30 34 C42 26 58 30 64 42 L40 92 C36 98 30 96 30 88 Z" fill="#f4a24e"/>
    <path d="M36 50 H48 M34 64 H44 M33 78 H40" stroke="#d9823a" stroke-width="3" stroke-linecap="round"/>
    <path d="M48 32 C44 18 52 8 58 6 M52 34 C56 20 68 16 76 16 M54 36 C64 30 76 32 84 36" stroke="#7fb99e" stroke-width="6" stroke-linecap="round" fill="none"/>`,knochen:`
    <g transform="rotate(-30 50 50)">
      <g stroke="#c9b79a" stroke-width="5">
        <rect x="24" y="40" width="52" height="20" rx="8"/>
        <circle cx="22" cy="40" r="12"/><circle cx="22" cy="60" r="12"/><circle cx="78" cy="40" r="12"/><circle cx="78" cy="60" r="12"/>
      </g>
      <rect x="24" y="40" width="52" height="20" rx="8" fill="#f6efe3"/>
      <circle cx="22" cy="40" r="12" fill="#f6efe3"/><circle cx="22" cy="60" r="12" fill="#f6efe3"/>
      <circle cx="78" cy="40" r="12" fill="#f6efe3"/><circle cx="78" cy="60" r="12" fill="#f6efe3"/>
      <path d="M30 46 H70" stroke="#e3d6c2" stroke-width="3" stroke-linecap="round"/>
    </g>`,banane:`
    <path d="M18 30 C20 64 48 86 84 74 C88 72 88 66 84 66 C54 70 34 56 28 28 C27 22 18 22 18 30 Z" fill="#f7d570"/>
    <path d="M28 34 C36 58 54 68 80 68" stroke="#e8bf4a" stroke-width="3" fill="none" stroke-linecap="round"/>
    <path d="M18 30 L16 20 L24 22 Z" fill="#8a7255"/>`,kaese:`
    <path d="M10 70 L84 36 L90 74 Z" fill="#f7d570"/>
    <path d="M10 70 L90 74 L90 84 L10 80 Z" fill="#e8bf4a"/>
    <circle cx="56" cy="62" r="6" fill="#e8bf4a"/><circle cx="74" cy="54" r="4" fill="#e8bf4a"/><circle cx="38" cy="68" r="4" fill="#e8bf4a"/>`,apfel:`
    <path d="M50 30 C36 20 14 26 14 52 C14 76 32 92 50 86 C68 92 86 76 86 52 C86 26 64 20 50 30 Z" fill="#e8746a"/>
    <path d="M30 44 C28 52 30 60 34 64" stroke="#f3a99f" stroke-width="5" fill="none" stroke-linecap="round"/>
    <path d="M50 30 C50 22 52 16 56 12" stroke="#8a7255" stroke-width="4" fill="none" stroke-linecap="round"/>
    <path d="M54 20 C60 10 72 10 76 14 C70 22 60 24 54 20 Z" fill="#7fb99e"/>`},gu=Object.keys(hu),_u=3,J=null,vu=null,Y=null,yu=[],bu=new Set,xu=new Map,Su=`hase`,Cu=[],wu=0,Tu=!1,Eu=0;function Du(e,t,n){e.addEventListener(t,n),yu.push(()=>e.removeEventListener(t,n))}function X(e,t){let n=window.setTimeout(()=>{bu.delete(n),e()},t);return bu.add(n),n}function Ou(e,t,n){e.classList.remove(t),e.offsetWidth,e.classList.add(t),X(()=>e.classList.remove(t),n)}function ku(e){return`<svg viewBox="0 0 200 200" width="100%" height="100%">${fu[e].svg}${mu}</svg>`}function Au(){return Cu.length===0&&(Cu=[...pu].sort(()=>Math.random()-.5),Cu[0]===Su&&Cu.push(Cu.shift())),Cu.shift()}function ju(e){yu=[],bu=new Set,xu=new Map,Cu=[],wu=0,Tu=!1,Su=Au(),e.innerHTML=`
    <div class="fuettern-stage" id="fuetternStage">
      <div class="ft-buehne">
        <div class="ft-tier-wrap" id="ftWrap"><div class="ft-tier" id="ftTier">${ku(Su)}</div></div>
      </div>
      <div class="ft-teller">
        ${gu.map(e=>`<div class="ft-futter" data-futter="${e}"><svg viewBox="0 0 100 100" width="100%" height="100%">${hu[e]}</svg></div>`).join(``)}
      </div>
    </div>
  `,J=e.querySelector(`#fuetternStage`),vu=e.querySelector(`#ftWrap`),Y=e.querySelector(`#ftTier`),Du(J,`pointerdown`,e=>{let t=e;t.preventDefault();let n=t.target.closest(`.ft-futter`);if(n){Mu(t,n);return}vu&&Lu(t.clientX,t.clientY)&&Bu()}),Du(J,`pointermove`,e=>{let t=e,n=xu.get(t.pointerId);n&&(Math.hypot(t.clientX-n.startX,t.clientY-n.startY)>14&&(n.gezogen=!0),Pu(n.ghost,t.clientX,t.clientY),Y?.classList.toggle(`offen`,[...xu.values()].some(e=>e.gezogen)&&Iu(t.clientX,t.clientY)))});let t=e=>{let t=e,n=xu.get(t.pointerId);n&&(xu.delete(t.pointerId),n.item.classList.remove(`gehalten`),!Tu&&(!n.gezogen||e.type===`pointerup`&&Iu(t.clientX,t.clientY))?Ru(n):zu(n))};Du(J,`pointerup`,t),Du(J,`pointercancel`,t)}function Mu(e,t){if(!J)return;try{J.setPointerCapture(e.pointerId)}catch{}let n=t.dataset.futter,r=document.createElement(`div`);r.className=`ft-ghost`;let i=t.clientWidth;r.style.width=`${i}px`,r.style.height=`${i}px`,r.innerHTML=t.innerHTML,J.appendChild(r),Pu(r,e.clientX,e.clientY),t.classList.add(`gehalten`),xu.set(e.pointerId,{futter:n,ghost:r,item:t,startX:e.clientX,startY:e.clientY,gezogen:!1}),h(620)}function Nu(e,t){let n=J.getBoundingClientRect(),r=J.clientWidth/(n.width||1);return{x:(e-n.left)*r,y:(t-n.top)*r}}function Pu(e,t,n){let r=Nu(t,n);e.style.setProperty(`--tx`,`${r.x.toFixed(1)}px`),e.style.setProperty(`--ty`,`${r.y.toFixed(1)}px`)}function Fu(){let e=Y.getBoundingClientRect();return{x:e.left+e.width/2,y:e.top+e.height*.75}}function Iu(e,t){if(!Y)return!1;let n=Y.getBoundingClientRect(),r=Fu();return Lu(e,t)||Math.hypot(e-r.x,t-r.y)<n.width*.55}function Lu(e,t){let n=Y.getBoundingClientRect();return e>=n.left&&e<=n.right&&t>=n.top&&t<=n.bottom}function Ru(e){if(!Y)return;let t=Fu();Y.classList.add(`offen`),e.ghost.classList.add(`fliegt`),e.ghost.offsetWidth,Pu(e.ghost,t.x,t.y),e.ghost.classList.add(`weg`),_(),X(()=>{if(e.ghost.remove(),!Y)return;Y.classList.remove(`offen`),Ou(Y,`kaut`,1e3),[0,230,460].forEach(e=>X(()=>{ie(150,.14,.1),oe(.07,.09)},e));let t=fu[Su].lieblingsfutter===e.futter;wu++,X(()=>{Y&&(Ou(Y,t?`jubelt`:`huepft`,900),Hu(t?2:1),wu>=_u&&X(Vu,1100))},950)},380)}function zu(e){let t=e.item.getBoundingClientRect();e.ghost.classList.add(`fliegt`),e.ghost.offsetWidth,Pu(e.ghost,t.left+t.width/2,t.top+t.height/2),X(()=>e.ghost.remove(),380),Y?.classList.remove(`offen`)}function Bu(){!Y||Tu||(Ou(Y,`huepft`,900),Hu(1))}function Vu(){!vu||!Y||Tu||(Tu=!0,wu=0,vu.classList.add(`geht`),g(500,260,.35,.1),X(()=>{!vu||!Y||(Su=Au(),Y.innerHTML=ku(Su),vu.classList.remove(`geht`),vu.classList.add(`kommt`),vu.offsetWidth,vu.classList.remove(`kommt`),X(()=>{Tu=!1,Hu(1)},650))},650))}function Hu(e){let t=performance.now();if(!(t-Eu<300)){Eu=t;for(let t=0;t<e;t++)X(()=>Uu[Su](),t*520)}}var Uu={hase:()=>{[0,90,180].forEach(e=>X(()=>g(1300,1700,.05,.08),e))},hund:()=>{g(330,190,.13,.22,`triangle`),X(()=>g(330,190,.13,.22,`triangle`),200)},affe:()=>{[0,150].forEach(e=>X(()=>g(300,420,.1,.16,`triangle`),e)),[320,460].forEach(e=>X(()=>g(450,760,.12,.16,`triangle`),e))},maus:()=>{[0,140].forEach(e=>X(()=>m({freq:1760,duration:.05,attack:.005,release:.06,gain:.12}),e))},baer:()=>{g(140,100,.6,.22,`triangle`)}};function Wu(){yu.forEach(e=>e()),yu=[],bu.forEach(e=>window.clearTimeout(e)),bu=new Set,xu=new Map,J=null,vu=null,Y=null}var Gu={id:`fuettern`,name:`Tiere füttern`,accent:`#f4a24e`,tileIcon:du,mount:ju,unmount:Wu},Ku=`
<svg viewBox="0 0 120 120" width="100%" height="100%">
  <rect x="8" y="8" width="104" height="104" rx="22" fill="#2a3558"/>
  <circle cx="70" cy="56" r="34" fill="#f6e7c4"/>
  <circle cx="70" cy="62" r="16" fill="#8a8fa0"/>
  <path d="M58 48 L56 32 L66 44 Z M82 48 L84 32 L74 44 Z" fill="#8a8fa0"/>
  <circle cx="64" cy="58" r="3" fill="#f7d570"/><circle cx="76" cy="58" r="3" fill="#f7d570"/>
  <path d="M18 104 L40 82" stroke="#e0a458" stroke-width="12" stroke-linecap="round"/>
  <path d="M36 86 L48 74" stroke="#f7d570" stroke-width="14" stroke-linecap="round"/>
</svg>`,qu=[{id:`mond`,x:62,y:22,b:26,svg:`<svg viewBox="0 0 100 100" width="100%" height="100%">
      <rect x="4" y="4" width="92" height="92" rx="6" fill="#c9a37e"/>
      <rect x="10" y="10" width="80" height="80" fill="#34407a"/>
      <g class="lp-bewegt"><path d="M60 24 a22 22 0 1 0 14 38 a17 17 0 1 1 -14 -38 Z" fill="#f6e7b4"/></g>
      <g class="lp-sterne" fill="#fdf6ea"><circle cx="24" cy="24" r="2.4"/><circle cx="34" cy="64" r="2"/><circle cx="76" cy="78" r="2.2"/><circle cx="20" cy="80" r="1.8"/></g>
      <path d="M50 10 V90 M10 50 H90" stroke="#c9a37e" stroke-width="5"/>
    </svg>`},{id:`uhr`,x:33,y:20,b:15,svg:`<svg viewBox="0 0 100 140" width="100%" height="100%">
      <g class="lp-bewegt"><path d="M50 70 V118" stroke="#a9835e" stroke-width="4"/><circle cx="50" cy="122" r="11" fill="#f4c86b"/></g>
      <path d="M50 4 L92 34 V74 H8 V34 Z" fill="#b48a62"/>
      <circle cx="50" cy="44" r="24" fill="#fffaf2"/>
      <path d="M50 44 V28 M50 44 L62 50" stroke="#4a4032" stroke-width="4" stroke-linecap="round"/>
    </svg>`},{id:`eule`,x:86,y:40,b:22,svg:`<svg viewBox="0 0 100 100" width="100%" height="100%">
      <rect x="0" y="80" width="100" height="10" rx="3" fill="#a9835e"/>
      <ellipse cx="50" cy="54" rx="28" ry="30" fill="#b48a62"/>
      <ellipse cx="50" cy="64" rx="18" ry="18" fill="#e2c3a0"/>
      <path d="M26 30 L30 16 L40 28 Z M74 30 L70 16 L60 28 Z" fill="#b48a62"/>
      <circle cx="39" cy="44" r="11" fill="#fffaf2"/><circle cx="61" cy="44" r="11" fill="#fffaf2"/>
      <circle cx="39" cy="44" r="5.5" fill="#4a4032"/><circle cx="61" cy="44" r="5.5" fill="#4a4032"/>
      <g class="lp-bewegt"><rect x="27" y="32" width="24" height="24" rx="11" fill="#b48a62"/><rect x="49" y="32" width="24" height="24" rx="11" fill="#b48a62"/></g>
      <path d="M46 54 L54 54 L50 62 Z" fill="#f4a24e"/>
      <path d="M40 82 V76 M46 82 V76 M54 82 V76 M60 82 V76" stroke="#f4a24e" stroke-width="3" stroke-linecap="round"/>
    </svg>`},{id:`katze`,x:18,y:95,unten:!0,b:20,svg:`<svg viewBox="0 0 100 80" width="100%" height="100%">
      <g class="lp-bewegt">
        <path d="M80 60 C96 56 98 40 90 34" stroke="#8a8fa0" stroke-width="7" fill="none" stroke-linecap="round"/>
        <ellipse cx="58" cy="60" rx="28" ry="16" fill="#8a8fa0"/>
        <circle cx="30" cy="46" r="20" fill="#8a8fa0"/>
        <path d="M14 36 L12 16 L28 30 Z M46 36 L48 16 L32 30 Z" fill="#8a8fa0"/>
        <path d="M17 32 L16 22 L25 30 Z M43 32 L44 22 L35 30 Z" fill="#f2b8c6"/>
        <ellipse cx="23" cy="45" rx="4" ry="5" fill="#f7d570"/><ellipse cx="37" cy="45" rx="4" ry="5" fill="#f7d570"/>
        <ellipse cx="23" cy="45" rx="1.6" ry="4" fill="#2c3e50"/><ellipse cx="37" cy="45" rx="1.6" ry="4" fill="#2c3e50"/>
        <path d="M28 53 L32 53 L30 56 Z" fill="#e88a9a"/>
      </g>
    </svg>`},{id:`bett`,x:24,y:92,unten:!0,b:44,deko:!0,svg:`<svg viewBox="0 0 200 110" width="100%" height="100%">
      <rect x="4" y="10" width="14" height="96" rx="5" fill="#b48a62"/>
      <rect x="182" y="40" width="14" height="66" rx="5" fill="#b48a62"/>
      <rect x="10" y="48" width="180" height="26" rx="8" fill="#7ea3c9"/>
      <path d="M60 40 H186 V66 H60 Z" fill="#e88a9a"/>
      <path d="M60 50 H186 M60 58 H186" stroke="#f2b8c6" stroke-width="3"/>
      <ellipse cx="40" cy="44" rx="22" ry="10" fill="#fffaf2"/>
    </svg>`},{id:`teddy`,x:55,y:90,unten:!0,b:18,svg:`<svg viewBox="0 0 100 110" width="100%" height="100%">
      <circle cx="28" cy="18" r="10" fill="#9a6b45"/><circle cx="72" cy="18" r="10" fill="#9a6b45"/>
      <ellipse cx="50" cy="80" rx="30" ry="28" fill="#9a6b45"/>
      <ellipse cx="50" cy="84" rx="16" ry="16" fill="#e2c3a0"/>
      <circle cx="50" cy="38" r="26" fill="#9a6b45"/>
      <ellipse cx="50" cy="46" rx="11" ry="8" fill="#e2c3a0"/>
      <circle cx="41" cy="34" r="3.6" fill="#4a4032"/><circle cx="59" cy="34" r="3.6" fill="#4a4032"/>
      <ellipse cx="50" cy="43" rx="4" ry="3" fill="#4a4032"/>
      <path d="M45 50 Q50 54 55 50" stroke="#4a4032" stroke-width="2" fill="none" stroke-linecap="round"/>
      <ellipse cx="22" cy="74" rx="9" ry="14" fill="#9a6b45"/>
      <g class="lp-bewegt"><ellipse cx="80" cy="66" rx="9" ry="14" fill="#9a6b45"/></g>
      <ellipse cx="32" cy="104" rx="11" ry="7" fill="#9a6b45"/><ellipse cx="68" cy="104" rx="11" ry="7" fill="#9a6b45"/>
    </svg>`},{id:`fisch`,x:80,y:88,unten:!0,b:20,svg:`<svg viewBox="0 0 100 100" width="100%" height="100%">
      <rect x="20" y="86" width="60" height="12" rx="3" fill="#a9835e"/>
      <path d="M26 20 H74 C96 34 96 76 74 88 H26 C4 76 4 34 26 20 Z" fill="#cfe7f5" opacity="0.9"/>
      <path d="M12 46 C30 40 70 40 88 46 C94 64 86 80 74 88 H26 C14 80 6 64 12 46 Z" fill="#7ec8d8"/>
      <g class="lp-bewegt">
        <path d="M34 62 C40 52 58 52 64 62 C58 72 40 72 34 62 Z" fill="#f4a24e"/>
        <path d="M64 62 L76 54 L76 70 Z" fill="#f4a24e"/>
        <circle cx="42" cy="60" r="2.4" fill="#2c3e50"/>
      </g>
      <g class="lp-blasen" fill="#fffaf2"><circle cx="40" cy="44" r="3"/><circle cx="46" cy="34" r="2.4"/><circle cx="42" cy="26" r="2"/></g>
    </svg>`},{id:`maus`,x:93,y:70.5,unten:!0,b:12,svg:`<svg viewBox="0 0 100 100" width="100%" height="100%">
      <path d="M8 100 V58 C8 30 92 30 92 58 V100 Z" fill="#3b3226"/>
      <g class="lp-bewegt">
        <circle cx="32" cy="58" r="11" fill="#b9b3ad"/><circle cx="68" cy="58" r="11" fill="#b9b3ad"/>
        <circle cx="32" cy="58" r="6" fill="#f2b8c6"/><circle cx="68" cy="58" r="6" fill="#f2b8c6"/>
        <ellipse cx="50" cy="78" rx="22" ry="20" fill="#cdc7c1"/>
        <circle cx="42" cy="74" r="3.6" fill="#2c3e50"/><circle cx="58" cy="74" r="3.6" fill="#2c3e50"/>
        <circle cx="50" cy="84" r="3.4" fill="#e88a9a"/>
      </g>
    </svg>`}],Ju=30,Yu=.75,Xu=1600,Z=null,Zu=null,Qu=[],$u=[],ed=new Set,td=null,nd=new Set,rd=50,id=50;function ad(e,t,n){e.addEventListener(t,n),$u.push(()=>e.removeEventListener(t,n))}function od(e,t){let n=window.setTimeout(()=>{ed.delete(n),e()},t);return ed.add(n),n}function sd(e){$u=[],ed=new Set,nd=new Set,rd=55,id=78,e.innerHTML=`
    <div class="lampe-stage" id="lampeStage" style="--lp-r:${Ju}vmin">
      <div class="lp-wand"></div>
      <div class="lp-boden"></div>
      ${qu.map(e=>`<div class="lp-ding lp-${e.id}${`unten`in e?` unten`:``}" data-id="${e.id}" style="left:${e.x}%;top:${e.y}%;width:${e.b}vmin">${e.svg}</div>`).join(``)}
      <div class="lp-dunkel" id="lampeDunkel"></div>
    </div>
  `,Z=e.querySelector(`#lampeStage`),Zu=e.querySelector(`#lampeDunkel`),Qu=qu.filter(e=>!(`deko`in e)).map(t=>({id:t.id,el:e.querySelector(`.lp-ding[data-id="${t.id}"]`),x:0,y:0,hell:!1,zuletzt:0})),td=new ResizeObserver(()=>{cd(),ud()}),td.observe(Z),cd(),ud(),ad(Z,`pointerdown`,e=>{let t=e;t.preventDefault();try{Z?.setPointerCapture(t.pointerId)}catch{}nd.add(t.pointerId),ld(t.clientX,t.clientY);let n=Qu.find(e=>e.el.contains(t.target));n&&n.hell&&performance.now()-n.zuletzt>600&&dd(n)}),ad(Z,`pointermove`,e=>{let t=e;nd.has(t.pointerId)&&ld(t.clientX,t.clientY)});let t=e=>nd.delete(e.pointerId);ad(Z,`pointerup`,t),ad(Z,`pointercancel`,t)}function cd(){if(!Z)return;let e=Z.getBoundingClientRect(),t=Z.clientWidth/(e.width||1);for(let n of Qu){let r=n.el.getBoundingClientRect();n.x=(r.left-e.left+r.width/2)*t,n.y=(r.top-e.top+r.height/2)*t}}function ld(e,t){if(!Z)return;let n=Z.getBoundingClientRect();n.width!==0&&n.height!==0&&(rd=(e-n.left)/n.width*100,id=(t-n.top)/n.height*100,ud())}function ud(){if(!Z||!Zu)return;let e=Z.clientWidth,t=Z.clientHeight,n=rd/100*e,r=id/100*t;Zu.style.transform=`translate3d(${n.toFixed(1)}px, ${r.toFixed(1)}px, 0)`;let i=Math.min(e,t)*Ju/100,a=performance.now();for(let e of Qu){let t=Math.hypot(e.x-n,e.y-r)<i*Yu;t&&!e.hell&&a-e.zuletzt>Xu&&dd(e),e.hell=t}}function dd(e){e.zuletzt=performance.now(),e.el.classList.remove(`wach`),e.el.offsetWidth,e.el.classList.add(`wach`),od(()=>e.el.classList.remove(`wach`),1500),fd[e.id]()}var fd={mond:()=>{[5,7].forEach((e,t)=>od(()=>m({freq:p[e]*2,duration:.1,attack:.01,release:.8,gain:.08}),t*160))},uhr:()=>{[0,380,760].forEach((e,t)=>od(()=>h(t%2==0?1250:950),e))},eule:()=>{g(420,380,.22,.14),od(()=>g(400,340,.4,.14),320)},katze:()=>{g(520,820,.18,.12,`triangle`),od(()=>g(820,430,.42,.12,`triangle`),170)},bett:()=>{},teddy:()=>{g(150,110,.5,.18,`triangle`)},fisch:()=>{[0,140,280].forEach((e,t)=>od(()=>g(260+t*80,620+t*120,.09,.12),e))},maus:()=>{[0,150].forEach(e=>od(()=>m({freq:1870,duration:.05,attack:.005,release:.06,gain:.1}),e))}};function pd(){$u.forEach(e=>e()),$u=[],ed.forEach(e=>window.clearTimeout(e)),ed=new Set,td?.disconnect(),td=null,nd=new Set,Qu=[],Z=null,Zu=null}var md={id:`lampe`,name:`Taschenlampe`,accent:`#f7d570`,tileIcon:Ku,mount:sd,unmount:pd},hd=`
<svg viewBox="0 0 120 120" width="100%" height="100%">
  <path d="M10 62 H110 V74 C110 96 94 106 76 106 H44 C26 106 10 96 10 74 Z" fill="#fffaf2"/>
  <path d="M18 66 H102 V74 C102 90 90 98 76 98 H44 C30 98 18 90 18 74 Z" fill="#7ec8d8"/>
  <rect x="6" y="56" width="108" height="10" rx="5" fill="#fffaf2"/>
  <circle cx="60" cy="40" r="13" fill="#f7d570"/>
  <path d="M40 58 C40 46 52 42 62 48 C72 44 84 48 82 58 Z" fill="#f7d570"/>
  <path d="M71 38 L82 40 L71 44 Z" fill="#f4a24e"/>
  <circle cx="63" cy="37" r="2.4" fill="#4a4032"/>
  <circle cx="26" cy="54" r="7" fill="#fffaf2"/><circle cx="36" cy="52" r="5" fill="#fffaf2"/><circle cx="94" cy="54" r="6" fill="#fffaf2"/>
</svg>`;function gd(e,t){return`<svg viewBox="0 0 100 90" width="100%" height="100%">
    <path d="M12 52 C12 40 26 36 40 44 C46 32 70 30 84 40 C96 50 92 76 70 80 H32 C18 80 12 66 12 52 Z" fill="${e}"/>
    <circle cx="40" cy="30" r="20" fill="${e}"/>
    <path d="M14 30 C14 24 22 24 24 28 L24 36 C20 38 14 36 14 30 Z" fill="${t}"/>
    <circle cx="34" cy="25" r="3.6" fill="#4a4032"/><circle cx="35" cy="24" r="1.2" fill="#fffaf2"/>
    <path d="M52 52 C60 46 74 48 78 56 C70 62 58 62 52 52 Z" fill="#000" opacity="0.08"/>
  </svg>`}var _d=[{art:`ente`,x:24,b:15,svg:gd(`#f7d570`,`#f4a24e`)},{art:`ente`,x:46,b:10,svg:gd(`#f7d570`,`#f4a24e`)},{art:`boot`,x:66,b:14,svg:`<svg viewBox="0 0 100 90" width="100%" height="100%">
  <path d="M50 10 V60" stroke="#a9835e" stroke-width="4"/>
  <path d="M52 12 L84 54 H52 Z" fill="#fffaf2"/>
  <path d="M48 20 L22 54 H48 Z" fill="#e88a9a"/>
  <path d="M8 60 H92 L80 80 H20 Z" fill="#7ea3c9"/>
  <circle cx="34" cy="69" r="3.6" fill="#fffaf2"/><circle cx="50" cy="69" r="3.6" fill="#fffaf2"/><circle cx="66" cy="69" r="3.6" fill="#fffaf2"/>
</svg>`},{art:`ente`,x:84,b:11,svg:gd(`#f2b8c6`,`#e88a9a`)}],vd=14,yd=8,Q=null,bd=null,xd=null,Sd=null,Cd=null,wd=[],Td=[],Ed=new Set,Dd=new Map,$=`voll`,Od=0;function kd(e,t,n){e.addEventListener(t,n),Td.push(()=>e.removeEventListener(t,n))}function Ad(e,t){let n=window.setTimeout(()=>{Ed.delete(n),e()},t);return Ed.add(n),n}function jd(e,t,n){e.classList.remove(t),e.offsetWidth,e.classList.add(t),Ad(()=>e.classList.remove(t),n)}function Md(e){Td=[],Ed=new Set,Dd=new Map,$=`voll`,e.innerHTML=`
    <div class="bad-stage" id="badStage">
      <div class="bw-hahn" id="bwHahn">
        <svg viewBox="0 0 100 80" width="100%" height="100%">
          <rect x="70" y="10" width="24" height="30" rx="6" fill="#c9d6e3"/>
          <path d="M80 26 H30 C20 26 14 32 14 42 V52 H30 V44 C30 40 32 38 36 38 H80 Z" fill="#c9d6e3"/>
          <rect x="74" y="0" width="16" height="12" rx="4" fill="#7ea3c9"/>
          <rect x="10" y="50" width="24" height="8" rx="3" fill="#a9bccf"/>
        </svg>
        <div class="bw-strahl"></div>
      </div>
      <div class="bw-wanne" id="bwWanne">
        <div class="bw-innen">
          <div class="bw-strahl-innen" id="bwStrahlInnen"></div>
          <div class="bw-wasser" id="bwWasser">
            <div class="bw-welle"></div>
            <div class="bw-schaum" id="bwSchaum"></div>
            ${_d.map((e,t)=>`
              <div class="bw-bahn" data-i="${t}" style="--x:${e.x}">
                <div class="bw-ding bw-${e.art}" style="width:${e.b}vmin">
                  <div class="bw-wipp" style="animation-delay:${(-t*.9).toFixed(1)}s">${e.svg}</div>
                </div>
              </div>`).join(``)}
          </div>
        </div>
        <div class="bw-rand"></div>
        <div class="bw-stoepsel" id="bwStoepsel">
          <svg viewBox="0 0 40 120" width="100%" height="100%">
            <path d="M20 0 V92" stroke="#a9bccf" stroke-width="4" stroke-dasharray="6 3"/>
            <rect x="6" y="90" width="28" height="22" rx="8" fill="#5f6b7a"/>
          </svg>
        </div>
        <div class="bw-fuss l"></div><div class="bw-fuss r"></div>
      </div>
    </div>
  `,Q=e.querySelector(`#badStage`),bd=e.querySelector(`#bwWanne`),xd=e.querySelector(`#bwWasser`),Sd=e.querySelector(`#bwSchaum`),Cd=e.querySelector(`#bwHahn`),wd=[...e.querySelectorAll(`.bw-bahn`)].map((e,t)=>({bahn:e,el:e.querySelector(`.bw-ding`),art:_d[t].art,x:_d[t].x})),[12,18,58,90].forEach(e=>Id(e)),kd(Q,`pointerdown`,e=>{let t=e;t.preventDefault();let n=t.target,r=wd.find(e=>e.el.contains(n));if(r&&($===`voll`||$===`fuellt`)){try{Q?.setPointerCapture(t.pointerId)}catch{}Dd.set(t.pointerId,{t:r,startX:t.clientX,gezogen:!1}),Pd(r);return}let i=n.closest(`.bw-blase`);if(i&&Sd?.contains(i)){Ld(i);return}if(n.closest(`#bwHahn`)){Rd();return}if(n.closest(`#bwStoepsel`)){jd(n.closest(`#bwStoepsel`),`gezogen`,600),zd();return}bd&&t.clientY>=bd.getBoundingClientRect().top-20?Fd(t.clientX):Hd(t.clientX,t.clientY)}),kd(Q,`pointermove`,e=>{let t=e,n=Dd.get(t.pointerId);if(!n||!xd||!n.gezogen&&Math.abs(t.clientX-n.startX)<10)return;n.gezogen=!0,n.t.bahn.classList.add(`zieht`);let r=xd.getBoundingClientRect();Nd(n.t,(t.clientX-r.left)/r.width*100)});let t=e=>{let t=Dd.get(e.pointerId);t&&(Dd.delete(e.pointerId),t.t.bahn.classList.remove(`zieht`))};kd(Q,`pointerup`,t),kd(Q,`pointercancel`,t)}function Nd(e,t){e.x=Math.max(9,Math.min(91,t)),e.bahn.style.setProperty(`--x`,e.x.toFixed(1))}function Pd(e){jd(e.el,`gedrueckt`,500),e.art===`ente`?(g(1050,1500,.08,.12,`triangle`),Ad(()=>g(1500,1150,.12,.1,`triangle`),80)):g(300,290,.35,.12,`triangle`)}function Fd(e){if(!Q||!xd)return;if($===`leer`){Bd();return}if($!==`voll`&&$!==`fuellt`)return;let t=xd.getBoundingClientRect(),n=Q.getBoundingClientRect(),r=Q.clientWidth/(n.width||1),i=Math.max(2,Math.min(98,(e-t.left)/t.width*100));if(Q.querySelectorAll(`.bw-spritzer`).length<6){let e=document.createElement(`div`);e.className=`bw-spritzer`,e.style.left=`${((t.left+t.width*i/100-n.left)*r).toFixed(1)}px`,e.style.top=`${((t.top-n.top)*r).toFixed(1)}px`;for(let t=0;t<6;t++){let n=document.createElement(`span`);n.className=`bw-tropfen`,n.style.setProperty(`--dx`,`${((t-2.5)*3+(Math.random()-.5)*3).toFixed(1)}vmin`),n.style.setProperty(`--dy`,`${(-8-Math.random()*8).toFixed(1)}vmin`),e.appendChild(n)}Q.appendChild(e),Ad(()=>e.remove(),800)}let a=document.createElement(`div`);a.className=`bw-ring`,a.style.left=`${i}%`,xd.appendChild(a),Ad(()=>a.remove(),900);for(let e of wd){if([...Dd.values()].some(t=>t.t===e))continue;let t=e.x-i;Math.abs(t)<20&&(Nd(e,e.x+Math.sign(t||Math.random()-.5)*(20-Math.abs(t))*.9),jd(e.el,`schaukelt`,1200))}let o=performance.now();o-Od>90&&(Od=o,le())}function Id(e){if(!Sd||Sd.childElementCount>=vd)return;let t=document.createElement(`div`);t.className=`bw-blase`,t.style.left=`${e.toFixed(1)}%`,t.style.setProperty(`--g`,`${(5+Math.random()*4).toFixed(1)}vmin`),Sd.appendChild(t)}function Ld(e){e.classList.contains(`platzt`)||(e.classList.add(`platzt`),ae(1300+Math.random()*400,.16),Ad(()=>e.remove(),260))}function Rd(){if(Cd){if($===`leer`){Bd();return}Vd(),jd(Cd,`laeuft`,1400),oe(.09,1.1),[0,300,600].forEach(e=>Ad(()=>Id(70+Math.random()*24),e))}}function zd(){!xd||$!==`voll`||($=`leert`,xd.classList.add(`leer`),ue(2.2),Ad(()=>{$=`leer`,Sd?.replaceChildren(),Ad(()=>{$===`leer`&&Bd()},1500)},2400))}function Bd(){!xd||!Cd||$!==`leer`||($=`fuellt`,Vd(),Cd.classList.add(`laeuft`),xd.classList.remove(`leer`),[0,900,1800].forEach(e=>Ad(()=>oe(.08,1),e)),Ad(()=>{$=`voll`,Cd?.classList.remove(`laeuft`),[20,50,80].forEach(e=>Id(e))},2700))}function Vd(){let e=Cd?.querySelector(`.bw-strahl`),t=bd?.querySelector(`.bw-innen`),n=bd?.querySelector(`#bwStrahlInnen`);if(!e||!t||!n||!Q)return;let r=Q.getBoundingClientRect(),i=Q.clientWidth/(r.width||1),a=e.getBoundingClientRect(),o=t.getBoundingClientRect();e.style.setProperty(`--strahl`,`${Math.max(0,(o.top-a.top)*i).toFixed(0)}px`),n.style.left=`${((a.left-o.left)*i-t.clientLeft).toFixed(0)}px`,n.style.width=`${(a.width*i).toFixed(0)}px`}function Hd(e,t){if(!Q||Q.querySelectorAll(`.bw-seifenblase`).length>=yd)return;let n=Q.getBoundingClientRect(),r=Q.clientWidth/(n.width||1),i=document.createElement(`div`);i.className=`bw-seifenblase`,i.style.left=`${((e-n.left)*r).toFixed(1)}px`,i.style.top=`${((t-n.top)*r).toFixed(1)}px`,Q.appendChild(i),g(380,820,.12,.1),Ad(()=>i.remove(),2600)}function Ud(){Td.forEach(e=>e()),Td=[],Ed.forEach(e=>window.clearTimeout(e)),Ed=new Set,Dd=new Map,wd=[],Q=null,bd=null,xd=null,Sd=null,Cd=null}var Wd={id:`badewanne`,name:`Badewanne`,accent:`#7ec8d8`,tileIcon:hd,mount:Md,unmount:Ud};ve();var Gd=[gt,It,on,An,Wn,vr,Wr,vi,Ni,aa,Qa,ss,js,Sc,ll,Ul,uu,Gu,md,Wd],Kd=document.querySelector(`#app`),qd=`
  <svg viewBox="0 0 96 96" width="40" height="40">
    <path d="M56 26 L34 48 L56 70" fill="none" stroke="#8a7255" stroke-width="8"
      stroke-linecap="round" stroke-linejoin="round"/>
  </svg>
`,Jd=18,Yd=2*Math.PI*Jd;Kd.innerHTML=`
  <div class="spielzimmer" id="spielzimmer">
    <div class="tiles" id="tiles"></div>
    <button class="eltern-gate" id="elternGate" aria-hidden="true">${`
  <svg viewBox="0 0 44 44">
    <circle cx="22" cy="22" r="${Jd}" fill="none" stroke="#8a7255" stroke-width="3" opacity="0.25"/>
    <circle class="eltern-gate-progress" cx="22" cy="22" r="${Jd}" fill="none"
      stroke="#8a7255" stroke-width="3" stroke-linecap="round"
      stroke-dasharray="${Yd}" stroke-dashoffset="${Yd}"
      transform="rotate(-90 22 22)"/>
    <circle cx="22" cy="22" r="4" fill="#8a7255"/>
  </svg>
`}</button>
  </div>
  <div class="toy-view" id="toyView">
    <div class="toy-stage" id="toyStage"></div>
  </div>
  <button class="back-button" id="backButton" aria-hidden="true">${qd}</button>
  <div class="eltern-overlay" id="elternOverlay">
    <div id="elternPanelWrap"></div>
  </div>
  <div class="version-placeholder">v1.4.0 · 7905f3f</div>
  <div class="nacht-dimmer" id="nachtDimmer"></div>
`;var Xd=document.querySelector(`#spielzimmer`),Zd=document.querySelector(`#tiles`),Qd=document.querySelector(`#toyView`),$d=document.querySelector(`#toyStage`),ef=document.querySelector(`#backButton`),tf=document.querySelector(`#elternGate`),nf=document.querySelector(`#elternOverlay`),rf=document.querySelector(`#elternPanelWrap`),af=null,of=!1;function sf(){let e=new Set(xe()),t=Gd.filter(t=>!e.has(t.id));return t.length>0?t:Gd}function cf(){Zd.innerHTML=``,sf().forEach((e,t)=>{let n=document.createElement(`button`);n.className=`tile`,n.style.setProperty(`--accent`,e.accent),n.style.animationDelay=`${(t*.7%4.5).toFixed(2)}s`,n.innerHTML=e.tileIcon,n.setAttribute(`aria-hidden`,`true`),n.addEventListener(`pointerdown`,t=>{t.preventDefault(),df(e)}),Zd.appendChild(n)}),lf()}function lf(){let e=Zd.childElementCount;if(e===0)return;let t=window.innerWidth,n=window.innerHeight,r=Math.min(t,n),i=Math.min(40,Math.max(12,r*.04)),a=Math.min(36,Math.max(14,r*.034)),o=t-2*i,s=n-2*i-36,c={cols:1,size:0};for(let t=1;t<=e;t++){let n=Math.ceil(e/t),r=Math.min((o-(t-1)*a)/t,(s-(n-1)*a)/n);r>c.size&&(c={cols:t,size:r})}let l=Math.max(72,Math.min(220,c.size));Zd.style.gridTemplateColumns=`repeat(${c.cols}, auto)`,Zd.style.setProperty(`--tile`,`${Math.floor(l)}px`),Zd.style.setProperty(`--tile-gap`,`${Math.floor(a)}px`)}window.addEventListener(`resize`,lf);function uf(){document.documentElement.classList.toggle(`nachtflug`,be())}function df(e){of||af||(of=!0,af=e,e.mount($d),Xd.classList.add(`hidden`),ef.classList.add(`visible`),Qd.classList.add(`active`),window.setTimeout(()=>{of=!1},450))}function ff(){of||!af||(of=!0,Qd.classList.remove(`active`),Xd.classList.remove(`hidden`),ef.classList.remove(`visible`),window.setTimeout(()=>{af?.unmount?.(),$d.innerHTML=``,af=null,of=!1},450))}var pf=150,mf=1200,hf=40,gf={id:-1,at:-1/0},_f={id:-1,at:-1/0},vf=null;document.addEventListener(`pointerdown`,e=>{vf&&e.pointerId!==vf.id&&(vf.valid=!1),gf=_f,_f={id:e.pointerId,at:e.timeStamp}},{capture:!0});function yf(){vf=null,ef.classList.remove(`gedrueckt`)}ef.addEventListener(`pointerdown`,e=>{e.preventDefault();let t=e.timeStamp,n=gf.id!==e.pointerId&&t-gf.at<pf,r=vf!==null;vf={id:e.pointerId,at:t,x:e.clientX,y:e.clientY,valid:!n&&!r},ef.classList.add(`gedrueckt`);try{ef.setPointerCapture(e.pointerId)}catch{}}),ef.addEventListener(`pointerup`,e=>{let t=vf;if(yf(),!t||t.id!==e.pointerId||!t.valid)return;let n=ef.getBoundingClientRect(),r=e.clientX>=n.left&&e.clientX<=n.right&&e.clientY>=n.top&&e.clientY<=n.bottom,i=e.timeStamp-t.at<mf,a=Math.hypot(e.clientX-t.x,e.clientY-t.y)<hf;r&&i&&a&&ff()}),ef.addEventListener(`pointercancel`,yf);var bf=3e3,xf=null;function Sf(){xf===null&&(tf.classList.add(`charging`),xf=window.setTimeout(()=>{xf=null,tf.classList.remove(`charging`),wf()},bf))}function Cf(){xf!==null&&(window.clearTimeout(xf),xf=null),tf.classList.remove(`charging`)}tf.addEventListener(`pointerdown`,e=>{e.preventDefault(),Sf()}),tf.addEventListener(`pointerup`,Cf),tf.addEventListener(`pointercancel`,Cf),tf.addEventListener(`pointerleave`,Cf);function wf(){Se(rf,{toys:Gd,onChange:()=>{uf(),cf()}}),nf.classList.add(`active`)}function Tf(){nf.classList.remove(`active`)}nf.addEventListener(`pointerdown`,e=>{e.target===nf&&Tf()}),document.addEventListener(`click`,e=>{e.target.closest(`.eltern-close`)&&Tf()}),document.addEventListener(`gesturestart`,e=>e.preventDefault()),document.addEventListener(`gesturechange`,e=>e.preventDefault()),document.addEventListener(`dblclick`,e=>e.preventDefault()),document.addEventListener(`contextmenu`,e=>e.preventDefault());var Ef=!1;document.addEventListener(`pointerdown`,()=>{s(),Ef||(Ef=!0,window.setTimeout(()=>{f()&&m({freq:523.25,duration:.15,gain:.25})},80))},{once:!1}),uf(),Me(),cf();