(function(){let e=document.createElement(`link`).relList;if(e&&e.supports&&e.supports(`modulepreload`))return;for(let e of document.querySelectorAll(`link[rel="modulepreload"]`))n(e);new MutationObserver(e=>{for(let t of e)if(t.type===`childList`)for(let e of t.addedNodes)e.tagName===`LINK`&&e.rel===`modulepreload`&&n(e)}).observe(document,{childList:!0,subtree:!0});function t(e){let t={};return e.integrity&&(t.integrity=e.integrity),e.referrerPolicy&&(t.referrerPolicy=e.referrerPolicy),t.credentials=e.crossOrigin===`use-credentials`?`include`:e.crossOrigin===`anonymous`?`omit`:`same-origin`,t}function n(e){if(e.ep)return;e.ep=!0;let n=t(e);fetch(e.href,n)}})();var e=null,t=null,n=!1;function r(){if(e)return e;let n=window.AudioContext??window.webkitAudioContext;return n?(e=new n,t=e.createGain(),t.gain.value=o(),t.connect(e.destination),e):null}function i(){if(n)return;let e=r();e&&(e.state===`suspended`&&e.resume().catch(()=>{}),n=!0)}var a=.6;function o(){return a}function s(e){a=Math.max(0,Math.min(1,e)),t&&(t.gain.value=a)}function c(){return!!e&&e.state===`running`}var l=[261.63,293.66,329.63,392,440,523.25,587.33,659.25];function u(n){let r=e;if(!r||!t||r.state!==`running`)return;let{freq:i,duration:a=.5,attack:o=.02,release:s=.35,type:c=`sine`,gain:l=.5}=n,u=r.createOscillator();u.type=c,u.frequency.value=i;let d=r.createGain();d.gain.setValueAtTime(0,r.currentTime),d.gain.linearRampToValueAtTime(l,r.currentTime+o),d.gain.linearRampToValueAtTime(0,r.currentTime+o+a+s),u.connect(d),d.connect(t),u.start(),u.stop(r.currentTime+o+a+s+.05)}function d(e=440){u({freq:e,duration:.03,attack:.002,release:.08,type:`triangle`,gain:.3})}function ee(n,r=.28){let i=e;if(!i||!t||i.state!==`running`)return null;let a=i.createOscillator();a.type=`sine`,a.frequency.value=n;let o=i.createGain();o.gain.setValueAtTime(0,i.currentTime),o.gain.linearRampToValueAtTime(r,i.currentTime+.05),a.connect(o),o.connect(t),a.start();let s=!1;return{update(e){s||a.frequency.linearRampToValueAtTime(e,i.currentTime+.06)},stop(){s||(s=!0,o.gain.cancelScheduledValues(i.currentTime),o.gain.setValueAtTime(o.gain.value,i.currentTime),o.gain.linearRampToValueAtTime(0,i.currentTime+.15),a.stop(i.currentTime+.2))}}}var f=null;function te(e){if(f)return f;let t=e.sampleRate*.5,n=e.createBuffer(1,t,e.sampleRate),r=n.getChannelData(0);for(let e=0;e<t;e++)r[e]=Math.random()*2-1;return f=n,n}function ne(n){let r=e;if(!r||!t||r.state!==`running`)return;let i=r.createBufferSource();i.buffer=te(r);let a=r.createBiquadFilter();a.type=`bandpass`,a.Q.value=8;let o=n?700:2200,s=n?2200:700;a.frequency.setValueAtTime(o,r.currentTime),a.frequency.linearRampToValueAtTime(s,r.currentTime+.35);let c=r.createGain();c.gain.setValueAtTime(0,r.currentTime),c.gain.linearRampToValueAtTime(.18,r.currentTime+.03),c.gain.linearRampToValueAtTime(0,r.currentTime+.38),i.connect(a),a.connect(c),c.connect(t),i.start(),i.stop(r.currentTime+.4)}function re(){let n=e;if(!n||!t||n.state!==`running`)return;let r=n.createBufferSource();r.buffer=te(n);let i=n.createBiquadFilter();i.type=`lowpass`,i.frequency.setValueAtTime(300,n.currentTime),i.frequency.linearRampToValueAtTime(1400,n.currentTime+.25);let a=n.createGain();a.gain.setValueAtTime(0,n.currentTime),a.gain.linearRampToValueAtTime(.14,n.currentTime+.05),a.gain.linearRampToValueAtTime(0,n.currentTime+.3),r.connect(i),i.connect(a),a.connect(t),r.start(),r.stop(n.currentTime+.32)}var p=`spielkiste:`;function m(e,t,n){try{let r=localStorage.getItem(p+e);if(!r)return n;let i=JSON.parse(r);return i.v===t?i.data:n}catch{return n}}function h(e,t,n){try{let r={v:t,data:n};localStorage.setItem(p+e,JSON.stringify(r))}catch{}}function ie(){try{let e=[];for(let t=0;t<localStorage.length;t++){let n=localStorage.key(t);n?.startsWith(p)&&e.push(n)}e.forEach(e=>localStorage.removeItem(e))}catch{}}var ae=`settings`,oe=1;function se(){s(m(ae,oe,{volume:.6}).volume)}function ce(e){h(ae,oe,{volume:e})}function le(e){e.innerHTML=`
    <div class="eltern-panel">
      <h1>Spielkiste</h1>
      <p class="eltern-version">Version 1.0.0 · edb107b</p>

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
  `;let t=e.querySelector(`.eltern-volume`);t.addEventListener(`input`,()=>{s(Number(t.value)/100)}),t.addEventListener(`change`,()=>{ce(Number(t.value)/100),d(500)});let n=e.querySelector(`.eltern-reset-btn`),r=e.querySelector(`.eltern-reset-confirm`),i=e.querySelector(`.eltern-reset-cancel`),a=e.querySelector(`.eltern-reset-confirm-btn`);n.addEventListener(`click`,()=>{n.hidden=!0,r.hidden=!1}),i.addEventListener(`click`,()=>{r.hidden=!0,n.hidden=!1}),a.addEventListener(`click`,()=>{ie(),window.location.reload()})}var ue=`
<svg viewBox="0 0 120 120" width="100%" height="100%">
  <rect x="14" y="14" width="92" height="92" rx="18" fill="#fdf6ea" stroke="#e0a458" stroke-width="4"/>
  <circle cx="42" cy="46" r="10" fill="#e0a458"/>
  <rect x="66" y="38" width="34" height="14" rx="7" fill="#7fb99e"/>
  <circle cx="42" cy="80" r="12" fill="#e88a9a"/>
  <rect x="66" y="72" width="34" height="14" rx="7" fill="#f4a56b"/>
</svg>`,de=`brett`,fe=1,pe={switchOn:!1,knobStep:0,sliderValue:.3,zipperOpen:!1,doorIndex:0},g=[`<svg viewBox="0 0 100 100"><circle cx="50" cy="55" r="30" fill="#f2c9a0"/><circle cx="28" cy="30" r="14" fill="#f2c9a0"/><circle cx="72" cy="30" r="14" fill="#f2c9a0"/><circle cx="40" cy="52" r="4" fill="#4a4032"/><circle cx="60" cy="52" r="4" fill="#4a4032"/><ellipse cx="50" cy="64" rx="6" ry="4" fill="#e88a9a"/></svg>`,`<svg viewBox="0 0 100 100"><ellipse cx="50" cy="58" rx="26" ry="28" fill="#e8dfd0"/><ellipse cx="35" cy="20" rx="8" ry="18" fill="#e8dfd0"/><ellipse cx="65" cy="20" rx="8" ry="18" fill="#e8dfd0"/><circle cx="40" cy="55" r="4" fill="#4a4032"/><circle cx="60" cy="55" r="4" fill="#4a4032"/><ellipse cx="50" cy="66" rx="5" ry="3" fill="#e88a9a"/></svg>`,`<svg viewBox="0 0 100 100"><circle cx="50" cy="55" r="32" fill="#c9a37e"/><circle cx="22" cy="32" r="12" fill="#c9a37e"/><circle cx="78" cy="32" r="12" fill="#c9a37e"/><circle cx="40" cy="52" r="4" fill="#4a4032"/><circle cx="60" cy="52" r="4" fill="#4a4032"/><ellipse cx="50" cy="66" rx="8" ry="5" fill="#8a7255"/></svg>`],_={...pe},v=[],y=null,b=[],x=0;function S(e,t,n){e.addEventListener(t,n),v.push(()=>e.removeEventListener(t,n))}function C(){h(de,fe,_)}function me(e){_=m(de,fe,{...pe}),v=[],y=null,b=[],x=0,e.innerHTML=`
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
            <div class="door-animal">${g[_.doorIndex%g.length]}</div>
            <div class="door-panel"></div>
          </div>
        </div>
      </div>
    </div>
  `,he(e),_e(e),ye(e),be(e),xe(e),Ce(e),Te(e)}function he(e){let t=e.querySelector(`.brett-switch`);ge(t),S(t,`pointerdown`,e=>{e.preventDefault(),_.switchOn=!_.switchOn,ge(t),u({freq:_.switchOn?440:330,duration:.05,attack:.002,release:.1,type:`square`,gain:.25}),C()})}function ge(e){e.classList.toggle(`on`,_.switchOn)}function _e(e){let t=e.querySelector(`.brett-knob`),n=t.querySelector(`.knob-dial`);ve(n);let r=!1;function i(e,t){let r=n.getBoundingClientRect(),i=r.left+r.width/2,a=r.top+r.height/2,o=e-i,s=t-a,c=Math.atan2(s,o)*180/Math.PI+90;return c<0&&(c+=360),Math.round(c/45)%8}S(t,`pointerdown`,e=>{let n=e;n.preventDefault(),r=!0;try{t.setPointerCapture(n.pointerId)}catch{}o(n.clientX,n.clientY)}),S(t,`pointermove`,e=>{if(!r)return;let t=e;o(t.clientX,t.clientY)});function a(e){if(!r)return;r=!1;let n=e;if(n.pointerId!==void 0)try{t.releasePointerCapture(n.pointerId)}catch{}}S(t,`pointerup`,a),S(t,`pointercancel`,a);function o(e,t){let r=i(e,t);r!==_.knobStep&&(_.knobStep=r,ve(n),u({freq:l[r%l.length],duration:.04,attack:.002,release:.08,type:`triangle`,gain:.25}),C())}}function ve(e){e.style.transform=`rotate(${_.knobStep*45}deg)`}function ye(e){e.querySelectorAll(`.press-btn`).forEach(e=>{S(e,`pointerdown`,t=>{t.preventDefault(),u({freq:l[Number(e.dataset.note??`0`)%l.length],duration:.3,gain:.4}),e.classList.add(`pressed`),window.setTimeout(()=>e.classList.remove(`pressed`),260)})})}function be(e){let t=e.querySelector(`.brett-slider`),n=t.querySelector(`.slider-track`),r=t.querySelector(`.slider-handle`),i=t.querySelector(`.slider-fill`);w(r,i);let a=!1;function o(e){let t=n.getBoundingClientRect(),r=(e-t.left)/t.width;return Math.max(0,Math.min(1,r))}function s(e){return 220*4**e}S(t,`pointerdown`,e=>{let n=e;n.preventDefault(),a=!0;try{t.setPointerCapture(n.pointerId)}catch{}_.sliderValue=o(n.clientX),w(r,i),y=ee(s(_.sliderValue))}),S(t,`pointermove`,e=>{a&&(_.sliderValue=o(e.clientX),w(r,i),y?.update(s(_.sliderValue)))});function c(e){if(!a)return;a=!1,y?.stop(),y=null;let n=e;if(n.pointerId!==void 0)try{t.releasePointerCapture(n.pointerId)}catch{}C()}S(t,`pointerup`,c),S(t,`pointercancel`,c)}function w(e,t){let n=_.sliderValue*100;e.style.left=`${n}%`,t.style.width=`${n}%`}function xe(e){let t=e.querySelector(`.brett-zipper`),n=t.querySelector(`.zipper-track`),r=t.querySelector(`.zipper-pull`);Se(t);let i=!1,a=0,o=0;S(t,`pointerdown`,e=>{let n=e;n.preventDefault(),i=!0,o=0,a=n.clientY;try{t.setPointerCapture(n.pointerId)}catch{}}),S(t,`pointermove`,e=>{if(!i)return;let t=e,s=n.getBoundingClientRect(),c=Math.max(0,Math.min(1,(t.clientY-s.top)/s.height));o+=Math.abs(t.clientY-a),a=t.clientY,r.style.top=`${c*100}%`});function s(e){if(!i)return;i=!1;let a=e;if(a.pointerId!==void 0)try{t.releasePointerCapture(a.pointerId)}catch{}let s=n.getBoundingClientRect(),c=r.getBoundingClientRect(),l=(c.top+c.height/2-s.top)/s.height,u=_.zipperOpen,d=o<6?!_.zipperOpen:l>.5;d!==u&&(_.zipperOpen=d,ne(d),C()),Se(t)}S(t,`pointerup`,s),S(t,`pointercancel`,s)}function Se(e){e.classList.toggle(`open`,_.zipperOpen);let t=e.querySelector(`.zipper-pull`);t.style.top=_.zipperOpen?`100%`:`0%`}function Ce(e){let t=e.querySelector(`.brett-windmill`),n=t.querySelector(`.windmill-blades`);n.style.transform=`rotate(${x}deg)`,S(t,`pointerdown`,e=>{e.preventDefault(),we(n)})}function we(e){b.forEach(e=>window.clearTimeout(e)),b=[];let t=3+Math.random()*2;x+=t*360;let n=2200+Math.random()*400;e.style.transition=`transform ${n}ms cubic-bezier(0.13, 0.7, 0.25, 1)`,e.style.transform=`rotate(${x}deg)`;for(let e=0;e<12;e++){let t=n*(1-(1-e/12)**2.2),r=window.setTimeout(()=>{u({freq:700,duration:.02,attack:.001,release:.04,type:`triangle`,gain:.12})},t);b.push(r)}}function Te(e){let t=e.querySelector(`.brett-door`),n=t.querySelector(`.door-animal`);Ee(t),S(t,`pointerdown`,e=>{e.preventDefault();let r=!t.classList.contains(`open`);r&&(_.doorIndex=(_.doorIndex+1)%g.length,n.innerHTML=g[_.doorIndex],C()),t.classList.toggle(`open`,r),re()})}function Ee(e){e.classList.remove(`open`)}function De(){v.forEach(e=>e()),v=[],y?.stop(),y=null,b.forEach(e=>window.clearTimeout(e)),b=[]}var Oe={id:`brett`,accent:`#e0a458`,tileIcon:ue,mount:me,unmount:De},ke=`
<svg viewBox="0 0 120 120" width="100%" height="100%">
  <circle cx="45" cy="45" r="24" fill="#e88a9a"/>
  <circle cx="78" cy="55" r="20" fill="#7fb99e"/>
  <circle cx="55" cy="82" r="18" fill="#f4c86b"/>
</svg>`,Ae=[{id:0,color:`#e88a9a`,note:0,xPct:22,yPct:30,radiusPx:58},{id:1,color:`#7fb99e`,note:1,xPct:50,yPct:22,radiusPx:62},{id:2,color:`#f4c86b`,note:2,xPct:78,yPct:32,radiusPx:56},{id:3,color:`#7ea3c9`,note:3,xPct:30,yPct:68,radiusPx:60},{id:4,color:`#e0a458`,note:4,xPct:58,yPct:74,radiusPx:58},{id:5,color:`#c896d8`,note:5,xPct:80,yPct:66,radiusPx:54}],T=null,E=[],D=[],O=new Set;function k(e,t,n){e.addEventListener(t,n),D.push(()=>e.removeEventListener(t,n))}function je(e,t,n){return Math.max(t,Math.min(n,e))}function Me(e){D=[],O=new Set,e.innerHTML=`
    <div class="kleckse-stage" id="kleckseStage">
      ${Ae.map(e=>`
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
  `,T=e.querySelector(`#kleckseStage`),E=Ae.map(t=>({def:t,el:e.querySelector(`.klecks[data-id="${t.id}"]`),xPct:t.xPct,yPct:t.yPct,grabbed:!1,lastX:0,lastY:0,lastT:0})),E.forEach(e=>{A(e),Ne(e)})}function A(e,t=1,n=1){if(!T)return;let r=T.getBoundingClientRect(),i=e.xPct/100*r.width-e.def.radiusPx,a=e.yPct/100*r.height-e.def.radiusPx;e.el.style.transform=`translate(${i.toFixed(1)}px, ${a.toFixed(1)}px) scale(${t.toFixed(3)}, ${n.toFixed(3)})`}function Ne(e){let t=e.el;k(t,`pointerdown`,n=>{let r=n;r.preventDefault();try{t.setPointerCapture(r.pointerId)}catch{}e.grabbed=!0,e.lastX=r.clientX,e.lastY=r.clientY,e.lastT=performance.now(),t.classList.add(`grabbed`),u({freq:l[e.def.note%l.length],duration:.35,gain:.35}),Fe(e,1.18)}),k(t,`pointermove`,t=>{if(!e.grabbed||!T)return;let n=t,r=T.getBoundingClientRect(),i=performance.now(),a=Math.max(1,i-e.lastT),o=(n.clientX-e.lastX)/a,s=(n.clientY-e.lastY)/a;e.lastX=n.clientX,e.lastY=n.clientY,e.lastT=i,e.xPct=je((n.clientX-r.left)/r.width*100,6,94),e.yPct=je((n.clientY-r.top)/r.height*100,8,92),Pe(e,o,s),Le(e)});function n(n){if(!e.grabbed)return;e.grabbed=!1,t.classList.remove(`grabbed`);let r=n;if(r.pointerId!==void 0)try{t.releasePointerCapture(r.pointerId)}catch{}A(e,1,1)}k(t,`pointerup`,n),k(t,`pointercancel`,n)}function Pe(e,t,n){let r=Math.min(Math.hypot(t,n)*6,.28),i=Math.atan2(n,t);A(e,1+r*Math.abs(Math.cos(i)),1-r*Math.abs(Math.cos(i))*.6+r*Math.abs(Math.sin(i))*.1)}function Fe(e,t){A(e,t,t),window.setTimeout(()=>{e.el.classList.contains(`grabbed`)||A(e,1,1)},160)}function Ie(e,t){return e<t?`${e}-${t}`:`${t}-${e}`}function Le(e){if(!T)return;let t=T.getBoundingClientRect(),n=e.xPct/100*t.width,r=e.yPct/100*t.height;for(let i of E){if(i.def.id===e.def.id)continue;let a=i.xPct/100*t.width,o=i.yPct/100*t.height,s=Math.hypot(n-a,r-o),c=e.def.radiusPx*.75+i.def.radiusPx*.75,d=Ie(e.def.id,i.def.id);s<c?O.has(d)||(O.add(d),u({freq:l[e.def.note%l.length],duration:.25,gain:.22}),u({freq:l[i.def.note%l.length],duration:.25,gain:.22}),Fe(i,1.1)):O.delete(d)}}function Re(){D.forEach(e=>e()),D=[],E=[],T=null,O=new Set}var ze={id:`kleckse`,accent:`#e88a9a`,tileIcon:ke,mount:Me,unmount:Re},Be=`
<svg viewBox="0 0 120 120" width="100%" height="100%">
  <path d="M30 90 L80 30 L95 45 L45 95 Z" fill="#fdf6ea" stroke="#7ea3c9" stroke-width="4" stroke-linejoin="round"/>
  <circle cx="34" cy="92" r="10" fill="#7ea3c9"/>
  <circle cx="70" cy="40" r="8" fill="#e88a9a"/>
</svg>`,j=[`#e88a9a`,`#7fb99e`,`#f4c86b`,`#7ea3c9`,`#e0a458`,`#6b5d4a`],M=`malen`,N=1,P=null,F=null,I=null,L=j[0],R=!1,z=0,Ve=0,B=[],V=null;function H(e,t,n){e.addEventListener(t,n),B.push(()=>e.removeEventListener(t,n))}function He(e){B=[],R=!1,L=j[0],e.innerHTML=`
    <div class="malen-stage" id="malenStage">
      <canvas class="malen-canvas" id="malenCanvas"></canvas>
      <div class="malen-palette" id="malenPalette">
        ${j.map((e,t)=>`<button class="malen-swatch${t===0?` selected`:``}" data-color="${e}" style="--swatch-color:${e}" aria-hidden="true"></button>`).join(``)}
      </div>
      <button class="malen-new-sheet" id="malenNewSheet" aria-hidden="true">
        <svg viewBox="0 0 48 48" width="30" height="30">
          <path d="M10 6 h20 l8 8 v28 h-28 z" fill="#fffaf2" stroke="#8a7255" stroke-width="2.5" stroke-linejoin="round"/>
          <path d="M30 6 v8 h8" fill="none" stroke="#8a7255" stroke-width="2.5" stroke-linejoin="round"/>
        </svg>
      </button>
    </div>
  `,I=e.querySelector(`#malenStage`),P=e.querySelector(`#malenCanvas`),F=P.getContext(`2d`),Ue(),We(),H(P,`pointerdown`,qe),H(P,`pointermove`,Je),H(P,`pointerup`,Ye),H(P,`pointercancel`,Ye);let t=e.querySelectorAll(`.malen-swatch`);t.forEach(e=>{H(e,`pointerdown`,n=>{n.preventDefault(),L=e.dataset.color??j[0],t.forEach(e=>e.classList.remove(`selected`)),e.classList.add(`selected`),d(500)})}),H(e.querySelector(`#malenNewSheet`),`pointerdown`,e=>{e.preventDefault(),Xe()}),H(window,`resize`,()=>{V!==null&&window.clearTimeout(V),V=window.setTimeout(()=>{Ue(),We()},200)})}function Ue(){if(!P||!I)return;let e=Math.min(window.devicePixelRatio||1,2),t=I.getBoundingClientRect();P.width=Math.round(t.width*e),P.height=Math.round(t.height*e),P.style.width=`${t.width}px`,P.style.height=`${t.height}px`,F=P.getContext(`2d`),F&&(F.scale(e,e),F.lineCap=`round`,F.lineJoin=`round`,F.lineWidth=22)}function We(){let e=m(M,N,{dataUrl:null});if(!e.dataUrl||!P||!F)return;let t=new Image;t.onload=()=>{if(!F||!P)return;let e=Math.min(window.devicePixelRatio||1,2);F.drawImage(t,0,0,P.width/e,P.height/e)},t.src=e.dataUrl}function Ge(){if(P)try{h(M,N,{dataUrl:P.toDataURL(`image/png`)})}catch{}}function Ke(e){let t=P.getBoundingClientRect();return{x:e.clientX-t.left,y:e.clientY-t.top}}function qe(e){let t=e;if(t.preventDefault(),!P||!F)return;try{P.setPointerCapture(t.pointerId)}catch{}R=!0;let{x:n,y:r}=Ke(t);z=n,Ve=r,F.strokeStyle=L,F.fillStyle=L,F.beginPath(),F.arc(n,r,F.lineWidth/2,0,Math.PI*2),F.fill()}function Je(e){if(!R||!F)return;let{x:t,y:n}=Ke(e);F.beginPath(),F.moveTo(z,Ve),F.lineTo(t,n),F.stroke(),z=t,Ve=n}function Ye(e){if(!R)return;R=!1;let t=e;if(P&&t.pointerId!==void 0)try{P.releasePointerCapture(t.pointerId)}catch{}Ge()}function Xe(){if(!P||!F||!I)return;let e=P.toDataURL(`image/png`),t=document.createElement(`img`);t.src=e,t.className=`malen-crumple-overlay`,t.style.width=P.style.width,t.style.height=P.style.height,I.appendChild(t);let n=Math.min(window.devicePixelRatio||1,2);F.clearRect(0,0,P.width/n,P.height/n),h(M,N,{dataUrl:null}),d(300),t.offsetWidth,t.classList.add(`crumpling`),window.setTimeout(()=>{t.remove()},550)}function Ze(){B.forEach(e=>e()),B=[],V!==null&&(window.clearTimeout(V),V=null),P=null,F=null,I=null}var Qe={id:`malen`,accent:`#7ea3c9`,tileIcon:Be,mount:He,unmount:Ze},$e=`
<svg viewBox="0 0 120 120" width="100%" height="100%">
  <rect x="30" y="70" width="60" height="26" rx="8" fill="#7fb99e"/>
  <rect x="38" y="42" width="44" height="26" rx="8" fill="#f4a56b"/>
  <rect x="46" y="16" width="28" height="24" rx="8" fill="#e88a9a"/>
</svg>`,et=[{shape:`square`,color:`#e88a9a`},{shape:`round`,color:`#7fb99e`},{shape:`wide`,color:`#f4c86b`},{shape:`peak`,color:`#7ea3c9`},{shape:`tall`,color:`#e0a458`}],tt={square:78,round:78,wide:108,peak:78,tall:60},nt=52,rt=`steine`,it=1,U=[],W=null,G=null,K=[];function at(e,t,n){e.addEventListener(t,n),K.push(()=>e.removeEventListener(t,n))}function ot(){h(rt,it,{towers:U})}function st(e){let t=tt[e.shape],n=e.shape===`tall`?4:8,r=e.shape===`peak`?`<div class="steine-roof" style="border-bottom-color:${e.color}"></div>`:``,i=e.shape===`round`?`50px`:`14px`;return`
    <div class="steine-block-body" style="width:${t}px;height:${nt}px;background:${e.color};border-radius:${i};">
      ${r}
      <div class="steine-face" style="gap:${n}px;">
        <div class="steine-eyes"><span></span><span></span></div>
        <div class="steine-mouth"></div>
      </div>
    </div>
  `}function ct(e){K=[],U=m(rt,it,{towers:[]}).towers,e.innerHTML=`
    <div class="steine-stage" id="steineStage">
      <div class="steine-floor"></div>
      <div class="steine-towers" id="steineTowers"></div>
      <div class="steine-shelf" id="steineShelf">
        ${et.map((e,t)=>`
          <div class="steine-shelf-item" data-shape-index="${t}">
            ${st(e)}
          </div>
        `).join(``)}
      </div>
    </div>
  `,W=e.querySelector(`#steineStage`),G=e.querySelector(`#steineTowers`),q(),dt(e)}function q(){G&&(G.innerHTML=``,U.forEach((e,t)=>{let n=document.createElement(`div`);n.className=`steine-tower`+(e.toppled?` toppled`:``),n.style.left=`${e.xPct}%`,n.style.setProperty(`--topple-dir`,String(e.toppleDir));let r=document.createElement(`div`);r.className=`steine-stack`,e.blocks.forEach(e=>{let t=document.createElement(`div`);t.className=`steine-placed-block`,t.innerHTML=st(e),r.appendChild(t)}),n.appendChild(r),G.appendChild(n),lt(n,t)}))}function lt(e,t){let n=0,r=0,i=0,a=0;e.addEventListener(`pointerdown`,t=>{let o=t;o.preventDefault(),o.stopPropagation(),n=o.clientX,r=o.clientY,i=performance.now(),a=0;try{e.setPointerCapture(o.pointerId)}catch{}}),e.addEventListener(`pointermove`,e=>{let t=e;a=Math.max(a,Math.hypot(t.clientX-n,t.clientY-r))}),e.addEventListener(`pointerup`,r=>{let o=r;try{e.releasePointerCapture(o.pointerId)}catch{}let s=performance.now()-i,c=U[t];if(!c)return;let l=a>45&&s<600;if(c.toppled){a<12&&(c.toppled=!1,ot(),q(),d(600));return}l?(c.toppled=!0,c.toppleDir=o.clientX-n>=0?1:-1,ot(),q(),re()):a<12&&ut(e)}),e.addEventListener(`pointercancel`,t=>{let n=t;try{e.releasePointerCapture(n.pointerId)}catch{}})}function ut(e){e.classList.remove(`wobble`),e.offsetWidth,e.classList.add(`wobble`),[0,90,180].forEach((e,t)=>{window.setTimeout(()=>{u({freq:500+t*120,duration:.08,attack:.005,release:.1,type:`triangle`,gain:.22})},e)}),window.setTimeout(()=>e.classList.remove(`wobble`),700)}function dt(e){e.querySelectorAll(`.steine-shelf-item`).forEach((e,t)=>{at(e,`pointerdown`,n=>ft(n,e,t))})}function ft(e,t,n){if(e.preventDefault(),!W)return;try{t.setPointerCapture(e.pointerId)}catch{}let r=et[n],i=document.createElement(`div`);i.className=`steine-floating-block`,i.innerHTML=st(r),W.appendChild(i);let a=(e,t)=>{let n=W.getBoundingClientRect();i.style.left=`${e-n.left}px`,i.style.top=`${t-n.top}px`};a(e.clientX,e.clientY),d(420);let o=!1;function s(e){let t=e;a(t.clientX,t.clientY)}function c(e){if(o)return;o=!0;let n=e;try{t.releasePointerCapture(n.pointerId)}catch{}t.removeEventListener(`pointermove`,s),t.removeEventListener(`pointerup`,c),t.removeEventListener(`pointercancel`,c),i.remove(),ht(r,n.clientX,n.clientY)}t.addEventListener(`pointermove`,s),t.addEventListener(`pointerup`,c),t.addEventListener(`pointercancel`,c)}var pt=55,mt=90;function ht(e,t,n){if(!W)return;let r=W.getBoundingClientRect(),i=(t-r.left)/r.width*100,a=r.height-24,o=null;for(let e of U){if(e.toppled)continue;let i=r.left+e.xPct/100*r.width,s=r.top+a-e.blocks.length*nt;if(Math.abs(t-i)<pt&&Math.abs(n-s)<mt){o=e;break}}if(o)o.blocks.push(e),gt(o.blocks.length);else{let t=Math.max(10,Math.min(90,i));U.push({xPct:t,blocks:[e],toppled:!1,toppleDir:1}),gt(1)}ot(),q()}function gt(e){u({freq:Math.max(140,240-e*10),duration:.08,attack:.004,release:.12,type:`sine`,gain:.3})}function _t(){K.forEach(e=>e()),K=[],W=null,G=null,U=[]}var vt={id:`steine`,accent:`#7fb99e`,tileIcon:$e,mount:ct,unmount:_t};se();var yt=[Oe,ze,Qe,vt],bt=document.querySelector(`#app`),xt=`
  <svg viewBox="0 0 96 96" width="40" height="40">
    <path d="M56 26 L34 48 L56 70" fill="none" stroke="#8a7255" stroke-width="8"
      stroke-linecap="round" stroke-linejoin="round"/>
  </svg>
`,St=18,Ct=2*Math.PI*St;bt.innerHTML=`
  <div class="spielzimmer" id="spielzimmer">
    <div class="tiles" id="tiles"></div>
    <button class="eltern-gate" id="elternGate" aria-hidden="true">${`
  <svg viewBox="0 0 44 44">
    <circle cx="22" cy="22" r="${St}" fill="none" stroke="#8a7255" stroke-width="3" opacity="0.25"/>
    <circle class="eltern-gate-progress" cx="22" cy="22" r="${St}" fill="none"
      stroke="#8a7255" stroke-width="3" stroke-linecap="round"
      stroke-dasharray="${Ct}" stroke-dashoffset="${Ct}"
      transform="rotate(-90 22 22)"/>
    <circle cx="22" cy="22" r="4" fill="#8a7255"/>
  </svg>
`}</button>
  </div>
  <div class="toy-view" id="toyView">
    <div class="toy-stage" id="toyStage"></div>
  </div>
  <button class="back-button" id="backButton" aria-hidden="true">${xt}</button>
  <div class="eltern-overlay" id="elternOverlay">
    <div id="elternPanelWrap"></div>
  </div>
  <div class="version-placeholder">v1.0.0 · edb107b</div>
`;var wt=document.querySelector(`#spielzimmer`),Tt=document.querySelector(`#tiles`),Et=document.querySelector(`#toyView`),Dt=document.querySelector(`#toyStage`),Ot=document.querySelector(`#backButton`),J=document.querySelector(`#elternGate`),Y=document.querySelector(`#elternOverlay`),kt=document.querySelector(`#elternPanelWrap`),X=null,Z=!1;function At(){Tt.innerHTML=``;for(let e of yt){let t=document.createElement(`button`);t.className=`tile`,t.style.setProperty(`--accent`,e.accent),t.innerHTML=e.tileIcon,t.setAttribute(`aria-hidden`,`true`),t.addEventListener(`pointerdown`,t=>{t.preventDefault(),jt(e)}),Tt.appendChild(t)}}function jt(e){Z||X||(Z=!0,X=e,e.mount(Dt),wt.classList.add(`hidden`),Ot.classList.add(`visible`),Et.classList.add(`active`),window.setTimeout(()=>{Z=!1},450))}function Mt(){Z||!X||(Z=!0,Et.classList.remove(`active`),wt.classList.remove(`hidden`),Ot.classList.remove(`visible`),window.setTimeout(()=>{X?.unmount?.(),Dt.innerHTML=``,X=null,Z=!1},450))}Ot.addEventListener(`pointerdown`,e=>{e.preventDefault(),Mt()});var Nt=3e3,Q=null;function Pt(){Q===null&&(J.classList.add(`charging`),Q=window.setTimeout(()=>{Q=null,J.classList.remove(`charging`),Ft()},Nt))}function $(){Q!==null&&(window.clearTimeout(Q),Q=null),J.classList.remove(`charging`)}J.addEventListener(`pointerdown`,e=>{e.preventDefault(),Pt()}),J.addEventListener(`pointerup`,$),J.addEventListener(`pointercancel`,$),J.addEventListener(`pointerleave`,$);function Ft(){le(kt),Y.classList.add(`active`)}function It(){Y.classList.remove(`active`)}Y.addEventListener(`pointerdown`,e=>{e.target===Y&&It()}),document.addEventListener(`click`,e=>{e.target.closest(`.eltern-close`)&&It()}),document.addEventListener(`gesturestart`,e=>e.preventDefault()),document.addEventListener(`gesturechange`,e=>e.preventDefault()),document.addEventListener(`dblclick`,e=>e.preventDefault()),document.addEventListener(`contextmenu`,e=>e.preventDefault());var Lt=!1;document.addEventListener(`pointerdown`,()=>{i(),Lt||(Lt=!0,window.setTimeout(()=>{c()&&u({freq:523.25,duration:.15,gain:.25})},80))},{once:!1}),At();