/* ============================================================
   EpiMatters v2 — Stick figure SVG + lattice generator
   The canonical brand figure derived from the book cover.
   ============================================================ */

const SVG_NS = 'http://www.w3.org/2000/svg';

/**
 * The figure path. Viewbox 48x88. Filled silhouette, currentColor.
 * Proportions match the book cover: round head, broad chamfered shoulders,
 * tapered torso, straight legs.
 */
const FIGURE_PATH =
  // head
  'M24 2 a8 8 0 1 1 -0.001 0 ' +
  // neck + torso (chamfered shoulders, tapered down)
  'M18 20 L30 20 L36 28 L36 50 L28 54 L28 86 L23 86 L23 60 L25 60 L25 54 L20 54 L20 86 L15 86 L15 54 L12 50 L12 28 Z ' +
  // left arm
  'M12 28 L4 44 L7 47 L15 32 Z ' +
  // right arm
  'M36 28 L44 44 L41 47 L33 32 Z';

/**
 * Build a single inline SVG figure.
 * @param {Object} opts
 * @param {boolean} opts.signal - if true, color is --signal
 * @param {string}  opts.cls    - extra class
 * @param {number}  opts.tilt   - degrees tilt (default 0)
 */
function figure({ signal = false, cls = '', tilt = 0 } = {}) {
  const svg = document.createElementNS(SVG_NS, 'svg');
  svg.setAttribute('viewBox', '0 0 48 96');
  svg.setAttribute('class', `fig ${signal ? 'is-signal' : ''} ${cls}`.trim());
  svg.setAttribute('aria-hidden', 'true');
  svg.setAttribute('focusable', 'false');
  svg.setAttribute('preserveAspectRatio', 'xMidYMid meet');
  if (tilt) svg.style.transform = `rotate(${tilt}deg)`;
  svg.style.color = signal ? 'var(--signal)' : 'var(--pop-grey)';

  // Single fill color via the SVG's color
  // Proportions modeled on the book cover:
  //   head: r=8 at (24, 10)
  //   neck gap
  //   shoulders span 14 (from x=10 to x=38), chamfered
  //   torso narrows to ~18 wide at y=44, then to legs
  //   arms extend down from shoulder corners
  //   legs split at y=58 down to y=92, separated by a thin gap

  // Head
  const head = document.createElementNS(SVG_NS, 'circle');
  head.setAttribute('cx', '24'); head.setAttribute('cy', '9'); head.setAttribute('r', '7');
  head.setAttribute('fill', 'currentColor');
  svg.appendChild(head);

  // Body: single closed path  — head-bottom → shoulders out → arms down → torso → legs → back up
  // Drawn carefully so there are no overlaps or stray strokes
  const body = document.createElementNS(SVG_NS, 'path');
  body.setAttribute('d', [
    // start at left shoulder top
    'M 14 19',
    // shoulder slope up to neck area then across to right shoulder top
    'L 19 17',
    'L 29 17',
    'L 34 19',
    // outer right shoulder/arm slope down
    'L 39 30',
    'L 41 48',
    // right hand bottom
    'L 37 49',
    // back up inside of right arm
    'L 35 30',
    // right side of torso down to right leg
    'L 33 50',
    // right leg outer to foot
    'L 31 92',
    'L 27 92',
    // right leg inner back up to crotch
    'L 25 58',
    // crotch gap to left leg inner
    'L 23 58',
    // left leg inner to foot
    'L 21 92',
    'L 17 92',
    // left leg outer back up
    'L 15 50',
    // inner left side of torso back up to inside of left arm
    'L 13 30',
    // left hand bottom (continuing along inside of left arm down)
    'L 11 49',
    'L 7 48',
    // outer left arm back up to shoulder
    'L 9 30',
    // outer left shoulder back to start
    'Z'
  ].join(' '));
  body.setAttribute('fill', 'currentColor');
  svg.appendChild(body);

  return svg;
}

/**
 * Build a tilted lattice of figures.
 *
 * @param {HTMLElement} container - element to fill (will be cleared)
 * @param {Object} opts
 * @param {number} opts.rows      - rows of figures
 * @param {number} opts.cols      - cols of figures
 * @param {number} opts.tilt      - degrees the whole lattice is rotated (default 15)
 * @param {number} opts.figW      - figure pixel width (default 44)
 * @param {number} opts.gapX      - horizontal gap as multiplier of figW (default 0.55)
 * @param {number} opts.gapY      - vertical gap as multiplier of figH (default 0.25)
 * @param {[number,number]} opts.signal - [row, col] of the red figure (0-indexed). null => no signal.
 * @param {number} opts.opacity   - lattice opacity (default 1)
 * @param {number} opts.staggerMs - per-row reveal delay for fade-in. 0 disables animation.
 */
function lattice(container, {
  rows = 10,
  cols = 14,
  tilt = 15,
  figW = 44,
  gapX = 0.55,
  gapY = 0.25,
  signal = null,
  opacity = 1,
  staggerMs = 0,
} = {}) {
  if (!container) return;
  container.innerHTML = '';

  const figH = figW * (96 / 48);
  const stepX = figW * (1 + gapX);
  const stepY = figH * (1 + gapY);

  // Compute total size so we can center
  const totalW = cols * stepX;
  const totalH = rows * stepY;

  // Wrap in an inner div we can tilt without affecting layout
  const inner = document.createElement('div');
  inner.style.position = 'absolute';
  inner.style.left = '50%';
  inner.style.top = '50%';
  inner.style.transform = `translate(-50%, -50%) rotate(-${tilt}deg)`;
  inner.style.width = `${totalW}px`;
  inner.style.height = `${totalH}px`;
  inner.style.opacity = String(opacity);

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const isSig = signal && signal[0] === r && signal[1] === c;
      const f = figure({ signal: isSig });
      f.style.position = 'absolute';
      // Offset every other row by half a step for tessellation
      const xOffset = (r % 2 === 0) ? 0 : stepX * 0.5;
      f.style.left = `${c * stepX + xOffset}px`;
      f.style.top = `${r * stepY}px`;
      f.style.width = `${figW}px`;
      f.style.height = `${figH}px`;
      if (staggerMs > 0) {
        f.style.opacity = '0';
        f.style.transition = `opacity 360ms ease-out`;
        const delay = isSig ? (rows * staggerMs + 200) : (r * staggerMs);
        setTimeout(() => { f.style.opacity = '1'; }, delay);
      }
      inner.appendChild(f);
    }
  }

  // Make sure container is positioned
  if (getComputedStyle(container).position === 'static') {
    container.style.position = 'relative';
  }
  container.style.overflow = 'hidden';
  container.appendChild(inner);
}

/**
 * Mini 3x3 lattice for episode cards (orthogonal, no tilt).
 * @param {HTMLElement} container
 * @param {[number,number]} signal - [row, col] in the 3x3
 */
function miniLattice(container, signal = [1, 1]) {
  if (!container) return;
  container.innerHTML = '';
  const svg = document.createElementNS(SVG_NS, 'svg');
  svg.setAttribute('viewBox', '0 0 64 48');
  svg.setAttribute('class', 'ep-card__minilat');
  svg.setAttribute('aria-hidden', 'true');

  // 3 cols x 3 rows of figures, each ~14x22 px in the 64x48 viewbox
  const cellW = 20, cellH = 16;
  const figW = 8, figH = 14;
  const padX = (cellW - figW) / 2;
  const padY = (cellH - figH) / 2;

  for (let r = 0; r < 3; r++) {
    for (let c = 0; c < 3; c++) {
      const isSig = signal[0] === r && signal[1] === c;
      const x = c * cellW + padX;
      const y = r * cellH + padY;
      // Head
      const head = document.createElementNS(SVG_NS, 'circle');
      head.setAttribute('cx', String(x + figW/2));
      head.setAttribute('cy', String(y + 2));
      head.setAttribute('r', '1.6');
      head.setAttribute('fill', isSig ? 'var(--signal)' : 'var(--pop-grey)');
      svg.appendChild(head);
      // Body (simple capsule)
      const body = document.createElementNS(SVG_NS, 'rect');
      body.setAttribute('x', String(x + 2));
      body.setAttribute('y', String(y + 4));
      body.setAttribute('width', String(figW - 4));
      body.setAttribute('height', String(figH - 4));
      body.setAttribute('rx', '1');
      body.setAttribute('fill', isSig ? 'var(--signal)' : 'var(--pop-grey)');
      svg.appendChild(body);
    }
  }
  container.appendChild(svg);
}

/**
 * Single-row divider lattice between page sections.
 * Renders into an SVG inside container.
 *
 * @param {HTMLElement} container
 * @param {number} signalIndex - which figure in the row is red
 */
function dividerRow(container, signalIndex = 5) {
  if (!container) return;
  container.innerHTML = '';
  // Count of figures fills the available width on render
  const total = 24;
  for (let i = 0; i < total; i++) {
    const f = figure({ signal: i === signalIndex });
    f.classList.add('div-fig');
    if (i === signalIndex) f.classList.add('is-signal');
    container.appendChild(f);
  }
}

/**
 * Pedagogical 10-row figure grid (e.g. "100 people, N exposed, M with outcome").
 *
 * @param {HTMLElement} container
 * @param {number} totalPeople - typically 100
 * @param {number[]} signalIndices - 0-indexed positions to highlight as signal red
 */
function pedaGrid(container, totalPeople = 100, signalIndices = []) {
  if (!container) return;
  container.innerHTML = '';
  const sigSet = new Set(signalIndices);
  for (let i = 0; i < totalPeople; i++) {
    const f = figure({ signal: sigSet.has(i) });
    f.classList.add('peda-fig');
    if (sigSet.has(i)) f.classList.add('is-signal');
    container.appendChild(f);
  }
}

// Expose globally for non-module pages
if (typeof window !== 'undefined') {
  window.EpiFigure = { figure, lattice, miniLattice, dividerRow, pedaGrid };
}
