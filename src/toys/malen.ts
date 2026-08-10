import type { Toy } from './types';

const tileIcon = `
<svg viewBox="0 0 120 120" width="100%" height="100%">
  <path d="M30 90 L80 30 L95 45 L45 95 Z" fill="#fdf6ea" stroke="#7ea3c9" stroke-width="4" stroke-linejoin="round"/>
  <circle cx="34" cy="92" r="10" fill="#7ea3c9"/>
  <circle cx="70" cy="40" r="8" fill="#e88a9a"/>
</svg>`;

export const malen: Toy = {
  id: 'malen',
  accent: '#7ea3c9',
  tileIcon,
  mount(container: HTMLElement) {
    container.innerHTML = `
      <div class="toy-placeholder" style="background:#eef3f9;">
        <div class="toy-placeholder-shape">${tileIcon}</div>
      </div>
    `;
  },
  unmount() {},
};
