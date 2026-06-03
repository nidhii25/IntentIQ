import { useState } from "react";

const API_URL = "http://127.0.0.1:8000/predict";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=Instrument+Serif:ital@0;1&family=JetBrains+Mono:wght@300;400;500&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  html { scroll-behavior: smooth; }
  body { background: #0a0a0f; color: #e8e0d4; font-family: 'Syne', sans-serif; overflow-x: hidden; }

  :root {
    --bg: #0a0a0f; --bg2: #111118; --bg3: #181820; --surface: #1e1e2a;
    --border: #2a2a3a; --border2: #363650;
    --volt: #c8f53c; --volt2: #a8d820;
    --rose: #ff6b8a; --sky: #4fc3f7; --amber: #ffb347; --purple: #c084fc;
    --text: #e8e0d4; --muted: #8a8aaa; --dim: #555570;
    --font-disp: 'Instrument Serif', serif;
    --font-ui: 'Syne', sans-serif;
    --font-mono: 'JetBrains Mono', monospace;
    --r-sm: 6px; --r-md: 10px; --r-lg: 14px;
    --nav-h: 60px;
  }

  ::-webkit-scrollbar { width: 4px; height: 4px; }
  ::-webkit-scrollbar-track { background: var(--bg2); }
  ::-webkit-scrollbar-thumb { background: var(--border2); border-radius: 2px; }

  .app { min-height: 100vh; background: var(--bg); }

  .nav {
    display: flex; align-items: center; justify-content: space-between;
    padding: 0 32px; height: var(--nav-h);
    border-bottom: 1px solid var(--border);
    background: rgba(10,10,15,0.97);
    position: sticky; top: 0; z-index: 200;
    backdrop-filter: blur(12px);
  }
  .nav-logo { font-family: var(--font-mono); font-size: 13px; letter-spacing: 0.12em; color: var(--volt); text-transform: uppercase; font-weight: 500; white-space: nowrap; }
  .nav-logo span { color: var(--muted); }
  .nav-center { display: flex; gap: 4px; }
  .nav-tab { background: none; border: none; padding: 7px 14px; border-radius: var(--r-sm); font-family: var(--font-ui); font-size: 12px; font-weight: 600; letter-spacing: 0.05em; color: var(--muted); cursor: pointer; transition: all 0.2s; text-transform: uppercase; white-space: nowrap; }
  .nav-tab:hover { color: var(--text); background: var(--surface); }
  .nav-tab.active { color: var(--bg); background: var(--volt); }
  .nav-badge { background: var(--surface); border: 1px solid var(--border); padding: 5px 12px; border-radius: 20px; font-family: var(--font-mono); font-size: 10px; color: var(--volt); letter-spacing: 0.08em; white-space: nowrap; }

  .hamburger { display: none; flex-direction: column; gap: 5px; background: none; border: none; cursor: pointer; padding: 4px; }
  .hamburger span { display: block; width: 22px; height: 2px; background: var(--muted); border-radius: 2px; transition: all 0.3s; }
  .hamburger.open span:nth-child(1) { transform: translateY(7px) rotate(45deg); }
  .hamburger.open span:nth-child(2) { opacity: 0; }
  .hamburger.open span:nth-child(3) { transform: translateY(-7px) rotate(-45deg); }
  .mobile-menu { display: none; position: fixed; top: var(--nav-h); left: 0; right: 0; background: rgba(10,10,15,0.99); border-bottom: 1px solid var(--border); z-index: 199; padding: 16px; flex-direction: column; gap: 4px; backdrop-filter: blur(12px); }
  .mobile-menu.open { display: flex; }
  .mobile-tab { background: none; border: none; padding: 12px 16px; border-radius: var(--r-sm); font-family: var(--font-ui); font-size: 14px; font-weight: 600; letter-spacing: 0.05em; color: var(--muted); cursor: pointer; transition: all 0.2s; text-transform: uppercase; text-align: left; width: 100%; }
  .mobile-tab.active { color: var(--bg); background: var(--volt); }
  .mobile-tab:hover:not(.active) { color: var(--text); background: var(--surface); }

  .page { animation: pageIn 0.35s ease; }
  @keyframes pageIn { from { opacity:0; transform:translateY(8px); } to { opacity:1; transform:translateY(0); } }

  .container { max-width: 1140px; margin: 0 auto; padding: 0 32px; }
  .section-head { display: flex; align-items: baseline; gap: 16px; margin-bottom: 24px; flex-wrap: wrap; }
  .section-title { font-family: var(--font-disp); font-size: clamp(22px,3.5vw,32px); color: var(--text); }
  .section-tag { font-family: var(--font-mono); font-size: 10px; color: var(--muted); letter-spacing: 0.1em; text-transform: uppercase; }
  .eyebrow { font-family: var(--font-mono); font-size: 10px; letter-spacing: 0.2em; text-transform: uppercase; color: var(--volt); margin-bottom: 14px; display: flex; align-items: center; gap: 8px; }
  .eyebrow::before { content: ''; width: 20px; height: 1px; background: var(--volt); flex-shrink: 0; }

  .btn-volt { background: var(--volt); color: var(--bg); border: none; padding: 11px 24px; border-radius: var(--r-sm); font-family: var(--font-ui); font-size: 12px; font-weight: 700; letter-spacing: 0.06em; text-transform: uppercase; cursor: pointer; transition: all 0.2s; }
  .btn-volt:hover { background: var(--volt2); transform: translateY(-1px); }
  .btn-outline { background: none; color: var(--text); border: 1px solid var(--border2); padding: 11px 24px; border-radius: var(--r-sm); font-family: var(--font-ui); font-size: 12px; font-weight: 700; letter-spacing: 0.06em; text-transform: uppercase; cursor: pointer; transition: all 0.2s; }
  .btn-outline:hover { border-color: var(--volt); color: var(--volt); }

  /* HOME */
  .home { padding: 0; }
  .hero { padding: 52px 32px 40px; display: grid; grid-template-columns: 1fr 1fr; gap: 40px; align-items: center; max-width: 1140px; margin: 0 auto; }
  .hero-h1 { font-family: var(--font-disp); font-size: clamp(36px,5vw,56px); line-height: 1.05; color: var(--text); margin-bottom: 18px; }
  .hero-h1 em { color: var(--volt); font-style: italic; }
  .hero-p { font-size: 14px; color: var(--muted); line-height: 1.8; margin-bottom: 28px; max-width: 400px; }
  .hero-btns { display: flex; gap: 10px; flex-wrap: wrap; }
  .hero-right { background: var(--surface); border: 1px solid var(--border); border-radius: var(--r-lg); padding: 24px; position: relative; overflow: hidden; }
  .hero-right::before { content: ''; position: absolute; width: 200px; height: 200px; border-radius: 50%; background: radial-gradient(circle,rgba(200,245,60,0.08),transparent 70%); top: -60px; right: -60px; pointer-events: none; }
  .terminal-bar { display: flex; align-items: center; gap: 6px; margin-bottom: 16px; }
  .t-dot { width: 8px; height: 8px; border-radius: 50%; }
  .t-dot.r { background: #ff5f56; } .t-dot.y { background: #ffbd2e; } .t-dot.g { background: #27c93f; }
  .terminal-label { font-family: var(--font-mono); font-size: 10px; color: var(--dim); letter-spacing: 0.1em; margin-left: auto; }

  .stats-row { display: grid; grid-template-columns: repeat(3,1fr); gap: 12px; padding: 0 32px 32px; max-width: 1140px; margin: 0 auto; }
  .stat-card { background: var(--surface); border: 1px solid var(--border); border-radius: var(--r-md); padding: 16px; text-align: center; }
  .stat-num { font-family: var(--font-disp); font-size: clamp(24px,4vw,36px); color: var(--volt); line-height: 1; }
  .stat-label { font-family: var(--font-mono); font-size: 9px; letter-spacing: 0.12em; text-transform: uppercase; color: var(--muted); margin-top: 6px; }

  .pipeline-section { padding: 32px; max-width: 1140px; margin: 0 auto; }
  .pipeline-steps { display: grid; grid-template-columns: repeat(4,1fr); gap: 0; position: relative; }
  .pipeline-line { position: absolute; top: 24px; left: 12%; right: 12%; height: 1px; background: linear-gradient(90deg,var(--border),var(--volt),var(--border)); z-index: 0; }
  .pipe-step { text-align: center; padding: 0 10px; position: relative; z-index: 1; }
  .pipe-orb { width: 48px; height: 48px; border-radius: 50%; background: var(--bg3); border: 1px solid var(--border2); display: flex; align-items: center; justify-content: center; margin: 0 auto 12px; font-size: 18px; transition: border-color 0.3s; }
  .pipe-step:hover .pipe-orb { border-color: var(--volt); }
  .pipe-n { font-family: var(--font-mono); font-size: 9px; color: var(--volt); letter-spacing: 0.15em; text-transform: uppercase; margin-bottom: 4px; }
  .pipe-name { font-family: var(--font-ui); font-size: 12px; font-weight: 700; color: var(--text); margin-bottom: 4px; }
  .pipe-detail { font-size: 11px; color: var(--muted); line-height: 1.5; }
  .pipe-chip { font-family: var(--font-mono); font-size: 9px; color: var(--volt2); background: rgba(200,245,60,0.08); padding: 2px 6px; border-radius: 3px; display: inline-block; margin-top: 4px; }

  .routing-table { width: 100%; border-collapse: collapse; margin-top: 16px; }
  .routing-table th { background: var(--bg3); font-family: var(--font-mono); font-size: 9px; letter-spacing: 0.1em; text-transform: uppercase; color: var(--muted); padding: 10px 14px; text-align: left; border-bottom: 1px solid var(--border); }
  .routing-table td { padding: 10px 14px; border-bottom: 1px solid var(--border); font-size: 12px; }
  .routing-table tr:last-child td { border-bottom: none; }
  .routing-table tr:hover td { background: rgba(255,255,255,0.02); }
  .badge { display: inline-block; padding: 3px 8px; border-radius: 4px; font-family: var(--font-mono); font-size: 9px; letter-spacing: 0.08em; text-transform: uppercase; font-weight: 500; }
  .badge-high { background: rgba(255,107,138,0.15); color: var(--rose); border: 1px solid rgba(255,107,138,0.3); }
  .badge-med  { background: rgba(79,195,247,0.12);  color: var(--sky);  border: 1px solid rgba(79,195,247,0.25); }
  .badge-team { background: var(--surface); color: var(--muted); border: 1px solid var(--border); }

  /* DEMO */
  .demo-page { padding: 32px; max-width: 1140px; margin: 0 auto; }
  .demo-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; align-items: start; }
  .panel { background: var(--surface); border: 1px solid var(--border); border-radius: var(--r-lg); padding: 24px; }
  .panel-head { font-family: var(--font-mono); font-size: 10px; letter-spacing: 0.15em; text-transform: uppercase; color: var(--muted); margin-bottom: 16px; display: flex; align-items: center; gap: 8px; }
  .live-dot { width: 6px; height: 6px; border-radius: 50%; background: var(--volt); animation: blink 2s infinite; flex-shrink: 0; }
  @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0.3} }

  .ex-chips { display: flex; flex-wrap: wrap; gap: 6px; margin-bottom: 14px; }
  .ex-chip { background: var(--bg3); border: 1px solid var(--border); padding: 5px 10px; border-radius: 20px; font-size: 11px; color: var(--muted); cursor: pointer; transition: all 0.2s; }
  .ex-chip:hover { border-color: var(--volt); color: var(--volt); }
  .ex-chip-label { font-family: var(--font-mono); font-size: 10px; color: var(--dim); letter-spacing: 0.06em; margin-bottom: 8px; }

  textarea.demo-ta { width: 100%; height: 130px; background: var(--bg3); border: 1px solid var(--border); border-radius: var(--r-md); padding: 14px; color: var(--text); font-family: var(--font-ui); font-size: 13px; line-height: 1.7; resize: none; outline: none; transition: border-color 0.2s; }
  textarea.demo-ta:focus { border-color: var(--volt); }
  textarea.demo-ta::placeholder { color: var(--dim); }

  .api-status { display: flex; align-items: center; gap: 6px; margin-top: 10px; margin-bottom: 4px; font-family: var(--font-mono); font-size: 10px; color: var(--dim); }
  .api-dot { width: 6px; height: 6px; border-radius: 50%; flex-shrink: 0; }
  .api-dot.ok { background: #27c93f; } .api-dot.err { background: var(--rose); } .api-dot.idle { background: var(--dim); }
  .api-url { font-size: 9px; letter-spacing: 0.05em; color: var(--dim); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }

  .analyze-btn { width: 100%; margin-top: 12px; background: var(--volt); color: var(--bg); border: none; padding: 13px; border-radius: var(--r-md); font-family: var(--font-ui); font-size: 12px; font-weight: 800; letter-spacing: 0.1em; text-transform: uppercase; cursor: pointer; transition: all 0.2s; }
  .analyze-btn:hover:not(:disabled) { background: var(--volt2); transform: translateY(-1px); }
  .analyze-btn:disabled { opacity: 0.45; cursor: not-allowed; transform: none; }

  .error-banner { background: rgba(255,107,138,0.1); border: 1px solid rgba(255,107,138,0.3); border-radius: var(--r-md); padding: 12px 14px; margin-top: 10px; font-family: var(--font-mono); font-size: 11px; color: var(--rose); line-height: 1.6; }
  .error-banner strong { display: block; margin-bottom: 4px; }

  .output-placeholder { display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 200px; color: var(--dim); text-align: center; gap: 10px; }
  .result-card { animation: resultIn 0.5s cubic-bezier(0.22,1,0.36,1); }
  @keyframes resultIn { from{opacity:0;transform:scale(0.97)} to{opacity:1;transform:scale(1)} }
  .result-field { margin-bottom: 18px; }
  .result-field:last-child { margin-bottom: 0; }
  .rf-label { font-family: var(--font-mono); font-size: 9px; letter-spacing: 0.14em; text-transform: uppercase; color: var(--dim); margin-bottom: 6px; }
  .rf-value { font-size: 15px; font-weight: 600; color: var(--text); }
  .rf-bar { height: 4px; background: var(--bg3); border-radius: 2px; margin-top: 6px; overflow: hidden; }
  .rf-bar-fill { height: 100%; border-radius: 2px; transition: width 1s cubic-bezier(0.22,1,0.36,1); }
  .rf-sub { font-family: var(--font-mono); font-size: 9px; color: var(--dim); margin-top: 4px; }

  .sentiment-meter { display: flex; align-items: center; gap: 8px; margin-top: 8px; }
  .meter-track { flex: 1; height: 6px; background: var(--bg3); border-radius: 3px; overflow: hidden; }
  .meter-fill { height: 100%; border-radius: 3px; transition: width 1s cubic-bezier(0.22,1,0.36,1); }
  .meter-labels { display: flex; justify-content: space-between; font-family: var(--font-mono); font-size: 9px; color: var(--dim); margin-top: 4px; }
  .meter-tag { font-family: var(--font-mono); font-size: 10px; min-width: 28px; }

  .priority-display { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }
  .priority-pill { padding: 6px 14px; border-radius: 20px; font-family: var(--font-mono); font-size: 11px; font-weight: 500; letter-spacing: 0.08em; white-space: nowrap; }
  .priority-high { background: rgba(255,107,138,0.15); color: var(--rose); border: 1px solid rgba(255,107,138,0.4); }
  .priority-med  { background: rgba(79,195,247,0.12);  color: var(--sky);  border: 1px solid rgba(79,195,247,0.3); }
  .team-bubble { display: flex; align-items: center; gap: 10px; background: var(--bg3); border: 1px solid var(--border); padding: 12px 16px; border-radius: var(--r-md); margin-top: 6px; }
  .team-icon { width: 34px; height: 34px; border-radius: 8px; background: rgba(200,245,60,0.12); display: flex; align-items: center; justify-content: center; font-size: 16px; flex-shrink: 0; }
  .team-name { font-size: 14px; font-weight: 700; color: var(--volt); }
  .team-sub { font-family: var(--font-mono); font-size: 10px; color: var(--muted); }

  /* ── MODE BADGE ── */
  .mode-badge { display: inline-flex; align-items: center; gap: 6px; padding: 5px 12px; border-radius: 20px; font-family: var(--font-mono); font-size: 10px; font-weight: 600; letter-spacing: 0.08em; text-transform: uppercase; }
  .mode-auto   { background: rgba(200,245,60,0.12);  color: var(--volt);   border: 1px solid rgba(200,245,60,0.3); }
  .mode-alert  { background: rgba(255,179,71,0.12);  color: var(--amber);  border: 1px solid rgba(255,179,71,0.3); }
  .mode-human  { background: rgba(79,195,247,0.12);  color: var(--sky);    border: 1px solid rgba(79,195,247,0.3); }
  .mode-critical { background: rgba(255,107,138,0.15); color: var(--rose); border: 1px solid rgba(255,107,138,0.4); }
  .mode-icon { font-size: 12px; }

  /* ── OWNER ALERT ── */
  .alert-pill { display: inline-flex; align-items: center; gap: 6px; padding: 5px 12px; border-radius: 20px; font-family: var(--font-mono); font-size: 10px; letter-spacing: 0.08em; }
  .alert-on  { background: rgba(255,107,138,0.15); color: var(--rose);  border: 1px solid rgba(255,107,138,0.35); }
  .alert-off { background: var(--bg3);             color: var(--dim);   border: 1px solid var(--border); }
  .alert-pulse { width: 6px; height: 6px; border-radius: 50%; flex-shrink: 0; }
  .alert-pulse.on  { background: var(--rose); animation: blink 1s infinite; }
  .alert-pulse.off { background: var(--dim); }

  /* ── REPLY BUBBLE ── */
  .reply-bubble { background: var(--bg3); border: 1px solid var(--border); border-radius: var(--r-md); padding: 14px 16px; margin-top: 6px; position: relative; }
  .reply-bubble::before { content: '"'; position: absolute; top: 8px; left: 12px; font-family: var(--font-disp); font-size: 28px; color: var(--border2); line-height: 1; pointer-events: none; }
  .reply-text { font-size: 13px; color: var(--text); line-height: 1.7; padding-left: 14px; }
  .reply-null { font-family: var(--font-mono); font-size: 11px; color: var(--dim); font-style: italic; }

  .raw-toggle { font-family: var(--font-mono); font-size: 10px; color: var(--dim); background: none; border: 1px solid var(--border); padding: 4px 10px; border-radius: 4px; cursor: pointer; margin-top: 16px; transition: all 0.2s; }
  .raw-toggle:hover { color: var(--volt); border-color: var(--volt); }
  .raw-block { background: var(--bg3); border: 1px solid var(--border); border-radius: var(--r-md); padding: 14px; margin-top: 10px; font-family: var(--font-mono); font-size: 11px; line-height: 1.8; color: rgba(232,224,212,0.7); animation: pageIn 0.2s ease; }

  .loading-state { display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 200px; gap: 14px; }
  .spinner { width: 30px; height: 30px; border: 2px solid var(--border); border-top-color: var(--volt); border-radius: 50%; animation: spin 0.7s linear infinite; }
  @keyframes spin { to { transform: rotate(360deg); } }
  .loading-text { font-family: var(--font-mono); font-size: 10px; letter-spacing: 0.1em; color: var(--muted); }

  /* divider */
  .rf-divider { height: 1px; background: var(--border); margin: 4px 0 18px; }

  /* ARCH */
  .arch-page { padding: 32px; max-width: 1140px; margin: 0 auto; }
  .arch-cols { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
  .code-card { background: var(--bg3); border: 1px solid var(--border); border-radius: var(--r-md); padding: 20px; margin-bottom: 16px; }
  .file-label { font-family: var(--font-mono); font-size: 10px; color: var(--volt2); letter-spacing: 0.1em; margin-bottom: 12px; display: flex; align-items: center; gap: 6px; }
  .file-dot { width: 6px; height: 6px; border-radius: 50%; background: var(--volt); flex-shrink: 0; }
  pre { font-family: var(--font-mono); font-size: 11px; line-height: 1.9; color: rgba(232,224,212,0.72); overflow-x: auto; white-space: pre; }
  .c-k { color: #c792ea; } .c-s { color: #a8d820; } .c-f { color: #4fc3f7; }
  .c-cm { color: #546e7a; } .c-kw { color: #ff6b8a; }

  .arch-layers { display: flex; flex-direction: column; gap: 10px; }
  .layer-row { display: flex; align-items: center; gap: 14px; background: var(--surface); border: 1px solid var(--border); border-radius: var(--r-md); padding: 14px 16px; transition: all 0.2s; cursor: default; }
  .layer-row:hover { border-color: var(--border2); transform: translateX(4px); }
  .layer-icon { width: 36px; height: 36px; border-radius: 8px; background: var(--bg3); display: flex; align-items: center; justify-content: center; font-size: 16px; flex-shrink: 0; }
  .layer-name { font-family: var(--font-mono); font-size: 11px; color: var(--sky); font-weight: 500; margin-bottom: 2px; }
  .layer-detail { font-size: 11px; color: var(--muted); line-height: 1.5; }

  /* ABOUT */
  .about-page { padding: 32px; max-width: 1140px; margin: 0 auto; }
  .about-hero { background: var(--surface); border: 1px solid var(--border); border-radius: var(--r-lg); padding: 32px; margin-bottom: 20px; position: relative; overflow: hidden; }
  .about-hero::before { content: ''; position: absolute; width: 300px; height: 300px; border-radius: 50%; background: radial-gradient(circle,rgba(200,245,60,0.06),transparent 70%); top: -100px; right: -80px; pointer-events: none; }
  .about-title { font-family: var(--font-disp); font-size: clamp(28px,4vw,40px); margin-bottom: 12px; line-height: 1.1; }
  .about-title em { color: var(--volt); font-style: italic; }
  .about-p { font-size: 13px; color: var(--muted); line-height: 1.9; max-width: 520px; }
  .tags-row { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 16px; }
  .tag { font-family: var(--font-mono); font-size: 9px; letter-spacing: 0.08em; text-transform: uppercase; background: var(--bg3); border: 1px solid var(--border); padding: 5px 10px; border-radius: 4px; color: var(--muted); }
  .impact-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 20px; }
  .impact-card { background: var(--surface); border: 1px solid var(--border); border-left: 3px solid var(--volt); border-radius: 0 var(--r-md) var(--r-md) 0; padding: 16px; }
  .ic-title { font-size: 13px; font-weight: 700; color: var(--text); margin-bottom: 4px; }
  .ic-desc { font-size: 11px; color: var(--muted); line-height: 1.6; }
  .api-contract { background: var(--surface); border: 1px solid var(--border); border-radius: var(--r-md); padding: 20px; }

  /* RESPONSIVE */
  @media (max-width: 900px) {
    .nav { padding: 0 20px; }
    .nav-center { display: none; }
    .nav-badge { display: none; }
    .hamburger { display: flex; }
    .hero { grid-template-columns: 1fr; gap: 28px; padding: 36px 20px 28px; }
    .hero-right { display: none; }
    .hero-p { max-width: 100%; }
    .stats-row { padding: 0 20px 24px; }
    .pipeline-section { padding: 24px 20px; }
    .pipeline-steps { grid-template-columns: 1fr 1fr; gap: 20px; }
    .pipeline-line { display: none; }
    .demo-page { padding: 24px 20px; }
    .demo-grid { grid-template-columns: 1fr; }
    .arch-page { padding: 24px 20px; }
    .arch-cols { grid-template-columns: 1fr; }
    .about-page { padding: 24px 20px; }
    .impact-grid { grid-template-columns: 1fr; }
  }
  @media (max-width: 560px) {
    :root { --nav-h: 56px; }
    .nav { padding: 0 16px; }
    .nav-logo { font-size: 11px; }
    .hero { padding: 28px 16px 24px; }
    .hero-btns { flex-direction: column; }
    .btn-volt, .btn-outline { width: 100%; text-align: center; padding: 13px; }
    .stats-row { grid-template-columns: repeat(3,1fr); gap: 8px; padding: 0 16px 20px; }
    .stat-card { padding: 12px 8px; }
    .pipeline-section { padding: 20px 16px; }
    .pipeline-steps { grid-template-columns: 1fr 1fr; gap: 14px; }
    .demo-page { padding: 20px 16px; }
    .panel { padding: 18px; }
    .arch-page { padding: 20px 16px; }
    .code-card { padding: 14px; }
    pre { font-size: 10px; }
    .about-page { padding: 20px 16px; }
    .about-hero { padding: 20px; }
    .routing-table { font-size: 11px; }
    .routing-table th, .routing-table td { padding: 8px 10px; }
    .section-head { flex-direction: column; gap: 4px; }
  }
  @media (max-width: 360px) {
    .stats-row { grid-template-columns: 1fr 1fr; }
    .pipeline-steps { grid-template-columns: 1fr; }
    pre { font-size: 9.5px; }
  }
`;

/* ─── DATA ─── */
const EXAMPLES = [
  { label:"💳 Payment",   text:"I've been charged twice this month and can't get a refund." },
  { label:"🔐 Login",     text:"My account is locked and I can't log in since yesterday." },
  { label:"⚙️ Bug",       text:"The app crashes every time I open the dashboard." },
  { label:"📦 Shipping",  text:"Where is my order? It's been 2 weeks with no update." },
  { label:"✨ Feature",   text:"Can you add dark mode to the mobile app?" },
  { label:"❓ General",   text:"I'd like to know how data export works." },
];

const teamIcons = { Billing:"💳", Authentication:"🔐", Engineering:"⚙️", Support:"🎧" };

/* mode → { css class, icon, label } */
const MODE_META = {
  AUTO_RESPONSE:      { cls: "mode-auto",     icon: "⚡", label: "Auto Response" },
  OWNER_ALERT:        { cls: "mode-alert",    icon: "🔔", label: "Owner Alert" },
  HUMAN_REVIEW:       { cls: "mode-human",    icon: "👤", label: "Human Review" },
  CRITICAL_ESCALATION:{ cls: "mode-critical", icon: "🚨", label: "Critical Escalation" },
};

/* ─── NAV ─── */
function NavBar({ page, setPage }) {
  const [open, setOpen] = useState(false);
  const tabs = [["home","Home"],["demo","Live Demo"],["arch","Architecture"],["about","About"]];
  function go(id) { setPage(id); setOpen(false); }
  return (
    <>
      <nav className="nav">
        <div className="nav-logo"><span>[ </span>/IntentIQ<span> ]</span></div>
        <div className="nav-center">
          {tabs.map(([id,label]) => (
            <button key={id} className={`nav-tab${page===id?" active":""}`} onClick={()=>go(id)}>{label}</button>
          ))}
        </div>
        <div className="nav-badge">v1.0 · live</div>
        <button className={`hamburger${open?" open":""}`} onClick={()=>setOpen(o=>!o)} aria-label="Menu">
          <span/><span/><span/>
        </button>
      </nav>
      <div className={`mobile-menu${open?" open":""}`}>
        {tabs.map(([id,label]) => (
          <button key={id} className={`mobile-tab${page===id?" active":""}`} onClick={()=>go(id)}>{label}</button>
        ))}
      </div>
    </>
  );
}

/* ─── HOME ─── */
function HomePage({ setPage }) {
  const tableData = [
    ["payment issue","Billing","HIGH"],["refund request","Support","MEDIUM"],
    ["login issue","Authentication","HIGH"],["technical bug","Engineering","HIGH"],
    ["shipping problem","Support","MEDIUM"],["feature request","Support","MEDIUM"],
    ["general query","Support","MEDIUM"],
  ];
  return (
    <div className="home">
      <div className="hero">
        <div>
          <div className="eyebrow">NLP · FastAPI · Transformers</div>
          <h1 className="hero-h1">Intelligent <em>Support</em> Routing Engine</h1>
          <p className="hero-p">
            Two transformer models. One deterministic rule engine. Any customer text → classified
            intent, sentiment signal, priority, and assigned team — in a single API call.
          </p>
          <div className="hero-btns">
            <button className="btn-volt" onClick={()=>setPage("demo")}>Try Live Demo →</button>
            <button className="btn-outline" onClick={()=>setPage("arch")}>View Architecture</button>
          </div>
        </div>
        <div className="hero-right">
          <div className="terminal-bar">
            <div className="t-dot r"/><div className="t-dot y"/><div className="t-dot g"/>
            <span className="terminal-label">POST /predict</span>
          </div>
          <pre>{`{
  `}<span className="c-cm">{`// Request`}</span>{`
  `}<span className="c-s">{`"text"`}</span>{`: `}<span className="c-kw">{`"charged twice for order"`}</span>{`
}

{
  `}<span className="c-cm">{`// Response`}</span>{`
  `}<span className="c-s">{`"intent"`}</span>{`:       `}<span className="c-kw">{`"payment issue"`}</span>{`,
  `}<span className="c-s">{`"sentiment"`}</span>{`:    `}<span className="c-kw">{`"NEGATIVE"`}</span>{`,
  `}<span className="c-s">{`"priority"`}</span>{`:     `}<span style={{color:"var(--rose)"}}>{`"HIGH"`}</span>{`,
  `}<span className="c-s">{`"team"`}</span>{`:         `}<span style={{color:"var(--volt)"}}>{`"Billing"`}</span>{`,
  `}<span className="c-s">{`"mode"`}</span>{`:         `}<span style={{color:"var(--amber)"}}>{`"OWNER_ALERT"`}</span>{`,
  `}<span className="c-s">{`"owner_alert"`}</span>{`:  `}<span style={{color:"var(--rose)"}}>{`true`}</span>{`,
  `}<span className="c-s">{`"reply"`}</span>{`:        `}<span className="c-kw">{`"We're on it..."`}</span>{`
}`}</pre>
        </div>
      </div>

      <div className="stats-row">
        {[["7","Intent Labels"],["4","Decision Modes"],["4","Routing Teams"]].map(([n,l])=>(
          <div key={l} className="stat-card">
            <div className="stat-num">{n}</div>
            <div className="stat-label">{l}</div>
          </div>
        ))}
      </div>

      <div className="pipeline-section">
        <div className="section-head">
          <h2 className="section-title">How It Works</h2>
          <span className="section-tag">5-step pipeline</span>
        </div>
        <div className="pipeline-steps" style={{gridTemplateColumns:"repeat(5,1fr)"}}>
          <div className="pipeline-line"/>
          {[
            ["01","📥","Ingest","Raw text via POST /predict",null],
            ["02","💬","Sentiment","DistilBERT SST-2","POS / NEG"],
            ["03","🎯","Intent","Zero-shot BART, 7 labels","Top-1 label"],
            ["04","🚦","Route","Rules → priority + team","HIGH / MED"],
            ["05","🤖","Decide","Mode + reply generation","4 modes"],
          ].map(([n,ic,name,detail,chip])=>(
            <div key={n} className="pipe-step">
              <div className="pipe-orb">{ic}</div>
              <div className="pipe-n">{n}</div>
              <div className="pipe-name">{name}</div>
              <div className="pipe-detail">{detail}</div>
              {chip && <div className="pipe-chip">{chip}</div>}
            </div>
          ))}
        </div>
      </div>

      <div className="pipeline-section" style={{paddingTop:0}}>
        <div className="section-head">
          <h2 className="section-title">Routing Matrix</h2>
          <span className="section-tag">from rules.py</span>
        </div>
        <div style={{overflowX:"auto"}}>
          <table className="routing-table">
            <thead>
              <tr><th>Intent</th><th>Team</th><th>Priority (NEGATIVE)</th></tr>
            </thead>
            <tbody>
              {tableData.map(([intent,team,pri])=>(
                <tr key={intent}>
                  <td style={{fontFamily:"var(--font-mono)",fontSize:"11px",color:"var(--sky)"}}>{intent}</td>
                  <td><span className="badge badge-team">{team}</span></td>
                  <td><span className={`badge ${pri==="HIGH"?"badge-high":"badge-med"}`}>{pri}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

/* ─── DEMO ─── */
function DemoPage() {
  const [text, setText]       = useState("");
  const [result, setResult]   = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState(null);
  const [apiStatus, setApiStatus] = useState("idle");
  const [barW, setBarW]       = useState(0);
  const [meterW, setMeterW]   = useState(0);
  const [showRaw, setShowRaw] = useState(false);

  async function analyze() {
    if (!text.trim()) return;
    setLoading(true); setResult(null); setError(null);
    setBarW(0); setMeterW(0); setShowRaw(false);
    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: text.trim() }),
      });
      if (!res.ok) {
        const body = await res.text();
        throw new Error(`Server returned ${res.status}: ${body.slice(0,200)}`);
      }
      const data = await res.json();
      setApiStatus("ok");
      setResult(data);
      setTimeout(() => {
        setBarW(data.confidence ?? 80);
        setMeterW(data.sentiment === "NEGATIVE" ? 85 : 20);
      }, 80);
    } catch (e) {
      setApiStatus("err");
      setError(e.message || String(e));
    } finally {
      setLoading(false);
    }
  }

  function pickExample(ex) { setText(ex.text); setResult(null); setError(null); }

  const statusLabel = { idle:"Ready", ok:"Connected", err:"Error" }[apiStatus];
  const modeMeta = result ? (MODE_META[result.mode] ?? { cls:"mode-human", icon:"❓", label: result.mode }) : null;

  return (
    <div className="demo-page">
      <div className="section-head" style={{marginBottom:"20px"}}>
        <h2 className="section-title">Live Classifier</h2>
        <span className="section-tag">Calls your FastAPI backend</span>
      </div>

      <div className="demo-grid">
        {/* INPUT */}
        <div className="panel">
          <div className="panel-head"><div className="live-dot"/>Input</div>
          <div className="ex-chip-label">Quick examples:</div>
          <div className="ex-chips">
            {EXAMPLES.map((ex,i)=>(
              <div key={i} className="ex-chip" onClick={()=>pickExample(ex)}>{ex.label}</div>
            ))}
          </div>
          <textarea
            className="demo-ta"
            value={text}
            onChange={e=>setText(e.target.value)}
            onKeyDown={e=>{ if(e.key==="Enter"&&e.ctrlKey) analyze(); }}
            placeholder={"Type a customer message…\n\ne.g. My account is locked and I can't log in."}
          />
          <div className="api-status">
            <div className={`api-dot ${apiStatus}`}/>
            <span>{statusLabel}</span>
            <span style={{marginLeft:"auto"}}>Ctrl+Enter to run</span>
          </div>
          <div className="api-url">{API_URL}</div>
          <button className="analyze-btn" disabled={loading||!text.trim()} onClick={analyze}>
            {loading ? "Analyzing…" : "Analyze → Route"}
          </button>
          {error && (
            <div className="error-banner">
              <strong>⚠ Could not reach backend</strong>
              {error}
              <div style={{marginTop:"8px",color:"var(--dim)"}}>
                Make sure FastAPI is running at <code style={{color:"var(--rose)"}}>{API_URL}</code> and CORS is enabled.
              </div>
            </div>
          )}
        </div>

        {/* OUTPUT */}
        <div className="panel">
          <div className="panel-head">Output</div>

          {!result && !loading && !error && (
            <div className="output-placeholder">
              <div style={{fontSize:"32px",opacity:.4}}>🧠</div>
              <p style={{fontFamily:"var(--font-mono)",fontSize:"12px"}}>Awaiting input…</p>
              <p style={{fontSize:"10px",color:"var(--dim)",marginTop:"4px"}}>Select an example or type a message</p>
            </div>
          )}

          {loading && (
            <div className="loading-state">
              <div className="spinner"/>
              <div className="loading-text">Running NLP pipeline…</div>
            </div>
          )}

          {result && (
            <div className="result-card">

              {/* ── Intent ── */}
              <div className="result-field">
                <div className="rf-label">Intent</div>
                <div className="rf-value" style={{color:"var(--sky)"}}>{result.intent}</div>
                <div className="rf-bar">
                  <div className="rf-bar-fill" style={{width:`${barW}%`,background:"var(--sky)"}}/>
                </div>
                {result.confidence != null && (
                  <div className="rf-sub">{result.confidence}% confidence · zero-shot BART</div>
                )}
              </div>

              {/* ── Sentiment ── */}
              <div className="result-field">
                <div className="rf-label">Sentiment · DistilBERT SST-2</div>
                <div className="sentiment-meter">
                  <span className="meter-tag" style={{color:"var(--volt2)"}}>POS</span>
                  <div className="meter-track">
                    <div className="meter-fill" style={{width:`${meterW}%`,background:meterW>50?"var(--rose)":"var(--volt2)"}}/>
                  </div>
                  <span className="meter-tag" style={{color:"var(--rose)",textAlign:"right"}}>NEG</span>
                </div>
                <div className="meter-labels">
                  <span>POSITIVE</span>
                  <span style={{color:result.sentiment==="NEGATIVE"?"var(--rose)":"var(--volt2)",fontWeight:600}}>
                    {result.sentiment}
                  </span>
                  <span>NEGATIVE</span>
                </div>
              </div>

              {/* ── Priority ── */}
              <div className="result-field">
                <div className="rf-label">Priority</div>
                <div className="priority-display">
                  <span className={`priority-pill ${result.priority==="HIGH"?"priority-high":"priority-med"}`}>
                    {result.priority}
                  </span>
                  <span style={{fontSize:"11px",color:"var(--muted)"}}>
                    {result.priority==="HIGH"?"Escalated — negative or critical intent":"Standard routing applies"}
                  </span>
                </div>
              </div>

              {/* ── Team ── */}
              <div className="result-field">
                <div className="rf-label">Assigned Team</div>
                <div className="team-bubble">
                  <div className="team-icon">{teamIcons[result.team]??"🎧"}</div>
                  <div>
                    <div className="team-name">{result.team}</div>
                    <div className="team-sub">routed via rules.py</div>
                  </div>
                </div>
              </div>

              <div className="rf-divider"/>

              {/* ── Decision Mode ── (NEW) */}
              <div className="result-field">
                <div className="rf-label">Decision Mode</div>
                {modeMeta && (
                  <span className={`mode-badge ${modeMeta.cls}`}>
                    <span className="mode-icon">{modeMeta.icon}</span>
                    {modeMeta.label}
                  </span>
                )}
                <div className="rf-sub" style={{marginTop:"6px"}}>
                  {{
                    AUTO_RESPONSE:       "Reply auto-generated and sent.",
                    OWNER_ALERT:         "Reply generated + owner notified.",
                    HUMAN_REVIEW:        "Queued for specialist review.",
                    CRITICAL_ESCALATION: "Immediately escalated to support team.",
                  }[result.mode] ?? ""}
                </div>
              </div>

              {/* ── Owner Alert ── (NEW) */}
              <div className="result-field">
                <div className="rf-label">Owner Alert</div>
                <span className={`alert-pill ${result.owner_alert?"alert-on":"alert-off"}`}>
                  <span className={`alert-pulse ${result.owner_alert?"on":"off"}`}/>
                  {result.owner_alert ? "Alert Fired" : "No Alert"}
                </span>
              </div>

              {/* ── Reply ── (NEW) */}
              <div className="result-field">
                <div className="rf-label">Generated Reply</div>
                <div className="reply-bubble">
                  {result.reply
                    ? <div className="reply-text">{result.reply}</div>
                    : <div className="reply-null">null — no reply for this mode</div>
                  }
                </div>
              </div>

              {/* Raw JSON */}
              <button className="raw-toggle" onClick={()=>setShowRaw(v=>!v)}>
                {showRaw?"Hide":"Show"} raw JSON
              </button>
              {showRaw && (
                <div className="raw-block">{JSON.stringify(result, null, 2)}</div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ─── ARCH ─── */
function ArchPage() {
  const layers = [
    {icon:"🌐",name:"predict.py · API Router",    detail:"FastAPI APIRouter — receives POST /predict, orchestrates analyze(), route(), decide(), owner_alert(), generate_reply()"},
    {icon:"🧠",name:"predictor.py · NLP Engine",  detail:"Loads both HuggingFace pipelines at startup. Exposes single analyze(text) interface"},
    {icon:"📋",name:"rules.py · Routing Logic",   detail:"Pure function route(intent, sentiment) → {priority, team}. Zero ML dependencies"},
    {icon:"⚖️",name:"decision.py · Mode Selector",detail:"decide(text, confidence) → AUTO_RESPONSE | OWNER_ALERT | HUMAN_REVIEW | CRITICAL_ESCALATION"},
    {icon:"💬",name:"reply.py · Reply Generator", detail:"generate_reply(text, intent, sentiment, priority) → natural language reply string"},
    {icon:"🔔",name:"alerts.py · Owner Alert",    detail:"owner_alert(text, intent, confidence) fires notification for OWNER_ALERT / HUMAN_REVIEW / CRITICAL_ESCALATION modes"},
  ];
  return (
    <div className="arch-page">
      <div className="section-head" style={{marginBottom:"20px"}}>
        <h2 className="section-title">Architecture</h2>
        <span className="section-tag">6-module design</span>
      </div>
      <div className="arch-cols">
        <div>
          <div className="code-card">
            <div className="file-label"><div className="file-dot"/>predict.py — API Layer</div>
            <pre>{`from nlp.predictor import analyze
from nlp.rules    import route
from nlp.decision import decide
from nlp.alerts   import owner_alert
from nlp.reply    import generate_reply

@router.post("/predict")
def predict(data: UserInput):
    result  = analyze(text)
    routing = route(result["intent"],
                    result["sentiment"])
    mode    = decide(text,
                     result["confidence"])

    reply = None
    if mode in ["AUTO_RESPONSE",
                "OWNER_ALERT"]:
        reply = generate_reply(...)
    elif mode == "HUMAN_REVIEW":
        reply = "Requires manual review..."
    elif mode == "CRITICAL_ESCALATION":
        reply = "Escalated immediately..."

    alert = False
    if mode in ["OWNER_ALERT",
                "HUMAN_REVIEW",
                "CRITICAL_ESCALATION"]:
        alert = owner_alert(...)

    return { ..., "mode": mode,
             "owner_alert": alert,
             "reply": reply }`}</pre>
          </div>
        </div>
        <div>
          <div className="arch-layers">
            {layers.map((l,i)=>(
              <div key={i} className="layer-row">
                <div className="layer-icon">{l.icon}</div>
                <div>
                  <div className="layer-name">{l.name}</div>
                  <div className="layer-detail">{l.detail}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── ABOUT ─── */
function AboutPage() {
  const impacts = [
    {t:"Zero-retraining expansion",  d:"Add new intent categories by editing candidate_labels — no labelled data needed."},
    {t:"Sentiment escalation",        d:"Negative sentiment auto-escalates to HIGH, catching frustrated customers early."},
    {t:"4-mode decision engine",      d:"decide() selects AUTO_RESPONSE, OWNER_ALERT, HUMAN_REVIEW, or CRITICAL_ESCALATION per message."},
    {t:"Auto-generated replies",      d:"generate_reply() creates context-aware responses so agents only handle truly complex cases."},
  ];
  const tags = ["NLP","Transformers","FastAPI","System Design","REST API","Zero-Shot ML","Python","Hugging Face","Pydantic","Microservices"];
  return (
    <div className="about-page">
      <div className="about-hero">
        <div className="eyebrow">Portfolio · Applied NLP</div>
        <h2 className="about-title">Built for <em>scale</em></h2>
        <p className="about-p">
          IntentIQ demonstrates end-to-end applied NLP system design — from model selection and pipeline
          architecture to REST API design, deterministic rule engines, and automated reply generation. Ready
          to operate inside a larger microservices ecosystem with a clean, contract-driven interface.
        </p>
        <div className="tags-row">
          {tags.map(t=><span key={t} className="tag">{t}</span>)}
        </div>
      </div>
      <div className="section-head" style={{marginBottom:"16px"}}>
        <h2 className="section-title">Why It Matters</h2>
        <span className="section-tag">FAANG-relevant signals</span>
      </div>
      <div className="impact-grid">
        {impacts.map((c,i)=>(
          <div key={i} className="impact-card">
            <div className="ic-title">{c.t}</div>
            <div className="ic-desc">{c.d}</div>
          </div>
        ))}
      </div>
      <div className="api-contract">
        <div className="section-tag" style={{marginBottom:"12px"}}>API Contract · {API_URL}</div>
        <pre>{`POST ${API_URL}
Content-Type: application/json

# Input
{ "text": "<customer message>" }

# Output
{
  "intent":      string   // one of 7 labels
  "confidence":  number   // 0–100
  "sentiment":   string   // POSITIVE | NEGATIVE
  "priority":    string   // HIGH | MEDIUM
  "team":        string   // Billing | Auth | Engineering | Support
  "mode":        string   // AUTO_RESPONSE | OWNER_ALERT
                          // | HUMAN_REVIEW | CRITICAL_ESCALATION
  "owner_alert": boolean  // true if alert was fired
  "reply":       string | null  // generated reply or null
}`}</pre>
      </div>
    </div>
  );
}

/* ─── ROOT ─── */
export default function App() {
  const [page, setPage] = useState("home");
  const pages = {
    home:  <HomePage setPage={setPage}/>,
    demo:  <DemoPage/>,
    arch:  <ArchPage/>,
    about: <AboutPage/>,
  };
  return (
    <>
      <style>{styles}</style>
      <div className="app">
        <NavBar page={page} setPage={setPage}/>
        <div className="page" key={page}>{pages[page]}</div>
      </div>
    </>
  );
}