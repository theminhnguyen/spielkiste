(function(){let e=document.createElement(`link`).relList;if(e&&e.supports&&e.supports(`modulepreload`))return;for(let e of document.querySelectorAll(`link[rel="modulepreload"]`))n(e);new MutationObserver(e=>{for(let t of e)if(t.type===`childList`)for(let e of t.addedNodes)e.tagName===`LINK`&&e.rel===`modulepreload`&&n(e)}).observe(document,{childList:!0,subtree:!0});function t(e){let t={};return e.integrity&&(t.integrity=e.integrity),e.referrerPolicy&&(t.referrerPolicy=e.referrerPolicy),t.credentials=e.crossOrigin===`use-credentials`?`include`:e.crossOrigin===`anonymous`?`omit`:`same-origin`,t}function n(e){if(e.ep)return;e.ep=!0;let n=t(e);fetch(e.href,n)}})();var e=null,t=null,n=!1;function r(){if(e)return e;let n=window.AudioContext??window.webkitAudioContext;return n?(e=new n,t=e.createGain(),t.gain.value=o(),t.connect(e.destination),e):null}function i(){if(n)return;let e=r();e&&(e.state===`suspended`&&e.resume().catch(()=>{}),n=!0)}var a=.6;function o(){return a}function s(e){a=Math.max(0,Math.min(1,e)),t&&(t.gain.value=a)}function c(){return!!e&&e.state===`running`}var l=[261.63,293.66,329.63,392,440,523.25,587.33,659.25];function u(n){let r=e;if(!r||!t||r.state!==`running`)return;let{freq:i,duration:a=.5,attack:o=.02,release:s=.35,type:c=`sine`,gain:l=.5}=n,u=r.createOscillator();u.type=c,u.frequency.value=i;let d=r.createGain();d.gain.setValueAtTime(0,r.currentTime),d.gain.linearRampToValueAtTime(l,r.currentTime+o),d.gain.linearRampToValueAtTime(0,r.currentTime+o+a+s),u.connect(d),d.connect(t),u.start(),u.stop(r.currentTime+o+a+s+.05)}function d(e=440){u({freq:e,duration:.03,attack:.002,release:.08,type:`triangle`,gain:.3})}function ee(n,r=.28){let i=e;if(!i||!t||i.state!==`running`)return null;let a=i.createOscillator();a.type=`sine`,a.frequency.value=n;let o=i.createGain();o.gain.setValueAtTime(0,i.currentTime),o.gain.linearRampToValueAtTime(r,i.currentTime+.05),a.connect(o),o.connect(t),a.start();let s=!1;return{update(e){s||a.frequency.linearRampToValueAtTime(e,i.currentTime+.06)},stop(){s||(s=!0,o.gain.cancelScheduledValues(i.currentTime),o.gain.setValueAtTime(o.gain.value,i.currentTime),o.gain.linearRampToValueAtTime(0,i.currentTime+.15),a.stop(i.currentTime+.2))}}}var f=null;function te(e){if(f)return f;let t=e.sampleRate*.5,n=e.createBuffer(1,t,e.sampleRate),r=n.getChannelData(0);for(let e=0;e<t;e++)r[e]=Math.random()*2-1;return f=n,n}function p(n){let r=e;if(!r||!t||r.state!==`running`)return;let i=r.createBufferSource();i.buffer=te(r);let a=r.createBiquadFilter();a.type=`bandpass`,a.Q.value=8;let o=n?700:2200,s=n?2200:700;a.frequency.setValueAtTime(o,r.currentTime),a.frequency.linearRampToValueAtTime(s,r.currentTime+.35);let c=r.createGain();c.gain.setValueAtTime(0,r.currentTime),c.gain.linearRampToValueAtTime(.18,r.currentTime+.03),c.gain.linearRampToValueAtTime(0,r.currentTime+.38),i.connect(a),a.connect(c),c.connect(t),i.start(),i.stop(r.currentTime+.4)}function m(){let n=e;if(!n||!t||n.state!==`running`)return;let r=n.createBufferSource();r.buffer=te(n);let i=n.createBiquadFilter();i.type=`lowpass`,i.frequency.setValueAtTime(300,n.currentTime),i.frequency.linearRampToValueAtTime(1400,n.currentTime+.25);let a=n.createGain();a.gain.setValueAtTime(0,n.currentTime),a.gain.linearRampToValueAtTime(.14,n.currentTime+.05),a.gain.linearRampToValueAtTime(0,n.currentTime+.3),r.connect(i),i.connect(a),a.connect(t),r.start(),r.stop(n.currentTime+.32)}var ne=`spielkiste:`;function h(e,t,n){try{let r=localStorage.getItem(ne+e);if(!r)return n;let i=JSON.parse(r);return i.v===t?i.data:n}catch{return n}}function g(e,t,n){try{let r={v:t,data:n};localStorage.setItem(ne+e,JSON.stringify(r))}catch{}}function re(){try{let e=[];for(let t=0;t<localStorage.length;t++){let n=localStorage.key(t);n?.startsWith(ne)&&e.push(n)}e.forEach(e=>localStorage.removeItem(e))}catch{}}var ie=`settings`,ae=1;function oe(){s(h(ie,ae,{volume:.6}).volume)}function se(e){g(ie,ae,{volume:e})}function ce(e){e.innerHTML=`
    <div class="eltern-panel">
      <h1>Spielkiste</h1>
      <p class="eltern-version">Version 1.0.0 · 3a3edc8</p>

      <label class="eltern-field">
        <span>Lautstärke</span>
        <input type="range" min="0" max="100" value="${Math.round(o()*100)}" class="eltern-volume" />
      </label>

      <div class="eltern-reset-zone">
        <button class="eltern-reset-btn">Alles zurücksetzen</button>
        <div class="eltern-reset-confirm" hidden>
          <p>Wirklich alle gespeicherten Spielstände löschen (Bild, Steine, Schalterstellungen)?</p>
          <div class="eltern-reset-actions">
            <button class="eltern-reset-cancel">Abbrechen</button>
            <button class="eltern-reset-confirm-btn">Ja, zurücksetzen</button>
          </div>
        </div>
      </div>

      <button class="eltern-close">Schließen</button>
    </div>
  `;let t=e.querySelector(`.eltern-volume`);t.addEventListener(`input`,()=>{s(Number(t.value)/100)}),t.addEventListener(`change`,()=>{se(Number(t.value)/100),d(500)});let n=e.querySelector(`.eltern-reset-btn`),r=e.querySelector(`.eltern-reset-confirm`),i=e.querySelector(`.eltern-reset-cancel`),a=e.querySelector(`.eltern-reset-confirm-btn`);n.addEventListener(`click`,()=>{n.hidden=!0,r.hidden=!1}),i.addEventListener(`click`,()=>{r.hidden=!0,n.hidden=!1}),a.addEventListener(`click`,()=>{re(),window.location.reload()})}var le=`
<svg viewBox="0 0 120 120" width="100%" height="100%">
  <rect x="14" y="14" width="92" height="92" rx="18" fill="#fdf6ea" stroke="#e0a458" stroke-width="4"/>
  <circle cx="42" cy="46" r="10" fill="#e0a458"/>
  <rect x="66" y="38" width="34" height="14" rx="7" fill="#7fb99e"/>
  <circle cx="42" cy="80" r="12" fill="#e88a9a"/>
  <rect x="66" y="72" width="34" height="14" rx="7" fill="#f4a56b"/>
</svg>`,ue=`brett`,de=2,fe={switchOn:!1,knobStep:0,sliderValue:.3,zipperOpen:!1,doorIndex:0,curtainOpen:!1,veloOpen:!1,beads:[.08,.28,.48,.68],kaleidoStep:0},_=[`<svg viewBox="0 0 100 100"><circle cx="50" cy="55" r="30" fill="#f2c9a0"/><circle cx="28" cy="30" r="14" fill="#f2c9a0"/><circle cx="72" cy="30" r="14" fill="#f2c9a0"/><circle cx="40" cy="52" r="4" fill="#4a4032"/><circle cx="60" cy="52" r="4" fill="#4a4032"/><ellipse cx="50" cy="64" rx="6" ry="4" fill="#e88a9a"/></svg>`,`<svg viewBox="0 0 100 100"><ellipse cx="50" cy="58" rx="26" ry="28" fill="#e8dfd0"/><ellipse cx="35" cy="20" rx="8" ry="18" fill="#e8dfd0"/><ellipse cx="65" cy="20" rx="8" ry="18" fill="#e8dfd0"/><circle cx="40" cy="55" r="4" fill="#4a4032"/><circle cx="60" cy="55" r="4" fill="#4a4032"/><ellipse cx="50" cy="66" rx="5" ry="3" fill="#e88a9a"/></svg>`,`<svg viewBox="0 0 100 100"><circle cx="50" cy="55" r="32" fill="#c9a37e"/><circle cx="22" cy="32" r="12" fill="#c9a37e"/><circle cx="78" cy="32" r="12" fill="#c9a37e"/><circle cx="40" cy="52" r="4" fill="#4a4032"/><circle cx="60" cy="52" r="4" fill="#4a4032"/><ellipse cx="50" cy="66" rx="8" ry="5" fill="#8a7255"/></svg>`],v={...fe},pe=[],y=null,b=[],me=0;function x(e,t,n){e.addEventListener(t,n),pe.push(()=>e.removeEventListener(t,n))}function S(){g(ue,de,v)}function he(e){v=h(ue,de,{...fe}),pe=[],y=null,b=[],me=0,e.innerHTML=`
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
            <div class="door-animal">${_[v.doorIndex%_.length]}</div>
            <div class="door-panel"></div>
          </div>
        </div>

        <div class="brett-mod brett-gears" data-mod="gears">
          <svg class="gear g-big" viewBox="0 0 100 100" width="66" height="66">${ge(`#7fb99e`)}</svg>
          <svg class="gear g-small" viewBox="0 0 100 100" width="44" height="44">${ge(`#e0a458`)}</svg>
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
            <div class="crank-pop">${_[0]}</div>
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
            ${v.beads.map((e,t)=>`<span class="bead b${t}" data-bead="${t}"></span>`).join(``)}
          </div>
        </div>
      </div>
    </div>
  `,_e(e),ye(e),xe(e),Se(e),we(e),Ee(e),Oe(e),Ae(e),je(e),Me(e),Pe(e),Ie(e),Re(e),Be(e)}function ge(e){return`${Array.from({length:8},(t,n)=>`<rect x="44" y="2" width="12" height="18" rx="3" fill="${e}" transform="rotate(${n*360/8} 50 50)"/>`).join(``)}<circle cx="50" cy="50" r="34" fill="${e}"/><circle cx="50" cy="50" r="11" fill="#fffaf2"/>`}function _e(e){let t=e.querySelector(`.brett-switch`);ve(t),x(t,`pointerdown`,e=>{e.preventDefault(),v.switchOn=!v.switchOn,ve(t),u({freq:v.switchOn?440:330,duration:.05,attack:.002,release:.1,type:`square`,gain:.25}),S()})}function ve(e){e.classList.toggle(`on`,v.switchOn)}function ye(e){let t=e.querySelector(`.brett-knob`),n=t.querySelector(`.knob-dial`);be(n);let r=!1;function i(e,t){let r=n.getBoundingClientRect(),i=r.left+r.width/2,a=r.top+r.height/2,o=e-i,s=t-a,c=Math.atan2(s,o)*180/Math.PI+90;return c<0&&(c+=360),Math.round(c/45)%8}x(t,`pointerdown`,e=>{let n=e;n.preventDefault(),r=!0;try{t.setPointerCapture(n.pointerId)}catch{}o(n.clientX,n.clientY)}),x(t,`pointermove`,e=>{if(!r)return;let t=e;o(t.clientX,t.clientY)});function a(e){if(!r)return;r=!1;let n=e;if(n.pointerId!==void 0)try{t.releasePointerCapture(n.pointerId)}catch{}}x(t,`pointerup`,a),x(t,`pointercancel`,a);function o(e,t){let r=i(e,t);r!==v.knobStep&&(v.knobStep=r,be(n),u({freq:l[r%l.length],duration:.04,attack:.002,release:.08,type:`triangle`,gain:.25}),S())}}function be(e){e.style.transform=`rotate(${v.knobStep*45}deg)`}function xe(e){e.querySelectorAll(`.press-btn`).forEach(e=>{x(e,`pointerdown`,t=>{t.preventDefault(),u({freq:l[Number(e.dataset.note??`0`)%l.length],duration:.3,gain:.4}),e.classList.add(`pressed`),window.setTimeout(()=>e.classList.remove(`pressed`),260)})})}function Se(e){let t=e.querySelector(`.brett-slider`),n=t.querySelector(`.slider-track`),r=t.querySelector(`.slider-handle`),i=t.querySelector(`.slider-fill`);Ce(r,i);let a=!1;function o(e){let t=n.getBoundingClientRect(),r=(e-t.left)/t.width;return Math.max(0,Math.min(1,r))}function s(e){return 220*4**e}x(t,`pointerdown`,e=>{let n=e;n.preventDefault(),a=!0;try{t.setPointerCapture(n.pointerId)}catch{}v.sliderValue=o(n.clientX),Ce(r,i),y=ee(s(v.sliderValue))}),x(t,`pointermove`,e=>{a&&(v.sliderValue=o(e.clientX),Ce(r,i),y?.update(s(v.sliderValue)))});function c(e){if(!a)return;a=!1,y?.stop(),y=null;let n=e;if(n.pointerId!==void 0)try{t.releasePointerCapture(n.pointerId)}catch{}S()}x(t,`pointerup`,c),x(t,`pointercancel`,c)}function Ce(e,t){let n=v.sliderValue*100;e.style.left=`${n}%`,t.style.width=`${n}%`}function we(e){let t=e.querySelector(`.brett-zipper`),n=t.querySelector(`.zipper-track`),r=t.querySelector(`.zipper-pull`);Te(t);let i=!1,a=0,o=0;x(t,`pointerdown`,e=>{let n=e;n.preventDefault(),i=!0,o=0,a=n.clientY;try{t.setPointerCapture(n.pointerId)}catch{}}),x(t,`pointermove`,e=>{if(!i)return;let t=e,s=n.getBoundingClientRect(),c=Math.max(0,Math.min(1,(t.clientY-s.top)/s.height));o+=Math.abs(t.clientY-a),a=t.clientY,r.style.top=`${c*100}%`});function s(e){if(!i)return;i=!1;let a=e;if(a.pointerId!==void 0)try{t.releasePointerCapture(a.pointerId)}catch{}let s=n.getBoundingClientRect(),c=r.getBoundingClientRect(),l=(c.top+c.height/2-s.top)/s.height,u=v.zipperOpen,d=o<6?!v.zipperOpen:l>.5;d!==u&&(v.zipperOpen=d,p(d),S()),Te(t)}x(t,`pointerup`,s),x(t,`pointercancel`,s)}function Te(e){e.classList.toggle(`open`,v.zipperOpen);let t=e.querySelector(`.zipper-pull`);t.style.top=v.zipperOpen?`100%`:`0%`}function Ee(e){let t=e.querySelector(`.brett-windmill`),n=t.querySelector(`.windmill-blades`);n.style.transform=`rotate(${me}deg)`,x(t,`pointerdown`,e=>{e.preventDefault(),De(n)})}function De(e){b.forEach(e=>window.clearTimeout(e)),b=[];let t=3+Math.random()*2;me+=t*360;let n=2200+Math.random()*400;e.style.transition=`transform ${n}ms cubic-bezier(0.13, 0.7, 0.25, 1)`,e.style.transform=`rotate(${me}deg)`;for(let e=0;e<12;e++){let t=n*(1-(1-e/12)**2.2),r=window.setTimeout(()=>{u({freq:700,duration:.02,attack:.001,release:.04,type:`triangle`,gain:.12})},t);b.push(r)}}function Oe(e){let t=e.querySelector(`.brett-door`),n=t.querySelector(`.door-animal`);ke(t),x(t,`pointerdown`,e=>{e.preventDefault();let r=!t.classList.contains(`open`);r&&(v.doorIndex=(v.doorIndex+1)%_.length,n.innerHTML=_[v.doorIndex],S()),t.classList.toggle(`open`,r),m()})}function ke(e){e.classList.remove(`open`)}function Ae(e){let t=e.querySelector(`.brett-gears`),n=t.querySelector(`.g-big`),r=t.querySelector(`.g-small`),i=!1,a=0,o=0,s=0;function c(e,n){let r=t.getBoundingClientRect();return Math.atan2(n-(r.top+r.height/2),e-(r.left+r.width/2))*180/Math.PI}function l(){n.style.transform=`rotate(${o}deg)`,r.style.transform=`rotate(${-o*1.5}deg)`}l(),x(t,`pointerdown`,e=>{let n=e;n.preventDefault(),i=!0,a=c(n.clientX,n.clientY);try{t.setPointerCapture(n.pointerId)}catch{}}),x(t,`pointermove`,e=>{if(!i)return;let t=e,n=c(t.clientX,t.clientY),r=n-a;r>180&&(r-=360),r<-180&&(r+=360),a=n,o+=r,l();let d=performance.now();Math.abs(r)>6&&d-s>90&&(s=d,u({freq:320,duration:.02,attack:.002,release:.05,type:`square`,gain:.1}))});function d(e){if(!i)return;i=!1;let n=e;try{t.releasePointerCapture(n.pointerId)}catch{}}x(t,`pointerup`,d),x(t,`pointercancel`,d)}function je(e){let t=e.querySelector(`.brett-bell`),n=t.querySelector(`.bell-body`);x(t,`pointerdown`,e=>{e.preventDefault(),n.classList.remove(`ring`),n.offsetWidth,n.classList.add(`ring`),u({freq:1046.5,duration:.5,attack:.004,release:.9,type:`sine`,gain:.22}),u({freq:1567.98,duration:.35,attack:.004,release:.7,type:`sine`,gain:.1})})}function Me(e){let t=e.querySelector(`.brett-curtain`);Ne(t),x(t,`pointerdown`,e=>{e.preventDefault(),v.curtainOpen=!v.curtainOpen,Ne(t),m(),S()})}function Ne(e){e.classList.toggle(`open`,v.curtainOpen)}function Pe(e){let t=e.querySelector(`.brett-crank`),n=t.querySelector(`.crank-handle`),r=t.querySelector(`.crank-pop`),i=!1,a=0,o=0,s=0,c=!1,d=0;function ee(e,t){let r=n.getBoundingClientRect();return Math.atan2(t-(r.top+r.height/2),e-(r.left+r.width/2))*180/Math.PI}x(t,`pointerdown`,e=>{let n=e;if(n.preventDefault(),c){c=!1,s=0,t.classList.remove(`popped`);return}i=!0,a=ee(n.clientX,n.clientY);try{t.setPointerCapture(n.pointerId)}catch{}}),x(t,`pointermove`,e=>{if(!i||c)return;let f=e,te=ee(f.clientX,f.clientY),p=te-a;p>180&&(p-=360),p<-180&&(p+=360),a=te,o+=p,s+=Math.abs(p),n.style.transform=`rotate(${o}deg)`;let m=performance.now();m-d>120&&(d=m,u({freq:l[Math.floor(s/45)%l.length],duration:.05,attack:.003,release:.1,type:`triangle`,gain:.16})),s>540&&(c=!0,i=!1,r.innerHTML=_[Math.floor(Math.random()*_.length)],t.classList.add(`popped`),u({freq:880,duration:.18,attack:.005,release:.3,type:`sine`,gain:.3}))});function f(e){if(!i)return;i=!1;let n=e;try{t.releasePointerCapture(n.pointerId)}catch{}}x(t,`pointerup`,f),x(t,`pointercancel`,f)}var Fe=[`#e88a9a`,`#7fb99e`,`#f4c86b`,`#7ea3c9`,`#e0a458`,`#c896d8`];function Ie(e){let t=e.querySelector(`.brett-kaleido`),n=t.querySelector(`.kaleido-disc`),r=t.querySelector(`.kaleido-petals`);Le(r),n.style.transform=`rotate(${v.kaleidoStep*30}deg)`,x(t,`pointerdown`,e=>{e.preventDefault(),v.kaleidoStep+=1,n.style.transform=`rotate(${v.kaleidoStep*30}deg)`,Le(r),u({freq:l[v.kaleidoStep%l.length],duration:.25,attack:.01,release:.4,type:`sine`,gain:.2}),S()})}function Le(e){let t=v.kaleidoStep,n=``;for(let e=0;e<6;e++){let r=Fe[(t+e)%Fe.length],i=Fe[(t*2+e+3)%Fe.length];n+=`<g transform="rotate(${e*60})">
      <ellipse cx="0" cy="-24" rx="9" ry="16" fill="${r}" opacity="0.85"/>
      <circle cx="0" cy="-38" r="5" fill="${i}"/>
    </g>`}e.innerHTML=n}function Re(e){let t=e.querySelector(`.brett-velcro`);ze(t),x(t,`pointerdown`,e=>{e.preventDefault(),v.veloOpen=!v.veloOpen,ze(t),p(v.veloOpen),S()})}function ze(e){e.classList.toggle(`open`,v.veloOpen)}function Be(e){let t=e.querySelector(`.brett-beads`),n=t.querySelector(`.beads-wire`),r=[...t.querySelectorAll(`.bead`)];r.forEach((e,t)=>{e.style.left=`${v.beads[t]*100}%`});let i=new Map;x(n,`pointerdown`,e=>{let t=e,r=t.target.closest(`.bead`);if(!r)return;t.preventDefault();let a=Number(r.dataset.bead);i.set(t.pointerId,a);try{n.setPointerCapture(t.pointerId)}catch{}}),x(n,`pointermove`,e=>{let t=e,a=i.get(t.pointerId);if(a===void 0)return;let o=n.getBoundingClientRect(),s=Math.max(.02,Math.min(.94,(t.clientX-o.left)/o.width)),c=v.beads[a];v.beads[a]=s,r[a].style.left=`${s*100}%`,Math.abs(s-c)>.04&&u({freq:l[a%l.length]*2,duration:.03,attack:.002,release:.07,type:`triangle`,gain:.12})});function a(e){let t=e;if(i.has(t.pointerId)){i.delete(t.pointerId);try{n.releasePointerCapture(t.pointerId)}catch{}S()}}x(n,`pointerup`,a),x(n,`pointercancel`,a)}function Ve(){pe.forEach(e=>e()),pe=[],y?.stop(),y=null,b.forEach(e=>window.clearTimeout(e)),b=[]}var He={id:`brett`,accent:`#e0a458`,tileIcon:le,mount:he,unmount:Ve},Ue=`
<svg viewBox="0 0 120 120" width="100%" height="100%">
  <circle cx="45" cy="45" r="24" fill="#e88a9a"/>
  <circle cx="78" cy="55" r="20" fill="#7fb99e"/>
  <circle cx="55" cy="82" r="18" fill="#f4c86b"/>
</svg>`,We=[{id:0,color:`#e88a9a`,note:0,xPct:22,yPct:30,radiusPx:58},{id:1,color:`#7fb99e`,note:1,xPct:50,yPct:22,radiusPx:62},{id:2,color:`#f4c86b`,note:2,xPct:78,yPct:32,radiusPx:56},{id:3,color:`#7ea3c9`,note:3,xPct:30,yPct:68,radiusPx:60},{id:4,color:`#e0a458`,note:4,xPct:58,yPct:74,radiusPx:58},{id:5,color:`#c896d8`,note:5,xPct:80,yPct:66,radiusPx:54}],C=null,Ge=[],Ke=[],w=new Set;function qe(e,t,n){e.addEventListener(t,n),Ke.push(()=>e.removeEventListener(t,n))}function Je(e,t,n){return Math.max(t,Math.min(n,e))}function Ye(e){Ke=[],w=new Set,e.innerHTML=`
    <div class="kleckse-stage" id="kleckseStage">
      ${We.map(e=>`
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
  `,C=e.querySelector(`#kleckseStage`),Ge=We.map(t=>({def:t,el:e.querySelector(`.klecks[data-id="${t.id}"]`),xPct:t.xPct,yPct:t.yPct,grabbed:!1,lastX:0,lastY:0,lastT:0})),Ge.forEach(e=>{T(e),Xe(e)})}function T(e,t=1,n=1){if(!C)return;let r=C.getBoundingClientRect(),i=e.xPct/100*r.width-e.def.radiusPx,a=e.yPct/100*r.height-e.def.radiusPx;e.el.style.transform=`translate(${i.toFixed(1)}px, ${a.toFixed(1)}px) scale(${t.toFixed(3)}, ${n.toFixed(3)})`}function Xe(e){let t=e.el;qe(t,`pointerdown`,n=>{let r=n;r.preventDefault();try{t.setPointerCapture(r.pointerId)}catch{}e.grabbed=!0,e.lastX=r.clientX,e.lastY=r.clientY,e.lastT=performance.now(),t.classList.add(`grabbed`),u({freq:l[e.def.note%l.length],duration:.35,gain:.35}),Qe(e,1.18)}),qe(t,`pointermove`,t=>{if(!e.grabbed||!C)return;let n=t,r=C.getBoundingClientRect(),i=performance.now(),a=Math.max(1,i-e.lastT),o=(n.clientX-e.lastX)/a,s=(n.clientY-e.lastY)/a;e.lastX=n.clientX,e.lastY=n.clientY,e.lastT=i,e.xPct=Je((n.clientX-r.left)/r.width*100,6,94),e.yPct=Je((n.clientY-r.top)/r.height*100,8,92),Ze(e,o,s),et(e)});function n(n){if(!e.grabbed)return;e.grabbed=!1,t.classList.remove(`grabbed`);let r=n;if(r.pointerId!==void 0)try{t.releasePointerCapture(r.pointerId)}catch{}T(e,1,1)}qe(t,`pointerup`,n),qe(t,`pointercancel`,n)}function Ze(e,t,n){let r=Math.min(Math.hypot(t,n)*6,.28),i=Math.atan2(n,t);T(e,1+r*Math.abs(Math.cos(i)),1-r*Math.abs(Math.cos(i))*.6+r*Math.abs(Math.sin(i))*.1)}function Qe(e,t){T(e,t,t),window.setTimeout(()=>{e.el.classList.contains(`grabbed`)||T(e,1,1)},160)}function $e(e,t){return e<t?`${e}-${t}`:`${t}-${e}`}function et(e){if(!C)return;let t=C.getBoundingClientRect(),n=e.xPct/100*t.width,r=e.yPct/100*t.height;for(let i of Ge){if(i.def.id===e.def.id)continue;let a=i.xPct/100*t.width,o=i.yPct/100*t.height,s=Math.hypot(n-a,r-o),c=e.def.radiusPx*.75+i.def.radiusPx*.75,d=$e(e.def.id,i.def.id);s<c?w.has(d)||(w.add(d),u({freq:l[e.def.note%l.length],duration:.25,gain:.22}),u({freq:l[i.def.note%l.length],duration:.25,gain:.22}),Qe(i,1.1)):w.delete(d)}}function tt(){Ke.forEach(e=>e()),Ke=[],Ge=[],C=null,w=new Set}var nt={id:`kleckse`,accent:`#e88a9a`,tileIcon:Ue,mount:Ye,unmount:tt},rt=`
<svg viewBox="0 0 120 120" width="100%" height="100%">
  <path d="M30 90 L80 30 L95 45 L45 95 Z" fill="#fdf6ea" stroke="#7ea3c9" stroke-width="4" stroke-linejoin="round"/>
  <circle cx="34" cy="92" r="10" fill="#7ea3c9"/>
  <circle cx="70" cy="40" r="8" fill="#e88a9a"/>
</svg>`,it=[`#e88a9a`,`#7fb99e`,`#f4c86b`,`#7ea3c9`,`#e0a458`,`#6b5d4a`],at=`malen`,ot=1,E=null,D=null,O=null,st=it[0],k=!1,ct=0,lt=0,ut=[],A=null,dt=null;function j(e,t,n){e.addEventListener(t,n),ut.push(()=>e.removeEventListener(t,n))}function ft(e){ut=[],k=!1,st=it[0],e.innerHTML=`
    <div class="malen-stage" id="malenStage">
      <canvas class="malen-canvas" id="malenCanvas"></canvas>
      <div class="malen-palette" id="malenPalette">
        ${it.map((e,t)=>`<button class="malen-swatch${t===0?` selected`:``}" data-color="${e}" style="--swatch-color:${e}" aria-hidden="true"></button>`).join(``)}
      </div>
      <button class="malen-new-sheet" id="malenNewSheet" aria-hidden="true">
        <svg viewBox="0 0 48 48" width="30" height="30">
          <path d="M10 6 h20 l8 8 v28 h-28 z" fill="#fffaf2" stroke="#8a7255" stroke-width="2.5" stroke-linejoin="round"/>
          <path d="M30 6 v8 h8" fill="none" stroke="#8a7255" stroke-width="2.5" stroke-linejoin="round"/>
        </svg>
      </button>
    </div>
  `,O=e.querySelector(`#malenStage`),E=e.querySelector(`#malenCanvas`),D=E.getContext(`2d`),pt(),mt(),j(E,`pointerdown`,_t),j(E,`pointermove`,vt),j(E,`pointerup`,yt),j(E,`pointercancel`,yt);let t=e.querySelectorAll(`.malen-swatch`);t.forEach(e=>{j(e,`pointerdown`,n=>{n.preventDefault(),st=e.dataset.color??it[0],t.forEach(e=>e.classList.remove(`selected`)),e.classList.add(`selected`),d(500)})}),j(e.querySelector(`#malenNewSheet`),`pointerdown`,e=>{e.preventDefault(),bt()});let n=O.clientWidth,r=O.clientHeight,i=()=>{if(!O)return;let e=O.clientWidth,t=O.clientHeight;(e!==n||t!==r)&&(n=e,r=t,A!==null&&window.clearTimeout(A),A=window.setTimeout(()=>{pt(),mt()},200))};dt=new ResizeObserver(i),dt.observe(O),j(window,`resize`,i),j(window,`orientationchange`,i)}function pt(){if(!E||!O)return;let e=Math.min(window.devicePixelRatio||1,2),t={width:O.clientWidth,height:O.clientHeight};E.width=Math.round(t.width*e),E.height=Math.round(t.height*e),E.style.width=`${t.width}px`,E.style.height=`${t.height}px`,D=E.getContext(`2d`),D&&(D.scale(e,e),D.lineCap=`round`,D.lineJoin=`round`,D.lineWidth=22)}function mt(){let e=h(at,ot,{dataUrl:null});if(!e.dataUrl||!E||!D)return;let t=new Image;t.onload=()=>{if(!D||!E)return;let e=Math.min(window.devicePixelRatio||1,2);D.drawImage(t,0,0,E.width/e,E.height/e)},t.src=e.dataUrl}function ht(){if(E)try{g(at,ot,{dataUrl:E.toDataURL(`image/png`)})}catch{}}function gt(e){let t=E,n=t.getBoundingClientRect(),r=n.width===0?1:t.clientWidth/n.width,i=n.height===0?1:t.clientHeight/n.height;return{x:(e.clientX-n.left)*r,y:(e.clientY-n.top)*i}}function _t(e){let t=e;if(t.preventDefault(),!E||!D)return;try{E.setPointerCapture(t.pointerId)}catch{}k=!0;let{x:n,y:r}=gt(t);ct=n,lt=r,D.strokeStyle=st,D.fillStyle=st,D.beginPath(),D.arc(n,r,D.lineWidth/2,0,Math.PI*2),D.fill()}function vt(e){if(!k||!D)return;let{x:t,y:n}=gt(e);D.beginPath(),D.moveTo(ct,lt),D.lineTo(t,n),D.stroke(),ct=t,lt=n}function yt(e){if(!k)return;k=!1;let t=e;if(E&&t.pointerId!==void 0)try{E.releasePointerCapture(t.pointerId)}catch{}ht()}function bt(){if(!E||!D||!O)return;let e=E.toDataURL(`image/png`),t=document.createElement(`img`);t.src=e,t.className=`malen-crumple-overlay`,t.style.width=E.style.width,t.style.height=E.style.height,O.appendChild(t);let n=Math.min(window.devicePixelRatio||1,2);D.clearRect(0,0,E.width/n,E.height/n),g(at,ot,{dataUrl:null}),d(300),t.offsetWidth,t.classList.add(`crumpling`),window.setTimeout(()=>{t.remove()},550)}function xt(){ut.forEach(e=>e()),ut=[],dt?.disconnect(),dt=null,A!==null&&(window.clearTimeout(A),A=null),E=null,D=null,O=null}var St={id:`malen`,accent:`#7ea3c9`,tileIcon:rt,mount:ft,unmount:xt},Ct=`
<svg viewBox="0 0 120 120" width="100%" height="100%">
  <rect x="30" y="70" width="60" height="26" rx="8" fill="#7fb99e"/>
  <rect x="38" y="42" width="44" height="26" rx="8" fill="#f4a56b"/>
  <rect x="46" y="16" width="28" height="24" rx="8" fill="#e88a9a"/>
</svg>`,wt=[{shape:`square`,color:`#e88a9a`},{shape:`round`,color:`#7fb99e`},{shape:`wide`,color:`#f4c86b`},{shape:`peak`,color:`#7ea3c9`},{shape:`tall`,color:`#e0a458`}],Tt={square:78,round:78,wide:108,peak:78,tall:60},Et=52,Dt=`steine`,Ot=1,M=[],N=null,P=null,F=[];function kt(e,t,n){e.addEventListener(t,n),F.push(()=>e.removeEventListener(t,n))}function I(){g(Dt,Ot,{towers:M})}function At(e){let t=Tt[e.shape],n=e.shape===`tall`?4:8,r=e.shape===`peak`?`<div class="steine-roof" style="border-bottom-color:${e.color}"></div>`:``,i=e.shape===`round`?`50px`:`14px`;return`
    <div class="steine-block-body" style="width:${t}px;height:${Et}px;background:${e.color};border-radius:${i};">
      ${r}
      <div class="steine-face" style="gap:${n}px;">
        <div class="steine-eyes"><span></span><span></span></div>
        <div class="steine-mouth"></div>
      </div>
    </div>
  `}function jt(e){F=[],M=h(Dt,Ot,{towers:[]}).towers,e.innerHTML=`
    <div class="steine-stage" id="steineStage">
      <div class="steine-floor"></div>
      <div class="steine-towers" id="steineTowers"></div>
      <div class="steine-shelf" id="steineShelf">
        ${wt.map((e,t)=>`
          <div class="steine-shelf-item" data-shape-index="${t}">
            ${At(e)}
          </div>
        `).join(``)}
      </div>
      <button class="steine-clear" id="steineClear" aria-hidden="true">
        <svg viewBox="0 0 48 48" width="30" height="30">
          <line x1="38" y1="6" x2="20" y2="24" stroke="#a9835e" stroke-width="4" stroke-linecap="round"/>
          <path d="M20 24 L8 30 A20 20 0 0 0 30 40 Z" fill="#e0a458" stroke="#8a7255" stroke-width="2.5" stroke-linejoin="round"/>
          <path d="M12 32 L16 39 M18 28 L22 36 M24 26 L27 34" stroke="#fdf6ea" stroke-width="1.6" stroke-linecap="round"/>
        </svg>
      </button>
    </div>
  `,N=e.querySelector(`#steineStage`),P=e.querySelector(`#steineTowers`),L(),Ft(e),Bt(e)}function L(){P&&(P.innerHTML=``,M.forEach((e,t)=>{let n=document.createElement(`div`);n.className=`steine-tower`+(e.toppled?` toppled`:``),n.style.left=`${e.xPct}%`,n.style.setProperty(`--topple-dir`,String(e.toppleDir));let r=document.createElement(`div`);r.className=`steine-stack`,e.blocks.forEach(e=>{let t=document.createElement(`div`);t.className=`steine-placed-block`,t.innerHTML=At(e),r.appendChild(t)}),n.appendChild(r),P.appendChild(n),Nt(n,t)}))}var Mt=45;function Nt(e,t){let n=0,r=0,i=0;e.addEventListener(`pointerdown`,t=>{let a=t;a.preventDefault(),a.stopPropagation(),n=a.clientX,r=a.clientY,i=0;try{e.setPointerCapture(a.pointerId)}catch{}}),e.addEventListener(`pointermove`,e=>{let t=e;i=Math.max(i,Math.hypot(t.clientX-n,t.clientY-r))}),e.addEventListener(`pointerup`,r=>{let a=r;try{e.releasePointerCapture(a.pointerId)}catch{}let o=M[t];if(!o)return;let s=i>Mt;if(o.toppled){s||(o.toppled=!1,I(),L(),d(600));return}s?(o.toppled=!0,o.toppleDir=a.clientX-n>=0?1:-1,I(),L(),m()):Pt(e)}),e.addEventListener(`pointercancel`,t=>{let n=t;try{e.releasePointerCapture(n.pointerId)}catch{}})}function Pt(e){e.classList.remove(`wobble`),e.offsetWidth,e.classList.add(`wobble`),[0,90,180].forEach((e,t)=>{window.setTimeout(()=>{u({freq:500+t*120,duration:.08,attack:.005,release:.1,type:`triangle`,gain:.22})},e)}),window.setTimeout(()=>e.classList.remove(`wobble`),700)}function Ft(e){e.querySelectorAll(`.steine-shelf-item`).forEach((e,t)=>{kt(e,`pointerdown`,n=>It(n,e,t))})}function It(e,t,n){if(e.preventDefault(),!N)return;try{t.setPointerCapture(e.pointerId)}catch{}let r=wt[n],i=document.createElement(`div`);i.className=`steine-floating-block`,i.innerHTML=At(r),N.appendChild(i);let a=(e,t)=>{let n=N.getBoundingClientRect();i.style.left=`${e-n.left}px`,i.style.top=`${t-n.top}px`};a(e.clientX,e.clientY),d(420);let o=!1;function s(e){let t=e;a(t.clientX,t.clientY)}function c(e){if(o)return;o=!0;let n=e;try{t.releasePointerCapture(n.pointerId)}catch{}t.removeEventListener(`pointermove`,s),t.removeEventListener(`pointerup`,c),t.removeEventListener(`pointercancel`,c),i.remove(),zt(r,n.clientX,n.clientY)}t.addEventListener(`pointermove`,s),t.addEventListener(`pointerup`,c),t.addEventListener(`pointercancel`,c)}var Lt=55,Rt=90;function zt(e,t,n){if(!N)return;let r=N.getBoundingClientRect(),i=(t-r.left)/r.width*100,a=r.height-24,o=null;for(let e of M){if(e.toppled)continue;let i=r.left+e.xPct/100*r.width,s=r.top+a-e.blocks.length*Et;if(Math.abs(t-i)<Lt&&Math.abs(n-s)<Rt){o=e;break}}if(o)o.blocks.push(e),Ht(o.blocks.length);else{let t=Math.max(10,Math.min(90,i));M.push({xPct:t,blocks:[e],toppled:!1,toppleDir:1}),Ht(1)}I(),L()}function Bt(e){kt(e.querySelector(`#steineClear`),`pointerdown`,e=>{e.preventDefault(),M.length!==0&&Vt()})}function Vt(){if(!P)return;let e=[...P.querySelectorAll(`.steine-tower`)];e.forEach((e,t)=>{e.style.transitionDelay=`${t*45}ms`,e.offsetWidth,e.classList.add(`wegfegen`)}),m(),window.setTimeout(()=>{M=[],I(),L()},500+e.length*45)}function Ht(e){u({freq:Math.max(140,240-e*10),duration:.08,attack:.004,release:.12,type:`sine`,gain:.3})}function Ut(){F.forEach(e=>e()),F=[],N=null,P=null,M=[]}var Wt={id:`steine`,accent:`#7fb99e`,tileIcon:Ct,mount:jt,unmount:Ut},Gt=`
<svg viewBox="0 0 120 120" width="100%" height="100%">
  <circle cx="48" cy="46" r="26" fill="none" stroke="#7ec8d8" stroke-width="5"/>
  <circle cx="40" cy="38" r="7" fill="#bfe6ee"/>
  <circle cx="84" cy="72" r="17" fill="none" stroke="#a8d8e0" stroke-width="4"/>
  <circle cx="79" cy="67" r="5" fill="#d6f0f5"/>
  <circle cx="42" cy="90" r="11" fill="none" stroke="#c8b6e0" stroke-width="4"/>
</svg>`,Kt=[`rgba(126, 200, 216, 0.55)`,`rgba(200, 182, 224, 0.55)`,`rgba(244, 200, 107, 0.45)`,`rgba(232, 138, 154, 0.45)`,`rgba(127, 185, 158, 0.5)`],qt=14,Jt=900,R=null,z=[],B=null,Yt=[];function Xt(e,t,n){e.addEventListener(t,n),z.push(()=>e.removeEventListener(t,n))}function Zt(e){z=[],Yt=[],e.innerHTML=`
    <div class="blasen-stage" id="blasenStage">
      <div class="blasen-layer" id="blasenLayer"></div>
      <div class="blasen-wand" id="blasenWand">
        <div class="wand-ring"></div>
        <div class="wand-stick"></div>
      </div>
    </div>
  `,R=e.querySelector(`#blasenLayer`);let t=e.querySelector(`#blasenWand`);for(let e=0;e<6;e++)Qt(.3+Math.random()*.5);B=window.setInterval(()=>Qt(),Jt),z.push(()=>{B!==null&&window.clearInterval(B),B=null}),Xt(R,`pointerdown`,e=>{let t=e,n=t.target.closest(`.blase`);n&&(t.preventDefault(),$t(n))}),Xt(t,`pointerdown`,e=>{e.preventDefault(),t.classList.remove(`puff`),t.offsetWidth,t.classList.add(`puff`);for(let e=0;e<5;e++)window.setTimeout(()=>Qt(0,!0),e*110);u({freq:220,duration:.28,attack:.06,release:.35,type:`sine`,gain:.12})})}function Qt(e=0,t=!1){if(!R||R.childElementCount>=qt)return;let n=42+Math.random()*58,r=Kt[Math.floor(Math.random()*Kt.length)],i=t?14+Math.random()*16:6+Math.random()*88,a=(Math.random()*2-1)*40,o=9e3+Math.random()*5e3,s=document.createElement(`div`);s.className=`blase`,s.style.width=`${n}px`,s.style.height=`${n}px`,s.style.left=`${i}%`,s.style.setProperty(`--tint`,r),s.style.setProperty(`--drift`,`${a}px`),s.style.animationDuration=`${o}ms`,s.style.animationDelay=`${-e*o}ms`,s.innerHTML=`<span class="blase-glanz"></span>`,s.addEventListener(`animationend`,()=>s.remove()),R.appendChild(s)}function $t(e){if(e.classList.contains(`platzt`))return;e.classList.add(`platzt`);let t=l[Math.floor(Math.random()*l.length)];u({freq:t*2,duration:.06,attack:.002,release:.16,type:`sine`,gain:.22});let n=window.setTimeout(()=>e.remove(),340);Yt.push(n)}function en(){z.forEach(e=>e()),z=[],B!==null&&(window.clearInterval(B),B=null),Yt.forEach(e=>window.clearTimeout(e)),Yt=[],R=null}var tn={id:`blasen`,accent:`#7ec8d8`,tileIcon:Gt,mount:Zt,unmount:en},nn=`
<svg viewBox="0 0 120 120" width="100%" height="100%">
  <rect x="22" y="30" width="76" height="58" rx="10" fill="#cbb98a"/>
  <rect x="30" y="38" width="60" height="42" rx="6" fill="#bfe6ee"/>
  <path d="M34 74 L54 46" stroke="#fffaf2" stroke-width="9" stroke-linecap="round"/>
  <path d="M52 76 L70 52" stroke="#fffaf2" stroke-width="7" stroke-linecap="round"/>
  <circle cx="84" cy="92" r="13" fill="#7ec8d8"/>
</svg>`,V=[{clean:`<svg viewBox="0 0 200 200">
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
    </svg>`,dirt:`#7d6b52`,fleck:`#5f5040`}],rn=34,an=.82,H=null,U=null,W=null,G=0,on=!1,sn=[],K=null,cn=null,ln=[],q=new Map;function J(e,t,n){e.addEventListener(t,n),sn.push(()=>e.removeEventListener(t,n))}function un(e){sn=[],q.clear(),ln=[],G=0,on=!1,e.innerHTML=`
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
  `,W=e.querySelector(`#putzenStage`),H=e.querySelector(`#putzenCanvas`),dn(e,0),J(H,`pointerdown`,hn),J(H,`pointermove`,gn),J(H,`pointerup`,_n),J(H,`pointercancel`,_n),J(e.querySelector(`#putzenNext`),`pointerdown`,t=>{t.preventDefault(),dn(e,G+1),m()});let t=W.clientWidth,n=W.clientHeight,r=()=>{if(!W)return;let e=W.clientWidth,r=W.clientHeight;(e!==t||r!==n)&&(t=e,n=r,K!==null&&window.clearTimeout(K),K=window.setTimeout(()=>fn(),220))};cn=new ResizeObserver(r),cn.observe(W),J(window,`resize`,r),J(window,`orientationchange`,r)}function dn(e,t){G=(t%V.length+V.length)%V.length,on=!1,W?.classList.remove(`sauber`);let n=e.querySelector(`#putzenMotiv`);n.innerHTML=V[G].clean,fn()}function fn(){if(!H||!W)return;let e=Math.min(window.devicePixelRatio||1,2),t=W.clientWidth,n=W.clientHeight;H.width=Math.round(t*e),H.height=Math.round(n*e),H.style.width=`${t}px`,H.style.height=`${n}px`,U=H.getContext(`2d`,{willReadFrequently:!0}),U&&(U.scale(e,e),pn(t,n))}function pn(e,t){if(!U)return;let n=V[G];U.globalCompositeOperation=`source-over`,U.clearRect(0,0,e,t),U.fillStyle=n.dirt,U.fillRect(0,0,e,t),U.fillStyle=n.fleck;for(let n=0;n<140;n++){let n=Math.random()*e,r=Math.random()*t,i=6+Math.random()*26;U.globalAlpha=.18+Math.random()*.3,U.beginPath(),U.ellipse(n,r,i,i*(.6+Math.random()*.7),Math.random()*Math.PI,0,Math.PI*2),U.fill()}U.globalAlpha=1}function mn(e){let t=H,n=t.getBoundingClientRect(),r=n.width===0?1:t.clientWidth/n.width,i=n.height===0?1:t.clientHeight/n.height;return{x:(e.clientX-n.left)*r,y:(e.clientY-n.top)*i}}function hn(e){let t=e;if(t.preventDefault(),!H||!U)return;try{H.setPointerCapture(t.pointerId)}catch{}let n=mn(t);q.set(t.pointerId,n),vn(n.x,n.y),xn()}function gn(e){let t=e,n=q.get(t.pointerId);if(!n||!U)return;let r=mn(t);yn(n.x,n.y,r.x,r.y),q.set(t.pointerId,r),xn()}function _n(e){let t=e;if(q.has(t.pointerId)){if(q.delete(t.pointerId),H)try{H.releasePointerCapture(t.pointerId)}catch{}Cn()}}function vn(e,t){U&&(U.globalCompositeOperation=`destination-out`,U.beginPath(),U.arc(e,t,rn,0,Math.PI*2),U.fill())}function yn(e,t,n,r){U&&(U.globalCompositeOperation=`destination-out`,U.lineCap=`round`,U.lineJoin=`round`,U.lineWidth=68,U.beginPath(),U.moveTo(e,t),U.lineTo(n,r),U.stroke())}var bn=0;function xn(){let e=performance.now();e-bn<130||(bn=e,u({freq:180+Math.random()*90,duration:.05,attack:.01,release:.1,type:`triangle`,gain:.07}))}function Sn(){if(!H||!U)return 0;let e=0,t=0,n=H.width/24,r=H.height/24;for(let i=0;i<24;i++)for(let a=0;a<24;a++){let o=Math.min(H.width-1,Math.floor(i*n+n/2)),s=Math.min(H.height-1,Math.floor(a*r+r/2));U.getImageData(o,s,1,1).data[3]<40&&e++,t++}return t===0?0:e/t}function Cn(){if(!on&&!(Sn()<an)){if(on=!0,U&&H){let e=Math.min(window.devicePixelRatio||1,2);U.globalCompositeOperation=`destination-out`,U.fillStyle=`#000`,U.fillRect(0,0,H.width/e,H.height/e)}W?.classList.add(`sauber`),[0,130,260].forEach((e,t)=>{let n=window.setTimeout(()=>{u({freq:l[t+3],duration:.3,attack:.01,release:.5,gain:.24})},e);ln.push(n)})}}function wn(){sn.forEach(e=>e()),sn=[],cn?.disconnect(),cn=null,K!==null&&(window.clearTimeout(K),K=null),ln.forEach(e=>window.clearTimeout(e)),ln=[],q.clear(),H=null,U=null,W=null}var Tn={id:`putzen`,accent:`#7ec8d8`,tileIcon:nn,mount:un,unmount:wn};oe();var En=[He,nt,St,Wt,tn,Tn],Dn=document.querySelector(`#app`),On=`
  <svg viewBox="0 0 96 96" width="40" height="40">
    <path d="M56 26 L34 48 L56 70" fill="none" stroke="#8a7255" stroke-width="8"
      stroke-linecap="round" stroke-linejoin="round"/>
  </svg>
`,kn=18,An=2*Math.PI*kn;Dn.innerHTML=`
  <div class="spielzimmer" id="spielzimmer">
    <div class="tiles" id="tiles"></div>
    <button class="eltern-gate" id="elternGate" aria-hidden="true">${`
  <svg viewBox="0 0 44 44">
    <circle cx="22" cy="22" r="${kn}" fill="none" stroke="#8a7255" stroke-width="3" opacity="0.25"/>
    <circle class="eltern-gate-progress" cx="22" cy="22" r="${kn}" fill="none"
      stroke="#8a7255" stroke-width="3" stroke-linecap="round"
      stroke-dasharray="${An}" stroke-dashoffset="${An}"
      transform="rotate(-90 22 22)"/>
    <circle cx="22" cy="22" r="4" fill="#8a7255"/>
  </svg>
`}</button>
  </div>
  <div class="toy-view" id="toyView">
    <div class="toy-stage" id="toyStage"></div>
  </div>
  <button class="back-button" id="backButton" aria-hidden="true">${On}</button>
  <div class="eltern-overlay" id="elternOverlay">
    <div id="elternPanelWrap"></div>
  </div>
  <div class="version-placeholder">v1.0.0 · 3a3edc8</div>
`;var jn=document.querySelector(`#spielzimmer`),Mn=document.querySelector(`#tiles`),Nn=document.querySelector(`#toyView`),Pn=document.querySelector(`#toyStage`),Fn=document.querySelector(`#backButton`),Y=document.querySelector(`#elternGate`),X=document.querySelector(`#elternOverlay`),In=document.querySelector(`#elternPanelWrap`),Z=null,Q=!1;function Ln(){Mn.innerHTML=``,En.forEach((e,t)=>{let n=document.createElement(`button`);n.className=`tile`,n.style.setProperty(`--accent`,e.accent),n.style.animationDelay=`${(t*.7%4.5).toFixed(2)}s`,n.innerHTML=e.tileIcon,n.setAttribute(`aria-hidden`,`true`),n.addEventListener(`pointerdown`,t=>{t.preventDefault(),Rn(e)}),Mn.appendChild(n)})}function Rn(e){Q||Z||(Q=!0,Z=e,e.mount(Pn),jn.classList.add(`hidden`),Fn.classList.add(`visible`),Nn.classList.add(`active`),window.setTimeout(()=>{Q=!1},450))}function zn(){Q||!Z||(Q=!0,Nn.classList.remove(`active`),jn.classList.remove(`hidden`),Fn.classList.remove(`visible`),window.setTimeout(()=>{Z?.unmount?.(),Pn.innerHTML=``,Z=null,Q=!1},450))}Fn.addEventListener(`pointerdown`,e=>{e.preventDefault(),zn()});var Bn=3e3,$=null;function Vn(){$===null&&(Y.classList.add(`charging`),$=window.setTimeout(()=>{$=null,Y.classList.remove(`charging`),Un()},Bn))}function Hn(){$!==null&&(window.clearTimeout($),$=null),Y.classList.remove(`charging`)}Y.addEventListener(`pointerdown`,e=>{e.preventDefault(),Vn()}),Y.addEventListener(`pointerup`,Hn),Y.addEventListener(`pointercancel`,Hn),Y.addEventListener(`pointerleave`,Hn);function Un(){ce(In),X.classList.add(`active`)}function Wn(){X.classList.remove(`active`)}X.addEventListener(`pointerdown`,e=>{e.target===X&&Wn()}),document.addEventListener(`click`,e=>{e.target.closest(`.eltern-close`)&&Wn()}),document.addEventListener(`gesturestart`,e=>e.preventDefault()),document.addEventListener(`gesturechange`,e=>e.preventDefault()),document.addEventListener(`dblclick`,e=>e.preventDefault()),document.addEventListener(`contextmenu`,e=>e.preventDefault());var Gn=!1;document.addEventListener(`pointerdown`,()=>{i(),Gn||(Gn=!0,window.setTimeout(()=>{c()&&u({freq:523.25,duration:.15,gain:.25})},80))},{once:!1}),Ln();