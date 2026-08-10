import './style.css';

const app = document.querySelector<HTMLDivElement>('#app')!;

app.innerHTML = `
  <div style="display:flex;align-items:center;justify-content:center;height:100%;">
    <div style="text-align:center;color:#8a7860;">
      <div style="font-size:14px;">Spielkiste wird gebaut …</div>
    </div>
  </div>
  <div class="version-placeholder">v${__APP_VERSION__} · ${__COMMIT_HASH__}</div>
`;
