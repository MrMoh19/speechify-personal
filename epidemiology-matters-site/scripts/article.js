/* =============================================================
   Epidemiology Matters Journal — article interactivity
   - Component 1: Interactive DAG (HIV → smoking → stroke)
   - Component 2: Live regression table
   - Component 3: Scrollytelling (synced sticky DAG)
   - Plus: footnote tooltips, citation copy, exercises accordion
   ============================================================= */

(function () {
  "use strict";

  /* -----------------------------------------------------------
     DAG SPEC — Westreich & Greenland canonical example
     Coordinates are in a 720x340 viewBox.
     ----------------------------------------------------------- */
  const DAG_SPEC = {
    viewBox: "0 0 720 360",
    nodes: [
      { id: "HIV",     label: "HIV",     x: 110, y: 230, type: "exposure", adjustable: false },
      { id: "Smoking", label: "Smoking", x: 360, y: 230, type: "covariate", adjusted: false, adjustable: true, role: "Mediator" },
      { id: "Stroke",  label: "Stroke",  x: 610, y: 230, type: "outcome",  adjustable: false },
      { id: "Age",     label: "Age",     x: 360, y:  60, type: "covariate", adjusted: false, adjustable: true, role: "Confounder" },
      { id: "U",       label: "U",       x: 360, y: 320, type: "unmeasured", adjustable: false, role: "Unmeasured" }
    ],
    edges: [
      // Causal arrows
      { from: "HIV", to: "Smoking", kind: "causal" },
      { from: "Smoking", to: "Stroke", kind: "causal" },
      { from: "HIV", to: "Stroke", kind: "causal", direct: true },
      { from: "Age", to: "HIV", kind: "causal" },
      { from: "Age", to: "Smoking", kind: "causal" },
      { from: "Age", to: "Stroke", kind: "causal" },
      { from: "U", to: "HIV", kind: "causal", unmeasured: true },
      { from: "U", to: "Stroke", kind: "causal", unmeasured: true }
    ]
  };

  function cloneSpec(spec) {
    return JSON.parse(JSON.stringify(spec));
  }

  /* -----------------------------------------------------------
     Render a DAG into a container element.
     onChange(state) is fired whenever a node is toggled.
     ----------------------------------------------------------- */
  function renderDag(container, spec, options) {
    options = options || {};
    container.innerHTML = "";
    const SVGNS = "http://www.w3.org/2000/svg";
    const svg = document.createElementNS(SVGNS, "svg");
    svg.setAttribute("viewBox", spec.viewBox);
    svg.setAttribute("role", "img");
    svg.setAttribute("preserveAspectRatio", "xMidYMid meet");

    // Defs: arrowhead
    const defs = document.createElementNS(SVGNS, "defs");
    defs.innerHTML = `
      <marker id="arrow-${options.id || "default"}" viewBox="0 0 10 10" refX="9" refY="5"
              markerWidth="6" markerHeight="6" orient="auto-start-reverse">
        <path d="M 0 0 L 10 5 L 0 10 z" fill="currentColor"/>
      </marker>
      <marker id="arrow-${options.id || "default"}-blocked" viewBox="0 0 10 10" refX="9" refY="5"
              markerWidth="6" markerHeight="6" orient="auto-start-reverse">
        <path d="M 0 0 L 10 5 L 0 10 z" fill="#8b7d70"/>
      </marker>`;
    svg.appendChild(defs);

    // Edge layer
    const edgeLayer = document.createElementNS(SVGNS, "g");
    edgeLayer.setAttribute("class", "dag-edges");
    svg.appendChild(edgeLayer);

    // Node layer
    const nodeLayer = document.createElementNS(SVGNS, "g");
    nodeLayer.setAttribute("class", "dag-nodes");
    svg.appendChild(nodeLayer);

    // Helper: find node by id
    function nodeById(id) { return spec.nodes.find(n => n.id === id); }

    // Compute path-status: a path is "blocked" if any node on it is adjusted
    // (this is a simplified version sufficient for visualization)
    function isEdgeOnHidPath(edge) {
      // Highlight edges that compose paths from HIV to Stroke
      const hivToStroke = [
        ["HIV", "Stroke"],            // direct
        ["HIV", "Smoking", "Stroke"], // through smoking
      ];
      return hivToStroke.some(p => {
        for (let i = 0; i < p.length - 1; i++) {
          if (p[i] === edge.from && p[i+1] === edge.to) return true;
        }
        return false;
      });
    }

    function isPathOpen(pathNodes) {
      // Open if no internal node (neither endpoint) is adjusted
      for (let i = 1; i < pathNodes.length - 1; i++) {
        const n = nodeById(pathNodes[i]);
        if (n && n.adjusted) return false;
      }
      return true;
    }

    function draw() {
      // Edges
      edgeLayer.innerHTML = "";
      spec.edges.forEach(edge => {
        const from = nodeById(edge.from);
        const to = nodeById(edge.to);
        if (!from || !to) return;

        // Determine if this edge is part of an OPEN HIV→Stroke path
        let highlight = "neutral";
        if (edge.from === "HIV" && edge.to === "Stroke") {
          highlight = "open"; // direct path always open
        } else if (
          (edge.from === "HIV" && edge.to === "Smoking") ||
          (edge.from === "Smoking" && edge.to === "Stroke")
        ) {
          highlight = isPathOpen(["HIV", "Smoking", "Stroke"]) ? "open" : "blocked";
        }

        // Compute endpoints shrunken to circle radius
        const r = 28;
        const dx = to.x - from.x;
        const dy = to.y - from.y;
        const len = Math.sqrt(dx*dx + dy*dy) || 1;
        const ux = dx / len, uy = dy / len;
        const x1 = from.x + ux * r;
        const y1 = from.y + uy * r;
        const x2 = to.x - ux * r;
        const y2 = to.y - uy * r;

        // Direct HIV→Stroke gets a curved arc ABOVE the smoking node
        // so it doesn't overlap the Smoking label
        const isDirectHIVStroke = edge.from === "HIV" && edge.to === "Stroke" && edge.direct;
        const cls = "dag-edge" + (highlight === "open" ? " is-open" : highlight === "blocked" ? " is-blocked" : "");
        const markerUrl = `url(#arrow-${options.id || "default"}${highlight === "blocked" ? "-blocked" : ""})`;

        if (isDirectHIVStroke) {
          const path = document.createElementNS(SVGNS, "path");
          // Arc upward (above smoking which sits at midpoint)
          const midX = (x1 + x2) / 2;
          const arcY = Math.min(y1, y2) - 65; // arc rises ~65px above the line
          const d = `M ${x1} ${y1} Q ${midX} ${arcY} ${x2} ${y2}`;
          path.setAttribute("d", d);
          path.setAttribute("fill", "none");
          path.setAttribute("class", cls);
          path.setAttribute("marker-end", markerUrl);
          edgeLayer.appendChild(path);
        } else {
          const line = document.createElementNS(SVGNS, "line");
          line.setAttribute("x1", x1); line.setAttribute("y1", y1);
          line.setAttribute("x2", x2); line.setAttribute("y2", y2);
          line.setAttribute("class", cls);
          line.setAttribute("marker-end", markerUrl);
          if (edge.unmeasured) line.setAttribute("stroke-dasharray", "4 4");
          edgeLayer.appendChild(line);
        }
      });

      // Nodes
      nodeLayer.innerHTML = "";
      spec.nodes.forEach(n => {
        const g = document.createElementNS(SVGNS, "g");
        let cls = "dag-node";
        if (n.type === "exposure") cls += " is-exposure";
        else if (n.type === "outcome") cls += " is-outcome";
        else if (n.type === "unmeasured") cls += " is-unmeasured";
        else if (n.adjusted) cls += " is-adjusted";
        g.setAttribute("class", cls);
        g.setAttribute("transform", `translate(${n.x},${n.y})`);
        if (n.adjustable) {
          g.setAttribute("tabindex", "0");
          g.setAttribute("role", "button");
          g.setAttribute("aria-pressed", n.adjusted ? "true" : "false");
          g.setAttribute("aria-label", `${n.label}: ${n.adjusted ? "adjusted" : "not adjusted"} (click to toggle)`);
        }

        const c = document.createElementNS(SVGNS, "circle");
        c.setAttribute("r", 28);
        g.appendChild(c);

        const t = document.createElementNS(SVGNS, "text");
        t.setAttribute("text-anchor", "middle");
        t.setAttribute("dy", "0.35em");
        t.textContent = n.label;
        g.appendChild(t);

        // Role label for confounders / mediators
        if (n.role) {
          const rl = document.createElementNS(SVGNS, "text");
          rl.setAttribute("text-anchor", "middle");
          rl.setAttribute("y", "55");
          rl.setAttribute("font-family", "Inter, sans-serif");
          rl.setAttribute("font-size", "11");
          rl.setAttribute("fill", "#8b7d70");
          rl.setAttribute("font-weight", "500");
          rl.textContent = n.role;
          g.appendChild(rl);
        }

        if (n.adjustable) {
          g.addEventListener("click", () => toggle(n.id));
          g.addEventListener("keydown", e => {
            if (e.key === "Enter" || e.key === " ") { e.preventDefault(); toggle(n.id); }
          });
        }
        nodeLayer.appendChild(g);
      });
    }

    function toggle(id) {
      const n = nodeById(id);
      if (!n || !n.adjustable) return;
      n.adjusted = !n.adjusted;
      draw();
      if (typeof options.onChange === "function") options.onChange(getState());
    }

    function getState() {
      const adjusted = {};
      spec.nodes.forEach(n => { if (n.adjustable) adjusted[n.id] = !!n.adjusted; });
      return { adjusted };
    }

    function setAdjusted(id, value) {
      const n = nodeById(id);
      if (!n || !n.adjustable) return;
      n.adjusted = !!value;
      draw();
    }

    container.appendChild(svg);
    draw();

    return { draw, toggle, setAdjusted, getState, spec };
  }

  /* -----------------------------------------------------------
     Component 1: Figure 1 DAG (interactive, free toggling)
     ----------------------------------------------------------- */
  function initFigureDag() {
    const el = document.querySelector('#fig-dag .dag');
    if (!el) return;
    const spec = cloneSpec(DAG_SPEC);
    // Default: smoking adjusted (so user immediately sees the "blocked path" mistake)
    spec.nodes.find(n => n.id === "Smoking").adjusted = true;
    spec.nodes.find(n => n.id === "Age").adjusted = true;
    renderDag(el, spec, { id: "fig1" });
  }

  /* -----------------------------------------------------------
     Component 2: Live regression table
     Toy structural model — keeps things illustrative, not a real DGP
     ----------------------------------------------------------- */
  function initRegTable() {
    const tbody = document.getElementById("regtable-body");
    if (!tbody) return;

    const ctrls = {
      bhiv:   document.getElementById("ctrl-bhiv"),
      hivsmk: document.getElementById("ctrl-hivsmk"),
      u:      document.getElementById("ctrl-u")
    };
    const vals = {
      bhiv:   document.getElementById("val-bhiv"),
      hivsmk: document.getElementById("val-hivsmk"),
      u:      document.getElementById("val-u")
    };

    function fmt(x) { return (x >= 0 ? " " : "") + x.toFixed(2); }
    function fmtCI(lo, hi) { return `(${lo.toFixed(2)}, ${hi.toFixed(2)})`; }

    function update() {
      const bhiv   = parseFloat(ctrls.bhiv.value);   // true total HIV → stroke
      const hivsmk = parseFloat(ctrls.hivsmk.value); // HIV → smoking
      const u      = parseFloat(ctrls.u.value);      // unmeasured U → HIV and U → stroke (each)

      // Coefficients of smoking → stroke and age → stroke held fixed
      const bsmk = 0.45;  // true smoking → stroke
      const bage = 0.02;  // true age (per yr) → stroke

      // What the *adjusted* regression returns:
      // - HIV row: adjusts for smoking (mediator removed) + age. So estimates direct effect only,
      //   PLUS upward bias from omitted shared cause U.
      //   direct_HIV = bhiv - hivsmk * bsmk    (subtract mediated portion through smoking)
      //   plus bias from omitted U (additive in this toy DGP).
      const directHIV = bhiv - hivsmk * bsmk;
      const hiv_est = directHIV + 1.5 * u; // U-bias scaled to be visible at the user-facing slider range
      // - Smoking row: conditioning on HIV (upstream of smoking) — no confounding via HIV pathway,
      //   but if U exists, conditioning on HIV could open a backdoor; we model a small upward drift.
      const smk_est = bsmk + 0.4 * u;
      // - Age: keep stable but slightly attenuated
      const age_est = bage * 10; // express per decade

      // Pseudo SEs (just for visual completeness)
      const seHIV = 0.05;
      const seSMK = 0.04;
      const seAGE = 0.008 * 10;

      // Update header values
      vals.bhiv.textContent   = bhiv.toFixed(2);
      vals.hivsmk.textContent = hivsmk.toFixed(2);
      vals.u.textContent      = u.toFixed(2);

      // Compare HIV estimate to the *total* effect we wanted (bhiv).
      const hivBias       = hiv_est - bhiv;
      const mediationDrop = hivsmk * bsmk;        // amount removed by adjusting for the mediator
      const hivClass      = (mediationDrop > 0.04 || u > 0.04) ? "bad" : "good";
      const smkClass      = (u > 0.04) ? "bad" : "good";

      let hivMsg;
      if (hivClass === "good") {
        hivMsg = "Direct ≈ total (no mediation, no U)";
      } else if (u > 0.04 && mediationDrop > 0.04) {
        hivMsg = `Wrong both ways: mediator drop −${fmt(mediationDrop).trim()}, U-bias +${fmt(1.5*u).trim()}`;
      } else if (u > 0.04) {
        hivMsg = `Confounded: omitted U adds +${fmt(1.5*u).trim()} bias`;
      } else {
        hivMsg = `Controlled direct effect — mediator drop ${fmt(mediationDrop)}`;
      }

      const smkMsg = (u > 0.04)
        ? `Biased: backdoor through HIV when U > 0`
        : `Wrong adjustment set (HIV is upstream of smoking)`;

      tbody.innerHTML = `
        <tr class="row--primary">
          <th scope="row">HIV (exposure)</th>
          <td class="num">${fmt(hiv_est)}</td>
          <td class="num">${fmtCI(hiv_est - 1.96*seHIV, hiv_est + 1.96*seHIV)}</td>
          <td><span class="interp ${hivClass}">${hivMsg}</span></td>
        </tr>
        <tr>
          <th scope="row">Smoking</th>
          <td class="num">${fmt(smk_est)}</td>
          <td class="num">${fmtCI(smk_est - 1.96*seSMK, smk_est + 1.96*seSMK)}</td>
          <td><span class="interp ${smkClass}">${smkMsg}</span></td>
        </tr>
        <tr>
          <th scope="row">Age (per decade)</th>
          <td class="num">${fmt(age_est)}</td>
          <td class="num">${fmtCI(age_est - 1.96*seAGE, age_est + 1.96*seAGE)}</td>
          <td><span class="interp bad">Adjustment set wrong for age → stroke estimand</span></td>
        </tr>
      `;
    }

    Object.values(ctrls).forEach(c => c && c.addEventListener("input", update));
    update();
  }

  /* -----------------------------------------------------------
     Component 3: Scrollytelling — sticky DAG that updates per step
     ----------------------------------------------------------- */
  function initScrolly() {
    const root = document.querySelector('[data-component="scrolly"]');
    if (!root) return;
    const dagEl = root.querySelector('#scrolly-dag');
    const steps = Array.from(root.querySelectorAll('.scrolly__step'));

    const spec = cloneSpec(DAG_SPEC);
    // Hide U initially for clarity in scrolly
    spec.nodes = spec.nodes.filter(n => n.id !== "U");
    spec.edges = spec.edges.filter(e => e.from !== "U" && e.to !== "U");
    spec.nodes.find(n => n.id === "Smoking").adjusted = false;
    spec.nodes.find(n => n.id === "Age").adjusted = false;

    const dag = renderDag(dagEl, spec, { id: "scrolly" });

    // Step → DAG state map
    const stepStates = {
      "1": { Smoking: false, Age: false },  // The question
      "2": { Smoking: false, Age: true  },  // Adjust age
      "3": { Smoking: true,  Age: true  },  // Mistake: adjust smoking (mediator)
      "4": { Smoking: true,  Age: true  },  // Read smoking row
      "5": { Smoking: true,  Age: true  },  // The fallacy
      "6": { Smoking: false, Age: true  },  // The fix: drop smoking from adjustment
    };

    function applyStep(stepNum) {
      const state = stepStates[stepNum];
      if (!state) return;
      Object.keys(state).forEach(id => dag.setAdjusted(id, state[id]));
    }

    // Active step tracking via IntersectionObserver
    const io = new IntersectionObserver((entries) => {
      entries.forEach(en => {
        if (en.isIntersecting) {
          steps.forEach(s => s.classList.remove("is-active"));
          en.target.classList.add("is-active");
          const num = en.target.dataset.step;
          applyStep(num);
        }
      });
    }, { rootMargin: "-40% 0px -40% 0px", threshold: 0 });

    steps.forEach(s => io.observe(s));
  }

  /* -----------------------------------------------------------
     Footnotes — hover/click reveal (simple)
     ----------------------------------------------------------- */
  function initFootnotes() {
    document.querySelectorAll(".fn").forEach(fn => {
      const num = fn.dataset.fn;
      if (!num) return;
      fn.setAttribute("href", "#ref-" + num);
      fn.setAttribute("role", "doc-noteref");
      fn.addEventListener("click", e => {
        e.preventDefault();
        const refsList = document.querySelector(".refs ol");
        if (!refsList) return;
        const li = refsList.children[parseInt(num, 10) - 1];
        if (!li) return;
        li.scrollIntoView({ behavior: "smooth", block: "center" });
        li.style.transition = "background 1.2s ease";
        li.style.background = "rgba(194,65,12,0.12)";
        setTimeout(() => { li.style.background = "transparent"; }, 1500);
      });
    });
  }

  /* -----------------------------------------------------------
     Citation copy
     ----------------------------------------------------------- */
  function initCitationCopy() {
    const btn = document.getElementById("citeCopy");
    if (!btn) return;
    btn.addEventListener("click", () => {
      const text = btn.dataset.clipboard || "";
      const done = () => {
        const orig = btn.textContent;
        btn.textContent = "Copied ✓";
        btn.classList.add("is-copied");
        setTimeout(() => { btn.textContent = orig; btn.classList.remove("is-copied"); }, 1800);
      };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(done, done);
      } else {
        const ta = document.createElement("textarea");
        ta.value = text; document.body.appendChild(ta); ta.select();
        try { document.execCommand("copy"); } catch (e) {}
        document.body.removeChild(ta); done();
      }
    });
  }

  /* -----------------------------------------------------------
     Exercises accordion
     ----------------------------------------------------------- */
  function initExercises() {
    document.querySelectorAll(".exercise").forEach(ex => {
      const q = ex.querySelector(".exercise__q");
      if (!q) return;
      q.setAttribute("aria-expanded", "false");
      q.addEventListener("click", () => {
        const open = ex.classList.toggle("is-open");
        q.setAttribute("aria-expanded", open ? "true" : "false");
      });
    });
  }

  /* -----------------------------------------------------------
     Boot
     ----------------------------------------------------------- */
  function boot() {
    initFigureDag();
    initRegTable();
    initScrolly();
    initFootnotes();
    initCitationCopy();
    initExercises();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
