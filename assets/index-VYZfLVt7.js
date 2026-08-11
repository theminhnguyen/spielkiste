(function(){let e=document.createElement(`link`).relList;if(e&&e.supports&&e.supports(`modulepreload`))return;for(let e of document.querySelectorAll(`link[rel="modulepreload"]`))n(e);new MutationObserver(e=>{for(let t of e)if(t.type===`childList`)for(let e of t.addedNodes)e.tagName===`LINK`&&e.rel===`modulepreload`&&n(e)}).observe(document,{childList:!0,subtree:!0});function t(e){let t={};return e.integrity&&(t.integrity=e.integrity),e.referrerPolicy&&(t.referrerPolicy=e.referrerPolicy),t.credentials=e.crossOrigin===`use-credentials`?`include`:e.crossOrigin===`anonymous`?`omit`:`same-origin`,t}function n(e){if(e.ep)return;e.ep=!0;let n=t(e);fetch(e.href,n)}})();var e=null,t=null,n=!1;function r(){if(e)return e;let n=window.AudioContext??window.webkitAudioContext;return n?(e=new n,t=e.createGain(),t.gain.value=o(),t.connect(e.destination),e):null}function i(){if(n)return;let e=r();e&&(e.state===`suspended`&&e.resume().catch(()=>{}),n=!0)}var a=.6;function o(){return a}function s(e){a=Math.max(0,Math.min(1,e)),t&&(t.gain.value=a)}function c(){return!!e&&e.state===`running`}var l=[261.63,293.66,329.63,392,440,523.25,587.33,659.25];function u(n){let r=e;if(!r||!t||r.state!==`running`)return;let{freq:i,duration:a=.5,attack:o=.02,release:s=.35,type:c=`sine`,gain:l=.5}=n,u=r.createOscillator();u.type=c,u.frequency.value=i;let d=r.createGain();d.gain.setValueAtTime(0,r.currentTime),d.gain.linearRampToValueAtTime(l,r.currentTime+o),d.gain.linearRampToValueAtTime(0,r.currentTime+o+a+s),u.connect(d),d.connect(t),u.start(),u.stop(r.currentTime+o+a+s+.05)}function d(e=440){u({freq:e,duration:.03,attack:.002,release:.08,type:`triangle`,gain:.3})}function ee(n,r=.28){let i=e;if(!i||!t||i.state!==`running`)return null;let a=i.createOscillator();a.type=`sine`,a.frequency.value=n;let o=i.createGain();o.gain.setValueAtTime(0,i.currentTime),o.gain.linearRampToValueAtTime(r,i.currentTime+.05),a.connect(o),o.connect(t),a.start();let s=!1;return{update(e){s||a.frequency.linearRampToValueAtTime(e,i.currentTime+.06)},stop(){s||(s=!0,o.gain.cancelScheduledValues(i.currentTime),o.gain.setValueAtTime(o.gain.value,i.currentTime),o.gain.linearRampToValueAtTime(0,i.currentTime+.15),a.stop(i.currentTime+.2))}}}var f=null;function te(e){if(f)return f;let t=e.sampleRate*.5,n=e.createBuffer(1,t,e.sampleRate),r=n.getChannelData(0);for(let e=0;e<t;e++)r[e]=Math.random()*2-1;return f=n,n}function p(n){let r=e;if(!r||!t||r.state!==`running`)return;let i=r.createBufferSource();i.buffer=te(r);let a=r.createBiquadFilter();a.type=`bandpass`,a.Q.value=8;let o=n?700:2200,s=n?2200:700;a.frequency.setValueAtTime(o,r.currentTime),a.frequency.linearRampToValueAtTime(s,r.currentTime+.35);let c=r.createGain();c.gain.setValueAtTime(0,r.currentTime),c.gain.linearRampToValueAtTime(.18,r.currentTime+.03),c.gain.linearRampToValueAtTime(0,r.currentTime+.38),i.connect(a),a.connect(c),c.connect(t),i.start(),i.stop(r.currentTime+.4)}function m(){let n=e;if(!n||!t||n.state!==`running`)return;let r=n.createBufferSource();r.buffer=te(n);let i=n.createBiquadFilter();i.type=`lowpass`,i.frequency.setValueAtTime(300,n.currentTime),i.frequency.linearRampToValueAtTime(1400,n.currentTime+.25);let a=n.createGain();a.gain.setValueAtTime(0,n.currentTime),a.gain.linearRampToValueAtTime(.14,n.currentTime+.05),a.gain.linearRampToValueAtTime(0,n.currentTime+.3),r.connect(i),i.connect(a),a.connect(t),r.start(),r.stop(n.currentTime+.32)}var ne=`spielkiste:`;function h(e,t,n){try{let r=localStorage.getItem(ne+e);if(!r)return n;let i=JSON.parse(r);return i.v===t?i.data:n}catch{return n}}function g(e,t,n){try{let r={v:t,data:n};localStorage.setItem(ne+e,JSON.stringify(r))}catch{}}function re(){try{let e=[];for(let t=0;t<localStorage.length;t++){let n=localStorage.key(t);n?.startsWith(ne)&&e.push(n)}e.forEach(e=>localStorage.removeItem(e))}catch{}}var ie=`settings`,ae=1;function oe(){s(h(ie,ae,{volume:.6}).volume)}function se(e){g(ie,ae,{volume:e})}function ce(e){e.innerHTML=`
    <div class="eltern-panel">
      <h1>Spielkiste</h1>
      <p class="eltern-version">Version 1.0.0 · 82a8bea</p>

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
</svg>`,wt=[{shape:`square`,color:`#e88a9a`},{shape:`round`,color:`#7fb99e`},{shape:`wide`,color:`#f4c86b`},{shape:`peak`,color:`#7ea3c9`},{shape:`tall`,color:`#e0a458`}],Tt={square:78,round:78,wide:108,peak:78,tall:60},Et=52,Dt=`steine`,Ot=1,M=[],N=null,P=null,kt=[];function At(e,t,n){e.addEventListener(t,n),kt.push(()=>e.removeEventListener(t,n))}function jt(){g(Dt,Ot,{towers:M})}function Mt(e){let t=Tt[e.shape],n=e.shape===`tall`?4:8,r=e.shape===`peak`?`<div class="steine-roof" style="border-bottom-color:${e.color}"></div>`:``,i=e.shape===`round`?`50px`:`14px`;return`
    <div class="steine-block-body" style="width:${t}px;height:${Et}px;background:${e.color};border-radius:${i};">
      ${r}
      <div class="steine-face" style="gap:${n}px;">
        <div class="steine-eyes"><span></span><span></span></div>
        <div class="steine-mouth"></div>
      </div>
    </div>
  `}function Nt(e){kt=[],M=h(Dt,Ot,{towers:[]}).towers,e.innerHTML=`
    <div class="steine-stage" id="steineStage">
      <div class="steine-floor"></div>
      <div class="steine-towers" id="steineTowers"></div>
      <div class="steine-shelf" id="steineShelf">
        ${wt.map((e,t)=>`
          <div class="steine-shelf-item" data-shape-index="${t}">
            ${Mt(e)}
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
  `,N=e.querySelector(`#steineStage`),P=e.querySelector(`#steineTowers`),F(),Lt(e),Ht(e)}function F(){P&&(P.innerHTML=``,M.forEach((e,t)=>{let n=document.createElement(`div`);n.className=`steine-tower`+(e.toppled?` toppled`:``),n.style.left=`${e.xPct}%`,n.style.setProperty(`--topple-dir`,String(e.toppleDir));let r=document.createElement(`div`);r.className=`steine-stack`,e.blocks.forEach(e=>{let t=document.createElement(`div`);t.className=`steine-placed-block`,t.innerHTML=Mt(e),r.appendChild(t)}),n.appendChild(r),P.appendChild(n),Ft(n,t)}))}var Pt=45;function Ft(e,t){let n=0,r=0,i=0;e.addEventListener(`pointerdown`,t=>{let a=t;a.preventDefault(),a.stopPropagation(),n=a.clientX,r=a.clientY,i=0;try{e.setPointerCapture(a.pointerId)}catch{}}),e.addEventListener(`pointermove`,e=>{let t=e;i=Math.max(i,Math.hypot(t.clientX-n,t.clientY-r))}),e.addEventListener(`pointerup`,r=>{let a=r;try{e.releasePointerCapture(a.pointerId)}catch{}let o=M[t];if(!o)return;let s=i>Pt;if(o.toppled){s||(o.toppled=!1,jt(),F(),d(600));return}s?(o.toppled=!0,o.toppleDir=a.clientX-n>=0?1:-1,jt(),F(),m()):It(e)}),e.addEventListener(`pointercancel`,t=>{let n=t;try{e.releasePointerCapture(n.pointerId)}catch{}})}function It(e){e.classList.remove(`wobble`),e.offsetWidth,e.classList.add(`wobble`),[0,90,180].forEach((e,t)=>{window.setTimeout(()=>{u({freq:500+t*120,duration:.08,attack:.005,release:.1,type:`triangle`,gain:.22})},e)}),window.setTimeout(()=>e.classList.remove(`wobble`),700)}function Lt(e){e.querySelectorAll(`.steine-shelf-item`).forEach((e,t)=>{At(e,`pointerdown`,n=>Rt(n,e,t))})}function Rt(e,t,n){if(e.preventDefault(),!N)return;try{t.setPointerCapture(e.pointerId)}catch{}let r=wt[n],i=document.createElement(`div`);i.className=`steine-floating-block`,i.innerHTML=Mt(r),N.appendChild(i);let a=(e,t)=>{let n=N.getBoundingClientRect();i.style.left=`${e-n.left}px`,i.style.top=`${t-n.top}px`};a(e.clientX,e.clientY),d(420);let o=!1;function s(e){let t=e;a(t.clientX,t.clientY)}function c(e){if(o)return;o=!0;let n=e;try{t.releasePointerCapture(n.pointerId)}catch{}t.removeEventListener(`pointermove`,s),t.removeEventListener(`pointerup`,c),t.removeEventListener(`pointercancel`,c),i.remove(),Vt(r,n.clientX,n.clientY)}t.addEventListener(`pointermove`,s),t.addEventListener(`pointerup`,c),t.addEventListener(`pointercancel`,c)}var zt=55,Bt=90;function Vt(e,t,n){if(!N)return;let r=N.getBoundingClientRect(),i=(t-r.left)/r.width*100,a=r.height-24,o=null;for(let e of M){if(e.toppled)continue;let i=r.left+e.xPct/100*r.width,s=r.top+a-e.blocks.length*Et;if(Math.abs(t-i)<zt&&Math.abs(n-s)<Bt){o=e;break}}if(o)o.blocks.push(e),Wt(o.blocks.length);else{let t=Math.max(10,Math.min(90,i));M.push({xPct:t,blocks:[e],toppled:!1,toppleDir:1}),Wt(1)}jt(),F()}function Ht(e){At(e.querySelector(`#steineClear`),`pointerdown`,e=>{e.preventDefault(),M.length!==0&&Ut()})}function Ut(){if(!P)return;let e=[...P.querySelectorAll(`.steine-tower`)];e.forEach((e,t)=>{e.style.transitionDelay=`${t*45}ms`,e.offsetWidth,e.classList.add(`wegfegen`)}),m(),window.setTimeout(()=>{M=[],jt(),F()},500+e.length*45)}function Wt(e){u({freq:Math.max(140,240-e*10),duration:.08,attack:.004,release:.12,type:`sine`,gain:.3})}function Gt(){kt.forEach(e=>e()),kt=[],N=null,P=null,M=[]}var Kt={id:`steine`,accent:`#7fb99e`,tileIcon:Ct,mount:Nt,unmount:Gt},qt=`
<svg viewBox="0 0 120 120" width="100%" height="100%">
  <circle cx="48" cy="46" r="26" fill="none" stroke="#7ec8d8" stroke-width="5"/>
  <circle cx="40" cy="38" r="7" fill="#bfe6ee"/>
  <circle cx="84" cy="72" r="17" fill="none" stroke="#a8d8e0" stroke-width="4"/>
  <circle cx="79" cy="67" r="5" fill="#d6f0f5"/>
  <circle cx="42" cy="90" r="11" fill="none" stroke="#c8b6e0" stroke-width="4"/>
</svg>`,Jt=[`rgba(126, 200, 216, 0.55)`,`rgba(200, 182, 224, 0.55)`,`rgba(244, 200, 107, 0.45)`,`rgba(232, 138, 154, 0.45)`,`rgba(127, 185, 158, 0.5)`],Yt=14,Xt=900,I=null,L=[],R=null,Zt=[];function Qt(e,t,n){e.addEventListener(t,n),L.push(()=>e.removeEventListener(t,n))}function $t(e){L=[],Zt=[],e.innerHTML=`
    <div class="blasen-stage" id="blasenStage">
      <div class="blasen-layer" id="blasenLayer"></div>
      <div class="blasen-wand" id="blasenWand">
        <div class="wand-ring"></div>
        <div class="wand-stick"></div>
      </div>
    </div>
  `,I=e.querySelector(`#blasenLayer`);let t=e.querySelector(`#blasenWand`);for(let e=0;e<6;e++)en(.3+Math.random()*.5);R=window.setInterval(()=>en(),Xt),L.push(()=>{R!==null&&window.clearInterval(R),R=null}),Qt(I,`pointerdown`,e=>{let t=e,n=t.target.closest(`.blase`);n&&(t.preventDefault(),tn(n))}),Qt(t,`pointerdown`,e=>{e.preventDefault(),t.classList.remove(`puff`),t.offsetWidth,t.classList.add(`puff`);for(let e=0;e<5;e++)window.setTimeout(()=>en(0,!0),e*110);u({freq:220,duration:.28,attack:.06,release:.35,type:`sine`,gain:.12})})}function en(e=0,t=!1){if(!I||I.childElementCount>=Yt)return;let n=42+Math.random()*58,r=Jt[Math.floor(Math.random()*Jt.length)],i=t?14+Math.random()*16:6+Math.random()*88,a=(Math.random()*2-1)*40,o=9e3+Math.random()*5e3,s=document.createElement(`div`);s.className=`blase`,s.style.width=`${n}px`,s.style.height=`${n}px`,s.style.left=`${i}%`,s.style.setProperty(`--tint`,r),s.style.setProperty(`--drift`,`${a}px`),s.style.animationDuration=`${o}ms`,s.style.animationDelay=`${-e*o}ms`,s.innerHTML=`<span class="blase-glanz"></span>`,s.addEventListener(`animationend`,()=>s.remove()),I.appendChild(s)}function tn(e){if(e.classList.contains(`platzt`))return;e.classList.add(`platzt`);let t=l[Math.floor(Math.random()*l.length)];u({freq:t*2,duration:.06,attack:.002,release:.16,type:`sine`,gain:.22});let n=window.setTimeout(()=>e.remove(),340);Zt.push(n)}function nn(){L.forEach(e=>e()),L=[],R!==null&&(window.clearInterval(R),R=null),Zt.forEach(e=>window.clearTimeout(e)),Zt=[],I=null}var rn={id:`blasen`,accent:`#7ec8d8`,tileIcon:qt,mount:$t,unmount:nn},an=`
<svg viewBox="0 0 120 120" width="100%" height="100%">
  <rect x="22" y="30" width="76" height="58" rx="10" fill="#cbb98a"/>
  <rect x="30" y="38" width="60" height="42" rx="6" fill="#bfe6ee"/>
  <path d="M34 74 L54 46" stroke="#fffaf2" stroke-width="9" stroke-linecap="round"/>
  <path d="M52 76 L70 52" stroke="#fffaf2" stroke-width="7" stroke-linecap="round"/>
  <circle cx="84" cy="92" r="13" fill="#7ec8d8"/>
</svg>`,z=[{clean:`<svg viewBox="0 0 200 200">
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
    </svg>`,dirt:`#7d6b52`,fleck:`#5f5040`}],on=34,sn=.82,B=null,V=null,H=null,U=0,cn=!1,ln=[],W=null,un=null,dn=[],G=new Map;function K(e,t,n){e.addEventListener(t,n),ln.push(()=>e.removeEventListener(t,n))}function fn(e){ln=[],G.clear(),dn=[],U=0,cn=!1,e.innerHTML=`
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
  `,H=e.querySelector(`#putzenStage`),B=e.querySelector(`#putzenCanvas`),pn(e,0),K(B,`pointerdown`,_n),K(B,`pointermove`,vn),K(B,`pointerup`,yn),K(B,`pointercancel`,yn),K(e.querySelector(`#putzenNext`),`pointerdown`,t=>{t.preventDefault(),pn(e,U+1),m()});let t=H.clientWidth,n=H.clientHeight,r=()=>{if(!H)return;let e=H.clientWidth,r=H.clientHeight;(e!==t||r!==n)&&(t=e,n=r,W!==null&&window.clearTimeout(W),W=window.setTimeout(()=>mn(),220))};un=new ResizeObserver(r),un.observe(H),K(window,`resize`,r),K(window,`orientationchange`,r)}function pn(e,t){U=(t%z.length+z.length)%z.length,cn=!1,H?.classList.remove(`sauber`);let n=e.querySelector(`#putzenMotiv`);n.innerHTML=z[U].clean,mn()}function mn(){if(!B||!H)return;let e=Math.min(window.devicePixelRatio||1,2),t=H.clientWidth,n=H.clientHeight;B.width=Math.round(t*e),B.height=Math.round(n*e),B.style.width=`${t}px`,B.style.height=`${n}px`,V=B.getContext(`2d`,{willReadFrequently:!0}),V&&(V.scale(e,e),hn(t,n))}function hn(e,t){if(!V)return;let n=z[U];V.globalCompositeOperation=`source-over`,V.clearRect(0,0,e,t),V.fillStyle=n.dirt,V.fillRect(0,0,e,t),V.fillStyle=n.fleck;for(let n=0;n<140;n++){let n=Math.random()*e,r=Math.random()*t,i=6+Math.random()*26;V.globalAlpha=.18+Math.random()*.3,V.beginPath(),V.ellipse(n,r,i,i*(.6+Math.random()*.7),Math.random()*Math.PI,0,Math.PI*2),V.fill()}V.globalAlpha=1}function gn(e){let t=B,n=t.getBoundingClientRect(),r=n.width===0?1:t.clientWidth/n.width,i=n.height===0?1:t.clientHeight/n.height;return{x:(e.clientX-n.left)*r,y:(e.clientY-n.top)*i}}function _n(e){let t=e;if(t.preventDefault(),!B||!V)return;try{B.setPointerCapture(t.pointerId)}catch{}let n=gn(t);G.set(t.pointerId,n),bn(n.x,n.y),Cn()}function vn(e){let t=e,n=G.get(t.pointerId);if(!n||!V)return;let r=gn(t);xn(n.x,n.y,r.x,r.y),G.set(t.pointerId,r),Cn()}function yn(e){let t=e;if(G.has(t.pointerId)){if(G.delete(t.pointerId),B)try{B.releasePointerCapture(t.pointerId)}catch{}Tn()}}function bn(e,t){V&&(V.globalCompositeOperation=`destination-out`,V.beginPath(),V.arc(e,t,on,0,Math.PI*2),V.fill())}function xn(e,t,n,r){V&&(V.globalCompositeOperation=`destination-out`,V.lineCap=`round`,V.lineJoin=`round`,V.lineWidth=68,V.beginPath(),V.moveTo(e,t),V.lineTo(n,r),V.stroke())}var Sn=0;function Cn(){let e=performance.now();e-Sn<130||(Sn=e,u({freq:180+Math.random()*90,duration:.05,attack:.01,release:.1,type:`triangle`,gain:.07}))}function wn(){if(!B||!V)return 0;let e=0,t=0,n=B.width/24,r=B.height/24;for(let i=0;i<24;i++)for(let a=0;a<24;a++){let o=Math.min(B.width-1,Math.floor(i*n+n/2)),s=Math.min(B.height-1,Math.floor(a*r+r/2));V.getImageData(o,s,1,1).data[3]<40&&e++,t++}return t===0?0:e/t}function Tn(){if(!cn&&!(wn()<sn)){if(cn=!0,V&&B){let e=Math.min(window.devicePixelRatio||1,2);V.globalCompositeOperation=`destination-out`,V.fillStyle=`#000`,V.fillRect(0,0,B.width/e,B.height/e)}H?.classList.add(`sauber`),[0,130,260].forEach((e,t)=>{let n=window.setTimeout(()=>{u({freq:l[t+3],duration:.3,attack:.01,release:.5,gain:.24})},e);dn.push(n)})}}function En(){ln.forEach(e=>e()),ln=[],un?.disconnect(),un=null,W!==null&&(window.clearTimeout(W),W=null),dn.forEach(e=>window.clearTimeout(e)),dn=[],G.clear(),B=null,V=null,H=null}var Dn={id:`putzen`,accent:`#7ec8d8`,tileIcon:an,mount:fn,unmount:En},On=`
<svg viewBox="0 0 120 120" width="100%" height="100%">
  <rect x="16" y="22" width="88" height="66" rx="10" fill="#dff0e4"/>
  <path d="M16 72 Q40 54 62 72 Q82 56 104 72 L104 88 H16 Z" fill="#9ec99f"/>
  <circle cx="86" cy="40" r="12" fill="#f7d570"/>
  <ellipse cx="46" cy="60" rx="13" ry="11" fill="#e88a9a"/>
  <circle cx="42" cy="57" r="2.5" fill="#4a4032"/>
  <circle cx="50" cy="57" r="2.5" fill="#4a4032"/>
  <path d="M74 92 l7 -13 l7 13 z" fill="#7fb99e"/>
</svg>`,kn=[{id:`hase`,size:82,note:0,svg:`<svg viewBox="0 0 100 100"><ellipse cx="50" cy="64" rx="26" ry="28" fill="#f3e7db"/><ellipse cx="38" cy="24" rx="8" ry="20" fill="#f3e7db"/><ellipse cx="62" cy="24" rx="8" ry="20" fill="#f3e7db"/><ellipse cx="38" cy="26" rx="4" ry="13" fill="#f2b8c6"/><ellipse cx="62" cy="26" rx="4" ry="13" fill="#f2b8c6"/><circle cx="41" cy="60" r="4" fill="#4a4032"/><circle cx="59" cy="60" r="4" fill="#4a4032"/><ellipse cx="50" cy="70" rx="5" ry="3.5" fill="#e88a9a"/></svg>`},{id:`baum`,size:96,note:1,svg:`<svg viewBox="0 0 100 100"><rect x="43" y="58" width="14" height="36" rx="5" fill="#a9835e"/><circle cx="50" cy="40" r="28" fill="#7fb99e"/><circle cx="30" cy="50" r="18" fill="#8fc4a8"/><circle cx="70" cy="50" r="18" fill="#8fc4a8"/></svg>`},{id:`blume`,size:72,note:2,svg:`<svg viewBox="0 0 100 100"><rect x="46" y="52" width="8" height="42" rx="4" fill="#7fb99e"/><ellipse cx="30" cy="62" rx="14" ry="7" fill="#8fc4a8"/><g><ellipse cx="50" cy="26" rx="11" ry="17" fill="#e88a9a"/><ellipse cx="50" cy="26" rx="11" ry="17" fill="#e88a9a" transform="rotate(72 50 40)"/><ellipse cx="50" cy="26" rx="11" ry="17" fill="#e88a9a" transform="rotate(144 50 40)"/><ellipse cx="50" cy="26" rx="11" ry="17" fill="#e88a9a" transform="rotate(216 50 40)"/><ellipse cx="50" cy="26" rx="11" ry="17" fill="#e88a9a" transform="rotate(288 50 40)"/></g><circle cx="50" cy="40" r="10" fill="#f4c86b"/></svg>`},{id:`sonne`,size:78,note:3,svg:`<svg viewBox="0 0 100 100"><g stroke="#f4c86b" stroke-width="7" stroke-linecap="round"><line x1="50" y1="8" x2="50" y2="20"/><line x1="50" y1="80" x2="50" y2="92"/><line x1="8" y1="50" x2="20" y2="50"/><line x1="80" y1="50" x2="92" y2="50"/><line x1="20" y1="20" x2="28" y2="28"/><line x1="72" y1="72" x2="80" y2="80"/><line x1="20" y1="80" x2="28" y2="72"/><line x1="72" y1="28" x2="80" y2="20"/></g><circle cx="50" cy="50" r="24" fill="#f7d570"/><circle cx="42" cy="46" r="3" fill="#c99a3c"/><circle cx="58" cy="46" r="3" fill="#c99a3c"/><path d="M43 56 Q50 62 57 56" stroke="#c99a3c" stroke-width="3" fill="none" stroke-linecap="round"/></svg>`},{id:`wolke`,size:92,note:4,svg:`<svg viewBox="0 0 100 100"><g fill="#fffaf2" stroke="#bcd6e0" stroke-width="3"><ellipse cx="38" cy="58" rx="22" ry="18"/><ellipse cx="62" cy="58" rx="20" ry="16"/><ellipse cx="50" cy="46" rx="20" ry="18"/></g></svg>`},{id:`vogel`,size:70,note:5,svg:`<svg viewBox="0 0 100 100"><ellipse cx="52" cy="56" rx="24" ry="19" fill="#7ea3c9"/><circle cx="34" cy="44" r="14" fill="#8fb3d4"/><path d="M22 44 l-12 5 l12 5 z" fill="#f4a56b"/><circle cx="31" cy="41" r="3" fill="#4a4032"/><path d="M56 52 q14 -8 22 2 q-12 8 -22 -2z" fill="#6b93bd"/><path d="M70 66 l14 8" stroke="#f4a56b" stroke-width="5" stroke-linecap="round"/></svg>`},{id:`pilz`,size:68,note:6,svg:`<svg viewBox="0 0 100 100"><rect x="40" y="52" width="20" height="38" rx="8" fill="#f3e7db"/><path d="M14 54 a36 30 0 0 1 72 0 z" fill="#e88a9a"/><circle cx="36" cy="40" r="7" fill="#fffaf2"/><circle cx="62" cy="34" r="5" fill="#fffaf2"/><circle cx="54" cy="48" r="4" fill="#fffaf2"/></svg>`},{id:`stern`,size:62,note:7,svg:`<svg viewBox="0 0 100 100"><path d="M50 8 L61 38 L93 38 L67 57 L77 88 L50 69 L23 88 L33 57 L7 38 L39 38 Z" fill="#f4c86b"/></svg>`}],An=`sticker`,jn=1,Mn=60,q=[],J=null,Y=null,X=null,Nn=[];function Pn(e,t,n){e.addEventListener(t,n),Nn.push(()=>e.removeEventListener(t,n))}function Fn(e){return kn.find(t=>t.id===e)??kn[0]}function In(){g(An,jn,{placed:q})}function Ln(e){Nn=[],q=h(An,jn,{placed:[]}).placed,e.innerHTML=`
    <div class="sticker-stage" id="stickerStage">
      <div class="sticker-szene" id="stickerSzene">
        <div class="szene-himmel"></div>
        <div class="szene-huegel h1"></div>
        <div class="szene-huegel h2"></div>
        <div class="szene-wiese"></div>
        <div class="sticker-platziert" id="stickerPlatziert"></div>
      </div>
      <div class="sticker-tray" id="stickerTray">
        ${kn.map(e=>`<div class="tray-item" data-art="${e.id}" style="width:${e.size*.62}px;height:${e.size*.62}px">${e.svg}</div>`).join(``)}
      </div>
    </div>
  `,J=e.querySelector(`#stickerStage`),Y=e.querySelector(`#stickerSzene`),X=e.querySelector(`#stickerTray`),Rn(),X.querySelectorAll(`.tray-item`).forEach(e=>{Pn(e,`pointerdown`,t=>Hn(t,e))})}function Rn(){let e=document.getElementById(`stickerPlatziert`);e&&(e.innerHTML=``,q.forEach((t,n)=>{let r=Fn(t.art),i=document.createElement(`div`);i.className=`sticker`,i.dataset.index=String(n),i.style.width=`${r.size}px`,i.style.height=`${r.size}px`,i.style.left=`${t.xPct}%`,i.style.top=`${t.yPct}%`,i.style.setProperty(`--rot`,`${t.rot}deg`),i.innerHTML=r.svg,e.appendChild(i),zn(i,n)}))}function zn(e,t){let n=!1,r=0,i=0,a=0;e.addEventListener(`pointerdown`,t=>{t.preventDefault(),t.stopPropagation(),n=!0,r=0,i=t.clientX,a=t.clientY,e.classList.add(`greift`);try{e.setPointerCapture(t.pointerId)}catch{}}),e.addEventListener(`pointermove`,o=>{if(!n||!Y)return;r=Math.max(r,Math.hypot(o.clientX-i,o.clientY-a));let s=Y.getBoundingClientRect(),c=q[t];c&&(c.xPct=Vn((o.clientX-s.left)/s.width*100,2,98),c.yPct=Vn((o.clientY-s.top)/s.height*100,2,98),e.style.left=`${c.xPct}%`,e.style.top=`${c.yPct}%`)});let o=i=>{if(n){n=!1,e.classList.remove(`greift`);try{e.releasePointerCapture(i.pointerId)}catch{}if(X&&Bn(i.clientX,i.clientY)){q.splice(t,1),In(),Rn(),d(300);return}r<10&&(e.classList.remove(`wackelt`),e.offsetWidth,e.classList.add(`wackelt`),u({freq:l[Fn(q[t]?.art??kn[0].id).note%l.length],duration:.3,gain:.28})),In()}};e.addEventListener(`pointerup`,o),e.addEventListener(`pointercancel`,o)}function Bn(e,t){if(!X)return!1;let n=X.getBoundingClientRect();return e>=n.left&&e<=n.right&&t>=n.top&&t<=n.bottom}function Vn(e,t,n){return Math.max(t,Math.min(n,e))}function Hn(e,t){if(e.preventDefault(),!J)return;let n=Fn(t.dataset.art??``);try{t.setPointerCapture(e.pointerId)}catch{}let r=document.createElement(`div`);r.className=`sticker-ghost`,r.style.width=`${n.size}px`,r.style.height=`${n.size}px`,r.innerHTML=n.svg,J.appendChild(r);let i=(e,t)=>{let n=J.getBoundingClientRect();r.style.left=`${e-n.left}px`,r.style.top=`${t-n.top}px`};i(e.clientX,e.clientY),d(560);let a=!1;function o(e){let t=e;i(t.clientX,t.clientY)}function s(e){if(a)return;a=!0;let i=e;try{t.releasePointerCapture(i.pointerId)}catch{}t.removeEventListener(`pointermove`,o),t.removeEventListener(`pointerup`,s),t.removeEventListener(`pointercancel`,s),r.remove(),Un(n,i.clientX,i.clientY)}t.addEventListener(`pointermove`,o),t.addEventListener(`pointerup`,s),t.addEventListener(`pointercancel`,s)}function Un(e,t,n){if(!Y||Bn(t,n))return;let r=Y.getBoundingClientRect();n>r.bottom||n<r.top||(q.length>=Mn&&q.shift(),q.push({art:e.id,xPct:Vn((t-r.left)/r.width*100,2,98),yPct:Vn((n-r.top)/r.height*100,2,98),rot:Math.round((Math.random()*2-1)*9)}),In(),Rn(),u({freq:l[e.note%l.length],duration:.28,gain:.3}))}function Wn(){Nn.forEach(e=>e()),Nn=[],q=[],J=null,Y=null,X=null}var Gn={id:`sticker`,accent:`#9ec99f`,tileIcon:On,mount:Ln,unmount:Wn};oe();var Kn=[He,nt,St,Kt,rn,Dn,Gn],qn=document.querySelector(`#app`),Jn=`
  <svg viewBox="0 0 96 96" width="40" height="40">
    <path d="M56 26 L34 48 L56 70" fill="none" stroke="#8a7255" stroke-width="8"
      stroke-linecap="round" stroke-linejoin="round"/>
  </svg>
`,Yn=18,Xn=2*Math.PI*Yn;qn.innerHTML=`
  <div class="spielzimmer" id="spielzimmer">
    <div class="tiles" id="tiles"></div>
    <button class="eltern-gate" id="elternGate" aria-hidden="true">${`
  <svg viewBox="0 0 44 44">
    <circle cx="22" cy="22" r="${Yn}" fill="none" stroke="#8a7255" stroke-width="3" opacity="0.25"/>
    <circle class="eltern-gate-progress" cx="22" cy="22" r="${Yn}" fill="none"
      stroke="#8a7255" stroke-width="3" stroke-linecap="round"
      stroke-dasharray="${Xn}" stroke-dashoffset="${Xn}"
      transform="rotate(-90 22 22)"/>
    <circle cx="22" cy="22" r="4" fill="#8a7255"/>
  </svg>
`}</button>
  </div>
  <div class="toy-view" id="toyView">
    <div class="toy-stage" id="toyStage"></div>
  </div>
  <button class="back-button" id="backButton" aria-hidden="true">${Jn}</button>
  <div class="eltern-overlay" id="elternOverlay">
    <div id="elternPanelWrap"></div>
  </div>
  <div class="version-placeholder">v1.0.0 · 82a8bea</div>
`;var Zn=document.querySelector(`#spielzimmer`),Qn=document.querySelector(`#tiles`),$n=document.querySelector(`#toyView`),er=document.querySelector(`#toyStage`),tr=document.querySelector(`#backButton`),Z=document.querySelector(`#elternGate`),nr=document.querySelector(`#elternOverlay`),rr=document.querySelector(`#elternPanelWrap`),ir=null,Q=!1;function ar(){Qn.innerHTML=``,Kn.forEach((e,t)=>{let n=document.createElement(`button`);n.className=`tile`,n.style.setProperty(`--accent`,e.accent),n.style.animationDelay=`${(t*.7%4.5).toFixed(2)}s`,n.innerHTML=e.tileIcon,n.setAttribute(`aria-hidden`,`true`),n.addEventListener(`pointerdown`,t=>{t.preventDefault(),or(e)}),Qn.appendChild(n)})}function or(e){Q||ir||(Q=!0,ir=e,e.mount(er),Zn.classList.add(`hidden`),tr.classList.add(`visible`),$n.classList.add(`active`),window.setTimeout(()=>{Q=!1},450))}function sr(){Q||!ir||(Q=!0,$n.classList.remove(`active`),Zn.classList.remove(`hidden`),tr.classList.remove(`visible`),window.setTimeout(()=>{ir?.unmount?.(),er.innerHTML=``,ir=null,Q=!1},450))}tr.addEventListener(`pointerdown`,e=>{e.preventDefault(),sr()});var cr=3e3,$=null;function lr(){$===null&&(Z.classList.add(`charging`),$=window.setTimeout(()=>{$=null,Z.classList.remove(`charging`),dr()},cr))}function ur(){$!==null&&(window.clearTimeout($),$=null),Z.classList.remove(`charging`)}Z.addEventListener(`pointerdown`,e=>{e.preventDefault(),lr()}),Z.addEventListener(`pointerup`,ur),Z.addEventListener(`pointercancel`,ur),Z.addEventListener(`pointerleave`,ur);function dr(){ce(rr),nr.classList.add(`active`)}function fr(){nr.classList.remove(`active`)}nr.addEventListener(`pointerdown`,e=>{e.target===nr&&fr()}),document.addEventListener(`click`,e=>{e.target.closest(`.eltern-close`)&&fr()}),document.addEventListener(`gesturestart`,e=>e.preventDefault()),document.addEventListener(`gesturechange`,e=>e.preventDefault()),document.addEventListener(`dblclick`,e=>e.preventDefault()),document.addEventListener(`contextmenu`,e=>e.preventDefault());var pr=!1;document.addEventListener(`pointerdown`,()=>{i(),pr||(pr=!0,window.setTimeout(()=>{c()&&u({freq:523.25,duration:.15,gain:.25})},80))},{once:!1}),ar();