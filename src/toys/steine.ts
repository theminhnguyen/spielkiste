import type { Toy } from './types';

const tileIcon = `
<svg viewBox="0 0 120 120" width="100%" height="100%">
  <rect x="30" y="70" width="60" height="26" rx="8" fill="#7fb99e"/>
  <rect x="38" y="42" width="44" height="26" rx="8" fill="#f4a56b"/>
  <rect x="46" y="16" width="28" height="24" rx="8" fill="#e88a9a"/>
</svg>`;

export const steine: Toy = {
  id: 'steine',
  accent: '#7fb99e',
  tileIcon,
  mount(container: HTMLElement) {
    container.innerHTML = `
      <div class="toy-placeholder" style="background:#eef6f0;">
        <div class="toy-placeholder-shape">${tileIcon}</div>
      </div>
    `;
  },
  unmount() {},
};
