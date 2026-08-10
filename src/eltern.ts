export function renderElternbereich(container: HTMLElement): void {
  container.innerHTML = `
    <div class="eltern-panel">
      <h1>Spielkiste</h1>
      <p class="eltern-version">Version ${__APP_VERSION__} · ${__COMMIT_HASH__}</p>
      <p class="eltern-hint">Weitere Einstellungen folgen hier.</p>
      <button class="eltern-close">Schließen</button>
    </div>
  `;
}
