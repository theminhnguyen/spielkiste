(function(){let e=document.createElement(`link`).relList;if(e&&e.supports&&e.supports(`modulepreload`))return;for(let e of document.querySelectorAll(`link[rel="modulepreload"]`))n(e);new MutationObserver(e=>{for(let t of e)if(t.type===`childList`)for(let e of t.addedNodes)e.tagName===`LINK`&&e.rel===`modulepreload`&&n(e)}).observe(document,{childList:!0,subtree:!0});function t(e){let t={};return e.integrity&&(t.integrity=e.integrity),e.referrerPolicy&&(t.referrerPolicy=e.referrerPolicy),t.credentials=e.crossOrigin===`use-credentials`?`include`:e.crossOrigin===`anonymous`?`omit`:`same-origin`,t}function n(e){if(e.ep)return;e.ep=!0;let n=t(e);fetch(e.href,n)}})();var e=null,t=null,n=!1;function r(){if(e)return e;let n=window.AudioContext??window.webkitAudioContext;return n?(e=new n,t=e.createGain(),t.gain.value=o(),t.connect(e.destination),e):null}function i(){if(n)return;let e=r();e&&(e.state===`suspended`&&e.resume().catch(()=>{}),n=!0)}var a=.6;function o(){return a}function s(e){a=Math.max(0,Math.min(1,e)),t&&(t.gain.value=a)}function c(){return!!e&&e.state===`running`}var l=[261.63,293.66,329.63,392,440,523.25,587.33,659.25];function u(n){let r=e;if(!r||!t||r.state!==`running`)return;let{freq:i,duration:a=.5,attack:o=.02,release:s=.35,type:c=`sine`,gain:l=.5}=n,u=r.createOscillator();u.type=c,u.frequency.value=i;let d=r.createGain();d.gain.setValueAtTime(0,r.currentTime),d.gain.linearRampToValueAtTime(l,r.currentTime+o),d.gain.linearRampToValueAtTime(0,r.currentTime+o+a+s),u.connect(d),d.connect(t),u.start(),u.stop(r.currentTime+o+a+s+.05)}function d(e=440){u({freq:e,duration:.03,attack:.002,release:.08,type:`triangle`,gain:.3})}function ee(n,r=.28){let i=e;if(!i||!t||i.state!==`running`)return null;let a=i.createOscillator();a.type=`sine`,a.frequency.value=n;let o=i.createGain();o.gain.setValueAtTime(0,i.currentTime),o.gain.linearRampToValueAtTime(r,i.currentTime+.05),a.connect(o),o.connect(t),a.start();let s=!1;return{update(e){s||a.frequency.linearRampToValueAtTime(e,i.currentTime+.06)},stop(){s||(s=!0,o.gain.cancelScheduledValues(i.currentTime),o.gain.setValueAtTime(o.gain.value,i.currentTime),o.gain.linearRampToValueAtTime(0,i.currentTime+.15),a.stop(i.currentTime+.2))}}}var f=null;function te(e){if(f)return f;let t=e.sampleRate*.5,n=e.createBuffer(1,t,e.sampleRate),r=n.getChannelData(0);for(let e=0;e<t;e++)r[e]=Math.random()*2-1;return f=n,n}function p(n){let r=e;if(!r||!t||r.state!==`running`)return;let i=r.createBufferSource();i.buffer=te(r);let a=r.createBiquadFilter();a.type=`bandpass`,a.Q.value=8;let o=n?700:2200,s=n?2200:700;a.frequency.setValueAtTime(o,r.currentTime),a.frequency.linearRampToValueAtTime(s,r.currentTime+.35);let c=r.createGain();c.gain.setValueAtTime(0,r.currentTime),c.gain.linearRampToValueAtTime(.18,r.currentTime+.03),c.gain.linearRampToValueAtTime(0,r.currentTime+.38),i.connect(a),a.connect(c),c.connect(t),i.start(),i.stop(r.currentTime+.4)}function m(){let n=e;if(!n||!t||n.state!==`running`)return;let r=n.createBufferSource();r.buffer=te(n);let i=n.createBiquadFilter();i.type=`lowpass`,i.frequency.setValueAtTime(300,n.currentTime),i.frequency.linearRampToValueAtTime(1400,n.currentTime+.25);let a=n.createGain();a.gain.setValueAtTime(0,n.currentTime),a.gain.linearRampToValueAtTime(.14,n.currentTime+.05),a.gain.linearRampToValueAtTime(0,n.currentTime+.3),r.connect(i),i.connect(a),a.connect(t),r.start(),r.stop(n.currentTime+.32)}var ne=`spielkiste:`;function h(e,t,n){try{let r=localStorage.getItem(ne+e);if(!r)return n;let i=JSON.parse(r);return i.v===t?i.data:n}catch{return n}}function g(e,t,n){try{let r={v:t,data:n};localStorage.setItem(ne+e,JSON.stringify(r))}catch{}}function re(){try{let e=[];for(let t=0;t<localStorage.length;t++){let n=localStorage.key(t);n?.startsWith(ne)&&e.push(n)}e.forEach(e=>localStorage.removeItem(e))}catch{}}var ie=`settings`,ae=1;function oe(){s(h(ie,ae,{volume:.6}).volume)}function se(e){g(ie,ae,{volume:e})}function ce(e){e.innerHTML=`
    <div class="eltern-panel">
      <h1>Spielkiste</h1>
      <p class="eltern-version">Version 1.0.0 · 90db049</p>

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
</svg>`,We=[{id:0,color:`#e88a9a`,note:0,xPct:22,yPct:30,radiusPx:58},{id:1,color:`#7fb99e`,note:1,xPct:50,yPct:22,radiusPx:62},{id:2,color:`#f4c86b`,note:2,xPct:78,yPct:32,radiusPx:56},{id:3,color:`#7ea3c9`,note:3,xPct:30,yPct:68,radiusPx:60},{id:4,color:`#e0a458`,note:4,xPct:58,yPct:74,radiusPx:58},{id:5,color:`#c896d8`,note:5,xPct:80,yPct:66,radiusPx:54}],C=null,Ge=[],Ke=[],qe=new Set,Je=null;function Ye(e,t,n){e.addEventListener(t,n),Ke.push(()=>e.removeEventListener(t,n))}function Xe(e,t,n){return Math.max(t,Math.min(n,e))}function Ze(e){Ke=[],qe=new Set,e.innerHTML=`
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
  `,C=e.querySelector(`#kleckseStage`),Ge=We.map(t=>({def:t,el:e.querySelector(`.klecks[data-id="${t.id}"]`),xPct:t.xPct,yPct:t.yPct,grabbed:!1,lastX:0,lastY:0,lastT:0})),Ge.forEach(e=>{w(e),Qe(e)}),Je=new ResizeObserver(()=>{Ge.forEach(e=>{e.grabbed||w(e)})}),Je.observe(C)}function w(e,t=1,n=1){if(!C)return;let r=C.getBoundingClientRect(),i=e.xPct/100*r.width-e.def.radiusPx,a=e.yPct/100*r.height-e.def.radiusPx;e.el.style.transform=`translate(${i.toFixed(1)}px, ${a.toFixed(1)}px) scale(${t.toFixed(3)}, ${n.toFixed(3)})`}function Qe(e){let t=e.el;Ye(t,`pointerdown`,n=>{let r=n;r.preventDefault();try{t.setPointerCapture(r.pointerId)}catch{}e.grabbed=!0,e.lastX=r.clientX,e.lastY=r.clientY,e.lastT=performance.now(),t.classList.add(`grabbed`),u({freq:l[e.def.note%l.length],duration:.35,gain:.35}),et(e,1.18),tt(e)}),Ye(t,`pointermove`,t=>{if(!e.grabbed||!C)return;let n=t,r=C.getBoundingClientRect(),i=performance.now(),a=Math.max(1,i-e.lastT),o=(n.clientX-e.lastX)/a,s=(n.clientY-e.lastY)/a;e.lastX=n.clientX,e.lastY=n.clientY,e.lastT=i,e.xPct=Xe((n.clientX-r.left)/r.width*100,6,94),e.yPct=Xe((n.clientY-r.top)/r.height*100,8,92),$e(e,o,s),it(e)});function n(n){if(!e.grabbed)return;e.grabbed=!1,t.classList.remove(`grabbed`);let r=n;if(r.pointerId!==void 0)try{t.releasePointerCapture(r.pointerId)}catch{}w(e,1,1)}Ye(t,`pointerup`,n),Ye(t,`pointercancel`,n)}function $e(e,t,n){let r=Math.min(Math.hypot(t,n)*6,.28),i=Math.atan2(n,t);w(e,1+r*Math.abs(Math.cos(i)),1-r*Math.abs(Math.cos(i))*.6+r*Math.abs(Math.sin(i))*.1)}function et(e,t){w(e,t,t),window.setTimeout(()=>{e.el.classList.contains(`grabbed`)||w(e,1,1)},160)}function tt(e){e.el.classList.remove(`singt`),e.el.offsetWidth,e.el.classList.add(`singt`),window.setTimeout(()=>e.el.classList.remove(`singt`),300)}function nt(e){e.el.classList.remove(`funkt`),e.el.offsetWidth,e.el.classList.add(`funkt`),window.setTimeout(()=>e.el.classList.remove(`funkt`),420)}function rt(e,t){return e<t?`${e}-${t}`:`${t}-${e}`}function it(e){if(!C)return;let t=C.getBoundingClientRect(),n=e.xPct/100*t.width,r=e.yPct/100*t.height;for(let i of Ge){if(i.def.id===e.def.id)continue;let a=i.xPct/100*t.width,o=i.yPct/100*t.height,s=Math.hypot(n-a,r-o),c=e.def.radiusPx*.75+i.def.radiusPx*.75,d=rt(e.def.id,i.def.id);s<c?qe.has(d)||(qe.add(d),u({freq:l[e.def.note%l.length],duration:.25,gain:.22}),u({freq:l[i.def.note%l.length],duration:.25,gain:.22}),et(i,1.1),nt(e),nt(i)):qe.delete(d)}}function at(){Ke.forEach(e=>e()),Ke=[],Je?.disconnect(),Je=null,Ge=[],C=null,qe=new Set}var ot={id:`kleckse`,accent:`#e88a9a`,tileIcon:Ue,mount:Ze,unmount:at},st=`
<svg viewBox="0 0 120 120" width="100%" height="100%">
  <path d="M30 90 L80 30 L95 45 L45 95 Z" fill="#fdf6ea" stroke="#7ea3c9" stroke-width="4" stroke-linejoin="round"/>
  <circle cx="34" cy="92" r="10" fill="#7ea3c9"/>
  <circle cx="70" cy="40" r="8" fill="#e88a9a"/>
</svg>`,ct=[`#e88a9a`,`#7fb99e`,`#f4c86b`,`#7ea3c9`,`#e0a458`,`#6b5d4a`],lt=`malen`,ut=1,T=null,E=null,D=null,dt=ct[0],O=!1,ft=0,pt=0,mt=[],k=null,ht=null;function A(e,t,n){e.addEventListener(t,n),mt.push(()=>e.removeEventListener(t,n))}function gt(e){mt=[],O=!1,dt=ct[0],e.innerHTML=`
    <div class="malen-stage" id="malenStage">
      <canvas class="malen-canvas" id="malenCanvas"></canvas>
      <div class="malen-palette" id="malenPalette">
        ${ct.map((e,t)=>`<button class="malen-swatch${t===0?` selected`:``}" data-color="${e}" style="--swatch-color:${e}" aria-hidden="true"></button>`).join(``)}
      </div>
      <button class="malen-new-sheet" id="malenNewSheet" aria-hidden="true">
        <svg viewBox="0 0 48 48" width="30" height="30">
          <path d="M10 6 h20 l8 8 v28 h-28 z" fill="#fffaf2" stroke="#8a7255" stroke-width="2.5" stroke-linejoin="round"/>
          <path d="M30 6 v8 h8" fill="none" stroke="#8a7255" stroke-width="2.5" stroke-linejoin="round"/>
        </svg>
      </button>
    </div>
  `,D=e.querySelector(`#malenStage`),T=e.querySelector(`#malenCanvas`),E=T.getContext(`2d`),_t(),vt(),A(T,`pointerdown`,xt),A(T,`pointermove`,St),A(T,`pointerup`,Ct),A(T,`pointercancel`,Ct);let t=e.querySelectorAll(`.malen-swatch`);t.forEach(e=>{A(e,`pointerdown`,n=>{n.preventDefault(),dt=e.dataset.color??ct[0],t.forEach(e=>e.classList.remove(`selected`)),e.classList.add(`selected`),d(500)})}),A(e.querySelector(`#malenNewSheet`),`pointerdown`,e=>{e.preventDefault(),wt()});let n=D.clientWidth,r=D.clientHeight,i=()=>{if(!D)return;let e=D.clientWidth,t=D.clientHeight;(e!==n||t!==r)&&(n=e,r=t,k!==null&&window.clearTimeout(k),k=window.setTimeout(()=>{_t(),vt()},200))};ht=new ResizeObserver(i),ht.observe(D),A(window,`resize`,i),A(window,`orientationchange`,i)}function _t(){if(!T||!D)return;let e=Math.min(window.devicePixelRatio||1,2),t={width:D.clientWidth,height:D.clientHeight};T.width=Math.round(t.width*e),T.height=Math.round(t.height*e),T.style.width=`${t.width}px`,T.style.height=`${t.height}px`,E=T.getContext(`2d`),E&&(E.scale(e,e),E.lineCap=`round`,E.lineJoin=`round`,E.lineWidth=22)}function vt(){let e=h(lt,ut,{dataUrl:null});if(!e.dataUrl||!T||!E)return;let t=new Image;t.onload=()=>{if(!E||!T)return;let e=Math.min(window.devicePixelRatio||1,2);E.drawImage(t,0,0,T.width/e,T.height/e)},t.src=e.dataUrl}function yt(){if(T)try{g(lt,ut,{dataUrl:T.toDataURL(`image/png`)})}catch{}}function bt(e){let t=T,n=t.getBoundingClientRect(),r=n.width===0?1:t.clientWidth/n.width,i=n.height===0?1:t.clientHeight/n.height;return{x:(e.clientX-n.left)*r,y:(e.clientY-n.top)*i}}function xt(e){let t=e;if(t.preventDefault(),!T||!E)return;try{T.setPointerCapture(t.pointerId)}catch{}O=!0;let{x:n,y:r}=bt(t);ft=n,pt=r,E.strokeStyle=dt,E.fillStyle=dt,E.beginPath(),E.arc(n,r,E.lineWidth/2,0,Math.PI*2),E.fill()}function St(e){if(!O||!E)return;let{x:t,y:n}=bt(e);E.beginPath(),E.moveTo(ft,pt),E.lineTo(t,n),E.stroke(),ft=t,pt=n}function Ct(e){if(!O)return;O=!1;let t=e;if(T&&t.pointerId!==void 0)try{T.releasePointerCapture(t.pointerId)}catch{}yt()}function wt(){if(!T||!E||!D)return;let e=T.toDataURL(`image/png`),t=document.createElement(`img`);t.src=e,t.className=`malen-crumple-overlay`,t.style.width=T.style.width,t.style.height=T.style.height,D.appendChild(t);let n=Math.min(window.devicePixelRatio||1,2);E.clearRect(0,0,T.width/n,T.height/n),g(lt,ut,{dataUrl:null}),d(300),t.offsetWidth,t.classList.add(`crumpling`),window.setTimeout(()=>{t.remove()},550)}function Tt(){mt.forEach(e=>e()),mt=[],ht?.disconnect(),ht=null,k!==null&&(window.clearTimeout(k),k=null),T=null,E=null,D=null}var Et={id:`malen`,accent:`#7ea3c9`,tileIcon:st,mount:gt,unmount:Tt},Dt=`
<svg viewBox="0 0 120 120" width="100%" height="100%">
  <rect x="30" y="70" width="60" height="26" rx="8" fill="#7fb99e"/>
  <rect x="38" y="42" width="44" height="26" rx="8" fill="#f4a56b"/>
  <rect x="46" y="16" width="28" height="24" rx="8" fill="#e88a9a"/>
</svg>`,Ot=[{shape:`square`,color:`#e88a9a`},{shape:`round`,color:`#7fb99e`},{shape:`wide`,color:`#f4c86b`},{shape:`peak`,color:`#7ea3c9`},{shape:`tall`,color:`#e0a458`}],kt={square:78,round:78,wide:108,peak:78,tall:60},At=52,jt=`steine`,Mt=1,j=[],M=null,N=null,Nt=[];function Pt(e,t,n){e.addEventListener(t,n),Nt.push(()=>e.removeEventListener(t,n))}function Ft(){g(jt,Mt,{towers:j})}function It(e){let t=kt[e.shape],n=e.shape===`tall`?4:8,r=e.shape===`peak`?`<div class="steine-roof" style="border-bottom-color:${e.color}"></div>`:``,i=e.shape===`round`?`50px`:`14px`;return`
    <div class="steine-block-body" style="width:${t}px;height:${At}px;background:${e.color};border-radius:${i};">
      ${r}
      <div class="steine-face" style="gap:${n}px;">
        <div class="steine-eyes"><span></span><span></span></div>
        <div class="steine-mouth"></div>
      </div>
    </div>
  `}function Lt(e){Nt=[],j=h(jt,Mt,{towers:[]}).towers,e.innerHTML=`
    <div class="steine-stage" id="steineStage">
      <div class="steine-floor"></div>
      <div class="steine-towers" id="steineTowers"></div>
      <div class="steine-shelf" id="steineShelf">
        ${Ot.map((e,t)=>`
          <div class="steine-shelf-item" data-shape-index="${t}">
            ${It(e)}
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
  `,M=e.querySelector(`#steineStage`),N=e.querySelector(`#steineTowers`),P(),Vt(e),Kt(e)}function P(){N&&(N.innerHTML=``,j.forEach((e,t)=>{let n=document.createElement(`div`);n.className=`steine-tower`+(e.toppled?` toppled`:``),n.style.left=`${e.xPct}%`,n.style.setProperty(`--topple-dir`,String(e.toppleDir));let r=document.createElement(`div`);r.className=`steine-stack`,e.blocks.forEach(e=>{let t=document.createElement(`div`);t.className=`steine-placed-block`,t.innerHTML=It(e),r.appendChild(t)}),n.appendChild(r),N.appendChild(n),zt(n,t)}))}var Rt=45;function zt(e,t){let n=0,r=0,i=0;e.addEventListener(`pointerdown`,t=>{let a=t;a.preventDefault(),a.stopPropagation(),n=a.clientX,r=a.clientY,i=0;try{e.setPointerCapture(a.pointerId)}catch{}}),e.addEventListener(`pointermove`,e=>{let t=e;i=Math.max(i,Math.hypot(t.clientX-n,t.clientY-r))}),e.addEventListener(`pointerup`,r=>{let a=r;try{e.releasePointerCapture(a.pointerId)}catch{}let o=j[t];if(!o)return;let s=i>Rt;if(o.toppled){s||(o.toppled=!1,Ft(),P(),d(600));return}s?(o.toppled=!0,o.toppleDir=a.clientX-n>=0?1:-1,Ft(),P(),m()):Bt(e)}),e.addEventListener(`pointercancel`,t=>{let n=t;try{e.releasePointerCapture(n.pointerId)}catch{}})}function Bt(e){e.classList.remove(`wobble`),e.offsetWidth,e.classList.add(`wobble`),[0,90,180].forEach((e,t)=>{window.setTimeout(()=>{u({freq:500+t*120,duration:.08,attack:.005,release:.1,type:`triangle`,gain:.22})},e)}),window.setTimeout(()=>e.classList.remove(`wobble`),700)}function Vt(e){e.querySelectorAll(`.steine-shelf-item`).forEach((e,t)=>{Pt(e,`pointerdown`,n=>Ht(n,e,t))})}function Ht(e,t,n){if(e.preventDefault(),!M)return;try{t.setPointerCapture(e.pointerId)}catch{}let r=Ot[n],i=document.createElement(`div`);i.className=`steine-floating-block`,i.innerHTML=It(r),M.appendChild(i);let a=(e,t)=>{let n=M.getBoundingClientRect();i.style.left=`${e-n.left}px`,i.style.top=`${t-n.top}px`};a(e.clientX,e.clientY),d(420);let o=!1;function s(e){let t=e;a(t.clientX,t.clientY)}function c(e){if(o)return;o=!0;let n=e;try{t.releasePointerCapture(n.pointerId)}catch{}t.removeEventListener(`pointermove`,s),t.removeEventListener(`pointerup`,c),t.removeEventListener(`pointercancel`,c),i.remove(),Gt(r,n.clientX,n.clientY)}t.addEventListener(`pointermove`,s),t.addEventListener(`pointerup`,c),t.addEventListener(`pointercancel`,c)}var Ut=55,Wt=90;function Gt(e,t,n){if(!M)return;let r=M.getBoundingClientRect(),i=(t-r.left)/r.width*100,a=r.height-24,o=null;for(let e of j){if(e.toppled)continue;let i=r.left+e.xPct/100*r.width,s=r.top+a-e.blocks.length*At;if(Math.abs(t-i)<Ut&&Math.abs(n-s)<Wt){o=e;break}}if(o)o.blocks.push(e),Jt(o.blocks.length);else{let t=Math.max(10,Math.min(90,i));j.push({xPct:t,blocks:[e],toppled:!1,toppleDir:1}),Jt(1)}Ft(),P()}function Kt(e){Pt(e.querySelector(`#steineClear`),`pointerdown`,e=>{e.preventDefault(),j.length!==0&&qt()})}function qt(){if(!N)return;let e=[...N.querySelectorAll(`.steine-tower`)];e.forEach((e,t)=>{e.style.transitionDelay=`${t*45}ms`,e.offsetWidth,e.classList.add(`wegfegen`)}),m(),window.setTimeout(()=>{j=[],Ft(),P()},500+e.length*45)}function Jt(e){u({freq:Math.max(140,240-e*10),duration:.08,attack:.004,release:.12,type:`sine`,gain:.3})}function Yt(){Nt.forEach(e=>e()),Nt=[],M=null,N=null,j=[]}var Xt={id:`steine`,accent:`#7fb99e`,tileIcon:Dt,mount:Lt,unmount:Yt},Zt=`
<svg viewBox="0 0 120 120" width="100%" height="100%">
  <circle cx="48" cy="46" r="26" fill="none" stroke="#7ec8d8" stroke-width="5"/>
  <circle cx="40" cy="38" r="7" fill="#bfe6ee"/>
  <circle cx="84" cy="72" r="17" fill="none" stroke="#a8d8e0" stroke-width="4"/>
  <circle cx="79" cy="67" r="5" fill="#d6f0f5"/>
  <circle cx="42" cy="90" r="11" fill="none" stroke="#c8b6e0" stroke-width="4"/>
</svg>`,Qt=[`rgba(126, 200, 216, 0.55)`,`rgba(200, 182, 224, 0.55)`,`rgba(244, 200, 107, 0.45)`,`rgba(232, 138, 154, 0.45)`,`rgba(127, 185, 158, 0.5)`],$t=14,en=900,F=null,I=[],L=null,tn=[];function nn(e,t,n){e.addEventListener(t,n),I.push(()=>e.removeEventListener(t,n))}function rn(e){I=[],tn=[],e.innerHTML=`
    <div class="blasen-stage" id="blasenStage">
      <div class="blasen-layer" id="blasenLayer"></div>
      <div class="blasen-wand" id="blasenWand">
        <div class="wand-ring"></div>
        <div class="wand-stick"></div>
      </div>
    </div>
  `,F=e.querySelector(`#blasenLayer`);let t=e.querySelector(`#blasenWand`);for(let e=0;e<6;e++)an(.3+Math.random()*.5);L=window.setInterval(()=>an(),en),I.push(()=>{L!==null&&window.clearInterval(L),L=null}),nn(F,`pointerdown`,e=>{let t=e,n=t.target.closest(`.blase`);n&&(t.preventDefault(),on(n))}),nn(t,`pointerdown`,e=>{e.preventDefault(),t.classList.remove(`puff`),t.offsetWidth,t.classList.add(`puff`);for(let e=0;e<5;e++)window.setTimeout(()=>an(0,!0),e*110);u({freq:220,duration:.28,attack:.06,release:.35,type:`sine`,gain:.12})})}function an(e=0,t=!1){if(!F||F.childElementCount>=$t)return;let n=42+Math.random()*58,r=Qt[Math.floor(Math.random()*Qt.length)],i=t?14+Math.random()*16:6+Math.random()*88,a=(Math.random()*2-1)*40,o=9e3+Math.random()*5e3,s=document.createElement(`div`);s.className=`blase`,s.style.width=`${n}px`,s.style.height=`${n}px`,s.style.left=`${i}%`,s.style.setProperty(`--tint`,r),s.style.setProperty(`--drift`,`${a}px`),s.style.animationDuration=`${o}ms`,s.style.animationDelay=`${-e*o}ms`,s.innerHTML=`<span class="blase-glanz"></span>`,s.addEventListener(`animationend`,()=>s.remove()),F.appendChild(s)}function on(e){if(e.classList.contains(`platzt`))return;e.classList.add(`platzt`);let t=l[Math.floor(Math.random()*l.length)];u({freq:t*2,duration:.06,attack:.002,release:.16,type:`sine`,gain:.22});let n=window.setTimeout(()=>e.remove(),340);tn.push(n)}function sn(){I.forEach(e=>e()),I=[],L!==null&&(window.clearInterval(L),L=null),tn.forEach(e=>window.clearTimeout(e)),tn=[],F=null}var cn={id:`blasen`,accent:`#7ec8d8`,tileIcon:Zt,mount:rn,unmount:sn},ln=`
<svg viewBox="0 0 120 120" width="100%" height="100%">
  <rect x="22" y="30" width="76" height="58" rx="10" fill="#cbb98a"/>
  <rect x="30" y="38" width="60" height="42" rx="6" fill="#bfe6ee"/>
  <path d="M34 74 L54 46" stroke="#fffaf2" stroke-width="9" stroke-linecap="round"/>
  <path d="M52 76 L70 52" stroke="#fffaf2" stroke-width="7" stroke-linecap="round"/>
  <circle cx="84" cy="92" r="13" fill="#7ec8d8"/>
</svg>`,un=[{clean:`<svg viewBox="0 0 200 200">
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
    </svg>`,dirt:`#7d6b52`,fleck:`#5f5040`}],dn=34,fn=.82,R=null,z=null,B=null,pn=0,mn=!1,hn=[],V=null,gn=null,_n=[],H=new Map;function U(e,t,n){e.addEventListener(t,n),hn.push(()=>e.removeEventListener(t,n))}function vn(e){hn=[],H.clear(),_n=[],pn=0,mn=!1,e.innerHTML=`
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
  `,B=e.querySelector(`#putzenStage`),R=e.querySelector(`#putzenCanvas`),yn(e,0),U(R,`pointerdown`,Cn),U(R,`pointermove`,wn),U(R,`pointerup`,Tn),U(R,`pointercancel`,Tn),U(e.querySelector(`#putzenNext`),`pointerdown`,t=>{t.preventDefault(),yn(e,pn+1),m()});let t=B.clientWidth,n=B.clientHeight,r=()=>{if(!B)return;let e=B.clientWidth,r=B.clientHeight;(e!==t||r!==n)&&(t=e,n=r,V!==null&&window.clearTimeout(V),V=window.setTimeout(()=>bn(),220))};gn=new ResizeObserver(r),gn.observe(B),U(window,`resize`,r),U(window,`orientationchange`,r)}function yn(e,t){pn=(t%un.length+un.length)%un.length,mn=!1,B?.classList.remove(`sauber`);let n=e.querySelector(`#putzenMotiv`);n.innerHTML=un[pn].clean,bn()}function bn(){if(!R||!B)return;let e=Math.min(window.devicePixelRatio||1,2),t=B.clientWidth,n=B.clientHeight;R.width=Math.round(t*e),R.height=Math.round(n*e),R.style.width=`${t}px`,R.style.height=`${n}px`,z=R.getContext(`2d`,{willReadFrequently:!0}),z&&(z.scale(e,e),xn(t,n))}function xn(e,t){if(!z)return;let n=un[pn];z.globalCompositeOperation=`source-over`,z.clearRect(0,0,e,t),z.fillStyle=n.dirt,z.fillRect(0,0,e,t),z.fillStyle=n.fleck;for(let n=0;n<140;n++){let n=Math.random()*e,r=Math.random()*t,i=6+Math.random()*26;z.globalAlpha=.18+Math.random()*.3,z.beginPath(),z.ellipse(n,r,i,i*(.6+Math.random()*.7),Math.random()*Math.PI,0,Math.PI*2),z.fill()}z.globalAlpha=1}function Sn(e){let t=R,n=t.getBoundingClientRect(),r=n.width===0?1:t.clientWidth/n.width,i=n.height===0?1:t.clientHeight/n.height;return{x:(e.clientX-n.left)*r,y:(e.clientY-n.top)*i}}function Cn(e){let t=e;if(t.preventDefault(),!R||!z)return;try{R.setPointerCapture(t.pointerId)}catch{}let n=Sn(t);H.set(t.pointerId,n),En(n.x,n.y),kn()}function wn(e){let t=e,n=H.get(t.pointerId);if(!n||!z)return;let r=Sn(t);Dn(n.x,n.y,r.x,r.y),H.set(t.pointerId,r),kn()}function Tn(e){let t=e;if(H.has(t.pointerId)){if(H.delete(t.pointerId),R)try{R.releasePointerCapture(t.pointerId)}catch{}jn()}}function En(e,t){z&&(z.globalCompositeOperation=`destination-out`,z.beginPath(),z.arc(e,t,dn,0,Math.PI*2),z.fill())}function Dn(e,t,n,r){z&&(z.globalCompositeOperation=`destination-out`,z.lineCap=`round`,z.lineJoin=`round`,z.lineWidth=68,z.beginPath(),z.moveTo(e,t),z.lineTo(n,r),z.stroke())}var On=0;function kn(){let e=performance.now();e-On<130||(On=e,u({freq:180+Math.random()*90,duration:.05,attack:.01,release:.1,type:`triangle`,gain:.07}))}function An(){if(!R||!z)return 0;let e=0,t=0,n=R.width/24,r=R.height/24;for(let i=0;i<24;i++)for(let a=0;a<24;a++){let o=Math.min(R.width-1,Math.floor(i*n+n/2)),s=Math.min(R.height-1,Math.floor(a*r+r/2));z.getImageData(o,s,1,1).data[3]<40&&e++,t++}return t===0?0:e/t}function jn(){if(!mn&&!(An()<fn)){if(mn=!0,z&&R){let e=Math.min(window.devicePixelRatio||1,2);z.globalCompositeOperation=`destination-out`,z.fillStyle=`#000`,z.fillRect(0,0,R.width/e,R.height/e)}B?.classList.add(`sauber`),[0,130,260].forEach((e,t)=>{let n=window.setTimeout(()=>{u({freq:l[t+3],duration:.3,attack:.01,release:.5,gain:.24})},e);_n.push(n)})}}function Mn(){hn.forEach(e=>e()),hn=[],gn?.disconnect(),gn=null,V!==null&&(window.clearTimeout(V),V=null),_n.forEach(e=>window.clearTimeout(e)),_n=[],H.clear(),R=null,z=null,B=null}var Nn={id:`putzen`,accent:`#7ec8d8`,tileIcon:ln,mount:vn,unmount:Mn},Pn=`
<svg viewBox="0 0 120 120" width="100%" height="100%">
  <rect x="16" y="22" width="88" height="66" rx="10" fill="#dff0e4"/>
  <path d="M16 72 Q40 54 62 72 Q82 56 104 72 L104 88 H16 Z" fill="#9ec99f"/>
  <circle cx="86" cy="40" r="12" fill="#f7d570"/>
  <ellipse cx="46" cy="60" rx="13" ry="11" fill="#e88a9a"/>
  <circle cx="42" cy="57" r="2.5" fill="#4a4032"/>
  <circle cx="50" cy="57" r="2.5" fill="#4a4032"/>
  <path d="M74 92 l7 -13 l7 13 z" fill="#7fb99e"/>
</svg>`,Fn=[{id:`hase`,size:82,note:0,svg:`<svg viewBox="0 0 100 100"><ellipse cx="50" cy="64" rx="26" ry="28" fill="#f3e7db"/><ellipse cx="38" cy="24" rx="8" ry="20" fill="#f3e7db"/><ellipse cx="62" cy="24" rx="8" ry="20" fill="#f3e7db"/><ellipse cx="38" cy="26" rx="4" ry="13" fill="#f2b8c6"/><ellipse cx="62" cy="26" rx="4" ry="13" fill="#f2b8c6"/><circle cx="41" cy="60" r="4" fill="#4a4032"/><circle cx="59" cy="60" r="4" fill="#4a4032"/><ellipse cx="50" cy="70" rx="5" ry="3.5" fill="#e88a9a"/></svg>`},{id:`baum`,size:96,note:1,svg:`<svg viewBox="0 0 100 100"><rect x="43" y="58" width="14" height="36" rx="5" fill="#a9835e"/><circle cx="50" cy="40" r="28" fill="#7fb99e"/><circle cx="30" cy="50" r="18" fill="#8fc4a8"/><circle cx="70" cy="50" r="18" fill="#8fc4a8"/></svg>`},{id:`blume`,size:72,note:2,svg:`<svg viewBox="0 0 100 100"><rect x="46" y="52" width="8" height="42" rx="4" fill="#7fb99e"/><ellipse cx="30" cy="62" rx="14" ry="7" fill="#8fc4a8"/><g><ellipse cx="50" cy="26" rx="11" ry="17" fill="#e88a9a"/><ellipse cx="50" cy="26" rx="11" ry="17" fill="#e88a9a" transform="rotate(72 50 40)"/><ellipse cx="50" cy="26" rx="11" ry="17" fill="#e88a9a" transform="rotate(144 50 40)"/><ellipse cx="50" cy="26" rx="11" ry="17" fill="#e88a9a" transform="rotate(216 50 40)"/><ellipse cx="50" cy="26" rx="11" ry="17" fill="#e88a9a" transform="rotate(288 50 40)"/></g><circle cx="50" cy="40" r="10" fill="#f4c86b"/></svg>`},{id:`sonne`,size:78,note:3,svg:`<svg viewBox="0 0 100 100"><g stroke="#f4c86b" stroke-width="7" stroke-linecap="round"><line x1="50" y1="8" x2="50" y2="20"/><line x1="50" y1="80" x2="50" y2="92"/><line x1="8" y1="50" x2="20" y2="50"/><line x1="80" y1="50" x2="92" y2="50"/><line x1="20" y1="20" x2="28" y2="28"/><line x1="72" y1="72" x2="80" y2="80"/><line x1="20" y1="80" x2="28" y2="72"/><line x1="72" y1="28" x2="80" y2="20"/></g><circle cx="50" cy="50" r="24" fill="#f7d570"/><circle cx="42" cy="46" r="3" fill="#c99a3c"/><circle cx="58" cy="46" r="3" fill="#c99a3c"/><path d="M43 56 Q50 62 57 56" stroke="#c99a3c" stroke-width="3" fill="none" stroke-linecap="round"/></svg>`},{id:`wolke`,size:92,note:4,svg:`<svg viewBox="0 0 100 100"><g fill="#fffaf2" stroke="#bcd6e0" stroke-width="3"><ellipse cx="38" cy="58" rx="22" ry="18"/><ellipse cx="62" cy="58" rx="20" ry="16"/><ellipse cx="50" cy="46" rx="20" ry="18"/></g></svg>`},{id:`vogel`,size:70,note:5,svg:`<svg viewBox="0 0 100 100"><ellipse cx="52" cy="56" rx="24" ry="19" fill="#7ea3c9"/><circle cx="34" cy="44" r="14" fill="#8fb3d4"/><path d="M22 44 l-12 5 l12 5 z" fill="#f4a56b"/><circle cx="31" cy="41" r="3" fill="#4a4032"/><path d="M56 52 q14 -8 22 2 q-12 8 -22 -2z" fill="#6b93bd"/><path d="M70 66 l14 8" stroke="#f4a56b" stroke-width="5" stroke-linecap="round"/></svg>`},{id:`pilz`,size:68,note:6,svg:`<svg viewBox="0 0 100 100"><rect x="40" y="52" width="20" height="38" rx="8" fill="#f3e7db"/><path d="M14 54 a36 30 0 0 1 72 0 z" fill="#e88a9a"/><circle cx="36" cy="40" r="7" fill="#fffaf2"/><circle cx="62" cy="34" r="5" fill="#fffaf2"/><circle cx="54" cy="48" r="4" fill="#fffaf2"/></svg>`},{id:`stern`,size:62,note:7,svg:`<svg viewBox="0 0 100 100"><path d="M50 8 L61 38 L93 38 L67 57 L77 88 L50 69 L23 88 L33 57 L7 38 L39 38 Z" fill="#f4c86b"/></svg>`}],In=`sticker`,Ln=1,Rn=60,W=[],zn=null,G=null,K=null,Bn=[];function Vn(e,t,n){e.addEventListener(t,n),Bn.push(()=>e.removeEventListener(t,n))}function Hn(e){return Fn.find(t=>t.id===e)??Fn[0]}function Un(){g(In,Ln,{placed:W})}function Wn(e){Bn=[],W=h(In,Ln,{placed:[]}).placed,e.innerHTML=`
    <div class="sticker-stage" id="stickerStage">
      <div class="sticker-szene" id="stickerSzene">
        <div class="szene-himmel"></div>
        <div class="szene-huegel h1"></div>
        <div class="szene-huegel h2"></div>
        <div class="szene-wiese"></div>
        <div class="sticker-platziert" id="stickerPlatziert"></div>
      </div>
      <div class="sticker-tray" id="stickerTray">
        ${Fn.map(e=>`<div class="tray-item" data-art="${e.id}" style="width:${e.size*.62}px;height:${e.size*.62}px">${e.svg}</div>`).join(``)}
      </div>
    </div>
  `,zn=e.querySelector(`#stickerStage`),G=e.querySelector(`#stickerSzene`),K=e.querySelector(`#stickerTray`),Gn(),K.querySelectorAll(`.tray-item`).forEach(e=>{Vn(e,`pointerdown`,t=>Yn(t,e))})}function Gn(){let e=document.getElementById(`stickerPlatziert`);e&&(e.innerHTML=``,W.forEach((t,n)=>{let r=Hn(t.art),i=document.createElement(`div`);i.className=`sticker`,i.dataset.index=String(n),i.style.width=`${r.size}px`,i.style.height=`${r.size}px`,i.style.left=`${t.xPct}%`,i.style.top=`${t.yPct}%`,i.style.setProperty(`--rot`,`${t.rot}deg`),i.innerHTML=r.svg,e.appendChild(i),Kn(i,n)}))}function Kn(e,t){let n=!1,r=0,i=0,a=0;e.addEventListener(`pointerdown`,t=>{t.preventDefault(),t.stopPropagation(),n=!0,r=0,i=t.clientX,a=t.clientY,e.classList.add(`greift`);try{e.setPointerCapture(t.pointerId)}catch{}}),e.addEventListener(`pointermove`,o=>{if(!n||!G)return;r=Math.max(r,Math.hypot(o.clientX-i,o.clientY-a));let s=G.getBoundingClientRect(),c=W[t];c&&(c.xPct=Jn((o.clientX-s.left)/s.width*100,2,98),c.yPct=Jn((o.clientY-s.top)/s.height*100,2,98),e.style.left=`${c.xPct}%`,e.style.top=`${c.yPct}%`)});let o=i=>{if(n){n=!1,e.classList.remove(`greift`);try{e.releasePointerCapture(i.pointerId)}catch{}if(K&&qn(i.clientX,i.clientY)){W.splice(t,1),Un(),Gn(),d(300);return}r<10&&(e.classList.remove(`wackelt`),e.offsetWidth,e.classList.add(`wackelt`),u({freq:l[Hn(W[t]?.art??Fn[0].id).note%l.length],duration:.3,gain:.28})),Un()}};e.addEventListener(`pointerup`,o),e.addEventListener(`pointercancel`,o)}function qn(e,t){if(!K)return!1;let n=K.getBoundingClientRect();return e>=n.left&&e<=n.right&&t>=n.top&&t<=n.bottom}function Jn(e,t,n){return Math.max(t,Math.min(n,e))}function Yn(e,t){if(e.preventDefault(),!zn)return;let n=Hn(t.dataset.art??``);try{t.setPointerCapture(e.pointerId)}catch{}let r=document.createElement(`div`);r.className=`sticker-ghost`,r.style.width=`${n.size}px`,r.style.height=`${n.size}px`,r.innerHTML=n.svg,zn.appendChild(r);let i=(e,t)=>{let n=zn.getBoundingClientRect();r.style.left=`${e-n.left}px`,r.style.top=`${t-n.top}px`};i(e.clientX,e.clientY),d(560);let a=!1;function o(e){let t=e;i(t.clientX,t.clientY)}function s(e){if(a)return;a=!0;let i=e;try{t.releasePointerCapture(i.pointerId)}catch{}t.removeEventListener(`pointermove`,o),t.removeEventListener(`pointerup`,s),t.removeEventListener(`pointercancel`,s),r.remove(),Xn(n,i.clientX,i.clientY)}t.addEventListener(`pointermove`,o),t.addEventListener(`pointerup`,s),t.addEventListener(`pointercancel`,s)}function Xn(e,t,n){if(!G||qn(t,n))return;let r=G.getBoundingClientRect();n>r.bottom||n<r.top||(W.length>=Rn&&W.shift(),W.push({art:e.id,xPct:Jn((t-r.left)/r.width*100,2,98),yPct:Jn((n-r.top)/r.height*100,2,98),rot:Math.round((Math.random()*2-1)*9)}),Un(),Gn(),u({freq:l[e.note%l.length],duration:.28,gain:.3}))}function Zn(){Bn.forEach(e=>e()),Bn=[],W=[],zn=null,G=null,K=null}var Qn={id:`sticker`,accent:`#9ec99f`,tileIcon:Pn,mount:Wn,unmount:Zn},$n=`
<svg viewBox="0 0 120 120" width="100%" height="100%">
  <circle cx="94" cy="26" r="14" fill="#f7d570"/>
  <path d="M20 100 L20 60 L46 38 L72 60 L72 100 Z" fill="#f3e7db" stroke="#c9a37e" stroke-width="3"/>
  <path d="M14 62 L46 34 L78 62 Z" fill="#e88a9a"/>
  <rect x="38" y="76" width="16" height="24" rx="2" fill="#a9835e"/>
  <circle cx="30" cy="10" r="8" fill="#9ec99f" opacity="0.7"/>
</svg>`,er=`wimmelbild`,tr=1,nr={tuerOffen:!1,vorhangOffen:!1,flaggeOben:!1},q={...nr},rr=[],ir=[],J=new Set;function ar(e,t,n){e.addEventListener(t,n),rr.push(()=>e.removeEventListener(t,n))}function or(){g(er,tr,q)}function sr(e,t){let n=window.setTimeout(e,t);ir.push(n)}function Y(e,t,n){let r=e.querySelector(t),i=t;ar(r,`pointerdown`,e=>{e.preventDefault(),!J.has(i)&&(J.add(i),r.classList.remove(n.className),r.offsetWidth,r.classList.add(n.className),n.onTrigger?.(r),n.sound?.(),sr(()=>{r.classList.remove(n.className),J.delete(i)},n.duration))})}function cr(e){q=h(er,tr,{...nr}),rr=[],ir=[],J=new Set,e.innerHTML=`
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
  `,lr(e),ur(e),dr(e),fr(e),pr(e),mr(e),hr(e),gr(e),_r(e),vr(e),yr(e),br(e),xr(e),Sr(e)}function lr(e){Y(e,`.w-sonne`,{className:`strahlt`,duration:700,sound:()=>{u({freq:1046.5,duration:.35,attack:.01,release:.5,type:`sine`,gain:.22}),u({freq:1567.98,duration:.25,attack:.01,release:.4,type:`sine`,gain:.1})}})}function ur(e){Y(e,`.w-wolke`,{className:`zieht-vorbei`,duration:2400,sound:()=>m()})}function dr(e){Y(e,`.w-schornstein`,{className:`pufft`,duration:1400,sound:()=>u({freq:260,duration:.15,attack:.01,release:.3,type:`sine`,gain:.16})})}function fr(e){let t=e.querySelector(`.w-tuer`);t.classList.toggle(`offen`,q.tuerOffen),ar(t,`pointerdown`,e=>{e.preventDefault(),q.tuerOffen=!q.tuerOffen,t.classList.toggle(`offen`,q.tuerOffen),m(),q.tuerOffen&&(u({freq:587.33,duration:.12,attack:.005,release:.15,type:`triangle`,gain:.2}),sr(()=>u({freq:493.88,duration:.18,attack:.005,release:.25,type:`triangle`,gain:.2}),130)),or()})}function pr(e){let t=e.querySelector(`.w-fenster`);t.classList.toggle(`offen`,q.vorhangOffen),ar(t,`pointerdown`,e=>{e.preventDefault(),q.vorhangOffen=!q.vorhangOffen,t.classList.toggle(`offen`,q.vorhangOffen),m(),or()})}function mr(e){Y(e,`.w-apfel`,{className:`faellt`,duration:900,sound:()=>u({freq:220,duration:.09,attack:.004,release:.14,type:`sine`,gain:.28})})}function hr(e){Y(e,`.w-vogelhaus`,{className:`fliegt`,duration:1600,sound:()=>{[0,90,180].forEach((e,t)=>{sr(()=>u({freq:l[(4+t)%l.length],duration:.14,attack:.005,release:.2,type:`triangle`,gain:.22}),e)})}})}function gr(e){let t=e.querySelector(`.w-schaukel`),n=t.querySelector(`.schaukel-sitz`),r=`schaukel`;ar(t,`pointerdown`,e=>{e.preventDefault(),!J.has(r)&&(J.add(r),n.classList.remove(`schwingt`),n.offsetWidth,n.classList.add(`schwingt`),[0,350,700,1050].forEach(e=>{sr(()=>u({freq:380,duration:.05,attack:.005,release:.1,type:`sine`,gain:.1}),e)}),sr(()=>{n.classList.remove(`schwingt`),J.delete(r)},2200))})}function _r(e){Y(e,`.w-biene`,{className:`summt`,duration:1300,sound:()=>u({freq:660,duration:.5,attack:.02,release:.4,type:`sawtooth`,gain:.06})})}function vr(e){Y(e,`.w-maulwurfshuegel`,{className:`guckt`,duration:1200,sound:()=>u({freq:180,duration:.12,attack:.005,release:.2,type:`sine`,gain:.24})})}function yr(e){let t=e.querySelector(`.w-briefkasten`);t.classList.toggle(`offen`,q.flaggeOben),ar(t,`pointerdown`,e=>{e.preventDefault(),q.flaggeOben=!q.flaggeOben,t.classList.toggle(`offen`,q.flaggeOben),d(q.flaggeOben?700:500),or()})}function br(e){Y(e,`.w-frosch`,{className:`huepft`,duration:700,sound:()=>u({freq:200,duration:.1,attack:.004,release:.16,type:`square`,gain:.18})})}function xr(e){Y(e,`.w-schnecke`,{className:`streckt`,duration:900,sound:()=>d(520)})}function Sr(e){Y(e,`.w-marienkaefer`,{className:`fliegt-los`,duration:1100,sound:()=>u({freq:900,duration:.3,attack:.02,release:.3,type:`sawtooth`,gain:.05})})}function Cr(){rr.forEach(e=>e()),rr=[],ir.forEach(e=>window.clearTimeout(e)),ir=[],J=new Set}var wr={id:`wimmelbild`,accent:`#9ec99f`,tileIcon:$n,mount:cr,unmount:Cr},Tr=`
<svg viewBox="0 0 120 120" width="100%" height="100%">
  <path d="M78 20 a34 34 0 1 0 22 56 a26 26 0 1 1 -22 -56 Z" fill="#7ea3c9"/>
  <path d="M32 34 l4 10 l10 4 l-10 4 l-4 10 l-4 -10 l-10 -4 l10 -4 Z" fill="#f4c86b"/>
  <rect x="14" y="86" width="46" height="20" rx="6" fill="#e0a458"/>
  <circle cx="26" cy="86" r="8" fill="#f3e7db"/>
</svg>`,Er=[{id:`baer`,bettFarbe:`#e0a458`,wach:`<svg viewBox="0 0 100 100"><circle cx="50" cy="58" r="30" fill="#c9a37e"/><circle cx="24" cy="34" r="12" fill="#c9a37e"/><circle cx="76" cy="34" r="12" fill="#c9a37e"/><circle cx="40" cy="56" r="4" fill="#4a4032"/><circle cx="60" cy="56" r="4" fill="#4a4032"/><ellipse cx="50" cy="68" rx="8" ry="5" fill="#8a7255"/></svg>`,schlaeft:`<svg viewBox="0 0 100 100"><circle cx="50" cy="58" r="30" fill="#c9a37e"/><circle cx="24" cy="34" r="12" fill="#c9a37e"/><circle cx="76" cy="34" r="12" fill="#c9a37e"/><path d="M34 56 q6 5 12 0" stroke="#4a4032" stroke-width="3" fill="none" stroke-linecap="round"/><path d="M54 56 q6 5 12 0" stroke="#4a4032" stroke-width="3" fill="none" stroke-linecap="round"/><ellipse cx="50" cy="68" rx="8" ry="5" fill="#8a7255"/></svg>`},{id:`hase`,bettFarbe:`#e88a9a`,wach:`<svg viewBox="0 0 100 100"><ellipse cx="50" cy="62" rx="26" ry="26" fill="#f3e7db"/><ellipse cx="38" cy="24" rx="8" ry="20" fill="#f3e7db"/><ellipse cx="62" cy="24" rx="8" ry="20" fill="#f3e7db"/><ellipse cx="38" cy="26" rx="4" ry="13" fill="#f2b8c6"/><ellipse cx="62" cy="26" rx="4" ry="13" fill="#f2b8c6"/><circle cx="41" cy="58" r="4" fill="#4a4032"/><circle cx="59" cy="58" r="4" fill="#4a4032"/><ellipse cx="50" cy="68" rx="5" ry="3.5" fill="#e88a9a"/></svg>`,schlaeft:`<svg viewBox="0 0 100 100"><ellipse cx="50" cy="62" rx="26" ry="26" fill="#f3e7db"/><ellipse cx="38" cy="24" rx="8" ry="20" fill="#f3e7db"/><ellipse cx="62" cy="24" rx="8" ry="20" fill="#f3e7db"/><ellipse cx="38" cy="26" rx="4" ry="13" fill="#f2b8c6"/><ellipse cx="62" cy="26" rx="4" ry="13" fill="#f2b8c6"/><path d="M35 58 q6 5 12 0" stroke="#4a4032" stroke-width="3" fill="none" stroke-linecap="round"/><path d="M53 58 q6 5 12 0" stroke="#4a4032" stroke-width="3" fill="none" stroke-linecap="round"/><ellipse cx="50" cy="68" rx="5" ry="3.5" fill="#e88a9a"/></svg>`},{id:`katze`,bettFarbe:`#7ea3c9`,wach:`<svg viewBox="0 0 100 100"><ellipse cx="50" cy="60" rx="26" ry="24" fill="#e0a458"/><path d="M28 44 L18 20 L38 36 Z" fill="#e0a458"/><path d="M72 44 L82 20 L62 36 Z" fill="#e0a458"/><circle cx="40" cy="58" r="4" fill="#4a4032"/><circle cx="60" cy="58" r="4" fill="#4a4032"/><path d="M42 68 Q50 73 58 68" stroke="#8a5a2e" stroke-width="2.5" fill="none" stroke-linecap="round"/></svg>`,schlaeft:`<svg viewBox="0 0 100 100"><ellipse cx="50" cy="60" rx="26" ry="24" fill="#e0a458"/><path d="M28 44 L18 20 L38 36 Z" fill="#e0a458"/><path d="M72 44 L82 20 L62 36 Z" fill="#e0a458"/><path d="M34 58 q6 5 12 0" stroke="#4a4032" stroke-width="3" fill="none" stroke-linecap="round"/><path d="M54 58 q6 5 12 0" stroke="#4a4032" stroke-width="3" fill="none" stroke-linecap="round"/><path d="M42 68 Q50 71 58 68" stroke="#8a5a2e" stroke-width="2.5" fill="none" stroke-linecap="round"/></svg>`}],Dr=`gutenacht`,Or=1,kr={lampeAn:!0,schlaeft:[!1,!1,!1]},X={...kr},Ar=[];function jr(e,t,n){e.addEventListener(t,n),Ar.push(()=>e.removeEventListener(t,n))}function Mr(){g(Dr,Or,X)}function Nr(e){X=h(Dr,Or,{...kr,schlaeft:[...kr.schlaeft]}),Ar=[],e.innerHTML=`
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
          ${Er.map((e,t)=>`
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
  `;let t=e.querySelector(`#nachtSzene`);t.classList.toggle(`dunkel`,!X.lampeAn),Pr(e,t),Fr(e)}function Pr(e,t){jr(e.querySelector(`.n-lampe`),`pointerdown`,e=>{e.preventDefault(),X.lampeAn=!X.lampeAn,t.classList.toggle(`dunkel`,!X.lampeAn),u({freq:X.lampeAn?480:320,duration:.18,attack:.01,release:.3,type:`sine`,gain:.18}),Mr()})}function Fr(e){e.querySelectorAll(`.n-tier`).forEach(e=>{let t=Number(e.dataset.idx);jr(e,`pointerdown`,n=>{n.preventDefault();let r=!X.schlaeft[t];X.schlaeft[t]=r,e.classList.toggle(`schlaeft`,r),e.closest(`.n-bett`)?.classList.toggle(`schlaeft`,r),r?(m(),u({freq:392,duration:.2,attack:.01,release:.4,type:`sine`,gain:.16}),window.setTimeout(()=>{u({freq:294,duration:.3,attack:.01,release:.5,type:`sine`,gain:.14})},220)):(u({freq:440,duration:.1,attack:.005,release:.2,type:`triangle`,gain:.2}),window.setTimeout(()=>{u({freq:587.33,duration:.16,attack:.005,release:.25,type:`triangle`,gain:.2})},110)),Mr()})})}function Ir(){Ar.forEach(e=>e()),Ar=[],X={...kr,schlaeft:[...kr.schlaeft]}}var Lr={id:`gutenacht`,accent:`#7ea3c9`,tileIcon:Tr,mount:Nr,unmount:Ir};oe();var Rr=[He,ot,Et,Xt,cn,Nn,Qn,wr,Lr],zr=document.querySelector(`#app`),Br=`
  <svg viewBox="0 0 96 96" width="40" height="40">
    <path d="M56 26 L34 48 L56 70" fill="none" stroke="#8a7255" stroke-width="8"
      stroke-linecap="round" stroke-linejoin="round"/>
  </svg>
`,Vr=18,Hr=2*Math.PI*Vr;zr.innerHTML=`
  <div class="spielzimmer" id="spielzimmer">
    <div class="tiles" id="tiles"></div>
    <button class="eltern-gate" id="elternGate" aria-hidden="true">${`
  <svg viewBox="0 0 44 44">
    <circle cx="22" cy="22" r="${Vr}" fill="none" stroke="#8a7255" stroke-width="3" opacity="0.25"/>
    <circle class="eltern-gate-progress" cx="22" cy="22" r="${Vr}" fill="none"
      stroke="#8a7255" stroke-width="3" stroke-linecap="round"
      stroke-dasharray="${Hr}" stroke-dashoffset="${Hr}"
      transform="rotate(-90 22 22)"/>
    <circle cx="22" cy="22" r="4" fill="#8a7255"/>
  </svg>
`}</button>
  </div>
  <div class="toy-view" id="toyView">
    <div class="toy-stage" id="toyStage"></div>
  </div>
  <button class="back-button" id="backButton" aria-hidden="true">${Br}</button>
  <div class="eltern-overlay" id="elternOverlay">
    <div id="elternPanelWrap"></div>
  </div>
  <div class="version-placeholder">v1.0.0 · 90db049</div>
`;var Ur=document.querySelector(`#spielzimmer`),Wr=document.querySelector(`#tiles`),Gr=document.querySelector(`#toyView`),Kr=document.querySelector(`#toyStage`),qr=document.querySelector(`#backButton`),Z=document.querySelector(`#elternGate`),Jr=document.querySelector(`#elternOverlay`),Yr=document.querySelector(`#elternPanelWrap`),Xr=null,Q=!1;function Zr(){Wr.innerHTML=``,Rr.forEach((e,t)=>{let n=document.createElement(`button`);n.className=`tile`,n.style.setProperty(`--accent`,e.accent),n.style.animationDelay=`${(t*.7%4.5).toFixed(2)}s`,n.innerHTML=e.tileIcon,n.setAttribute(`aria-hidden`,`true`),n.addEventListener(`pointerdown`,t=>{t.preventDefault(),Qr(e)}),Wr.appendChild(n)})}function Qr(e){Q||Xr||(Q=!0,Xr=e,e.mount(Kr),Ur.classList.add(`hidden`),qr.classList.add(`visible`),Gr.classList.add(`active`),window.setTimeout(()=>{Q=!1},450))}function $r(){Q||!Xr||(Q=!0,Gr.classList.remove(`active`),Ur.classList.remove(`hidden`),qr.classList.remove(`visible`),window.setTimeout(()=>{Xr?.unmount?.(),Kr.innerHTML=``,Xr=null,Q=!1},450))}qr.addEventListener(`pointerdown`,e=>{e.preventDefault(),$r()});var ei=3e3,$=null;function ti(){$===null&&(Z.classList.add(`charging`),$=window.setTimeout(()=>{$=null,Z.classList.remove(`charging`),ri()},ei))}function ni(){$!==null&&(window.clearTimeout($),$=null),Z.classList.remove(`charging`)}Z.addEventListener(`pointerdown`,e=>{e.preventDefault(),ti()}),Z.addEventListener(`pointerup`,ni),Z.addEventListener(`pointercancel`,ni),Z.addEventListener(`pointerleave`,ni);function ri(){ce(Yr),Jr.classList.add(`active`)}function ii(){Jr.classList.remove(`active`)}Jr.addEventListener(`pointerdown`,e=>{e.target===Jr&&ii()}),document.addEventListener(`click`,e=>{e.target.closest(`.eltern-close`)&&ii()}),document.addEventListener(`gesturestart`,e=>e.preventDefault()),document.addEventListener(`gesturechange`,e=>e.preventDefault()),document.addEventListener(`dblclick`,e=>e.preventDefault()),document.addEventListener(`contextmenu`,e=>e.preventDefault());var ai=!1;document.addEventListener(`pointerdown`,()=>{i(),ai||(ai=!0,window.setTimeout(()=>{c()&&u({freq:523.25,duration:.15,gain:.25})},80))},{once:!1}),Zr();