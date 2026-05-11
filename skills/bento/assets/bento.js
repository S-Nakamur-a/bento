/*! bento.js — Bento runtime
 *  v0.1.0  MIT  https://github.com/S-Nakamur-a/bento
 *
 *  Lazy-loads heavy libs (mermaid, chart.js, highlight.js, katex) only when
 *  the page actually uses them. Reads bento CSS variables so visualisations
 *  inherit the theme automatically.
 */
(function () {
  "use strict";

  const CDN = {
    mermaid: "https://cdn.jsdelivr.net/npm/mermaid@11/dist/mermaid.esm.min.mjs",
    chart:   "https://cdn.jsdelivr.net/npm/chart.js@4.4.4/dist/chart.umd.min.js",
    hljs:    "https://cdn.jsdelivr.net/npm/@highlightjs/cdn-assets@11/highlight.min.js",
    hljsCss: "https://cdn.jsdelivr.net/npm/@highlightjs/cdn-assets@11/styles/github.min.css",
    hljsCssDark: "https://cdn.jsdelivr.net/npm/@highlightjs/cdn-assets@11/styles/github-dark.min.css",
    katex:   "https://cdn.jsdelivr.net/npm/katex@0.16.11/dist/katex.min.js",
    katexCss:"https://cdn.jsdelivr.net/npm/katex@0.16.11/dist/katex.min.css",
    katexAuto:"https://cdn.jsdelivr.net/npm/katex@0.16.11/dist/contrib/auto-render.min.js",
  };

  /* ---------- helpers ---------- */

  const loadCache = new Map();
  function loadScript(src, { module = false } = {}) {
    if (loadCache.has(src)) return loadCache.get(src);
    const p = new Promise((resolve, reject) => {
      if (module) {
        import(src).then(resolve, reject);
        return;
      }
      const s = document.createElement("script");
      s.src = src;
      s.async = true;
      s.onload = () => resolve();
      s.onerror = () => reject(new Error("bento: failed to load " + src));
      document.head.appendChild(s);
    });
    loadCache.set(src, p);
    return p;
  }
  function loadStyle(href) {
    if (loadCache.has(href)) return loadCache.get(href);
    const p = new Promise((resolve) => {
      const l = document.createElement("link");
      l.rel = "stylesheet";
      l.href = href;
      l.onload = () => resolve();
      l.onerror = () => resolve();
      document.head.appendChild(l);
    });
    loadCache.set(href, p);
    return p;
  }

  function cssVar(name, fallback) {
    const v = getComputedStyle(document.body).getPropertyValue(name).trim();
    return v || fallback;
  }
  function isDark() {
    const t = document.body.getAttribute("data-theme");
    if (t === "dark") return true;
    if (t && t !== "default") return false;
    return matchMedia("(prefers-color-scheme: dark)").matches;
  }

  function replaceWithSVG(el, svgString) {
    // Parse SVG via DOMParser (no innerHTML) so untrusted scripts cannot execute.
    const doc = new DOMParser().parseFromString(svgString, "image/svg+xml");
    const svg = doc.documentElement;
    while (el.firstChild) el.removeChild(el.firstChild);
    if (svg && svg.nodeName === "svg") {
      // Strip any <script> elements that may be present in the parsed document.
      svg.querySelectorAll("script").forEach((s) => s.remove());
      el.appendChild(document.importNode(svg, true));
    } else {
      showError(el, "failed to parse SVG output");
    }
  }

  function showError(el, msg) {
    while (el.firstChild) el.removeChild(el.firstChild);
    const pre = document.createElement("pre");
    pre.style.color = "var(--bento-danger)";
    pre.textContent = "bento: " + msg;
    el.appendChild(pre);
  }

  /* ---------- Mermaid ---------- */

  async function initMermaid(nodes) {
    if (!nodes.length) return;
    const m = await loadScript(CDN.mermaid, { module: true });
    const mermaid = m.default || m;
    const v = (name, fallback) => cssVar(name, fallback);
    mermaid.initialize({
      startOnLoad: false,
      theme: "base",
      themeVariables: {
        // Frame / background
        background:             v("--bento-bg"),
        // Primary nodes (most common rounded-rect)
        primaryColor:           v("--bento-surface"),
        primaryBorderColor:     v("--bento-accent"),
        primaryTextColor:       v("--bento-fg"),
        // Secondary (decisions / alternates)
        secondaryColor:         v("--bento-accent-soft"),
        secondaryBorderColor:   v("--bento-accent"),
        secondaryTextColor:     v("--bento-fg"),
        // Tertiary (other alt fills)
        tertiaryColor:          v("--bento-surface-2"),
        tertiaryBorderColor:    v("--bento-border-strong"),
        tertiaryTextColor:      v("--bento-fg-soft"),
        // Edges & arrows
        lineColor:              v("--bento-border-strong"),
        edgeLabelBackground:    v("--bento-surface"),
        // Cluster / subgraph
        clusterBkg:             v("--bento-surface-2"),
        clusterBorder:          v("--bento-border"),
        titleColor:             v("--bento-fg"),
        // Notes / extras
        noteBkgColor:           v("--bento-accent-soft"),
        noteBorderColor:        v("--bento-accent"),
        noteTextColor:          v("--bento-fg"),
        // Typography
        fontFamily:             v("--bento-font-sans", "system-ui"),
        fontSize:               "15px",
      },
      flowchart: {
        curve: "basis",
        nodeSpacing: 36,
        rankSpacing: 56,
        padding: 12,
        htmlLabels: true,
      },
      securityLevel: "strict",
    });
    let i = 0;
    for (const el of nodes) {
      const src = el.textContent.trim();
      try {
        const id = "bento-mermaid-" + (i++);
        const { svg } = await mermaid.render(id, src);
        replaceWithSVG(el, svg);
        el.classList.add("bento-mermaid--rendered");
      } catch (e) {
        showError(el, "mermaid: " + (e.message || String(e)));
      }
    }
  }

  /* ---------- Charts ---------- */

  const CHART_PALETTE_KEYS = [
    "--bento-accent",
    "--bento-success",
    "--bento-warn",
    "--bento-danger",
    "--bento-tip",
    "--bento-info",
  ];

  function chartPalette() {
    return CHART_PALETTE_KEYS.map((k, i) => cssVar(k, ["#2f5fbf", "#1b8a5a", "#b66a00", "#c0392b", "#6d28d9", "#2563eb"][i]));
  }

  function parseJSONAttr(el, attr, fallback) {
    const raw = el.getAttribute(attr);
    if (!raw) return fallback;
    try { return JSON.parse(raw); }
    catch (e) {
      console.warn(`bento: invalid JSON in ${attr}`, raw);
      return fallback;
    }
  }

  async function initCharts(nodes) {
    if (!nodes.length) return;
    await loadScript(CDN.chart);
    const Chart = window.Chart;
    if (!Chart) return;
    const fg = cssVar("--bento-fg", "#1a2238");
    const grid = cssVar("--bento-border", "#e6e4df");
    Chart.defaults.color = fg;
    Chart.defaults.borderColor = grid;
    Chart.defaults.font.family = cssVar("--bento-font-sans", "system-ui");

    for (const el of nodes) {
      const type = el.dataset.type || "bar";
      const labels = parseJSONAttr(el, "data-labels", []);
      const values = parseJSONAttr(el, "data-values", null);
      const series = parseJSONAttr(el, "data-series", null);
      const title = el.dataset.title || "";

      const palette = chartPalette();
      let datasets;
      if (series) {
        datasets = series.map((s, i) => ({
          label: s.label || `Series ${i + 1}`,
          data: s.values,
          backgroundColor: type === "line" ? hexA(palette[i % palette.length], 0.15) : palette[i % palette.length],
          borderColor: palette[i % palette.length],
          borderWidth: 2,
          tension: 0.3,
          fill: type === "line",
        }));
      } else if (values) {
        datasets = [{
          label: title || "",
          data: values,
          backgroundColor:
            (type === "doughnut" || type === "pie")
              ? values.map((_, i) => palette[i % palette.length])
              : (type === "line" ? hexA(palette[0], 0.15) : palette[0]),
          borderColor: palette[0],
          borderWidth: 2,
          tension: 0.3,
          fill: type === "line",
        }];
      } else {
        continue;
      }

      const canvas = document.createElement("canvas");
      el.replaceChildren(canvas);

      new Chart(canvas, {
        type,
        data: { labels, datasets },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: datasets.length > 1 || ["pie", "doughnut", "radar"].includes(type) },
            title: title ? { display: true, text: title } : { display: false },
          },
          scales: ["pie", "doughnut", "radar"].includes(type) ? {} : {
            x: { grid: { color: grid }, ticks: { color: fg } },
            y: { grid: { color: grid }, ticks: { color: fg }, beginAtZero: true },
          },
        },
      });
    }
  }

  function hexA(hex, alpha) {
    let h = hex.replace("#", "");
    if (h.length === 3) h = h.split("").map((c) => c + c).join("");
    if (h.length !== 6) {
      const ctx = document.createElement("canvas").getContext("2d");
      ctx.fillStyle = hex;
      h = ctx.fillStyle.replace("#", "");
    }
    const r = parseInt(h.slice(0, 2), 16);
    const g = parseInt(h.slice(2, 4), 16);
    const b = parseInt(h.slice(4, 6), 16);
    return `rgba(${r},${g},${b},${alpha})`;
  }

  /* ---------- Highlight.js ---------- */

  async function initHighlight(nodes) {
    if (!nodes.length) return;
    await Promise.all([
      loadStyle(isDark() ? CDN.hljsCssDark : CDN.hljsCss),
      loadScript(CDN.hljs),
    ]);
    const hljs = window.hljs;
    if (!hljs) return;
    nodes.forEach((n) => hljs.highlightElement(n));
  }

  /* ---------- KaTeX ---------- */

  async function initKaTeX() {
    const body = document.querySelector(".bento");
    if (!body) return;
    const text = body.textContent;
    if (!/\\\(|\\\[|\$\$/.test(text)) return;
    await loadStyle(CDN.katexCss);
    await loadScript(CDN.katex);
    await loadScript(CDN.katexAuto);
    if (window.renderMathInElement) {
      window.renderMathInElement(body, {
        delimiters: [
          { left: "\\[", right: "\\]", display: true },
          { left: "$$", right: "$$", display: true },
          { left: "\\(", right: "\\)", display: false },
        ],
        throwOnError: false,
      });
    }
  }

  /* ---------- TOC ---------- */

  function slugify(s) {
    return (s || "")
      .toLowerCase()
      .replace(/[^\p{Letter}\p{Number}]+/gu, "-")
      .replace(/(^-|-$)/g, "")
      .slice(0, 64) || "section";
  }

  const HEADING_SKIP = ".bento-card, .bento-callout, .bento-stat, .bento-steps, .bento-timeline, .bento-toc, .bento-hero";

  function sectionHeadings(scope) {
    return Array.from(scope.querySelectorAll("h2, h3"))
      .filter((h) => !h.closest(HEADING_SKIP));
  }

  // Assigns slug IDs to section headings that don't have one. Used by
  // both the TOC and cross-references so anchors work whether or not the
  // page has a <nav class="bento-toc">.
  function ensureHeadingIds(root) {
    const used = new Set();
    const headings = sectionHeadings(root);
    headings.forEach((h) => { if (h.id) used.add(h.id); });
    headings.forEach((h) => {
      if (h.id) return;
      let id = slugify(h.textContent);
      let n = 2;
      while (used.has(id)) id = slugify(h.textContent) + "-" + (n++);
      used.add(id);
      h.id = id;
    });
  }

  function buildTOC(tocEl) {
    const doc = tocEl.closest(".bento-doc") || document;
    const headings = sectionHeadings(doc);
    if (!headings.length) { tocEl.remove(); return; }

    const root = document.createElement("ol");
    let currentH2 = null;
    let currentH2List = null;

    for (const h of headings) {
      const li = document.createElement("li");
      const a = document.createElement("a");
      a.href = "#" + h.id;
      a.textContent = h.textContent;
      li.appendChild(a);

      if (h.tagName === "H2") {
        root.appendChild(li);
        currentH2 = li;
        currentH2List = null;
      } else if (h.tagName === "H3" && currentH2) {
        if (!currentH2List) {
          currentH2List = document.createElement("ol");
          currentH2.appendChild(currentH2List);
        }
        currentH2List.appendChild(li);
      } else {
        root.appendChild(li);
      }
    }
    tocEl.appendChild(root);
  }

  /* ---------- Cross-references ---------- */

  // `.bento-xref` with empty text → fill from target heading.
  // `.bento-related[data-refs]` → build title + <ul> of links to targets.
  // Heading IDs must already exist (ensureHeadingIds runs first in boot).
  function buildCrossRefs(root) {
    root.querySelectorAll("a.bento-xref[href^='#']").forEach((a) => {
      if (a.textContent.trim()) return;
      const id = decodeURIComponent(a.getAttribute("href").slice(1));
      if (!id) return;
      const target = document.getElementById(id);
      if (target) a.textContent = target.textContent.trim();
    });

    root.querySelectorAll(".bento-related[data-refs]:not([data-built])").forEach((el) => {
      el.setAttribute("data-built", "1");
      const refs = el.dataset.refs.split(/[,\s]+/).filter(Boolean);
      if (!refs.length) return;

      if (!el.querySelector("strong")) {
        const strong = document.createElement("strong");
        strong.textContent = el.dataset.title || "Related";
        el.appendChild(strong);
      }
      let ul = el.querySelector("ul");
      if (!ul) {
        ul = document.createElement("ul");
        el.appendChild(ul);
      }
      for (const raw of refs) {
        const ref = raw.startsWith("#") ? raw : "#" + raw;
        const target = document.getElementById(decodeURIComponent(ref.slice(1)));
        const li = document.createElement("li");
        const a = document.createElement("a");
        a.href = ref;
        a.textContent = target ? target.textContent.trim() : ref;
        li.appendChild(a);
        ul.appendChild(li);
      }
    });
  }

  /* ---------- Copy buttons ---------- */

  // <button class="bento-btn bento-copy" data-copy-from="#config">…</button>
  //   On click, copies the target's value (for inputs) or textContent
  //   (for other elements) to the clipboard. Sets data-copied="1" briefly
  //   so the CSS feedback (✓ / ✕) shows up.
  // Alternative: data-copy-text="literal text" copies a fixed string.
  function bindCopyButtons(root) {
    root.querySelectorAll(".bento-copy:not([data-bound])").forEach((btn) => {
      btn.setAttribute("data-bound", "1");
      btn.addEventListener("click", async () => {
        let text = btn.dataset.copyText || "";
        if (!text && btn.dataset.copyFrom) {
          const target = document.querySelector(btn.dataset.copyFrom);
          if (target) {
            text = ("value" in target && typeof target.value === "string")
              ? target.value
              : target.textContent.trim();
          }
        }
        if (!text) return;
        try {
          await navigator.clipboard.writeText(text);
          btn.setAttribute("data-copied", "1");
        } catch (e) {
          btn.setAttribute("data-copied", "fail");
        }
        setTimeout(() => btn.removeAttribute("data-copied"), 1600);
      });
    });
  }

  /* ---------- boot ---------- */

  function boot() {
    const root = document.querySelector(".bento") || document.body;
    ensureHeadingIds(root);

    root.querySelectorAll("nav.bento-toc:empty, nav.bento-toc:not([data-built])").forEach((el) => {
      el.setAttribute("data-built", "1");
      buildTOC(el);
    });

    buildCrossRefs(root);
    bindCopyButtons(root);

    initMermaid(Array.from(root.querySelectorAll(".bento-mermaid:not([data-built])"))
      .map((el) => { el.setAttribute("data-built", "1"); return el; }));

    initCharts(Array.from(root.querySelectorAll(".bento-chart:not([data-built])"))
      .map((el) => { el.setAttribute("data-built", "1"); return el; }));

    initHighlight(Array.from(root.querySelectorAll('pre code[class*="language-"]:not([data-built])'))
      .map((el) => { el.setAttribute("data-built", "1"); return el; }));

    initKaTeX();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }

  window.bento = Object.assign(window.bento || {}, { refresh: boot });
})();
