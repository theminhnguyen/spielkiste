(function(){let e=document.createElement(`link`).relList;if(e&&e.supports&&e.supports(`modulepreload`))return;for(let e of document.querySelectorAll(`link[rel="modulepreload"]`))n(e);new MutationObserver(e=>{for(let t of e)if(t.type===`childList`)for(let e of t.addedNodes)e.tagName===`LINK`&&e.rel===`modulepreload`&&n(e)}).observe(document,{childList:!0,subtree:!0});function t(e){let t={};return e.integrity&&(t.integrity=e.integrity),e.referrerPolicy&&(t.referrerPolicy=e.referrerPolicy),t.credentials=e.crossOrigin===`use-credentials`?`include`:e.crossOrigin===`anonymous`?`omit`:`same-origin`,t}function n(e){if(e.ep)return;e.ep=!0;let n=t(e);fetch(e.href,n)}})();var e=null,t=null,n=!1,r=null,i=null;function a(){if(e)return e;try{let r=window.AudioContext??window.webkitAudioContext;return r?(e=new r,e.onstatechange=()=>{e?.state===`running`&&(n=!0)},t=e.createGain(),t.gain.value=u(),t.connect(e.destination),e):(i=`AudioContext wird vom Browser nicht unterstützt`,null)}catch(t){return i=t instanceof Error?t.message:String(t),e=null,null}}function o(){let e=new Uint8Array(45),t=new DataView(e.buffer),n=(e,n)=>{for(let r=0;r<n.length;r++)t.setUint8(e+r,n.charCodeAt(r))};n(0,`RIFF`),t.setUint32(4,37,!0),n(8,`WAVE`),n(12,`fmt `),t.setUint32(16,16,!0),t.setUint16(20,1,!0),t.setUint16(22,1,!0),t.setUint32(24,8e3,!0),t.setUint32(28,8e3,!0),t.setUint16(32,1,!0),t.setUint16(34,8,!0),n(36,`data`),t.setUint32(40,1,!0),t.setUint8(44,128);let r=``;return e.forEach(e=>r+=String.fromCharCode(e)),`data:audio/wav;base64,${btoa(r)}`}function s(){if(!n)try{let e=a();if(!e)return;e.state===`running`?n=!0:e.state===`closed`?i=`AudioContext im Zustand "${e.state}"`:e.resume().then(()=>{e.state===`running`&&(n=!0)}).catch(t=>{i=`resume() abgelehnt (Zustand war "${e.state}"): ${t instanceof Error?t.message:String(t)}`}),r||(r=new Audio(o()),r.volume=.01,r.setAttribute(`playsinline`,`true`));try{r.currentTime=0}catch{}r.play().catch(e=>{i=`stilles <audio> abgelehnt: ${e instanceof Error?e.message:String(e)}`})}catch(e){i=e instanceof Error?`${e.name}: ${e.message}`:String(e)}}function c(){let t=[];t.push(e?`Status: ${e.state}`:`Status: noch nicht gestartet`),t.push(n?`freigeschaltet: ja`:`freigeschaltet: nein`),t.push(`Lautstärke: ${Math.round(l*100)}%`);let r=!!(window.AudioContext??window.webkitAudioContext);return t.push(`AudioContext unterstützt: ${r?`ja`:`nein`}`),i&&t.push(`letzter Fehler: ${i}`),t.join(` · `)}var l=.6;function u(){return l}function d(e){l=Math.max(0,Math.min(1,e)),t&&(t.gain.value=l)}function f(){return!!e&&e.state===`running`}var p=[261.63,293.66,329.63,392,440,523.25,587.33,659.25];function m(n){let r=e;if(!r||!t||r.state!==`running`)return;let{freq:i,duration:a=.5,attack:o=.02,release:s=.35,type:c=`sine`,gain:l=.5}=n,u=r.createOscillator();u.type=c,u.frequency.value=i;let d=r.createGain();d.gain.setValueAtTime(0,r.currentTime),d.gain.linearRampToValueAtTime(l,r.currentTime+o),d.gain.linearRampToValueAtTime(0,r.currentTime+o+a+s),u.connect(d),d.connect(t),u.start(),u.stop(r.currentTime+o+a+s+.05)}function h(e=440){m({freq:e,duration:.03,attack:.002,release:.08,type:`triangle`,gain:.3})}function ee(n,r=.28){let i=e;if(!i||!t||i.state!==`running`)return null;let a=i.createOscillator();a.type=`sine`,a.frequency.value=n;let o=i.createGain();o.gain.setValueAtTime(0,i.currentTime),o.gain.linearRampToValueAtTime(r,i.currentTime+.05),a.connect(o),o.connect(t),a.start();let s=!1;return{update(e){s||a.frequency.linearRampToValueAtTime(e,i.currentTime+.06)},stop(){s||(s=!0,o.gain.cancelScheduledValues(i.currentTime),o.gain.setValueAtTime(o.gain.value,i.currentTime),o.gain.linearRampToValueAtTime(0,i.currentTime+.15),a.stop(i.currentTime+.2))}}}var te=null;function ne(e){if(te)return te;let t=e.sampleRate*.5,n=e.createBuffer(1,t,e.sampleRate),r=n.getChannelData(0);for(let e=0;e<t;e++)r[e]=Math.random()*2-1;return te=n,n}function re(n){let r=e;if(!r||!t||r.state!==`running`)return;let i=r.createBufferSource();i.buffer=ne(r);let a=r.createBiquadFilter();a.type=`bandpass`,a.Q.value=8;let o=n?700:2200,s=n?2200:700;a.frequency.setValueAtTime(o,r.currentTime),a.frequency.linearRampToValueAtTime(s,r.currentTime+.35);let c=r.createGain();c.gain.setValueAtTime(0,r.currentTime),c.gain.linearRampToValueAtTime(.18,r.currentTime+.03),c.gain.linearRampToValueAtTime(0,r.currentTime+.38),i.connect(a),a.connect(c),c.connect(t),i.start(),i.stop(r.currentTime+.4)}function ie(n,r=.4,i=.55){let a=e;if(!a||!t||a.state!==`running`)return;let o=a.currentTime,s=Math.max(.001,r),c=a.createOscillator();c.type=`sine`,c.frequency.setValueAtTime(n*2.2,o),c.frequency.exponentialRampToValueAtTime(n,o+.07);let l=a.createGain();l.gain.setValueAtTime(1e-4,o),l.gain.exponentialRampToValueAtTime(s,o+.006),l.gain.exponentialRampToValueAtTime(1e-4,o+i),c.connect(l),l.connect(t),c.start(o),c.stop(o+i+.05);let u=a.createOscillator();u.type=`triangle`,u.frequency.setValueAtTime(n*4,o),u.frequency.exponentialRampToValueAtTime(n*2,o+.05);let d=a.createGain();d.gain.setValueAtTime(1e-4,o),d.gain.exponentialRampToValueAtTime(s*.35,o+.005),d.gain.exponentialRampToValueAtTime(1e-4,o+i*.45),u.connect(d),d.connect(t),u.start(o),u.stop(o+i*.45+.05);let f=a.createBufferSource();f.buffer=ne(a);let p=a.createBiquadFilter();p.type=`lowpass`,p.frequency.value=900;let m=a.createGain();m.gain.setValueAtTime(s*.5,o),m.gain.exponentialRampToValueAtTime(1e-4,o+.08),f.connect(p),p.connect(m),m.connect(t),f.start(o,Math.random()*.3),f.stop(o+.1)}function ae(n,r=.25){let i=e;if(!i||!t||i.state!==`running`)return;let a=i.currentTime,o=i.createOscillator();o.type=`sine`,o.frequency.setValueAtTime(n*1.8,a),o.frequency.exponentialRampToValueAtTime(n,a+.04);let s=i.createGain();s.gain.setValueAtTime(1e-4,a),s.gain.exponentialRampToValueAtTime(Math.max(.001,r),a+.004),s.gain.exponentialRampToValueAtTime(1e-4,a+.22),o.connect(s),s.connect(t),o.start(a),o.stop(a+.26)}function oe(n=.15,r=.3){let i=e;if(!i||!t||i.state!==`running`)return;let a=i.currentTime,o=i.createBufferSource();o.buffer=ne(i);let s=i.createBiquadFilter();s.type=`highpass`,s.frequency.value=1800;let c=i.createBiquadFilter();c.type=`bandpass`,c.frequency.value=3e3+Math.random()*2e3,c.Q.value=.7;let l=i.createGain();l.gain.setValueAtTime(0,a);for(let e=0;e<8;e++){let t=a+r*e/8,i=1-e/8;l.gain.linearRampToValueAtTime(n*i*(.4+Math.random()*.6),t+.012)}l.gain.linearRampToValueAtTime(0,a+r+.04),o.connect(s),s.connect(c),c.connect(l),l.connect(t),o.start(a,Math.random()*Math.max(0,.5-r-.05)),o.stop(a+r+.06)}function g(){let n=e;if(!n||!t||n.state!==`running`)return;let r=n.createBufferSource();r.buffer=ne(n);let i=n.createBiquadFilter();i.type=`lowpass`,i.frequency.setValueAtTime(300,n.currentTime),i.frequency.linearRampToValueAtTime(1400,n.currentTime+.25);let a=n.createGain();a.gain.setValueAtTime(0,n.currentTime),a.gain.linearRampToValueAtTime(.14,n.currentTime+.05),a.gain.linearRampToValueAtTime(0,n.currentTime+.3),r.connect(i),i.connect(a),a.connect(t),r.start(),r.stop(n.currentTime+.32)}var se=`spielkiste:`;function _(e,t,n){try{let r=localStorage.getItem(se+e);if(!r)return n;let i=JSON.parse(r);return i.v===t?i.data:n}catch{return n}}function v(e,t,n){try{let r={v:t,data:n};localStorage.setItem(se+e,JSON.stringify(r))}catch{}}function ce(){try{let e=[];for(let t=0;t<localStorage.length;t++){let n=localStorage.key(t);n?.startsWith(se)&&e.push(n)}e.forEach(e=>localStorage.removeItem(e))}catch{}}var le=`settings`,ue=1;function de(){d(_(le,ue,{volume:.6}).volume)}function fe(e){v(le,ue,{volume:e})}function pe(e){e.innerHTML=`
    <div class="eltern-panel">
      <h1>Spielkiste</h1>
      <p class="eltern-version">Version 1.1.2 · c73966e</p>

      <label class="eltern-field">
        <span>Lautstärke</span>
        <input type="range" min="0" max="100" value="${Math.round(u()*100)}" class="eltern-volume" />
      </label>

      <div class="eltern-audio-diag">
        <button class="eltern-test-ton">Test-Ton abspielen</button>
        <p class="eltern-audio-status"></p>
      </div>

      <div class="eltern-reset-zone">
        <button class="eltern-reset-btn">Alles zurücksetzen</button>
        <div class="eltern-reset-confirm" hidden>
          <p>Wirklich alle gespeicherten Spielstände löschen (Bild, Sticker, Schalterstellungen)?</p>
          <div class="eltern-reset-actions">
            <button class="eltern-reset-cancel">Abbrechen</button>
            <button class="eltern-reset-confirm-btn">Ja, zurücksetzen</button>
          </div>
        </div>
      </div>

      <button class="eltern-close">Schließen</button>
    </div>
  `;let t=e.querySelector(`.eltern-volume`);t.addEventListener(`input`,()=>{d(Number(t.value)/100)}),t.addEventListener(`change`,()=>{fe(Number(t.value)/100),h(500)});let n=e.querySelector(`.eltern-audio-status`);function r(){n.textContent=c()}r(),window.setTimeout(r,400),e.querySelector(`.eltern-test-ton`).addEventListener(`click`,()=>{s(),m({freq:523.25,duration:.3,attack:.01,release:.3,gain:.4}),r(),window.setTimeout(r,400)});let i=e.querySelector(`.eltern-reset-btn`),a=e.querySelector(`.eltern-reset-confirm`),o=e.querySelector(`.eltern-reset-cancel`),l=e.querySelector(`.eltern-reset-confirm-btn`);i.addEventListener(`click`,()=>{i.hidden=!0,a.hidden=!1}),o.addEventListener(`click`,()=>{a.hidden=!0,i.hidden=!1}),l.addEventListener(`click`,()=>{ce(),window.location.reload()})}var me=`
<svg viewBox="0 0 120 120" width="100%" height="100%">
  <rect x="14" y="14" width="92" height="92" rx="18" fill="#fdf6ea" stroke="#e0a458" stroke-width="4"/>
  <circle cx="42" cy="46" r="10" fill="#e0a458"/>
  <rect x="66" y="38" width="34" height="14" rx="7" fill="#7fb99e"/>
  <circle cx="42" cy="80" r="12" fill="#e88a9a"/>
  <rect x="66" y="72" width="34" height="14" rx="7" fill="#f4a56b"/>
</svg>`,he=`brett`,ge=2,_e={switchOn:!1,knobStep:0,sliderValue:.3,zipperOpen:!1,doorIndex:0,curtainOpen:!1,veloOpen:!1,beads:[.08,.28,.48,.68],kaleidoStep:0},ve=[`<svg viewBox="0 0 100 100"><circle cx="50" cy="55" r="30" fill="#f2c9a0"/><circle cx="28" cy="30" r="14" fill="#f2c9a0"/><circle cx="72" cy="30" r="14" fill="#f2c9a0"/><circle cx="40" cy="52" r="4" fill="#4a4032"/><circle cx="60" cy="52" r="4" fill="#4a4032"/><ellipse cx="50" cy="64" rx="6" ry="4" fill="#e88a9a"/></svg>`,`<svg viewBox="0 0 100 100"><ellipse cx="50" cy="58" rx="26" ry="28" fill="#e8dfd0"/><ellipse cx="35" cy="20" rx="8" ry="18" fill="#e8dfd0"/><ellipse cx="65" cy="20" rx="8" ry="18" fill="#e8dfd0"/><circle cx="40" cy="55" r="4" fill="#4a4032"/><circle cx="60" cy="55" r="4" fill="#4a4032"/><ellipse cx="50" cy="66" rx="5" ry="3" fill="#e88a9a"/></svg>`,`<svg viewBox="0 0 100 100"><circle cx="50" cy="55" r="32" fill="#c9a37e"/><circle cx="22" cy="32" r="12" fill="#c9a37e"/><circle cx="78" cy="32" r="12" fill="#c9a37e"/><circle cx="40" cy="52" r="4" fill="#4a4032"/><circle cx="60" cy="52" r="4" fill="#4a4032"/><ellipse cx="50" cy="66" rx="8" ry="5" fill="#8a7255"/></svg>`],y={..._e},ye=[],be=null,xe=[],Se=0;function b(e,t,n){e.addEventListener(t,n),ye.push(()=>e.removeEventListener(t,n))}function x(){v(he,ge,y)}function Ce(e){y=_(he,ge,{..._e}),ye=[],be=null,xe=[],Se=0,e.innerHTML=`
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
            <div class="door-animal">${ve[y.doorIndex%ve.length]}</div>
            <div class="door-panel"></div>
          </div>
        </div>

        <div class="brett-mod brett-gears" data-mod="gears">
          <svg class="gear g-big" viewBox="0 0 100 100" width="66" height="66">${we(`#7fb99e`)}</svg>
          <svg class="gear g-small" viewBox="0 0 100 100" width="44" height="44">${we(`#e0a458`)}</svg>
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
            <div class="crank-pop">${ve[0]}</div>
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
  `,Te(e),De(e),ke(e),Ae(e),Me(e),Pe(e),Ie(e),Re(e),ze(e),Be(e),He(e),We(e),Ke(e),Je(e)}function we(e){return`${Array.from({length:8},(t,n)=>`<rect x="44" y="2" width="12" height="18" rx="3" fill="${e}" transform="rotate(${n*360/8} 50 50)"/>`).join(``)}<circle cx="50" cy="50" r="34" fill="${e}"/><circle cx="50" cy="50" r="11" fill="#fffaf2"/>`}function Te(e){let t=e.querySelector(`.brett-switch`);Ee(t),b(t,`pointerdown`,e=>{e.preventDefault(),y.switchOn=!y.switchOn,Ee(t),m({freq:y.switchOn?440:330,duration:.05,attack:.002,release:.1,type:`square`,gain:.25}),x()})}function Ee(e){e.classList.toggle(`on`,y.switchOn)}function De(e){let t=e.querySelector(`.brett-knob`),n=t.querySelector(`.knob-dial`);Oe(n);let r=!1;function i(e,t){let r=n.getBoundingClientRect(),i=r.left+r.width/2,a=r.top+r.height/2,o=e-i,s=t-a,c=Math.atan2(s,o)*180/Math.PI+90;return c<0&&(c+=360),Math.round(c/45)%8}b(t,`pointerdown`,e=>{let n=e;n.preventDefault(),r=!0;try{t.setPointerCapture(n.pointerId)}catch{}o(n.clientX,n.clientY)}),b(t,`pointermove`,e=>{if(!r)return;let t=e;o(t.clientX,t.clientY)});function a(e){if(!r)return;r=!1;let n=e;if(n.pointerId!==void 0)try{t.releasePointerCapture(n.pointerId)}catch{}}b(t,`pointerup`,a),b(t,`pointercancel`,a);function o(e,t){let r=i(e,t);r!==y.knobStep&&(y.knobStep=r,Oe(n),m({freq:p[r%p.length],duration:.04,attack:.002,release:.08,type:`triangle`,gain:.25}),x())}}function Oe(e){e.style.transform=`rotate(${y.knobStep*45}deg)`}function ke(e){e.querySelectorAll(`.press-btn`).forEach(e=>{b(e,`pointerdown`,t=>{t.preventDefault(),m({freq:p[Number(e.dataset.note??`0`)%p.length],duration:.3,gain:.4}),e.classList.add(`pressed`),window.setTimeout(()=>e.classList.remove(`pressed`),260)})})}function Ae(e){let t=e.querySelector(`.brett-slider`),n=t.querySelector(`.slider-track`),r=t.querySelector(`.slider-handle`),i=t.querySelector(`.slider-fill`);je(r,i);let a=!1;function o(e){let t=n.getBoundingClientRect(),r=(e-t.left)/t.width;return Math.max(0,Math.min(1,r))}function s(e){return 220*4**e}b(t,`pointerdown`,e=>{let n=e;n.preventDefault(),a=!0;try{t.setPointerCapture(n.pointerId)}catch{}y.sliderValue=o(n.clientX),je(r,i),be=ee(s(y.sliderValue))}),b(t,`pointermove`,e=>{a&&(y.sliderValue=o(e.clientX),je(r,i),be?.update(s(y.sliderValue)))});function c(e){if(!a)return;a=!1,be?.stop(),be=null;let n=e;if(n.pointerId!==void 0)try{t.releasePointerCapture(n.pointerId)}catch{}x()}b(t,`pointerup`,c),b(t,`pointercancel`,c)}function je(e,t){let n=y.sliderValue*100;e.style.left=`${n}%`,t.style.width=`${n}%`}function Me(e){let t=e.querySelector(`.brett-zipper`),n=t.querySelector(`.zipper-track`),r=t.querySelector(`.zipper-pull`);Ne(t);let i=!1,a=0,o=0;b(t,`pointerdown`,e=>{let n=e;n.preventDefault(),i=!0,o=0,a=n.clientY;try{t.setPointerCapture(n.pointerId)}catch{}}),b(t,`pointermove`,e=>{if(!i)return;let t=e,s=n.getBoundingClientRect(),c=Math.max(0,Math.min(1,(t.clientY-s.top)/s.height));o+=Math.abs(t.clientY-a),a=t.clientY,r.style.top=`${c*100}%`});function s(e){if(!i)return;i=!1;let a=e;if(a.pointerId!==void 0)try{t.releasePointerCapture(a.pointerId)}catch{}let s=n.getBoundingClientRect(),c=r.getBoundingClientRect(),l=(c.top+c.height/2-s.top)/s.height,u=y.zipperOpen,d=o<6?!y.zipperOpen:l>.5;d!==u&&(y.zipperOpen=d,re(d),x()),Ne(t)}b(t,`pointerup`,s),b(t,`pointercancel`,s)}function Ne(e){e.classList.toggle(`open`,y.zipperOpen);let t=e.querySelector(`.zipper-pull`);t.style.top=y.zipperOpen?`100%`:`0%`}function Pe(e){let t=e.querySelector(`.brett-windmill`),n=t.querySelector(`.windmill-blades`);n.style.transform=`rotate(${Se}deg)`,b(t,`pointerdown`,e=>{e.preventDefault(),Fe(n)})}function Fe(e){xe.forEach(e=>window.clearTimeout(e)),xe=[];let t=3+Math.random()*2;Se+=t*360;let n=2200+Math.random()*400;e.style.transition=`transform ${n}ms cubic-bezier(0.13, 0.7, 0.25, 1)`,e.style.transform=`rotate(${Se}deg)`;for(let e=0;e<12;e++){let t=n*(1-(1-e/12)**2.2),r=window.setTimeout(()=>{m({freq:700,duration:.02,attack:.001,release:.04,type:`triangle`,gain:.12})},t);xe.push(r)}}function Ie(e){let t=e.querySelector(`.brett-door`),n=t.querySelector(`.door-animal`);Le(t),b(t,`pointerdown`,e=>{e.preventDefault();let r=!t.classList.contains(`open`);r&&(y.doorIndex=(y.doorIndex+1)%ve.length,n.innerHTML=ve[y.doorIndex],x()),t.classList.toggle(`open`,r),g()})}function Le(e){e.classList.remove(`open`)}function Re(e){let t=e.querySelector(`.brett-gears`),n=t.querySelector(`.g-big`),r=t.querySelector(`.g-small`),i=!1,a=0,o=0,s=0;function c(e,n){let r=t.getBoundingClientRect();return Math.atan2(n-(r.top+r.height/2),e-(r.left+r.width/2))*180/Math.PI}function l(){n.style.transform=`rotate(${o}deg)`,r.style.transform=`rotate(${-o*1.5}deg)`}l(),b(t,`pointerdown`,e=>{let n=e;n.preventDefault(),i=!0,a=c(n.clientX,n.clientY);try{t.setPointerCapture(n.pointerId)}catch{}}),b(t,`pointermove`,e=>{if(!i)return;let t=e,n=c(t.clientX,t.clientY),r=n-a;r>180&&(r-=360),r<-180&&(r+=360),a=n,o+=r,l();let u=performance.now();Math.abs(r)>6&&u-s>90&&(s=u,m({freq:320,duration:.02,attack:.002,release:.05,type:`square`,gain:.1}))});function u(e){if(!i)return;i=!1;let n=e;try{t.releasePointerCapture(n.pointerId)}catch{}}b(t,`pointerup`,u),b(t,`pointercancel`,u)}function ze(e){let t=e.querySelector(`.brett-bell`),n=t.querySelector(`.bell-body`);b(t,`pointerdown`,e=>{e.preventDefault(),n.classList.remove(`ring`),n.offsetWidth,n.classList.add(`ring`),m({freq:1046.5,duration:.5,attack:.004,release:.9,type:`sine`,gain:.22}),m({freq:1567.98,duration:.35,attack:.004,release:.7,type:`sine`,gain:.1})})}function Be(e){let t=e.querySelector(`.brett-curtain`);Ve(t),b(t,`pointerdown`,e=>{e.preventDefault(),y.curtainOpen=!y.curtainOpen,Ve(t),g(),x()})}function Ve(e){e.classList.toggle(`open`,y.curtainOpen)}function He(e){let t=e.querySelector(`.brett-crank`),n=t.querySelector(`.crank-handle`),r=t.querySelector(`.crank-pop`),i=!1,a=0,o=0,s=0,c=!1,l=0;function u(e,t){let r=n.getBoundingClientRect();return Math.atan2(t-(r.top+r.height/2),e-(r.left+r.width/2))*180/Math.PI}b(t,`pointerdown`,e=>{let n=e;if(n.preventDefault(),c){c=!1,s=0,t.classList.remove(`popped`);return}i=!0,a=u(n.clientX,n.clientY);try{t.setPointerCapture(n.pointerId)}catch{}}),b(t,`pointermove`,e=>{if(!i||c)return;let d=e,f=u(d.clientX,d.clientY),h=f-a;h>180&&(h-=360),h<-180&&(h+=360),a=f,o+=h,s+=Math.abs(h),n.style.transform=`rotate(${o}deg)`;let ee=performance.now();ee-l>120&&(l=ee,m({freq:p[Math.floor(s/45)%p.length],duration:.05,attack:.003,release:.1,type:`triangle`,gain:.16})),s>540&&(c=!0,i=!1,r.innerHTML=ve[Math.floor(Math.random()*ve.length)],t.classList.add(`popped`),m({freq:880,duration:.18,attack:.005,release:.3,type:`sine`,gain:.3}))});function d(e){if(!i)return;i=!1;let n=e;try{t.releasePointerCapture(n.pointerId)}catch{}}b(t,`pointerup`,d),b(t,`pointercancel`,d)}var Ue=[`#e88a9a`,`#7fb99e`,`#f4c86b`,`#7ea3c9`,`#e0a458`,`#c896d8`];function We(e){let t=e.querySelector(`.brett-kaleido`),n=t.querySelector(`.kaleido-disc`),r=t.querySelector(`.kaleido-petals`);Ge(r),n.style.transform=`rotate(${y.kaleidoStep*30}deg)`,b(t,`pointerdown`,e=>{e.preventDefault(),y.kaleidoStep+=1,n.style.transform=`rotate(${y.kaleidoStep*30}deg)`,Ge(r),m({freq:p[y.kaleidoStep%p.length],duration:.25,attack:.01,release:.4,type:`sine`,gain:.2}),x()})}function Ge(e){let t=y.kaleidoStep,n=``;for(let e=0;e<6;e++){let r=Ue[(t+e)%Ue.length],i=Ue[(t*2+e+3)%Ue.length];n+=`<g transform="rotate(${e*60})">
      <ellipse cx="0" cy="-24" rx="9" ry="16" fill="${r}" opacity="0.85"/>
      <circle cx="0" cy="-38" r="5" fill="${i}"/>
    </g>`}e.innerHTML=n}function Ke(e){let t=e.querySelector(`.brett-velcro`);qe(t),b(t,`pointerdown`,e=>{e.preventDefault(),y.veloOpen=!y.veloOpen,qe(t),re(y.veloOpen),x()})}function qe(e){e.classList.toggle(`open`,y.veloOpen)}function Je(e){let t=e.querySelector(`.brett-beads`),n=t.querySelector(`.beads-wire`),r=[...t.querySelectorAll(`.bead`)];r.forEach((e,t)=>{e.style.left=`${y.beads[t]*100}%`});let i=new Map;b(n,`pointerdown`,e=>{let t=e,r=t.target.closest(`.bead`);if(!r)return;t.preventDefault();let a=Number(r.dataset.bead);i.set(t.pointerId,a);try{n.setPointerCapture(t.pointerId)}catch{}}),b(n,`pointermove`,e=>{let t=e,a=i.get(t.pointerId);if(a===void 0)return;let o=n.getBoundingClientRect(),s=Math.max(.02,Math.min(.94,(t.clientX-o.left)/o.width)),c=y.beads[a];y.beads[a]=s,r[a].style.left=`${s*100}%`,Math.abs(s-c)>.04&&m({freq:p[a%p.length]*2,duration:.03,attack:.002,release:.07,type:`triangle`,gain:.12})});function a(e){let t=e;if(i.has(t.pointerId)){i.delete(t.pointerId);try{n.releasePointerCapture(t.pointerId)}catch{}x()}}b(n,`pointerup`,a),b(n,`pointercancel`,a)}function Ye(){ye.forEach(e=>e()),ye=[],be?.stop(),be=null,xe.forEach(e=>window.clearTimeout(e)),xe=[]}var Xe={id:`brett`,accent:`#e0a458`,tileIcon:me,mount:Ce,unmount:Ye},Ze=`
<svg viewBox="0 0 120 120" width="100%" height="100%">
  <circle cx="45" cy="45" r="24" fill="#e88a9a"/>
  <circle cx="78" cy="55" r="20" fill="#7fb99e"/>
  <circle cx="55" cy="82" r="18" fill="#f4c86b"/>
</svg>`,Qe=[{id:0,color:`#e88a9a`,note:0,xPct:22,yPct:30,radiusPx:58},{id:1,color:`#7fb99e`,note:1,xPct:50,yPct:22,radiusPx:62},{id:2,color:`#f4c86b`,note:2,xPct:78,yPct:32,radiusPx:56},{id:3,color:`#7ea3c9`,note:3,xPct:30,yPct:68,radiusPx:60},{id:4,color:`#e0a458`,note:4,xPct:58,yPct:74,radiusPx:58},{id:5,color:`#c896d8`,note:5,xPct:80,yPct:66,radiusPx:54}],S=null,$e=[],et=[],tt=new Set,nt=null;function rt(e,t,n){e.addEventListener(t,n),et.push(()=>e.removeEventListener(t,n))}function it(e,t,n){return Math.max(t,Math.min(n,e))}function at(e){et=[],tt=new Set,e.innerHTML=`
    <div class="kleckse-stage" id="kleckseStage">
      ${Qe.map(e=>`
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
  `,S=e.querySelector(`#kleckseStage`),$e=Qe.map(t=>({def:t,el:e.querySelector(`.klecks[data-id="${t.id}"]`),xPct:t.xPct,yPct:t.yPct,grabbed:!1,lastX:0,lastY:0,lastT:0})),$e.forEach(e=>{ot(e),st(e)}),nt=new ResizeObserver(()=>{$e.forEach(e=>{e.grabbed||ot(e)})}),nt.observe(S)}function ot(e,t=1,n=1){if(!S)return;let r=e.xPct/100*S.clientWidth-e.def.radiusPx,i=e.yPct/100*S.clientHeight-e.def.radiusPx;e.el.style.transform=`translate(${r.toFixed(1)}px, ${i.toFixed(1)}px) scale(${t.toFixed(3)}, ${n.toFixed(3)})`}function st(e){let t=e.el;rt(t,`pointerdown`,n=>{let r=n;r.preventDefault();try{t.setPointerCapture(r.pointerId)}catch{}e.grabbed=!0,e.lastX=r.clientX,e.lastY=r.clientY,e.lastT=performance.now(),t.classList.add(`grabbed`),m({freq:p[e.def.note%p.length],duration:.35,gain:.35}),lt(e,1.18),ut(e)}),rt(t,`pointermove`,t=>{if(!e.grabbed||!S)return;let n=t,r=S.getBoundingClientRect(),i=performance.now(),a=Math.max(1,i-e.lastT),o=(n.clientX-e.lastX)/a,s=(n.clientY-e.lastY)/a;e.lastX=n.clientX,e.lastY=n.clientY,e.lastT=i,e.xPct=it((n.clientX-r.left)/r.width*100,6,94),e.yPct=it((n.clientY-r.top)/r.height*100,8,92),ct(e,o,s),pt(e)});function n(n){if(!e.grabbed)return;e.grabbed=!1,t.classList.remove(`grabbed`);let r=n;if(r.pointerId!==void 0)try{t.releasePointerCapture(r.pointerId)}catch{}ot(e,1,1)}rt(t,`pointerup`,n),rt(t,`pointercancel`,n)}function ct(e,t,n){let r=Math.min(Math.hypot(t,n)*6,.28),i=Math.atan2(n,t);ot(e,1+r*Math.abs(Math.cos(i)),1-r*Math.abs(Math.cos(i))*.6+r*Math.abs(Math.sin(i))*.1)}function lt(e,t){ot(e,t,t),window.setTimeout(()=>{e.el.classList.contains(`grabbed`)||ot(e,1,1)},160)}function ut(e){e.el.classList.remove(`singt`),e.el.offsetWidth,e.el.classList.add(`singt`),window.setTimeout(()=>e.el.classList.remove(`singt`),300)}function dt(e){e.el.classList.remove(`funkt`),e.el.offsetWidth,e.el.classList.add(`funkt`),window.setTimeout(()=>e.el.classList.remove(`funkt`),420)}function ft(e,t){return e<t?`${e}-${t}`:`${t}-${e}`}function pt(e){if(!S)return;let t=S.getBoundingClientRect(),n=e.xPct/100*t.width,r=e.yPct/100*t.height;for(let i of $e){if(i.def.id===e.def.id)continue;let a=i.xPct/100*t.width,o=i.yPct/100*t.height,s=Math.hypot(n-a,r-o),c=e.def.radiusPx*.75+i.def.radiusPx*.75,l=ft(e.def.id,i.def.id);s<c?tt.has(l)||(tt.add(l),m({freq:p[e.def.note%p.length],duration:.25,gain:.22}),m({freq:p[i.def.note%p.length],duration:.25,gain:.22}),lt(i,1.1),dt(e),dt(i)):tt.delete(l)}}function mt(){et.forEach(e=>e()),et=[],nt?.disconnect(),nt=null,$e=[],S=null,tt=new Set}var ht={id:`kleckse`,accent:`#e88a9a`,tileIcon:Ze,mount:at,unmount:mt},gt=`
<svg viewBox="0 0 120 120" width="100%" height="100%">
  <path d="M30 90 L80 30 L95 45 L45 95 Z" fill="#fdf6ea" stroke="#7ea3c9" stroke-width="4" stroke-linejoin="round"/>
  <circle cx="34" cy="92" r="10" fill="#7ea3c9"/>
  <circle cx="70" cy="40" r="8" fill="#e88a9a"/>
</svg>`,_t=[`#e88a9a`,`#7fb99e`,`#f4c86b`,`#7ea3c9`,`#e0a458`,`#6b5d4a`],vt=`malen`,yt=1,C=null,w=null,T=null,bt=_t[0],xt=!1,St=0,Ct=0,wt=[],Tt=null,Et=null;function E(e,t,n){e.addEventListener(t,n),wt.push(()=>e.removeEventListener(t,n))}function Dt(e){wt=[],xt=!1,bt=_t[0],e.innerHTML=`
    <div class="malen-stage" id="malenStage">
      <canvas class="malen-canvas" id="malenCanvas"></canvas>
      <div class="malen-palette" id="malenPalette">
        ${_t.map((e,t)=>`<button class="malen-swatch${t===0?` selected`:``}" data-color="${e}" style="--swatch-color:${e}" aria-hidden="true"></button>`).join(``)}
      </div>
      <button class="malen-new-sheet" id="malenNewSheet" aria-hidden="true">
        <svg viewBox="0 0 48 48" width="30" height="30">
          <path d="M10 6 h20 l8 8 v28 h-28 z" fill="#fffaf2" stroke="#8a7255" stroke-width="2.5" stroke-linejoin="round"/>
          <path d="M30 6 v8 h8" fill="none" stroke="#8a7255" stroke-width="2.5" stroke-linejoin="round"/>
        </svg>
      </button>
    </div>
  `,T=e.querySelector(`#malenStage`),C=e.querySelector(`#malenCanvas`),w=C.getContext(`2d`),Ot(),kt(),E(C,`pointerdown`,Mt),E(C,`pointermove`,Nt),E(C,`pointerup`,Pt),E(C,`pointercancel`,Pt);let t=e.querySelectorAll(`.malen-swatch`);t.forEach(e=>{E(e,`pointerdown`,n=>{n.preventDefault(),bt=e.dataset.color??_t[0],t.forEach(e=>e.classList.remove(`selected`)),e.classList.add(`selected`),h(500)})}),E(e.querySelector(`#malenNewSheet`),`pointerdown`,e=>{e.preventDefault(),Ft()});let n=T.clientWidth,r=T.clientHeight,i=()=>{if(!T)return;let e=T.clientWidth,t=T.clientHeight;(e!==n||t!==r)&&(n=e,r=t,Tt!==null&&window.clearTimeout(Tt),Tt=window.setTimeout(()=>{Ot(),kt()},200))};Et=new ResizeObserver(i),Et.observe(T),E(window,`resize`,i),E(window,`orientationchange`,i)}function Ot(){if(!C||!T)return;let e=Math.min(window.devicePixelRatio||1,2),t={width:T.clientWidth,height:T.clientHeight};C.width=Math.round(t.width*e),C.height=Math.round(t.height*e),C.style.width=`${t.width}px`,C.style.height=`${t.height}px`,w=C.getContext(`2d`),w&&(w.scale(e,e),w.lineCap=`round`,w.lineJoin=`round`,w.lineWidth=22)}function kt(){let e=_(vt,yt,{dataUrl:null});if(!e.dataUrl||!C||!w)return;let t=new Image;t.onload=()=>{if(!w||!C)return;let e=Math.min(window.devicePixelRatio||1,2);w.drawImage(t,0,0,C.width/e,C.height/e)},t.src=e.dataUrl}function At(){if(C)try{v(vt,yt,{dataUrl:C.toDataURL(`image/png`)})}catch{}}function jt(e){let t=C,n=t.getBoundingClientRect(),r=n.width===0?1:t.clientWidth/n.width,i=n.height===0?1:t.clientHeight/n.height;return{x:(e.clientX-n.left)*r,y:(e.clientY-n.top)*i}}function Mt(e){let t=e;if(t.preventDefault(),!C||!w)return;try{C.setPointerCapture(t.pointerId)}catch{}xt=!0;let{x:n,y:r}=jt(t);St=n,Ct=r,w.strokeStyle=bt,w.fillStyle=bt,w.beginPath(),w.arc(n,r,w.lineWidth/2,0,Math.PI*2),w.fill()}function Nt(e){if(!xt||!w)return;let{x:t,y:n}=jt(e);w.beginPath(),w.moveTo(St,Ct),w.lineTo(t,n),w.stroke(),St=t,Ct=n}function Pt(e){if(!xt)return;xt=!1;let t=e;if(C&&t.pointerId!==void 0)try{C.releasePointerCapture(t.pointerId)}catch{}At()}function Ft(){if(!C||!w||!T)return;let e=C.toDataURL(`image/png`),t=document.createElement(`img`);t.src=e,t.className=`malen-crumple-overlay`,t.style.width=C.style.width,t.style.height=C.style.height,T.appendChild(t);let n=Math.min(window.devicePixelRatio||1,2);w.clearRect(0,0,C.width/n,C.height/n),v(vt,yt,{dataUrl:null}),h(300),t.offsetWidth,t.classList.add(`crumpling`),window.setTimeout(()=>{t.remove()},550)}function It(){wt.forEach(e=>e()),wt=[],Et?.disconnect(),Et=null,Tt!==null&&(window.clearTimeout(Tt),Tt=null),C=null,w=null,T=null}var Lt={id:`malen`,accent:`#7ea3c9`,tileIcon:gt,mount:Dt,unmount:It},Rt=`
<svg viewBox="0 0 120 120" width="100%" height="100%">
  <rect x="14" y="50" width="92" height="56" rx="12" fill="#e0a458" stroke="#a9835e" stroke-width="3"/>
  <ellipse cx="45" cy="58" rx="14" ry="8" fill="#6b5544"/>
  <rect x="68" y="52" width="24" height="14" rx="4" fill="#6b5544"/>
  <circle cx="30" cy="30" r="14" fill="#e88a9a"/>
  <rect x="60" y="18" width="26" height="26" rx="6" fill="#7fb99e"/>
</svg>`,zt=[{id:`kreis`,color:`#e88a9a`,note:0,restX:14,restY:80,path:`<circle cx="50" cy="50" r="42"/>`,svg:`<svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="42" fill="#e88a9a"/><circle cx="38" cy="46" r="5" fill="#4a4032"/><circle cx="62" cy="46" r="5" fill="#4a4032"/><path d="M38 60 Q50 68 62 60" stroke="#4a4032" stroke-width="3" fill="none" stroke-linecap="round"/></svg>`},{id:`quadrat`,color:`#7fb99e`,note:2,restX:33,restY:88,path:`<rect x="8" y="8" width="84" height="84" rx="16"/>`,svg:`<svg viewBox="0 0 100 100"><rect x="8" y="8" width="84" height="84" rx="16" fill="#7fb99e"/><circle cx="38" cy="46" r="5" fill="#4a4032"/><circle cx="62" cy="46" r="5" fill="#4a4032"/><path d="M38 60 Q50 68 62 60" stroke="#4a4032" stroke-width="3" fill="none" stroke-linecap="round"/></svg>`},{id:`dreieck`,color:`#f4c86b`,note:4,restX:52,restY:80,path:`<path d="M50 10 L92 88 L8 88 Z" stroke-linejoin="round"/>`,svg:`<svg viewBox="0 0 100 100"><path d="M50 10 L92 88 L8 88 Z" fill="#f4c86b" stroke-linejoin="round"/><circle cx="40" cy="66" r="4.5" fill="#4a4032"/><circle cx="60" cy="66" r="4.5" fill="#4a4032"/><path d="M40 76 Q50 82 60 76" stroke="#4a4032" stroke-width="3" fill="none" stroke-linecap="round"/></svg>`},{id:`stern`,color:`#7ea3c9`,note:5,restX:71,restY:88,path:`<path d="M50 6 L62 37 L96 37 L68 57 L79 90 L50 70 L21 90 L32 57 L4 37 L38 37 Z"/>`,svg:`<svg viewBox="0 0 100 100"><path d="M50 6 L62 37 L96 37 L68 57 L79 90 L50 70 L21 90 L32 57 L4 37 L38 37 Z" fill="#7ea3c9"/><circle cx="42" cy="48" r="4" fill="#4a4032"/><circle cx="58" cy="48" r="4" fill="#4a4032"/><path d="M42 58 Q50 63 58 58" stroke="#4a4032" stroke-width="2.5" fill="none" stroke-linecap="round"/></svg>`},{id:`herz`,color:`#c896d8`,note:7,restX:88,restY:78,path:`<path d="M50 92 C20 67 4 46 4 28 C4 12 17 2 32 2 C42 2 48 9 50 16 C52 9 58 2 68 2 C83 2 96 12 96 28 C96 46 80 67 50 92 Z"/>`,svg:`<svg viewBox="0 0 100 100"><path d="M50 92 C20 67 4 46 4 28 C4 12 17 2 32 2 C42 2 48 9 50 16 C52 9 58 2 68 2 C83 2 96 12 96 28 C96 46 80 67 50 92 Z" fill="#c896d8"/><circle cx="40" cy="34" r="4.5" fill="#4a4032"/><circle cx="60" cy="34" r="4.5" fill="#4a4032"/><path d="M40 44 Q50 50 60 44" stroke="#4a4032" stroke-width="3" fill="none" stroke-linecap="round"/></svg>`}],Bt=`sortierer`,Vt=1;function Ht(){return zt.map(e=>({id:e.id,xPct:e.restX,yPct:e.restY,placed:!1}))}var Ut={shapes:Ht()},D=null,Wt=[],Gt=null,Kt=new Map;function qt(e,t,n){e.addEventListener(t,n),Wt.push(()=>e.removeEventListener(t,n))}function Jt(e){return Ut.shapes.find(t=>t.id===e)??{id:e,xPct:50,yPct:80,placed:!1}}function Yt(){v(Bt,Vt,Ut)}function Xt(e){Wt=[],Kt=new Map;let t=_(Bt,Vt,{shapes:Ht()});Ut={shapes:zt.map(e=>t.shapes.find(t=>t.id===e.id)??{id:e.id,xPct:e.restX,yPct:e.restY,placed:!1})},e.innerHTML=`
    <div class="sorter-stage">
      <div class="sorter-box">
        ${zt.map(e=>`
          <div class="sorter-hole" data-hole="${e.id}">
            <svg class="hole-cut" viewBox="0 0 100 100">${e.path}</svg>
            <div class="hole-fuellung" data-fill="${e.id}" style="--fill-color:${e.color}">${e.svg}</div>
          </div>
        `).join(``)}
      </div>
      <div class="sorter-boden" id="sorterBoden">
        ${zt.map(e=>`
          <div class="sorter-form" data-shape="${e.id}">
            <div class="sorter-form-fx">${e.svg}</div>
          </div>
        `).join(``)}
      </div>
    </div>
  `,D=e.querySelector(`.sorter-stage`),zt.forEach(t=>{let n=e.querySelector(`.sorter-form[data-shape="${t.id}"]`),r=e.querySelector(`.sorter-hole[data-hole="${t.id}"]`),i=e.querySelector(`.hole-fuellung[data-fill="${t.id}"]`);Kt.set(t.id,n),$t(t.id,i),Qt(t.id),en(t,n),tn(t,r,n,i)}),Gt=new ResizeObserver(()=>{zt.forEach(e=>{(!Zt||Zt!==e.id)&&Qt(e.id)})}),Gt.observe(D)}var Zt=null;function Qt(e,t=0,n=0){let r=Kt.get(e);if(!r||!D)return;let i=Jt(e),a=r.offsetWidth/2,o=r.offsetHeight/2,s=i.xPct/100*D.clientWidth-a+t,c=i.yPct/100*D.clientHeight-o+n;r.style.transform=`translate(${s.toFixed(1)}px, ${c.toFixed(1)}px)`}function $t(e,t){let n=Jt(e);Kt.get(e)?.classList.toggle(`versteckt`,n.placed),t.classList.toggle(`gefuellt`,n.placed)}function en(e,t){let n=!1,r=0,i=0,a=0;qt(t,`pointerdown`,o=>{let s=o;if(s.preventDefault(),!Jt(e.id).placed){n=!0,Zt=e.id,r=0,i=s.clientX,a=s.clientY,t.classList.add(`greift`);try{t.setPointerCapture(s.pointerId)}catch{}}}),qt(t,`pointermove`,t=>{if(!n||!D)return;let o=t,s=o.clientX-i,c=o.clientY-a;r=Math.max(r,Math.hypot(s,c)),Qt(e.id,s,c)});let o=i=>{if(!n)return;n=!1,Zt=null;let a=i;t.classList.remove(`greift`);try{t.releasePointerCapture(a.pointerId)}catch{}if(r<6){Qt(e.id),an(t),h(420),Yt();return}if(D){let t=D.getBoundingClientRect(),n=Jt(e.id);n.xPct=on((a.clientX-t.left)/t.width*100,3,97),n.yPct=on((a.clientY-t.top)/t.height*100,3,97)}Qt(e.id);let o=D?.querySelector(`.sorter-hole[data-hole="${e.id}"]`);if(o&&D){let t=o.getBoundingClientRect(),n=t.left+t.width/2,r=t.top+t.height/2;if(Math.hypot(a.clientX-n,a.clientY-r)<60){let t=D.querySelector(`.hole-fuellung[data-fill="${e.id}"]`),n=Jt(e.id);n.placed=!0,$t(e.id,t),nn(t,e.note),Yt();return}}Yt()};qt(t,`pointerup`,o),qt(t,`pointercancel`,o)}function tn(e,t,n,r){qt(t,`pointerdown`,t=>{let i=Jt(e.id);i.placed&&(t.preventDefault(),i.placed=!1,i.xPct=e.restX,i.yPct=e.restY,$t(e.id,r),Qt(e.id),rn(n),m({freq:p[e.note%p.length]*1.5,duration:.18,attack:.005,release:.25,type:`triangle`,gain:.24}),Yt())})}function nn(e,t){e.classList.remove(`plumpst`),e.offsetWidth,e.classList.add(`plumpst`),m({freq:p[t%p.length],duration:.22,attack:.004,release:.3,type:`sine`,gain:.32}),window.setTimeout(()=>e.classList.remove(`plumpst`),400)}function rn(e){let t=e.querySelector(`.sorter-form-fx`);t&&(t.classList.remove(`huepft`),t.offsetWidth,t.classList.add(`huepft`),window.setTimeout(()=>t.classList.remove(`huepft`),500))}function an(e){let t=e.querySelector(`.sorter-form-fx`);t&&(t.classList.remove(`wackelt`),t.offsetWidth,t.classList.add(`wackelt`),window.setTimeout(()=>t.classList.remove(`wackelt`),400))}function on(e,t,n){return Math.max(t,Math.min(n,e))}function sn(){Wt.forEach(e=>e()),Wt=[],Gt?.disconnect(),Gt=null,Kt=new Map,D=null,Zt=null,Ut={shapes:Ht()}}var cn={id:`sortierer`,accent:`#e0a458`,tileIcon:Rt,mount:Xt,unmount:sn},ln=`
<svg viewBox="0 0 120 120" width="100%" height="100%">
  <circle cx="48" cy="46" r="26" fill="none" stroke="#7ec8d8" stroke-width="5"/>
  <circle cx="40" cy="38" r="7" fill="#bfe6ee"/>
  <circle cx="84" cy="72" r="17" fill="none" stroke="#a8d8e0" stroke-width="4"/>
  <circle cx="79" cy="67" r="5" fill="#d6f0f5"/>
  <circle cx="42" cy="90" r="11" fill="none" stroke="#c8b6e0" stroke-width="4"/>
</svg>`,un=[`rgba(126, 200, 216, 0.55)`,`rgba(200, 182, 224, 0.55)`,`rgba(244, 200, 107, 0.45)`,`rgba(232, 138, 154, 0.45)`,`rgba(127, 185, 158, 0.5)`],dn=14,fn=900,pn=null,mn=[],hn=null,gn=[];function _n(e,t,n){e.addEventListener(t,n),mn.push(()=>e.removeEventListener(t,n))}function vn(e){mn=[],gn=[],e.innerHTML=`
    <div class="blasen-stage" id="blasenStage">
      <div class="blasen-layer" id="blasenLayer"></div>
      <div class="blasen-wand" id="blasenWand">
        <div class="wand-ring"></div>
        <div class="wand-stick"></div>
      </div>
    </div>
  `,pn=e.querySelector(`#blasenLayer`);let t=e.querySelector(`#blasenWand`);for(let e=0;e<6;e++)yn(.3+Math.random()*.5);hn=window.setInterval(()=>yn(),fn),mn.push(()=>{hn!==null&&window.clearInterval(hn),hn=null}),_n(pn,`pointerdown`,e=>{let t=e,n=t.target.closest(`.blase`);n&&(t.preventDefault(),bn(n))}),_n(t,`pointerdown`,e=>{e.preventDefault(),t.classList.remove(`puff`),t.offsetWidth,t.classList.add(`puff`);for(let e=0;e<5;e++)window.setTimeout(()=>yn(0,!0),e*110);m({freq:220,duration:.28,attack:.06,release:.35,type:`sine`,gain:.12})})}function yn(e=0,t=!1){if(!pn||pn.childElementCount>=dn)return;let n=42+Math.random()*58,r=un[Math.floor(Math.random()*un.length)],i=t?14+Math.random()*16:6+Math.random()*88,a=(Math.random()*2-1)*40,o=9e3+Math.random()*5e3,s=document.createElement(`div`);s.className=`blase`,s.style.width=`${n}px`,s.style.height=`${n}px`,s.style.left=`${i}%`,s.style.setProperty(`--tint`,r),s.style.setProperty(`--drift`,`${a}px`),s.style.animationDuration=`${o}ms`,s.style.animationDelay=`${-e*o}ms`,s.innerHTML=`<span class="blase-glanz"></span>`,s.addEventListener(`animationend`,()=>s.remove()),pn.appendChild(s)}function bn(e){if(e.classList.contains(`platzt`))return;e.classList.add(`platzt`);let t=p[Math.floor(Math.random()*p.length)];m({freq:t*2,duration:.06,attack:.002,release:.16,type:`sine`,gain:.22});let n=window.setTimeout(()=>e.remove(),340);gn.push(n)}function xn(){mn.forEach(e=>e()),mn=[],hn!==null&&(window.clearInterval(hn),hn=null),gn.forEach(e=>window.clearTimeout(e)),gn=[],pn=null}var Sn={id:`blasen`,accent:`#7ec8d8`,tileIcon:ln,mount:vn,unmount:xn},Cn=`
<svg viewBox="0 0 120 120" width="100%" height="100%">
  <rect x="22" y="30" width="76" height="58" rx="10" fill="#cbb98a"/>
  <rect x="30" y="38" width="60" height="42" rx="6" fill="#bfe6ee"/>
  <path d="M34 74 L54 46" stroke="#fffaf2" stroke-width="9" stroke-linecap="round"/>
  <path d="M52 76 L70 52" stroke="#fffaf2" stroke-width="7" stroke-linecap="round"/>
  <circle cx="84" cy="92" r="13" fill="#7ec8d8"/>
</svg>`,wn=[{clean:`<svg viewBox="0 0 200 200">
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
    </svg>`,dirt:`#7d6b52`,fleck:`#5f5040`}],Tn=34,En=.82,O=null,k=null,A=null,Dn=0,On=!1,kn=[],An=null,jn=null,Mn=[],j=new Map;function Nn(e,t,n){e.addEventListener(t,n),kn.push(()=>e.removeEventListener(t,n))}function Pn(e){kn=[],j.clear(),Mn=[],Dn=0,On=!1,e.innerHTML=`
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
  `,A=e.querySelector(`#putzenStage`),O=e.querySelector(`#putzenCanvas`),Fn(e,0),Nn(O,`pointerdown`,zn),Nn(O,`pointermove`,Bn),Nn(O,`pointerup`,Vn),Nn(O,`pointercancel`,Vn),Nn(e.querySelector(`#putzenNext`),`pointerdown`,t=>{t.preventDefault(),Fn(e,Dn+1),g()});let t=A.clientWidth,n=A.clientHeight,r=()=>{if(!A)return;let e=A.clientWidth,r=A.clientHeight;(e!==t||r!==n)&&(t=e,n=r,An!==null&&window.clearTimeout(An),An=window.setTimeout(()=>In(),220))};jn=new ResizeObserver(r),jn.observe(A),Nn(window,`resize`,r),Nn(window,`orientationchange`,r)}function Fn(e,t){Dn=(t%wn.length+wn.length)%wn.length,On=!1,A?.classList.remove(`sauber`);let n=e.querySelector(`#putzenMotiv`);n.innerHTML=wn[Dn].clean,In()}function In(){if(!O||!A)return;let e=Math.min(window.devicePixelRatio||1,2),t=A.clientWidth,n=A.clientHeight;O.width=Math.round(t*e),O.height=Math.round(n*e),O.style.width=`${t}px`,O.style.height=`${n}px`,k=O.getContext(`2d`,{willReadFrequently:!0}),k&&(k.scale(e,e),Ln(t,n))}function Ln(e,t){if(!k)return;let n=wn[Dn];k.globalCompositeOperation=`source-over`,k.clearRect(0,0,e,t),k.fillStyle=n.dirt,k.fillRect(0,0,e,t),k.fillStyle=n.fleck;for(let n=0;n<140;n++){let n=Math.random()*e,r=Math.random()*t,i=6+Math.random()*26;k.globalAlpha=.18+Math.random()*.3,k.beginPath(),k.ellipse(n,r,i,i*(.6+Math.random()*.7),Math.random()*Math.PI,0,Math.PI*2),k.fill()}k.globalAlpha=1}function Rn(e){let t=O,n=t.getBoundingClientRect(),r=n.width===0?1:t.clientWidth/n.width,i=n.height===0?1:t.clientHeight/n.height;return{x:(e.clientX-n.left)*r,y:(e.clientY-n.top)*i}}function zn(e){let t=e;if(t.preventDefault(),!O||!k)return;try{O.setPointerCapture(t.pointerId)}catch{}let n=Rn(t);j.set(t.pointerId,n),Hn(n.x,n.y),Gn()}function Bn(e){let t=e,n=j.get(t.pointerId);if(!n||!k)return;let r=Rn(t);Un(n.x,n.y,r.x,r.y),j.set(t.pointerId,r),Gn()}function Vn(e){let t=e;if(j.has(t.pointerId)){if(j.delete(t.pointerId),O)try{O.releasePointerCapture(t.pointerId)}catch{}qn()}}function Hn(e,t){k&&(k.globalCompositeOperation=`destination-out`,k.beginPath(),k.arc(e,t,Tn,0,Math.PI*2),k.fill())}function Un(e,t,n,r){k&&(k.globalCompositeOperation=`destination-out`,k.lineCap=`round`,k.lineJoin=`round`,k.lineWidth=68,k.beginPath(),k.moveTo(e,t),k.lineTo(n,r),k.stroke())}var Wn=0;function Gn(){let e=performance.now();e-Wn<130||(Wn=e,m({freq:180+Math.random()*90,duration:.05,attack:.01,release:.1,type:`triangle`,gain:.07}))}function Kn(){if(!O||!k)return 0;let e=0,t=0,n=O.width/24,r=O.height/24;for(let i=0;i<24;i++)for(let a=0;a<24;a++){let o=Math.min(O.width-1,Math.floor(i*n+n/2)),s=Math.min(O.height-1,Math.floor(a*r+r/2));k.getImageData(o,s,1,1).data[3]<40&&e++,t++}return t===0?0:e/t}function qn(){if(!On&&!(Kn()<En)){if(On=!0,k&&O){let e=Math.min(window.devicePixelRatio||1,2);k.globalCompositeOperation=`destination-out`,k.fillStyle=`#000`,k.fillRect(0,0,O.width/e,O.height/e)}A?.classList.add(`sauber`),[0,130,260].forEach((e,t)=>{let n=window.setTimeout(()=>{m({freq:p[t+3],duration:.3,attack:.01,release:.5,gain:.24})},e);Mn.push(n)})}}function Jn(){kn.forEach(e=>e()),kn=[],jn?.disconnect(),jn=null,An!==null&&(window.clearTimeout(An),An=null),Mn.forEach(e=>window.clearTimeout(e)),Mn=[],j.clear(),O=null,k=null,A=null}var Yn={id:`putzen`,accent:`#7ec8d8`,tileIcon:Cn,mount:Pn,unmount:Jn},Xn=`
<svg viewBox="0 0 120 120" width="100%" height="100%">
  <rect x="16" y="22" width="88" height="66" rx="10" fill="#dff0e4"/>
  <path d="M16 72 Q40 54 62 72 Q82 56 104 72 L104 88 H16 Z" fill="#9ec99f"/>
  <circle cx="86" cy="40" r="12" fill="#f7d570"/>
  <ellipse cx="46" cy="60" rx="13" ry="11" fill="#e88a9a"/>
  <circle cx="42" cy="57" r="2.5" fill="#4a4032"/>
  <circle cx="50" cy="57" r="2.5" fill="#4a4032"/>
  <path d="M74 92 l7 -13 l7 13 z" fill="#7fb99e"/>
</svg>`,Zn=[{id:`hase`,size:106,note:0,svg:`<svg viewBox="0 0 100 100"><ellipse cx="50" cy="64" rx="26" ry="28" fill="#f3e7db"/><ellipse cx="38" cy="24" rx="8" ry="20" fill="#f3e7db"/><ellipse cx="62" cy="24" rx="8" ry="20" fill="#f3e7db"/><ellipse cx="38" cy="26" rx="4" ry="13" fill="#f2b8c6"/><ellipse cx="62" cy="26" rx="4" ry="13" fill="#f2b8c6"/><circle cx="41" cy="60" r="4" fill="#4a4032"/><circle cx="59" cy="60" r="4" fill="#4a4032"/><ellipse cx="50" cy="70" rx="5" ry="3.5" fill="#e88a9a"/></svg>`},{id:`baum`,size:125,note:1,svg:`<svg viewBox="0 0 100 100"><rect x="43" y="58" width="14" height="36" rx="5" fill="#a9835e"/><circle cx="50" cy="40" r="28" fill="#7fb99e"/><circle cx="30" cy="50" r="18" fill="#8fc4a8"/><circle cx="70" cy="50" r="18" fill="#8fc4a8"/></svg>`},{id:`blume`,size:94,note:2,svg:`<svg viewBox="0 0 100 100"><rect x="46" y="52" width="8" height="42" rx="4" fill="#7fb99e"/><ellipse cx="30" cy="62" rx="14" ry="7" fill="#8fc4a8"/><g><ellipse cx="50" cy="26" rx="11" ry="17" fill="#e88a9a"/><ellipse cx="50" cy="26" rx="11" ry="17" fill="#e88a9a" transform="rotate(72 50 40)"/><ellipse cx="50" cy="26" rx="11" ry="17" fill="#e88a9a" transform="rotate(144 50 40)"/><ellipse cx="50" cy="26" rx="11" ry="17" fill="#e88a9a" transform="rotate(216 50 40)"/><ellipse cx="50" cy="26" rx="11" ry="17" fill="#e88a9a" transform="rotate(288 50 40)"/></g><circle cx="50" cy="40" r="10" fill="#f4c86b"/></svg>`},{id:`sonne`,size:101,note:3,svg:`<svg viewBox="0 0 100 100"><g stroke="#f4c86b" stroke-width="7" stroke-linecap="round"><line x1="50" y1="8" x2="50" y2="20"/><line x1="50" y1="80" x2="50" y2="92"/><line x1="8" y1="50" x2="20" y2="50"/><line x1="80" y1="50" x2="92" y2="50"/><line x1="20" y1="20" x2="28" y2="28"/><line x1="72" y1="72" x2="80" y2="80"/><line x1="20" y1="80" x2="28" y2="72"/><line x1="72" y1="28" x2="80" y2="20"/></g><circle cx="50" cy="50" r="24" fill="#f7d570"/><circle cx="42" cy="46" r="3" fill="#c99a3c"/><circle cx="58" cy="46" r="3" fill="#c99a3c"/><path d="M43 56 Q50 62 57 56" stroke="#c99a3c" stroke-width="3" fill="none" stroke-linecap="round"/></svg>`},{id:`wolke`,size:120,note:4,svg:`<svg viewBox="0 0 100 100"><g fill="#fffaf2" stroke="#bcd6e0" stroke-width="3"><ellipse cx="38" cy="58" rx="22" ry="18"/><ellipse cx="62" cy="58" rx="20" ry="16"/><ellipse cx="50" cy="46" rx="20" ry="18"/></g></svg>`},{id:`vogel`,size:91,note:5,svg:`<svg viewBox="0 0 100 100"><ellipse cx="52" cy="56" rx="24" ry="19" fill="#7ea3c9"/><circle cx="34" cy="44" r="14" fill="#8fb3d4"/><path d="M22 44 l-12 5 l12 5 z" fill="#f4a56b"/><circle cx="31" cy="41" r="3" fill="#4a4032"/><path d="M56 52 q14 -8 22 2 q-12 8 -22 -2z" fill="#6b93bd"/><path d="M70 66 l14 8" stroke="#f4a56b" stroke-width="5" stroke-linecap="round"/></svg>`},{id:`pilz`,size:88,note:6,svg:`<svg viewBox="0 0 100 100"><rect x="40" y="52" width="20" height="38" rx="8" fill="#f3e7db"/><path d="M14 54 a36 30 0 0 1 72 0 z" fill="#e88a9a"/><circle cx="36" cy="40" r="7" fill="#fffaf2"/><circle cx="62" cy="34" r="5" fill="#fffaf2"/><circle cx="54" cy="48" r="4" fill="#fffaf2"/></svg>`},{id:`stern`,size:81,note:7,svg:`<svg viewBox="0 0 100 100"><path d="M50 8 L61 38 L93 38 L67 57 L77 88 L50 69 L23 88 L33 57 L7 38 L39 38 Z" fill="#f4c86b"/></svg>`}],Qn=`sticker`,$n=1,er=60,M=[],tr=null,N=null,nr=null,rr=[],ir=null,ar=null;function or(e,t,n){e.addEventListener(t,n),rr.push(()=>e.removeEventListener(t,n))}function sr(e){return Zn.find(t=>t.id===e)??Zn[0]}function cr(){v(Qn,$n,{placed:M})}function lr(e){rr=[],M=_(Qn,$n,{placed:[]}).placed,e.innerHTML=`
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
        ${Zn.map(e=>`<div class="tray-item" data-art="${e.id}" style="width:${e.size*.62}px;height:${e.size*.62}px">${e.svg}</div>`).join(``)}
      </div>
    </div>
  `,tr=e.querySelector(`#stickerStage`),N=e.querySelector(`#stickerSzene`),nr=e.querySelector(`#stickerTray`),dr(),pr(e),nr.querySelectorAll(`.tray-item`).forEach(e=>{or(e,`pointerdown`,t=>_r(t,e))}),ir=new ResizeObserver(()=>{let e=document.getElementById(`stickerPlatziert`);e&&e.querySelectorAll(`.sticker`).forEach(e=>{let t=Number(e.dataset.index);if(t===ar)return;let n=M[t];n&&ur(e,n.xPct,n.yPct)})}),ir.observe(N)}function ur(e,t,n){N&&(e.style.setProperty(`--tx`,`${(t/100*N.clientWidth).toFixed(1)}px`),e.style.setProperty(`--ty`,`${(n/100*N.clientHeight).toFixed(1)}px`))}function dr(){let e=document.getElementById(`stickerPlatziert`);e&&(e.innerHTML=``,M.forEach((t,n)=>{let r=sr(t.art),i=document.createElement(`div`);i.className=`sticker`,i.dataset.index=String(n),i.style.width=`${r.size}px`,i.style.height=`${r.size}px`,ur(i,t.xPct,t.yPct),i.style.setProperty(`--rot`,`${t.rot}deg`),i.innerHTML=r.svg,e.appendChild(i),fr(i,n)}))}function fr(e,t){let n=!1,r=0,i=0,a=0;e.addEventListener(`pointerdown`,o=>{o.preventDefault(),o.stopPropagation(),n=!0,ar=t,r=0,i=o.clientX,a=o.clientY,e.classList.add(`greift`);try{e.setPointerCapture(o.pointerId)}catch{}}),e.addEventListener(`pointermove`,o=>{if(!n||!N)return;r=Math.max(r,Math.hypot(o.clientX-i,o.clientY-a));let s=N.getBoundingClientRect(),c=M[t];c&&(c.xPct=gr((o.clientX-s.left)/s.width*100,2,98),c.yPct=gr((o.clientY-s.top)/s.height*100,2,98),ur(e,c.xPct,c.yPct))});let o=i=>{if(n){n=!1,ar=null,e.classList.remove(`greift`);try{e.releasePointerCapture(i.pointerId)}catch{}if(nr&&hr(i.clientX,i.clientY)){M.splice(t,1),cr(),dr(),h(300);return}r<10&&(e.classList.remove(`wackelt`),e.offsetWidth,e.classList.add(`wackelt`),m({freq:p[sr(M[t]?.art??Zn[0].id).note%p.length],duration:.3,gain:.28})),cr()}};e.addEventListener(`pointerup`,o),e.addEventListener(`pointercancel`,o)}function pr(e){or(e.querySelector(`#stickerClear`),`pointerdown`,e=>{e.preventDefault(),M.length!==0&&mr()})}function mr(){let e=document.getElementById(`stickerPlatziert`);if(!e)return;let t=[...e.querySelectorAll(`.sticker`)];t.forEach((e,t)=>{e.style.transitionDelay=`${Math.min(t*25,500)}ms`,e.offsetWidth,e.classList.add(`wegfegen`)}),g(),window.setTimeout(()=>{M=[],cr(),dr()},500+Math.min(t.length*25,500))}function hr(e,t){if(!nr)return!1;let n=nr.getBoundingClientRect();return e>=n.left&&e<=n.right&&t>=n.top&&t<=n.bottom}function gr(e,t,n){return Math.max(t,Math.min(n,e))}function _r(e,t){if(e.preventDefault(),!tr)return;let n=sr(t.dataset.art??``);try{t.setPointerCapture(e.pointerId)}catch{}let r=document.createElement(`div`);r.className=`sticker-ghost`,r.style.width=`${n.size}px`,r.style.height=`${n.size}px`,r.innerHTML=n.svg,tr.appendChild(r);let i=(e,t)=>{let n=tr.getBoundingClientRect();r.style.setProperty(`--tx`,`${(e-n.left).toFixed(1)}px`),r.style.setProperty(`--ty`,`${(t-n.top).toFixed(1)}px`)};i(e.clientX,e.clientY),h(560);let a=!1;function o(e){let t=e;i(t.clientX,t.clientY)}function s(e){if(a)return;a=!0;let i=e;try{t.releasePointerCapture(i.pointerId)}catch{}t.removeEventListener(`pointermove`,o),t.removeEventListener(`pointerup`,s),t.removeEventListener(`pointercancel`,s),r.remove(),vr(n,i.clientX,i.clientY)}t.addEventListener(`pointermove`,o),t.addEventListener(`pointerup`,s),t.addEventListener(`pointercancel`,s)}function vr(e,t,n){if(!N||hr(t,n))return;let r=N.getBoundingClientRect();n>r.bottom||n<r.top||(M.length>=er&&M.shift(),M.push({art:e.id,xPct:gr((t-r.left)/r.width*100,2,98),yPct:gr((n-r.top)/r.height*100,2,98),rot:Math.round((Math.random()*2-1)*9)}),cr(),dr(),m({freq:p[e.note%p.length],duration:.28,gain:.3}))}function yr(){rr.forEach(e=>e()),rr=[],ir?.disconnect(),ir=null,ar=null,M=[],tr=null,N=null,nr=null}var br={id:`sticker`,accent:`#9ec99f`,tileIcon:Xn,mount:lr,unmount:yr},xr=`
<svg viewBox="0 0 120 120" width="100%" height="100%">
  <circle cx="94" cy="26" r="14" fill="#f7d570"/>
  <path d="M20 100 L20 60 L46 38 L72 60 L72 100 Z" fill="#f3e7db" stroke="#c9a37e" stroke-width="3"/>
  <path d="M14 62 L46 34 L78 62 Z" fill="#e88a9a"/>
  <rect x="38" y="76" width="16" height="24" rx="2" fill="#a9835e"/>
  <circle cx="30" cy="10" r="8" fill="#9ec99f" opacity="0.7"/>
</svg>`,Sr=`wimmelbild`,Cr=1,wr={tuerOffen:!1,vorhangOffen:!1,flaggeOben:!1},P={...wr},Tr=[],Er=[],F=new Set;function Dr(e,t,n){e.addEventListener(t,n),Tr.push(()=>e.removeEventListener(t,n))}function Or(){v(Sr,Cr,P)}function kr(e,t){let n=window.setTimeout(e,t);Er.push(n)}function I(e,t,n){let r=e.querySelector(t),i=t;Dr(r,`pointerdown`,e=>{e.preventDefault(),!F.has(i)&&(F.add(i),r.classList.remove(n.className),r.offsetWidth,r.classList.add(n.className),n.onTrigger?.(r),n.sound?.(),kr(()=>{r.classList.remove(n.className),F.delete(i)},n.duration))})}function Ar(e){P=_(Sr,Cr,{...wr}),Tr=[],Er=[],F=new Set,e.innerHTML=`
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
  `,jr(e),Mr(e),Nr(e),Pr(e),Fr(e),Ir(e),Lr(e),Rr(e),zr(e),Br(e),Vr(e),Hr(e),Ur(e),Wr(e)}function jr(e){I(e,`.w-sonne`,{className:`strahlt`,duration:700,sound:()=>{m({freq:1046.5,duration:.35,attack:.01,release:.5,type:`sine`,gain:.22}),m({freq:1567.98,duration:.25,attack:.01,release:.4,type:`sine`,gain:.1})}})}function Mr(e){I(e,`.w-wolke`,{className:`zieht-vorbei`,duration:2400,sound:()=>g()})}function Nr(e){I(e,`.w-schornstein`,{className:`pufft`,duration:1400,sound:()=>m({freq:260,duration:.15,attack:.01,release:.3,type:`sine`,gain:.16})})}function Pr(e){let t=e.querySelector(`.w-tuer`);t.classList.toggle(`offen`,P.tuerOffen),Dr(t,`pointerdown`,e=>{e.preventDefault(),P.tuerOffen=!P.tuerOffen,t.classList.toggle(`offen`,P.tuerOffen),g(),P.tuerOffen&&(m({freq:587.33,duration:.12,attack:.005,release:.15,type:`triangle`,gain:.2}),kr(()=>m({freq:493.88,duration:.18,attack:.005,release:.25,type:`triangle`,gain:.2}),130)),Or()})}function Fr(e){let t=e.querySelector(`.w-fenster`);t.classList.toggle(`offen`,P.vorhangOffen),Dr(t,`pointerdown`,e=>{e.preventDefault(),P.vorhangOffen=!P.vorhangOffen,t.classList.toggle(`offen`,P.vorhangOffen),g(),Or()})}function Ir(e){I(e,`.w-apfel`,{className:`faellt`,duration:900,sound:()=>m({freq:220,duration:.09,attack:.004,release:.14,type:`sine`,gain:.28})})}function Lr(e){I(e,`.w-vogelhaus`,{className:`fliegt`,duration:1600,sound:()=>{[0,90,180].forEach((e,t)=>{kr(()=>m({freq:p[(4+t)%p.length],duration:.14,attack:.005,release:.2,type:`triangle`,gain:.22}),e)})}})}function Rr(e){let t=e.querySelector(`.w-schaukel`),n=t.querySelector(`.schaukel-sitz`),r=`schaukel`;Dr(t,`pointerdown`,e=>{e.preventDefault(),!F.has(r)&&(F.add(r),n.classList.remove(`schwingt`),n.offsetWidth,n.classList.add(`schwingt`),[0,350,700,1050].forEach(e=>{kr(()=>m({freq:380,duration:.05,attack:.005,release:.1,type:`sine`,gain:.1}),e)}),kr(()=>{n.classList.remove(`schwingt`),F.delete(r)},2200))})}function zr(e){I(e,`.w-biene`,{className:`summt`,duration:1300,sound:()=>m({freq:660,duration:.5,attack:.02,release:.4,type:`sawtooth`,gain:.06})})}function Br(e){I(e,`.w-maulwurfshuegel`,{className:`guckt`,duration:1200,sound:()=>m({freq:180,duration:.12,attack:.005,release:.2,type:`sine`,gain:.24})})}function Vr(e){let t=e.querySelector(`.w-briefkasten`);t.classList.toggle(`offen`,P.flaggeOben),Dr(t,`pointerdown`,e=>{e.preventDefault(),P.flaggeOben=!P.flaggeOben,t.classList.toggle(`offen`,P.flaggeOben),h(P.flaggeOben?700:500),Or()})}function Hr(e){I(e,`.w-frosch`,{className:`huepft`,duration:700,sound:()=>m({freq:200,duration:.1,attack:.004,release:.16,type:`square`,gain:.18})})}function Ur(e){I(e,`.w-schnecke`,{className:`streckt`,duration:900,sound:()=>h(520)})}function Wr(e){I(e,`.w-marienkaefer`,{className:`fliegt-los`,duration:1100,sound:()=>m({freq:900,duration:.3,attack:.02,release:.3,type:`sawtooth`,gain:.05})})}function Gr(){Tr.forEach(e=>e()),Tr=[],Er.forEach(e=>window.clearTimeout(e)),Er=[],F=new Set}var Kr={id:`wimmelbild`,accent:`#9ec99f`,tileIcon:xr,mount:Ar,unmount:Gr},qr=`
<svg viewBox="0 0 120 120" width="100%" height="100%">
  <path d="M78 20 a34 34 0 1 0 22 56 a26 26 0 1 1 -22 -56 Z" fill="#7ea3c9"/>
  <path d="M32 34 l4 10 l10 4 l-10 4 l-4 10 l-4 -10 l-10 -4 l10 -4 Z" fill="#f4c86b"/>
  <rect x="14" y="86" width="46" height="20" rx="6" fill="#e0a458"/>
  <circle cx="26" cy="86" r="8" fill="#f3e7db"/>
</svg>`,Jr=[{id:`baer`,bettFarbe:`#e0a458`,wach:`<svg viewBox="0 0 100 100"><circle cx="50" cy="58" r="30" fill="#c9a37e"/><circle cx="24" cy="34" r="12" fill="#c9a37e"/><circle cx="76" cy="34" r="12" fill="#c9a37e"/><circle cx="40" cy="56" r="4" fill="#4a4032"/><circle cx="60" cy="56" r="4" fill="#4a4032"/><ellipse cx="50" cy="68" rx="8" ry="5" fill="#8a7255"/></svg>`,schlaeft:`<svg viewBox="0 0 100 100"><circle cx="50" cy="58" r="30" fill="#c9a37e"/><circle cx="24" cy="34" r="12" fill="#c9a37e"/><circle cx="76" cy="34" r="12" fill="#c9a37e"/><path d="M34 56 q6 5 12 0" stroke="#4a4032" stroke-width="3" fill="none" stroke-linecap="round"/><path d="M54 56 q6 5 12 0" stroke="#4a4032" stroke-width="3" fill="none" stroke-linecap="round"/><ellipse cx="50" cy="68" rx="8" ry="5" fill="#8a7255"/></svg>`},{id:`hase`,bettFarbe:`#e88a9a`,wach:`<svg viewBox="0 0 100 100"><ellipse cx="50" cy="62" rx="26" ry="26" fill="#f3e7db"/><ellipse cx="38" cy="24" rx="8" ry="20" fill="#f3e7db"/><ellipse cx="62" cy="24" rx="8" ry="20" fill="#f3e7db"/><ellipse cx="38" cy="26" rx="4" ry="13" fill="#f2b8c6"/><ellipse cx="62" cy="26" rx="4" ry="13" fill="#f2b8c6"/><circle cx="41" cy="58" r="4" fill="#4a4032"/><circle cx="59" cy="58" r="4" fill="#4a4032"/><ellipse cx="50" cy="68" rx="5" ry="3.5" fill="#e88a9a"/></svg>`,schlaeft:`<svg viewBox="0 0 100 100"><ellipse cx="50" cy="62" rx="26" ry="26" fill="#f3e7db"/><ellipse cx="38" cy="24" rx="8" ry="20" fill="#f3e7db"/><ellipse cx="62" cy="24" rx="8" ry="20" fill="#f3e7db"/><ellipse cx="38" cy="26" rx="4" ry="13" fill="#f2b8c6"/><ellipse cx="62" cy="26" rx="4" ry="13" fill="#f2b8c6"/><path d="M35 58 q6 5 12 0" stroke="#4a4032" stroke-width="3" fill="none" stroke-linecap="round"/><path d="M53 58 q6 5 12 0" stroke="#4a4032" stroke-width="3" fill="none" stroke-linecap="round"/><ellipse cx="50" cy="68" rx="5" ry="3.5" fill="#e88a9a"/></svg>`},{id:`katze`,bettFarbe:`#7ea3c9`,wach:`<svg viewBox="0 0 100 100"><ellipse cx="50" cy="60" rx="26" ry="24" fill="#e0a458"/><path d="M26 46 L20 18 L46 40 Z" fill="#e0a458"/><path d="M74 46 L80 18 L54 40 Z" fill="#e0a458"/><path d="M28 42 L24 24 L40 38 Z" fill="#f2b8c6"/><path d="M72 42 L76 24 L60 38 Z" fill="#f2b8c6"/><circle cx="40" cy="58" r="4" fill="#4a4032"/><circle cx="60" cy="58" r="4" fill="#4a4032"/><path d="M42 68 Q50 73 58 68" stroke="#8a5a2e" stroke-width="2.5" fill="none" stroke-linecap="round"/></svg>`,schlaeft:`<svg viewBox="0 0 100 100"><ellipse cx="50" cy="60" rx="26" ry="24" fill="#e0a458"/><path d="M26 46 L20 18 L46 40 Z" fill="#e0a458"/><path d="M74 46 L80 18 L54 40 Z" fill="#e0a458"/><path d="M28 42 L24 24 L40 38 Z" fill="#f2b8c6"/><path d="M72 42 L76 24 L60 38 Z" fill="#f2b8c6"/><path d="M34 58 q6 5 12 0" stroke="#4a4032" stroke-width="3" fill="none" stroke-linecap="round"/><path d="M54 58 q6 5 12 0" stroke="#4a4032" stroke-width="3" fill="none" stroke-linecap="round"/><path d="M42 68 Q50 71 58 68" stroke="#8a5a2e" stroke-width="2.5" fill="none" stroke-linecap="round"/></svg>`}],Yr=`gutenacht`,Xr=1,Zr={lampeAn:!0,schlaeft:[!1,!1,!1]},L={...Zr},Qr=[],$r=[];function ei(e,t){let n=window.setTimeout(e,t);$r.push(n)}function ti(e,t,n){e.addEventListener(t,n),Qr.push(()=>e.removeEventListener(t,n))}function ni(){v(Yr,Xr,L)}function ri(e){L=_(Yr,Xr,{...Zr,schlaeft:[...Zr.schlaeft]}),Qr=[],e.innerHTML=`
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
          ${Jr.map((e,t)=>`
            <div class="n-bett${L.schlaeft[t]?` schlaeft`:``}" style="--bett-farbe:${e.bettFarbe}">
              <div class="bett-rahmen"></div>
              <div class="n-tier${L.schlaeft[t]?` schlaeft`:``}" data-item="tier${t}" data-idx="${t}">
                <div class="tier-wach">${e.wach}</div>
                <div class="tier-schlaeft">${e.schlaeft}</div>
              </div>
              <div class="n-decke"></div>
            </div>
          `).join(``)}
        </div>
      </div>
    </div>
  `;let t=e.querySelector(`#nachtSzene`);t.classList.toggle(`dunkel`,!L.lampeAn),ii(e,t),ai(e)}function ii(e,t){ti(e.querySelector(`.n-lampe`),`pointerdown`,e=>{e.preventDefault(),L.lampeAn=!L.lampeAn,t.classList.toggle(`dunkel`,!L.lampeAn),m({freq:L.lampeAn?480:320,duration:.18,attack:.01,release:.3,type:`sine`,gain:.18}),ni()})}function ai(e){e.querySelectorAll(`.n-tier`).forEach(e=>{let t=Number(e.dataset.idx);ti(e,`pointerdown`,n=>{n.preventDefault();let r=!L.schlaeft[t];L.schlaeft[t]=r,e.classList.toggle(`schlaeft`,r),e.closest(`.n-bett`)?.classList.toggle(`schlaeft`,r),r?(g(),m({freq:392,duration:.2,attack:.01,release:.4,type:`sine`,gain:.16}),ei(()=>{m({freq:294,duration:.3,attack:.01,release:.5,type:`sine`,gain:.14})},220)):(m({freq:440,duration:.1,attack:.005,release:.2,type:`triangle`,gain:.2}),ei(()=>{m({freq:587.33,duration:.16,attack:.005,release:.25,type:`triangle`,gain:.2})},110)),ni()})})}function oi(){Qr.forEach(e=>e()),Qr=[],$r.forEach(e=>window.clearTimeout(e)),$r=[],L={...Zr,schlaeft:[...Zr.schlaeft]}}var si={id:`gutenacht`,accent:`#7ea3c9`,tileIcon:qr,mount:ri,unmount:oi},ci=`
<svg viewBox="0 0 120 120" width="100%" height="100%">
  <path d="M14 58 V86 A26 9 0 0 0 66 86 V58 Z" fill="#e88a9a"/>
  <ellipse cx="40" cy="58" rx="26" ry="9" fill="#fdf6ea" stroke="#c96f7e" stroke-width="3"/>
  <path d="M60 40 V70 A23 8 0 0 0 106 70 V40 Z" fill="#7ea3c9"/>
  <ellipse cx="83" cy="40" rx="23" ry="8" fill="#fdf6ea" stroke="#5f86ad" stroke-width="3"/>
  <circle cx="36" cy="22" r="4" fill="#f4c86b"/>
  <circle cx="52" cy="30" r="3" fill="#7fb99e"/>
  <circle cx="86" cy="16" r="3.5" fill="#e88a9a"/>
</svg>`,li=[{id:0,freq:98,decay:.8,size:1,body:`#e88a9a`,rim:`#c96f7e`},{id:1,freq:130.81,decay:.65,size:.95,body:`#7ea3c9`,rim:`#5f86ad`},{id:2,freq:164.81,decay:.55,size:.9,body:`#7fb99e`,rim:`#5f9a80`},{id:3,freq:196,decay:.45,size:.86,body:`#f4c86b`,rim:`#d4a64a`}],ui=[`#e88a9a`,`#7ea3c9`,`#7fb99e`,`#f4c86b`,`#c896d8`,`#e0a458`],di=90,fi=6,pi=40,R=null,mi=[],hi=[],gi=new Set,_i=0,vi=0,z=new Map;function yi(e,t,n){e.addEventListener(t,n),hi.push(()=>e.removeEventListener(t,n))}function bi(e,t){let n=window.setTimeout(()=>{gi.delete(n),e()},t);return gi.add(n),n}function xi(e){let t=[];for(let e=0;e<=8;e++){let n=18+e*20.5;t.push(`${n.toFixed(1)},${e%2==0?78:140}`)}return`
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
    </svg>`}function Si(e){hi=[],gi=new Set,_i=0,vi=0,z=new Map,e.innerHTML=`
    <div class="trommel-stage" id="trommelStage">
      <div class="trommel-raster">
        ${li.map(e=>`
          <div class="trommel-zelle" data-id="${e.id}">
            <div class="trommel" style="--groesse:${e.size}">
              <div class="trommel-wackel">${xi(e)}</div>
            </div>
            <div class="trommel-punkte"></div>
          </div>`).join(``)}
      </div>
    </div>
  `,R=e.querySelector(`#trommelStage`),mi=li.map(t=>{let n=e.querySelector(`.trommel-zelle[data-id="${t.id}"]`);return{def:t,cell:n,drum:n.querySelector(`.trommel`),punkte:n.querySelector(`.trommel-punkte`),lastHitAt:-1/0,combo:0,bummTimer:null}}),yi(R,`pointerdown`,e=>{let t=e;t.preventDefault();try{R?.setPointerCapture(t.pointerId)}catch{}let n=wi(t.clientX,t.clientY);n&&(z.set(t.pointerId,n.def.id),Ei(n))}),yi(R,`pointermove`,e=>{let t=e;if(!z.has(t.pointerId))return;let n=Ti(t.clientX,t.clientY),r=n?n.def.id:-1;r!==z.get(t.pointerId)&&(z.set(t.pointerId,r),n&&Ei(n))});let t=e=>{let t=e;z.delete(t.pointerId)};yi(R,`pointerup`,t),yi(R,`pointercancel`,t)}function Ci(e){let t=e.cell.getBoundingClientRect();return{x:t.left+t.width/2,y:t.top+t.height/2,r:e.drum.offsetWidth/2}}function wi(e,t){let n=null,r=1/0;for(let i of mi){let a=Ci(i),o=Math.hypot(e-a.x,t-a.y);o<r&&(r=o,n=i)}return n}function Ti(e,t){for(let n of mi){let r=Ci(n);if(Math.hypot(e-r.x,t-r.y)<r.r*.95)return n}return null}function Ei(e){let t=performance.now();e.combo=t-e.lastHitAt<di?e.combo+1:1,e.lastHitAt=t;let n=Math.min(e.combo,4);e.combo===1?Di(()=>ie(e.def.freq,.42,e.def.decay),e.def.decay):e.combo===2&&Di(()=>ie(e.def.freq*.75,.3,e.def.decay*1.1),e.def.decay),Oi(e,n),ki(e,2+n*2)}function Di(e,t){_i>=fi||(_i++,e(),bi(()=>{_i=Math.max(0,_i-1)},t*1e3))}function Oi(e,t){e.drum.style.setProperty(`--staerke`,String(t)),e.drum.classList.remove(`bumm`),e.drum.offsetWidth,e.drum.classList.add(`bumm`),e.bummTimer!==null&&(window.clearTimeout(e.bummTimer),gi.delete(e.bummTimer)),e.bummTimer=bi(()=>{e.drum.classList.remove(`bumm`),e.bummTimer=null},560)}function ki(e,t){let n=e.drum.offsetWidth,r=e.cell.getBoundingClientRect(),i=R?.getBoundingClientRect().top??0,a=r.top+r.height/2-n*.2,o=Math.max(40,a-i-24);for(let r=0;r<t;r++){if(vi>=pi)return;let t=document.createElement(`span`);t.className=`trommel-punkt`;let r=12+Math.random()*10;t.style.width=`${r}px`,t.style.height=`${r}px`,t.style.background=ui[Math.floor(Math.random()*ui.length)],t.style.setProperty(`--sx`,`${((Math.random()-.5)*n*.6).toFixed(0)}px`),t.style.setProperty(`--dx`,`${((Math.random()-.5)*n*.7).toFixed(0)}px`);let i=Math.min((.3+Math.random()*.4)*n,o*(.7+Math.random()*.3));t.style.setProperty(`--dy`,`${(-i).toFixed(0)}px`),t.style.top=`calc(50% - ${(n*.2).toFixed(0)}px)`,e.punkte.appendChild(t),vi++,bi(()=>{t.remove(),vi=Math.max(0,vi-1)},760)}}function Ai(){hi.forEach(e=>e()),hi=[],gi.forEach(e=>window.clearTimeout(e)),gi=new Set,_i=0,vi=0,z=new Map,mi=[],R=null}var ji={id:`trommeln`,accent:`#e88a9a`,tileIcon:ci,mount:Si,unmount:Ai},Mi=`
<svg viewBox="0 0 120 120" width="100%" height="100%">
  <circle cx="44" cy="50" r="28" fill="#e88a9a"/>
  <path d="M44 22 A28 28 0 0 1 72 50 L44 50 Z" fill="#fdf6ea"/>
  <path d="M44 78 A28 28 0 0 1 16 50 L44 50 Z" fill="#f4c86b"/>
  <circle cx="44" cy="50" r="5" fill="#fdf6ea"/>
  <circle cx="84" cy="80" r="21" fill="#7ea3c9"/>
  <path d="M84 59 A21 21 0 0 1 105 80 L84 80 Z" fill="#fdf6ea"/>
  <path d="M84 101 A21 21 0 0 1 63 80 L84 80 Z" fill="#7fb99e"/>
  <circle cx="84" cy="80" r="4" fill="#fdf6ea"/>
</svg>`,Ni=[{r:94,colors:[`#e88a9a`,`#fdf6ea`,`#f4c86b`],freq:196,xPct:24,yPct:30},{r:82,colors:[`#7ea3c9`,`#fdf6ea`,`#7fb99e`],freq:261.63,xPct:62,yPct:24},{r:72,colors:[`#f4c86b`,`#fdf6ea`,`#e88a9a`],freq:293.66,xPct:82,yPct:58},{r:88,colors:[`#7fb99e`,`#fdf6ea`,`#c896d8`],freq:220,xPct:44,yPct:64},{r:66,colors:[`#c896d8`,`#fdf6ea`,`#7ea3c9`],freq:329.63,xPct:18,yPct:76},{r:78,colors:[`#e0a458`,`#fdf6ea`,`#7ea3c9`],freq:246.94,xPct:72,yPct:84},{r:62,colors:[`#e88a9a`,`#fdf6ea`,`#7fb99e`],freq:392,xPct:40,yPct:20}],Pi=90,Fi=.72,Ii=2600,Li=120,Ri=44,zi=10,Bi=`baelle`,Vi=1,B=null,Hi=null,V=[],Ui=[],Wi=new Set,Gi=null,Ki=null,qi=0,H=0,U=0,Ji=1,W=!1,Yi=new Map,Xi=0,Zi=0,Qi=null,G=null;function $i(e,t,n){e.addEventListener(t,n),Ui.push(()=>e.removeEventListener(t,n))}function ea(e,t){let n=window.setTimeout(()=>{Wi.delete(n),e()},t);Wi.add(n)}function ta(){!W||H===0||U===0||v(Bi,Vi,{pos:V.map(e=>[e.x/H*100,e.y/U*100])})}function na(e){Ui=[],Wi=new Set,Yi=new Map,W=!1,Xi=0,H=0,U=0;let t=_(Bi,Vi,null);Qi=t&&Array.isArray(t.pos)&&t.pos.length===Ni.length?t.pos:null,e.innerHTML=`
    <div class="baelle-stage" id="baelleStage">
      <div class="baelle-teppich"></div>
      <div class="baelle-wellen" id="baelleWellen"></div>
      <div class="baelle-layer">
        ${Ni.map((e,t)=>`
          <div class="ball" data-i="${t}">
            <div class="ball-muster" style="--c1:${e.colors[0]};--c2:${e.colors[1]};--c3:${e.colors[2]}"></div>
            <div class="ball-glanz"></div>
          </div>`).join(``)}
      </div>
    </div>
  `,B=e.querySelector(`#baelleStage`),Hi=e.querySelector(`#baelleWellen`),V=Ni.map((t,n)=>{let r=e.querySelector(`.ball[data-i="${n}"]`);return{def:t,el:r,muster:r.querySelector(`.ball-muster`),r:t.r,x:0,y:0,vx:0,vy:0,spin:Math.random()*Math.PI*2,squash:0,squashDir:0,lastSoundAt:-1/0,dirty:!0}}),Gi=new ResizeObserver(()=>ra()),Gi.observe(B),$i(B,`pointerdown`,e=>ca(e)),$i(B,`pointermove`,e=>la(e)),$i(B,`pointerup`,e=>Yi.delete(e.pointerId)),$i(B,`pointercancel`,e=>Yi.delete(e.pointerId))}function ra(){if(!B)return;let e=B.clientWidth,t=B.clientHeight;if(e<1||t<1)return;let n=H,r=U;H=e,U=t,Ji=Math.max(.55,Math.min(1.2,Math.min(H,U)/834)),V.forEach((e,t)=>{if(e.r=e.def.r*Ji,e.el.style.width=`${(e.r*2).toFixed(1)}px`,e.el.style.height=`${(e.r*2).toFixed(1)}px`,W)n>0&&r>0&&(e.x*=H/n,e.y*=U/r);else{let[n,r]=Qi?.[t]??[e.def.xPct,e.def.yPct];e.x=n/100*H,e.y=r/100*U}e.x=sa(e.x,e.r,H-e.r),e.y=sa(e.y,e.r,U-e.r)}),ia();for(let e=0;e<20;e++)ba();W||(W=!0,B.classList.add(`bereit`)),xa(!0)}function ia(){let e=document.querySelector(`.back-button`);if(!B||!e||e.offsetWidth===0){G=null;return}let t=aa(e),n=aa(B);G={x:t.x-n.x+e.offsetWidth/2,y:t.y-n.y+e.offsetHeight/2,r:e.offsetWidth/2+10}}function aa(e){let t=0,n=0,r=e;for(;r;)t+=r.offsetLeft,n+=r.offsetTop,r=r.offsetParent;return{x:t,y:n}}function oa(e){if(!G)return 0;let t=e.x-G.x,n=e.y-G.y,r=Math.hypot(t,n),i=e.r+G.r;if(r>=i)return 0;let a=r<.001?1:t/r,o=r<.001?1:n/r;e.x=G.x+a*i,e.y=G.y+o*i;let s=e.vx*a+e.vy*o;return s>=0?0:(e.vx-=1.72*s*a,e.vy-=1.72*s*o,-s)}function sa(e,t,n){return Math.max(t,Math.min(n,e))}function ca(e){if(e.preventDefault(),!B||!W)return;try{B.setPointerCapture(e.pointerId)}catch{}let t=ua(e.clientX,e.clientY);Yi.set(e.pointerId,{x:t.x,y:t.y,vx:0,vy:0,t:performance.now()}),ma(t.x,t.y);let n=Li*Ji;for(let e of V){let r=e.x-t.x,i=e.y-t.y,a=Math.hypot(r,i),o,s;if(a<1){let e=Math.random()*Math.PI*2;o=Math.cos(e),s=Math.sin(e)}else o=r/a,s=i/a;if(a<e.r){let t=950+350*Math.random();e.vx+=o*t,e.vy+=s*t,fa(e,.2,Math.atan2(s,o)),pa(e,.32)}else if(a<e.r+n){let t=1-(a-e.r)/n,r=650*t;e.vx+=o*r,e.vy+=s*r,fa(e,.1*t,Math.atan2(s,o))}da(e)}ha()}function la(e){let t=Yi.get(e.pointerId);if(!t||!W)return;let n=ua(e.clientX,e.clientY),r=performance.now(),i=Math.max(8,r-t.t)/1e3;t.vx=t.vx*.4+(n.x-t.x)/i*.6,t.vy=t.vy*.4+(n.y-t.y)/i*.6,t.x=n.x,t.y=n.y,t.t=r;let a=Ri*Ji,o=!1;for(let e of V){let r=e.x-n.x,i=e.y-n.y,s=Math.hypot(r,i),c=e.r+a;if(s>=c)continue;let l=s<1?1:r/s,u=s<1?0:i/s;e.x=n.x+l*c,e.y=n.y+u*c,e.dirty=!0;let d=(e.vx-t.vx)*l+(e.vy-t.vy)*u;d<0&&(e.vx-=1.6*d*l,e.vy-=1.6*d*u,-d>250&&(fa(e,Math.min(.2,-d/4e3),Math.atan2(u,l)),pa(e,Math.min(.32,.12+-d/6e3)))),da(e),o=!0}o&&ha()}function ua(e,t){let n=B.getBoundingClientRect(),r=n.width>0?B.clientWidth/n.width:1,i=n.height>0?B.clientHeight/n.height:1;return{x:(e-n.left)*r,y:(t-n.top)*i}}function da(e){let t=Math.hypot(e.vx,e.vy);t>Ii&&(e.vx*=Ii/t,e.vy*=Ii/t)}function fa(e,t,n){t>e.squash&&(e.squash=t,e.squashDir=n)}function pa(e,t){let n=performance.now();n-e.lastSoundAt<70||n-Zi<35||(e.lastSoundAt=n,Zi=n,ae(e.def.freq,t))}function ma(e,t){if(!Hi||Xi>=zi)return;let n=document.createElement(`span`);n.className=`baelle-welle`,n.style.transform=`translate(${e.toFixed(0)}px, ${t.toFixed(0)}px)`,Hi.appendChild(n),Xi++,ea(()=>{n.remove(),Xi=Math.max(0,Xi-1)},650)}function ha(){Ki===null&&(qi=performance.now(),Ki=requestAnimationFrame(ga))}function ga(e){let t=Math.min(.033,Math.max(.001,(e-qi)/1e3));qi=e;let n=t>.017?2:1;for(let e=0;e<n;e++)_a(t/n);xa(!1),V.some(e=>Math.abs(e.vx)>3||Math.abs(e.vy)>3||e.squash>.002)?Ki=requestAnimationFrame(ga):(Ki=null,ta())}function _a(e){let t=Math.exp(-1*e),n=Pi*Ji*e;for(let r of V){let i=Math.hypot(r.vx,r.vy);if(i>0){let e=Math.max(0,i*t-n);r.vx*=e/i,r.vy*=e/i}r.x+=r.vx*e,r.y+=r.vy*e,r.spin+=r.vx*e/r.r,r.squash*=Math.exp(-11*e),va(r)}ya();for(let e of V)e.x=sa(e.x,e.r,H-e.r),e.y=sa(e.y,e.r,U-e.r)}function va(e){let t=0,n=0;e.x<e.r?(e.x=e.r,e.vx<0&&(t=-e.vx,e.vx=-e.vx*Fi,n=0)):e.x>H-e.r&&(e.x=H-e.r,e.vx>0&&(t=e.vx,e.vx=-e.vx*Fi,n=Math.PI)),e.y<e.r?(e.y=e.r,e.vy<0&&(t=Math.max(t,-e.vy),e.vy=-e.vy*Fi,n=Math.PI/2)):e.y>U-e.r&&(e.y=U-e.r,e.vy>0&&(t=Math.max(t,e.vy),e.vy=-e.vy*Fi,n=-Math.PI/2));let r=oa(e);if(r>t&&G&&(t=r,n=Math.atan2(e.y-G.y,e.x-G.x)),t>140){fa(e,Math.min(.22,t/5e3),n);let r=performance.now();r-e.lastSoundAt>=70&&r-Zi>=35&&(e.lastSoundAt=r,Zi=r,ae(e.def.freq*.75,Math.min(.26,.06+t/7e3)))}}function ya(){for(let e=0;e<V.length;e++)for(let t=e+1;t<V.length;t++){let n=V[e],r=V[t],i=r.x-n.x,a=r.y-n.y,o=Math.hypot(i,a),s=n.r+r.r;if(o>=s||o<.001)continue;let c=i/o,l=a/o,u=n.r*n.r,d=r.r*r.r,f=s-o;n.x-=c*f*(d/(u+d)),n.y-=l*f*(d/(u+d)),r.x+=c*f*(u/(u+d)),r.y+=l*f*(u/(u+d));let p=(r.vx-n.vx)*c+(r.vy-n.vy)*l;if(p>=0)continue;let m=-1.8599999999999999*p/(1/u+1/d);if(n.vx-=m/u*c,n.vy-=m/u*l,r.vx+=m/d*c,r.vy+=m/d*l,-p>160){let e=Math.min(.18,-p/5e3);fa(n,e,Math.atan2(l,c)),fa(r,e,Math.atan2(l,c));let t=performance.now();t-Zi>=35&&t-n.lastSoundAt>=70&&(n.lastSoundAt=t,r.lastSoundAt=t,Zi=t,ae((n.def.freq+r.def.freq)/2,Math.min(.28,.08+-p/6e3)))}}}function ba(){for(let e=0;e<V.length;e++)for(let t=e+1;t<V.length;t++){let n=V[e],r=V[t],i=r.x-n.x,a=r.y-n.y,o=Math.hypot(i,a);o<.001&&(i=1,a=0,o=1);let s=n.r+r.r+2;if(o>=s)continue;let c=(s-o)/2;n.x-=i/o*c,n.y-=a/o*c,r.x+=i/o*c,r.y+=a/o*c}V.forEach(e=>{oa(e),e.x=sa(e.x,e.r,H-e.r),e.y=sa(e.y,e.r,U-e.r)})}function xa(e){for(let t of V){if(!e&&!t.dirty&&t.vx===0&&t.vy===0&&t.squash<.002)continue;t.dirty=!1;let n=t.squash,r=t.squashDir*180/Math.PI;t.el.style.transform=`translate(${(t.x-t.r).toFixed(1)}px, ${(t.y-t.r).toFixed(1)}px) rotate(${r.toFixed(1)}deg) scale(${(1-n).toFixed(3)}, ${(1+n*.6).toFixed(3)}) rotate(${(-r).toFixed(1)}deg)`,t.muster.style.transform=`rotate(${(t.spin*180/Math.PI).toFixed(1)}deg)`}}function Sa(){ta(),Ui.forEach(e=>e()),Ui=[],Wi.forEach(e=>window.clearTimeout(e)),Wi=new Set,Ki!==null&&(cancelAnimationFrame(Ki),Ki=null),Gi?.disconnect(),Gi=null,Yi=new Map,V=[],B=null,Hi=null,W=!1,Qi=null,G=null}var Ca={id:`baelle`,accent:`#7ea3c9`,tileIcon:Mi,mount:na,unmount:Sa},wa=`
<svg viewBox="0 0 120 120" width="100%" height="100%">
  <path d="M10 98 Q34 62 60 66 Q88 60 110 98 Z" fill="#e0a458"/>
  <path d="M22 98 Q40 76 58 80 Q74 76 92 98 Z" fill="#d9824f"/>
  <path d="M44 86 Q52 74 62 84 Q56 92 44 86 Z" fill="#f4c86b"/>
  <path d="M78 18 C92 26 94 42 80 54 C66 44 66 28 78 18 Z" fill="#c96f5a" transform="rotate(28 80 36)"/>
  <path d="M30 28 C40 34 40 46 32 52 C22 46 22 34 30 28 Z" fill="#f4c86b" transform="rotate(-24 31 40)"/>
</svg>`,Ta=[`#e0a458`,`#d9824f`,`#f4c86b`,`#c96f5a`,`#b8a05a`,`#e8b06a`],Ea=[`blatt-ahorn`,`blatt-oval`,`blatt-rund`],Da=.8,Oa=.3,ka=[[Oa,30],[.6,24],[.86,24]],Aa=600,ja=1.6,Ma=4.2,Na=260,Pa=2200,Fa=230,Ia=75,La=18,Ra=13,za=8,Ba=`laub`,Va=1,Ha=ka.reduce((e,[,t])=>e+t,0),K=null,Ua=null,q=null,J=[],Y=[],Wa=[],Ga=new Set,Ka=null,qa=null,Ja=0,X=0,Ya=0,Z=1,Q=!1,Xa=new Map,Za=0,Qa=0,$a=null,eo=null;function to(e,t,n){e.addEventListener(t,n),Wa.push(()=>e.removeEventListener(t,n))}function no(e,t){let n=window.setTimeout(()=>{Ga.delete(n),e()},t);return Ga.add(n),n}var ro=`
<svg width="0" height="0" style="position:absolute" aria-hidden="true">
  <defs>
    <symbol id="blatt-ahorn" viewBox="0 0 100 100">
      <path d="M50 4 L58 28 L78 16 L72 40 L95 42 L77 57 L86 76 L61 68 L55 88 L50 92 L45 88 L39 68 L14 76 L23 57 L5 42 L28 40 L22 16 L42 28 Z" fill="currentColor"/>
      <path d="M50 98 L50 20 M50 60 L24 46 M50 60 L76 46" stroke="rgba(90,55,25,0.35)" stroke-width="3" fill="none" stroke-linecap="round"/>
    </symbol>
    <symbol id="blatt-oval" viewBox="0 0 100 100">
      <path d="M50 4 C80 24 86 62 50 92 C14 62 20 24 50 4 Z" fill="currentColor"/>
      <path d="M50 98 L50 12 M50 40 L34 28 M50 40 L66 28 M50 60 L32 48 M50 60 L68 48" stroke="rgba(90,55,25,0.35)" stroke-width="3" fill="none" stroke-linecap="round"/>
    </symbol>
    <symbol id="blatt-rund" viewBox="0 0 100 100">
      <path d="M50 8 C82 10 94 46 72 74 C62 86 54 90 50 92 C46 90 38 86 28 74 C6 46 18 10 50 8 Z" fill="currentColor"/>
      <path d="M50 98 L50 18 M50 50 L28 36 M50 50 L72 36" stroke="rgba(90,55,25,0.35)" stroke-width="3" fill="none" stroke-linecap="round"/>
    </symbol>
  </defs>
</svg>`,io=`
<svg viewBox="0 0 200 300" width="100%" height="100%" preserveAspectRatio="xMidYMax meet">
  <path d="M88 300 L92 150 L70 112 M92 170 L124 128 M92 150 L96 96" stroke="#a9835e" stroke-width="10" fill="none" stroke-linecap="round"/>
  <path d="M84 300 L88 150 L112 150 L116 300 Z" fill="#a9835e"/>
  <circle cx="100" cy="74" r="48" fill="#e8b06a"/>
  <circle cx="58" cy="104" r="40" fill="#e0a458"/>
  <circle cx="146" cy="100" r="40" fill="#d9824f"/>
  <circle cx="80" cy="140" r="34" fill="#f4c86b"/>
  <circle cx="128" cy="144" r="32" fill="#e8b06a"/>
  <circle cx="112" cy="58" r="22" fill="#f4c86b" opacity="0.8"/>
</svg>`,ao=`
<svg viewBox="0 0 120 76" width="100%" height="100%">
  <ellipse cx="58" cy="72" rx="50" ry="5" fill="rgba(90,70,40,0.18)"/>
  <path d="M8 70 L6 56 L14 50 L10 38 L22 36 L22 22 L34 26 L40 12 L50 22 L60 8 L66 22 L78 14 L80 28 L92 26 L90 40 L98 44 L96 70 Z" fill="#8a6a4a"/>
  <path d="M84 70 Q86 44 102 46 Q114 50 116 62 Q110 70 84 70 Z" fill="#e8cfa8"/>
  <circle cx="116" cy="61" r="3.5" fill="#4a4032"/>
  <g class="igel-auge-zu"><path d="M98 54 Q102 57 106 54" stroke="#4a4032" stroke-width="2.5" fill="none" stroke-linecap="round"/></g>
  <g class="igel-auge-auf"><circle cx="102" cy="54" r="3.5" fill="#4a4032"/><circle cx="103" cy="53" r="1.1" fill="#fff"/></g>
  <ellipse cx="96" cy="63" rx="4" ry="2.5" fill="#f2b8c6" opacity="0.7"/>
</svg>`;function oo(e){Wa=[],Ga=new Set,Xa=new Map,Q=!1,Za=0,X=0,Ya=0,$a=null;let t=_(Ba,Va,null);eo=t&&Array.isArray(t.liegen)&&t.liegen.length===Ha?t:null,e.innerHTML=`
    <div class="laub-stage" id="laubStage">
      ${ro}
      <div class="laub-himmel"></div>
      <div class="laub-huegel"></div>
      <div class="laub-baum">${io}</div>
      <div class="laub-boden"></div>
      <div class="laub-igel" id="laubIgel">${ao}</div>
      <div class="laub-blaetter" id="laubBlaetter"></div>
      <div class="laub-wirbel" id="laubWirbel"></div>
    </div>
  `,K=e.querySelector(`#laubStage`),Ua=e.querySelector(`#laubWirbel`),q=e.querySelector(`#laubIgel`);let n=e.querySelector(`#laubBlaetter`);J=[];for(let e=0;e<Ha;e++){let t=document.createElement(`div`);t.className=`laub-blatt`,t.style.color=Ta[e%Ta.length],t.innerHTML=`<svg viewBox="0 0 100 100" width="100%" height="100%"><use href="#${Ea[e%Ea.length]}"/></svg>`,n.appendChild(t),J.push({i:e,el:t,size:0,baseSize:54+e*37%22,x:0,y:0,vx:0,vy:0,rot:0,vrot:0,phase:Math.random()*Math.PI*2,phaseSpeed:2.4+Math.random()*1.6,onGround:!1,bin:-1,dirty:!0})}Ka=new ResizeObserver(()=>ho()),Ka.observe(K),to(K,`pointerdown`,e=>yo(e)),to(K,`pointermove`,e=>bo(e)),to(K,`pointerup`,e=>Xa.delete(e.pointerId)),to(K,`pointercancel`,e=>Xa.delete(e.pointerId))}function so(){return Ya*Da}function co(){return Math.max(1,Math.ceil(X/(La*Z)))}function lo(e){return Math.max(0,Math.min(Y.length-1,Math.floor(e/(La*Z))))}function uo(e){return(e+.5)*La*Z}function fo(e){return so()-e*Ra*Z-Z*6}function po(e,t,n=!1){let r=t;for(let e=0;e<24;e++){let e=Y[r].length,t=r>0?Y[r-1].length:1/0,n=r<Y.length-1?Y[r+1].length:1/0;if(e-Math.min(t,n)<2)break;t<n?--r:r+=n<t?1:Math.random()<.5?-1:1}Y[r].push(e),e.onGround=!0,e.bin=r;let i=La*Z;n?e.x=Math.max(r*i,Math.min((r+1)*i,e.x)):(e.x=uo(r)+(Math.random()-.5)*i*.8,e.rot=(Math.random()-.5)*70+(Math.random()<.5?0:180)),e.y=fo(Y[r].length-1),e.vx=0,e.vy=0,e.vrot=0,e.dirty=!0}function mo(e){if(!e.onGround)return;let t=e.bin,n=Y[t],r=n.indexOf(e);if(e.onGround=!1,e.bin=-1,r<0)return;let i=n.splice(r);i.shift(),i.forEach(e=>{e.onGround=!1,e.bin=-1,e.vy=0,e.vx=(Math.random()-.5)*40});for(let e of[t-1,t+1])if(!(e<0||e>=Y.length))for(;Y[e].length-Y[t].length>3;){let n=Y[e].pop();n.onGround=!1,n.bin=-1,n.vy=0,n.vx=(e<t?1:-1)*60}}function ho(){if(!K)return;let e=K.clientWidth,t=K.clientHeight;if(e<1||t<1)return;let n=X,r=Ya,i=Q?go().map(e=>[e.i,e.x/n*100]):null;if(X=e,Ya=t,Z=Math.max(.55,Math.min(1.2,Math.min(X,Ya)/834)),Y=Array.from({length:co()},()=>[]),J.forEach(e=>{e.size=e.baseSize*Z,e.el.style.width=`${e.size.toFixed(1)}px`,e.el.style.height=`${e.size.toFixed(1)}px`}),Q)i?.forEach(([e,t])=>po(J[e],lo(t/100*X))),J.forEach(e=>{e.onGround||(e.x=Math.max(e.size/2,Math.min(X-e.size/2,e.x*(X/n))),e.y*=Ya/r,e.dirty=!0)});else{if(eo)eo.liegen.forEach(([e,t])=>{let n=J[e];n&&po(n,lo(t/100*X))}),J.forEach(e=>{e.onGround||po(e,lo(X/2))});else{let e=0;for(let[t,n]of ka)for(let r=0;r<n;r++,e++){let n=(Math.random()+Math.random()-1)*50*Z;po(J[e],lo(t*X+n))}}Q=!0,K.classList.add(`bereit`)}_o(),Oo()}function go(){let e=[],t=Y.reduce((e,t)=>Math.max(e,t.length),0);for(let n=0;n<t;n++)for(let t of Y)t[n]&&e.push(t[n]);return e}function _o(){if(!q)return;let e=120*Z,t=76*Z;q.style.width=`${e.toFixed(1)}px`,q.style.height=`${t.toFixed(1)}px`,q.style.transform=`translate(${(Oa*X-e/2).toFixed(1)}px, ${(so()-t+4*Z).toFixed(1)}px)`}function vo(e,t){let n=K.getBoundingClientRect(),r=n.width>0?K.clientWidth/n.width:1,i=n.height>0?K.clientHeight/n.height:1;return{x:(e-n.left)*r,y:(t-n.top)*i}}function yo(e){if(e.preventDefault(),!K||!Q)return;try{K.setPointerCapture(e.pointerId)}catch{}let t=vo(e.clientX,e.clientY);Xa.set(e.pointerId,{x:t.x,y:t.y,vx:0,vy:0,t:performance.now()}),e.target.closest?.(`.laub-igel`)&&wo();let n=Fa*Z,r=Math.min(.4,.8*n/Math.max(1,so())),i=0;for(let e of J){let a=e.x-t.x,o=e.y-t.y,s=Math.hypot(a,o>0?o*r:o);if(s>=n)continue;let c=1-s/n,l=Math.abs(a)<4?Math.random()<.5?-1:1:Math.sign(a);(e.x<X*.15&&l<0||e.x>X*.85&&l>0)&&(l*=-.7),mo(e),e.vx+=(l*(100+500*c)*(.6+Math.random()*.7)+(Math.random()-.5)*120)*Z,e.vy=Math.min(e.vy,-(250+1050*c)*(.75+Math.random()*.4)*Z),e.vrot=(Math.random()-.5)*900,xo(e),i++}Co(t.x,t.y),i>0?So(i):performance.now()-Qa>120&&(Qa=performance.now(),g()),To()}function bo(e){let t=Xa.get(e.pointerId);if(!t||!Q)return;let n=vo(e.clientX,e.clientY),r=performance.now(),i=Math.max(8,r-t.t)/1e3;if(t.vx=t.vx*.4+(n.x-t.x)/i*.6,t.vy=t.vy*.4+(n.y-t.y)/i*.6,t.x=n.x,t.y=n.y,t.t=r,Math.hypot(t.vx,t.vy)<120*Z)return;let a=Ia*Z,o=0;for(let e of J)Math.hypot(e.x-n.x,e.y-n.y)>=a||(e.onGround?(mo(e),e.vx=t.vx*.6+(Math.random()-.5)*80*Z,e.vy=Math.min(t.vy*.3,0)-(300+Math.random()*300)*Z,e.vrot=(Math.random()-.5)*700,o++):(e.vx+=t.vx*.35,e.vy+=t.vy*.35),xo(e));o>0&&So(o),To()}function xo(e){let t=Pa*Z,n=Math.hypot(e.vx,e.vy);n>t&&(e.vx*=t/n,e.vy*=t/n)}function So(e){let t=performance.now();t-Qa<80||(Qa=t,oe(Math.min(.3,.1+e*.012),.22+Math.min(.16,e*.01)))}function Co(e,t){if(!Ua||Za>=za)return;let n=document.createElement(`span`);n.className=`laub-wirbelchen`,n.style.transform=`translate(${e.toFixed(0)}px, ${t.toFixed(0)}px)`,n.innerHTML=`<svg viewBox="0 0 80 80" width="100%" height="100%"><path d="M14 40 C14 20 40 12 54 24 C66 34 58 52 44 50 C34 48 34 36 42 34" fill="none" stroke="rgba(255,250,242,0.9)" stroke-width="6" stroke-linecap="round"/></svg>`,Ua.appendChild(n),Za++,no(()=>{n.remove(),Za=Math.max(0,Za-1)},700)}function wo(){q&&(q.classList.add(`wach`),q.classList.remove(`hopst`),q.offsetWidth,q.classList.add(`hopst`),m({freq:880,duration:.04,attack:.004,release:.06,type:`triangle`,gain:.14}),no(()=>m({freq:988,duration:.04,attack:.004,release:.06,type:`triangle`,gain:.14}),120),$a!==null&&(window.clearTimeout($a),Ga.delete($a)),$a=no(()=>{q?.classList.remove(`wach`),$a=null},2200))}function To(){qa===null&&(Ja=performance.now(),qa=requestAnimationFrame(Eo))}function Eo(e){let t=Math.min(.033,Math.max(.001,(e-Ja)/1e3));Ja=e,Do(t),Oo(),J.some(e=>!e.onGround)?qa=requestAnimationFrame(Eo):(qa=null,ko())}function Do(e){let t=Aa*Z;for(let n of J){if(n.onGround)continue;if(n.vy+=t*e,n.vy*=Math.exp(-(n.vy<0?ja:Ma)*e),n.vx*=Math.exp(-1.4*e),n.phase+=n.phaseSpeed*e,n.vy>0){n.vx+=Math.cos(n.phase)*Na*Z*e;let t=Math.sin(n.phase)*40;n.rot+=(t-n.rot)*Math.min(1,3*e)+n.vrot*e}else n.rot+=n.vrot*e;n.vrot*=Math.exp(-1.5*e),n.x+=n.vx*e,n.y+=n.vy*e;let r=n.size/2;n.x<r?(n.x=r,n.vx=Math.abs(n.vx)*.4):n.x>X-r&&(n.x=X-r,n.vx=-Math.abs(n.vx)*.4),n.y<r&&(n.y=r,n.vy=Math.abs(n.vy)*.2);let i=lo(n.x);n.vy>=0&&n.y>=fo(Y[i].length)&&po(n,i,!0),n.dirty=!0}}function Oo(){for(let e of J)e.dirty&&(e.dirty=!1,e.el.style.transform=`translate(${(e.x-e.size/2).toFixed(1)}px, ${(e.y-e.size/2).toFixed(1)}px) rotate(${e.rot.toFixed(1)}deg)`)}function ko(){if(!Q||X===0)return;let e=go().map(e=>[e.i,e.x/X*100]);J.forEach(t=>{t.onGround||e.push([t.i,t.x/X*100])}),v(Ba,Va,{liegen:e})}function Ao(){ko(),Wa.forEach(e=>e()),Wa=[],Ga.forEach(e=>window.clearTimeout(e)),Ga=new Set,$a=null,qa!==null&&(cancelAnimationFrame(qa),qa=null),Ka?.disconnect(),Ka=null,Xa=new Map,J=[],Y=[],K=null,Ua=null,q=null,Q=!1,eo=null}var jo={id:`laub`,accent:`#e0a458`,tileIcon:wa,mount:oo,unmount:Ao};de();var Mo=[Xe,ht,Lt,cn,Sn,Yn,br,Kr,si,ji,Ca,jo],No=document.querySelector(`#app`),Po=`
  <svg viewBox="0 0 96 96" width="40" height="40">
    <path d="M56 26 L34 48 L56 70" fill="none" stroke="#8a7255" stroke-width="8"
      stroke-linecap="round" stroke-linejoin="round"/>
  </svg>
`,Fo=18,Io=2*Math.PI*Fo;No.innerHTML=`
  <div class="spielzimmer" id="spielzimmer">
    <div class="tiles" id="tiles"></div>
    <button class="eltern-gate" id="elternGate" aria-hidden="true">${`
  <svg viewBox="0 0 44 44">
    <circle cx="22" cy="22" r="${Fo}" fill="none" stroke="#8a7255" stroke-width="3" opacity="0.25"/>
    <circle class="eltern-gate-progress" cx="22" cy="22" r="${Fo}" fill="none"
      stroke="#8a7255" stroke-width="3" stroke-linecap="round"
      stroke-dasharray="${Io}" stroke-dashoffset="${Io}"
      transform="rotate(-90 22 22)"/>
    <circle cx="22" cy="22" r="4" fill="#8a7255"/>
  </svg>
`}</button>
  </div>
  <div class="toy-view" id="toyView">
    <div class="toy-stage" id="toyStage"></div>
  </div>
  <button class="back-button" id="backButton" aria-hidden="true">${Po}</button>
  <div class="eltern-overlay" id="elternOverlay">
    <div id="elternPanelWrap"></div>
  </div>
  <div class="version-placeholder">v1.1.2 · c73966e</div>
`;var Lo=document.querySelector(`#spielzimmer`),Ro=document.querySelector(`#tiles`),zo=document.querySelector(`#toyView`),Bo=document.querySelector(`#toyStage`),$=document.querySelector(`#backButton`),Vo=document.querySelector(`#elternGate`),Ho=document.querySelector(`#elternOverlay`),Uo=document.querySelector(`#elternPanelWrap`),Wo=null,Go=!1;function Ko(){Ro.innerHTML=``,Mo.forEach((e,t)=>{let n=document.createElement(`button`);n.className=`tile`,n.style.setProperty(`--accent`,e.accent),n.style.animationDelay=`${(t*.7%4.5).toFixed(2)}s`,n.innerHTML=e.tileIcon,n.setAttribute(`aria-hidden`,`true`),n.addEventListener(`pointerdown`,t=>{t.preventDefault(),qo(e)}),Ro.appendChild(n)})}function qo(e){Go||Wo||(Go=!0,Wo=e,e.mount(Bo),Lo.classList.add(`hidden`),$.classList.add(`visible`),zo.classList.add(`active`),window.setTimeout(()=>{Go=!1},450))}function Jo(){Go||!Wo||(Go=!0,zo.classList.remove(`active`),Lo.classList.remove(`hidden`),$.classList.remove(`visible`),window.setTimeout(()=>{Wo?.unmount?.(),Bo.innerHTML=``,Wo=null,Go=!1},450))}var Yo=150,Xo=1200,Zo=40,Qo={id:-1,at:-1/0},$o={id:-1,at:-1/0},es=null;document.addEventListener(`pointerdown`,e=>{es&&e.pointerId!==es.id&&(es.valid=!1),Qo=$o,$o={id:e.pointerId,at:performance.now()}},{capture:!0});function ts(){es=null,$.classList.remove(`gedrueckt`)}$.addEventListener(`pointerdown`,e=>{e.preventDefault();let t=performance.now(),n=Qo.id!==e.pointerId&&t-Qo.at<Yo,r=es!==null;es={id:e.pointerId,at:t,x:e.clientX,y:e.clientY,valid:!n&&!r},$.classList.add(`gedrueckt`);try{$.setPointerCapture(e.pointerId)}catch{}}),$.addEventListener(`pointerup`,e=>{let t=es;if(ts(),!t||t.id!==e.pointerId||!t.valid)return;let n=$.getBoundingClientRect(),r=e.clientX>=n.left&&e.clientX<=n.right&&e.clientY>=n.top&&e.clientY<=n.bottom,i=performance.now()-t.at<Xo,a=Math.hypot(e.clientX-t.x,e.clientY-t.y)<Zo;r&&i&&a&&Jo()}),$.addEventListener(`pointercancel`,ts);var ns=3e3,rs=null;function is(){rs===null&&(Vo.classList.add(`charging`),rs=window.setTimeout(()=>{rs=null,Vo.classList.remove(`charging`),os()},ns))}function as(){rs!==null&&(window.clearTimeout(rs),rs=null),Vo.classList.remove(`charging`)}Vo.addEventListener(`pointerdown`,e=>{e.preventDefault(),is()}),Vo.addEventListener(`pointerup`,as),Vo.addEventListener(`pointercancel`,as),Vo.addEventListener(`pointerleave`,as);function os(){pe(Uo),Ho.classList.add(`active`)}function ss(){Ho.classList.remove(`active`)}Ho.addEventListener(`pointerdown`,e=>{e.target===Ho&&ss()}),document.addEventListener(`click`,e=>{e.target.closest(`.eltern-close`)&&ss()}),document.addEventListener(`gesturestart`,e=>e.preventDefault()),document.addEventListener(`gesturechange`,e=>e.preventDefault()),document.addEventListener(`dblclick`,e=>e.preventDefault()),document.addEventListener(`contextmenu`,e=>e.preventDefault());var cs=!1;document.addEventListener(`pointerdown`,()=>{s(),cs||(cs=!0,window.setTimeout(()=>{f()&&m({freq:523.25,duration:.15,gain:.25})},80))},{once:!1}),Ko();