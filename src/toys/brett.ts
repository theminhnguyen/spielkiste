import type { Toy } from './types';

const tileIcon = `
<svg viewBox="0 0 120 120" width="100%" height="100%">
  <rect x="14" y="14" width="92" height="92" rx="18" fill="#fdf6ea" stroke="#e0a458" stroke-width="4"/>
  <circle cx="42" cy="46" r="10" fill="#e0a458"/>
  <rect x="66" y="38" width="34" height="14" rx="7" fill="#7fb99e"/>
  <circle cx="42" cy="80" r="12" fill="#e88a9a"/>
  <rect x="66" y="72" width="34" height="14" rx="7" fill="#f4a56b"/>
</svg>`;

export const brett: Toy = {
  id: 'brett',
  accent: '#e0a458',
  tileIcon,
  mount(container: HTMLElement) {
    container.innerHTML = `
      <div class="toy-placeholder" style="background:#fdf6ea;">
        <div class="toy-placeholder-shape">${tileIcon}</div>
      </div>
    `;
  },
  unmount() {},
};
