export interface Toy {
  id: string;
  accent: string;
  tileIcon: string;
  mount(container: HTMLElement): void;
  unmount?(): void;
}
