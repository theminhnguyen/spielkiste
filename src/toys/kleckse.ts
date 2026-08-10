import type { Toy } from './types';

const tileIcon = `
<svg viewBox="0 0 120 120" width="100%" height="100%">
  <circle cx="45" cy="45" r="24" fill="#e88a9a"/>
  <circle cx="78" cy="55" r="20" fill="#7fb99e"/>
  <circle cx="55" cy="82" r="18" fill="#f4c86b"/>
</svg>`;

export const kleckse: Toy = {
  id: 'kleckse',
  accent: '#e88a9a',
  tileIcon,
  mount(container: HTMLElement) {
    container.innerHTML = `
      <div class="toy-placeholder" style="background:#fdeef1;">
        <div class="toy-placeholder-shape">${tileIcon}</div>
      </div>
    `;
  },
  unmount() {},
};
