import type { ThemeSettings } from "./settings";
import { customCssBlock, themeVariables } from "./theme";

export function pageStyles(settings: ThemeSettings): string {
  return `    :root {
      ${themeVariables(settings)}
      /* Legacy fallbacks kept while the page stylesheet is modularized. */
      /* Palette Royal Velvet — le thème actif du vault Obsidian. */
    }
    * { box-sizing: border-box; }
    body {
      background: var(--page-bg);
      color: var(--page-text);
      margin: 0;
    }
    main { line-height: 1.65; margin: 0 auto; max-width: var(--content-width); padding: 40px 24px 72px; }
    h1, h2, h3, h4, h5, h6 { line-height: 1.2; margin: 1.4em 0 0.45em; }
    h1, h2, h3, h4, h5, h6 {
      -webkit-text-fill-color: transparent;
      background-clip: text;
      -webkit-background-clip: text;
    }
    h1 { background-image: linear-gradient(135deg, var(--heading-pink), var(--heading-orange)); }
    h2 { background-image: linear-gradient(135deg, var(--heading-orange), var(--heading-yellow)); }
    h3 { background-image: linear-gradient(135deg, var(--heading-yellow), var(--heading-green)); }
    h4 { background-image: linear-gradient(135deg, var(--heading-green), var(--heading-blue)); }
    h5 { background-image: linear-gradient(135deg, var(--heading-blue), var(--heading-purple)); }
    h6 { background-image: linear-gradient(135deg, var(--heading-purple), var(--heading-pink)); }
    h1 { font-size: clamp(2.2rem, 4vw, 3.4rem); letter-spacing: -0.04em; margin: 0 0 22px; }
    h2 { font-size: 1.65rem; }
    h3 { font-size: 1.35rem; }
    h4 { font-size: 1.15rem; }
    h5, h6 { font-size: 1rem; }
    a { color: var(--page-link); text-decoration-color: hsl(330 100% 75.1% / 0.45); text-underline-offset: 0.16em; }
    a:hover { color: hsl(330 100% 90%); text-decoration-color: currentColor; }
    a.internal-link { color: var(--heading-orange); text-decoration-color: hsl(35 100% 75.1% / 0.5); }
    a.external-link { color: var(--heading-green); text-decoration-color: hsl(115 100% 75.1% / 0.5); }
    a.internal-link:hover { color: hsl(35 100% 90%); }
    a.external-link:hover { color: hsl(115 100% 90%); }
    .back { display: inline-block; font-size: 0.9rem; margin-bottom: 24px; text-decoration: none; }
    p { margin: 0.8em 0; }
    strong { color: hsl(60 30% 100%); }
    em { color: var(--heading-purple); }
    hr { border: 0; border-top: 1px solid var(--page-border); margin: 2em 0; }
    code {
      background: hsl(235 15% 9%);
      border: 1px solid hsl(285 100% 75.1% / 0.18);
      border-radius: 4px;
      color: var(--heading-purple);
      font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
      padding: 0.1em 0.3em;
    }
    pre {
      background: hsl(235 15% 9%);
      border: 1px solid hsl(285 100% 75.1% / 0.18);
      border-radius: 8px;
      overflow: auto;
      padding: 14px;
    }
    pre code { background: transparent; border: 0; color: var(--page-text); padding: 0; }
    blockquote {
      background: hsl(235 15% 13%);
      border: 0 solid var(--heading-orange);
      border-left-width: 4px;
      border-radius: 4px;
      color: var(--page-text);
      margin: 1.2em 30px;
      padding: 10px 20px;
    }
    ul, ol { margin: 0.75em 0; padding-left: 1.8em; }
    li { margin: 0.3em 0; padding-left: 0.15em; }
    ul li::marker, ol li::marker { color: var(--heading-pink); }
    ul ul li::marker, ol ol li::marker { color: var(--heading-orange); }
    ul ul ul li::marker, ol ol ol li::marker { color: var(--heading-yellow); }
    ul ul ul ul li::marker, ol ol ol ol li::marker { color: var(--heading-green); }
    ul ul ul ul ul li::marker, ol ol ol ol ol li::marker { color: var(--heading-blue); }
    ul ul ul ul ul ul li::marker, ol ol ol ol ol ol li::marker { color: var(--heading-purple); }
    mark { background: hsl(60 100% 75.1% / 0.25); color: var(--page-text); }
    del { color: var(--page-muted); }
    img { border-radius: 4px; display: block; height: auto; margin: 16px 0; max-width: 100%; }
    .vault-hero {
      background: linear-gradient(180deg, var(--page-surface-strong), var(--page-surface));
      border: 1px solid var(--page-border);
      border-radius: 26px;
      box-shadow: var(--page-shadow);
      margin-bottom: 28px;
      padding: 22px 22px 20px;
    }
    .vault-toolbar {
      align-items: center;
      display: flex;
      gap: 12px;
      justify-content: space-between;
      margin-bottom: 18px;
    }
    .vault-breadcrumbs {
      align-items: center;
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      min-width: 0;
    }
    .vault-crumb {
      color: var(--page-muted);
      text-decoration: none;
    }
    .vault-crumb.is-current,
    .vault-crumb:hover {
      color: var(--page-text);
    }
    .vault-crumb-sep {
      color: var(--page-muted);
    }
    .vault-toolbar-actions {
      display: flex;
      gap: 10px;
    }
    .vault-button {
      background: var(--page-surface);
      border: 1px solid var(--page-border);
      border-radius: 999px;
      color: var(--page-text);
      padding: 8px 14px;
      text-decoration: none;
    }
    .vault-button:hover {
      background: var(--page-surface-strong);
    }
    .vault-label {
      color: var(--page-link);
      font-size: 0.76rem;
      font-weight: 700;
      letter-spacing: 0.16em;
      margin: 0 0 10px;
      text-transform: uppercase;
    }
    .vault-hero-main {
      align-items: end;
      display: flex;
      justify-content: space-between;
      gap: 20px;
    }
    .vault-path {
      color: var(--page-accent);
      font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
      font-size: 1.1rem;
      margin: 0 0 6px;
    }
    .vault-count {
      color: var(--page-muted);
      margin: 0;
    }
    .vault-section {
      margin-top: 24px;
    }
    .vault-section-head {
      align-items: center;
      display: flex;
      justify-content: space-between;
      margin-bottom: 10px;
    }
    .entry-list {
      list-style: none;
      margin: 0;
      padding: 0;
    }
    .entry-row {
      border-top: 1px solid var(--page-border);
    }
    .entry-main {
      color: inherit;
      display: block;
      padding: 16px 2px;
      text-decoration: none;
    }
    .entry-main:hover .entry-title {
      color: var(--page-link);
    }
    .entry-kicker {
      color: var(--page-link);
      display: block;
      font-size: 0.74rem;
      font-weight: 700;
      letter-spacing: 0.14em;
      margin-bottom: 4px;
      text-transform: uppercase;
    }
    .entry-title {
      color: var(--page-text);
      display: block;
      font-size: 1.08rem;
      font-weight: 650;
    }
    .entry-meta {
      color: var(--page-muted);
      display: block;
      font-size: 0.92rem;
      margin-top: 4px;
    }
    .markdown-table-wrap {
      margin: 16px 0 22px;
      overflow-x: auto;
    }
    .markdown-table {
      border-collapse: separate;
      border-spacing: 0;
      outline: 2px solid var(--page-surface);
      outline-offset: -2px;
      border-radius: 4px;
      width: 100%;
    }
    .markdown-table th,
    .markdown-table td {
      padding: 10px 12px;
      text-align: left;
      vertical-align: top;
    }
    .markdown-table th {
      background-image: linear-gradient(135deg, var(--heading-purple), var(--heading-pink));
      color: hsl(235 15% 15%);
      font-size: 1em;
      font-weight: 700;
      text-align: center;
    }
    .markdown-table tbody tr:nth-child(odd) { background: hsl(235 15% 13%); }
    .markdown-table tbody tr:nth-child(even) { background: hsl(235 15% 15%); }
    .shared-sprint-dashboard {
      display: grid;
      gap: 16px;
      margin: 12px 0 28px;
    }
    .shared-sprint-totals {
      display: grid;
      gap: 10px;
      grid-template-columns: repeat(4, minmax(0, 1fr));
    }
    .shared-sprint-totals > div,
    .shared-sprint-grid {
      background: var(--page-surface);
      border: 1px solid var(--page-border);
      border-radius: 16px;
      box-shadow: var(--page-shadow);
    }
    .shared-sprint-totals > div {
      font-size: 0.92rem;
      font-weight: 700;
      padding: 14px 16px;
    }
    .shared-sprint-columns {
      display: grid;
      gap: 14px;
      grid-template-columns: repeat(3, minmax(0, 1fr));
    }
    .shared-sprint-column h4 {
      font-size: 0.82rem;
      letter-spacing: 0.14em;
      margin: 0 0 8px;
      text-transform: uppercase;
    }
    .shared-sprint-grid {
      margin: 0;
      padding: 16px;
      white-space: pre-wrap;
      word-break: break-word;
    }
    .shared-sprint-empty {
      background: var(--page-surface);
      border: 1px solid var(--page-border);
      border-radius: 16px;
      padding: 16px;
    }
    .shared-note-layout { display: grid; gap: 32px; grid-template-columns: minmax(0, 1fr) 240px; margin: 0 auto; max-width: 1440px; padding: 40px 24px 72px; }
    .shared-note-layout main { margin: 0; max-width: none; min-width: 0; padding: 0; }
    .shared-note-layout .note-outline { align-self: start; position: sticky; top: 24px; }
    .note-outline h2 { border-bottom: 1px solid var(--page-border); font-size: 0.95rem; margin: 0; padding: 10px 14px; }
    .note-outline ol { list-style: none; margin: 0; max-height: calc(100vh - 110px); overflow: auto; padding: 10px 12px; }
    .note-outline li { margin: 2px 0; padding: 0; }
    .note-outline a { border-left: 2px solid transparent; color: var(--page-muted); display: block; font-size: 0.88rem; line-height: 1.4; overflow-wrap: anywhere; padding: 4px 8px; text-decoration: none; }
    .note-outline a:hover { border-left-color: var(--heading-pink); color: var(--page-link); }
    .note-outline a[aria-current="location"] { background: var(--page-surface); border-left-color: var(--heading-pink); color: var(--page-link); font-weight: 700; }
    .note-outline-level-2 { margin-left: 0.6rem !important; }
    .note-outline-level-3 { margin-left: 1.2rem !important; }
    .note-outline-level-4 { margin-left: 1.8rem !important; }
    .note-outline-level-5 { margin-left: 2.4rem !important; }
    .note-outline-level-6 { margin-left: 3rem !important; }

    @media (max-width: 720px) {
      .shared-note-layout { display: flex; flex-direction: column; gap: 20px; padding: 24px 16px 56px; }
      .shared-note-layout .note-outline { order: -1; position: static; }
      .note-outline ol { max-height: 35vh; }
      main { padding: 24px 16px 56px; }
      .vault-toolbar,
      .vault-hero-main { align-items: flex-start; flex-direction: column; }
      .vault-toolbar-actions { width: 100%; }
      .shared-sprint-totals,
      .shared-sprint-columns { grid-template-columns: 1fr; }
    }
    ${customCssBlock(settings)}
`;
}
