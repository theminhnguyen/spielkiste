(function(){let e=document.createElement(`link`).relList;if(e&&e.supports&&e.supports(`modulepreload`))return;for(let e of document.querySelectorAll(`link[rel="modulepreload"]`))n(e);new MutationObserver(e=>{for(let t of e)if(t.type===`childList`)for(let e of t.addedNodes)e.tagName===`LINK`&&e.rel===`modulepreload`&&n(e)}).observe(document,{childList:!0,subtree:!0});function t(e){let t={};return e.integrity&&(t.integrity=e.integrity),e.referrerPolicy&&(t.referrerPolicy=e.referrerPolicy),t.credentials=e.crossOrigin===`use-credentials`?`include`:e.crossOrigin===`anonymous`?`omit`:`same-origin`,t}function n(e){if(e.ep)return;e.ep=!0;let n=t(e);fetch(e.href,n)}})();var e=null,t=null,n=!1,r=null,i=null;function a(){if(e)return e;try{let r=window.AudioContext??window.webkitAudioContext;return r?(e=new r,e.onstatechange=()=>{e?.state===`running`&&(n=!0)},t=e.createGain(),t.gain.value=u(),t.connect(e.destination),e):(i=`AudioContext wird vom Browser nicht unterstützt`,null)}catch(t){return i=t instanceof Error?t.message:String(t),e=null,null}}function o(){let e=new Uint8Array(45),t=new DataView(e.buffer),n=(e,n)=>{for(let r=0;r<n.length;r++)t.setUint8(e+r,n.charCodeAt(r))};n(0,`RIFF`),t.setUint32(4,37,!0),n(8,`WAVE`),n(12,`fmt `),t.setUint32(16,16,!0),t.setUint16(20,1,!0),t.setUint16(22,1,!0),t.setUint32(24,8e3,!0),t.setUint32(28,8e3,!0),t.setUint16(32,1,!0),t.setUint16(34,8,!0),n(36,`data`),t.setUint32(40,1,!0),t.setUint8(44,128);let r=``;return e.forEach(e=>r+=String.fromCharCode(e)),`data:audio/wav;base64,${btoa(r)}`}function s(){if(!n)try{let e=a();if(!e)return;e.state===`running`?n=!0:e.state===`closed`?i=`AudioContext im Zustand "${e.state}"`:e.resume().then(()=>{e.state===`running`&&(n=!0)}).catch(t=>{i=`resume() abgelehnt (Zustand war "${e.state}"): ${t instanceof Error?t.message:String(t)}`}),r||(r=new Audio(o()),r.volume=.01,r.setAttribute(`playsinline`,`true`));try{r.currentTime=0}catch{}r.play().catch(e=>{i=`stilles <audio> abgelehnt: ${e instanceof Error?e.message:String(e)}`})}catch(e){i=e instanceof Error?`${e.name}: ${e.message}`:String(e)}}function c(){let t=[];t.push(e?`Status: ${e.state}`:`Status: noch nicht gestartet`),t.push(n?`freigeschaltet: ja`:`freigeschaltet: nein`),t.push(`Lautstärke: ${Math.round(l*100)}%`);let r=!!(window.AudioContext??window.webkitAudioContext);return t.push(`AudioContext unterstützt: ${r?`ja`:`nein`}`),i&&t.push(`letzter Fehler: ${i}`),t.join(` · `)}var l=.6;function u(){return l}function d(e){l=Math.max(0,Math.min(1,e)),t&&(t.gain.value=l)}function ee(){return!!e&&e.state===`running`}var f=[261.63,293.66,329.63,392,440,523.25,587.33,659.25];function p(n){let r=e;if(!r||!t||r.state!==`running`)return;let{freq:i,duration:a=.5,attack:o=.02,release:s=.35,type:c=`sine`,gain:l=.5}=n,u=r.createOscillator();u.type=c,u.frequency.value=i;let d=r.createGain();d.gain.setValueAtTime(0,r.currentTime),d.gain.linearRampToValueAtTime(l,r.currentTime+o),d.gain.linearRampToValueAtTime(0,r.currentTime+o+a+s),u.connect(d),d.connect(t),u.start(),u.stop(r.currentTime+o+a+s+.05)}function m(e=440){p({freq:e,duration:.03,attack:.002,release:.08,type:`triangle`,gain:.3})}function te(n,r=.28){let i=e;if(!i||!t||i.state!==`running`)return null;let a=i.createOscillator();a.type=`sine`,a.frequency.value=n;let o=i.createGain();o.gain.setValueAtTime(0,i.currentTime),o.gain.linearRampToValueAtTime(r,i.currentTime+.05),a.connect(o),o.connect(t),a.start();let s=!1;return{update(e){s||a.frequency.linearRampToValueAtTime(e,i.currentTime+.06)},stop(){s||(s=!0,o.gain.cancelScheduledValues(i.currentTime),o.gain.setValueAtTime(o.gain.value,i.currentTime),o.gain.linearRampToValueAtTime(0,i.currentTime+.15),a.stop(i.currentTime+.2))}}}var ne=null;function re(e){if(ne)return ne;let t=e.sampleRate*.5,n=e.createBuffer(1,t,e.sampleRate),r=n.getChannelData(0);for(let e=0;e<t;e++)r[e]=Math.random()*2-1;return ne=n,n}function ie(n){let r=e;if(!r||!t||r.state!==`running`)return;let i=r.createBufferSource();i.buffer=re(r);let a=r.createBiquadFilter();a.type=`bandpass`,a.Q.value=8;let o=n?700:2200,s=n?2200:700;a.frequency.setValueAtTime(o,r.currentTime),a.frequency.linearRampToValueAtTime(s,r.currentTime+.35);let c=r.createGain();c.gain.setValueAtTime(0,r.currentTime),c.gain.linearRampToValueAtTime(.18,r.currentTime+.03),c.gain.linearRampToValueAtTime(0,r.currentTime+.38),i.connect(a),a.connect(c),c.connect(t),i.start(),i.stop(r.currentTime+.4)}function h(){let n=e;if(!n||!t||n.state!==`running`)return;let r=n.createBufferSource();r.buffer=re(n);let i=n.createBiquadFilter();i.type=`lowpass`,i.frequency.setValueAtTime(300,n.currentTime),i.frequency.linearRampToValueAtTime(1400,n.currentTime+.25);let a=n.createGain();a.gain.setValueAtTime(0,n.currentTime),a.gain.linearRampToValueAtTime(.14,n.currentTime+.05),a.gain.linearRampToValueAtTime(0,n.currentTime+.3),r.connect(i),i.connect(a),a.connect(t),r.start(),r.stop(n.currentTime+.32)}var ae=`spielkiste:`;function g(e,t,n){try{let r=localStorage.getItem(ae+e);if(!r)return n;let i=JSON.parse(r);return i.v===t?i.data:n}catch{return n}}function _(e,t,n){try{let r={v:t,data:n};localStorage.setItem(ae+e,JSON.stringify(r))}catch{}}function oe(){try{let e=[];for(let t=0;t<localStorage.length;t++){let n=localStorage.key(t);n?.startsWith(ae)&&e.push(n)}e.forEach(e=>localStorage.removeItem(e))}catch{}}var se=`settings`,ce=1;function le(){d(g(se,ce,{volume:.6}).volume)}function ue(e){_(se,ce,{volume:e})}function de(e){e.innerHTML=`
    <div class="eltern-panel">
      <h1>Spielkiste</h1>
      <p class="eltern-version">Version 1.0.4 · 777a041</p>

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
  `;let t=e.querySelector(`.eltern-volume`);t.addEventListener(`input`,()=>{d(Number(t.value)/100)}),t.addEventListener(`change`,()=>{ue(Number(t.value)/100),m(500)});let n=e.querySelector(`.eltern-audio-status`);function r(){n.textContent=c()}r(),window.setTimeout(r,400),e.querySelector(`.eltern-test-ton`).addEventListener(`click`,()=>{s(),p({freq:523.25,duration:.3,attack:.01,release:.3,gain:.4}),r(),window.setTimeout(r,400)});let i=e.querySelector(`.eltern-reset-btn`),a=e.querySelector(`.eltern-reset-confirm`),o=e.querySelector(`.eltern-reset-cancel`),l=e.querySelector(`.eltern-reset-confirm-btn`);i.addEventListener(`click`,()=>{i.hidden=!0,a.hidden=!1}),o.addEventListener(`click`,()=>{a.hidden=!0,i.hidden=!1}),l.addEventListener(`click`,()=>{oe(),window.location.reload()})}var fe=`
<svg viewBox="0 0 120 120" width="100%" height="100%">
  <rect x="14" y="14" width="92" height="92" rx="18" fill="#fdf6ea" stroke="#e0a458" stroke-width="4"/>
  <circle cx="42" cy="46" r="10" fill="#e0a458"/>
  <rect x="66" y="38" width="34" height="14" rx="7" fill="#7fb99e"/>
  <circle cx="42" cy="80" r="12" fill="#e88a9a"/>
  <rect x="66" y="72" width="34" height="14" rx="7" fill="#f4a56b"/>
</svg>`,pe=`brett`,me=2,he={switchOn:!1,knobStep:0,sliderValue:.3,zipperOpen:!1,doorIndex:0,curtainOpen:!1,veloOpen:!1,beads:[.08,.28,.48,.68],kaleidoStep:0},v=[`<svg viewBox="0 0 100 100"><circle cx="50" cy="55" r="30" fill="#f2c9a0"/><circle cx="28" cy="30" r="14" fill="#f2c9a0"/><circle cx="72" cy="30" r="14" fill="#f2c9a0"/><circle cx="40" cy="52" r="4" fill="#4a4032"/><circle cx="60" cy="52" r="4" fill="#4a4032"/><ellipse cx="50" cy="64" rx="6" ry="4" fill="#e88a9a"/></svg>`,`<svg viewBox="0 0 100 100"><ellipse cx="50" cy="58" rx="26" ry="28" fill="#e8dfd0"/><ellipse cx="35" cy="20" rx="8" ry="18" fill="#e8dfd0"/><ellipse cx="65" cy="20" rx="8" ry="18" fill="#e8dfd0"/><circle cx="40" cy="55" r="4" fill="#4a4032"/><circle cx="60" cy="55" r="4" fill="#4a4032"/><ellipse cx="50" cy="66" rx="5" ry="3" fill="#e88a9a"/></svg>`,`<svg viewBox="0 0 100 100"><circle cx="50" cy="55" r="32" fill="#c9a37e"/><circle cx="22" cy="32" r="12" fill="#c9a37e"/><circle cx="78" cy="32" r="12" fill="#c9a37e"/><circle cx="40" cy="52" r="4" fill="#4a4032"/><circle cx="60" cy="52" r="4" fill="#4a4032"/><ellipse cx="50" cy="66" rx="8" ry="5" fill="#8a7255"/></svg>`],y={...he},ge=[],b=null,x=[],_e=0;function S(e,t,n){e.addEventListener(t,n),ge.push(()=>e.removeEventListener(t,n))}function C(){_(pe,me,y)}function ve(e){y=g(pe,me,{...he}),ge=[],b=null,x=[],_e=0,e.innerHTML=`
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
            <div class="door-animal">${v[y.doorIndex%v.length]}</div>
            <div class="door-panel"></div>
          </div>
        </div>

        <div class="brett-mod brett-gears" data-mod="gears">
          <svg class="gear g-big" viewBox="0 0 100 100" width="66" height="66">${ye(`#7fb99e`)}</svg>
          <svg class="gear g-small" viewBox="0 0 100 100" width="44" height="44">${ye(`#e0a458`)}</svg>
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
            <div class="crank-pop">${v[0]}</div>
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
  `,be(e),Se(e),we(e),Te(e),De(e),ke(e),je(e),Ne(e),Pe(e),Fe(e),Le(e),ze(e),Ve(e),Ue(e)}function ye(e){return`${Array.from({length:8},(t,n)=>`<rect x="44" y="2" width="12" height="18" rx="3" fill="${e}" transform="rotate(${n*360/8} 50 50)"/>`).join(``)}<circle cx="50" cy="50" r="34" fill="${e}"/><circle cx="50" cy="50" r="11" fill="#fffaf2"/>`}function be(e){let t=e.querySelector(`.brett-switch`);xe(t),S(t,`pointerdown`,e=>{e.preventDefault(),y.switchOn=!y.switchOn,xe(t),p({freq:y.switchOn?440:330,duration:.05,attack:.002,release:.1,type:`square`,gain:.25}),C()})}function xe(e){e.classList.toggle(`on`,y.switchOn)}function Se(e){let t=e.querySelector(`.brett-knob`),n=t.querySelector(`.knob-dial`);Ce(n);let r=!1;function i(e,t){let r=n.getBoundingClientRect(),i=r.left+r.width/2,a=r.top+r.height/2,o=e-i,s=t-a,c=Math.atan2(s,o)*180/Math.PI+90;return c<0&&(c+=360),Math.round(c/45)%8}S(t,`pointerdown`,e=>{let n=e;n.preventDefault(),r=!0;try{t.setPointerCapture(n.pointerId)}catch{}o(n.clientX,n.clientY)}),S(t,`pointermove`,e=>{if(!r)return;let t=e;o(t.clientX,t.clientY)});function a(e){if(!r)return;r=!1;let n=e;if(n.pointerId!==void 0)try{t.releasePointerCapture(n.pointerId)}catch{}}S(t,`pointerup`,a),S(t,`pointercancel`,a);function o(e,t){let r=i(e,t);r!==y.knobStep&&(y.knobStep=r,Ce(n),p({freq:f[r%f.length],duration:.04,attack:.002,release:.08,type:`triangle`,gain:.25}),C())}}function Ce(e){e.style.transform=`rotate(${y.knobStep*45}deg)`}function we(e){e.querySelectorAll(`.press-btn`).forEach(e=>{S(e,`pointerdown`,t=>{t.preventDefault(),p({freq:f[Number(e.dataset.note??`0`)%f.length],duration:.3,gain:.4}),e.classList.add(`pressed`),window.setTimeout(()=>e.classList.remove(`pressed`),260)})})}function Te(e){let t=e.querySelector(`.brett-slider`),n=t.querySelector(`.slider-track`),r=t.querySelector(`.slider-handle`),i=t.querySelector(`.slider-fill`);Ee(r,i);let a=!1;function o(e){let t=n.getBoundingClientRect(),r=(e-t.left)/t.width;return Math.max(0,Math.min(1,r))}function s(e){return 220*4**e}S(t,`pointerdown`,e=>{let n=e;n.preventDefault(),a=!0;try{t.setPointerCapture(n.pointerId)}catch{}y.sliderValue=o(n.clientX),Ee(r,i),b=te(s(y.sliderValue))}),S(t,`pointermove`,e=>{a&&(y.sliderValue=o(e.clientX),Ee(r,i),b?.update(s(y.sliderValue)))});function c(e){if(!a)return;a=!1,b?.stop(),b=null;let n=e;if(n.pointerId!==void 0)try{t.releasePointerCapture(n.pointerId)}catch{}C()}S(t,`pointerup`,c),S(t,`pointercancel`,c)}function Ee(e,t){let n=y.sliderValue*100;e.style.left=`${n}%`,t.style.width=`${n}%`}function De(e){let t=e.querySelector(`.brett-zipper`),n=t.querySelector(`.zipper-track`),r=t.querySelector(`.zipper-pull`);Oe(t);let i=!1,a=0,o=0;S(t,`pointerdown`,e=>{let n=e;n.preventDefault(),i=!0,o=0,a=n.clientY;try{t.setPointerCapture(n.pointerId)}catch{}}),S(t,`pointermove`,e=>{if(!i)return;let t=e,s=n.getBoundingClientRect(),c=Math.max(0,Math.min(1,(t.clientY-s.top)/s.height));o+=Math.abs(t.clientY-a),a=t.clientY,r.style.top=`${c*100}%`});function s(e){if(!i)return;i=!1;let a=e;if(a.pointerId!==void 0)try{t.releasePointerCapture(a.pointerId)}catch{}let s=n.getBoundingClientRect(),c=r.getBoundingClientRect(),l=(c.top+c.height/2-s.top)/s.height,u=y.zipperOpen,d=o<6?!y.zipperOpen:l>.5;d!==u&&(y.zipperOpen=d,ie(d),C()),Oe(t)}S(t,`pointerup`,s),S(t,`pointercancel`,s)}function Oe(e){e.classList.toggle(`open`,y.zipperOpen);let t=e.querySelector(`.zipper-pull`);t.style.top=y.zipperOpen?`100%`:`0%`}function ke(e){let t=e.querySelector(`.brett-windmill`),n=t.querySelector(`.windmill-blades`);n.style.transform=`rotate(${_e}deg)`,S(t,`pointerdown`,e=>{e.preventDefault(),Ae(n)})}function Ae(e){x.forEach(e=>window.clearTimeout(e)),x=[];let t=3+Math.random()*2;_e+=t*360;let n=2200+Math.random()*400;e.style.transition=`transform ${n}ms cubic-bezier(0.13, 0.7, 0.25, 1)`,e.style.transform=`rotate(${_e}deg)`;for(let e=0;e<12;e++){let t=n*(1-(1-e/12)**2.2),r=window.setTimeout(()=>{p({freq:700,duration:.02,attack:.001,release:.04,type:`triangle`,gain:.12})},t);x.push(r)}}function je(e){let t=e.querySelector(`.brett-door`),n=t.querySelector(`.door-animal`);Me(t),S(t,`pointerdown`,e=>{e.preventDefault();let r=!t.classList.contains(`open`);r&&(y.doorIndex=(y.doorIndex+1)%v.length,n.innerHTML=v[y.doorIndex],C()),t.classList.toggle(`open`,r),h()})}function Me(e){e.classList.remove(`open`)}function Ne(e){let t=e.querySelector(`.brett-gears`),n=t.querySelector(`.g-big`),r=t.querySelector(`.g-small`),i=!1,a=0,o=0,s=0;function c(e,n){let r=t.getBoundingClientRect();return Math.atan2(n-(r.top+r.height/2),e-(r.left+r.width/2))*180/Math.PI}function l(){n.style.transform=`rotate(${o}deg)`,r.style.transform=`rotate(${-o*1.5}deg)`}l(),S(t,`pointerdown`,e=>{let n=e;n.preventDefault(),i=!0,a=c(n.clientX,n.clientY);try{t.setPointerCapture(n.pointerId)}catch{}}),S(t,`pointermove`,e=>{if(!i)return;let t=e,n=c(t.clientX,t.clientY),r=n-a;r>180&&(r-=360),r<-180&&(r+=360),a=n,o+=r,l();let u=performance.now();Math.abs(r)>6&&u-s>90&&(s=u,p({freq:320,duration:.02,attack:.002,release:.05,type:`square`,gain:.1}))});function u(e){if(!i)return;i=!1;let n=e;try{t.releasePointerCapture(n.pointerId)}catch{}}S(t,`pointerup`,u),S(t,`pointercancel`,u)}function Pe(e){let t=e.querySelector(`.brett-bell`),n=t.querySelector(`.bell-body`);S(t,`pointerdown`,e=>{e.preventDefault(),n.classList.remove(`ring`),n.offsetWidth,n.classList.add(`ring`),p({freq:1046.5,duration:.5,attack:.004,release:.9,type:`sine`,gain:.22}),p({freq:1567.98,duration:.35,attack:.004,release:.7,type:`sine`,gain:.1})})}function Fe(e){let t=e.querySelector(`.brett-curtain`);Ie(t),S(t,`pointerdown`,e=>{e.preventDefault(),y.curtainOpen=!y.curtainOpen,Ie(t),h(),C()})}function Ie(e){e.classList.toggle(`open`,y.curtainOpen)}function Le(e){let t=e.querySelector(`.brett-crank`),n=t.querySelector(`.crank-handle`),r=t.querySelector(`.crank-pop`),i=!1,a=0,o=0,s=0,c=!1,l=0;function u(e,t){let r=n.getBoundingClientRect();return Math.atan2(t-(r.top+r.height/2),e-(r.left+r.width/2))*180/Math.PI}S(t,`pointerdown`,e=>{let n=e;if(n.preventDefault(),c){c=!1,s=0,t.classList.remove(`popped`);return}i=!0,a=u(n.clientX,n.clientY);try{t.setPointerCapture(n.pointerId)}catch{}}),S(t,`pointermove`,e=>{if(!i||c)return;let d=e,ee=u(d.clientX,d.clientY),m=ee-a;m>180&&(m-=360),m<-180&&(m+=360),a=ee,o+=m,s+=Math.abs(m),n.style.transform=`rotate(${o}deg)`;let te=performance.now();te-l>120&&(l=te,p({freq:f[Math.floor(s/45)%f.length],duration:.05,attack:.003,release:.1,type:`triangle`,gain:.16})),s>540&&(c=!0,i=!1,r.innerHTML=v[Math.floor(Math.random()*v.length)],t.classList.add(`popped`),p({freq:880,duration:.18,attack:.005,release:.3,type:`sine`,gain:.3}))});function d(e){if(!i)return;i=!1;let n=e;try{t.releasePointerCapture(n.pointerId)}catch{}}S(t,`pointerup`,d),S(t,`pointercancel`,d)}var Re=[`#e88a9a`,`#7fb99e`,`#f4c86b`,`#7ea3c9`,`#e0a458`,`#c896d8`];function ze(e){let t=e.querySelector(`.brett-kaleido`),n=t.querySelector(`.kaleido-disc`),r=t.querySelector(`.kaleido-petals`);Be(r),n.style.transform=`rotate(${y.kaleidoStep*30}deg)`,S(t,`pointerdown`,e=>{e.preventDefault(),y.kaleidoStep+=1,n.style.transform=`rotate(${y.kaleidoStep*30}deg)`,Be(r),p({freq:f[y.kaleidoStep%f.length],duration:.25,attack:.01,release:.4,type:`sine`,gain:.2}),C()})}function Be(e){let t=y.kaleidoStep,n=``;for(let e=0;e<6;e++){let r=Re[(t+e)%Re.length],i=Re[(t*2+e+3)%Re.length];n+=`<g transform="rotate(${e*60})">
      <ellipse cx="0" cy="-24" rx="9" ry="16" fill="${r}" opacity="0.85"/>
      <circle cx="0" cy="-38" r="5" fill="${i}"/>
    </g>`}e.innerHTML=n}function Ve(e){let t=e.querySelector(`.brett-velcro`);He(t),S(t,`pointerdown`,e=>{e.preventDefault(),y.veloOpen=!y.veloOpen,He(t),ie(y.veloOpen),C()})}function He(e){e.classList.toggle(`open`,y.veloOpen)}function Ue(e){let t=e.querySelector(`.brett-beads`),n=t.querySelector(`.beads-wire`),r=[...t.querySelectorAll(`.bead`)];r.forEach((e,t)=>{e.style.left=`${y.beads[t]*100}%`});let i=new Map;S(n,`pointerdown`,e=>{let t=e,r=t.target.closest(`.bead`);if(!r)return;t.preventDefault();let a=Number(r.dataset.bead);i.set(t.pointerId,a);try{n.setPointerCapture(t.pointerId)}catch{}}),S(n,`pointermove`,e=>{let t=e,a=i.get(t.pointerId);if(a===void 0)return;let o=n.getBoundingClientRect(),s=Math.max(.02,Math.min(.94,(t.clientX-o.left)/o.width)),c=y.beads[a];y.beads[a]=s,r[a].style.left=`${s*100}%`,Math.abs(s-c)>.04&&p({freq:f[a%f.length]*2,duration:.03,attack:.002,release:.07,type:`triangle`,gain:.12})});function a(e){let t=e;if(i.has(t.pointerId)){i.delete(t.pointerId);try{n.releasePointerCapture(t.pointerId)}catch{}C()}}S(n,`pointerup`,a),S(n,`pointercancel`,a)}function We(){ge.forEach(e=>e()),ge=[],b?.stop(),b=null,x.forEach(e=>window.clearTimeout(e)),x=[]}var Ge={id:`brett`,accent:`#e0a458`,tileIcon:fe,mount:ve,unmount:We},Ke=`
<svg viewBox="0 0 120 120" width="100%" height="100%">
  <circle cx="45" cy="45" r="24" fill="#e88a9a"/>
  <circle cx="78" cy="55" r="20" fill="#7fb99e"/>
  <circle cx="55" cy="82" r="18" fill="#f4c86b"/>
</svg>`,qe=[{id:0,color:`#e88a9a`,note:0,xPct:22,yPct:30,radiusPx:58},{id:1,color:`#7fb99e`,note:1,xPct:50,yPct:22,radiusPx:62},{id:2,color:`#f4c86b`,note:2,xPct:78,yPct:32,radiusPx:56},{id:3,color:`#7ea3c9`,note:3,xPct:30,yPct:68,radiusPx:60},{id:4,color:`#e0a458`,note:4,xPct:58,yPct:74,radiusPx:58},{id:5,color:`#c896d8`,note:5,xPct:80,yPct:66,radiusPx:54}],w=null,Je=[],Ye=[],Xe=new Set,Ze=null;function Qe(e,t,n){e.addEventListener(t,n),Ye.push(()=>e.removeEventListener(t,n))}function $e(e,t,n){return Math.max(t,Math.min(n,e))}function et(e){Ye=[],Xe=new Set,e.innerHTML=`
    <div class="kleckse-stage" id="kleckseStage">
      ${qe.map(e=>`
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
  `,w=e.querySelector(`#kleckseStage`),Je=qe.map(t=>({def:t,el:e.querySelector(`.klecks[data-id="${t.id}"]`),xPct:t.xPct,yPct:t.yPct,grabbed:!1,lastX:0,lastY:0,lastT:0})),Je.forEach(e=>{T(e),tt(e)}),Ze=new ResizeObserver(()=>{Je.forEach(e=>{e.grabbed||T(e)})}),Ze.observe(w)}function T(e,t=1,n=1){if(!w)return;let r=w.getBoundingClientRect(),i=e.xPct/100*r.width-e.def.radiusPx,a=e.yPct/100*r.height-e.def.radiusPx;e.el.style.transform=`translate(${i.toFixed(1)}px, ${a.toFixed(1)}px) scale(${t.toFixed(3)}, ${n.toFixed(3)})`}function tt(e){let t=e.el;Qe(t,`pointerdown`,n=>{let r=n;r.preventDefault();try{t.setPointerCapture(r.pointerId)}catch{}e.grabbed=!0,e.lastX=r.clientX,e.lastY=r.clientY,e.lastT=performance.now(),t.classList.add(`grabbed`),p({freq:f[e.def.note%f.length],duration:.35,gain:.35}),rt(e,1.18),it(e)}),Qe(t,`pointermove`,t=>{if(!e.grabbed||!w)return;let n=t,r=w.getBoundingClientRect(),i=performance.now(),a=Math.max(1,i-e.lastT),o=(n.clientX-e.lastX)/a,s=(n.clientY-e.lastY)/a;e.lastX=n.clientX,e.lastY=n.clientY,e.lastT=i,e.xPct=$e((n.clientX-r.left)/r.width*100,6,94),e.yPct=$e((n.clientY-r.top)/r.height*100,8,92),nt(e,o,s),st(e)});function n(n){if(!e.grabbed)return;e.grabbed=!1,t.classList.remove(`grabbed`);let r=n;if(r.pointerId!==void 0)try{t.releasePointerCapture(r.pointerId)}catch{}T(e,1,1)}Qe(t,`pointerup`,n),Qe(t,`pointercancel`,n)}function nt(e,t,n){let r=Math.min(Math.hypot(t,n)*6,.28),i=Math.atan2(n,t);T(e,1+r*Math.abs(Math.cos(i)),1-r*Math.abs(Math.cos(i))*.6+r*Math.abs(Math.sin(i))*.1)}function rt(e,t){T(e,t,t),window.setTimeout(()=>{e.el.classList.contains(`grabbed`)||T(e,1,1)},160)}function it(e){e.el.classList.remove(`singt`),e.el.offsetWidth,e.el.classList.add(`singt`),window.setTimeout(()=>e.el.classList.remove(`singt`),300)}function at(e){e.el.classList.remove(`funkt`),e.el.offsetWidth,e.el.classList.add(`funkt`),window.setTimeout(()=>e.el.classList.remove(`funkt`),420)}function ot(e,t){return e<t?`${e}-${t}`:`${t}-${e}`}function st(e){if(!w)return;let t=w.getBoundingClientRect(),n=e.xPct/100*t.width,r=e.yPct/100*t.height;for(let i of Je){if(i.def.id===e.def.id)continue;let a=i.xPct/100*t.width,o=i.yPct/100*t.height,s=Math.hypot(n-a,r-o),c=e.def.radiusPx*.75+i.def.radiusPx*.75,l=ot(e.def.id,i.def.id);s<c?Xe.has(l)||(Xe.add(l),p({freq:f[e.def.note%f.length],duration:.25,gain:.22}),p({freq:f[i.def.note%f.length],duration:.25,gain:.22}),rt(i,1.1),at(e),at(i)):Xe.delete(l)}}function ct(){Ye.forEach(e=>e()),Ye=[],Ze?.disconnect(),Ze=null,Je=[],w=null,Xe=new Set}var lt={id:`kleckse`,accent:`#e88a9a`,tileIcon:Ke,mount:et,unmount:ct},ut=`
<svg viewBox="0 0 120 120" width="100%" height="100%">
  <path d="M30 90 L80 30 L95 45 L45 95 Z" fill="#fdf6ea" stroke="#7ea3c9" stroke-width="4" stroke-linejoin="round"/>
  <circle cx="34" cy="92" r="10" fill="#7ea3c9"/>
  <circle cx="70" cy="40" r="8" fill="#e88a9a"/>
</svg>`,dt=[`#e88a9a`,`#7fb99e`,`#f4c86b`,`#7ea3c9`,`#e0a458`,`#6b5d4a`],ft=`malen`,pt=1,E=null,D=null,O=null,mt=dt[0],ht=!1,gt=0,_t=0,vt=[],k=null,yt=null;function A(e,t,n){e.addEventListener(t,n),vt.push(()=>e.removeEventListener(t,n))}function bt(e){vt=[],ht=!1,mt=dt[0],e.innerHTML=`
    <div class="malen-stage" id="malenStage">
      <canvas class="malen-canvas" id="malenCanvas"></canvas>
      <div class="malen-palette" id="malenPalette">
        ${dt.map((e,t)=>`<button class="malen-swatch${t===0?` selected`:``}" data-color="${e}" style="--swatch-color:${e}" aria-hidden="true"></button>`).join(``)}
      </div>
      <button class="malen-new-sheet" id="malenNewSheet" aria-hidden="true">
        <svg viewBox="0 0 48 48" width="30" height="30">
          <path d="M10 6 h20 l8 8 v28 h-28 z" fill="#fffaf2" stroke="#8a7255" stroke-width="2.5" stroke-linejoin="round"/>
          <path d="M30 6 v8 h8" fill="none" stroke="#8a7255" stroke-width="2.5" stroke-linejoin="round"/>
        </svg>
      </button>
    </div>
  `,O=e.querySelector(`#malenStage`),E=e.querySelector(`#malenCanvas`),D=E.getContext(`2d`),xt(),St(),A(E,`pointerdown`,Tt),A(E,`pointermove`,Et),A(E,`pointerup`,Dt),A(E,`pointercancel`,Dt);let t=e.querySelectorAll(`.malen-swatch`);t.forEach(e=>{A(e,`pointerdown`,n=>{n.preventDefault(),mt=e.dataset.color??dt[0],t.forEach(e=>e.classList.remove(`selected`)),e.classList.add(`selected`),m(500)})}),A(e.querySelector(`#malenNewSheet`),`pointerdown`,e=>{e.preventDefault(),Ot()});let n=O.clientWidth,r=O.clientHeight,i=()=>{if(!O)return;let e=O.clientWidth,t=O.clientHeight;(e!==n||t!==r)&&(n=e,r=t,k!==null&&window.clearTimeout(k),k=window.setTimeout(()=>{xt(),St()},200))};yt=new ResizeObserver(i),yt.observe(O),A(window,`resize`,i),A(window,`orientationchange`,i)}function xt(){if(!E||!O)return;let e=Math.min(window.devicePixelRatio||1,2),t={width:O.clientWidth,height:O.clientHeight};E.width=Math.round(t.width*e),E.height=Math.round(t.height*e),E.style.width=`${t.width}px`,E.style.height=`${t.height}px`,D=E.getContext(`2d`),D&&(D.scale(e,e),D.lineCap=`round`,D.lineJoin=`round`,D.lineWidth=22)}function St(){let e=g(ft,pt,{dataUrl:null});if(!e.dataUrl||!E||!D)return;let t=new Image;t.onload=()=>{if(!D||!E)return;let e=Math.min(window.devicePixelRatio||1,2);D.drawImage(t,0,0,E.width/e,E.height/e)},t.src=e.dataUrl}function Ct(){if(E)try{_(ft,pt,{dataUrl:E.toDataURL(`image/png`)})}catch{}}function wt(e){let t=E,n=t.getBoundingClientRect(),r=n.width===0?1:t.clientWidth/n.width,i=n.height===0?1:t.clientHeight/n.height;return{x:(e.clientX-n.left)*r,y:(e.clientY-n.top)*i}}function Tt(e){let t=e;if(t.preventDefault(),!E||!D)return;try{E.setPointerCapture(t.pointerId)}catch{}ht=!0;let{x:n,y:r}=wt(t);gt=n,_t=r,D.strokeStyle=mt,D.fillStyle=mt,D.beginPath(),D.arc(n,r,D.lineWidth/2,0,Math.PI*2),D.fill()}function Et(e){if(!ht||!D)return;let{x:t,y:n}=wt(e);D.beginPath(),D.moveTo(gt,_t),D.lineTo(t,n),D.stroke(),gt=t,_t=n}function Dt(e){if(!ht)return;ht=!1;let t=e;if(E&&t.pointerId!==void 0)try{E.releasePointerCapture(t.pointerId)}catch{}Ct()}function Ot(){if(!E||!D||!O)return;let e=E.toDataURL(`image/png`),t=document.createElement(`img`);t.src=e,t.className=`malen-crumple-overlay`,t.style.width=E.style.width,t.style.height=E.style.height,O.appendChild(t);let n=Math.min(window.devicePixelRatio||1,2);D.clearRect(0,0,E.width/n,E.height/n),_(ft,pt,{dataUrl:null}),m(300),t.offsetWidth,t.classList.add(`crumpling`),window.setTimeout(()=>{t.remove()},550)}function kt(){vt.forEach(e=>e()),vt=[],yt?.disconnect(),yt=null,k!==null&&(window.clearTimeout(k),k=null),E=null,D=null,O=null}var At={id:`malen`,accent:`#7ea3c9`,tileIcon:ut,mount:bt,unmount:kt},jt=`
<svg viewBox="0 0 120 120" width="100%" height="100%">
  <rect x="14" y="50" width="92" height="56" rx="12" fill="#e0a458" stroke="#a9835e" stroke-width="3"/>
  <ellipse cx="45" cy="58" rx="14" ry="8" fill="#6b5544"/>
  <rect x="68" y="52" width="24" height="14" rx="4" fill="#6b5544"/>
  <circle cx="30" cy="30" r="14" fill="#e88a9a"/>
  <rect x="60" y="18" width="26" height="26" rx="6" fill="#7fb99e"/>
</svg>`,j=[{id:`kreis`,color:`#e88a9a`,note:0,restX:14,restY:80,path:`<circle cx="50" cy="50" r="42"/>`,svg:`<svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="42" fill="#e88a9a"/><circle cx="38" cy="46" r="5" fill="#4a4032"/><circle cx="62" cy="46" r="5" fill="#4a4032"/><path d="M38 60 Q50 68 62 60" stroke="#4a4032" stroke-width="3" fill="none" stroke-linecap="round"/></svg>`},{id:`quadrat`,color:`#7fb99e`,note:2,restX:33,restY:88,path:`<rect x="8" y="8" width="84" height="84" rx="16"/>`,svg:`<svg viewBox="0 0 100 100"><rect x="8" y="8" width="84" height="84" rx="16" fill="#7fb99e"/><circle cx="38" cy="46" r="5" fill="#4a4032"/><circle cx="62" cy="46" r="5" fill="#4a4032"/><path d="M38 60 Q50 68 62 60" stroke="#4a4032" stroke-width="3" fill="none" stroke-linecap="round"/></svg>`},{id:`dreieck`,color:`#f4c86b`,note:4,restX:52,restY:80,path:`<path d="M50 10 L92 88 L8 88 Z" stroke-linejoin="round"/>`,svg:`<svg viewBox="0 0 100 100"><path d="M50 10 L92 88 L8 88 Z" fill="#f4c86b" stroke-linejoin="round"/><circle cx="40" cy="66" r="4.5" fill="#4a4032"/><circle cx="60" cy="66" r="4.5" fill="#4a4032"/><path d="M40 76 Q50 82 60 76" stroke="#4a4032" stroke-width="3" fill="none" stroke-linecap="round"/></svg>`},{id:`stern`,color:`#7ea3c9`,note:5,restX:71,restY:88,path:`<path d="M50 6 L62 37 L96 37 L68 57 L79 90 L50 70 L21 90 L32 57 L4 37 L38 37 Z"/>`,svg:`<svg viewBox="0 0 100 100"><path d="M50 6 L62 37 L96 37 L68 57 L79 90 L50 70 L21 90 L32 57 L4 37 L38 37 Z" fill="#7ea3c9"/><circle cx="42" cy="48" r="4" fill="#4a4032"/><circle cx="58" cy="48" r="4" fill="#4a4032"/><path d="M42 58 Q50 63 58 58" stroke="#4a4032" stroke-width="2.5" fill="none" stroke-linecap="round"/></svg>`},{id:`herz`,color:`#c896d8`,note:7,restX:88,restY:78,path:`<path d="M50 92 C20 67 4 46 4 28 C4 12 17 2 32 2 C42 2 48 9 50 16 C52 9 58 2 68 2 C83 2 96 12 96 28 C96 46 80 67 50 92 Z"/>`,svg:`<svg viewBox="0 0 100 100"><path d="M50 92 C20 67 4 46 4 28 C4 12 17 2 32 2 C42 2 48 9 50 16 C52 9 58 2 68 2 C83 2 96 12 96 28 C96 46 80 67 50 92 Z" fill="#c896d8"/><circle cx="40" cy="34" r="4.5" fill="#4a4032"/><circle cx="60" cy="34" r="4.5" fill="#4a4032"/><path d="M40 44 Q50 50 60 44" stroke="#4a4032" stroke-width="3" fill="none" stroke-linecap="round"/></svg>`}],Mt=`sortierer`,Nt=1;function Pt(){return j.map(e=>({id:e.id,xPct:e.restX,yPct:e.restY,placed:!1}))}var Ft={shapes:Pt()},M=null,It=[],Lt=null,N=new Map;function Rt(e,t,n){e.addEventListener(t,n),It.push(()=>e.removeEventListener(t,n))}function P(e){return Ft.shapes.find(t=>t.id===e)??{id:e,xPct:50,yPct:80,placed:!1}}function zt(){_(Mt,Nt,Ft)}function Bt(e){It=[],N=new Map;let t=g(Mt,Nt,{shapes:Pt()});Ft={shapes:j.map(e=>t.shapes.find(t=>t.id===e.id)??{id:e.id,xPct:e.restX,yPct:e.restY,placed:!1})},e.innerHTML=`
    <div class="sorter-stage">
      <div class="sorter-box">
        ${j.map(e=>`
          <div class="sorter-hole" data-hole="${e.id}">
            <svg class="hole-cut" viewBox="0 0 100 100">${e.path}</svg>
            <div class="hole-fuellung" data-fill="${e.id}" style="--fill-color:${e.color}">${e.svg}</div>
          </div>
        `).join(``)}
      </div>
      <div class="sorter-boden" id="sorterBoden">
        ${j.map(e=>`
          <div class="sorter-form" data-shape="${e.id}">
            <div class="sorter-form-fx">${e.svg}</div>
          </div>
        `).join(``)}
      </div>
    </div>
  `,M=e.querySelector(`.sorter-stage`),j.forEach(t=>{let n=e.querySelector(`.sorter-form[data-shape="${t.id}"]`),r=e.querySelector(`.sorter-hole[data-hole="${t.id}"]`),i=e.querySelector(`.hole-fuellung[data-fill="${t.id}"]`);N.set(t.id,n),Ht(t.id,i),F(t.id),Ut(t,n),Wt(t,r,n,i)}),Lt=new ResizeObserver(()=>{j.forEach(e=>{(!Vt||Vt!==e.id)&&F(e.id)})}),Lt.observe(M)}var Vt=null;function F(e,t=0,n=0){let r=N.get(e);if(!r||!M)return;let i=M.getBoundingClientRect(),a=P(e),o=r.offsetWidth/2,s=r.offsetHeight/2,c=a.xPct/100*i.width-o+t,l=a.yPct/100*i.height-s+n;r.style.transform=`translate(${c.toFixed(1)}px, ${l.toFixed(1)}px)`}function Ht(e,t){let n=P(e);N.get(e)?.classList.toggle(`versteckt`,n.placed),t.classList.toggle(`gefuellt`,n.placed)}function Ut(e,t){let n=!1,r=0,i=0,a=0;Rt(t,`pointerdown`,o=>{let s=o;if(s.preventDefault(),!P(e.id).placed){n=!0,Vt=e.id,r=0,i=s.clientX,a=s.clientY,t.classList.add(`greift`);try{t.setPointerCapture(s.pointerId)}catch{}}}),Rt(t,`pointermove`,t=>{if(!n||!M)return;let o=t,s=o.clientX-i,c=o.clientY-a;r=Math.max(r,Math.hypot(s,c)),F(e.id,s,c)});let o=i=>{if(!n)return;n=!1,Vt=null;let a=i;t.classList.remove(`greift`);try{t.releasePointerCapture(a.pointerId)}catch{}if(r<6){F(e.id),qt(t),m(420),zt();return}if(M){let t=M.getBoundingClientRect(),n=P(e.id);n.xPct=Jt((a.clientX-t.left)/t.width*100,3,97),n.yPct=Jt((a.clientY-t.top)/t.height*100,3,97)}F(e.id);let o=M?.querySelector(`.sorter-hole[data-hole="${e.id}"]`);if(o&&M){let t=o.getBoundingClientRect(),n=t.left+t.width/2,r=t.top+t.height/2;if(Math.hypot(a.clientX-n,a.clientY-r)<60){let t=M.querySelector(`.hole-fuellung[data-fill="${e.id}"]`),n=P(e.id);n.placed=!0,Ht(e.id,t),Gt(t,e.note),zt();return}}zt()};Rt(t,`pointerup`,o),Rt(t,`pointercancel`,o)}function Wt(e,t,n,r){Rt(t,`pointerdown`,t=>{let i=P(e.id);i.placed&&(t.preventDefault(),i.placed=!1,i.xPct=e.restX,i.yPct=e.restY,Ht(e.id,r),F(e.id),Kt(n),p({freq:f[e.note%f.length]*1.5,duration:.18,attack:.005,release:.25,type:`triangle`,gain:.24}),zt())})}function Gt(e,t){e.classList.remove(`plumpst`),e.offsetWidth,e.classList.add(`plumpst`),p({freq:f[t%f.length],duration:.22,attack:.004,release:.3,type:`sine`,gain:.32}),window.setTimeout(()=>e.classList.remove(`plumpst`),400)}function Kt(e){let t=e.querySelector(`.sorter-form-fx`);t&&(t.classList.remove(`huepft`),t.offsetWidth,t.classList.add(`huepft`),window.setTimeout(()=>t.classList.remove(`huepft`),500))}function qt(e){let t=e.querySelector(`.sorter-form-fx`);t&&(t.classList.remove(`wackelt`),t.offsetWidth,t.classList.add(`wackelt`),window.setTimeout(()=>t.classList.remove(`wackelt`),400))}function Jt(e,t,n){return Math.max(t,Math.min(n,e))}function Yt(){It.forEach(e=>e()),It=[],Lt?.disconnect(),Lt=null,N=new Map,M=null,Vt=null,Ft={shapes:Pt()}}var Xt={id:`sortierer`,accent:`#e0a458`,tileIcon:jt,mount:Bt,unmount:Yt},Zt=`
<svg viewBox="0 0 120 120" width="100%" height="100%">
  <circle cx="48" cy="46" r="26" fill="none" stroke="#7ec8d8" stroke-width="5"/>
  <circle cx="40" cy="38" r="7" fill="#bfe6ee"/>
  <circle cx="84" cy="72" r="17" fill="none" stroke="#a8d8e0" stroke-width="4"/>
  <circle cx="79" cy="67" r="5" fill="#d6f0f5"/>
  <circle cx="42" cy="90" r="11" fill="none" stroke="#c8b6e0" stroke-width="4"/>
</svg>`,Qt=[`rgba(126, 200, 216, 0.55)`,`rgba(200, 182, 224, 0.55)`,`rgba(244, 200, 107, 0.45)`,`rgba(232, 138, 154, 0.45)`,`rgba(127, 185, 158, 0.5)`],$t=14,en=900,I=null,tn=[],L=null,nn=[];function rn(e,t,n){e.addEventListener(t,n),tn.push(()=>e.removeEventListener(t,n))}function an(e){tn=[],nn=[],e.innerHTML=`
    <div class="blasen-stage" id="blasenStage">
      <div class="blasen-layer" id="blasenLayer"></div>
      <div class="blasen-wand" id="blasenWand">
        <div class="wand-ring"></div>
        <div class="wand-stick"></div>
      </div>
    </div>
  `,I=e.querySelector(`#blasenLayer`);let t=e.querySelector(`#blasenWand`);for(let e=0;e<6;e++)on(.3+Math.random()*.5);L=window.setInterval(()=>on(),en),tn.push(()=>{L!==null&&window.clearInterval(L),L=null}),rn(I,`pointerdown`,e=>{let t=e,n=t.target.closest(`.blase`);n&&(t.preventDefault(),sn(n))}),rn(t,`pointerdown`,e=>{e.preventDefault(),t.classList.remove(`puff`),t.offsetWidth,t.classList.add(`puff`);for(let e=0;e<5;e++)window.setTimeout(()=>on(0,!0),e*110);p({freq:220,duration:.28,attack:.06,release:.35,type:`sine`,gain:.12})})}function on(e=0,t=!1){if(!I||I.childElementCount>=$t)return;let n=42+Math.random()*58,r=Qt[Math.floor(Math.random()*Qt.length)],i=t?14+Math.random()*16:6+Math.random()*88,a=(Math.random()*2-1)*40,o=9e3+Math.random()*5e3,s=document.createElement(`div`);s.className=`blase`,s.style.width=`${n}px`,s.style.height=`${n}px`,s.style.left=`${i}%`,s.style.setProperty(`--tint`,r),s.style.setProperty(`--drift`,`${a}px`),s.style.animationDuration=`${o}ms`,s.style.animationDelay=`${-e*o}ms`,s.innerHTML=`<span class="blase-glanz"></span>`,s.addEventListener(`animationend`,()=>s.remove()),I.appendChild(s)}function sn(e){if(e.classList.contains(`platzt`))return;e.classList.add(`platzt`);let t=f[Math.floor(Math.random()*f.length)];p({freq:t*2,duration:.06,attack:.002,release:.16,type:`sine`,gain:.22});let n=window.setTimeout(()=>e.remove(),340);nn.push(n)}function cn(){tn.forEach(e=>e()),tn=[],L!==null&&(window.clearInterval(L),L=null),nn.forEach(e=>window.clearTimeout(e)),nn=[],I=null}var ln={id:`blasen`,accent:`#7ec8d8`,tileIcon:Zt,mount:an,unmount:cn},un=`
<svg viewBox="0 0 120 120" width="100%" height="100%">
  <rect x="22" y="30" width="76" height="58" rx="10" fill="#cbb98a"/>
  <rect x="30" y="38" width="60" height="42" rx="6" fill="#bfe6ee"/>
  <path d="M34 74 L54 46" stroke="#fffaf2" stroke-width="9" stroke-linecap="round"/>
  <path d="M52 76 L70 52" stroke="#fffaf2" stroke-width="7" stroke-linecap="round"/>
  <circle cx="84" cy="92" r="13" fill="#7ec8d8"/>
</svg>`,dn=[{clean:`<svg viewBox="0 0 200 200">
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
    </svg>`,dirt:`#7d6b52`,fleck:`#5f5040`}],fn=34,pn=.82,R=null,z=null,B=null,mn=0,hn=!1,gn=[],V=null,_n=null,vn=[],H=new Map;function U(e,t,n){e.addEventListener(t,n),gn.push(()=>e.removeEventListener(t,n))}function yn(e){gn=[],H.clear(),vn=[],mn=0,hn=!1,e.innerHTML=`
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
  `,B=e.querySelector(`#putzenStage`),R=e.querySelector(`#putzenCanvas`),bn(e,0),U(R,`pointerdown`,wn),U(R,`pointermove`,Tn),U(R,`pointerup`,En),U(R,`pointercancel`,En),U(e.querySelector(`#putzenNext`),`pointerdown`,t=>{t.preventDefault(),bn(e,mn+1),h()});let t=B.clientWidth,n=B.clientHeight,r=()=>{if(!B)return;let e=B.clientWidth,r=B.clientHeight;(e!==t||r!==n)&&(t=e,n=r,V!==null&&window.clearTimeout(V),V=window.setTimeout(()=>xn(),220))};_n=new ResizeObserver(r),_n.observe(B),U(window,`resize`,r),U(window,`orientationchange`,r)}function bn(e,t){mn=(t%dn.length+dn.length)%dn.length,hn=!1,B?.classList.remove(`sauber`);let n=e.querySelector(`#putzenMotiv`);n.innerHTML=dn[mn].clean,xn()}function xn(){if(!R||!B)return;let e=Math.min(window.devicePixelRatio||1,2),t=B.clientWidth,n=B.clientHeight;R.width=Math.round(t*e),R.height=Math.round(n*e),R.style.width=`${t}px`,R.style.height=`${n}px`,z=R.getContext(`2d`,{willReadFrequently:!0}),z&&(z.scale(e,e),Sn(t,n))}function Sn(e,t){if(!z)return;let n=dn[mn];z.globalCompositeOperation=`source-over`,z.clearRect(0,0,e,t),z.fillStyle=n.dirt,z.fillRect(0,0,e,t),z.fillStyle=n.fleck;for(let n=0;n<140;n++){let n=Math.random()*e,r=Math.random()*t,i=6+Math.random()*26;z.globalAlpha=.18+Math.random()*.3,z.beginPath(),z.ellipse(n,r,i,i*(.6+Math.random()*.7),Math.random()*Math.PI,0,Math.PI*2),z.fill()}z.globalAlpha=1}function Cn(e){let t=R,n=t.getBoundingClientRect(),r=n.width===0?1:t.clientWidth/n.width,i=n.height===0?1:t.clientHeight/n.height;return{x:(e.clientX-n.left)*r,y:(e.clientY-n.top)*i}}function wn(e){let t=e;if(t.preventDefault(),!R||!z)return;try{R.setPointerCapture(t.pointerId)}catch{}let n=Cn(t);H.set(t.pointerId,n),Dn(n.x,n.y),An()}function Tn(e){let t=e,n=H.get(t.pointerId);if(!n||!z)return;let r=Cn(t);On(n.x,n.y,r.x,r.y),H.set(t.pointerId,r),An()}function En(e){let t=e;if(H.has(t.pointerId)){if(H.delete(t.pointerId),R)try{R.releasePointerCapture(t.pointerId)}catch{}Mn()}}function Dn(e,t){z&&(z.globalCompositeOperation=`destination-out`,z.beginPath(),z.arc(e,t,fn,0,Math.PI*2),z.fill())}function On(e,t,n,r){z&&(z.globalCompositeOperation=`destination-out`,z.lineCap=`round`,z.lineJoin=`round`,z.lineWidth=68,z.beginPath(),z.moveTo(e,t),z.lineTo(n,r),z.stroke())}var kn=0;function An(){let e=performance.now();e-kn<130||(kn=e,p({freq:180+Math.random()*90,duration:.05,attack:.01,release:.1,type:`triangle`,gain:.07}))}function jn(){if(!R||!z)return 0;let e=0,t=0,n=R.width/24,r=R.height/24;for(let i=0;i<24;i++)for(let a=0;a<24;a++){let o=Math.min(R.width-1,Math.floor(i*n+n/2)),s=Math.min(R.height-1,Math.floor(a*r+r/2));z.getImageData(o,s,1,1).data[3]<40&&e++,t++}return t===0?0:e/t}function Mn(){if(!hn&&!(jn()<pn)){if(hn=!0,z&&R){let e=Math.min(window.devicePixelRatio||1,2);z.globalCompositeOperation=`destination-out`,z.fillStyle=`#000`,z.fillRect(0,0,R.width/e,R.height/e)}B?.classList.add(`sauber`),[0,130,260].forEach((e,t)=>{let n=window.setTimeout(()=>{p({freq:f[t+3],duration:.3,attack:.01,release:.5,gain:.24})},e);vn.push(n)})}}function Nn(){gn.forEach(e=>e()),gn=[],_n?.disconnect(),_n=null,V!==null&&(window.clearTimeout(V),V=null),vn.forEach(e=>window.clearTimeout(e)),vn=[],H.clear(),R=null,z=null,B=null}var Pn={id:`putzen`,accent:`#7ec8d8`,tileIcon:un,mount:yn,unmount:Nn},Fn=`
<svg viewBox="0 0 120 120" width="100%" height="100%">
  <rect x="16" y="22" width="88" height="66" rx="10" fill="#dff0e4"/>
  <path d="M16 72 Q40 54 62 72 Q82 56 104 72 L104 88 H16 Z" fill="#9ec99f"/>
  <circle cx="86" cy="40" r="12" fill="#f7d570"/>
  <ellipse cx="46" cy="60" rx="13" ry="11" fill="#e88a9a"/>
  <circle cx="42" cy="57" r="2.5" fill="#4a4032"/>
  <circle cx="50" cy="57" r="2.5" fill="#4a4032"/>
  <path d="M74 92 l7 -13 l7 13 z" fill="#7fb99e"/>
</svg>`,In=[{id:`hase`,size:106,note:0,svg:`<svg viewBox="0 0 100 100"><ellipse cx="50" cy="64" rx="26" ry="28" fill="#f3e7db"/><ellipse cx="38" cy="24" rx="8" ry="20" fill="#f3e7db"/><ellipse cx="62" cy="24" rx="8" ry="20" fill="#f3e7db"/><ellipse cx="38" cy="26" rx="4" ry="13" fill="#f2b8c6"/><ellipse cx="62" cy="26" rx="4" ry="13" fill="#f2b8c6"/><circle cx="41" cy="60" r="4" fill="#4a4032"/><circle cx="59" cy="60" r="4" fill="#4a4032"/><ellipse cx="50" cy="70" rx="5" ry="3.5" fill="#e88a9a"/></svg>`},{id:`baum`,size:125,note:1,svg:`<svg viewBox="0 0 100 100"><rect x="43" y="58" width="14" height="36" rx="5" fill="#a9835e"/><circle cx="50" cy="40" r="28" fill="#7fb99e"/><circle cx="30" cy="50" r="18" fill="#8fc4a8"/><circle cx="70" cy="50" r="18" fill="#8fc4a8"/></svg>`},{id:`blume`,size:94,note:2,svg:`<svg viewBox="0 0 100 100"><rect x="46" y="52" width="8" height="42" rx="4" fill="#7fb99e"/><ellipse cx="30" cy="62" rx="14" ry="7" fill="#8fc4a8"/><g><ellipse cx="50" cy="26" rx="11" ry="17" fill="#e88a9a"/><ellipse cx="50" cy="26" rx="11" ry="17" fill="#e88a9a" transform="rotate(72 50 40)"/><ellipse cx="50" cy="26" rx="11" ry="17" fill="#e88a9a" transform="rotate(144 50 40)"/><ellipse cx="50" cy="26" rx="11" ry="17" fill="#e88a9a" transform="rotate(216 50 40)"/><ellipse cx="50" cy="26" rx="11" ry="17" fill="#e88a9a" transform="rotate(288 50 40)"/></g><circle cx="50" cy="40" r="10" fill="#f4c86b"/></svg>`},{id:`sonne`,size:101,note:3,svg:`<svg viewBox="0 0 100 100"><g stroke="#f4c86b" stroke-width="7" stroke-linecap="round"><line x1="50" y1="8" x2="50" y2="20"/><line x1="50" y1="80" x2="50" y2="92"/><line x1="8" y1="50" x2="20" y2="50"/><line x1="80" y1="50" x2="92" y2="50"/><line x1="20" y1="20" x2="28" y2="28"/><line x1="72" y1="72" x2="80" y2="80"/><line x1="20" y1="80" x2="28" y2="72"/><line x1="72" y1="28" x2="80" y2="20"/></g><circle cx="50" cy="50" r="24" fill="#f7d570"/><circle cx="42" cy="46" r="3" fill="#c99a3c"/><circle cx="58" cy="46" r="3" fill="#c99a3c"/><path d="M43 56 Q50 62 57 56" stroke="#c99a3c" stroke-width="3" fill="none" stroke-linecap="round"/></svg>`},{id:`wolke`,size:120,note:4,svg:`<svg viewBox="0 0 100 100"><g fill="#fffaf2" stroke="#bcd6e0" stroke-width="3"><ellipse cx="38" cy="58" rx="22" ry="18"/><ellipse cx="62" cy="58" rx="20" ry="16"/><ellipse cx="50" cy="46" rx="20" ry="18"/></g></svg>`},{id:`vogel`,size:91,note:5,svg:`<svg viewBox="0 0 100 100"><ellipse cx="52" cy="56" rx="24" ry="19" fill="#7ea3c9"/><circle cx="34" cy="44" r="14" fill="#8fb3d4"/><path d="M22 44 l-12 5 l12 5 z" fill="#f4a56b"/><circle cx="31" cy="41" r="3" fill="#4a4032"/><path d="M56 52 q14 -8 22 2 q-12 8 -22 -2z" fill="#6b93bd"/><path d="M70 66 l14 8" stroke="#f4a56b" stroke-width="5" stroke-linecap="round"/></svg>`},{id:`pilz`,size:88,note:6,svg:`<svg viewBox="0 0 100 100"><rect x="40" y="52" width="20" height="38" rx="8" fill="#f3e7db"/><path d="M14 54 a36 30 0 0 1 72 0 z" fill="#e88a9a"/><circle cx="36" cy="40" r="7" fill="#fffaf2"/><circle cx="62" cy="34" r="5" fill="#fffaf2"/><circle cx="54" cy="48" r="4" fill="#fffaf2"/></svg>`},{id:`stern`,size:81,note:7,svg:`<svg viewBox="0 0 100 100"><path d="M50 8 L61 38 L93 38 L67 57 L77 88 L50 69 L23 88 L33 57 L7 38 L39 38 Z" fill="#f4c86b"/></svg>`}],Ln=`sticker`,Rn=1,zn=60,W=[],Bn=null,G=null,K=null,Vn=[];function Hn(e,t,n){e.addEventListener(t,n),Vn.push(()=>e.removeEventListener(t,n))}function Un(e){return In.find(t=>t.id===e)??In[0]}function Wn(){_(Ln,Rn,{placed:W})}function Gn(e){Vn=[],W=g(Ln,Rn,{placed:[]}).placed,e.innerHTML=`
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
        ${In.map(e=>`<div class="tray-item" data-art="${e.id}" style="width:${e.size*.62}px;height:${e.size*.62}px">${e.svg}</div>`).join(``)}
      </div>
    </div>
  `,Bn=e.querySelector(`#stickerStage`),G=e.querySelector(`#stickerSzene`),K=e.querySelector(`#stickerTray`),Kn(),Jn(e),K.querySelectorAll(`.tray-item`).forEach(e=>{Hn(e,`pointerdown`,t=>Qn(t,e))})}function Kn(){let e=document.getElementById(`stickerPlatziert`);e&&(e.innerHTML=``,W.forEach((t,n)=>{let r=Un(t.art),i=document.createElement(`div`);i.className=`sticker`,i.dataset.index=String(n),i.style.width=`${r.size}px`,i.style.height=`${r.size}px`,i.style.left=`${t.xPct}%`,i.style.top=`${t.yPct}%`,i.style.setProperty(`--rot`,`${t.rot}deg`),i.innerHTML=r.svg,e.appendChild(i),qn(i,n)}))}function qn(e,t){let n=!1,r=0,i=0,a=0;e.addEventListener(`pointerdown`,t=>{t.preventDefault(),t.stopPropagation(),n=!0,r=0,i=t.clientX,a=t.clientY,e.classList.add(`greift`);try{e.setPointerCapture(t.pointerId)}catch{}}),e.addEventListener(`pointermove`,o=>{if(!n||!G)return;r=Math.max(r,Math.hypot(o.clientX-i,o.clientY-a));let s=G.getBoundingClientRect(),c=W[t];c&&(c.xPct=Zn((o.clientX-s.left)/s.width*100,2,98),c.yPct=Zn((o.clientY-s.top)/s.height*100,2,98),e.style.left=`${c.xPct}%`,e.style.top=`${c.yPct}%`)});let o=i=>{if(n){n=!1,e.classList.remove(`greift`);try{e.releasePointerCapture(i.pointerId)}catch{}if(K&&Xn(i.clientX,i.clientY)){W.splice(t,1),Wn(),Kn(),m(300);return}r<10&&(e.classList.remove(`wackelt`),e.offsetWidth,e.classList.add(`wackelt`),p({freq:f[Un(W[t]?.art??In[0].id).note%f.length],duration:.3,gain:.28})),Wn()}};e.addEventListener(`pointerup`,o),e.addEventListener(`pointercancel`,o)}function Jn(e){Hn(e.querySelector(`#stickerClear`),`pointerdown`,e=>{e.preventDefault(),W.length!==0&&Yn()})}function Yn(){let e=document.getElementById(`stickerPlatziert`);if(!e)return;let t=[...e.querySelectorAll(`.sticker`)];t.forEach((e,t)=>{e.style.transitionDelay=`${Math.min(t*25,500)}ms`,e.offsetWidth,e.classList.add(`wegfegen`)}),h(),window.setTimeout(()=>{W=[],Wn(),Kn()},500+Math.min(t.length*25,500))}function Xn(e,t){if(!K)return!1;let n=K.getBoundingClientRect();return e>=n.left&&e<=n.right&&t>=n.top&&t<=n.bottom}function Zn(e,t,n){return Math.max(t,Math.min(n,e))}function Qn(e,t){if(e.preventDefault(),!Bn)return;let n=Un(t.dataset.art??``);try{t.setPointerCapture(e.pointerId)}catch{}let r=document.createElement(`div`);r.className=`sticker-ghost`,r.style.width=`${n.size}px`,r.style.height=`${n.size}px`,r.innerHTML=n.svg,Bn.appendChild(r);let i=(e,t)=>{let n=Bn.getBoundingClientRect();r.style.left=`${e-n.left}px`,r.style.top=`${t-n.top}px`};i(e.clientX,e.clientY),m(560);let a=!1;function o(e){let t=e;i(t.clientX,t.clientY)}function s(e){if(a)return;a=!0;let i=e;try{t.releasePointerCapture(i.pointerId)}catch{}t.removeEventListener(`pointermove`,o),t.removeEventListener(`pointerup`,s),t.removeEventListener(`pointercancel`,s),r.remove(),$n(n,i.clientX,i.clientY)}t.addEventListener(`pointermove`,o),t.addEventListener(`pointerup`,s),t.addEventListener(`pointercancel`,s)}function $n(e,t,n){if(!G||Xn(t,n))return;let r=G.getBoundingClientRect();n>r.bottom||n<r.top||(W.length>=zn&&W.shift(),W.push({art:e.id,xPct:Zn((t-r.left)/r.width*100,2,98),yPct:Zn((n-r.top)/r.height*100,2,98),rot:Math.round((Math.random()*2-1)*9)}),Wn(),Kn(),p({freq:f[e.note%f.length],duration:.28,gain:.3}))}function er(){Vn.forEach(e=>e()),Vn=[],W=[],Bn=null,G=null,K=null}var tr={id:`sticker`,accent:`#9ec99f`,tileIcon:Fn,mount:Gn,unmount:er},nr=`
<svg viewBox="0 0 120 120" width="100%" height="100%">
  <circle cx="94" cy="26" r="14" fill="#f7d570"/>
  <path d="M20 100 L20 60 L46 38 L72 60 L72 100 Z" fill="#f3e7db" stroke="#c9a37e" stroke-width="3"/>
  <path d="M14 62 L46 34 L78 62 Z" fill="#e88a9a"/>
  <rect x="38" y="76" width="16" height="24" rx="2" fill="#a9835e"/>
  <circle cx="30" cy="10" r="8" fill="#9ec99f" opacity="0.7"/>
</svg>`,rr=`wimmelbild`,ir=1,ar={tuerOffen:!1,vorhangOffen:!1,flaggeOben:!1},q={...ar},or=[],sr=[],J=new Set;function cr(e,t,n){e.addEventListener(t,n),or.push(()=>e.removeEventListener(t,n))}function lr(){_(rr,ir,q)}function ur(e,t){let n=window.setTimeout(e,t);sr.push(n)}function Y(e,t,n){let r=e.querySelector(t),i=t;cr(r,`pointerdown`,e=>{e.preventDefault(),!J.has(i)&&(J.add(i),r.classList.remove(n.className),r.offsetWidth,r.classList.add(n.className),n.onTrigger?.(r),n.sound?.(),ur(()=>{r.classList.remove(n.className),J.delete(i)},n.duration))})}function dr(e){q=g(rr,ir,{...ar}),or=[],sr=[],J=new Set,e.innerHTML=`
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
                <svg viewBox="0 0 100 100"><ellipse cx="50" cy="60" rx="26" ry="24" fill="#e0a458"/><path d="M28 44 L18 20 L38 36 Z" fill="#e0a458"/><path d="M72 44 L82 20 L62 36 Z" fill="#e0a458"/><circle cx="40" cy="58" r="4" fill="#4a4032"/><circle cx="60" cy="58" r="4" fill="#4a4032"/><path d="M42 68 Q50 73 58 68" stroke="#8a5a2e" stroke-width="2.5" fill="none" stroke-linecap="round"/></svg>
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
  `,fr(e),pr(e),mr(e),hr(e),gr(e),_r(e),vr(e),yr(e),br(e),xr(e),Sr(e),Cr(e),wr(e),Tr(e)}function fr(e){Y(e,`.w-sonne`,{className:`strahlt`,duration:700,sound:()=>{p({freq:1046.5,duration:.35,attack:.01,release:.5,type:`sine`,gain:.22}),p({freq:1567.98,duration:.25,attack:.01,release:.4,type:`sine`,gain:.1})}})}function pr(e){Y(e,`.w-wolke`,{className:`zieht-vorbei`,duration:2400,sound:()=>h()})}function mr(e){Y(e,`.w-schornstein`,{className:`pufft`,duration:1400,sound:()=>p({freq:260,duration:.15,attack:.01,release:.3,type:`sine`,gain:.16})})}function hr(e){let t=e.querySelector(`.w-tuer`);t.classList.toggle(`offen`,q.tuerOffen),cr(t,`pointerdown`,e=>{e.preventDefault(),q.tuerOffen=!q.tuerOffen,t.classList.toggle(`offen`,q.tuerOffen),h(),q.tuerOffen&&(p({freq:587.33,duration:.12,attack:.005,release:.15,type:`triangle`,gain:.2}),ur(()=>p({freq:493.88,duration:.18,attack:.005,release:.25,type:`triangle`,gain:.2}),130)),lr()})}function gr(e){let t=e.querySelector(`.w-fenster`);t.classList.toggle(`offen`,q.vorhangOffen),cr(t,`pointerdown`,e=>{e.preventDefault(),q.vorhangOffen=!q.vorhangOffen,t.classList.toggle(`offen`,q.vorhangOffen),h(),lr()})}function _r(e){Y(e,`.w-apfel`,{className:`faellt`,duration:900,sound:()=>p({freq:220,duration:.09,attack:.004,release:.14,type:`sine`,gain:.28})})}function vr(e){Y(e,`.w-vogelhaus`,{className:`fliegt`,duration:1600,sound:()=>{[0,90,180].forEach((e,t)=>{ur(()=>p({freq:f[(4+t)%f.length],duration:.14,attack:.005,release:.2,type:`triangle`,gain:.22}),e)})}})}function yr(e){let t=e.querySelector(`.w-schaukel`),n=t.querySelector(`.schaukel-sitz`),r=`schaukel`;cr(t,`pointerdown`,e=>{e.preventDefault(),!J.has(r)&&(J.add(r),n.classList.remove(`schwingt`),n.offsetWidth,n.classList.add(`schwingt`),[0,350,700,1050].forEach(e=>{ur(()=>p({freq:380,duration:.05,attack:.005,release:.1,type:`sine`,gain:.1}),e)}),ur(()=>{n.classList.remove(`schwingt`),J.delete(r)},2200))})}function br(e){Y(e,`.w-biene`,{className:`summt`,duration:1300,sound:()=>p({freq:660,duration:.5,attack:.02,release:.4,type:`sawtooth`,gain:.06})})}function xr(e){Y(e,`.w-maulwurfshuegel`,{className:`guckt`,duration:1200,sound:()=>p({freq:180,duration:.12,attack:.005,release:.2,type:`sine`,gain:.24})})}function Sr(e){let t=e.querySelector(`.w-briefkasten`);t.classList.toggle(`offen`,q.flaggeOben),cr(t,`pointerdown`,e=>{e.preventDefault(),q.flaggeOben=!q.flaggeOben,t.classList.toggle(`offen`,q.flaggeOben),m(q.flaggeOben?700:500),lr()})}function Cr(e){Y(e,`.w-frosch`,{className:`huepft`,duration:700,sound:()=>p({freq:200,duration:.1,attack:.004,release:.16,type:`square`,gain:.18})})}function wr(e){Y(e,`.w-schnecke`,{className:`streckt`,duration:900,sound:()=>m(520)})}function Tr(e){Y(e,`.w-marienkaefer`,{className:`fliegt-los`,duration:1100,sound:()=>p({freq:900,duration:.3,attack:.02,release:.3,type:`sawtooth`,gain:.05})})}function Er(){or.forEach(e=>e()),or=[],sr.forEach(e=>window.clearTimeout(e)),sr=[],J=new Set}var Dr={id:`wimmelbild`,accent:`#9ec99f`,tileIcon:nr,mount:dr,unmount:Er},Or=`
<svg viewBox="0 0 120 120" width="100%" height="100%">
  <path d="M78 20 a34 34 0 1 0 22 56 a26 26 0 1 1 -22 -56 Z" fill="#7ea3c9"/>
  <path d="M32 34 l4 10 l10 4 l-10 4 l-4 10 l-4 -10 l-10 -4 l10 -4 Z" fill="#f4c86b"/>
  <rect x="14" y="86" width="46" height="20" rx="6" fill="#e0a458"/>
  <circle cx="26" cy="86" r="8" fill="#f3e7db"/>
</svg>`,kr=[{id:`baer`,bettFarbe:`#e0a458`,wach:`<svg viewBox="0 0 100 100"><circle cx="50" cy="58" r="30" fill="#c9a37e"/><circle cx="24" cy="34" r="12" fill="#c9a37e"/><circle cx="76" cy="34" r="12" fill="#c9a37e"/><circle cx="40" cy="56" r="4" fill="#4a4032"/><circle cx="60" cy="56" r="4" fill="#4a4032"/><ellipse cx="50" cy="68" rx="8" ry="5" fill="#8a7255"/></svg>`,schlaeft:`<svg viewBox="0 0 100 100"><circle cx="50" cy="58" r="30" fill="#c9a37e"/><circle cx="24" cy="34" r="12" fill="#c9a37e"/><circle cx="76" cy="34" r="12" fill="#c9a37e"/><path d="M34 56 q6 5 12 0" stroke="#4a4032" stroke-width="3" fill="none" stroke-linecap="round"/><path d="M54 56 q6 5 12 0" stroke="#4a4032" stroke-width="3" fill="none" stroke-linecap="round"/><ellipse cx="50" cy="68" rx="8" ry="5" fill="#8a7255"/></svg>`},{id:`hase`,bettFarbe:`#e88a9a`,wach:`<svg viewBox="0 0 100 100"><ellipse cx="50" cy="62" rx="26" ry="26" fill="#f3e7db"/><ellipse cx="38" cy="24" rx="8" ry="20" fill="#f3e7db"/><ellipse cx="62" cy="24" rx="8" ry="20" fill="#f3e7db"/><ellipse cx="38" cy="26" rx="4" ry="13" fill="#f2b8c6"/><ellipse cx="62" cy="26" rx="4" ry="13" fill="#f2b8c6"/><circle cx="41" cy="58" r="4" fill="#4a4032"/><circle cx="59" cy="58" r="4" fill="#4a4032"/><ellipse cx="50" cy="68" rx="5" ry="3.5" fill="#e88a9a"/></svg>`,schlaeft:`<svg viewBox="0 0 100 100"><ellipse cx="50" cy="62" rx="26" ry="26" fill="#f3e7db"/><ellipse cx="38" cy="24" rx="8" ry="20" fill="#f3e7db"/><ellipse cx="62" cy="24" rx="8" ry="20" fill="#f3e7db"/><ellipse cx="38" cy="26" rx="4" ry="13" fill="#f2b8c6"/><ellipse cx="62" cy="26" rx="4" ry="13" fill="#f2b8c6"/><path d="M35 58 q6 5 12 0" stroke="#4a4032" stroke-width="3" fill="none" stroke-linecap="round"/><path d="M53 58 q6 5 12 0" stroke="#4a4032" stroke-width="3" fill="none" stroke-linecap="round"/><ellipse cx="50" cy="68" rx="5" ry="3.5" fill="#e88a9a"/></svg>`},{id:`katze`,bettFarbe:`#7ea3c9`,wach:`<svg viewBox="0 0 100 100"><ellipse cx="50" cy="60" rx="26" ry="24" fill="#e0a458"/><path d="M28 44 L18 20 L38 36 Z" fill="#e0a458"/><path d="M72 44 L82 20 L62 36 Z" fill="#e0a458"/><circle cx="40" cy="58" r="4" fill="#4a4032"/><circle cx="60" cy="58" r="4" fill="#4a4032"/><path d="M42 68 Q50 73 58 68" stroke="#8a5a2e" stroke-width="2.5" fill="none" stroke-linecap="round"/></svg>`,schlaeft:`<svg viewBox="0 0 100 100"><ellipse cx="50" cy="60" rx="26" ry="24" fill="#e0a458"/><path d="M28 44 L18 20 L38 36 Z" fill="#e0a458"/><path d="M72 44 L82 20 L62 36 Z" fill="#e0a458"/><path d="M34 58 q6 5 12 0" stroke="#4a4032" stroke-width="3" fill="none" stroke-linecap="round"/><path d="M54 58 q6 5 12 0" stroke="#4a4032" stroke-width="3" fill="none" stroke-linecap="round"/><path d="M42 68 Q50 71 58 68" stroke="#8a5a2e" stroke-width="2.5" fill="none" stroke-linecap="round"/></svg>`}],Ar=`gutenacht`,jr=1,Mr={lampeAn:!0,schlaeft:[!1,!1,!1]},X={...Mr},Nr=[];function Pr(e,t,n){e.addEventListener(t,n),Nr.push(()=>e.removeEventListener(t,n))}function Fr(){_(Ar,jr,X)}function Ir(e){X=g(Ar,jr,{...Mr,schlaeft:[...Mr.schlaeft]}),Nr=[],e.innerHTML=`
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
          ${kr.map((e,t)=>`
            <div class="n-bett${X.schlaeft[t]?` schlaeft`:``}" style="--bett-farbe:${e.bettFarbe}">
              <div class="bett-rahmen"></div>
              <div class="n-tier${X.schlaeft[t]?` schlaeft`:``}" data-item="tier${t}" data-idx="${t}">
                <div class="tier-wach">${e.wach}</div>
                <div class="tier-schlaeft">${e.schlaeft}</div>
              </div>
              <div class="n-decke"></div>
            </div>
          `).join(``)}
        </div>
      </div>
    </div>
  `;let t=e.querySelector(`#nachtSzene`);t.classList.toggle(`dunkel`,!X.lampeAn),Lr(e,t),Rr(e)}function Lr(e,t){Pr(e.querySelector(`.n-lampe`),`pointerdown`,e=>{e.preventDefault(),X.lampeAn=!X.lampeAn,t.classList.toggle(`dunkel`,!X.lampeAn),p({freq:X.lampeAn?480:320,duration:.18,attack:.01,release:.3,type:`sine`,gain:.18}),Fr()})}function Rr(e){e.querySelectorAll(`.n-tier`).forEach(e=>{let t=Number(e.dataset.idx);Pr(e,`pointerdown`,n=>{n.preventDefault();let r=!X.schlaeft[t];X.schlaeft[t]=r,e.classList.toggle(`schlaeft`,r),e.closest(`.n-bett`)?.classList.toggle(`schlaeft`,r),r?(h(),p({freq:392,duration:.2,attack:.01,release:.4,type:`sine`,gain:.16}),window.setTimeout(()=>{p({freq:294,duration:.3,attack:.01,release:.5,type:`sine`,gain:.14})},220)):(p({freq:440,duration:.1,attack:.005,release:.2,type:`triangle`,gain:.2}),window.setTimeout(()=>{p({freq:587.33,duration:.16,attack:.005,release:.25,type:`triangle`,gain:.2})},110)),Fr()})})}function zr(){Nr.forEach(e=>e()),Nr=[],X={...Mr,schlaeft:[...Mr.schlaeft]}}var Br={id:`gutenacht`,accent:`#7ea3c9`,tileIcon:Or,mount:Ir,unmount:zr};le();var Vr=[Ge,lt,At,Xt,ln,Pn,tr,Dr,Br],Hr=document.querySelector(`#app`),Ur=`
  <svg viewBox="0 0 96 96" width="40" height="40">
    <path d="M56 26 L34 48 L56 70" fill="none" stroke="#8a7255" stroke-width="8"
      stroke-linecap="round" stroke-linejoin="round"/>
  </svg>
`,Wr=18,Gr=2*Math.PI*Wr;Hr.innerHTML=`
  <div class="spielzimmer" id="spielzimmer">
    <div class="tiles" id="tiles"></div>
    <button class="eltern-gate" id="elternGate" aria-hidden="true">${`
  <svg viewBox="0 0 44 44">
    <circle cx="22" cy="22" r="${Wr}" fill="none" stroke="#8a7255" stroke-width="3" opacity="0.25"/>
    <circle class="eltern-gate-progress" cx="22" cy="22" r="${Wr}" fill="none"
      stroke="#8a7255" stroke-width="3" stroke-linecap="round"
      stroke-dasharray="${Gr}" stroke-dashoffset="${Gr}"
      transform="rotate(-90 22 22)"/>
    <circle cx="22" cy="22" r="4" fill="#8a7255"/>
  </svg>
`}</button>
  </div>
  <div class="toy-view" id="toyView">
    <div class="toy-stage" id="toyStage"></div>
  </div>
  <button class="back-button" id="backButton" aria-hidden="true">${Ur}</button>
  <div class="eltern-overlay" id="elternOverlay">
    <div id="elternPanelWrap"></div>
  </div>
  <div class="version-placeholder">v1.0.4 · 777a041</div>
`;var Kr=document.querySelector(`#spielzimmer`),qr=document.querySelector(`#tiles`),Jr=document.querySelector(`#toyView`),Yr=document.querySelector(`#toyStage`),Xr=document.querySelector(`#backButton`),Z=document.querySelector(`#elternGate`),Zr=document.querySelector(`#elternOverlay`),Qr=document.querySelector(`#elternPanelWrap`),$r=null,Q=!1;function ei(){qr.innerHTML=``,Vr.forEach((e,t)=>{let n=document.createElement(`button`);n.className=`tile`,n.style.setProperty(`--accent`,e.accent),n.style.animationDelay=`${(t*.7%4.5).toFixed(2)}s`,n.innerHTML=e.tileIcon,n.setAttribute(`aria-hidden`,`true`),n.addEventListener(`pointerdown`,t=>{t.preventDefault(),ti(e)}),qr.appendChild(n)})}function ti(e){Q||$r||(Q=!0,$r=e,e.mount(Yr),Kr.classList.add(`hidden`),Xr.classList.add(`visible`),Jr.classList.add(`active`),window.setTimeout(()=>{Q=!1},450))}function ni(){Q||!$r||(Q=!0,Jr.classList.remove(`active`),Kr.classList.remove(`hidden`),Xr.classList.remove(`visible`),window.setTimeout(()=>{$r?.unmount?.(),Yr.innerHTML=``,$r=null,Q=!1},450))}Xr.addEventListener(`pointerdown`,e=>{e.preventDefault(),ni()});var ri=3e3,$=null;function ii(){$===null&&(Z.classList.add(`charging`),$=window.setTimeout(()=>{$=null,Z.classList.remove(`charging`),oi()},ri))}function ai(){$!==null&&(window.clearTimeout($),$=null),Z.classList.remove(`charging`)}Z.addEventListener(`pointerdown`,e=>{e.preventDefault(),ii()}),Z.addEventListener(`pointerup`,ai),Z.addEventListener(`pointercancel`,ai),Z.addEventListener(`pointerleave`,ai);function oi(){de(Qr),Zr.classList.add(`active`)}function si(){Zr.classList.remove(`active`)}Zr.addEventListener(`pointerdown`,e=>{e.target===Zr&&si()}),document.addEventListener(`click`,e=>{e.target.closest(`.eltern-close`)&&si()}),document.addEventListener(`gesturestart`,e=>e.preventDefault()),document.addEventListener(`gesturechange`,e=>e.preventDefault()),document.addEventListener(`dblclick`,e=>e.preventDefault()),document.addEventListener(`contextmenu`,e=>e.preventDefault());var ci=!1;document.addEventListener(`pointerdown`,()=>{s(),ci||(ci=!0,window.setTimeout(()=>{ee()&&p({freq:523.25,duration:.15,gain:.25})},80))},{once:!1}),ei();