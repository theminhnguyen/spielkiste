export interface Toy {
  id: string;
  /** Anzeigename — nur im Elternbereich sichtbar, nie im Kinderbereich. */
  name: string;
  accent: string;
  tileIcon: string;
  mount(container: HTMLElement): void;
  unmount?(): void;
}
