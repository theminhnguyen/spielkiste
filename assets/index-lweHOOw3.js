(function(){let e=document.createElement(`link`).relList;if(e&&e.supports&&e.supports(`modulepreload`))return;for(let e of document.querySelectorAll(`link[rel="modulepreload"]`))n(e);new MutationObserver(e=>{for(let t of e)if(t.type===`childList`)for(let e of t.addedNodes)e.tagName===`LINK`&&e.rel===`modulepreload`&&n(e)}).observe(document,{childList:!0,subtree:!0});function t(e){let t={};return e.integrity&&(t.integrity=e.integrity),e.referrerPolicy&&(t.referrerPolicy=e.referrerPolicy),t.credentials=e.crossOrigin===`use-credentials`?`include`:e.crossOrigin===`anonymous`?`omit`:`same-origin`,t}function n(e){if(e.ep)return;e.ep=!0;let n=t(e);fetch(e.href,n)}})();var e=null,t=null,n=!1,r=null,i=null;function a(){if(e)return e;try{let r=window.AudioContext??window.webkitAudioContext;return r?(e=new r,e.onstatechange=()=>{e?.state===`running`&&(n=!0)},t=e.createGain(),t.gain.value=u(),t.connect(e.destination),e):(i=`AudioContext wird vom Browser nicht unterstützt`,null)}catch(t){return i=t instanceof Error?t.message:String(t),e=null,null}}function o(){let e=new Uint8Array(45),t=new DataView(e.buffer),n=(e,n)=>{for(let r=0;r<n.length;r++)t.setUint8(e+r,n.charCodeAt(r))};n(0,`RIFF`),t.setUint32(4,37,!0),n(8,`WAVE`),n(12,`fmt `),t.setUint32(16,16,!0),t.setUint16(20,1,!0),t.setUint16(22,1,!0),t.setUint32(24,8e3,!0),t.setUint32(28,8e3,!0),t.setUint16(32,1,!0),t.setUint16(34,8,!0),n(36,`data`),t.setUint32(40,1,!0),t.setUint8(44,128);let r=``;return e.forEach(e=>r+=String.fromCharCode(e)),`data:audio/wav;base64,${btoa(r)}`}function s(){if(!n)try{let e=a();if(!e)return;e.state===`running`?n=!0:e.state===`closed`?i=`AudioContext im Zustand "${e.state}"`:e.resume().then(()=>{e.state===`running`&&(n=!0)}).catch(t=>{i=`resume() abgelehnt (Zustand war "${e.state}"): ${t instanceof Error?t.message:String(t)}`}),r||(r=new Audio(o()),r.volume=.01,r.setAttribute(`playsinline`,`true`));try{r.currentTime=0}catch{}r.play().catch(e=>{i=`stilles <audio> abgelehnt: ${e instanceof Error?e.message:String(e)}`})}catch(e){i=e instanceof Error?`${e.name}: ${e.message}`:String(e)}}function c(){let t=[];t.push(e?`Status: ${e.state}`:`Status: noch nicht gestartet`),t.push(n?`freigeschaltet: ja`:`freigeschaltet: nein`),t.push(`Lautstärke: ${Math.round(l*100)}%`);let r=!!(window.AudioContext??window.webkitAudioContext);return t.push(`AudioContext unterstützt: ${r?`ja`:`nein`}`),i&&t.push(`letzter Fehler: ${i}`),t.join(` · `)}var l=.6;function u(){return l}function d(e){l=Math.max(0,Math.min(1,e)),t&&(t.gain.value=l)}function f(){return!!e&&e.state===`running`}var p=[261.63,293.66,329.63,392,440,523.25,587.33,659.25];function m(n){let r=e;if(!r||!t||r.state!==`running`)return;let{freq:i,duration:a=.5,attack:o=.02,release:s=.35,type:c=`sine`,gain:l=.5}=n,u=r.createOscillator();u.type=c,u.frequency.value=i;let d=r.createGain();d.gain.setValueAtTime(0,r.currentTime),d.gain.linearRampToValueAtTime(l,r.currentTime+o),d.gain.linearRampToValueAtTime(0,r.currentTime+o+a+s),u.connect(d),d.connect(t),u.start(),u.stop(r.currentTime+o+a+s+.05)}function h(e=440){m({freq:e,duration:.03,attack:.002,release:.08,type:`triangle`,gain:.3})}function ee(n,r=.28){let i=e;if(!i||!t||i.state!==`running`)return null;let a=i.createOscillator();a.type=`sine`,a.frequency.value=n;let o=i.createGain();o.gain.setValueAtTime(0,i.currentTime),o.gain.linearRampToValueAtTime(r,i.currentTime+.05),a.connect(o),o.connect(t),a.start();let s=!1;return{update(e){s||a.frequency.linearRampToValueAtTime(e,i.currentTime+.06)},stop(){s||(s=!0,o.gain.cancelScheduledValues(i.currentTime),o.gain.setValueAtTime(o.gain.value,i.currentTime),o.gain.linearRampToValueAtTime(0,i.currentTime+.15),a.stop(i.currentTime+.2))}}}var te=null;function ne(e){if(te)return te;let t=e.sampleRate*.5,n=e.createBuffer(1,t,e.sampleRate),r=n.getChannelData(0);for(let e=0;e<t;e++)r[e]=Math.random()*2-1;return te=n,n}function re(n){let r=e;if(!r||!t||r.state!==`running`)return;let i=r.createBufferSource();i.buffer=ne(r);let a=r.createBiquadFilter();a.type=`bandpass`,a.Q.value=8;let o=n?700:2200,s=n?2200:700;a.frequency.setValueAtTime(o,r.currentTime),a.frequency.linearRampToValueAtTime(s,r.currentTime+.35);let c=r.createGain();c.gain.setValueAtTime(0,r.currentTime),c.gain.linearRampToValueAtTime(.18,r.currentTime+.03),c.gain.linearRampToValueAtTime(0,r.currentTime+.38),i.connect(a),a.connect(c),c.connect(t),i.start(),i.stop(r.currentTime+.4)}function ie(n,r=.4,i=.55){let a=e;if(!a||!t||a.state!==`running`)return;let o=a.currentTime,s=Math.max(.001,r),c=a.createOscillator();c.type=`sine`,c.frequency.setValueAtTime(n*2.2,o),c.frequency.exponentialRampToValueAtTime(n,o+.07);let l=a.createGain();l.gain.setValueAtTime(1e-4,o),l.gain.exponentialRampToValueAtTime(s,o+.006),l.gain.exponentialRampToValueAtTime(1e-4,o+i),c.connect(l),l.connect(t),c.start(o),c.stop(o+i+.05);let u=a.createOscillator();u.type=`triangle`,u.frequency.setValueAtTime(n*4,o),u.frequency.exponentialRampToValueAtTime(n*2,o+.05);let d=a.createGain();d.gain.setValueAtTime(1e-4,o),d.gain.exponentialRampToValueAtTime(s*.35,o+.005),d.gain.exponentialRampToValueAtTime(1e-4,o+i*.45),u.connect(d),d.connect(t),u.start(o),u.stop(o+i*.45+.05);let f=a.createBufferSource();f.buffer=ne(a);let p=a.createBiquadFilter();p.type=`lowpass`,p.frequency.value=900;let m=a.createGain();m.gain.setValueAtTime(s*.5,o),m.gain.exponentialRampToValueAtTime(1e-4,o+.08),f.connect(p),p.connect(m),m.connect(t),f.start(o,Math.random()*.3),f.stop(o+.1)}function ae(n,r=.25){let i=e;if(!i||!t||i.state!==`running`)return;let a=i.currentTime,o=i.createOscillator();o.type=`sine`,o.frequency.setValueAtTime(n*1.8,a),o.frequency.exponentialRampToValueAtTime(n,a+.04);let s=i.createGain();s.gain.setValueAtTime(1e-4,a),s.gain.exponentialRampToValueAtTime(Math.max(.001,r),a+.004),s.gain.exponentialRampToValueAtTime(1e-4,a+.22),o.connect(s),s.connect(t),o.start(a),o.stop(a+.26)}function oe(n=.15,r=.3){let i=e;if(!i||!t||i.state!==`running`)return;let a=i.currentTime,o=i.createBufferSource();o.buffer=ne(i);let s=i.createBiquadFilter();s.type=`highpass`,s.frequency.value=1800;let c=i.createBiquadFilter();c.type=`bandpass`,c.frequency.value=3e3+Math.random()*2e3,c.Q.value=.7;let l=i.createGain();l.gain.setValueAtTime(0,a);for(let e=0;e<8;e++){let t=a+r*e/8,i=1-e/8;l.gain.linearRampToValueAtTime(n*i*(.4+Math.random()*.6),t+.012)}l.gain.linearRampToValueAtTime(0,a+r+.04),o.connect(s),s.connect(c),c.connect(l),l.connect(t),o.start(a,Math.random()*Math.max(0,.5-r-.05)),o.stop(a+r+.06)}function se(n,r,i,a=.2,o=`sine`){let s=e;if(!s||!t||s.state!==`running`)return;let c=s.currentTime,l=s.createOscillator();l.type=o,l.frequency.setValueAtTime(n,c),l.frequency.exponentialRampToValueAtTime(r,c+i);let u=s.createGain();u.gain.setValueAtTime(1e-4,c),u.gain.exponentialRampToValueAtTime(Math.max(.001,a),c+Math.min(.03,i/3)),u.gain.exponentialRampToValueAtTime(1e-4,c+i+.08),l.connect(u),u.connect(t),l.start(c),l.stop(c+i+.12)}function ce(){return e&&e.state===`running`?e.currentTime:null}function le(n,r,i=.18){let a=e;if(!a||!t||a.state!==`running`)return;let o=Math.max(r,a.currentTime),s=Math.max(.001,i),c=a.createOscillator();c.type=`sine`,c.frequency.value=n;let l=a.createGain();l.gain.setValueAtTime(1e-4,o),l.gain.exponentialRampToValueAtTime(s,o+.004),l.gain.exponentialRampToValueAtTime(1e-4,o+1.4),c.connect(l),l.connect(t),c.start(o),c.stop(o+1.45);let u=a.createOscillator();u.type=`sine`,u.frequency.value=n*4.02;let d=a.createGain();d.gain.setValueAtTime(1e-4,o),d.gain.exponentialRampToValueAtTime(s*.25,o+.002),d.gain.exponentialRampToValueAtTime(1e-4,o+.18),u.connect(d),d.connect(t),u.start(o),u.stop(o+.2)}function g(){let n=e;if(!n||!t||n.state!==`running`)return;let r=n.createBufferSource();r.buffer=ne(n);let i=n.createBiquadFilter();i.type=`lowpass`,i.frequency.setValueAtTime(300,n.currentTime),i.frequency.linearRampToValueAtTime(1400,n.currentTime+.25);let a=n.createGain();a.gain.setValueAtTime(0,n.currentTime),a.gain.linearRampToValueAtTime(.14,n.currentTime+.05),a.gain.linearRampToValueAtTime(0,n.currentTime+.3),r.connect(i),i.connect(a),a.connect(t),r.start(),r.stop(n.currentTime+.32)}var ue=`spielkiste:`;function _(e,t,n){try{let r=localStorage.getItem(ue+e);if(!r)return n;let i=JSON.parse(r);return i.v===t?i.data:n}catch{return n}}function v(e,t,n){try{let r={v:t,data:n};localStorage.setItem(ue+e,JSON.stringify(r))}catch{}}function de(e=[]){try{let t=new Set(e.map(e=>ue+e)),n=[];for(let e=0;e<localStorage.length;e++){let r=localStorage.key(e);r?.startsWith(ue)&&!t.has(r)&&n.push(r)}n.forEach(e=>localStorage.removeItem(e))}catch{}}var fe=`settings`,pe=1,y={volume:.6};function me(){y=_(fe,pe,{volume:.6}),d(y.volume)}function he(){v(fe,pe,y)}function ge(){return y.nacht===!0}function _e(){return Array.isArray(y.versteckt)?y.versteckt:[]}function ve(e,t){let n=new Set(_e());e.innerHTML=`
    <div class="eltern-panel">
      <h1>Spielkiste</h1>
      <p class="eltern-version">Version 1.2.0 · aa78c6f</p>

      <section class="eltern-offline">
        <p class="eltern-offline-status">Prüfe Offline-Speicher …</p>
      </section>

      <label class="eltern-field">
        <span>Lautstärke</span>
        <input type="range" min="0" max="100" value="${Math.round(u()*100)}" class="eltern-volume" />
      </label>

      <label class="eltern-schalter">
        <input type="checkbox" class="eltern-nacht" ${ge()?`checked`:``} />
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
  `;let r=e.querySelector(`.eltern-volume`);r.addEventListener(`input`,()=>{d(Number(r.value)/100)}),r.addEventListener(`change`,()=>{y.volume=Number(r.value)/100,he(),h(500)});let i=e.querySelector(`.eltern-nacht`);i.addEventListener(`change`,()=>{y.nacht=i.checked,he(),t.onChange()});let a=e.querySelector(`.eltern-spiele-hinweis`);e.querySelectorAll(`.eltern-spiel`).forEach(e=>{e.addEventListener(`click`,()=>{let r=e.dataset.id;if(n.has(r))n.delete(r);else{if(t.toys.length-n.size<=1){a.hidden=!1;return}n.add(r)}a.hidden=!0,e.classList.toggle(`aus`,n.has(r)),y.versteckt=[...n],he(),t.onChange()})});let o=e.querySelector(`.eltern-offline-status`);ye().then(({ok:e,text:t})=>{o.textContent=t,o.classList.toggle(`ok`,e),o.classList.toggle(`fehlt`,!e)});let l=e.querySelector(`.eltern-audio-status`);function f(){l.textContent=c()}f(),window.setTimeout(f,400),e.querySelector(`.eltern-test-ton`).addEventListener(`click`,()=>{s(),m({freq:523.25,duration:.3,attack:.01,release:.3,gain:.4}),f(),window.setTimeout(f,400)});let p=e.querySelector(`.eltern-reset-btn`),ee=e.querySelector(`.eltern-reset-confirm`),te=e.querySelector(`.eltern-reset-cancel`),ne=e.querySelector(`.eltern-reset-confirm-btn`);p.addEventListener(`click`,()=>{p.hidden=!0,ee.hidden=!1}),te.addEventListener(`click`,()=>{ee.hidden=!0,p.hidden=!1}),ne.addEventListener(`click`,()=>{de([fe]),window.location.reload()})}async function ye(){let e=`Noch nicht offline bereit: App einmal mit Internet öffnen, ganz schließen und erneut öffnen — dann hier nachsehen.`;try{if(!(`serviceWorker`in navigator)||!(`caches`in window))return{ok:!1,text:`Dieser Browser kann die App nicht offline speichern. Bitte über Safari zum Home-Bildschirm hinzufügen.`};if(!navigator.serviceWorker.controller)return{ok:!1,text:e};let t=(await caches.keys()).find(e=>e.includes(`precache`));if(!t)return{ok:!1,text:e};let n=await caches.open(t),r=new Set((await n.keys()).map(e=>new URL(e.url).pathname));return[...[...document.querySelectorAll(`script[src]`)].map(e=>e.src),...[...document.querySelectorAll(`link[rel="stylesheet"]`)].map(e=>e.href),new URL(`index.html`,document.baseURI).href].map(e=>new URL(e).pathname).filter(e=>!r.has(e)).length>0?{ok:!1,text:e}:{ok:!0,text:`Bereit für offline ✓ — alle ${r.size} Dateien sind auf diesem Gerät gespeichert.`}}catch{return{ok:!1,text:e}}}var be=9e4,xe=5e3,Se=performance.now(),Ce=!1,we=new Set;function Te(e){e!==Ce&&(Ce=e,document.documentElement.classList.toggle(`ruhe`,e),we.forEach(t=>t(e)))}function Ee(){Se=performance.now(),Te(!1)}function De(e){return we.add(e),()=>we.delete(e)}function Oe(){document.addEventListener(`pointerdown`,Ee,{capture:!0}),window.setInterval(()=>{!Ce&&performance.now()-Se>be&&Te(!0)},xe)}var ke=`
<svg viewBox="0 0 120 120" width="100%" height="100%">
  <rect x="14" y="14" width="92" height="92" rx="18" fill="#fdf6ea" stroke="#e0a458" stroke-width="4"/>
  <circle cx="42" cy="46" r="10" fill="#e0a458"/>
  <rect x="66" y="38" width="34" height="14" rx="7" fill="#7fb99e"/>
  <circle cx="42" cy="80" r="12" fill="#e88a9a"/>
  <rect x="66" y="72" width="34" height="14" rx="7" fill="#f4a56b"/>
</svg>`,Ae=`brett`,je=2,Me={switchOn:!1,knobStep:0,sliderValue:.3,zipperOpen:!1,doorIndex:0,curtainOpen:!1,veloOpen:!1,beads:[.08,.28,.48,.68],kaleidoStep:0},Ne=[`<svg viewBox="0 0 100 100"><circle cx="50" cy="55" r="30" fill="#f2c9a0"/><circle cx="28" cy="30" r="14" fill="#f2c9a0"/><circle cx="72" cy="30" r="14" fill="#f2c9a0"/><circle cx="40" cy="52" r="4" fill="#4a4032"/><circle cx="60" cy="52" r="4" fill="#4a4032"/><ellipse cx="50" cy="64" rx="6" ry="4" fill="#e88a9a"/></svg>`,`<svg viewBox="0 0 100 100"><ellipse cx="50" cy="58" rx="26" ry="28" fill="#e8dfd0"/><ellipse cx="35" cy="20" rx="8" ry="18" fill="#e8dfd0"/><ellipse cx="65" cy="20" rx="8" ry="18" fill="#e8dfd0"/><circle cx="40" cy="55" r="4" fill="#4a4032"/><circle cx="60" cy="55" r="4" fill="#4a4032"/><ellipse cx="50" cy="66" rx="5" ry="3" fill="#e88a9a"/></svg>`,`<svg viewBox="0 0 100 100"><circle cx="50" cy="55" r="32" fill="#c9a37e"/><circle cx="22" cy="32" r="12" fill="#c9a37e"/><circle cx="78" cy="32" r="12" fill="#c9a37e"/><circle cx="40" cy="52" r="4" fill="#4a4032"/><circle cx="60" cy="52" r="4" fill="#4a4032"/><ellipse cx="50" cy="66" rx="8" ry="5" fill="#8a7255"/></svg>`],b={...Me},Pe=[],Fe=null,Ie=[],Le=0;function x(e,t,n){e.addEventListener(t,n),Pe.push(()=>e.removeEventListener(t,n))}function S(){v(Ae,je,b)}function Re(e){b=_(Ae,je,{...Me}),Pe=[],Fe=null,Ie=[],Le=0,e.innerHTML=`
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
            <div class="door-animal">${Ne[b.doorIndex%Ne.length]}</div>
            <div class="door-panel"></div>
          </div>
        </div>

        <div class="brett-mod brett-gears" data-mod="gears">
          <svg class="gear g-big" viewBox="0 0 100 100" width="66" height="66">${ze(`#7fb99e`)}</svg>
          <svg class="gear g-small" viewBox="0 0 100 100" width="44" height="44">${ze(`#e0a458`)}</svg>
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
            <div class="crank-pop">${Ne[0]}</div>
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
            ${b.beads.map((e,t)=>`<span class="bead b${t}" data-bead="${t}"></span>`).join(``)}
          </div>
        </div>
      </div>
    </div>
  `,Be(e),He(e),We(e),Ge(e),qe(e),Ye(e),Ze(e),$e(e),et(e),tt(e),rt(e),at(e),st(e),lt(e)}function ze(e){return`${Array.from({length:8},(t,n)=>`<rect x="44" y="2" width="12" height="18" rx="3" fill="${e}" transform="rotate(${n*360/8} 50 50)"/>`).join(``)}<circle cx="50" cy="50" r="34" fill="${e}"/><circle cx="50" cy="50" r="11" fill="#fffaf2"/>`}function Be(e){let t=e.querySelector(`.brett-switch`);Ve(t),x(t,`pointerdown`,e=>{e.preventDefault(),b.switchOn=!b.switchOn,Ve(t),m({freq:b.switchOn?440:330,duration:.05,attack:.002,release:.1,type:`square`,gain:.25}),S()})}function Ve(e){e.classList.toggle(`on`,b.switchOn)}function He(e){let t=e.querySelector(`.brett-knob`),n=t.querySelector(`.knob-dial`);Ue(n);let r=!1;function i(e,t){let r=n.getBoundingClientRect(),i=r.left+r.width/2,a=r.top+r.height/2,o=e-i,s=t-a,c=Math.atan2(s,o)*180/Math.PI+90;return c<0&&(c+=360),Math.round(c/45)%8}x(t,`pointerdown`,e=>{let n=e;n.preventDefault(),r=!0;try{t.setPointerCapture(n.pointerId)}catch{}o(n.clientX,n.clientY)}),x(t,`pointermove`,e=>{if(!r)return;let t=e;o(t.clientX,t.clientY)});function a(e){if(!r)return;r=!1;let n=e;if(n.pointerId!==void 0)try{t.releasePointerCapture(n.pointerId)}catch{}}x(t,`pointerup`,a),x(t,`pointercancel`,a);function o(e,t){let r=i(e,t);r!==b.knobStep&&(b.knobStep=r,Ue(n),m({freq:p[r%p.length],duration:.04,attack:.002,release:.08,type:`triangle`,gain:.25}),S())}}function Ue(e){e.style.transform=`rotate(${b.knobStep*45}deg)`}function We(e){e.querySelectorAll(`.press-btn`).forEach(e=>{x(e,`pointerdown`,t=>{t.preventDefault(),m({freq:p[Number(e.dataset.note??`0`)%p.length],duration:.3,gain:.4}),e.classList.add(`pressed`),window.setTimeout(()=>e.classList.remove(`pressed`),260)})})}function Ge(e){let t=e.querySelector(`.brett-slider`),n=t.querySelector(`.slider-track`),r=t.querySelector(`.slider-handle`),i=t.querySelector(`.slider-fill`);Ke(r,i);let a=!1;function o(e){let t=n.getBoundingClientRect(),r=(e-t.left)/t.width;return Math.max(0,Math.min(1,r))}function s(e){return 220*4**e}x(t,`pointerdown`,e=>{let n=e;n.preventDefault(),a=!0;try{t.setPointerCapture(n.pointerId)}catch{}b.sliderValue=o(n.clientX),Ke(r,i),Fe=ee(s(b.sliderValue))}),x(t,`pointermove`,e=>{a&&(b.sliderValue=o(e.clientX),Ke(r,i),Fe?.update(s(b.sliderValue)))});function c(e){if(!a)return;a=!1,Fe?.stop(),Fe=null;let n=e;if(n.pointerId!==void 0)try{t.releasePointerCapture(n.pointerId)}catch{}S()}x(t,`pointerup`,c),x(t,`pointercancel`,c)}function Ke(e,t){let n=b.sliderValue*100;e.style.left=`${n}%`,t.style.width=`${n}%`}function qe(e){let t=e.querySelector(`.brett-zipper`),n=t.querySelector(`.zipper-track`),r=t.querySelector(`.zipper-pull`);Je(t);let i=!1,a=0,o=0;x(t,`pointerdown`,e=>{let n=e;n.preventDefault(),i=!0,o=0,a=n.clientY;try{t.setPointerCapture(n.pointerId)}catch{}}),x(t,`pointermove`,e=>{if(!i)return;let t=e,s=n.getBoundingClientRect(),c=Math.max(0,Math.min(1,(t.clientY-s.top)/s.height));o+=Math.abs(t.clientY-a),a=t.clientY,r.style.top=`${c*100}%`});function s(e){if(!i)return;i=!1;let a=e;if(a.pointerId!==void 0)try{t.releasePointerCapture(a.pointerId)}catch{}let s=n.getBoundingClientRect(),c=r.getBoundingClientRect(),l=(c.top+c.height/2-s.top)/s.height,u=b.zipperOpen,d=o<6?!b.zipperOpen:l>.5;d!==u&&(b.zipperOpen=d,re(d),S()),Je(t)}x(t,`pointerup`,s),x(t,`pointercancel`,s)}function Je(e){e.classList.toggle(`open`,b.zipperOpen);let t=e.querySelector(`.zipper-pull`);t.style.top=b.zipperOpen?`100%`:`0%`}function Ye(e){let t=e.querySelector(`.brett-windmill`),n=t.querySelector(`.windmill-blades`);n.style.transform=`rotate(${Le}deg)`,x(t,`pointerdown`,e=>{e.preventDefault(),Xe(n)})}function Xe(e){Ie.forEach(e=>window.clearTimeout(e)),Ie=[];let t=3+Math.random()*2;Le+=t*360;let n=2200+Math.random()*400;e.style.transition=`transform ${n}ms cubic-bezier(0.13, 0.7, 0.25, 1)`,e.style.transform=`rotate(${Le}deg)`;for(let e=0;e<12;e++){let t=n*(1-(1-e/12)**2.2),r=window.setTimeout(()=>{m({freq:700,duration:.02,attack:.001,release:.04,type:`triangle`,gain:.12})},t);Ie.push(r)}}function Ze(e){let t=e.querySelector(`.brett-door`),n=t.querySelector(`.door-animal`);Qe(t),x(t,`pointerdown`,e=>{e.preventDefault();let r=!t.classList.contains(`open`);r&&(b.doorIndex=(b.doorIndex+1)%Ne.length,n.innerHTML=Ne[b.doorIndex],S()),t.classList.toggle(`open`,r),g()})}function Qe(e){e.classList.remove(`open`)}function $e(e){let t=e.querySelector(`.brett-gears`),n=t.querySelector(`.g-big`),r=t.querySelector(`.g-small`),i=!1,a=0,o=0,s=0;function c(e,n){let r=t.getBoundingClientRect();return Math.atan2(n-(r.top+r.height/2),e-(r.left+r.width/2))*180/Math.PI}function l(){n.style.transform=`rotate(${o}deg)`,r.style.transform=`rotate(${-o*1.5}deg)`}l(),x(t,`pointerdown`,e=>{let n=e;n.preventDefault(),i=!0,a=c(n.clientX,n.clientY);try{t.setPointerCapture(n.pointerId)}catch{}}),x(t,`pointermove`,e=>{if(!i)return;let t=e,n=c(t.clientX,t.clientY),r=n-a;r>180&&(r-=360),r<-180&&(r+=360),a=n,o+=r,l();let u=performance.now();Math.abs(r)>6&&u-s>90&&(s=u,m({freq:320,duration:.02,attack:.002,release:.05,type:`square`,gain:.1}))});function u(e){if(!i)return;i=!1;let n=e;try{t.releasePointerCapture(n.pointerId)}catch{}}x(t,`pointerup`,u),x(t,`pointercancel`,u)}function et(e){let t=e.querySelector(`.brett-bell`),n=t.querySelector(`.bell-body`);x(t,`pointerdown`,e=>{e.preventDefault(),n.classList.remove(`ring`),n.offsetWidth,n.classList.add(`ring`),m({freq:1046.5,duration:.5,attack:.004,release:.9,type:`sine`,gain:.22}),m({freq:1567.98,duration:.35,attack:.004,release:.7,type:`sine`,gain:.1})})}function tt(e){let t=e.querySelector(`.brett-curtain`);nt(t),x(t,`pointerdown`,e=>{e.preventDefault(),b.curtainOpen=!b.curtainOpen,nt(t),g(),S()})}function nt(e){e.classList.toggle(`open`,b.curtainOpen)}function rt(e){let t=e.querySelector(`.brett-crank`),n=t.querySelector(`.crank-handle`),r=t.querySelector(`.crank-pop`),i=!1,a=0,o=0,s=0,c=!1,l=0;function u(e,t){let r=n.getBoundingClientRect();return Math.atan2(t-(r.top+r.height/2),e-(r.left+r.width/2))*180/Math.PI}x(t,`pointerdown`,e=>{let n=e;if(n.preventDefault(),c){c=!1,s=0,t.classList.remove(`popped`);return}i=!0,a=u(n.clientX,n.clientY);try{t.setPointerCapture(n.pointerId)}catch{}}),x(t,`pointermove`,e=>{if(!i||c)return;let d=e,f=u(d.clientX,d.clientY),h=f-a;h>180&&(h-=360),h<-180&&(h+=360),a=f,o+=h,s+=Math.abs(h),n.style.transform=`rotate(${o}deg)`;let ee=performance.now();ee-l>120&&(l=ee,m({freq:p[Math.floor(s/45)%p.length],duration:.05,attack:.003,release:.1,type:`triangle`,gain:.16})),s>540&&(c=!0,i=!1,r.innerHTML=Ne[Math.floor(Math.random()*Ne.length)],t.classList.add(`popped`),m({freq:880,duration:.18,attack:.005,release:.3,type:`sine`,gain:.3}))});function d(e){if(!i)return;i=!1;let n=e;try{t.releasePointerCapture(n.pointerId)}catch{}}x(t,`pointerup`,d),x(t,`pointercancel`,d)}var it=[`#e88a9a`,`#7fb99e`,`#f4c86b`,`#7ea3c9`,`#e0a458`,`#c896d8`];function at(e){let t=e.querySelector(`.brett-kaleido`),n=t.querySelector(`.kaleido-disc`),r=t.querySelector(`.kaleido-petals`);ot(r),n.style.transform=`rotate(${b.kaleidoStep*30}deg)`,x(t,`pointerdown`,e=>{e.preventDefault(),b.kaleidoStep+=1,n.style.transform=`rotate(${b.kaleidoStep*30}deg)`,ot(r),m({freq:p[b.kaleidoStep%p.length],duration:.25,attack:.01,release:.4,type:`sine`,gain:.2}),S()})}function ot(e){let t=b.kaleidoStep,n=``;for(let e=0;e<6;e++){let r=it[(t+e)%it.length],i=it[(t*2+e+3)%it.length];n+=`<g transform="rotate(${e*60})">
      <ellipse cx="0" cy="-24" rx="9" ry="16" fill="${r}" opacity="0.85"/>
      <circle cx="0" cy="-38" r="5" fill="${i}"/>
    </g>`}e.innerHTML=n}function st(e){let t=e.querySelector(`.brett-velcro`);ct(t),x(t,`pointerdown`,e=>{e.preventDefault(),b.veloOpen=!b.veloOpen,ct(t),re(b.veloOpen),S()})}function ct(e){e.classList.toggle(`open`,b.veloOpen)}function lt(e){let t=e.querySelector(`.brett-beads`),n=t.querySelector(`.beads-wire`),r=[...t.querySelectorAll(`.bead`)];r.forEach((e,t)=>{e.style.left=`${b.beads[t]*100}%`});let i=new Map;x(n,`pointerdown`,e=>{let t=e,r=t.target.closest(`.bead`);if(!r)return;t.preventDefault();let a=Number(r.dataset.bead);i.set(t.pointerId,a);try{n.setPointerCapture(t.pointerId)}catch{}}),x(n,`pointermove`,e=>{let t=e,a=i.get(t.pointerId);if(a===void 0)return;let o=n.getBoundingClientRect(),s=Math.max(.02,Math.min(.94,(t.clientX-o.left)/o.width)),c=b.beads[a];b.beads[a]=s,r[a].style.left=`${s*100}%`,Math.abs(s-c)>.04&&m({freq:p[a%p.length]*2,duration:.03,attack:.002,release:.07,type:`triangle`,gain:.12})});function a(e){let t=e;if(i.has(t.pointerId)){i.delete(t.pointerId);try{n.releasePointerCapture(t.pointerId)}catch{}S()}}x(n,`pointerup`,a),x(n,`pointercancel`,a)}function ut(){Pe.forEach(e=>e()),Pe=[],Fe?.stop(),Fe=null,Ie.forEach(e=>window.clearTimeout(e)),Ie=[]}var dt={id:`brett`,name:`Fummelbrett`,accent:`#e0a458`,tileIcon:ke,mount:Re,unmount:ut},ft=`
<svg viewBox="0 0 120 120" width="100%" height="100%">
  <circle cx="45" cy="45" r="24" fill="#e88a9a"/>
  <circle cx="78" cy="55" r="20" fill="#7fb99e"/>
  <circle cx="55" cy="82" r="18" fill="#f4c86b"/>
</svg>`,pt=[{id:0,color:`#e88a9a`,note:0,xPct:22,yPct:30,radiusPx:58},{id:1,color:`#7fb99e`,note:1,xPct:50,yPct:22,radiusPx:62},{id:2,color:`#f4c86b`,note:2,xPct:78,yPct:32,radiusPx:56},{id:3,color:`#7ea3c9`,note:3,xPct:30,yPct:68,radiusPx:60},{id:4,color:`#e0a458`,note:4,xPct:58,yPct:74,radiusPx:58},{id:5,color:`#c896d8`,note:5,xPct:80,yPct:66,radiusPx:54}],C=null,mt=[],ht=[],gt=new Set,_t=null;function vt(e,t,n){e.addEventListener(t,n),ht.push(()=>e.removeEventListener(t,n))}function yt(e,t,n){return Math.max(t,Math.min(n,e))}function bt(e){ht=[],gt=new Set,e.innerHTML=`
    <div class="kleckse-stage" id="kleckseStage">
      ${pt.map(e=>`
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
  `,C=e.querySelector(`#kleckseStage`),mt=pt.map(t=>({def:t,el:e.querySelector(`.klecks[data-id="${t.id}"]`),xPct:t.xPct,yPct:t.yPct,grabbed:!1,lastX:0,lastY:0,lastT:0})),mt.forEach(e=>{xt(e),St(e)}),_t=new ResizeObserver(()=>{mt.forEach(e=>{e.grabbed||xt(e)})}),_t.observe(C)}function xt(e,t=1,n=1){if(!C)return;let r=e.xPct/100*C.clientWidth-e.def.radiusPx,i=e.yPct/100*C.clientHeight-e.def.radiusPx;e.el.style.transform=`translate(${r.toFixed(1)}px, ${i.toFixed(1)}px) scale(${t.toFixed(3)}, ${n.toFixed(3)})`}function St(e){let t=e.el;vt(t,`pointerdown`,n=>{let r=n;r.preventDefault();try{t.setPointerCapture(r.pointerId)}catch{}e.grabbed=!0,e.lastX=r.clientX,e.lastY=r.clientY,e.lastT=performance.now(),t.classList.add(`grabbed`),m({freq:p[e.def.note%p.length],duration:.35,gain:.35}),wt(e,1.18),Tt(e)}),vt(t,`pointermove`,t=>{if(!e.grabbed||!C)return;let n=t,r=C.getBoundingClientRect(),i=performance.now(),a=Math.max(1,i-e.lastT),o=(n.clientX-e.lastX)/a,s=(n.clientY-e.lastY)/a;e.lastX=n.clientX,e.lastY=n.clientY,e.lastT=i,e.xPct=yt((n.clientX-r.left)/r.width*100,6,94),e.yPct=yt((n.clientY-r.top)/r.height*100,8,92),Ct(e,o,s),Ot(e)});function n(n){if(!e.grabbed)return;e.grabbed=!1,t.classList.remove(`grabbed`);let r=n;if(r.pointerId!==void 0)try{t.releasePointerCapture(r.pointerId)}catch{}xt(e,1,1)}vt(t,`pointerup`,n),vt(t,`pointercancel`,n)}function Ct(e,t,n){let r=Math.min(Math.hypot(t,n)*6,.28),i=Math.atan2(n,t);xt(e,1+r*Math.abs(Math.cos(i)),1-r*Math.abs(Math.cos(i))*.6+r*Math.abs(Math.sin(i))*.1)}function wt(e,t){xt(e,t,t),window.setTimeout(()=>{e.el.classList.contains(`grabbed`)||xt(e,1,1)},160)}function Tt(e){e.el.classList.remove(`singt`),e.el.offsetWidth,e.el.classList.add(`singt`),window.setTimeout(()=>e.el.classList.remove(`singt`),300)}function Et(e){e.el.classList.remove(`funkt`),e.el.offsetWidth,e.el.classList.add(`funkt`),window.setTimeout(()=>e.el.classList.remove(`funkt`),420)}function Dt(e,t){return e<t?`${e}-${t}`:`${t}-${e}`}function Ot(e){if(!C)return;let t=C.getBoundingClientRect(),n=e.xPct/100*t.width,r=e.yPct/100*t.height;for(let i of mt){if(i.def.id===e.def.id)continue;let a=i.xPct/100*t.width,o=i.yPct/100*t.height,s=Math.hypot(n-a,r-o),c=e.def.radiusPx*.75+i.def.radiusPx*.75,l=Dt(e.def.id,i.def.id);s<c?gt.has(l)||(gt.add(l),m({freq:p[e.def.note%p.length],duration:.25,gain:.22}),m({freq:p[i.def.note%p.length],duration:.25,gain:.22}),wt(i,1.1),Et(e),Et(i)):gt.delete(l)}}function kt(){ht.forEach(e=>e()),ht=[],_t?.disconnect(),_t=null,mt=[],C=null,gt=new Set}var At={id:`kleckse`,name:`Klang-Kleckse`,accent:`#e88a9a`,tileIcon:ft,mount:bt,unmount:kt},jt=`
<svg viewBox="0 0 120 120" width="100%" height="100%">
  <path d="M30 90 L80 30 L95 45 L45 95 Z" fill="#fdf6ea" stroke="#7ea3c9" stroke-width="4" stroke-linejoin="round"/>
  <circle cx="34" cy="92" r="10" fill="#7ea3c9"/>
  <circle cx="70" cy="40" r="8" fill="#e88a9a"/>
</svg>`,Mt=[`#e88a9a`,`#7fb99e`,`#f4c86b`,`#7ea3c9`,`#e0a458`,`#6b5d4a`],Nt=`malen`,Pt=1,w=null,T=null,E=null,Ft=Mt[0],It=!1,Lt=0,Rt=0,zt=[],Bt=null,Vt=null;function Ht(e,t,n){e.addEventListener(t,n),zt.push(()=>e.removeEventListener(t,n))}function Ut(e){zt=[],It=!1,Ft=Mt[0],e.innerHTML=`
    <div class="malen-stage" id="malenStage">
      <canvas class="malen-canvas" id="malenCanvas"></canvas>
      <div class="malen-palette" id="malenPalette">
        ${Mt.map((e,t)=>`<button class="malen-swatch${t===0?` selected`:``}" data-color="${e}" style="--swatch-color:${e}" aria-hidden="true"></button>`).join(``)}
      </div>
      <button class="malen-new-sheet" id="malenNewSheet" aria-hidden="true">
        <svg viewBox="0 0 48 48" width="30" height="30">
          <path d="M10 6 h20 l8 8 v28 h-28 z" fill="#fffaf2" stroke="#8a7255" stroke-width="2.5" stroke-linejoin="round"/>
          <path d="M30 6 v8 h8" fill="none" stroke="#8a7255" stroke-width="2.5" stroke-linejoin="round"/>
        </svg>
      </button>
    </div>
  `,E=e.querySelector(`#malenStage`),w=e.querySelector(`#malenCanvas`),T=w.getContext(`2d`),Wt(),Gt(),Ht(w,`pointerdown`,Jt),Ht(w,`pointermove`,Yt),Ht(w,`pointerup`,Xt),Ht(w,`pointercancel`,Xt);let t=e.querySelectorAll(`.malen-swatch`);t.forEach(e=>{Ht(e,`pointerdown`,n=>{n.preventDefault(),Ft=e.dataset.color??Mt[0],t.forEach(e=>e.classList.remove(`selected`)),e.classList.add(`selected`),h(500)})}),Ht(e.querySelector(`#malenNewSheet`),`pointerdown`,e=>{e.preventDefault(),Zt()});let n=E.clientWidth,r=E.clientHeight,i=()=>{if(!E)return;let e=E.clientWidth,t=E.clientHeight;(e!==n||t!==r)&&(n=e,r=t,Bt!==null&&window.clearTimeout(Bt),Bt=window.setTimeout(()=>{Wt(),Gt()},200))};Vt=new ResizeObserver(i),Vt.observe(E),Ht(window,`resize`,i),Ht(window,`orientationchange`,i)}function Wt(){if(!w||!E)return;let e=Math.min(window.devicePixelRatio||1,2),t={width:E.clientWidth,height:E.clientHeight};w.width=Math.round(t.width*e),w.height=Math.round(t.height*e),w.style.width=`${t.width}px`,w.style.height=`${t.height}px`,T=w.getContext(`2d`),T&&(T.scale(e,e),T.lineCap=`round`,T.lineJoin=`round`,T.lineWidth=22)}function Gt(){let e=_(Nt,Pt,{dataUrl:null});if(!e.dataUrl||!w||!T)return;let t=new Image;t.onload=()=>{if(!T||!w)return;let e=Math.min(window.devicePixelRatio||1,2);T.drawImage(t,0,0,w.width/e,w.height/e)},t.src=e.dataUrl}function Kt(){if(w)try{v(Nt,Pt,{dataUrl:w.toDataURL(`image/png`)})}catch{}}function qt(e){let t=w,n=t.getBoundingClientRect(),r=n.width===0?1:t.clientWidth/n.width,i=n.height===0?1:t.clientHeight/n.height;return{x:(e.clientX-n.left)*r,y:(e.clientY-n.top)*i}}function Jt(e){let t=e;if(t.preventDefault(),!w||!T)return;try{w.setPointerCapture(t.pointerId)}catch{}It=!0;let{x:n,y:r}=qt(t);Lt=n,Rt=r,T.strokeStyle=Ft,T.fillStyle=Ft,T.beginPath(),T.arc(n,r,T.lineWidth/2,0,Math.PI*2),T.fill()}function Yt(e){if(!It||!T)return;let{x:t,y:n}=qt(e);T.beginPath(),T.moveTo(Lt,Rt),T.lineTo(t,n),T.stroke(),Lt=t,Rt=n}function Xt(e){if(!It)return;It=!1;let t=e;if(w&&t.pointerId!==void 0)try{w.releasePointerCapture(t.pointerId)}catch{}Kt()}function Zt(){if(!w||!T||!E)return;let e=w.toDataURL(`image/png`),t=document.createElement(`img`);t.src=e,t.className=`malen-crumple-overlay`,t.style.width=w.style.width,t.style.height=w.style.height,E.appendChild(t);let n=Math.min(window.devicePixelRatio||1,2);T.clearRect(0,0,w.width/n,w.height/n),v(Nt,Pt,{dataUrl:null}),h(300),t.offsetWidth,t.classList.add(`crumpling`),window.setTimeout(()=>{t.remove()},550)}function Qt(){zt.forEach(e=>e()),zt=[],Vt?.disconnect(),Vt=null,Bt!==null&&(window.clearTimeout(Bt),Bt=null),w=null,T=null,E=null}var $t={id:`malen`,name:`Malen`,accent:`#7ea3c9`,tileIcon:jt,mount:Ut,unmount:Qt},en=`
<svg viewBox="0 0 120 120" width="100%" height="100%">
  <rect x="14" y="50" width="92" height="56" rx="12" fill="#e0a458" stroke="#a9835e" stroke-width="3"/>
  <ellipse cx="45" cy="58" rx="14" ry="8" fill="#6b5544"/>
  <rect x="68" y="52" width="24" height="14" rx="4" fill="#6b5544"/>
  <circle cx="30" cy="30" r="14" fill="#e88a9a"/>
  <rect x="60" y="18" width="26" height="26" rx="6" fill="#7fb99e"/>
</svg>`,tn=[{id:`kreis`,color:`#e88a9a`,note:0,restX:14,restY:80,path:`<circle cx="50" cy="50" r="42"/>`,svg:`<svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="42" fill="#e88a9a"/><circle cx="38" cy="46" r="5" fill="#4a4032"/><circle cx="62" cy="46" r="5" fill="#4a4032"/><path d="M38 60 Q50 68 62 60" stroke="#4a4032" stroke-width="3" fill="none" stroke-linecap="round"/></svg>`},{id:`quadrat`,color:`#7fb99e`,note:2,restX:33,restY:88,path:`<rect x="8" y="8" width="84" height="84" rx="16"/>`,svg:`<svg viewBox="0 0 100 100"><rect x="8" y="8" width="84" height="84" rx="16" fill="#7fb99e"/><circle cx="38" cy="46" r="5" fill="#4a4032"/><circle cx="62" cy="46" r="5" fill="#4a4032"/><path d="M38 60 Q50 68 62 60" stroke="#4a4032" stroke-width="3" fill="none" stroke-linecap="round"/></svg>`},{id:`dreieck`,color:`#f4c86b`,note:4,restX:52,restY:80,path:`<path d="M50 10 L92 88 L8 88 Z" stroke-linejoin="round"/>`,svg:`<svg viewBox="0 0 100 100"><path d="M50 10 L92 88 L8 88 Z" fill="#f4c86b" stroke-linejoin="round"/><circle cx="40" cy="66" r="4.5" fill="#4a4032"/><circle cx="60" cy="66" r="4.5" fill="#4a4032"/><path d="M40 76 Q50 82 60 76" stroke="#4a4032" stroke-width="3" fill="none" stroke-linecap="round"/></svg>`},{id:`stern`,color:`#7ea3c9`,note:5,restX:71,restY:88,path:`<path d="M50 6 L62 37 L96 37 L68 57 L79 90 L50 70 L21 90 L32 57 L4 37 L38 37 Z"/>`,svg:`<svg viewBox="0 0 100 100"><path d="M50 6 L62 37 L96 37 L68 57 L79 90 L50 70 L21 90 L32 57 L4 37 L38 37 Z" fill="#7ea3c9"/><circle cx="42" cy="48" r="4" fill="#4a4032"/><circle cx="58" cy="48" r="4" fill="#4a4032"/><path d="M42 58 Q50 63 58 58" stroke="#4a4032" stroke-width="2.5" fill="none" stroke-linecap="round"/></svg>`},{id:`herz`,color:`#c896d8`,note:7,restX:88,restY:78,path:`<path d="M50 92 C20 67 4 46 4 28 C4 12 17 2 32 2 C42 2 48 9 50 16 C52 9 58 2 68 2 C83 2 96 12 96 28 C96 46 80 67 50 92 Z"/>`,svg:`<svg viewBox="0 0 100 100"><path d="M50 92 C20 67 4 46 4 28 C4 12 17 2 32 2 C42 2 48 9 50 16 C52 9 58 2 68 2 C83 2 96 12 96 28 C96 46 80 67 50 92 Z" fill="#c896d8"/><circle cx="40" cy="34" r="4.5" fill="#4a4032"/><circle cx="60" cy="34" r="4.5" fill="#4a4032"/><path d="M40 44 Q50 50 60 44" stroke="#4a4032" stroke-width="3" fill="none" stroke-linecap="round"/></svg>`}],nn=`sortierer`,rn=1;function an(){return tn.map(e=>({id:e.id,xPct:e.restX,yPct:e.restY,placed:!1}))}var on={shapes:an()},D=null,sn=[],cn=null,ln=new Map;function un(e,t,n){e.addEventListener(t,n),sn.push(()=>e.removeEventListener(t,n))}function dn(e){return on.shapes.find(t=>t.id===e)??{id:e,xPct:50,yPct:80,placed:!1}}function fn(){v(nn,rn,on)}function pn(e){sn=[],ln=new Map;let t=_(nn,rn,{shapes:an()});on={shapes:tn.map(e=>t.shapes.find(t=>t.id===e.id)??{id:e.id,xPct:e.restX,yPct:e.restY,placed:!1})},e.innerHTML=`
    <div class="sorter-stage">
      <div class="sorter-box">
        ${tn.map(e=>`
          <div class="sorter-hole" data-hole="${e.id}">
            <svg class="hole-cut" viewBox="0 0 100 100">${e.path}</svg>
            <div class="hole-fuellung" data-fill="${e.id}" style="--fill-color:${e.color}">${e.svg}</div>
          </div>
        `).join(``)}
      </div>
      <div class="sorter-boden" id="sorterBoden">
        ${tn.map(e=>`
          <div class="sorter-form" data-shape="${e.id}">
            <div class="sorter-form-fx">${e.svg}</div>
          </div>
        `).join(``)}
      </div>
    </div>
  `,D=e.querySelector(`.sorter-stage`),tn.forEach(t=>{let n=e.querySelector(`.sorter-form[data-shape="${t.id}"]`),r=e.querySelector(`.sorter-hole[data-hole="${t.id}"]`),i=e.querySelector(`.hole-fuellung[data-fill="${t.id}"]`);ln.set(t.id,n),gn(t.id,i),hn(t.id),_n(t,n),vn(t,r,n,i)}),cn=new ResizeObserver(()=>{tn.forEach(e=>{(!mn||mn!==e.id)&&hn(e.id)})}),cn.observe(D)}var mn=null;function hn(e,t=0,n=0){let r=ln.get(e);if(!r||!D)return;let i=dn(e),a=r.offsetWidth/2,o=r.offsetHeight/2,s=i.xPct/100*D.clientWidth-a+t,c=i.yPct/100*D.clientHeight-o+n;r.style.transform=`translate(${s.toFixed(1)}px, ${c.toFixed(1)}px)`}function gn(e,t){let n=dn(e);ln.get(e)?.classList.toggle(`versteckt`,n.placed),t.classList.toggle(`gefuellt`,n.placed)}function _n(e,t){let n=!1,r=0,i=0,a=0;un(t,`pointerdown`,o=>{let s=o;if(s.preventDefault(),!dn(e.id).placed){n=!0,mn=e.id,r=0,i=s.clientX,a=s.clientY,t.classList.add(`greift`);try{t.setPointerCapture(s.pointerId)}catch{}}}),un(t,`pointermove`,t=>{if(!n||!D)return;let o=t,s=o.clientX-i,c=o.clientY-a;r=Math.max(r,Math.hypot(s,c)),hn(e.id,s,c)});let o=i=>{if(!n)return;n=!1,mn=null;let a=i;t.classList.remove(`greift`);try{t.releasePointerCapture(a.pointerId)}catch{}if(r<6){hn(e.id),xn(t),h(420),fn();return}if(D){let t=D.getBoundingClientRect(),n=dn(e.id);n.xPct=Sn((a.clientX-t.left)/t.width*100,3,97),n.yPct=Sn((a.clientY-t.top)/t.height*100,3,97)}hn(e.id);let o=D?.querySelector(`.sorter-hole[data-hole="${e.id}"]`);if(o&&D){let t=o.getBoundingClientRect(),n=t.left+t.width/2,r=t.top+t.height/2;if(Math.hypot(a.clientX-n,a.clientY-r)<60){let t=D.querySelector(`.hole-fuellung[data-fill="${e.id}"]`),n=dn(e.id);n.placed=!0,gn(e.id,t),yn(t,e.note),fn();return}}fn()};un(t,`pointerup`,o),un(t,`pointercancel`,o)}function vn(e,t,n,r){un(t,`pointerdown`,t=>{let i=dn(e.id);i.placed&&(t.preventDefault(),i.placed=!1,i.xPct=e.restX,i.yPct=e.restY,gn(e.id,r),hn(e.id),bn(n),m({freq:p[e.note%p.length]*1.5,duration:.18,attack:.005,release:.25,type:`triangle`,gain:.24}),fn())})}function yn(e,t){e.classList.remove(`plumpst`),e.offsetWidth,e.classList.add(`plumpst`),m({freq:p[t%p.length],duration:.22,attack:.004,release:.3,type:`sine`,gain:.32}),window.setTimeout(()=>e.classList.remove(`plumpst`),400)}function bn(e){let t=e.querySelector(`.sorter-form-fx`);t&&(t.classList.remove(`huepft`),t.offsetWidth,t.classList.add(`huepft`),window.setTimeout(()=>t.classList.remove(`huepft`),500))}function xn(e){let t=e.querySelector(`.sorter-form-fx`);t&&(t.classList.remove(`wackelt`),t.offsetWidth,t.classList.add(`wackelt`),window.setTimeout(()=>t.classList.remove(`wackelt`),400))}function Sn(e,t,n){return Math.max(t,Math.min(n,e))}function Cn(){sn.forEach(e=>e()),sn=[],cn?.disconnect(),cn=null,ln=new Map,D=null,mn=null,on={shapes:an()}}var wn={id:`sortierer`,name:`Formen-Sortierer`,accent:`#e0a458`,tileIcon:en,mount:pn,unmount:Cn},Tn=`
<svg viewBox="0 0 120 120" width="100%" height="100%">
  <circle cx="48" cy="46" r="26" fill="none" stroke="#7ec8d8" stroke-width="5"/>
  <circle cx="40" cy="38" r="7" fill="#bfe6ee"/>
  <circle cx="84" cy="72" r="17" fill="none" stroke="#a8d8e0" stroke-width="4"/>
  <circle cx="79" cy="67" r="5" fill="#d6f0f5"/>
  <circle cx="42" cy="90" r="11" fill="none" stroke="#c8b6e0" stroke-width="4"/>
</svg>`,En=[`rgba(126, 200, 216, 0.55)`,`rgba(200, 182, 224, 0.55)`,`rgba(244, 200, 107, 0.45)`,`rgba(232, 138, 154, 0.45)`,`rgba(127, 185, 158, 0.5)`],Dn=14,On=900,kn=null,An=[],jn=null,Mn=[];function Nn(e,t,n){e.addEventListener(t,n),An.push(()=>e.removeEventListener(t,n))}function Pn(e){An=[],Mn=[],e.innerHTML=`
    <div class="blasen-stage" id="blasenStage">
      <div class="blasen-layer" id="blasenLayer"></div>
      <div class="blasen-wand" id="blasenWand">
        <div class="wand-ring"></div>
        <div class="wand-stick"></div>
      </div>
    </div>
  `,kn=e.querySelector(`#blasenLayer`);let t=e.querySelector(`#blasenWand`);for(let e=0;e<6;e++)Fn(.3+Math.random()*.5);let n=()=>{jn!==null&&window.clearInterval(jn),jn=null},r=()=>{n(),jn=window.setInterval(()=>Fn(),On)};r(),An.push(n),An.push(De(e=>e?n():r())),Nn(kn,`pointerdown`,e=>{let t=e,n=t.target.closest(`.blase`);n&&(t.preventDefault(),In(n))}),Nn(t,`pointerdown`,e=>{e.preventDefault(),t.classList.remove(`puff`),t.offsetWidth,t.classList.add(`puff`);for(let e=0;e<5;e++)window.setTimeout(()=>Fn(0,!0),e*110);m({freq:220,duration:.28,attack:.06,release:.35,type:`sine`,gain:.12})})}function Fn(e=0,t=!1){if(!kn||kn.childElementCount>=Dn)return;let n=42+Math.random()*58,r=En[Math.floor(Math.random()*En.length)],i=t?14+Math.random()*16:6+Math.random()*88,a=(Math.random()*2-1)*40,o=9e3+Math.random()*5e3,s=document.createElement(`div`);s.className=`blase`,s.style.width=`${n}px`,s.style.height=`${n}px`,s.style.left=`${i}%`,s.style.setProperty(`--tint`,r),s.style.setProperty(`--drift`,`${a}px`),s.style.animationDuration=`${o}ms`,s.style.animationDelay=`${-e*o}ms`,s.innerHTML=`<span class="blase-glanz"></span>`,s.addEventListener(`animationend`,()=>s.remove()),kn.appendChild(s)}function In(e){if(e.classList.contains(`platzt`))return;e.classList.add(`platzt`);let t=p[Math.floor(Math.random()*p.length)];m({freq:t*2,duration:.06,attack:.002,release:.16,type:`sine`,gain:.22});let n=window.setTimeout(()=>e.remove(),340);Mn.push(n)}function Ln(){An.forEach(e=>e()),An=[],jn!==null&&(window.clearInterval(jn),jn=null),Mn.forEach(e=>window.clearTimeout(e)),Mn=[],kn=null}var Rn={id:`blasen`,name:`Seifenblasen`,accent:`#7ec8d8`,tileIcon:Tn,mount:Pn,unmount:Ln},zn=`
<svg viewBox="0 0 120 120" width="100%" height="100%">
  <rect x="22" y="30" width="76" height="58" rx="10" fill="#cbb98a"/>
  <rect x="30" y="38" width="60" height="42" rx="6" fill="#bfe6ee"/>
  <path d="M34 74 L54 46" stroke="#fffaf2" stroke-width="9" stroke-linecap="round"/>
  <path d="M52 76 L70 52" stroke="#fffaf2" stroke-width="7" stroke-linecap="round"/>
  <circle cx="84" cy="92" r="13" fill="#7ec8d8"/>
</svg>`,Bn=[{clean:`<svg viewBox="0 0 200 200">
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
    </svg>`,dirt:`#7d6b52`,fleck:`#5f5040`}],Vn=34,Hn=.82,O=null,k=null,A=null,Un=0,Wn=!1,Gn=[],Kn=null,qn=null,Jn=[],Yn=new Map;function Xn(e,t,n){e.addEventListener(t,n),Gn.push(()=>e.removeEventListener(t,n))}function Zn(e){Gn=[],Yn.clear(),Jn=[],Un=0,Wn=!1,e.innerHTML=`
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
  `,A=e.querySelector(`#putzenStage`),O=e.querySelector(`#putzenCanvas`),Qn(e,0),Xn(O,`pointerdown`,nr),Xn(O,`pointermove`,rr),Xn(O,`pointerup`,ir),Xn(O,`pointercancel`,ir),Xn(e.querySelector(`#putzenNext`),`pointerdown`,t=>{t.preventDefault(),Qn(e,Un+1),g()});let t=A.clientWidth,n=A.clientHeight,r=()=>{if(!A)return;let e=A.clientWidth,r=A.clientHeight;(e!==t||r!==n)&&(t=e,n=r,Kn!==null&&window.clearTimeout(Kn),Kn=window.setTimeout(()=>$n(),220))};qn=new ResizeObserver(r),qn.observe(A),Xn(window,`resize`,r),Xn(window,`orientationchange`,r)}function Qn(e,t){Un=(t%Bn.length+Bn.length)%Bn.length,Wn=!1,A?.classList.remove(`sauber`);let n=e.querySelector(`#putzenMotiv`);n.innerHTML=Bn[Un].clean,$n()}function $n(){if(!O||!A)return;let e=Math.min(window.devicePixelRatio||1,2),t=A.clientWidth,n=A.clientHeight;O.width=Math.round(t*e),O.height=Math.round(n*e),O.style.width=`${t}px`,O.style.height=`${n}px`,k=O.getContext(`2d`,{willReadFrequently:!0}),k&&(k.scale(e,e),er(t,n))}function er(e,t){if(!k)return;let n=Bn[Un];k.globalCompositeOperation=`source-over`,k.clearRect(0,0,e,t),k.fillStyle=n.dirt,k.fillRect(0,0,e,t),k.fillStyle=n.fleck;for(let n=0;n<140;n++){let n=Math.random()*e,r=Math.random()*t,i=6+Math.random()*26;k.globalAlpha=.18+Math.random()*.3,k.beginPath(),k.ellipse(n,r,i,i*(.6+Math.random()*.7),Math.random()*Math.PI,0,Math.PI*2),k.fill()}k.globalAlpha=1}function tr(e){let t=O,n=t.getBoundingClientRect(),r=n.width===0?1:t.clientWidth/n.width,i=n.height===0?1:t.clientHeight/n.height;return{x:(e.clientX-n.left)*r,y:(e.clientY-n.top)*i}}function nr(e){let t=e;if(t.preventDefault(),!O||!k)return;try{O.setPointerCapture(t.pointerId)}catch{}let n=tr(t);Yn.set(t.pointerId,n),ar(n.x,n.y),cr()}function rr(e){let t=e,n=Yn.get(t.pointerId);if(!n||!k)return;let r=tr(t);or(n.x,n.y,r.x,r.y),Yn.set(t.pointerId,r),cr()}function ir(e){let t=e;if(Yn.has(t.pointerId)){if(Yn.delete(t.pointerId),O)try{O.releasePointerCapture(t.pointerId)}catch{}ur()}}function ar(e,t){k&&(k.globalCompositeOperation=`destination-out`,k.beginPath(),k.arc(e,t,Vn,0,Math.PI*2),k.fill())}function or(e,t,n,r){k&&(k.globalCompositeOperation=`destination-out`,k.lineCap=`round`,k.lineJoin=`round`,k.lineWidth=68,k.beginPath(),k.moveTo(e,t),k.lineTo(n,r),k.stroke())}var sr=0;function cr(){let e=performance.now();e-sr<130||(sr=e,m({freq:180+Math.random()*90,duration:.05,attack:.01,release:.1,type:`triangle`,gain:.07}))}function lr(){if(!O||!k)return 0;let e=0,t=0,n=O.width/24,r=O.height/24;for(let i=0;i<24;i++)for(let a=0;a<24;a++){let o=Math.min(O.width-1,Math.floor(i*n+n/2)),s=Math.min(O.height-1,Math.floor(a*r+r/2));k.getImageData(o,s,1,1).data[3]<40&&e++,t++}return t===0?0:e/t}function ur(){if(!Wn&&!(lr()<Hn)){if(Wn=!0,k&&O){let e=Math.min(window.devicePixelRatio||1,2);k.globalCompositeOperation=`destination-out`,k.fillStyle=`#000`,k.fillRect(0,0,O.width/e,O.height/e)}A?.classList.add(`sauber`),[0,130,260].forEach((e,t)=>{let n=window.setTimeout(()=>{m({freq:p[t+3],duration:.3,attack:.01,release:.5,gain:.24})},e);Jn.push(n)})}}function dr(){Gn.forEach(e=>e()),Gn=[],qn?.disconnect(),qn=null,Kn!==null&&(window.clearTimeout(Kn),Kn=null),Jn.forEach(e=>window.clearTimeout(e)),Jn=[],Yn.clear(),O=null,k=null,A=null}var fr={id:`putzen`,name:`Putzen`,accent:`#7ec8d8`,tileIcon:zn,mount:Zn,unmount:dr},pr=`
<svg viewBox="0 0 120 120" width="100%" height="100%">
  <rect x="16" y="22" width="88" height="66" rx="10" fill="#dff0e4"/>
  <path d="M16 72 Q40 54 62 72 Q82 56 104 72 L104 88 H16 Z" fill="#9ec99f"/>
  <circle cx="86" cy="40" r="12" fill="#f7d570"/>
  <ellipse cx="46" cy="60" rx="13" ry="11" fill="#e88a9a"/>
  <circle cx="42" cy="57" r="2.5" fill="#4a4032"/>
  <circle cx="50" cy="57" r="2.5" fill="#4a4032"/>
  <path d="M74 92 l7 -13 l7 13 z" fill="#7fb99e"/>
</svg>`,mr=[{id:`hase`,size:106,note:0,svg:`<svg viewBox="0 0 100 100"><ellipse cx="50" cy="64" rx="26" ry="28" fill="#f3e7db"/><ellipse cx="38" cy="24" rx="8" ry="20" fill="#f3e7db"/><ellipse cx="62" cy="24" rx="8" ry="20" fill="#f3e7db"/><ellipse cx="38" cy="26" rx="4" ry="13" fill="#f2b8c6"/><ellipse cx="62" cy="26" rx="4" ry="13" fill="#f2b8c6"/><circle cx="41" cy="60" r="4" fill="#4a4032"/><circle cx="59" cy="60" r="4" fill="#4a4032"/><ellipse cx="50" cy="70" rx="5" ry="3.5" fill="#e88a9a"/></svg>`},{id:`baum`,size:125,note:1,svg:`<svg viewBox="0 0 100 100"><rect x="43" y="58" width="14" height="36" rx="5" fill="#a9835e"/><circle cx="50" cy="40" r="28" fill="#7fb99e"/><circle cx="30" cy="50" r="18" fill="#8fc4a8"/><circle cx="70" cy="50" r="18" fill="#8fc4a8"/></svg>`},{id:`blume`,size:94,note:2,svg:`<svg viewBox="0 0 100 100"><rect x="46" y="52" width="8" height="42" rx="4" fill="#7fb99e"/><ellipse cx="30" cy="62" rx="14" ry="7" fill="#8fc4a8"/><g><ellipse cx="50" cy="26" rx="11" ry="17" fill="#e88a9a"/><ellipse cx="50" cy="26" rx="11" ry="17" fill="#e88a9a" transform="rotate(72 50 40)"/><ellipse cx="50" cy="26" rx="11" ry="17" fill="#e88a9a" transform="rotate(144 50 40)"/><ellipse cx="50" cy="26" rx="11" ry="17" fill="#e88a9a" transform="rotate(216 50 40)"/><ellipse cx="50" cy="26" rx="11" ry="17" fill="#e88a9a" transform="rotate(288 50 40)"/></g><circle cx="50" cy="40" r="10" fill="#f4c86b"/></svg>`},{id:`sonne`,size:101,note:3,svg:`<svg viewBox="0 0 100 100"><g stroke="#f4c86b" stroke-width="7" stroke-linecap="round"><line x1="50" y1="8" x2="50" y2="20"/><line x1="50" y1="80" x2="50" y2="92"/><line x1="8" y1="50" x2="20" y2="50"/><line x1="80" y1="50" x2="92" y2="50"/><line x1="20" y1="20" x2="28" y2="28"/><line x1="72" y1="72" x2="80" y2="80"/><line x1="20" y1="80" x2="28" y2="72"/><line x1="72" y1="28" x2="80" y2="20"/></g><circle cx="50" cy="50" r="24" fill="#f7d570"/><circle cx="42" cy="46" r="3" fill="#c99a3c"/><circle cx="58" cy="46" r="3" fill="#c99a3c"/><path d="M43 56 Q50 62 57 56" stroke="#c99a3c" stroke-width="3" fill="none" stroke-linecap="round"/></svg>`},{id:`wolke`,size:120,note:4,svg:`<svg viewBox="0 0 100 100"><g fill="#fffaf2" stroke="#bcd6e0" stroke-width="3"><ellipse cx="38" cy="58" rx="22" ry="18"/><ellipse cx="62" cy="58" rx="20" ry="16"/><ellipse cx="50" cy="46" rx="20" ry="18"/></g></svg>`},{id:`vogel`,size:91,note:5,svg:`<svg viewBox="0 0 100 100"><ellipse cx="52" cy="56" rx="24" ry="19" fill="#7ea3c9"/><circle cx="34" cy="44" r="14" fill="#8fb3d4"/><path d="M22 44 l-12 5 l12 5 z" fill="#f4a56b"/><circle cx="31" cy="41" r="3" fill="#4a4032"/><path d="M56 52 q14 -8 22 2 q-12 8 -22 -2z" fill="#6b93bd"/><path d="M70 66 l14 8" stroke="#f4a56b" stroke-width="5" stroke-linecap="round"/></svg>`},{id:`pilz`,size:88,note:6,svg:`<svg viewBox="0 0 100 100"><rect x="40" y="52" width="20" height="38" rx="8" fill="#f3e7db"/><path d="M14 54 a36 30 0 0 1 72 0 z" fill="#e88a9a"/><circle cx="36" cy="40" r="7" fill="#fffaf2"/><circle cx="62" cy="34" r="5" fill="#fffaf2"/><circle cx="54" cy="48" r="4" fill="#fffaf2"/></svg>`},{id:`stern`,size:81,note:7,svg:`<svg viewBox="0 0 100 100"><path d="M50 8 L61 38 L93 38 L67 57 L77 88 L50 69 L23 88 L33 57 L7 38 L39 38 Z" fill="#f4c86b"/></svg>`}],hr=`sticker`,gr=1,_r=60,j=[],vr=null,M=null,yr=null,br=[],xr=null,Sr=null;function Cr(e,t,n){e.addEventListener(t,n),br.push(()=>e.removeEventListener(t,n))}function wr(e){return mr.find(t=>t.id===e)??mr[0]}function Tr(){v(hr,gr,{placed:j})}function Er(e){br=[],j=_(hr,gr,{placed:[]}).placed,e.innerHTML=`
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
        ${mr.map(e=>`<div class="tray-item" data-art="${e.id}" style="width:${e.size*.62}px;height:${e.size*.62}px">${e.svg}</div>`).join(``)}
      </div>
    </div>
  `,vr=e.querySelector(`#stickerStage`),M=e.querySelector(`#stickerSzene`),yr=e.querySelector(`#stickerTray`),Or(),Ar(e),yr.querySelectorAll(`.tray-item`).forEach(e=>{Cr(e,`pointerdown`,t=>Pr(t,e))}),xr=new ResizeObserver(()=>{let e=document.getElementById(`stickerPlatziert`);e&&e.querySelectorAll(`.sticker`).forEach(e=>{let t=Number(e.dataset.index);if(t===Sr)return;let n=j[t];n&&Dr(e,n.xPct,n.yPct)})}),xr.observe(M)}function Dr(e,t,n){M&&(e.style.setProperty(`--tx`,`${(t/100*M.clientWidth).toFixed(1)}px`),e.style.setProperty(`--ty`,`${(n/100*M.clientHeight).toFixed(1)}px`))}function Or(){let e=document.getElementById(`stickerPlatziert`);e&&(e.innerHTML=``,j.forEach((t,n)=>{let r=wr(t.art),i=document.createElement(`div`);i.className=`sticker`,i.dataset.index=String(n),i.style.width=`${r.size}px`,i.style.height=`${r.size}px`,Dr(i,t.xPct,t.yPct),i.style.setProperty(`--rot`,`${t.rot}deg`),i.innerHTML=r.svg,e.appendChild(i),kr(i,n)}))}function kr(e,t){let n=!1,r=0,i=0,a=0;e.addEventListener(`pointerdown`,o=>{o.preventDefault(),o.stopPropagation(),n=!0,Sr=t,r=0,i=o.clientX,a=o.clientY,e.classList.add(`greift`);try{e.setPointerCapture(o.pointerId)}catch{}}),e.addEventListener(`pointermove`,o=>{if(!n||!M)return;r=Math.max(r,Math.hypot(o.clientX-i,o.clientY-a));let s=M.getBoundingClientRect(),c=j[t];c&&(c.xPct=Nr((o.clientX-s.left)/s.width*100,2,98),c.yPct=Nr((o.clientY-s.top)/s.height*100,2,98),Dr(e,c.xPct,c.yPct))});let o=i=>{if(n){n=!1,Sr=null,e.classList.remove(`greift`);try{e.releasePointerCapture(i.pointerId)}catch{}if(yr&&Mr(i.clientX,i.clientY)){j.splice(t,1),Tr(),Or(),h(300);return}r<10&&(e.classList.remove(`wackelt`),e.offsetWidth,e.classList.add(`wackelt`),m({freq:p[wr(j[t]?.art??mr[0].id).note%p.length],duration:.3,gain:.28})),Tr()}};e.addEventListener(`pointerup`,o),e.addEventListener(`pointercancel`,o)}function Ar(e){Cr(e.querySelector(`#stickerClear`),`pointerdown`,e=>{e.preventDefault(),j.length!==0&&jr()})}function jr(){let e=document.getElementById(`stickerPlatziert`);if(!e)return;let t=[...e.querySelectorAll(`.sticker`)];t.forEach((e,t)=>{e.style.transitionDelay=`${Math.min(t*25,500)}ms`,e.offsetWidth,e.classList.add(`wegfegen`)}),g(),window.setTimeout(()=>{j=[],Tr(),Or()},500+Math.min(t.length*25,500))}function Mr(e,t){if(!yr)return!1;let n=yr.getBoundingClientRect();return e>=n.left&&e<=n.right&&t>=n.top&&t<=n.bottom}function Nr(e,t,n){return Math.max(t,Math.min(n,e))}function Pr(e,t){if(e.preventDefault(),!vr)return;let n=wr(t.dataset.art??``);try{t.setPointerCapture(e.pointerId)}catch{}let r=document.createElement(`div`);r.className=`sticker-ghost`,r.style.width=`${n.size}px`,r.style.height=`${n.size}px`,r.innerHTML=n.svg,vr.appendChild(r);let i=(e,t)=>{let n=vr.getBoundingClientRect();r.style.setProperty(`--tx`,`${(e-n.left).toFixed(1)}px`),r.style.setProperty(`--ty`,`${(t-n.top).toFixed(1)}px`)};i(e.clientX,e.clientY),h(560);let a=!1;function o(e){let t=e;i(t.clientX,t.clientY)}function s(e){if(a)return;a=!0;let i=e;try{t.releasePointerCapture(i.pointerId)}catch{}t.removeEventListener(`pointermove`,o),t.removeEventListener(`pointerup`,s),t.removeEventListener(`pointercancel`,s),r.remove(),Fr(n,i.clientX,i.clientY)}t.addEventListener(`pointermove`,o),t.addEventListener(`pointerup`,s),t.addEventListener(`pointercancel`,s)}function Fr(e,t,n){if(!M||Mr(t,n))return;let r=M.getBoundingClientRect();n>r.bottom||n<r.top||(j.length>=_r&&j.shift(),j.push({art:e.id,xPct:Nr((t-r.left)/r.width*100,2,98),yPct:Nr((n-r.top)/r.height*100,2,98),rot:Math.round((Math.random()*2-1)*9)}),Tr(),Or(),m({freq:p[e.note%p.length],duration:.28,gain:.3}))}function Ir(){br.forEach(e=>e()),br=[],xr?.disconnect(),xr=null,Sr=null,j=[],vr=null,M=null,yr=null}var Lr={id:`sticker`,name:`Sticker-Szene`,accent:`#9ec99f`,tileIcon:pr,mount:Er,unmount:Ir},Rr=`
<svg viewBox="0 0 120 120" width="100%" height="100%">
  <circle cx="94" cy="26" r="14" fill="#f7d570"/>
  <path d="M20 100 L20 60 L46 38 L72 60 L72 100 Z" fill="#f3e7db" stroke="#c9a37e" stroke-width="3"/>
  <path d="M14 62 L46 34 L78 62 Z" fill="#e88a9a"/>
  <rect x="38" y="76" width="16" height="24" rx="2" fill="#a9835e"/>
  <circle cx="30" cy="10" r="8" fill="#9ec99f" opacity="0.7"/>
</svg>`,zr=`wimmelbild`,Br=1,Vr={tuerOffen:!1,vorhangOffen:!1,flaggeOben:!1},N={...Vr},Hr=[],Ur=[],P=new Set;function Wr(e,t,n){e.addEventListener(t,n),Hr.push(()=>e.removeEventListener(t,n))}function Gr(){v(zr,Br,N)}function Kr(e,t){let n=window.setTimeout(e,t);Ur.push(n)}function F(e,t,n){let r=e.querySelector(t),i=t;Wr(r,`pointerdown`,e=>{e.preventDefault(),!P.has(i)&&(P.add(i),r.classList.remove(n.className),r.offsetWidth,r.classList.add(n.className),n.onTrigger?.(r),n.sound?.(),Kr(()=>{r.classList.remove(n.className),P.delete(i)},n.duration))})}function qr(e){N=_(zr,Br,{...Vr}),Hr=[],Ur=[],P=new Set,e.innerHTML=`
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
  `,Jr(e),Yr(e),Xr(e),Zr(e),Qr(e),$r(e),ei(e),ti(e),ni(e),ri(e),ii(e),ai(e),oi(e),si(e)}function Jr(e){F(e,`.w-sonne`,{className:`strahlt`,duration:700,sound:()=>{m({freq:1046.5,duration:.35,attack:.01,release:.5,type:`sine`,gain:.22}),m({freq:1567.98,duration:.25,attack:.01,release:.4,type:`sine`,gain:.1})}})}function Yr(e){F(e,`.w-wolke`,{className:`zieht-vorbei`,duration:2400,sound:()=>g()})}function Xr(e){F(e,`.w-schornstein`,{className:`pufft`,duration:1400,sound:()=>m({freq:260,duration:.15,attack:.01,release:.3,type:`sine`,gain:.16})})}function Zr(e){let t=e.querySelector(`.w-tuer`);t.classList.toggle(`offen`,N.tuerOffen),Wr(t,`pointerdown`,e=>{e.preventDefault(),N.tuerOffen=!N.tuerOffen,t.classList.toggle(`offen`,N.tuerOffen),g(),N.tuerOffen&&(m({freq:587.33,duration:.12,attack:.005,release:.15,type:`triangle`,gain:.2}),Kr(()=>m({freq:493.88,duration:.18,attack:.005,release:.25,type:`triangle`,gain:.2}),130)),Gr()})}function Qr(e){let t=e.querySelector(`.w-fenster`);t.classList.toggle(`offen`,N.vorhangOffen),Wr(t,`pointerdown`,e=>{e.preventDefault(),N.vorhangOffen=!N.vorhangOffen,t.classList.toggle(`offen`,N.vorhangOffen),g(),Gr()})}function $r(e){F(e,`.w-apfel`,{className:`faellt`,duration:900,sound:()=>m({freq:220,duration:.09,attack:.004,release:.14,type:`sine`,gain:.28})})}function ei(e){F(e,`.w-vogelhaus`,{className:`fliegt`,duration:1600,sound:()=>{[0,90,180].forEach((e,t)=>{Kr(()=>m({freq:p[(4+t)%p.length],duration:.14,attack:.005,release:.2,type:`triangle`,gain:.22}),e)})}})}function ti(e){let t=e.querySelector(`.w-schaukel`),n=t.querySelector(`.schaukel-sitz`),r=`schaukel`;Wr(t,`pointerdown`,e=>{e.preventDefault(),!P.has(r)&&(P.add(r),n.classList.remove(`schwingt`),n.offsetWidth,n.classList.add(`schwingt`),[0,350,700,1050].forEach(e=>{Kr(()=>m({freq:380,duration:.05,attack:.005,release:.1,type:`sine`,gain:.1}),e)}),Kr(()=>{n.classList.remove(`schwingt`),P.delete(r)},2200))})}function ni(e){F(e,`.w-biene`,{className:`summt`,duration:1300,sound:()=>m({freq:660,duration:.5,attack:.02,release:.4,type:`sawtooth`,gain:.06})})}function ri(e){F(e,`.w-maulwurfshuegel`,{className:`guckt`,duration:1200,sound:()=>m({freq:180,duration:.12,attack:.005,release:.2,type:`sine`,gain:.24})})}function ii(e){let t=e.querySelector(`.w-briefkasten`);t.classList.toggle(`offen`,N.flaggeOben),Wr(t,`pointerdown`,e=>{e.preventDefault(),N.flaggeOben=!N.flaggeOben,t.classList.toggle(`offen`,N.flaggeOben),h(N.flaggeOben?700:500),Gr()})}function ai(e){F(e,`.w-frosch`,{className:`huepft`,duration:700,sound:()=>m({freq:200,duration:.1,attack:.004,release:.16,type:`square`,gain:.18})})}function oi(e){F(e,`.w-schnecke`,{className:`streckt`,duration:900,sound:()=>h(520)})}function si(e){F(e,`.w-marienkaefer`,{className:`fliegt-los`,duration:1100,sound:()=>m({freq:900,duration:.3,attack:.02,release:.3,type:`sawtooth`,gain:.05})})}function ci(){Hr.forEach(e=>e()),Hr=[],Ur.forEach(e=>window.clearTimeout(e)),Ur=[],P=new Set}var li={id:`wimmelbild`,name:`Wimmelbild`,accent:`#9ec99f`,tileIcon:Rr,mount:qr,unmount:ci},ui=`
<svg viewBox="0 0 120 120" width="100%" height="100%">
  <path d="M78 20 a34 34 0 1 0 22 56 a26 26 0 1 1 -22 -56 Z" fill="#7ea3c9"/>
  <path d="M32 34 l4 10 l10 4 l-10 4 l-4 10 l-4 -10 l-10 -4 l10 -4 Z" fill="#f4c86b"/>
  <rect x="14" y="86" width="46" height="20" rx="6" fill="#e0a458"/>
  <circle cx="26" cy="86" r="8" fill="#f3e7db"/>
</svg>`,di=[{id:`baer`,bettFarbe:`#e0a458`,wach:`<svg viewBox="0 0 100 100"><circle cx="50" cy="58" r="30" fill="#c9a37e"/><circle cx="24" cy="34" r="12" fill="#c9a37e"/><circle cx="76" cy="34" r="12" fill="#c9a37e"/><circle cx="40" cy="56" r="4" fill="#4a4032"/><circle cx="60" cy="56" r="4" fill="#4a4032"/><ellipse cx="50" cy="68" rx="8" ry="5" fill="#8a7255"/></svg>`,schlaeft:`<svg viewBox="0 0 100 100"><circle cx="50" cy="58" r="30" fill="#c9a37e"/><circle cx="24" cy="34" r="12" fill="#c9a37e"/><circle cx="76" cy="34" r="12" fill="#c9a37e"/><path d="M34 56 q6 5 12 0" stroke="#4a4032" stroke-width="3" fill="none" stroke-linecap="round"/><path d="M54 56 q6 5 12 0" stroke="#4a4032" stroke-width="3" fill="none" stroke-linecap="round"/><ellipse cx="50" cy="68" rx="8" ry="5" fill="#8a7255"/></svg>`},{id:`hase`,bettFarbe:`#e88a9a`,wach:`<svg viewBox="0 0 100 100"><ellipse cx="50" cy="62" rx="26" ry="26" fill="#f3e7db"/><ellipse cx="38" cy="24" rx="8" ry="20" fill="#f3e7db"/><ellipse cx="62" cy="24" rx="8" ry="20" fill="#f3e7db"/><ellipse cx="38" cy="26" rx="4" ry="13" fill="#f2b8c6"/><ellipse cx="62" cy="26" rx="4" ry="13" fill="#f2b8c6"/><circle cx="41" cy="58" r="4" fill="#4a4032"/><circle cx="59" cy="58" r="4" fill="#4a4032"/><ellipse cx="50" cy="68" rx="5" ry="3.5" fill="#e88a9a"/></svg>`,schlaeft:`<svg viewBox="0 0 100 100"><ellipse cx="50" cy="62" rx="26" ry="26" fill="#f3e7db"/><ellipse cx="38" cy="24" rx="8" ry="20" fill="#f3e7db"/><ellipse cx="62" cy="24" rx="8" ry="20" fill="#f3e7db"/><ellipse cx="38" cy="26" rx="4" ry="13" fill="#f2b8c6"/><ellipse cx="62" cy="26" rx="4" ry="13" fill="#f2b8c6"/><path d="M35 58 q6 5 12 0" stroke="#4a4032" stroke-width="3" fill="none" stroke-linecap="round"/><path d="M53 58 q6 5 12 0" stroke="#4a4032" stroke-width="3" fill="none" stroke-linecap="round"/><ellipse cx="50" cy="68" rx="5" ry="3.5" fill="#e88a9a"/></svg>`},{id:`katze`,bettFarbe:`#7ea3c9`,wach:`<svg viewBox="0 0 100 100"><ellipse cx="50" cy="60" rx="26" ry="24" fill="#e0a458"/><path d="M26 46 L20 18 L46 40 Z" fill="#e0a458"/><path d="M74 46 L80 18 L54 40 Z" fill="#e0a458"/><path d="M28 42 L24 24 L40 38 Z" fill="#f2b8c6"/><path d="M72 42 L76 24 L60 38 Z" fill="#f2b8c6"/><circle cx="40" cy="58" r="4" fill="#4a4032"/><circle cx="60" cy="58" r="4" fill="#4a4032"/><path d="M42 68 Q50 73 58 68" stroke="#8a5a2e" stroke-width="2.5" fill="none" stroke-linecap="round"/></svg>`,schlaeft:`<svg viewBox="0 0 100 100"><ellipse cx="50" cy="60" rx="26" ry="24" fill="#e0a458"/><path d="M26 46 L20 18 L46 40 Z" fill="#e0a458"/><path d="M74 46 L80 18 L54 40 Z" fill="#e0a458"/><path d="M28 42 L24 24 L40 38 Z" fill="#f2b8c6"/><path d="M72 42 L76 24 L60 38 Z" fill="#f2b8c6"/><path d="M34 58 q6 5 12 0" stroke="#4a4032" stroke-width="3" fill="none" stroke-linecap="round"/><path d="M54 58 q6 5 12 0" stroke="#4a4032" stroke-width="3" fill="none" stroke-linecap="round"/><path d="M42 68 Q50 71 58 68" stroke="#8a5a2e" stroke-width="2.5" fill="none" stroke-linecap="round"/></svg>`}],fi=`gutenacht`,pi=1,mi={lampeAn:!0,schlaeft:[!1,!1,!1]},I={...mi},hi=[],gi=[];function _i(e,t){let n=window.setTimeout(e,t);gi.push(n)}function vi(e,t,n){e.addEventListener(t,n),hi.push(()=>e.removeEventListener(t,n))}function yi(){v(fi,pi,I)}function bi(e){I=_(fi,pi,{...mi,schlaeft:[...mi.schlaeft]}),hi=[],e.innerHTML=`
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
          ${di.map((e,t)=>`
            <div class="n-bett${I.schlaeft[t]?` schlaeft`:``}" style="--bett-farbe:${e.bettFarbe}">
              <div class="bett-rahmen"></div>
              <div class="n-tier${I.schlaeft[t]?` schlaeft`:``}" data-item="tier${t}" data-idx="${t}">
                <div class="tier-wach">${e.wach}</div>
                <div class="tier-schlaeft">${e.schlaeft}</div>
              </div>
              <div class="n-decke"></div>
            </div>
          `).join(``)}
        </div>
      </div>
    </div>
  `;let t=e.querySelector(`#nachtSzene`);t.classList.toggle(`dunkel`,!I.lampeAn),xi(e,t),Si(e)}function xi(e,t){vi(e.querySelector(`.n-lampe`),`pointerdown`,e=>{e.preventDefault(),I.lampeAn=!I.lampeAn,t.classList.toggle(`dunkel`,!I.lampeAn),m({freq:I.lampeAn?480:320,duration:.18,attack:.01,release:.3,type:`sine`,gain:.18}),yi()})}function Si(e){e.querySelectorAll(`.n-tier`).forEach(e=>{let t=Number(e.dataset.idx);vi(e,`pointerdown`,n=>{n.preventDefault();let r=!I.schlaeft[t];I.schlaeft[t]=r,e.classList.toggle(`schlaeft`,r),e.closest(`.n-bett`)?.classList.toggle(`schlaeft`,r),r?(g(),m({freq:392,duration:.2,attack:.01,release:.4,type:`sine`,gain:.16}),_i(()=>{m({freq:294,duration:.3,attack:.01,release:.5,type:`sine`,gain:.14})},220)):(m({freq:440,duration:.1,attack:.005,release:.2,type:`triangle`,gain:.2}),_i(()=>{m({freq:587.33,duration:.16,attack:.005,release:.25,type:`triangle`,gain:.2})},110)),yi()})})}function Ci(){hi.forEach(e=>e()),hi=[],gi.forEach(e=>window.clearTimeout(e)),gi=[],I={...mi,schlaeft:[...mi.schlaeft]}}var wi={id:`gutenacht`,name:`Gute-Nacht-Szene`,accent:`#7ea3c9`,tileIcon:ui,mount:bi,unmount:Ci},Ti=`
<svg viewBox="0 0 120 120" width="100%" height="100%">
  <path d="M14 58 V86 A26 9 0 0 0 66 86 V58 Z" fill="#e88a9a"/>
  <ellipse cx="40" cy="58" rx="26" ry="9" fill="#fdf6ea" stroke="#c96f7e" stroke-width="3"/>
  <path d="M60 40 V70 A23 8 0 0 0 106 70 V40 Z" fill="#7ea3c9"/>
  <ellipse cx="83" cy="40" rx="23" ry="8" fill="#fdf6ea" stroke="#5f86ad" stroke-width="3"/>
  <circle cx="36" cy="22" r="4" fill="#f4c86b"/>
  <circle cx="52" cy="30" r="3" fill="#7fb99e"/>
  <circle cx="86" cy="16" r="3.5" fill="#e88a9a"/>
</svg>`,Ei=[{id:0,freq:98,decay:.8,size:1,body:`#e88a9a`,rim:`#c96f7e`},{id:1,freq:130.81,decay:.65,size:.95,body:`#7ea3c9`,rim:`#5f86ad`},{id:2,freq:164.81,decay:.55,size:.9,body:`#7fb99e`,rim:`#5f9a80`},{id:3,freq:196,decay:.45,size:.86,body:`#f4c86b`,rim:`#d4a64a`}],Di=[`#e88a9a`,`#7ea3c9`,`#7fb99e`,`#f4c86b`,`#c896d8`,`#e0a458`],Oi=90,ki=6,Ai=40,ji=null,Mi=[],Ni=[],Pi=new Set,Fi=0,Ii=0,Li=new Map;function Ri(e,t,n){e.addEventListener(t,n),Ni.push(()=>e.removeEventListener(t,n))}function zi(e,t){let n=window.setTimeout(()=>{Pi.delete(n),e()},t);return Pi.add(n),n}function Bi(e){let t=[];for(let e=0;e<=8;e++){let n=18+e*20.5;t.push(`${n.toFixed(1)},${e%2==0?78:140}`)}return`
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
    </svg>`}function Vi(e){Ni=[],Pi=new Set,Fi=0,Ii=0,Li=new Map,e.innerHTML=`
    <div class="trommel-stage" id="trommelStage">
      <div class="trommel-raster">
        ${Ei.map(e=>`
          <div class="trommel-zelle" data-id="${e.id}">
            <div class="trommel" style="--groesse:${e.size}">
              <div class="trommel-wackel">${Bi(e)}</div>
            </div>
            <div class="trommel-punkte"></div>
          </div>`).join(``)}
      </div>
    </div>
  `,ji=e.querySelector(`#trommelStage`),Mi=Ei.map(t=>{let n=e.querySelector(`.trommel-zelle[data-id="${t.id}"]`);return{def:t,cell:n,drum:n.querySelector(`.trommel`),punkte:n.querySelector(`.trommel-punkte`),lastHitAt:-1/0,combo:0,bummTimer:null}}),Ri(ji,`pointerdown`,e=>{let t=e;t.preventDefault();try{ji?.setPointerCapture(t.pointerId)}catch{}let n=Ui(t.clientX,t.clientY);n&&(Li.set(t.pointerId,n.def.id),Gi(n))}),Ri(ji,`pointermove`,e=>{let t=e;if(!Li.has(t.pointerId))return;let n=Wi(t.clientX,t.clientY),r=n?n.def.id:-1;r!==Li.get(t.pointerId)&&(Li.set(t.pointerId,r),n&&Gi(n))});let t=e=>{let t=e;Li.delete(t.pointerId)};Ri(ji,`pointerup`,t),Ri(ji,`pointercancel`,t)}function Hi(e){let t=e.cell.getBoundingClientRect();return{x:t.left+t.width/2,y:t.top+t.height/2,r:e.drum.offsetWidth/2}}function Ui(e,t){let n=null,r=1/0;for(let i of Mi){let a=Hi(i),o=Math.hypot(e-a.x,t-a.y);o<r&&(r=o,n=i)}return n}function Wi(e,t){for(let n of Mi){let r=Hi(n);if(Math.hypot(e-r.x,t-r.y)<r.r*.95)return n}return null}function Gi(e){let t=performance.now();e.combo=t-e.lastHitAt<Oi?e.combo+1:1,e.lastHitAt=t;let n=Math.min(e.combo,4);e.combo===1?Ki(()=>ie(e.def.freq,.42,e.def.decay),e.def.decay):e.combo===2&&Ki(()=>ie(e.def.freq*.75,.3,e.def.decay*1.1),e.def.decay),qi(e,n),Ji(e,2+n*2)}function Ki(e,t){Fi>=ki||(Fi++,e(),zi(()=>{Fi=Math.max(0,Fi-1)},t*1e3))}function qi(e,t){e.drum.style.setProperty(`--staerke`,String(t)),e.drum.classList.remove(`bumm`),e.drum.offsetWidth,e.drum.classList.add(`bumm`),e.bummTimer!==null&&(window.clearTimeout(e.bummTimer),Pi.delete(e.bummTimer)),e.bummTimer=zi(()=>{e.drum.classList.remove(`bumm`),e.bummTimer=null},560)}function Ji(e,t){let n=e.drum.offsetWidth,r=e.cell.getBoundingClientRect(),i=ji?.getBoundingClientRect().top??0,a=r.top+r.height/2-n*.2,o=Math.max(40,a-i-24);for(let r=0;r<t;r++){if(Ii>=Ai)return;let t=document.createElement(`span`);t.className=`trommel-punkt`;let r=12+Math.random()*10;t.style.width=`${r}px`,t.style.height=`${r}px`,t.style.background=Di[Math.floor(Math.random()*Di.length)],t.style.setProperty(`--sx`,`${((Math.random()-.5)*n*.6).toFixed(0)}px`),t.style.setProperty(`--dx`,`${((Math.random()-.5)*n*.7).toFixed(0)}px`);let i=Math.min((.3+Math.random()*.4)*n,o*(.7+Math.random()*.3));t.style.setProperty(`--dy`,`${(-i).toFixed(0)}px`),t.style.top=`calc(50% - ${(n*.2).toFixed(0)}px)`,e.punkte.appendChild(t),Ii++,zi(()=>{t.remove(),Ii=Math.max(0,Ii-1)},760)}}function Yi(){Ni.forEach(e=>e()),Ni=[],Pi.forEach(e=>window.clearTimeout(e)),Pi=new Set,Fi=0,Ii=0,Li=new Map,Mi=[],ji=null}var Xi={id:`trommeln`,name:`Patsch-Trommeln`,accent:`#e88a9a`,tileIcon:Ti,mount:Vi,unmount:Yi},Zi=`
<svg viewBox="0 0 120 120" width="100%" height="100%">
  <circle cx="44" cy="50" r="28" fill="#e88a9a"/>
  <path d="M44 22 A28 28 0 0 1 72 50 L44 50 Z" fill="#fdf6ea"/>
  <path d="M44 78 A28 28 0 0 1 16 50 L44 50 Z" fill="#f4c86b"/>
  <circle cx="44" cy="50" r="5" fill="#fdf6ea"/>
  <circle cx="84" cy="80" r="21" fill="#7ea3c9"/>
  <path d="M84 59 A21 21 0 0 1 105 80 L84 80 Z" fill="#fdf6ea"/>
  <path d="M84 101 A21 21 0 0 1 63 80 L84 80 Z" fill="#7fb99e"/>
  <circle cx="84" cy="80" r="4" fill="#fdf6ea"/>
</svg>`,Qi=[{r:94,colors:[`#e88a9a`,`#fdf6ea`,`#f4c86b`],freq:196,xPct:24,yPct:30},{r:82,colors:[`#7ea3c9`,`#fdf6ea`,`#7fb99e`],freq:261.63,xPct:62,yPct:24},{r:72,colors:[`#f4c86b`,`#fdf6ea`,`#e88a9a`],freq:293.66,xPct:82,yPct:58},{r:88,colors:[`#7fb99e`,`#fdf6ea`,`#c896d8`],freq:220,xPct:44,yPct:64},{r:66,colors:[`#c896d8`,`#fdf6ea`,`#7ea3c9`],freq:329.63,xPct:18,yPct:76},{r:78,colors:[`#e0a458`,`#fdf6ea`,`#7ea3c9`],freq:246.94,xPct:72,yPct:84},{r:62,colors:[`#e88a9a`,`#fdf6ea`,`#7fb99e`],freq:392,xPct:40,yPct:20}],$i=90,ea=.72,ta=2600,na=120,ra=44,ia=10,aa=`baelle`,oa=1,L=null,sa=null,R=[],ca=[],la=new Set,ua=null,da=null,fa=0,z=0,B=0,pa=1,ma=!1,ha=new Map,ga=0,_a=0,va=null,V=null;function ya(e,t,n){e.addEventListener(t,n),ca.push(()=>e.removeEventListener(t,n))}function ba(e,t){let n=window.setTimeout(()=>{la.delete(n),e()},t);la.add(n)}function xa(){!ma||z===0||B===0||v(aa,oa,{pos:R.map(e=>[e.x/z*100,e.y/B*100])})}function Sa(e){ca=[],la=new Set,ha=new Map,ma=!1,ga=0,z=0,B=0;let t=_(aa,oa,null);va=t&&Array.isArray(t.pos)&&t.pos.length===Qi.length?t.pos:null,e.innerHTML=`
    <div class="baelle-stage" id="baelleStage">
      <div class="baelle-teppich"></div>
      <div class="baelle-wellen" id="baelleWellen"></div>
      <div class="baelle-layer">
        ${Qi.map((e,t)=>`
          <div class="ball" data-i="${t}">
            <div class="ball-muster" style="--c1:${e.colors[0]};--c2:${e.colors[1]};--c3:${e.colors[2]}"></div>
            <div class="ball-glanz"></div>
          </div>`).join(``)}
      </div>
    </div>
  `,L=e.querySelector(`#baelleStage`),sa=e.querySelector(`#baelleWellen`),R=Qi.map((t,n)=>{let r=e.querySelector(`.ball[data-i="${n}"]`);return{def:t,el:r,muster:r.querySelector(`.ball-muster`),r:t.r,x:0,y:0,vx:0,vy:0,spin:Math.random()*Math.PI*2,squash:0,squashDir:0,lastSoundAt:-1/0,dirty:!0}}),ua=new ResizeObserver(()=>Ca()),ua.observe(L),ya(L,`pointerdown`,e=>Oa(e)),ya(L,`pointermove`,e=>ka(e)),ya(L,`pointerup`,e=>ha.delete(e.pointerId)),ya(L,`pointercancel`,e=>ha.delete(e.pointerId))}function Ca(){if(!L)return;let e=L.clientWidth,t=L.clientHeight;if(e<1||t<1)return;let n=z,r=B;z=e,B=t,pa=Math.max(.55,Math.min(1.2,Math.min(z,B)/834)),R.forEach((e,t)=>{if(e.r=e.def.r*pa,e.el.style.width=`${(e.r*2).toFixed(1)}px`,e.el.style.height=`${(e.r*2).toFixed(1)}px`,ma)n>0&&r>0&&(e.x*=z/n,e.y*=B/r);else{let[n,r]=va?.[t]??[e.def.xPct,e.def.yPct];e.x=n/100*z,e.y=r/100*B}e.x=Da(e.x,e.r,z-e.r),e.y=Da(e.y,e.r,B-e.r)}),wa();for(let e=0;e<20;e++)Ba();ma||(ma=!0,L.classList.add(`bereit`)),Va(!0)}function wa(){let e=document.querySelector(`.back-button`);if(!L||!e||e.offsetWidth===0){V=null;return}let t=Ta(e),n=Ta(L);V={x:t.x-n.x+e.offsetWidth/2,y:t.y-n.y+e.offsetHeight/2,r:e.offsetWidth/2+10}}function Ta(e){let t=0,n=0,r=e;for(;r;)t+=r.offsetLeft,n+=r.offsetTop,r=r.offsetParent;return{x:t,y:n}}function Ea(e){if(!V)return 0;let t=e.x-V.x,n=e.y-V.y,r=Math.hypot(t,n),i=e.r+V.r;if(r>=i)return 0;let a=r<.001?1:t/r,o=r<.001?1:n/r;e.x=V.x+a*i,e.y=V.y+o*i;let s=e.vx*a+e.vy*o;return s>=0?0:(e.vx-=1.72*s*a,e.vy-=1.72*s*o,-s)}function Da(e,t,n){return Math.max(t,Math.min(n,e))}function Oa(e){if(e.preventDefault(),!L||!ma)return;try{L.setPointerCapture(e.pointerId)}catch{}let t=Aa(e.clientX,e.clientY);ha.set(e.pointerId,{x:t.x,y:t.y,vx:0,vy:0,t:performance.now()}),Pa(t.x,t.y);let n=na*pa;for(let e of R){let r=e.x-t.x,i=e.y-t.y,a=Math.hypot(r,i),o,s;if(a<1){let e=Math.random()*Math.PI*2;o=Math.cos(e),s=Math.sin(e)}else o=r/a,s=i/a;if(a<e.r){let t=950+350*Math.random();e.vx+=o*t,e.vy+=s*t,Ma(e,.2,Math.atan2(s,o)),Na(e,.32)}else if(a<e.r+n){let t=1-(a-e.r)/n,r=650*t;e.vx+=o*r,e.vy+=s*r,Ma(e,.1*t,Math.atan2(s,o))}ja(e)}Fa()}function ka(e){let t=ha.get(e.pointerId);if(!t||!ma)return;let n=Aa(e.clientX,e.clientY),r=performance.now(),i=Math.max(8,r-t.t)/1e3;t.vx=t.vx*.4+(n.x-t.x)/i*.6,t.vy=t.vy*.4+(n.y-t.y)/i*.6,t.x=n.x,t.y=n.y,t.t=r;let a=ra*pa,o=!1;for(let e of R){let r=e.x-n.x,i=e.y-n.y,s=Math.hypot(r,i),c=e.r+a;if(s>=c)continue;let l=s<1?1:r/s,u=s<1?0:i/s;e.x=n.x+l*c,e.y=n.y+u*c,e.dirty=!0;let d=(e.vx-t.vx)*l+(e.vy-t.vy)*u;d<0&&(e.vx-=1.6*d*l,e.vy-=1.6*d*u,-d>250&&(Ma(e,Math.min(.2,-d/4e3),Math.atan2(u,l)),Na(e,Math.min(.32,.12+-d/6e3)))),ja(e),o=!0}o&&Fa()}function Aa(e,t){let n=L.getBoundingClientRect(),r=n.width>0?L.clientWidth/n.width:1,i=n.height>0?L.clientHeight/n.height:1;return{x:(e-n.left)*r,y:(t-n.top)*i}}function ja(e){let t=Math.hypot(e.vx,e.vy);t>ta&&(e.vx*=ta/t,e.vy*=ta/t)}function Ma(e,t,n){t>e.squash&&(e.squash=t,e.squashDir=n)}function Na(e,t){let n=performance.now();n-e.lastSoundAt<70||n-_a<35||(e.lastSoundAt=n,_a=n,ae(e.def.freq,t))}function Pa(e,t){if(!sa||ga>=ia)return;let n=document.createElement(`span`);n.className=`baelle-welle`,n.style.transform=`translate(${e.toFixed(0)}px, ${t.toFixed(0)}px)`,sa.appendChild(n),ga++,ba(()=>{n.remove(),ga=Math.max(0,ga-1)},650)}function Fa(){da===null&&(fa=performance.now(),da=requestAnimationFrame(Ia))}function Ia(e){let t=Math.min(.1,Math.max(.001,(e-fa)/1e3));fa=e;let n=Math.ceil(t/.017);for(let e=0;e<n;e++)La(t/n);Va(!1),R.some(e=>Math.abs(e.vx)>3||Math.abs(e.vy)>3||e.squash>.002)?da=requestAnimationFrame(Ia):(da=null,xa())}function La(e){let t=Math.exp(-1*e),n=$i*pa*e;for(let r of R){let i=Math.hypot(r.vx,r.vy);if(i>0){let e=Math.max(0,i*t-n);r.vx*=e/i,r.vy*=e/i}r.x+=r.vx*e,r.y+=r.vy*e,r.spin+=r.vx*e/r.r,r.squash*=Math.exp(-11*e),Ra(r)}za();for(let e of R)e.x=Da(e.x,e.r,z-e.r),e.y=Da(e.y,e.r,B-e.r)}function Ra(e){let t=0,n=0;e.x<e.r?(e.x=e.r,e.vx<0&&(t=-e.vx,e.vx=-e.vx*ea,n=0)):e.x>z-e.r&&(e.x=z-e.r,e.vx>0&&(t=e.vx,e.vx=-e.vx*ea,n=Math.PI)),e.y<e.r?(e.y=e.r,e.vy<0&&(t=Math.max(t,-e.vy),e.vy=-e.vy*ea,n=Math.PI/2)):e.y>B-e.r&&(e.y=B-e.r,e.vy>0&&(t=Math.max(t,e.vy),e.vy=-e.vy*ea,n=-Math.PI/2));let r=Ea(e);if(r>t&&V&&(t=r,n=Math.atan2(e.y-V.y,e.x-V.x)),t>140){Ma(e,Math.min(.22,t/5e3),n);let r=performance.now();r-e.lastSoundAt>=70&&r-_a>=35&&(e.lastSoundAt=r,_a=r,ae(e.def.freq*.75,Math.min(.26,.06+t/7e3)))}}function za(){for(let e=0;e<R.length;e++)for(let t=e+1;t<R.length;t++){let n=R[e],r=R[t],i=r.x-n.x,a=r.y-n.y,o=Math.hypot(i,a),s=n.r+r.r;if(o>=s||o<.001)continue;let c=i/o,l=a/o,u=n.r*n.r,d=r.r*r.r,f=s-o;n.x-=c*f*(d/(u+d)),n.y-=l*f*(d/(u+d)),r.x+=c*f*(u/(u+d)),r.y+=l*f*(u/(u+d));let p=(r.vx-n.vx)*c+(r.vy-n.vy)*l;if(p>=0)continue;let m=-1.8599999999999999*p/(1/u+1/d);if(n.vx-=m/u*c,n.vy-=m/u*l,r.vx+=m/d*c,r.vy+=m/d*l,-p>160){let e=Math.min(.18,-p/5e3);Ma(n,e,Math.atan2(l,c)),Ma(r,e,Math.atan2(l,c));let t=performance.now();t-_a>=35&&t-n.lastSoundAt>=70&&(n.lastSoundAt=t,r.lastSoundAt=t,_a=t,ae((n.def.freq+r.def.freq)/2,Math.min(.28,.08+-p/6e3)))}}}function Ba(){for(let e=0;e<R.length;e++)for(let t=e+1;t<R.length;t++){let n=R[e],r=R[t],i=r.x-n.x,a=r.y-n.y,o=Math.hypot(i,a);o<.001&&(i=1,a=0,o=1);let s=n.r+r.r+2;if(o>=s)continue;let c=(s-o)/2;n.x-=i/o*c,n.y-=a/o*c,r.x+=i/o*c,r.y+=a/o*c}R.forEach(e=>{Ea(e),e.x=Da(e.x,e.r,z-e.r),e.y=Da(e.y,e.r,B-e.r)})}function Va(e){for(let t of R){if(!e&&!t.dirty&&t.vx===0&&t.vy===0&&t.squash<.002)continue;t.dirty=!1;let n=t.squash,r=t.squashDir*180/Math.PI;t.el.style.transform=`translate(${(t.x-t.r).toFixed(1)}px, ${(t.y-t.r).toFixed(1)}px) rotate(${r.toFixed(1)}deg) scale(${(1-n).toFixed(3)}, ${(1+n*.6).toFixed(3)}) rotate(${(-r).toFixed(1)}deg)`,t.muster.style.transform=`rotate(${(t.spin*180/Math.PI).toFixed(1)}deg)`}}function Ha(){xa(),ca.forEach(e=>e()),ca=[],la.forEach(e=>window.clearTimeout(e)),la=new Set,da!==null&&(cancelAnimationFrame(da),da=null),ua?.disconnect(),ua=null,ha=new Map,R=[],L=null,sa=null,ma=!1,va=null,V=null}var Ua={id:`baelle`,name:`Bälle schubsen`,accent:`#7ea3c9`,tileIcon:Zi,mount:Sa,unmount:Ha},Wa=`
<svg viewBox="0 0 120 120" width="100%" height="100%">
  <path d="M10 98 Q34 62 60 66 Q88 60 110 98 Z" fill="#e0a458"/>
  <path d="M22 98 Q40 76 58 80 Q74 76 92 98 Z" fill="#d9824f"/>
  <path d="M44 86 Q52 74 62 84 Q56 92 44 86 Z" fill="#f4c86b"/>
  <path d="M78 18 C92 26 94 42 80 54 C66 44 66 28 78 18 Z" fill="#c96f5a" transform="rotate(28 80 36)"/>
  <path d="M30 28 C40 34 40 46 32 52 C22 46 22 34 30 28 Z" fill="#f4c86b" transform="rotate(-24 31 40)"/>
</svg>`,Ga=[`#e0a458`,`#d9824f`,`#f4c86b`,`#c96f5a`,`#b8a05a`,`#e8b06a`],Ka=[`ahorn`,`oval`,`rund`],qa=.8,Ja=.3,Ya=[[Ja,30],[.6,24],[.86,24]],Xa=600,Za=1.6,Qa=4.2,$a=260,eo=2200,to=230,no=75,ro=18,io=13,ao=8,oo=`laub`,so=1,co=Ya.reduce((e,[,t])=>e+t,0),H=null,lo=null,U=null,W=[],G=[],uo=[],fo=new Set,po=null,mo=null,ho=0,K=0,go=0,q=1,_o=!1,vo=new Map,yo=0,bo=0,xo=null,So=null;function Co(e,t,n){e.addEventListener(t,n),uo.push(()=>e.removeEventListener(t,n))}function wo(e,t){let n=window.setTimeout(()=>{fo.delete(n),e()},t);return fo.add(n),n}var To={ahorn:`<path d="M50 4 L58 28 L78 16 L72 40 L95 42 L77 57 L86 76 L61 68 L55 88 L50 92 L45 88 L39 68 L14 76 L23 57 L5 42 L28 40 L22 16 L42 28 Z" fill="currentColor"/><path d="M50 98 L50 20 M50 60 L24 46 M50 60 L76 46" stroke="rgba(90,55,25,0.35)" stroke-width="3" fill="none" stroke-linecap="round"/>`,oval:`<path d="M50 4 C80 24 86 62 50 92 C14 62 20 24 50 4 Z" fill="currentColor"/><path d="M50 98 L50 12 M50 40 L34 28 M50 40 L66 28 M50 60 L32 48 M50 60 L68 48" stroke="rgba(90,55,25,0.35)" stroke-width="3" fill="none" stroke-linecap="round"/>`,rund:`<path d="M50 8 C82 10 94 46 72 74 C62 86 54 90 50 92 C46 90 38 86 28 74 C6 46 18 10 50 8 Z" fill="currentColor"/><path d="M50 98 L50 18 M50 50 L28 36 M50 50 L72 36" stroke="rgba(90,55,25,0.35)" stroke-width="3" fill="none" stroke-linecap="round"/>`},Eo=`
<svg viewBox="0 0 200 300" width="100%" height="100%" preserveAspectRatio="xMidYMax meet">
  <path d="M88 300 L92 150 L70 112 M92 170 L124 128 M92 150 L96 96" stroke="#a9835e" stroke-width="10" fill="none" stroke-linecap="round"/>
  <path d="M84 300 L88 150 L112 150 L116 300 Z" fill="#a9835e"/>
  <circle cx="100" cy="74" r="48" fill="#e8b06a"/>
  <circle cx="58" cy="104" r="40" fill="#e0a458"/>
  <circle cx="146" cy="100" r="40" fill="#d9824f"/>
  <circle cx="80" cy="140" r="34" fill="#f4c86b"/>
  <circle cx="128" cy="144" r="32" fill="#e8b06a"/>
  <circle cx="112" cy="58" r="22" fill="#f4c86b" opacity="0.8"/>
</svg>`,Do=`
<svg viewBox="0 0 120 76" width="100%" height="100%">
  <ellipse cx="58" cy="72" rx="50" ry="5" fill="rgba(90,70,40,0.18)"/>
  <path d="M8 70 L6 56 L14 50 L10 38 L22 36 L22 22 L34 26 L40 12 L50 22 L60 8 L66 22 L78 14 L80 28 L92 26 L90 40 L98 44 L96 70 Z" fill="#8a6a4a"/>
  <path d="M84 70 Q86 44 102 46 Q114 50 116 62 Q110 70 84 70 Z" fill="#e8cfa8"/>
  <circle cx="116" cy="61" r="3.5" fill="#4a4032"/>
  <g class="igel-auge-zu"><path d="M98 54 Q102 57 106 54" stroke="#4a4032" stroke-width="2.5" fill="none" stroke-linecap="round"/></g>
  <g class="igel-auge-auf"><circle cx="102" cy="54" r="3.5" fill="#4a4032"/><circle cx="103" cy="53" r="1.1" fill="#fff"/></g>
  <ellipse cx="96" cy="63" rx="4" ry="2.5" fill="#f2b8c6" opacity="0.7"/>
</svg>`;function Oo(e){uo=[],fo=new Set,vo=new Map,_o=!1,yo=0,K=0,go=0,xo=null;let t=_(oo,so,null);So=t&&Array.isArray(t.liegen)&&t.liegen.length===co?t:null,e.innerHTML=`
    <div class="laub-stage" id="laubStage">
      <div class="laub-himmel"></div>
      <div class="laub-huegel"></div>
      <div class="laub-baum">${Eo}</div>
      <div class="laub-boden"></div>
      <div class="laub-igel" id="laubIgel">${Do}</div>
      <div class="laub-blaetter" id="laubBlaetter"></div>
      <div class="laub-wirbel" id="laubWirbel"></div>
    </div>
  `,H=e.querySelector(`#laubStage`),lo=e.querySelector(`#laubWirbel`),U=e.querySelector(`#laubIgel`);let n=e.querySelector(`#laubBlaetter`);W=[];for(let e=0;e<co;e++){let t=document.createElement(`div`);t.className=`laub-blatt`,t.style.color=Ga[e%Ga.length],t.innerHTML=`<svg viewBox="0 0 100 100" width="100%" height="100%">${To[Ka[e%Ka.length]]}</svg>`,n.appendChild(t),W.push({i:e,el:t,size:0,baseSize:54+e*37%22,x:0,y:0,vx:0,vy:0,rot:0,vrot:0,phase:Math.random()*Math.PI*2,phaseSpeed:2.4+Math.random()*1.6,onGround:!1,bin:-1,dirty:!0})}po=new ResizeObserver(()=>Io()),po.observe(H),Co(H,`pointerdown`,e=>Bo(e)),Co(H,`pointermove`,e=>Vo(e)),Co(H,`pointerup`,e=>vo.delete(e.pointerId)),Co(H,`pointercancel`,e=>vo.delete(e.pointerId))}function ko(){return go*qa}function Ao(){return Math.max(1,Math.ceil(K/(ro*q)))}function jo(e){return Math.max(0,Math.min(G.length-1,Math.floor(e/(ro*q))))}function Mo(e){return(e+.5)*ro*q}function No(e){return ko()-e*io*q-q*6}function Po(e,t,n=!1){let r=t;for(let e=0;e<24;e++){let e=G[r].length,t=r>0?G[r-1].length:1/0,n=r<G.length-1?G[r+1].length:1/0;if(e-Math.min(t,n)<2)break;t<n?--r:r+=n<t?1:Math.random()<.5?-1:1}G[r].push(e),e.onGround=!0,e.bin=r;let i=ro*q;n?e.x=Math.max(r*i,Math.min((r+1)*i,e.x)):(e.x=Mo(r)+(Math.random()-.5)*i*.8,e.rot=(Math.random()-.5)*70+(Math.random()<.5?0:180)),e.y=No(G[r].length-1),e.vx=0,e.vy=0,e.vrot=0,e.dirty=!0}function Fo(e){if(!e.onGround)return;let t=e.bin,n=G[t],r=n.indexOf(e);if(e.onGround=!1,e.bin=-1,r<0)return;let i=n.splice(r);i.shift(),i.forEach(e=>{e.onGround=!1,e.bin=-1,e.vy=0,e.vx=(Math.random()-.5)*40});for(let e of[t-1,t+1])if(!(e<0||e>=G.length))for(;G[e].length-G[t].length>3;){let n=G[e].pop();n.onGround=!1,n.bin=-1,n.vy=0,n.vx=(e<t?1:-1)*60}}function Io(){if(!H)return;let e=H.clientWidth,t=H.clientHeight;if(e<1||t<1)return;let n=K,r=go,i=_o?Lo().map(e=>[e.i,e.x/n*100]):null;if(K=e,go=t,q=Math.max(.55,Math.min(1.2,Math.min(K,go)/834)),G=Array.from({length:Ao()},()=>[]),W.forEach(e=>{e.size=e.baseSize*q,e.el.style.width=`${e.size.toFixed(1)}px`,e.el.style.height=`${e.size.toFixed(1)}px`}),_o)i?.forEach(([e,t])=>Po(W[e],jo(t/100*K))),W.forEach(e=>{e.onGround||(e.x=Math.max(e.size/2,Math.min(K-e.size/2,e.x*(K/n))),e.y*=go/r,e.dirty=!0)});else{if(So)So.liegen.forEach(([e,t])=>{let n=W[e];n&&Po(n,jo(t/100*K))}),W.forEach(e=>{e.onGround||Po(e,jo(K/2))});else{let e=0;for(let[t,n]of Ya)for(let r=0;r<n;r++,e++){let n=(Math.random()+Math.random()-1)*50*q;Po(W[e],jo(t*K+n))}}_o=!0,H.classList.add(`bereit`)}Ro(),Yo()}function Lo(){let e=[],t=G.reduce((e,t)=>Math.max(e,t.length),0);for(let n=0;n<t;n++)for(let t of G)t[n]&&e.push(t[n]);return e}function Ro(){if(!U)return;let e=120*q,t=76*q;U.style.width=`${e.toFixed(1)}px`,U.style.height=`${t.toFixed(1)}px`,U.style.transform=`translate(${(Ja*K-e/2).toFixed(1)}px, ${(ko()-t+4*q).toFixed(1)}px)`}function zo(e,t){let n=H.getBoundingClientRect(),r=n.width>0?H.clientWidth/n.width:1,i=n.height>0?H.clientHeight/n.height:1;return{x:(e-n.left)*r,y:(t-n.top)*i}}function Bo(e){if(e.preventDefault(),!H||!_o)return;try{H.setPointerCapture(e.pointerId)}catch{}let t=zo(e.clientX,e.clientY);vo.set(e.pointerId,{x:t.x,y:t.y,vx:0,vy:0,t:performance.now()}),e.target.closest?.(`.laub-igel`)&&Go();let n=to*q,r=Math.min(.4,.8*n/Math.max(1,ko())),i=0;for(let e of W){let a=e.x-t.x,o=e.y-t.y,s=Math.hypot(a,o>0?o*r:o);if(s>=n)continue;let c=1-s/n,l=Math.abs(a)<4?Math.random()<.5?-1:1:Math.sign(a);(e.x<K*.15&&l<0||e.x>K*.85&&l>0)&&(l*=-.7),Fo(e),e.vx+=(l*(100+500*c)*(.6+Math.random()*.7)+(Math.random()-.5)*120)*q,e.vy=Math.min(e.vy,-(250+1050*c)*(.75+Math.random()*.4)*q),e.vrot=(Math.random()-.5)*900,Ho(e),i++}Wo(t.x,t.y),i>0?Uo(i):performance.now()-bo>120&&(bo=performance.now(),g()),Ko()}function Vo(e){let t=vo.get(e.pointerId);if(!t||!_o)return;let n=zo(e.clientX,e.clientY),r=performance.now(),i=Math.max(8,r-t.t)/1e3;if(t.vx=t.vx*.4+(n.x-t.x)/i*.6,t.vy=t.vy*.4+(n.y-t.y)/i*.6,t.x=n.x,t.y=n.y,t.t=r,Math.hypot(t.vx,t.vy)<120*q)return;let a=no*q,o=0;for(let e of W)Math.hypot(e.x-n.x,e.y-n.y)>=a||(e.onGround?(Fo(e),e.vx=t.vx*.6+(Math.random()-.5)*80*q,e.vy=Math.min(t.vy*.3,0)-(300+Math.random()*300)*q,e.vrot=(Math.random()-.5)*700,o++):(e.vx+=t.vx*.35,e.vy+=t.vy*.35),Ho(e));o>0&&Uo(o),Ko()}function Ho(e){let t=eo*q,n=Math.hypot(e.vx,e.vy);n>t&&(e.vx*=t/n,e.vy*=t/n)}function Uo(e){let t=performance.now();t-bo<80||(bo=t,oe(Math.min(.3,.1+e*.012),.22+Math.min(.16,e*.01)))}function Wo(e,t){if(!lo||yo>=ao)return;let n=document.createElement(`span`);n.className=`laub-wirbelchen`,n.style.transform=`translate(${e.toFixed(0)}px, ${t.toFixed(0)}px)`,n.innerHTML=`<svg viewBox="0 0 80 80" width="100%" height="100%"><path d="M14 40 C14 20 40 12 54 24 C66 34 58 52 44 50 C34 48 34 36 42 34" fill="none" stroke="rgba(255,250,242,0.9)" stroke-width="6" stroke-linecap="round"/></svg>`,lo.appendChild(n),yo++,wo(()=>{n.remove(),yo=Math.max(0,yo-1)},700)}function Go(){U&&(U.classList.add(`wach`),U.classList.remove(`hopst`),U.offsetWidth,U.classList.add(`hopst`),m({freq:880,duration:.04,attack:.004,release:.06,type:`triangle`,gain:.14}),wo(()=>m({freq:988,duration:.04,attack:.004,release:.06,type:`triangle`,gain:.14}),120),xo!==null&&(window.clearTimeout(xo),fo.delete(xo)),xo=wo(()=>{U?.classList.remove(`wach`),xo=null},2200))}function Ko(){mo===null&&(ho=performance.now(),mo=requestAnimationFrame(qo))}function qo(e){let t=Math.min(.1,Math.max(.001,(e-ho)/1e3));ho=e;let n=Math.ceil(t/.02);for(let e=0;e<n;e++)Jo(t/n);Yo(),W.some(e=>!e.onGround)?mo=requestAnimationFrame(qo):(mo=null,Xo())}function Jo(e){let t=Xa*q;for(let n of W){if(n.onGround)continue;if(n.vy+=t*e,n.vy*=Math.exp(-(n.vy<0?Za:Qa)*e),n.vx*=Math.exp(-1.4*e),n.phase+=n.phaseSpeed*e,n.vy>0){n.vx+=Math.cos(n.phase)*$a*q*e;let t=Math.sin(n.phase)*40;n.rot+=(t-n.rot)*Math.min(1,3*e)+n.vrot*e}else n.rot+=n.vrot*e;n.vrot*=Math.exp(-1.5*e),n.x+=n.vx*e,n.y+=n.vy*e;let r=n.size/2;n.x<r?(n.x=r,n.vx=Math.abs(n.vx)*.4):n.x>K-r&&(n.x=K-r,n.vx=-Math.abs(n.vx)*.4),n.y<r&&(n.y=r,n.vy=Math.abs(n.vy)*.2);let i=jo(n.x);n.vy>=0&&n.y>=No(G[i].length)&&Po(n,i,!0),n.dirty=!0}}function Yo(){for(let e of W)e.dirty&&(e.dirty=!1,e.el.style.transform=`translate(${(e.x-e.size/2).toFixed(1)}px, ${(e.y-e.size/2).toFixed(1)}px) rotate(${e.rot.toFixed(1)}deg)`)}function Xo(){if(!_o||K===0)return;let e=Lo().map(e=>[e.i,e.x/K*100]);W.forEach(t=>{t.onGround||e.push([t.i,t.x/K*100])}),v(oo,so,{liegen:e})}function Zo(){Xo(),uo.forEach(e=>e()),uo=[],fo.forEach(e=>window.clearTimeout(e)),fo=new Set,xo=null,mo!==null&&(cancelAnimationFrame(mo),mo=null),po?.disconnect(),po=null,vo=new Map,W=[],G=[],H=null,lo=null,U=null,_o=!1,So=null}var Qo={id:`laub`,name:`Laubhaufen`,accent:`#e0a458`,tileIcon:Wa,mount:Oo,unmount:Zo},$o=`
<svg viewBox="0 0 120 120" width="100%" height="100%">
  <rect x="26" y="10" width="68" height="100" rx="32" fill="#f6efe3" stroke="#e0d2bc" stroke-width="3"/>
  <rect x="34" y="18" width="52" height="84" rx="25" fill="#cfe7f5"/>
  <rect x="34" y="62" width="52" height="40" fill="#6fa8c9"/>
  <path d="M34 62 H86 V78 C76 92 44 92 34 78 Z" fill="#6fa8c9"/>
  <circle cx="50" cy="40" r="11" fill="#fff"/>
  <circle cx="62" cy="36" r="13" fill="#fff"/>
  <circle cx="72" cy="42" r="9" fill="#fff"/>
  <ellipse cx="60" cy="84" rx="13" ry="6" fill="#4f6f8f"/>
</svg>`,es=[[20,14],[62,10],[88,26],[12,38],[50,34],[86,50],[24,62],[66,66],[16,88],[58,90],[90,84]],ts=[`meer`,`berge`,`stadt`,`insel`],ns={meer:`
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
    </svg>`};function rs(e){return`
<svg viewBox="0 0 200 120" width="100%" height="100%">
  <g fill="${e}">
    <circle cx="60" cy="70" r="38"/><circle cx="102" cy="52" r="46"/><circle cx="146" cy="70" r="36"/>
    <circle cx="28" cy="88" r="26"/><circle cx="172" cy="88" r="25"/>
    <rect x="28" y="70" width="146" height="44" rx="22"/>
  </g>
</svg>`}var is=[`#ffffff`,`#f3f7fb`,`#e9f0f6`,`#fbfcfe`],as=`fenster`,os=1,ss=6e3,cs=es.length*220+2700,ls=null,us=null,ds=null,fs=null,ps=[],ms=[],hs=[],gs=new Set,_s=null,J=0,vs=!1,ys=!1,bs=0,xs=0,Ss=0,Cs=new Set;function ws(e,t,n){e.addEventListener(t,n),hs.push(()=>e.removeEventListener(t,n))}function Ts(e,t){let n=window.setTimeout(()=>{gs.delete(n),e()},t);return gs.add(n),n}function Es(e){e!==null&&(window.clearTimeout(e),gs.delete(e))}function Ds(e){hs=[],gs=new Set,Cs=new Set,_s=null,vs=!1,ys=!1,J=_(as,os,{szene:0}).szene%ts.length,e.innerHTML=`
    <div class="fenster-stage" id="fensterStage">
      <div class="fenster">
        <div class="fenster-innen" id="fensterInnen">
          ${ts.map((e,t)=>`<div class="fenster-szene sz-${e}${t===J?` aktiv`:``}">${ns[e]}</div>`).join(``)}
          <div class="fenster-dunst" id="fensterDunst"></div>
          ${es.map(([e,t],n)=>`
            <div class="fenster-wolke" style="left:${e}%;top:${t}%" data-i="${n}">
              <div class="fenster-wolke-innen" style="animation-delay:${(-n*1.3).toFixed(1)}s">${rs(is[n%is.length])}</div>
            </div>`).join(``)}
          <div class="fenster-rollo" id="fensterRollo"><span class="fenster-rollo-griff"></span></div>
          <div class="fenster-schatten"></div>
        </div>
      </div>
    </div>
  `,ls=e.querySelector(`#fensterStage`),us=e.querySelector(`#fensterInnen`),ds=e.querySelector(`#fensterDunst`),fs=e.querySelector(`#fensterRollo`),ps=[...e.querySelectorAll(`.fenster-szene`)],ms=es.map(([t,n],r)=>({el:e.querySelector(`.fenster-wolke[data-i="${r}"]`),x:t,y:n,weg:!1})),As(),ws(ls,`pointerdown`,e=>{let t=e;t.preventDefault();try{ls?.setPointerCapture(t.pointerId)}catch{}Cs.add(t.pointerId),ks(t.clientX,t.clientY,!0)}),ws(ls,`pointermove`,e=>{let t=e;Cs.has(t.pointerId)&&ks(t.clientX,t.clientY,!1)});let t=e=>Cs.delete(e.pointerId);ws(ls,`pointerup`,t),ws(ls,`pointercancel`,t)}function Os(e,t){let n=us.getBoundingClientRect(),r=(e-n.left)/n.width*100,i=(t-n.top)/n.height*100;return{x:Math.max(0,Math.min(100,r)),y:Math.max(0,Math.min(100,i)),drin:r>=0&&r<=100&&i>=0&&i<=100}}function ks(e,t,n){if(!us)return;let r=Os(e,t),i=performance.now();if(n&&i-bs>700){if(ys){Ps(!1);return}if(r.drin&&r.y<14){Ps(!0);return}}if(ys)return;Ms();let a=0,o=us.getBoundingClientRect();for(let e of ms){if(e.weg)continue;let t=(e.x-r.x)*(o.width/100),n=(e.y-r.y)*(o.height/100),i=Math.hypot(t,n);if(i>20/100*Math.max(o.width,o.height))continue;let s=i<1?{x:Math.random()-.5,y:Math.random()-.5}:{x:t/i,y:n/i},c=Math.hypot(s.x,s.y)||1,l=Math.max(o.width,o.height)*1.1;e.el.style.setProperty(`--wx`,`${(s.x/c*l).toFixed(0)}px`),e.el.style.setProperty(`--wy`,`${(s.y/c*l).toFixed(0)}px`),e.el.style.removeProperty(`--delay`),e.el.classList.add(`weg`),e.weg=!0,a++}a>0&&i-xs>140&&(xs=i,g()),As();let s=ms.filter(e=>!e.weg).length;s<=1&&!vs?(vs=!0,Ts(js,450)):vs&&n&&r.drin&&s<=3&&js()}function As(){if(!ds)return;let e=ms.filter(e=>!e.weg).length,t=Math.max(0,(e-2)/(ms.length-2));ds.style.opacity=(t*.92).toFixed(2)}function js(){let e=performance.now();if(e-Ss<1600)return;Ss=e;let t=ps[J];if(!t)return;t.classList.remove(`feiert`),t.offsetWidth,t.classList.add(`feiert`),Ts(()=>t.classList.remove(`feiert`),2600);let n=ts[J];n===`meer`?(se(170,115,.7,.24),Ts(()=>se(115,190,.6,.2),650)):n===`berge`?[0,160,380].forEach((e,t)=>Ts(()=>se(1700+t*200,2500+t*150,.09,.07),e)):n===`stadt`?[5,6,7,5].forEach((e,t)=>Ts(()=>m({freq:p[e],duration:.2,attack:.01,release:.6,gain:.16}),t*180)):(g(),Ts(()=>se(420,900,.3,.12),300))}function Ms(){Es(_s),_s=Ts(()=>{_s=null;let e=ms.filter(e=>e.weg);e.length!==0&&(e.forEach((e,t)=>{e.el.style.setProperty(`--delay`,`${t*220}ms`),e.el.classList.remove(`weg`),e.weg=!1}),As(),vs&&Ts(Ns,cs))},ss)}function Ns(){ms.some(e=>e.weg)||(vs=!1,ps[J]?.classList.remove(`aktiv`),J=(J+1)%ts.length,ps[J]?.classList.add(`aktiv`),v(as,os,{szene:J}))}function Ps(e){ys=e,bs=performance.now(),fs?.classList.toggle(`unten`,e),re(!e)}function Fs(){hs.forEach(e=>e()),hs=[],gs.forEach(e=>window.clearTimeout(e)),gs=new Set,_s=null,Cs=new Set,ms=[],ps=[],ls=null,us=null,ds=null,fs=null}var Is={id:`fenster`,name:`Flugzeugfenster`,accent:`#7ea3c9`,tileIcon:$o,mount:Ds,unmount:Fs},Ls=`
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
</svg>`,Rs=[[[76,.5],[76,.5],[79,2],[76,.5],[76,.5],[79,2],[76,.5],[79,.5],[84,1],[83,1.5],[81,.5],[81,1],[79,1],[74,.5],[76,.5],[77,1],[74,1],[74,.5],[76,.5],[77,2],[74,.5],[77,.5],[83,.5],[81,.5],[79,1],[83,1],[84,2],[72,.5],[72,.5],[84,2],[81,.5],[77,.5],[79,2],[76,.5],[72,.5],[77,1],[79,1],[81,1],[79,2],[72,.5],[72,.5],[84,2],[81,.5],[77,.5],[79,2],[76,.5],[72,.5],[77,1],[76,1],[74,1],[72,3]],[[72,1],[72,1],[79,1],[79,1],[81,1],[81,1],[79,2],[77,1],[77,1],[76,1],[76,1],[74,1],[74,1],[72,2],[79,1],[79,1],[77,1],[77,1],[76,1],[76,1],[74,2],[79,1],[79,1],[77,1],[77,1],[76,1],[76,1],[74,2],[72,1],[72,1],[79,1],[79,1],[81,1],[81,1],[79,2],[77,1],[77,1],[76,1],[76,1],[74,1],[74,1],[72,3]],[[72,1],[74,1],[76,1],[77,1],[79,2],[79,2],[81,1],[81,1],[81,1],[81,1],[79,3],[81,1],[81,1],[81,1],[81,1],[79,3],[77,1],[77,1],[77,1],[77,1],[76,2],[76,2],[74,1],[74,1],[74,1],[74,1],[72,3]]],zs=.5,Bs=3,Vs=240,Hs=30,Us=[{cls:`mond`,svg:`<path d="M26 4 a22 22 0 1 0 16 36 a17 17 0 1 1 -16 -36 Z" fill="#f4e7b8"/>`},{cls:`stern`,svg:`<path d="M24 2 l6 14 l15 1 l-11 10 l3 15 l-13 -8 l-13 8 l3 -15 l-11 -10 l15 -1 z" fill="#f4c86b"/>`},{cls:`wolke`,svg:`<g fill="#fffaf2"><circle cx="16" cy="28" r="11"/><circle cx="28" cy="20" r="13"/><circle cx="38" cy="29" r="10"/><rect x="10" y="26" width="32" height="12" rx="6"/></g>`},{cls:`schaf`,svg:`<g><circle cx="18" cy="24" r="10" fill="#fffaf2"/><circle cx="28" cy="20" r="11" fill="#fffaf2"/><circle cx="34" cy="28" r="9" fill="#fffaf2"/><circle cx="22" cy="32" r="9" fill="#fffaf2"/><ellipse cx="40" cy="22" rx="6" ry="7" fill="#4a4032"/><circle cx="42" cy="21" r="1.4" fill="#fffaf2"/><rect x="18" y="38" width="3" height="6" fill="#4a4032"/><rect x="30" y="38" width="3" height="6" fill="#4a4032"/></g>`},{cls:`herz`,svg:`<path d="M24 42 C8 30 4 20 10 13 C15 7 22 9 24 15 C26 9 33 7 38 13 C44 20 40 30 24 42 Z" fill="#e88a9a"/>`}],Ws=null,Gs=null,Ks=null,qs=null,Js=[],Ys=[],Xs=new Set,Zs=null,Qs=0,$s=null,Y=0,ec=0,tc=0,nc=0,rc=0,ic=0,X=null,ac=0,oc=0,sc=new Map;function cc(e,t,n){e.addEventListener(t,n),Ys.push(()=>e.removeEventListener(t,n))}function lc(e,t){let n=window.setTimeout(()=>{Xs.delete(n),e()},t);Xs.add(n)}function uc(e){return 440*2**((e-69)/12)}function dc(e){Ys=[],Xs=new Set,sc=new Map,Y=0,ec=0,tc=0,ic=0,X=null,e.innerHTML=`
    <div class="spieluhr-stage" id="spieluhrStage">
      <div class="spieluhr-sterne">
        ${Array.from({length:14},(e,t)=>`<span style="left:${t*37%97+1}%;top:${t*53%60+4}%;animation-delay:${(-t*.7).toFixed(1)}s"></span>`).join(``)}
      </div>
      <div class="spieluhr-mobile">
        <div class="spieluhr-haken"></div>
        <div class="spieluhr-ring"></div>
        ${Us.map(e=>`
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
  `,Ws=e.querySelector(`#spieluhrStage`),Gs=e.querySelector(`#spieluhrDunkel`),Ks=e.querySelector(`#spieluhrKurbel`),qs=e.querySelector(`#spieluhrBox`),Js=[...e.querySelectorAll(`.spieluhr-teil`)].map((e,t)=>({el:e,phase:t/Us.length*Math.PI*2})),bc(),_c(!0),cc(Ws,`pointerdown`,e=>{let t=e;t.preventDefault();try{Ws?.setPointerCapture(t.pointerId)}catch{}sc.set(t.pointerId,{x:t.clientX,y:t.clientY}),fc(Hs),pc(),h(820),lc(()=>h(760),70)}),cc(Ws,`pointermove`,e=>{let t=e,n=sc.get(t.pointerId);if(!n)return;let r=Math.hypot(t.clientX-n.x,t.clientY-n.y);sc.set(t.pointerId,{x:t.clientX,y:t.clientY}),r>0&&fc(r/40)});let t=e=>sc.delete(e.pointerId);cc(Ws,`pointerup`,t),cc(Ws,`pointercancel`,t),$s=window.setInterval(gc,30)}function fc(e){let t=Y<=0;Y=Math.min(Vs,Y+e),t&&(X=null,ic=0),_c(!0),vc()}function pc(){qs&&(qs.classList.remove(`hopst`),qs.offsetWidth,qs.classList.add(`hopst`))}function mc(){return Math.max(.55,Math.min(1,Y/20))}function hc(){return Math.max(.3,Math.min(1,Y/30))}function gc(){if(Y<=0)return;let e=ce();if(e!==null)for((X===null||X<e-.2)&&(X=e+.08);X<e+.15;){let e=Rs[rc];if(ic>=e.length){X+=Bs*zs/mc(),rc=(rc+1)%Rs.length,ic=0;continue}let[t,n]=e[ic];le(uc(t),X,.2*hc()),X+=n*zs/mc(),ic++}}function _c(e=!1){if(!Gs)return;let t=performance.now();if(!e&&t-oc<400)return;oc=t;let n=Math.max(0,Math.min(1,Y/45));Gs.style.opacity=(.62*(1-n)).toFixed(2)}function vc(){Zs===null&&(Qs=performance.now(),Zs=requestAnimationFrame(yc))}function yc(e){let t=Math.min(.1,Math.max(.001,(e-Qs)/1e3));Qs=e,Y>0&&(Y=Math.max(0,Y-t),e-ac>1e4&&(ac=e,Ee()));let n=Y>0?.5*mc():0;tc+=(n-tc)*Math.min(1,t*.8),ec+=tc*t,nc-=tc*t*2.2,bc(),_c(),Y>0||tc>.002?Zs=requestAnimationFrame(yc):(Zs=null,tc=0,_c(!0))}function bc(){for(let e of Js){let t=ec+e.phase,n=Math.sin(t)*34,r=(Math.cos(t)+1)/2,i=.72+.28*r;e.el.style.transform=`translateX(${n.toFixed(2)}vmin) scale(${i.toFixed(3)})`,e.el.style.opacity=(.55+.45*r).toFixed(2),e.el.style.zIndex=String(Math.round(r*10))}Ks&&(Ks.style.transform=`rotate(${(nc*180/Math.PI).toFixed(1)}deg)`)}function xc(){Ys.forEach(e=>e()),Ys=[],Xs.forEach(e=>window.clearTimeout(e)),Xs=new Set,Zs!==null&&(cancelAnimationFrame(Zs),Zs=null),$s!==null&&(window.clearInterval($s),$s=null),Y=0,Js=[],sc=new Map,Ws=null,Gs=null,Ks=null,qs=null}var Sc={id:`spieluhr`,name:`Spieluhr`,accent:`#7ea3c9`,tileIcon:Ls,mount:dc,unmount:xc},Cc=`
<svg viewBox="0 0 120 120" width="100%" height="100%">
  <rect x="10" y="16" width="100" height="88" rx="18" fill="#bfe3ee"/>
  <path d="M10 84 C34 76 58 90 82 82 C94 78 104 80 110 84 V86 C110 96 102 104 92 104 H28 C18 104 10 96 10 86 Z" fill="#e9d6a6"/>
  <path d="M30 98 C26 84 34 76 30 62" stroke="#7fb99e" stroke-width="5" fill="none" stroke-linecap="round"/>
  <g transform="translate(46 40)"><ellipse cx="22" cy="14" rx="18" ry="11" fill="#f4a56b"/><path d="M6 14 L-6 4 L-6 24 Z" fill="#f4a56b"/><circle cx="31" cy="11" r="2.8" fill="#2c3e50"/></g>
  <circle cx="88" cy="36" r="4" fill="none" stroke="#fffaf2" stroke-width="2"/>
  <circle cx="94" cy="26" r="3" fill="none" stroke="#fffaf2" stroke-width="2"/>
</svg>`,wc=[{farbe:`#f4a56b`,flosse:`#e0864a`,streifen:`#fffaf2`,laenge:120},{farbe:`#7ea3c9`,flosse:`#5f86ad`,streifen:null,laenge:104},{farbe:`#f4c86b`,flosse:`#d4a64a`,streifen:`#e88a9a`,laenge:96},{farbe:`#e88a9a`,flosse:`#c96f7e`,streifen:null,laenge:110},{farbe:`#7fb99e`,flosse:`#5f9a80`,streifen:`#fffaf2`,laenge:92},{farbe:`#c896d8`,flosse:`#a978bb`,streifen:null,laenge:100},{farbe:`#f4a56b`,flosse:`#e0864a`,streifen:null,laenge:84}];function Tc(e){return`
    <svg viewBox="0 0 100 60" width="100%" height="100%">
      <g class="aq-schwanz"><path d="M22 30 L2 12 Q8 30 2 48 Z" fill="${e.flosse}"/></g>
      <path d="M40 12 Q52 2 64 10 Z" fill="${e.flosse}"/>
      <ellipse cx="54" cy="30" rx="36" ry="21" fill="${e.farbe}"/>
      ${e.streifen?`<path d="M44 11 Q38 30 44 49 M58 9 Q52 30 58 51" stroke="${e.streifen}" stroke-width="5" fill="none" opacity="0.85"/>`:``}
      <path d="M50 38 Q56 48 62 38 Z" fill="${e.flosse}"/>
      <circle cx="74" cy="24" r="6" fill="#fffaf2"/><circle cx="76" cy="24" r="3.4" fill="#2c3e50"/>
      <path d="M80 36 Q84 39 87 35" stroke="#2c3e50" stroke-width="2.4" fill="none" stroke-linecap="round"/>
    </svg>`}var Ec=8,Z=null,Dc=null,Oc=[],kc=new Map,Ac=[],jc=new Set,Mc=null,Nc=null,Pc=0,Fc=0,Ic=0,Q=1,Lc=!1,Rc=!1,zc=0,Bc=0;function Vc(e,t,n){e.addEventListener(t,n),Ac.push(()=>e.removeEventListener(t,n))}function Hc(e,t){let n=window.setTimeout(()=>{jc.delete(n),e()},t);jc.add(n)}function Uc(e){Ac=[],jc=new Set,kc=new Map,Lc=!1,Rc=!1,zc=0,Fc=0,Ic=0,e.innerHTML=`
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
        ${wc.map((e,t)=>`<div class="aq-fisch" data-i="${t}">${Tc(e)}</div>`).join(``)}
      </div>
      <div class="aq-effekte" id="aqEffekte"></div>
    </div>
  `,Z=e.querySelector(`#aquariumStage`),Dc=e.querySelector(`#aqEffekte`),Oc=wc.map((t,n)=>({el:e.querySelector(`.aq-fisch[data-i="${n}"]`),w:t.laenge,h:t.laenge*.6,x:0,y:0,vx:0,vy:0,zx:0,zy:0,zielBis:0,fliehtBis:0,blick:Math.random()<.5?1:-1,tempo:38+Math.random()*26})),Mc=new ResizeObserver(()=>Wc()),Mc.observe(Z),Vc(Z,`pointerdown`,e=>{let t=e;if(t.preventDefault(),!Lc)return;try{Z?.setPointerCapture(t.pointerId)}catch{}let n=Gc(t.clientX,t.clientY);kc.set(t.pointerId,n),Jc(n.x,n.y),Xc()}),Vc(Z,`pointermove`,e=>{let t=e;kc.has(t.pointerId)&&kc.set(t.pointerId,Gc(t.clientX,t.clientY))});let t=e=>kc.delete(e.pointerId);Vc(Z,`pointerup`,t),Vc(Z,`pointercancel`,t),Ac.push(De(e=>{Rc=e,e||Xc()}))}function Wc(){if(!Z)return;let e=Z.clientWidth,t=Z.clientHeight;if(e<1||t<1)return;let n=Fc,r=Ic;Fc=e,Ic=t,Q=Math.max(.55,Math.min(1.25,Math.min(e,t)/834)),Oc.forEach((i,a)=>{i.w=wc[a].laenge*Q,i.h=i.w*.6,i.el.style.width=`${i.w.toFixed(1)}px`,i.el.style.height=`${i.h.toFixed(1)}px`,Lc?n>0&&r>0&&(i.x*=e/n,i.y*=t/r,i.zx*=e/n,i.zy*=t/r):(i.x=e*(.15+Math.random()*.7),i.y=t*(.15+Math.random()*.55),qc(i,0))}),Lc||(Lc=!0,Z.classList.add(`bereit`)),$c(),Xc()}function Gc(e,t){let n=Z.getBoundingClientRect(),r=n.width>0?Z.clientWidth/n.width:1,i=n.height>0?Z.clientHeight/n.height:1;return{x:(e-n.left)*r,y:(t-n.top)*i}}function Kc(){return{x0:Fc*.06,x1:Fc*.94,y0:Ic*.1,y1:Ic*.76}}function qc(e,t){let n=Kc();e.zx=n.x0+Math.random()*(n.x1-n.x0),e.zy=n.y0+Math.random()*(n.y1-n.y0),e.zielBis=t+4e3+Math.random()*5e3}function Jc(e,t){let n=performance.now(),r=300*Q;for(let i of Oc){let a=i.x-e,o=i.y-t,s=Math.hypot(a,o);if(s>r)continue;let c=s<1?{x:Math.random()-.5,y:Math.random()-.5}:{x:a/s,y:o/s},l=Math.hypot(c.x,c.y)||1,u=(420+260*(1-s/r))*Q;i.vx=c.x/l*u,i.vy=c.y/l*u,i.fliehtBis=n+900}Yc(e,t),n-Bc>90&&(Bc=n,se(240+Math.random()*60,680+Math.random()*160,.09,.2))}function Yc(e,t){if(!Dc||zc>=Ec)return;let n=document.createElement(`span`);n.className=`aq-welle`,n.style.transform=`translate(${e.toFixed(0)}px, ${t.toFixed(0)}px)`,n.innerHTML=`<i></i><b></b><b></b><b></b>`,Dc.appendChild(n),zc++,Hc(()=>{n.remove(),zc=Math.max(0,zc-1)},1300)}function Xc(){Nc!==null||Rc||!Lc||(Pc=performance.now(),Nc=requestAnimationFrame(Zc))}function Zc(e){let t=Math.min(.1,Math.max(.001,(e-Pc)/1e3));Pc=e;let n=Math.ceil(t/.02);for(let r=0;r<n;r++)Qc(t/n,e);$c(),Nc=Rc?null:requestAnimationFrame(Zc)}function Qc(e,t){let n=Kc(),r=[...kc.values()];Oc.forEach((i,a)=>{if(t<i.fliehtBis){let t=Math.exp(-2.2*e);i.vx*=t,i.vy*=t}else{let n=i.zx,o=i.zy,s=i.tempo*Q;if(r.length>0){let e=r[0],c=1/0;for(let t of r){let n=Math.hypot(t.x-i.x,t.y-i.y);n<c&&(c=n,e=t)}let l=a/Oc.length*Math.PI*2+t/2400,u=(70+a%3*30)*Q;n=e.x+Math.cos(l)*u,o=e.y+Math.sin(l)*u*.6,s=170*Q}else(t>i.zielBis||Math.hypot(i.zx-i.x,i.zy-i.y)<30*Q)&&qc(i,t);let c=n-i.x,l=o-i.y,u=Math.hypot(c,l)||1,d=s*Math.min(1,u/(60*Q)),f=c/u*d,p=l/u*d,m=Math.min(1,e*1.6);i.vx+=(f-i.vx)*m,i.vy+=(p-i.vy)*m}i.x+=i.vx*e,i.y+=i.vy*e,i.x<n.x0&&(i.vx+=(n.x0-i.x)*e*6),i.x>n.x1&&(i.vx-=(i.x-n.x1)*e*6),i.y<n.y0&&(i.vy+=(n.y0-i.y)*e*6),i.y>n.y1&&(i.vy-=(i.y-n.y1)*e*6),i.x=Math.max(i.w/2,Math.min(Fc-i.w/2,i.x)),i.y=Math.max(i.h/2,Math.min(Ic-i.h/2,i.y)),i.vx>12?i.blick=1:i.vx<-12&&(i.blick=-1)})}function $c(){for(let e of Oc){let t=Math.max(-18,Math.min(18,Math.atan2(e.vy,Math.abs(e.vx)+1)*180/Math.PI));e.el.style.transform=`translate(${(e.x-e.w/2).toFixed(1)}px, ${(e.y-e.h/2).toFixed(1)}px) scaleX(${e.blick}) rotate(${t.toFixed(1)}deg)`}}function el(){Ac.forEach(e=>e()),Ac=[],jc.forEach(e=>window.clearTimeout(e)),jc=new Set,Nc!==null&&(cancelAnimationFrame(Nc),Nc=null),Mc?.disconnect(),Mc=null,kc=new Map,Oc=[],Z=null,Dc=null,Lc=!1}var tl={id:`aquarium`,name:`Aquarium`,accent:`#7ec8d8`,tileIcon:Cc,mount:Uc,unmount:el},nl=`
<svg viewBox="0 0 120 120" width="100%" height="100%">
  <line x1="6" y1="20" x2="114" y2="20" stroke="#a9835e" stroke-width="3"/>
  <circle cx="60" cy="72" r="26" fill="#c9a37e"/>
  <circle cx="40" cy="50" r="10" fill="#c9a37e"/><circle cx="80" cy="50" r="10" fill="#c9a37e"/>
  <circle cx="51" cy="70" r="4" fill="#4a4032"/><circle cx="69" cy="70" r="4" fill="#4a4032"/>
  <ellipse cx="60" cy="81" rx="7" ry="4.5" fill="#8a7255"/>
  <path d="M18 22 H102 V40 C90 46 30 46 18 40 Z" fill="#e88a9a"/>
  <rect x="34" y="16" width="6" height="12" rx="2" fill="#f4c86b"/><rect x="80" y="16" width="6" height="12" rx="2" fill="#f4c86b"/>
</svg>`,rl={baer:`
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
    <g class="kk-pfote"><ellipse cx="98" cy="88" rx="9" ry="18" fill="#3f4a5c" transform="rotate(-24 98 88)"/></g>`},il=Object.keys(rl),al=[{farbe:`#e88a9a`,muster:`#f2b8c6`},{farbe:`#7ea3c9`,muster:`#a9c4e0`},{farbe:`#f4c86b`,muster:`#fae3a6`},{farbe:`#7fb99e`,muster:`#acd6c0`},{farbe:`#c896d8`,muster:`#dfc1ea`},{farbe:`#e0a458`,muster:`#efc895`}],ol=2400,sl=null,cl=[],ll=[],ul=new Set,dl=new Map,fl=0;function pl(e,t,n){e.addEventListener(t,n),ll.push(()=>e.removeEventListener(t,n))}function ml(e,t){let n=window.setTimeout(()=>{ul.delete(n),e()},t);return ul.add(n),n}function hl(e){return`<svg viewBox="0 0 120 120" width="100%" height="100%">${rl[e]}</svg>`}function gl(e){let t=new Set(cl.map(e=>e.tier)),n=il.filter(n=>n!==e&&!t.has(n)),r=n.length>0?n:il.filter(t=>t!==e);return r[Math.floor(Math.random()*r.length)]}function _l(e){ll=[],ul=new Set,dl=new Map,cl=[];let t=[...il].sort(()=>Math.random()-.5).slice(0,al.length);e.innerHTML=`
    <div class="kuckuck-stage" id="kuckuckStage">
      <div class="kuckuck-raster">
        ${al.map((e,n)=>`
          <div class="kk-versteck" data-i="${n}">
            <div class="kk-leine"></div>
            <div class="kk-tier">${hl(t[n])}</div>
            <div class="kk-tuch" style="--tuch:${e.farbe};--muster:${e.muster}"></div>
            <span class="kk-klammer l"></span><span class="kk-klammer r"></span>
          </div>`).join(``)}
      </div>
    </div>
  `,sl=e.querySelector(`#kuckuckStage`),cl=[...e.querySelectorAll(`.kk-versteck`)].map((e,n)=>({cell:e,tierEl:e.querySelector(`.kk-tier`),tier:t[n],offen:!1,zuTimer:null})),pl(sl,`pointerdown`,e=>{let t=e;t.preventDefault();try{sl?.setPointerCapture(t.pointerId)}catch{}let n=vl(t.clientX,t.clientY);dl.set(t.pointerId,n),bl(n)}),pl(sl,`pointermove`,e=>{let t=e;if(!dl.has(t.pointerId))return;let n=yl(t.clientX,t.clientY);n!==dl.get(t.pointerId)&&(dl.set(t.pointerId,n),n>=0&&bl(n))});let n=e=>dl.delete(e.pointerId);pl(sl,`pointerup`,n),pl(sl,`pointercancel`,n)}function vl(e,t){let n=0,r=1/0;return cl.forEach((i,a)=>{let o=i.cell.getBoundingClientRect(),s=Math.hypot(e-(o.left+o.width/2),t-(o.top+o.height/2));s<r&&(r=s,n=a)}),n}function yl(e,t){return cl.findIndex(n=>{let r=n.cell.getBoundingClientRect();return e>=r.left&&e<=r.right&&t>=r.top&&t<=r.bottom})}function bl(e){let t=cl[e];if(!t)return;t.zuTimer!==null&&(window.clearTimeout(t.zuTimer),ul.delete(t.zuTimer));let n=t.offen;t.offen=!0,t.cell.classList.add(`offen`),t.tierEl.classList.remove(`winkt`),t.tierEl.offsetWidth,t.tierEl.classList.add(`winkt`);let r=performance.now();r-fl>320&&(fl=r,n||g(),ml(()=>m({freq:659.25,duration:.14,attack:.02,release:.22,gain:.24}),120),ml(()=>m({freq:523.25,duration:.22,attack:.02,release:.3,gain:.22}),330)),t.zuTimer=ml(()=>{t.zuTimer=null,t.offen=!1,t.cell.classList.remove(`offen`),t.tierEl.classList.remove(`winkt`),ml(()=>{t.offen||(t.tier=gl(t.tier),t.tierEl.innerHTML=hl(t.tier))},600)},ol)}function xl(){ll.forEach(e=>e()),ll=[],ul.forEach(e=>window.clearTimeout(e)),ul=new Set,dl=new Map,cl=[],sl=null}var Sl={id:`kuckuck`,name:`Kuckuck`,accent:`#e88a9a`,tileIcon:nl,mount:_l,unmount:xl};me();var Cl=[dt,At,$t,wn,Rn,fr,Lr,li,wi,Xi,Ua,Qo,Is,Sc,tl,Sl],wl=document.querySelector(`#app`),Tl=`
  <svg viewBox="0 0 96 96" width="40" height="40">
    <path d="M56 26 L34 48 L56 70" fill="none" stroke="#8a7255" stroke-width="8"
      stroke-linecap="round" stroke-linejoin="round"/>
  </svg>
`,El=18,Dl=2*Math.PI*El;wl.innerHTML=`
  <div class="spielzimmer" id="spielzimmer">
    <div class="tiles" id="tiles"></div>
    <button class="eltern-gate" id="elternGate" aria-hidden="true">${`
  <svg viewBox="0 0 44 44">
    <circle cx="22" cy="22" r="${El}" fill="none" stroke="#8a7255" stroke-width="3" opacity="0.25"/>
    <circle class="eltern-gate-progress" cx="22" cy="22" r="${El}" fill="none"
      stroke="#8a7255" stroke-width="3" stroke-linecap="round"
      stroke-dasharray="${Dl}" stroke-dashoffset="${Dl}"
      transform="rotate(-90 22 22)"/>
    <circle cx="22" cy="22" r="4" fill="#8a7255"/>
  </svg>
`}</button>
  </div>
  <div class="toy-view" id="toyView">
    <div class="toy-stage" id="toyStage"></div>
  </div>
  <button class="back-button" id="backButton" aria-hidden="true">${Tl}</button>
  <div class="eltern-overlay" id="elternOverlay">
    <div id="elternPanelWrap"></div>
  </div>
  <div class="version-placeholder">v1.2.0 · aa78c6f</div>
  <div class="nacht-dimmer" id="nachtDimmer"></div>
`;var Ol=document.querySelector(`#spielzimmer`),kl=document.querySelector(`#tiles`),Al=document.querySelector(`#toyView`),jl=document.querySelector(`#toyStage`),$=document.querySelector(`#backButton`),Ml=document.querySelector(`#elternGate`),Nl=document.querySelector(`#elternOverlay`),Pl=document.querySelector(`#elternPanelWrap`),Fl=null,Il=!1;function Ll(){let e=new Set(_e()),t=Cl.filter(t=>!e.has(t.id));return t.length>0?t:Cl}function Rl(){kl.innerHTML=``,Ll().forEach((e,t)=>{let n=document.createElement(`button`);n.className=`tile`,n.style.setProperty(`--accent`,e.accent),n.style.animationDelay=`${(t*.7%4.5).toFixed(2)}s`,n.innerHTML=e.tileIcon,n.setAttribute(`aria-hidden`,`true`),n.addEventListener(`pointerdown`,t=>{t.preventDefault(),Vl(e)}),kl.appendChild(n)}),zl()}function zl(){let e=kl.childElementCount;if(e===0)return;let t=window.innerWidth,n=window.innerHeight,r=Math.min(t,n),i=Math.min(40,Math.max(12,r*.04)),a=Math.min(36,Math.max(14,r*.034)),o=t-2*i,s=n-2*i-36,c={cols:1,size:0};for(let t=1;t<=e;t++){let n=Math.ceil(e/t),r=Math.min((o-(t-1)*a)/t,(s-(n-1)*a)/n);r>c.size&&(c={cols:t,size:r})}let l=Math.max(72,Math.min(220,c.size));kl.style.gridTemplateColumns=`repeat(${c.cols}, auto)`,kl.style.setProperty(`--tile`,`${Math.floor(l)}px`),kl.style.setProperty(`--tile-gap`,`${Math.floor(a)}px`)}window.addEventListener(`resize`,zl);function Bl(){document.documentElement.classList.toggle(`nachtflug`,ge())}function Vl(e){Il||Fl||(Il=!0,Fl=e,e.mount(jl),Ol.classList.add(`hidden`),$.classList.add(`visible`),Al.classList.add(`active`),window.setTimeout(()=>{Il=!1},450))}function Hl(){Il||!Fl||(Il=!0,Al.classList.remove(`active`),Ol.classList.remove(`hidden`),$.classList.remove(`visible`),window.setTimeout(()=>{Fl?.unmount?.(),jl.innerHTML=``,Fl=null,Il=!1},450))}var Ul=150,Wl=1200,Gl=40,Kl={id:-1,at:-1/0},ql={id:-1,at:-1/0},Jl=null;document.addEventListener(`pointerdown`,e=>{Jl&&e.pointerId!==Jl.id&&(Jl.valid=!1),Kl=ql,ql={id:e.pointerId,at:e.timeStamp}},{capture:!0});function Yl(){Jl=null,$.classList.remove(`gedrueckt`)}$.addEventListener(`pointerdown`,e=>{e.preventDefault();let t=e.timeStamp,n=Kl.id!==e.pointerId&&t-Kl.at<Ul,r=Jl!==null;Jl={id:e.pointerId,at:t,x:e.clientX,y:e.clientY,valid:!n&&!r},$.classList.add(`gedrueckt`);try{$.setPointerCapture(e.pointerId)}catch{}}),$.addEventListener(`pointerup`,e=>{let t=Jl;if(Yl(),!t||t.id!==e.pointerId||!t.valid)return;let n=$.getBoundingClientRect(),r=e.clientX>=n.left&&e.clientX<=n.right&&e.clientY>=n.top&&e.clientY<=n.bottom,i=e.timeStamp-t.at<Wl,a=Math.hypot(e.clientX-t.x,e.clientY-t.y)<Gl;r&&i&&a&&Hl()}),$.addEventListener(`pointercancel`,Yl);var Xl=3e3,Zl=null;function Ql(){Zl===null&&(Ml.classList.add(`charging`),Zl=window.setTimeout(()=>{Zl=null,Ml.classList.remove(`charging`),eu()},Xl))}function $l(){Zl!==null&&(window.clearTimeout(Zl),Zl=null),Ml.classList.remove(`charging`)}Ml.addEventListener(`pointerdown`,e=>{e.preventDefault(),Ql()}),Ml.addEventListener(`pointerup`,$l),Ml.addEventListener(`pointercancel`,$l),Ml.addEventListener(`pointerleave`,$l);function eu(){ve(Pl,{toys:Cl,onChange:()=>{Bl(),Rl()}}),Nl.classList.add(`active`)}function tu(){Nl.classList.remove(`active`)}Nl.addEventListener(`pointerdown`,e=>{e.target===Nl&&tu()}),document.addEventListener(`click`,e=>{e.target.closest(`.eltern-close`)&&tu()}),document.addEventListener(`gesturestart`,e=>e.preventDefault()),document.addEventListener(`gesturechange`,e=>e.preventDefault()),document.addEventListener(`dblclick`,e=>e.preventDefault()),document.addEventListener(`contextmenu`,e=>e.preventDefault());var nu=!1;document.addEventListener(`pointerdown`,()=>{s(),nu||(nu=!0,window.setTimeout(()=>{f()&&m({freq:523.25,duration:.15,gain:.25})},80))},{once:!1}),Bl(),Oe(),Rl();