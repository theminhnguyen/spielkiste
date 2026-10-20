import type { Toy } from './types';
import { loadState, saveState } from '../state';
import { playWhoosh, playGlide, playTone, playZipSound, playDrum, playBounce, PENTATONIC_HZ } from '../audio';

const tileIcon = `
<svg viewBox="0 0 120 120" width="100%" height="100%">
  <rect x="26" y="10" width="68" height="100" rx="32" fill="#f6efe3" stroke="#e0d2bc" stroke-width="3"/>
  <rect x="34" y="18" width="52" height="84" rx="25" fill="#cfe7f5"/>
  <rect x="34" y="62" width="52" height="40" fill="#6fa8c9"/>
  <path d="M34 62 H86 V78 C76 92 44 92 34 78 Z" fill="#6fa8c9"/>
  <circle cx="50" cy="40" r="11" fill="#fff"/>
  <circle cx="62" cy="36" r="13" fill="#fff"/>
  <circle cx="72" cy="42" r="9" fill="#fff"/>
  <ellipse cx="60" cy="84" rx="13" ry="6" fill="#4f6f8f"/>
</svg>`;

/** Wolken-Mittelpunkte in % der Fensterfläche — überlappend, damit sie zusammen alles verdecken. */
const WOLKEN: Array<[number, number]> = [
  [20, 14], [62, 10], [88, 26],
  [12, 38], [50, 34], [86, 50],
  [24, 62], [66, 66],
  [16, 88], [58, 90], [90, 84],
];

const SZENEN = ['meer', 'berge', 'stadt', 'insel', 'bauernhof', 'ballons', 'eis', 'zug', 'regenbogen', 'flughafen'] as const;
type Szene = (typeof SZENEN)[number];

/** Heißluftballon um (0|0) — Hülle, Mittelstreifen, Seile, Korb. */
function ballon(farbe: string, streifen: string): string {
  return `
    <path d="M0 -42 C24 -42 34 -24 34 -6 C34 12 14 24 8 32 H-8 C-14 24 -34 12 -34 -6 C-34 -24 -24 -42 0 -42 Z" fill="${farbe}"/>
    <path d="M0 -42 C12 -30 14 10 8 32 H-8 C-14 10 -12 -30 0 -42 Z" fill="${streifen}"/>
    <path d="M-8 32 L-7 44 M8 32 L7 44" stroke="#a9835e" stroke-width="2"/>
    <rect x="-9" y="44" width="18" height="12" rx="2.5" fill="#a9835e"/>`;
}

/** Pinguin um (0|0), Füße bei y = 20. */
function pinguin(klasse: string): string {
  return `
    <g class="sz-pingu ${klasse}">
      <ellipse cx="-13" cy="4" rx="4" ry="11" fill="#2c3e50" transform="rotate(14 -13 4)"/>
      <ellipse cx="13" cy="4" rx="4" ry="11" fill="#2c3e50" transform="rotate(-14 13 4)"/>
      <ellipse cx="0" cy="0" rx="13" ry="20" fill="#2c3e50"/>
      <ellipse cx="0" cy="5" rx="9" ry="14" fill="#fffaf2"/>
      <circle cx="-4" cy="-10" r="2.6" fill="#fffaf2"/><circle cx="4" cy="-10" r="2.6" fill="#fffaf2"/>
      <circle cx="-4" cy="-10" r="1.3" fill="#2c3e50"/><circle cx="4" cy="-10" r="1.3" fill="#2c3e50"/>
      <path d="M-4 -5 L0 0 L4 -5 Z" fill="#e0a458"/>
      <ellipse cx="-6" cy="20" rx="5" ry="2.5" fill="#e0a458"/><ellipse cx="6" cy="20" rx="5" ry="2.5" fill="#e0a458"/>
    </g>`;
}

/** Bahnschwellen unter dem Gleis. */
const SCHWELLEN = Array.from({ length: 13 }, (_, i) => `<rect x="${4 + i * 24}" y="304" width="12" height="5" fill="#c9b79a"/>`).join('');

const SZENE_SVG: Record<Szene, string> = {
  meer: `
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
    </svg>`,
  berge: `
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
    </svg>`,
  stadt: `
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
    </svg>`,
  insel: `
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
    </svg>`,
  bauernhof: `
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
    </svg>`,
  ballons: `
    <svg viewBox="0 0 300 400" preserveAspectRatio="xMidYMid slice" width="100%" height="100%">
      <rect width="300" height="400" fill="#d6ecf7"/>
      <rect y="170" width="300" height="230" fill="#e4f2f9"/>
      <circle cx="70" cy="72" r="20" fill="#f7d570"/>
      <path d="M-20 290 C40 260 100 270 150 285 C200 300 250 262 320 270 L320 400 L-20 400 Z" fill="#a8d18f"/>
      <path d="M-20 330 C70 310 160 340 320 318 L320 400 L-20 400 Z" fill="#8fc27a"/>
      <g fill="#7fb99e"><circle cx="70" cy="318" r="10"/><circle cx="86" cy="322" r="8"/><circle cx="236" cy="300" r="9"/><circle cx="250" cy="304" r="7"/></g>
      <g transform="translate(206 236) scale(0.55)"><g class="sz-ballon"><g class="sz-schweben" style="animation-delay:-2.6s">${ballon('#e0a458', '#e88a9a')}</g></g></g>
      <g transform="translate(200 116) scale(0.75)"><g class="sz-ballon"><g class="sz-schweben" style="animation-delay:-1.3s">${ballon('#7ea3c9', '#fffaf2')}</g></g></g>
      <g transform="translate(100 166)"><g class="sz-ballon"><g class="sz-schweben">${ballon('#e88a9a', '#f7d570')}</g></g></g>
    </svg>`,
  eis: `
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
      <g transform="translate(118 268)">${pinguin('p1')}</g>
      <g transform="translate(160 264)">${pinguin('p2')}</g>
      <g transform="translate(196 276) scale(0.6)">${pinguin('p3')}</g>
    </svg>`,
  zug: `
    <svg viewBox="0 0 300 400" preserveAspectRatio="xMidYMid slice" width="100%" height="100%">
      <rect width="300" height="400" fill="#d8ecf6"/>
      <circle cx="64" cy="66" r="20" fill="#f7d570"/>
      <path d="M-20 250 C40 200 110 210 160 236 C210 210 260 196 320 220 L320 400 L-20 400 Z" fill="#b5d99c"/>
      <path d="M-20 330 C80 310 200 330 320 316 L320 400 L-20 400 Z" fill="#9ec98a"/>
      <rect x="232" y="228" width="6" height="20" fill="#a9835e"/><circle cx="235" cy="222" r="14" fill="#7fb99e"/>
      <rect x="40" y="236" width="5" height="16" fill="#a9835e"/><circle cx="42" cy="230" r="11" fill="#7fb99e"/>
      ${SCHWELLEN}
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
    </svg>`,
  regenbogen: `
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
    </svg>`,
  flughafen: `
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
    </svg>`,
};

/** Wolke in einem Farbton — überlappende Wolken in leicht verschiedenen Weißtönen wirken plastisch. */
function wolkeSvg(farbe: string): string {
  return `
<svg viewBox="0 0 200 120" width="100%" height="100%">
  <g fill="${farbe}">
    <circle cx="60" cy="70" r="38"/><circle cx="102" cy="52" r="46"/><circle cx="146" cy="70" r="36"/>
    <circle cx="28" cy="88" r="26"/><circle cx="172" cy="88" r="25"/>
    <rect x="28" y="70" width="146" height="44" rx="22"/>
  </g>
</svg>`;
}
const WOLKEN_FARBEN = ['#ffffff', '#f3f7fb', '#e9f0f6', '#fbfcfe'];

interface FensterState {
  szene: Szene;
  gespiegelt: boolean;
  /** Noch nicht gezeigte Landschaften der aktuellen Runde. */
  reihe: Szene[];
}
const STATE_KEY = 'fenster';
const STATE_VERSION = 2;

/** Ohne Berührung so lange warten, bis die Wolken zurückziehen. */
const RUECKKEHR_MS = 6000;
/** Dauer, bis alle Wolken wieder da sind (Staffelung + Übergang). */
const RUECKKEHR_DAUER_MS = WOLKEN.length * 220 + 2700;

interface WolkeRt {
  el: HTMLElement;
  x: number;
  y: number;
  weg: boolean;
}

let stageEl: HTMLElement | null = null;
let innenEl: HTMLElement | null = null;
let dunstEl: HTMLElement | null = null;
let rolloEl: HTMLElement | null = null;
let szeneEl: HTMLElement | null = null;
let wolken: WolkeRt[] = [];
let cleanup: Array<() => void> = [];
let timers = new Set<number>();
let rueckkehrTimer: number | null = null;
let szene: Szene = 'meer';
let gespiegelt = false;
let reihe: Szene[] = [];
let ganzFrei = false;
let rolloUnten = false;
let lastRolloAt = 0;
let lastWhooshAt = 0;
let lastFeierAt = 0;
let aktivePointer = new Set<number>();

function on(el: EventTarget, type: string, handler: EventListenerOrEventListenerObject): void {
  el.addEventListener(type, handler);
  cleanup.push(() => el.removeEventListener(type, handler));
}

/** Timer fürs Aufräumen merken — gefeuerte vergessen sich selbst (siehe trommeln.ts). */
function later(fn: () => void, ms: number): number {
  const id = window.setTimeout(() => {
    timers.delete(id);
    fn();
  }, ms);
  timers.add(id);
  return id;
}

function clearLater(id: number | null): void {
  if (id === null) return;
  window.clearTimeout(id);
  timers.delete(id);
}

function mount(container: HTMLElement): void {
  cleanup = [];
  timers = new Set();
  aktivePointer = new Set();
  rueckkehrTimer = null;
  ganzFrei = false;
  rolloUnten = false;
  const gespeichert = loadState<FensterState | null>(STATE_KEY, STATE_VERSION, null);
  reihe = (gespeichert?.reihe ?? []).filter((s) => SZENEN.includes(s));
  if (gespeichert && SZENEN.includes(gespeichert.szene)) {
    szene = gespeichert.szene;
    gespiegelt = gespeichert.gespiegelt;
  } else {
    waehleNaechste();
  }

  container.innerHTML = `
    <div class="fenster-stage" id="fensterStage">
      <div class="fenster">
        <div class="fenster-innen" id="fensterInnen">
          <div class="fenster-szene" id="fensterSzene"></div>
          <div class="fenster-dunst" id="fensterDunst"></div>
          ${WOLKEN.map(
            ([x, y], i) => `
            <div class="fenster-wolke" style="left:${x}%;top:${y}%" data-i="${i}">
              <div class="fenster-wolke-innen" style="animation-delay:${(-i * 1.3).toFixed(1)}s">${wolkeSvg(WOLKEN_FARBEN[i % WOLKEN_FARBEN.length])}</div>
            </div>`,
          ).join('')}
          <div class="fenster-rollo" id="fensterRollo"><span class="fenster-rollo-griff"></span></div>
          <div class="fenster-schatten"></div>
        </div>
      </div>
    </div>
  `;

  stageEl = container.querySelector<HTMLElement>('#fensterStage')!;
  innenEl = container.querySelector<HTMLElement>('#fensterInnen')!;
  dunstEl = container.querySelector<HTMLElement>('#fensterDunst')!;
  rolloEl = container.querySelector<HTMLElement>('#fensterRollo')!;
  szeneEl = container.querySelector<HTMLElement>('#fensterSzene')!;
  zeigeSzene();
  wolken = WOLKEN.map(([x, y], i) => ({
    el: container.querySelector<HTMLElement>(`.fenster-wolke[data-i="${i}"]`)!,
    x,
    y,
    weg: false,
  }));
  updateDunst();

  on(stageEl, 'pointerdown', (e) => {
    const pe = e as PointerEvent;
    pe.preventDefault();
    try {
      stageEl?.setPointerCapture(pe.pointerId);
    } catch {
      /* Pointer bereits inaktiv */
    }
    aktivePointer.add(pe.pointerId);
    beruehrt(pe.clientX, pe.clientY, true);
  });
  on(stageEl, 'pointermove', (e) => {
    const pe = e as PointerEvent;
    if (!aktivePointer.has(pe.pointerId)) return;
    beruehrt(pe.clientX, pe.clientY, false);
  });
  const end = (e: Event) => aktivePointer.delete((e as PointerEvent).pointerId);
  on(stageEl, 'pointerup', end);
  on(stageEl, 'pointercancel', end);
}

/**
 * Fingerposition in % der Fensterfläche. Tipps außerhalb des Fensters werden
 * an den Fensterrand gezogen — so wirkt auch ein Patscher auf die Kabinenwand.
 */
function imFenster(clientX: number, clientY: number): { x: number; y: number; drin: boolean } {
  const r = innenEl!.getBoundingClientRect();
  const x = ((clientX - r.left) / r.width) * 100;
  const y = ((clientY - r.top) / r.height) * 100;
  const drin = x >= 0 && x <= 100 && y >= 0 && y <= 100;
  return { x: Math.max(0, Math.min(100, x)), y: Math.max(0, Math.min(100, y)), drin };
}

function beruehrt(clientX: number, clientY: number, neu: boolean): void {
  if (!innenEl) return;
  const p = imFenster(clientX, clientY);
  const now = performance.now();

  // Rollo: unten → jeder neue Tipp zieht es hoch. Oben → ein Tipp auf den
  // sichtbaren Streifen (oberste ~14 %) zieht es herunter.
  if (neu && now - lastRolloAt > 700) {
    if (rolloUnten) {
      setRollo(false);
      return;
    }
    if (p.drin && p.y < 14) {
      setRollo(true);
      return;
    }
  }
  if (rolloUnten) return;

  planeRueckkehr();

  let weggeschoben = 0;
  const r = innenEl.getBoundingClientRect();
  // Reichweite in % der längeren Fensterseite: Ein Finger räumt eine Bahn
  // frei, ein Patscher mit der ganzen Hand gleich ein großes Stück.
  const reichweite = 20;
  for (const w of wolken) {
    if (w.weg) continue;
    const dx = (w.x - p.x) * (r.width / 100);
    const dy = (w.y - p.y) * (r.height / 100);
    const d = Math.hypot(dx, dy);
    if (d > (reichweite / 100) * Math.max(r.width, r.height)) continue;
    const n = d < 1 ? { x: Math.random() - 0.5, y: Math.random() - 0.5 } : { x: dx / d, y: dy / d };
    const len = Math.hypot(n.x, n.y) || 1;
    const weit = Math.max(r.width, r.height) * 1.1;
    w.el.style.setProperty('--wx', `${((n.x / len) * weit).toFixed(0)}px`);
    w.el.style.setProperty('--wy', `${((n.y / len) * weit).toFixed(0)}px`);
    w.el.style.removeProperty('--delay');
    w.el.classList.add('weg');
    w.weg = true;
    weggeschoben++;
  }

  if (weggeschoben > 0 && now - lastWhooshAt > 140) {
    lastWhooshAt = now;
    playWhoosh();
  }
  updateDunst();

  const uebrig = wolken.filter((w) => !w.weg).length;
  if (uebrig <= 1 && !ganzFrei) {
    ganzFrei = true;
    later(feiern, 450);
  } else if (ganzFrei && neu && p.drin && uebrig <= 3) {
    // Freie Sicht: Antippen der Landschaft lässt sie noch einmal „feiern".
    feiern();
  }
}

/** Dunst über der Landschaft: dicht, solange viele Wolken da sind — verdeckt Lücken zwischen ihnen. */
function updateDunst(): void {
  if (!dunstEl) return;
  const da = wolken.filter((w) => !w.weg).length;
  const anteil = Math.max(0, (da - 2) / (wolken.length - 2));
  dunstEl.style.opacity = (anteil * 0.92).toFixed(2);
}

function feiern(): void {
  const now = performance.now();
  if (now - lastFeierAt < 1600) return;
  lastFeierAt = now;
  const el = szeneEl;
  if (!el) return;
  el.classList.remove('feiert');
  void el.offsetWidth;
  el.classList.add('feiert');
  later(() => el.classList.remove('feiert'), 2600);
  FEIER_KLANG[szene]();
}

/** Klang zur kleinen Überraschung jeder Landschaft (Bewegung: .feiert in style.css). */
const FEIER_KLANG: Record<Szene, () => void> = {
  meer: () => {
    playGlide(170, 115, 0.7, 0.24);
    later(() => playGlide(115, 190, 0.6, 0.2), 650);
  },
  berge: () => {
    [0, 160, 380].forEach((ms, i) => later(() => playGlide(1700 + i * 200, 2500 + i * 150, 0.09, 0.07), ms));
  },
  stadt: () => {
    [5, 6, 7, 5].forEach((note, i) =>
      later(() => playTone({ freq: PENTATONIC_HZ[note], duration: 0.2, attack: 0.01, release: 0.6, gain: 0.16 }), i * 180),
    );
  },
  insel: () => {
    playWhoosh();
    later(() => playGlide(420, 900, 0.3, 0.12), 300);
  },
  bauernhof: () => {
    // „Muh" — tief, erst leicht steigend, dann lang fallend.
    playGlide(150, 190, 0.25, 0.2, 'triangle');
    later(() => playGlide(190, 135, 0.7, 0.2, 'triangle'), 240);
    [0, 130, 260, 390, 520, 650].forEach((ms) => later(() => playDrum(75, 0.12, 0.15), 900 + ms));
  },
  ballons: () => {
    playWhoosh();
    [
      [330, 440],
      [392, 523],
      [440, 659],
    ].forEach(([von, bis], i) => later(() => playGlide(von, bis, 0.5, 0.1), 300 + i * 260));
  },
  eis: () => {
    [880, 1047, 1319].forEach((f, i) => later(() => playBounce(f, 0.2), 120 + i * 220));
  },
  zug: () => {
    // „Tuut tuut" als weicher Zweiklang.
    [0, 450].forEach((ms) =>
      later(() => {
        playTone({ freq: 392, duration: 0.25, attack: 0.02, release: 0.15, type: 'triangle', gain: 0.16 });
        playTone({ freq: 494, duration: 0.25, attack: 0.02, release: 0.15, type: 'triangle', gain: 0.12 });
      }, ms),
    );
  },
  regenbogen: () => {
    PENTATONIC_HZ.forEach((freq, i) =>
      later(() => playTone({ freq, duration: 0.12, attack: 0.01, release: 0.5, gain: 0.13 }), i * 110),
    );
    later(() => playGlide(400, 820, 0.15, 0.12), 700);
  },
  flughafen: () => {
    playGlide(180, 520, 1.4, 0.1, 'triangle');
    later(playWhoosh, 650);
  },
};

/** Nach einer Weile ohne Berührung ziehen die Wolken zurück — und danach kommt eine neue Landschaft. */
function planeRueckkehr(): void {
  clearLater(rueckkehrTimer);
  rueckkehrTimer = later(() => {
    rueckkehrTimer = null;
    const zurueck = wolken.filter((w) => w.weg);
    if (zurueck.length === 0) return;
    zurueck.forEach((w, i) => {
      w.el.style.setProperty('--delay', `${i * 220}ms`);
      w.el.classList.remove('weg');
      w.weg = false;
    });
    updateDunst();
    if (ganzFrei) {
      later(naechsteSzene, RUECKKEHR_DAUER_MS);
    }
  }, RUECKKEHR_MS);
}

function naechsteSzene(): void {
  // Nur wechseln, wenn die Wolken wirklich wieder zu sind — sonst sähe das
  // Kind den Wechsel.
  if (wolken.some((w) => w.weg)) return;
  ganzFrei = false;
  waehleNaechste();
  zeigeSzene();
}

/**
 * Nächste Landschaft aus einer gemischten Runde: Jede kommt einmal dran,
 * bevor sich eine wiederholt, und nie zweimal hintereinander. Dazu zufällig
 * gespiegelt — so wirkt auch eine bekannte Landschaft wieder neu.
 */
function waehleNaechste(): void {
  if (reihe.length === 0) {
    reihe = [...SZENEN];
    for (let i = reihe.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [reihe[i], reihe[j]] = [reihe[j], reihe[i]];
    }
    if (reihe[0] === szene) reihe.push(reihe.shift()!);
  }
  szene = reihe.shift()!;
  gespiegelt = Math.random() < 0.5;
  saveState<FensterState>(STATE_KEY, STATE_VERSION, { szene, gespiegelt, reihe });
}

/** Nur die sichtbare Landschaft liegt im DOM — weniger Knoten für Safari. */
function zeigeSzene(): void {
  if (!szeneEl) return;
  szeneEl.className = `fenster-szene sz-${szene}${gespiegelt ? ' gespiegelt' : ''}`;
  szeneEl.innerHTML = SZENE_SVG[szene];
}

function setRollo(unten: boolean): void {
  rolloUnten = unten;
  lastRolloAt = performance.now();
  rolloEl?.classList.toggle('unten', unten);
  playZipSound(!unten);
}

function unmount(): void {
  cleanup.forEach((fn) => fn());
  cleanup = [];
  timers.forEach((id) => window.clearTimeout(id));
  timers = new Set();
  rueckkehrTimer = null;
  aktivePointer = new Set();
  wolken = [];
  szeneEl = null;
  stageEl = null;
  innenEl = null;
  dunstEl = null;
  rolloEl = null;
}

export const fenster: Toy = {
  id: 'fenster',
  name: 'Flugzeugfenster',
  accent: '#7ea3c9',
  tileIcon,
  mount,
  unmount,
};
