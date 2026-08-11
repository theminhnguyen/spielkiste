(function(){let e=document.createElement(`link`).relList;if(e&&e.supports&&e.supports(`modulepreload`))return;for(let e of document.querySelectorAll(`link[rel="modulepreload"]`))n(e);new MutationObserver(e=>{for(let t of e)if(t.type===`childList`)for(let e of t.addedNodes)e.tagName===`LINK`&&e.rel===`modulepreload`&&n(e)}).observe(document,{childList:!0,subtree:!0});function t(e){let t={};return e.integrity&&(t.integrity=e.integrity),e.referrerPolicy&&(t.referrerPolicy=e.referrerPolicy),t.credentials=e.crossOrigin===`use-credentials`?`include`:e.crossOrigin===`anonymous`?`omit`:`same-origin`,t}function n(e){if(e.ep)return;e.ep=!0;let n=t(e);fetch(e.href,n)}})();var e=null,t=null,n=!1;function r(){if(e)return e;let n=window.AudioContext??window.webkitAudioContext;return n?(e=new n,t=e.createGain(),t.gain.value=o(),t.connect(e.destination),e):null}function i(){if(n)return;let e=r();e&&(e.state===`suspended`&&e.resume().catch(()=>{}),n=!0)}var a=.6;function o(){return a}function s(e){a=Math.max(0,Math.min(1,e)),t&&(t.gain.value=a)}function c(){return!!e&&e.state===`running`}var l=[261.63,293.66,329.63,392,440,523.25,587.33,659.25];function u(n){let r=e;if(!r||!t||r.state!==`running`)return;let{freq:i,duration:a=.5,attack:o=.02,release:s=.35,type:c=`sine`,gain:l=.5}=n,u=r.createOscillator();u.type=c,u.frequency.value=i;let d=r.createGain();d.gain.setValueAtTime(0,r.currentTime),d.gain.linearRampToValueAtTime(l,r.currentTime+o),d.gain.linearRampToValueAtTime(0,r.currentTime+o+a+s),u.connect(d),d.connect(t),u.start(),u.stop(r.currentTime+o+a+s+.05)}function d(e=440){u({freq:e,duration:.03,attack:.002,release:.08,type:`triangle`,gain:.3})}function ee(n,r=.28){let i=e;if(!i||!t||i.state!==`running`)return null;let a=i.createOscillator();a.type=`sine`,a.frequency.value=n;let o=i.createGain();o.gain.setValueAtTime(0,i.currentTime),o.gain.linearRampToValueAtTime(r,i.currentTime+.05),a.connect(o),o.connect(t),a.start();let s=!1;return{update(e){s||a.frequency.linearRampToValueAtTime(e,i.currentTime+.06)},stop(){s||(s=!0,o.gain.cancelScheduledValues(i.currentTime),o.gain.setValueAtTime(o.gain.value,i.currentTime),o.gain.linearRampToValueAtTime(0,i.currentTime+.15),a.stop(i.currentTime+.2))}}}var f=null;function te(e){if(f)return f;let t=e.sampleRate*.5,n=e.createBuffer(1,t,e.sampleRate),r=n.getChannelData(0);for(let e=0;e<t;e++)r[e]=Math.random()*2-1;return f=n,n}function p(n){let r=e;if(!r||!t||r.state!==`running`)return;let i=r.createBufferSource();i.buffer=te(r);let a=r.createBiquadFilter();a.type=`bandpass`,a.Q.value=8;let o=n?700:2200,s=n?2200:700;a.frequency.setValueAtTime(o,r.currentTime),a.frequency.linearRampToValueAtTime(s,r.currentTime+.35);let c=r.createGain();c.gain.setValueAtTime(0,r.currentTime),c.gain.linearRampToValueAtTime(.18,r.currentTime+.03),c.gain.linearRampToValueAtTime(0,r.currentTime+.38),i.connect(a),a.connect(c),c.connect(t),i.start(),i.stop(r.currentTime+.4)}function m(){let n=e;if(!n||!t||n.state!==`running`)return;let r=n.createBufferSource();r.buffer=te(n);let i=n.createBiquadFilter();i.type=`lowpass`,i.frequency.setValueAtTime(300,n.currentTime),i.frequency.linearRampToValueAtTime(1400,n.currentTime+.25);let a=n.createGain();a.gain.setValueAtTime(0,n.currentTime),a.gain.linearRampToValueAtTime(.14,n.currentTime+.05),a.gain.linearRampToValueAtTime(0,n.currentTime+.3),r.connect(i),i.connect(a),a.connect(t),r.start(),r.stop(n.currentTime+.32)}var ne=`spielkiste:`;function h(e,t,n){try{let r=localStorage.getItem(ne+e);if(!r)return n;let i=JSON.parse(r);return i.v===t?i.data:n}catch{return n}}function g(e,t,n){try{let r={v:t,data:n};localStorage.setItem(ne+e,JSON.stringify(r))}catch{}}function re(){try{let e=[];for(let t=0;t<localStorage.length;t++){let n=localStorage.key(t);n?.startsWith(ne)&&e.push(n)}e.forEach(e=>localStorage.removeItem(e))}catch{}}var ie=`settings`,ae=1;function oe(){s(h(ie,ae,{volume:.6}).volume)}function se(e){g(ie,ae,{volume:e})}function ce(e){e.innerHTML=`
    <div class="eltern-panel">
      <h1>Spielkiste</h1>
      <p class="eltern-version">Version 1.0.0 · c2e5fe2</p>

      <label class="eltern-field">
        <span>Lautstärke</span>
        <input type="range" min="0" max="100" value="${Math.round(o()*100)}" class="eltern-volume" />
      </label>

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
</svg>`,We=[{id:0,color:`#e88a9a`,note:0,xPct:22,yPct:30,radiusPx:58},{id:1,color:`#7fb99e`,note:1,xPct:50,yPct:22,radiusPx:62},{id:2,color:`#f4c86b`,note:2,xPct:78,yPct:32,radiusPx:56},{id:3,color:`#7ea3c9`,note:3,xPct:30,yPct:68,radiusPx:60},{id:4,color:`#e0a458`,note:4,xPct:58,yPct:74,radiusPx:58},{id:5,color:`#c896d8`,note:5,xPct:80,yPct:66,radiusPx:54}],C=null,Ge=[],Ke=[],w=new Set,qe=null;function Je(e,t,n){e.addEventListener(t,n),Ke.push(()=>e.removeEventListener(t,n))}function Ye(e,t,n){return Math.max(t,Math.min(n,e))}function Xe(e){Ke=[],w=new Set,e.innerHTML=`
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
  `,C=e.querySelector(`#kleckseStage`),Ge=We.map(t=>({def:t,el:e.querySelector(`.klecks[data-id="${t.id}"]`),xPct:t.xPct,yPct:t.yPct,grabbed:!1,lastX:0,lastY:0,lastT:0})),Ge.forEach(e=>{T(e),Ze(e)}),qe=new ResizeObserver(()=>{Ge.forEach(e=>{e.grabbed||T(e)})}),qe.observe(C)}function T(e,t=1,n=1){if(!C)return;let r=C.getBoundingClientRect(),i=e.xPct/100*r.width-e.def.radiusPx,a=e.yPct/100*r.height-e.def.radiusPx;e.el.style.transform=`translate(${i.toFixed(1)}px, ${a.toFixed(1)}px) scale(${t.toFixed(3)}, ${n.toFixed(3)})`}function Ze(e){let t=e.el;Je(t,`pointerdown`,n=>{let r=n;r.preventDefault();try{t.setPointerCapture(r.pointerId)}catch{}e.grabbed=!0,e.lastX=r.clientX,e.lastY=r.clientY,e.lastT=performance.now(),t.classList.add(`grabbed`),u({freq:l[e.def.note%l.length],duration:.35,gain:.35}),$e(e,1.18),et(e)}),Je(t,`pointermove`,t=>{if(!e.grabbed||!C)return;let n=t,r=C.getBoundingClientRect(),i=performance.now(),a=Math.max(1,i-e.lastT),o=(n.clientX-e.lastX)/a,s=(n.clientY-e.lastY)/a;e.lastX=n.clientX,e.lastY=n.clientY,e.lastT=i,e.xPct=Ye((n.clientX-r.left)/r.width*100,6,94),e.yPct=Ye((n.clientY-r.top)/r.height*100,8,92),Qe(e,o,s),rt(e)});function n(n){if(!e.grabbed)return;e.grabbed=!1,t.classList.remove(`grabbed`);let r=n;if(r.pointerId!==void 0)try{t.releasePointerCapture(r.pointerId)}catch{}T(e,1,1)}Je(t,`pointerup`,n),Je(t,`pointercancel`,n)}function Qe(e,t,n){let r=Math.min(Math.hypot(t,n)*6,.28),i=Math.atan2(n,t);T(e,1+r*Math.abs(Math.cos(i)),1-r*Math.abs(Math.cos(i))*.6+r*Math.abs(Math.sin(i))*.1)}function $e(e,t){T(e,t,t),window.setTimeout(()=>{e.el.classList.contains(`grabbed`)||T(e,1,1)},160)}function et(e){e.el.classList.remove(`singt`),e.el.offsetWidth,e.el.classList.add(`singt`),window.setTimeout(()=>e.el.classList.remove(`singt`),300)}function tt(e){e.el.classList.remove(`funkt`),e.el.offsetWidth,e.el.classList.add(`funkt`),window.setTimeout(()=>e.el.classList.remove(`funkt`),420)}function nt(e,t){return e<t?`${e}-${t}`:`${t}-${e}`}function rt(e){if(!C)return;let t=C.getBoundingClientRect(),n=e.xPct/100*t.width,r=e.yPct/100*t.height;for(let i of Ge){if(i.def.id===e.def.id)continue;let a=i.xPct/100*t.width,o=i.yPct/100*t.height,s=Math.hypot(n-a,r-o),c=e.def.radiusPx*.75+i.def.radiusPx*.75,d=nt(e.def.id,i.def.id);s<c?w.has(d)||(w.add(d),u({freq:l[e.def.note%l.length],duration:.25,gain:.22}),u({freq:l[i.def.note%l.length],duration:.25,gain:.22}),$e(i,1.1),tt(e),tt(i)):w.delete(d)}}function it(){Ke.forEach(e=>e()),Ke=[],qe?.disconnect(),qe=null,Ge=[],C=null,w=new Set}var at={id:`kleckse`,accent:`#e88a9a`,tileIcon:Ue,mount:Xe,unmount:it},ot=`
<svg viewBox="0 0 120 120" width="100%" height="100%">
  <path d="M30 90 L80 30 L95 45 L45 95 Z" fill="#fdf6ea" stroke="#7ea3c9" stroke-width="4" stroke-linejoin="round"/>
  <circle cx="34" cy="92" r="10" fill="#7ea3c9"/>
  <circle cx="70" cy="40" r="8" fill="#e88a9a"/>
</svg>`,st=[`#e88a9a`,`#7fb99e`,`#f4c86b`,`#7ea3c9`,`#e0a458`,`#6b5d4a`],ct=`malen`,lt=1,E=null,D=null,O=null,ut=st[0],k=!1,dt=0,ft=0,pt=[],A=null,mt=null;function j(e,t,n){e.addEventListener(t,n),pt.push(()=>e.removeEventListener(t,n))}function ht(e){pt=[],k=!1,ut=st[0],e.innerHTML=`
    <div class="malen-stage" id="malenStage">
      <canvas class="malen-canvas" id="malenCanvas"></canvas>
      <div class="malen-palette" id="malenPalette">
        ${st.map((e,t)=>`<button class="malen-swatch${t===0?` selected`:``}" data-color="${e}" style="--swatch-color:${e}" aria-hidden="true"></button>`).join(``)}
      </div>
      <button class="malen-new-sheet" id="malenNewSheet" aria-hidden="true">
        <svg viewBox="0 0 48 48" width="30" height="30">
          <path d="M10 6 h20 l8 8 v28 h-28 z" fill="#fffaf2" stroke="#8a7255" stroke-width="2.5" stroke-linejoin="round"/>
          <path d="M30 6 v8 h8" fill="none" stroke="#8a7255" stroke-width="2.5" stroke-linejoin="round"/>
        </svg>
      </button>
    </div>
  `,O=e.querySelector(`#malenStage`),E=e.querySelector(`#malenCanvas`),D=E.getContext(`2d`),gt(),_t(),j(E,`pointerdown`,bt),j(E,`pointermove`,xt),j(E,`pointerup`,St),j(E,`pointercancel`,St);let t=e.querySelectorAll(`.malen-swatch`);t.forEach(e=>{j(e,`pointerdown`,n=>{n.preventDefault(),ut=e.dataset.color??st[0],t.forEach(e=>e.classList.remove(`selected`)),e.classList.add(`selected`),d(500)})}),j(e.querySelector(`#malenNewSheet`),`pointerdown`,e=>{e.preventDefault(),Ct()});let n=O.clientWidth,r=O.clientHeight,i=()=>{if(!O)return;let e=O.clientWidth,t=O.clientHeight;(e!==n||t!==r)&&(n=e,r=t,A!==null&&window.clearTimeout(A),A=window.setTimeout(()=>{gt(),_t()},200))};mt=new ResizeObserver(i),mt.observe(O),j(window,`resize`,i),j(window,`orientationchange`,i)}function gt(){if(!E||!O)return;let e=Math.min(window.devicePixelRatio||1,2),t={width:O.clientWidth,height:O.clientHeight};E.width=Math.round(t.width*e),E.height=Math.round(t.height*e),E.style.width=`${t.width}px`,E.style.height=`${t.height}px`,D=E.getContext(`2d`),D&&(D.scale(e,e),D.lineCap=`round`,D.lineJoin=`round`,D.lineWidth=22)}function _t(){let e=h(ct,lt,{dataUrl:null});if(!e.dataUrl||!E||!D)return;let t=new Image;t.onload=()=>{if(!D||!E)return;let e=Math.min(window.devicePixelRatio||1,2);D.drawImage(t,0,0,E.width/e,E.height/e)},t.src=e.dataUrl}function vt(){if(E)try{g(ct,lt,{dataUrl:E.toDataURL(`image/png`)})}catch{}}function yt(e){let t=E,n=t.getBoundingClientRect(),r=n.width===0?1:t.clientWidth/n.width,i=n.height===0?1:t.clientHeight/n.height;return{x:(e.clientX-n.left)*r,y:(e.clientY-n.top)*i}}function bt(e){let t=e;if(t.preventDefault(),!E||!D)return;try{E.setPointerCapture(t.pointerId)}catch{}k=!0;let{x:n,y:r}=yt(t);dt=n,ft=r,D.strokeStyle=ut,D.fillStyle=ut,D.beginPath(),D.arc(n,r,D.lineWidth/2,0,Math.PI*2),D.fill()}function xt(e){if(!k||!D)return;let{x:t,y:n}=yt(e);D.beginPath(),D.moveTo(dt,ft),D.lineTo(t,n),D.stroke(),dt=t,ft=n}function St(e){if(!k)return;k=!1;let t=e;if(E&&t.pointerId!==void 0)try{E.releasePointerCapture(t.pointerId)}catch{}vt()}function Ct(){if(!E||!D||!O)return;let e=E.toDataURL(`image/png`),t=document.createElement(`img`);t.src=e,t.className=`malen-crumple-overlay`,t.style.width=E.style.width,t.style.height=E.style.height,O.appendChild(t);let n=Math.min(window.devicePixelRatio||1,2);D.clearRect(0,0,E.width/n,E.height/n),g(ct,lt,{dataUrl:null}),d(300),t.offsetWidth,t.classList.add(`crumpling`),window.setTimeout(()=>{t.remove()},550)}function wt(){pt.forEach(e=>e()),pt=[],mt?.disconnect(),mt=null,A!==null&&(window.clearTimeout(A),A=null),E=null,D=null,O=null}var Tt={id:`malen`,accent:`#7ea3c9`,tileIcon:ot,mount:ht,unmount:wt},Et=`
<svg viewBox="0 0 120 120" width="100%" height="100%">
  <circle cx="48" cy="46" r="26" fill="none" stroke="#7ec8d8" stroke-width="5"/>
  <circle cx="40" cy="38" r="7" fill="#bfe6ee"/>
  <circle cx="84" cy="72" r="17" fill="none" stroke="#a8d8e0" stroke-width="4"/>
  <circle cx="79" cy="67" r="5" fill="#d6f0f5"/>
  <circle cx="42" cy="90" r="11" fill="none" stroke="#c8b6e0" stroke-width="4"/>
</svg>`,Dt=[`rgba(126, 200, 216, 0.55)`,`rgba(200, 182, 224, 0.55)`,`rgba(244, 200, 107, 0.45)`,`rgba(232, 138, 154, 0.45)`,`rgba(127, 185, 158, 0.5)`],Ot=14,kt=900,M=null,N=[],P=null,At=[];function jt(e,t,n){e.addEventListener(t,n),N.push(()=>e.removeEventListener(t,n))}function Mt(e){N=[],At=[],e.innerHTML=`
    <div class="blasen-stage" id="blasenStage">
      <div class="blasen-layer" id="blasenLayer"></div>
      <div class="blasen-wand" id="blasenWand">
        <div class="wand-ring"></div>
        <div class="wand-stick"></div>
      </div>
    </div>
  `,M=e.querySelector(`#blasenLayer`);let t=e.querySelector(`#blasenWand`);for(let e=0;e<6;e++)Nt(.3+Math.random()*.5);P=window.setInterval(()=>Nt(),kt),N.push(()=>{P!==null&&window.clearInterval(P),P=null}),jt(M,`pointerdown`,e=>{let t=e,n=t.target.closest(`.blase`);n&&(t.preventDefault(),Pt(n))}),jt(t,`pointerdown`,e=>{e.preventDefault(),t.classList.remove(`puff`),t.offsetWidth,t.classList.add(`puff`);for(let e=0;e<5;e++)window.setTimeout(()=>Nt(0,!0),e*110);u({freq:220,duration:.28,attack:.06,release:.35,type:`sine`,gain:.12})})}function Nt(e=0,t=!1){if(!M||M.childElementCount>=Ot)return;let n=42+Math.random()*58,r=Dt[Math.floor(Math.random()*Dt.length)],i=t?14+Math.random()*16:6+Math.random()*88,a=(Math.random()*2-1)*40,o=9e3+Math.random()*5e3,s=document.createElement(`div`);s.className=`blase`,s.style.width=`${n}px`,s.style.height=`${n}px`,s.style.left=`${i}%`,s.style.setProperty(`--tint`,r),s.style.setProperty(`--drift`,`${a}px`),s.style.animationDuration=`${o}ms`,s.style.animationDelay=`${-e*o}ms`,s.innerHTML=`<span class="blase-glanz"></span>`,s.addEventListener(`animationend`,()=>s.remove()),M.appendChild(s)}function Pt(e){if(e.classList.contains(`platzt`))return;e.classList.add(`platzt`);let t=l[Math.floor(Math.random()*l.length)];u({freq:t*2,duration:.06,attack:.002,release:.16,type:`sine`,gain:.22});let n=window.setTimeout(()=>e.remove(),340);At.push(n)}function Ft(){N.forEach(e=>e()),N=[],P!==null&&(window.clearInterval(P),P=null),At.forEach(e=>window.clearTimeout(e)),At=[],M=null}var It={id:`blasen`,accent:`#7ec8d8`,tileIcon:Et,mount:Mt,unmount:Ft},Lt=`
<svg viewBox="0 0 120 120" width="100%" height="100%">
  <rect x="22" y="30" width="76" height="58" rx="10" fill="#cbb98a"/>
  <rect x="30" y="38" width="60" height="42" rx="6" fill="#bfe6ee"/>
  <path d="M34 74 L54 46" stroke="#fffaf2" stroke-width="9" stroke-linecap="round"/>
  <path d="M52 76 L70 52" stroke="#fffaf2" stroke-width="7" stroke-linecap="round"/>
  <circle cx="84" cy="92" r="13" fill="#7ec8d8"/>
</svg>`,F=[{clean:`<svg viewBox="0 0 200 200">
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
    </svg>`,dirt:`#7d6b52`,fleck:`#5f5040`}],Rt=34,zt=.82,I=null,L=null,R=null,z=0,Bt=!1,Vt=[],B=null,Ht=null,Ut=[],V=new Map;function H(e,t,n){e.addEventListener(t,n),Vt.push(()=>e.removeEventListener(t,n))}function Wt(e){Vt=[],V.clear(),Ut=[],z=0,Bt=!1,e.innerHTML=`
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
  `,R=e.querySelector(`#putzenStage`),I=e.querySelector(`#putzenCanvas`),Gt(e,0),H(I,`pointerdown`,Yt),H(I,`pointermove`,Xt),H(I,`pointerup`,Zt),H(I,`pointercancel`,Zt),H(e.querySelector(`#putzenNext`),`pointerdown`,t=>{t.preventDefault(),Gt(e,z+1),m()});let t=R.clientWidth,n=R.clientHeight,r=()=>{if(!R)return;let e=R.clientWidth,r=R.clientHeight;(e!==t||r!==n)&&(t=e,n=r,B!==null&&window.clearTimeout(B),B=window.setTimeout(()=>Kt(),220))};Ht=new ResizeObserver(r),Ht.observe(R),H(window,`resize`,r),H(window,`orientationchange`,r)}function Gt(e,t){z=(t%F.length+F.length)%F.length,Bt=!1,R?.classList.remove(`sauber`);let n=e.querySelector(`#putzenMotiv`);n.innerHTML=F[z].clean,Kt()}function Kt(){if(!I||!R)return;let e=Math.min(window.devicePixelRatio||1,2),t=R.clientWidth,n=R.clientHeight;I.width=Math.round(t*e),I.height=Math.round(n*e),I.style.width=`${t}px`,I.style.height=`${n}px`,L=I.getContext(`2d`,{willReadFrequently:!0}),L&&(L.scale(e,e),qt(t,n))}function qt(e,t){if(!L)return;let n=F[z];L.globalCompositeOperation=`source-over`,L.clearRect(0,0,e,t),L.fillStyle=n.dirt,L.fillRect(0,0,e,t),L.fillStyle=n.fleck;for(let n=0;n<140;n++){let n=Math.random()*e,r=Math.random()*t,i=6+Math.random()*26;L.globalAlpha=.18+Math.random()*.3,L.beginPath(),L.ellipse(n,r,i,i*(.6+Math.random()*.7),Math.random()*Math.PI,0,Math.PI*2),L.fill()}L.globalAlpha=1}function Jt(e){let t=I,n=t.getBoundingClientRect(),r=n.width===0?1:t.clientWidth/n.width,i=n.height===0?1:t.clientHeight/n.height;return{x:(e.clientX-n.left)*r,y:(e.clientY-n.top)*i}}function Yt(e){let t=e;if(t.preventDefault(),!I||!L)return;try{I.setPointerCapture(t.pointerId)}catch{}let n=Jt(t);V.set(t.pointerId,n),Qt(n.x,n.y),tn()}function Xt(e){let t=e,n=V.get(t.pointerId);if(!n||!L)return;let r=Jt(t);$t(n.x,n.y,r.x,r.y),V.set(t.pointerId,r),tn()}function Zt(e){let t=e;if(V.has(t.pointerId)){if(V.delete(t.pointerId),I)try{I.releasePointerCapture(t.pointerId)}catch{}rn()}}function Qt(e,t){L&&(L.globalCompositeOperation=`destination-out`,L.beginPath(),L.arc(e,t,Rt,0,Math.PI*2),L.fill())}function $t(e,t,n,r){L&&(L.globalCompositeOperation=`destination-out`,L.lineCap=`round`,L.lineJoin=`round`,L.lineWidth=68,L.beginPath(),L.moveTo(e,t),L.lineTo(n,r),L.stroke())}var en=0;function tn(){let e=performance.now();e-en<130||(en=e,u({freq:180+Math.random()*90,duration:.05,attack:.01,release:.1,type:`triangle`,gain:.07}))}function nn(){if(!I||!L)return 0;let e=0,t=0,n=I.width/24,r=I.height/24;for(let i=0;i<24;i++)for(let a=0;a<24;a++){let o=Math.min(I.width-1,Math.floor(i*n+n/2)),s=Math.min(I.height-1,Math.floor(a*r+r/2));L.getImageData(o,s,1,1).data[3]<40&&e++,t++}return t===0?0:e/t}function rn(){if(!Bt&&!(nn()<zt)){if(Bt=!0,L&&I){let e=Math.min(window.devicePixelRatio||1,2);L.globalCompositeOperation=`destination-out`,L.fillStyle=`#000`,L.fillRect(0,0,I.width/e,I.height/e)}R?.classList.add(`sauber`),[0,130,260].forEach((e,t)=>{let n=window.setTimeout(()=>{u({freq:l[t+3],duration:.3,attack:.01,release:.5,gain:.24})},e);Ut.push(n)})}}function an(){Vt.forEach(e=>e()),Vt=[],Ht?.disconnect(),Ht=null,B!==null&&(window.clearTimeout(B),B=null),Ut.forEach(e=>window.clearTimeout(e)),Ut=[],V.clear(),I=null,L=null,R=null}var on={id:`putzen`,accent:`#7ec8d8`,tileIcon:Lt,mount:Wt,unmount:an},sn=`
<svg viewBox="0 0 120 120" width="100%" height="100%">
  <rect x="16" y="22" width="88" height="66" rx="10" fill="#dff0e4"/>
  <path d="M16 72 Q40 54 62 72 Q82 56 104 72 L104 88 H16 Z" fill="#9ec99f"/>
  <circle cx="86" cy="40" r="12" fill="#f7d570"/>
  <ellipse cx="46" cy="60" rx="13" ry="11" fill="#e88a9a"/>
  <circle cx="42" cy="57" r="2.5" fill="#4a4032"/>
  <circle cx="50" cy="57" r="2.5" fill="#4a4032"/>
  <path d="M74 92 l7 -13 l7 13 z" fill="#7fb99e"/>
</svg>`,cn=[{id:`hase`,size:82,note:0,svg:`<svg viewBox="0 0 100 100"><ellipse cx="50" cy="64" rx="26" ry="28" fill="#f3e7db"/><ellipse cx="38" cy="24" rx="8" ry="20" fill="#f3e7db"/><ellipse cx="62" cy="24" rx="8" ry="20" fill="#f3e7db"/><ellipse cx="38" cy="26" rx="4" ry="13" fill="#f2b8c6"/><ellipse cx="62" cy="26" rx="4" ry="13" fill="#f2b8c6"/><circle cx="41" cy="60" r="4" fill="#4a4032"/><circle cx="59" cy="60" r="4" fill="#4a4032"/><ellipse cx="50" cy="70" rx="5" ry="3.5" fill="#e88a9a"/></svg>`},{id:`baum`,size:96,note:1,svg:`<svg viewBox="0 0 100 100"><rect x="43" y="58" width="14" height="36" rx="5" fill="#a9835e"/><circle cx="50" cy="40" r="28" fill="#7fb99e"/><circle cx="30" cy="50" r="18" fill="#8fc4a8"/><circle cx="70" cy="50" r="18" fill="#8fc4a8"/></svg>`},{id:`blume`,size:72,note:2,svg:`<svg viewBox="0 0 100 100"><rect x="46" y="52" width="8" height="42" rx="4" fill="#7fb99e"/><ellipse cx="30" cy="62" rx="14" ry="7" fill="#8fc4a8"/><g><ellipse cx="50" cy="26" rx="11" ry="17" fill="#e88a9a"/><ellipse cx="50" cy="26" rx="11" ry="17" fill="#e88a9a" transform="rotate(72 50 40)"/><ellipse cx="50" cy="26" rx="11" ry="17" fill="#e88a9a" transform="rotate(144 50 40)"/><ellipse cx="50" cy="26" rx="11" ry="17" fill="#e88a9a" transform="rotate(216 50 40)"/><ellipse cx="50" cy="26" rx="11" ry="17" fill="#e88a9a" transform="rotate(288 50 40)"/></g><circle cx="50" cy="40" r="10" fill="#f4c86b"/></svg>`},{id:`sonne`,size:78,note:3,svg:`<svg viewBox="0 0 100 100"><g stroke="#f4c86b" stroke-width="7" stroke-linecap="round"><line x1="50" y1="8" x2="50" y2="20"/><line x1="50" y1="80" x2="50" y2="92"/><line x1="8" y1="50" x2="20" y2="50"/><line x1="80" y1="50" x2="92" y2="50"/><line x1="20" y1="20" x2="28" y2="28"/><line x1="72" y1="72" x2="80" y2="80"/><line x1="20" y1="80" x2="28" y2="72"/><line x1="72" y1="28" x2="80" y2="20"/></g><circle cx="50" cy="50" r="24" fill="#f7d570"/><circle cx="42" cy="46" r="3" fill="#c99a3c"/><circle cx="58" cy="46" r="3" fill="#c99a3c"/><path d="M43 56 Q50 62 57 56" stroke="#c99a3c" stroke-width="3" fill="none" stroke-linecap="round"/></svg>`},{id:`wolke`,size:92,note:4,svg:`<svg viewBox="0 0 100 100"><g fill="#fffaf2" stroke="#bcd6e0" stroke-width="3"><ellipse cx="38" cy="58" rx="22" ry="18"/><ellipse cx="62" cy="58" rx="20" ry="16"/><ellipse cx="50" cy="46" rx="20" ry="18"/></g></svg>`},{id:`vogel`,size:70,note:5,svg:`<svg viewBox="0 0 100 100"><ellipse cx="52" cy="56" rx="24" ry="19" fill="#7ea3c9"/><circle cx="34" cy="44" r="14" fill="#8fb3d4"/><path d="M22 44 l-12 5 l12 5 z" fill="#f4a56b"/><circle cx="31" cy="41" r="3" fill="#4a4032"/><path d="M56 52 q14 -8 22 2 q-12 8 -22 -2z" fill="#6b93bd"/><path d="M70 66 l14 8" stroke="#f4a56b" stroke-width="5" stroke-linecap="round"/></svg>`},{id:`pilz`,size:68,note:6,svg:`<svg viewBox="0 0 100 100"><rect x="40" y="52" width="20" height="38" rx="8" fill="#f3e7db"/><path d="M14 54 a36 30 0 0 1 72 0 z" fill="#e88a9a"/><circle cx="36" cy="40" r="7" fill="#fffaf2"/><circle cx="62" cy="34" r="5" fill="#fffaf2"/><circle cx="54" cy="48" r="4" fill="#fffaf2"/></svg>`},{id:`stern`,size:62,note:7,svg:`<svg viewBox="0 0 100 100"><path d="M50 8 L61 38 L93 38 L67 57 L77 88 L50 69 L23 88 L33 57 L7 38 L39 38 Z" fill="#f4c86b"/></svg>`}],ln=`sticker`,un=1,dn=60,U=[],W=null,G=null,K=null,fn=[];function pn(e,t,n){e.addEventListener(t,n),fn.push(()=>e.removeEventListener(t,n))}function mn(e){return cn.find(t=>t.id===e)??cn[0]}function hn(){g(ln,un,{placed:U})}function gn(e){fn=[],U=h(ln,un,{placed:[]}).placed,e.innerHTML=`
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
        ${cn.map(e=>`<div class="tray-item" data-art="${e.id}" style="width:${e.size*.62}px;height:${e.size*.62}px">${e.svg}</div>`).join(``)}
      </div>
    </div>
  `,W=e.querySelector(`#stickerStage`),G=e.querySelector(`#stickerSzene`),K=e.querySelector(`#stickerTray`),_n(),yn(e),K.querySelectorAll(`.tray-item`).forEach(e=>{pn(e,`pointerdown`,t=>Cn(t,e))})}function _n(){let e=document.getElementById(`stickerPlatziert`);e&&(e.innerHTML=``,U.forEach((t,n)=>{let r=mn(t.art),i=document.createElement(`div`);i.className=`sticker`,i.dataset.index=String(n),i.style.width=`${r.size}px`,i.style.height=`${r.size}px`,i.style.left=`${t.xPct}%`,i.style.top=`${t.yPct}%`,i.style.setProperty(`--rot`,`${t.rot}deg`),i.innerHTML=r.svg,e.appendChild(i),vn(i,n)}))}function vn(e,t){let n=!1,r=0,i=0,a=0;e.addEventListener(`pointerdown`,t=>{t.preventDefault(),t.stopPropagation(),n=!0,r=0,i=t.clientX,a=t.clientY,e.classList.add(`greift`);try{e.setPointerCapture(t.pointerId)}catch{}}),e.addEventListener(`pointermove`,o=>{if(!n||!G)return;r=Math.max(r,Math.hypot(o.clientX-i,o.clientY-a));let s=G.getBoundingClientRect(),c=U[t];c&&(c.xPct=Sn((o.clientX-s.left)/s.width*100,2,98),c.yPct=Sn((o.clientY-s.top)/s.height*100,2,98),e.style.left=`${c.xPct}%`,e.style.top=`${c.yPct}%`)});let o=i=>{if(n){n=!1,e.classList.remove(`greift`);try{e.releasePointerCapture(i.pointerId)}catch{}if(K&&xn(i.clientX,i.clientY)){U.splice(t,1),hn(),_n(),d(300);return}r<10&&(e.classList.remove(`wackelt`),e.offsetWidth,e.classList.add(`wackelt`),u({freq:l[mn(U[t]?.art??cn[0].id).note%l.length],duration:.3,gain:.28})),hn()}};e.addEventListener(`pointerup`,o),e.addEventListener(`pointercancel`,o)}function yn(e){pn(e.querySelector(`#stickerClear`),`pointerdown`,e=>{e.preventDefault(),U.length!==0&&bn()})}function bn(){let e=document.getElementById(`stickerPlatziert`);if(!e)return;let t=[...e.querySelectorAll(`.sticker`)];t.forEach((e,t)=>{e.style.transitionDelay=`${Math.min(t*25,500)}ms`,e.offsetWidth,e.classList.add(`wegfegen`)}),m(),window.setTimeout(()=>{U=[],hn(),_n()},500+Math.min(t.length*25,500))}function xn(e,t){if(!K)return!1;let n=K.getBoundingClientRect();return e>=n.left&&e<=n.right&&t>=n.top&&t<=n.bottom}function Sn(e,t,n){return Math.max(t,Math.min(n,e))}function Cn(e,t){if(e.preventDefault(),!W)return;let n=mn(t.dataset.art??``);try{t.setPointerCapture(e.pointerId)}catch{}let r=document.createElement(`div`);r.className=`sticker-ghost`,r.style.width=`${n.size}px`,r.style.height=`${n.size}px`,r.innerHTML=n.svg,W.appendChild(r);let i=(e,t)=>{let n=W.getBoundingClientRect();r.style.left=`${e-n.left}px`,r.style.top=`${t-n.top}px`};i(e.clientX,e.clientY),d(560);let a=!1;function o(e){let t=e;i(t.clientX,t.clientY)}function s(e){if(a)return;a=!0;let i=e;try{t.releasePointerCapture(i.pointerId)}catch{}t.removeEventListener(`pointermove`,o),t.removeEventListener(`pointerup`,s),t.removeEventListener(`pointercancel`,s),r.remove(),wn(n,i.clientX,i.clientY)}t.addEventListener(`pointermove`,o),t.addEventListener(`pointerup`,s),t.addEventListener(`pointercancel`,s)}function wn(e,t,n){if(!G||xn(t,n))return;let r=G.getBoundingClientRect();n>r.bottom||n<r.top||(U.length>=dn&&U.shift(),U.push({art:e.id,xPct:Sn((t-r.left)/r.width*100,2,98),yPct:Sn((n-r.top)/r.height*100,2,98),rot:Math.round((Math.random()*2-1)*9)}),hn(),_n(),u({freq:l[e.note%l.length],duration:.28,gain:.3}))}function Tn(){fn.forEach(e=>e()),fn=[],U=[],W=null,G=null,K=null}var En={id:`sticker`,accent:`#9ec99f`,tileIcon:sn,mount:gn,unmount:Tn},Dn=`
<svg viewBox="0 0 120 120" width="100%" height="100%">
  <circle cx="94" cy="26" r="14" fill="#f7d570"/>
  <path d="M20 100 L20 60 L46 38 L72 60 L72 100 Z" fill="#f3e7db" stroke="#c9a37e" stroke-width="3"/>
  <path d="M14 62 L46 34 L78 62 Z" fill="#e88a9a"/>
  <rect x="38" y="76" width="16" height="24" rx="2" fill="#a9835e"/>
  <circle cx="30" cy="10" r="8" fill="#9ec99f" opacity="0.7"/>
</svg>`,On=`wimmelbild`,kn=1,An={tuerOffen:!1,vorhangOffen:!1,flaggeOben:!1},q={...An},jn=[],Mn=[],J=new Set;function Nn(e,t,n){e.addEventListener(t,n),jn.push(()=>e.removeEventListener(t,n))}function Pn(){g(On,kn,q)}function Fn(e,t){let n=window.setTimeout(e,t);Mn.push(n)}function Y(e,t,n){let r=e.querySelector(t),i=t;Nn(r,`pointerdown`,e=>{e.preventDefault(),!J.has(i)&&(J.add(i),r.classList.remove(n.className),r.offsetWidth,r.classList.add(n.className),n.onTrigger?.(r),n.sound?.(),Fn(()=>{r.classList.remove(n.className),J.delete(i)},n.duration))})}function In(e){q=h(On,kn,{...An}),jn=[],Mn=[],J=new Set,e.innerHTML=`
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
  `,Ln(e),Rn(e),zn(e),Bn(e),Vn(e),Hn(e),Un(e),Wn(e),Gn(e),Kn(e),qn(e),Jn(e),Yn(e),Xn(e)}function Ln(e){Y(e,`.w-sonne`,{className:`strahlt`,duration:700,sound:()=>{u({freq:1046.5,duration:.35,attack:.01,release:.5,type:`sine`,gain:.22}),u({freq:1567.98,duration:.25,attack:.01,release:.4,type:`sine`,gain:.1})}})}function Rn(e){Y(e,`.w-wolke`,{className:`zieht-vorbei`,duration:2400,sound:()=>m()})}function zn(e){Y(e,`.w-schornstein`,{className:`pufft`,duration:1400,sound:()=>u({freq:260,duration:.15,attack:.01,release:.3,type:`sine`,gain:.16})})}function Bn(e){let t=e.querySelector(`.w-tuer`);t.classList.toggle(`offen`,q.tuerOffen),Nn(t,`pointerdown`,e=>{e.preventDefault(),q.tuerOffen=!q.tuerOffen,t.classList.toggle(`offen`,q.tuerOffen),m(),q.tuerOffen&&(u({freq:587.33,duration:.12,attack:.005,release:.15,type:`triangle`,gain:.2}),Fn(()=>u({freq:493.88,duration:.18,attack:.005,release:.25,type:`triangle`,gain:.2}),130)),Pn()})}function Vn(e){let t=e.querySelector(`.w-fenster`);t.classList.toggle(`offen`,q.vorhangOffen),Nn(t,`pointerdown`,e=>{e.preventDefault(),q.vorhangOffen=!q.vorhangOffen,t.classList.toggle(`offen`,q.vorhangOffen),m(),Pn()})}function Hn(e){Y(e,`.w-apfel`,{className:`faellt`,duration:900,sound:()=>u({freq:220,duration:.09,attack:.004,release:.14,type:`sine`,gain:.28})})}function Un(e){Y(e,`.w-vogelhaus`,{className:`fliegt`,duration:1600,sound:()=>{[0,90,180].forEach((e,t)=>{Fn(()=>u({freq:l[(4+t)%l.length],duration:.14,attack:.005,release:.2,type:`triangle`,gain:.22}),e)})}})}function Wn(e){let t=e.querySelector(`.w-schaukel`),n=t.querySelector(`.schaukel-sitz`),r=`schaukel`;Nn(t,`pointerdown`,e=>{e.preventDefault(),!J.has(r)&&(J.add(r),n.classList.remove(`schwingt`),n.offsetWidth,n.classList.add(`schwingt`),[0,350,700,1050].forEach(e=>{Fn(()=>u({freq:380,duration:.05,attack:.005,release:.1,type:`sine`,gain:.1}),e)}),Fn(()=>{n.classList.remove(`schwingt`),J.delete(r)},2200))})}function Gn(e){Y(e,`.w-biene`,{className:`summt`,duration:1300,sound:()=>u({freq:660,duration:.5,attack:.02,release:.4,type:`sawtooth`,gain:.06})})}function Kn(e){Y(e,`.w-maulwurfshuegel`,{className:`guckt`,duration:1200,sound:()=>u({freq:180,duration:.12,attack:.005,release:.2,type:`sine`,gain:.24})})}function qn(e){let t=e.querySelector(`.w-briefkasten`);t.classList.toggle(`offen`,q.flaggeOben),Nn(t,`pointerdown`,e=>{e.preventDefault(),q.flaggeOben=!q.flaggeOben,t.classList.toggle(`offen`,q.flaggeOben),d(q.flaggeOben?700:500),Pn()})}function Jn(e){Y(e,`.w-frosch`,{className:`huepft`,duration:700,sound:()=>u({freq:200,duration:.1,attack:.004,release:.16,type:`square`,gain:.18})})}function Yn(e){Y(e,`.w-schnecke`,{className:`streckt`,duration:900,sound:()=>d(520)})}function Xn(e){Y(e,`.w-marienkaefer`,{className:`fliegt-los`,duration:1100,sound:()=>u({freq:900,duration:.3,attack:.02,release:.3,type:`sawtooth`,gain:.05})})}function Zn(){jn.forEach(e=>e()),jn=[],Mn.forEach(e=>window.clearTimeout(e)),Mn=[],J=new Set}var Qn={id:`wimmelbild`,accent:`#9ec99f`,tileIcon:Dn,mount:In,unmount:Zn},$n=`
<svg viewBox="0 0 120 120" width="100%" height="100%">
  <path d="M78 20 a34 34 0 1 0 22 56 a26 26 0 1 1 -22 -56 Z" fill="#7ea3c9"/>
  <path d="M32 34 l4 10 l10 4 l-10 4 l-4 10 l-4 -10 l-10 -4 l10 -4 Z" fill="#f4c86b"/>
  <rect x="14" y="86" width="46" height="20" rx="6" fill="#e0a458"/>
  <circle cx="26" cy="86" r="8" fill="#f3e7db"/>
</svg>`,er=[{id:`baer`,bettFarbe:`#e0a458`,wach:`<svg viewBox="0 0 100 100"><circle cx="50" cy="58" r="30" fill="#c9a37e"/><circle cx="24" cy="34" r="12" fill="#c9a37e"/><circle cx="76" cy="34" r="12" fill="#c9a37e"/><circle cx="40" cy="56" r="4" fill="#4a4032"/><circle cx="60" cy="56" r="4" fill="#4a4032"/><ellipse cx="50" cy="68" rx="8" ry="5" fill="#8a7255"/></svg>`,schlaeft:`<svg viewBox="0 0 100 100"><circle cx="50" cy="58" r="30" fill="#c9a37e"/><circle cx="24" cy="34" r="12" fill="#c9a37e"/><circle cx="76" cy="34" r="12" fill="#c9a37e"/><path d="M34 56 q6 5 12 0" stroke="#4a4032" stroke-width="3" fill="none" stroke-linecap="round"/><path d="M54 56 q6 5 12 0" stroke="#4a4032" stroke-width="3" fill="none" stroke-linecap="round"/><ellipse cx="50" cy="68" rx="8" ry="5" fill="#8a7255"/></svg>`},{id:`hase`,bettFarbe:`#e88a9a`,wach:`<svg viewBox="0 0 100 100"><ellipse cx="50" cy="62" rx="26" ry="26" fill="#f3e7db"/><ellipse cx="38" cy="24" rx="8" ry="20" fill="#f3e7db"/><ellipse cx="62" cy="24" rx="8" ry="20" fill="#f3e7db"/><ellipse cx="38" cy="26" rx="4" ry="13" fill="#f2b8c6"/><ellipse cx="62" cy="26" rx="4" ry="13" fill="#f2b8c6"/><circle cx="41" cy="58" r="4" fill="#4a4032"/><circle cx="59" cy="58" r="4" fill="#4a4032"/><ellipse cx="50" cy="68" rx="5" ry="3.5" fill="#e88a9a"/></svg>`,schlaeft:`<svg viewBox="0 0 100 100"><ellipse cx="50" cy="62" rx="26" ry="26" fill="#f3e7db"/><ellipse cx="38" cy="24" rx="8" ry="20" fill="#f3e7db"/><ellipse cx="62" cy="24" rx="8" ry="20" fill="#f3e7db"/><ellipse cx="38" cy="26" rx="4" ry="13" fill="#f2b8c6"/><ellipse cx="62" cy="26" rx="4" ry="13" fill="#f2b8c6"/><path d="M35 58 q6 5 12 0" stroke="#4a4032" stroke-width="3" fill="none" stroke-linecap="round"/><path d="M53 58 q6 5 12 0" stroke="#4a4032" stroke-width="3" fill="none" stroke-linecap="round"/><ellipse cx="50" cy="68" rx="5" ry="3.5" fill="#e88a9a"/></svg>`},{id:`katze`,bettFarbe:`#7ea3c9`,wach:`<svg viewBox="0 0 100 100"><ellipse cx="50" cy="60" rx="26" ry="24" fill="#e0a458"/><path d="M28 44 L18 20 L38 36 Z" fill="#e0a458"/><path d="M72 44 L82 20 L62 36 Z" fill="#e0a458"/><circle cx="40" cy="58" r="4" fill="#4a4032"/><circle cx="60" cy="58" r="4" fill="#4a4032"/><path d="M42 68 Q50 73 58 68" stroke="#8a5a2e" stroke-width="2.5" fill="none" stroke-linecap="round"/></svg>`,schlaeft:`<svg viewBox="0 0 100 100"><ellipse cx="50" cy="60" rx="26" ry="24" fill="#e0a458"/><path d="M28 44 L18 20 L38 36 Z" fill="#e0a458"/><path d="M72 44 L82 20 L62 36 Z" fill="#e0a458"/><path d="M34 58 q6 5 12 0" stroke="#4a4032" stroke-width="3" fill="none" stroke-linecap="round"/><path d="M54 58 q6 5 12 0" stroke="#4a4032" stroke-width="3" fill="none" stroke-linecap="round"/><path d="M42 68 Q50 71 58 68" stroke="#8a5a2e" stroke-width="2.5" fill="none" stroke-linecap="round"/></svg>`}],tr=`gutenacht`,nr=1,rr={lampeAn:!0,schlaeft:[!1,!1,!1]},X={...rr},ir=[];function ar(e,t,n){e.addEventListener(t,n),ir.push(()=>e.removeEventListener(t,n))}function or(){g(tr,nr,X)}function sr(e){X=h(tr,nr,{...rr,schlaeft:[...rr.schlaeft]}),ir=[],e.innerHTML=`
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
          ${er.map((e,t)=>`
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
  `;let t=e.querySelector(`#nachtSzene`);t.classList.toggle(`dunkel`,!X.lampeAn),cr(e,t),lr(e)}function cr(e,t){ar(e.querySelector(`.n-lampe`),`pointerdown`,e=>{e.preventDefault(),X.lampeAn=!X.lampeAn,t.classList.toggle(`dunkel`,!X.lampeAn),u({freq:X.lampeAn?480:320,duration:.18,attack:.01,release:.3,type:`sine`,gain:.18}),or()})}function lr(e){e.querySelectorAll(`.n-tier`).forEach(e=>{let t=Number(e.dataset.idx);ar(e,`pointerdown`,n=>{n.preventDefault();let r=!X.schlaeft[t];X.schlaeft[t]=r,e.classList.toggle(`schlaeft`,r),e.closest(`.n-bett`)?.classList.toggle(`schlaeft`,r),r?(m(),u({freq:392,duration:.2,attack:.01,release:.4,type:`sine`,gain:.16}),window.setTimeout(()=>{u({freq:294,duration:.3,attack:.01,release:.5,type:`sine`,gain:.14})},220)):(u({freq:440,duration:.1,attack:.005,release:.2,type:`triangle`,gain:.2}),window.setTimeout(()=>{u({freq:587.33,duration:.16,attack:.005,release:.25,type:`triangle`,gain:.2})},110)),or()})})}function ur(){ir.forEach(e=>e()),ir=[],X={...rr,schlaeft:[...rr.schlaeft]}}var dr={id:`gutenacht`,accent:`#7ea3c9`,tileIcon:$n,mount:sr,unmount:ur};oe();var fr=[He,at,Tt,It,on,En,Qn,dr],pr=document.querySelector(`#app`),mr=`
  <svg viewBox="0 0 96 96" width="40" height="40">
    <path d="M56 26 L34 48 L56 70" fill="none" stroke="#8a7255" stroke-width="8"
      stroke-linecap="round" stroke-linejoin="round"/>
  </svg>
`,hr=18,gr=2*Math.PI*hr;pr.innerHTML=`
  <div class="spielzimmer" id="spielzimmer">
    <div class="tiles" id="tiles"></div>
    <button class="eltern-gate" id="elternGate" aria-hidden="true">${`
  <svg viewBox="0 0 44 44">
    <circle cx="22" cy="22" r="${hr}" fill="none" stroke="#8a7255" stroke-width="3" opacity="0.25"/>
    <circle class="eltern-gate-progress" cx="22" cy="22" r="${hr}" fill="none"
      stroke="#8a7255" stroke-width="3" stroke-linecap="round"
      stroke-dasharray="${gr}" stroke-dashoffset="${gr}"
      transform="rotate(-90 22 22)"/>
    <circle cx="22" cy="22" r="4" fill="#8a7255"/>
  </svg>
`}</button>
  </div>
  <div class="toy-view" id="toyView">
    <div class="toy-stage" id="toyStage"></div>
  </div>
  <button class="back-button" id="backButton" aria-hidden="true">${mr}</button>
  <div class="eltern-overlay" id="elternOverlay">
    <div id="elternPanelWrap"></div>
  </div>
  <div class="version-placeholder">v1.0.0 · c2e5fe2</div>
`;var _r=document.querySelector(`#spielzimmer`),vr=document.querySelector(`#tiles`),yr=document.querySelector(`#toyView`),br=document.querySelector(`#toyStage`),xr=document.querySelector(`#backButton`),Z=document.querySelector(`#elternGate`),Sr=document.querySelector(`#elternOverlay`),Cr=document.querySelector(`#elternPanelWrap`),wr=null,Q=!1;function Tr(){vr.innerHTML=``,fr.forEach((e,t)=>{let n=document.createElement(`button`);n.className=`tile`,n.style.setProperty(`--accent`,e.accent),n.style.animationDelay=`${(t*.7%4.5).toFixed(2)}s`,n.innerHTML=e.tileIcon,n.setAttribute(`aria-hidden`,`true`),n.addEventListener(`pointerdown`,t=>{t.preventDefault(),Er(e)}),vr.appendChild(n)})}function Er(e){Q||wr||(Q=!0,wr=e,e.mount(br),_r.classList.add(`hidden`),xr.classList.add(`visible`),yr.classList.add(`active`),window.setTimeout(()=>{Q=!1},450))}function Dr(){Q||!wr||(Q=!0,yr.classList.remove(`active`),_r.classList.remove(`hidden`),xr.classList.remove(`visible`),window.setTimeout(()=>{wr?.unmount?.(),br.innerHTML=``,wr=null,Q=!1},450))}xr.addEventListener(`pointerdown`,e=>{e.preventDefault(),Dr()});var Or=3e3,$=null;function kr(){$===null&&(Z.classList.add(`charging`),$=window.setTimeout(()=>{$=null,Z.classList.remove(`charging`),jr()},Or))}function Ar(){$!==null&&(window.clearTimeout($),$=null),Z.classList.remove(`charging`)}Z.addEventListener(`pointerdown`,e=>{e.preventDefault(),kr()}),Z.addEventListener(`pointerup`,Ar),Z.addEventListener(`pointercancel`,Ar),Z.addEventListener(`pointerleave`,Ar);function jr(){ce(Cr),Sr.classList.add(`active`)}function Mr(){Sr.classList.remove(`active`)}Sr.addEventListener(`pointerdown`,e=>{e.target===Sr&&Mr()}),document.addEventListener(`click`,e=>{e.target.closest(`.eltern-close`)&&Mr()}),document.addEventListener(`gesturestart`,e=>e.preventDefault()),document.addEventListener(`gesturechange`,e=>e.preventDefault()),document.addEventListener(`dblclick`,e=>e.preventDefault()),document.addEventListener(`contextmenu`,e=>e.preventDefault());var Nr=!1;document.addEventListener(`pointerdown`,()=>{i(),Nr||(Nr=!0,window.setTimeout(()=>{c()&&u({freq:523.25,duration:.15,gain:.25})},80))},{once:!1}),Tr();