// Sorting algorithms
// Each algorithm is a generator that sorts a copy of the array and yields the
// actions needed to replay it: compare, swap, write (with value) and sorted.

function swap(arr, i, j) {
  const temp = arr[i];
  arr[i] = arr[j];
  arr[j] = temp;
}

function* bubbleSort(arr) {
  const n = arr.length;
  for (let i = 0; i < n - 1; i++) {
    let swapped = false;
    for (let j = 0; j < n - i - 1; j++) {
      yield { type: 'compare', indices: [j, j + 1] };
      if (arr[j] > arr[j + 1]) {
        swap(arr, j, j + 1);
        yield { type: 'swap', indices: [j, j + 1] };
        swapped = true;
      }
    }
    yield { type: 'sorted', indices: [n - i - 1] };
    if (!swapped) break;
  }
}

function* selectionSort(arr) {
  const n = arr.length;
  for (let i = 0; i < n - 1; i++) {
    let min = i;
    for (let j = i + 1; j < n; j++) {
      yield { type: 'compare', indices: [j], pivot: min };
      if (arr[j] < arr[min]) min = j;
    }
    if (min !== i) {
      swap(arr, i, min);
      yield { type: 'swap', indices: [i, min] };
    }
    yield { type: 'sorted', indices: [i] };
  }
}

function* insertionSort(arr) {
  for (let i = 1; i < arr.length; i++) {
    let j = i;
    while (j > 0) {
      yield { type: 'compare', indices: [j - 1, j] };
      if (arr[j - 1] <= arr[j]) break;
      swap(arr, j - 1, j);
      yield { type: 'swap', indices: [j - 1, j] };
      j--;
    }
  }
}

function* mergeSort(arr, lo = 0, hi = arr.length - 1) {
  if (lo >= hi) return;
  const mid = (lo + hi) >> 1;
  yield* mergeSort(arr, lo, mid);
  yield* mergeSort(arr, mid + 1, hi);

  const left = arr.slice(lo, mid + 1);
  const right = arr.slice(mid + 1, hi + 1);
  let i = 0;
  let j = 0;
  let k = lo;
  while (i < left.length && j < right.length) {
    yield { type: 'compare', indices: [k, mid + 1 + j] };
    arr[k] = left[i] <= right[j] ? left[i++] : right[j++];
    yield { type: 'write', indices: [k], value: arr[k] };
    k++;
  }
  while (i < left.length) {
    arr[k] = left[i++];
    yield { type: 'write', indices: [k], value: arr[k] };
    k++;
  }
  // Leftover right-half values are already in place.
}

function* quickSort(arr, lo = 0, hi = arr.length - 1) {
  if (lo > hi) return;
  if (lo === hi) {
    yield { type: 'sorted', indices: [lo] };
    return;
  }
  // Lomuto partition around the last element
  const pivot = arr[hi];
  let i = lo;
  for (let j = lo; j < hi; j++) {
    yield { type: 'compare', indices: [j], pivot: hi };
    if (arr[j] < pivot) {
      if (i !== j) {
        swap(arr, i, j);
        yield { type: 'swap', indices: [i, j], pivot: hi };
      }
      i++;
    }
  }
  if (i !== hi) {
    swap(arr, i, hi);
    yield { type: 'swap', indices: [i, hi] };
  }
  yield { type: 'sorted', indices: [i] };
  yield* quickSort(arr, lo, i - 1);
  yield* quickSort(arr, i + 1, hi);
}

function* siftDown(arr, i, n) {
  while (true) {
    let largest = i;
    const l = 2 * i + 1;
    const r = l + 1;
    if (l < n) {
      yield { type: 'compare', indices: [l, largest] };
      if (arr[l] > arr[largest]) largest = l;
    }
    if (r < n) {
      yield { type: 'compare', indices: [r, largest] };
      if (arr[r] > arr[largest]) largest = r;
    }
    if (largest === i) return;
    swap(arr, i, largest);
    yield { type: 'swap', indices: [i, largest] };
    i = largest;
  }
}

function* heapSort(arr) {
  const n = arr.length;
  for (let i = (n >> 1) - 1; i >= 0; i--) {
    yield* siftDown(arr, i, n);
  }
  for (let end = n - 1; end > 0; end--) {
    swap(arr, 0, end);
    yield { type: 'swap', indices: [0, end] };
    yield { type: 'sorted', indices: [end] };
    yield* siftDown(arr, 0, end);
  }
}

const ALGORITHMS = {
  bubble: {
    name: 'Bubble Sort',
    run: bubbleSort,
    description: 'Repeatedly steps through the list, swapping adjacent elements that are out of order. The largest values "bubble" to the end each pass.',
    best: 'O(n)', average: 'O(n²)', worst: 'O(n²)', space: 'O(1)', stable: true,
  },
  selection: {
    name: 'Selection Sort',
    run: selectionSort,
    description: 'Finds the minimum of the unsorted part and moves it to the front. Few swaps, but always scans the whole remainder.',
    best: 'O(n²)', average: 'O(n²)', worst: 'O(n²)', space: 'O(1)', stable: false,
  },
  insertion: {
    name: 'Insertion Sort',
    run: insertionSort,
    description: 'Builds the sorted list one item at a time, sliding each new element left into place. Very fast on nearly sorted input.',
    best: 'O(n)', average: 'O(n²)', worst: 'O(n²)', space: 'O(1)', stable: true,
  },
  merge: {
    name: 'Merge Sort',
    run: mergeSort,
    description: 'Divide and conquer: splits the array in half, sorts each half recursively, then merges the two sorted halves.',
    best: 'O(n log n)', average: 'O(n log n)', worst: 'O(n log n)', space: 'O(n)', stable: true,
  },
  quick: {
    name: 'Quick Sort',
    run: quickSort,
    description: 'Picks a pivot and partitions the array so smaller values go left and larger go right, then recurses on each side.',
    best: 'O(n log n)', average: 'O(n log n)', worst: 'O(n²)', space: 'O(log n)', stable: false,
  },
  heap: {
    name: 'Heap Sort',
    run: heapSort,
    description: 'Builds a max-heap, then repeatedly moves the largest element to the end and restores the heap on the rest.',
    best: 'O(n log n)', average: 'O(n log n)', worst: 'O(n log n)', space: 'O(1)', stable: false,
  },
};

// DOM

const $ = (selector) => document.querySelector(selector);
const visual = $('#visual');
const algoList = $('#algo-list');
const sizeInput = $('#size');
const speedInput = $('#speed');
const patternSelect = $('#pattern');
const generate = $('#generate');
const resetBtn = $('#reset');
const stepBtn = $('#step');
const playBtn = $('#play');

const state = {
  algorithm: 'bubble',
  original: [],
  values: [],
  bars: [],
  actions: [],
  pointer: 0,
  status: 'idle', // idle | running | paused | done
  stats: { comparisons: 0, swaps: 0, writes: 0 },
  highlighted: [],
  rafId: null,
  lastFrame: 0,
  acc: 0,
};

// Array generation

function randomValue() {
  return Math.floor(Math.random() * 96) + 5;
}

function randomIndex(n) {
  return Math.floor(Math.random() * n);
}

function createValues(size, pattern) {
  let arr = Array.from({ length: size }, randomValue);
  if (pattern === 'nearly') {
    arr.sort((a, b) => a - b);
    for (let k = 0; k < Math.max(1, Math.floor(size / 10)); k++) {
      swap(arr, randomIndex(size), randomIndex(size));
    }
  } else if (pattern === 'reversed') {
    arr.sort((a, b) => b - a);
  } else if (pattern === 'few') {
    const pool = Array.from({ length: 4 }, randomValue);
    arr = arr.map(() => pool[randomIndex(pool.length)]);
  }
  return arr;
}

// Rendering

function renderBars() {
  const n = state.values.length;
  visual.innerHTML = '';
  visual.classList.remove('done');
  visual.classList.toggle('show-labels', n <= 30);
  visual.style.setProperty('--gap', n > 100 ? '1px' : n > 50 ? '2px' : n > 25 ? '4px' : '6px');
  visual.style.setProperty('--bar-radius', n > 80 ? '1px' : n > 40 ? '3px' : '6px');
  visual.style.setProperty('--stagger', `${Math.min(14, 700 / n)}ms`);

  state.bars = state.values.map((value, i) => {
    const bar = document.createElement('div');
    bar.className = 'bar';
    bar.style.height = `${value}%`;
    bar.style.setProperty('--i', i);
    const label = document.createElement('span');
    label.textContent = value;
    bar.appendChild(label);
    visual.appendChild(bar);
    return bar;
  });
}

function setBar(i) {
  const bar = state.bars[i];
  bar.style.height = `${state.values[i]}%`;
  bar.firstChild.textContent = state.values[i];
}

function clearHighlights() {
  for (const [i, cls] of state.highlighted) {
    state.bars[i].classList.remove(cls);
  }
  state.highlighted = [];
}

function highlight(i, cls) {
  state.bars[i].classList.add(cls);
  state.highlighted.push([i, cls]);
}

const STATUS_TEXT = { idle: 'Ready', running: 'Sorting', paused: 'Paused', done: 'Sorted' };

function updateStats() {
  const { comparisons, swaps, writes } = state.stats;
  $('#stat-comparisons').textContent = comparisons.toLocaleString();
  $('#stat-swaps').textContent = swaps.toLocaleString();
  $('#stat-writes').textContent = writes.toLocaleString();

  const total = state.actions.length;
  $('#progress-bar').style.width = `${total ? (state.pointer / total) * 100 : 0}%`;
  $('#progress-label').textContent = `${state.pointer.toLocaleString()} / ${total.toLocaleString()} steps`;
}

function updateControls() {
  const status = $('#stat-status');
  status.dataset.state = state.status;
  status.lastElementChild.textContent = STATUS_TEXT[state.status];

  const running = state.status === 'running';
  playBtn.classList.toggle('playing', running);
  $('#play-label').textContent = {
    idle: 'Sort', running: 'Pause', paused: 'Resume', done: 'Replay',
  }[state.status];
  stepBtn.disabled = state.status === 'done';
  resetBtn.disabled = state.status === 'idle';
}

function renderInfo() {
  const algo = ALGORITHMS[state.algorithm];
  $('#info-name').textContent = algo.name;
  $('#info-desc').textContent = algo.description;
  $('#info-best').textContent = algo.best;
  $('#info-avg').textContent = algo.average;
  $('#info-worst').textContent = algo.worst;
  $('#info-space').textContent = algo.space;
  const stable = $('#info-stable');
  stable.textContent = algo.stable ? '✓ Stable' : 'Not stable';
  stable.classList.toggle('stable', algo.stable);

  for (const btn of algoList.children) {
    btn.setAttribute('aria-checked', btn.dataset.key === state.algorithm);
  }
}

// Playback

function getDelay() {
  // Exponential scale: speed 1 → 600ms per step, speed 100 → 0.5ms per step
  const t = (speedInput.value - 1) / 99;
  return 600 * Math.pow(0.5 / 600, t);
}

function updateSpeed() {
  const delay = getDelay();
  $('#speed-out').textContent = delay >= 10 ? `${Math.round(delay)} ms/step` : `${delay.toFixed(1)} ms/step`;
  visual.style.setProperty('--t', `${Math.min(delay * 0.8, 120)}ms`);
}

function applyAction(action) {
  clearHighlights();
  const { type, indices, pivot } = action;

  if (type === 'compare') {
    state.stats.comparisons++;
    indices.forEach((i) => highlight(i, 'compare'));
  } else if (type === 'swap') {
    const [i, j] = indices;
    swap(state.values, i, j);
    setBar(i);
    setBar(j);
    state.stats.swaps++;
    state.stats.writes += 2;
    highlight(i, 'swap');
    highlight(j, 'swap');
  } else if (type === 'write') {
    const [i] = indices;
    state.values[i] = action.value;
    setBar(i);
    state.stats.writes++;
    highlight(i, 'swap');
  } else if (type === 'sorted') {
    indices.forEach((i) => state.bars[i].classList.add('sorted'));
  }

  if (pivot !== undefined) highlight(pivot, 'pivot');
}

function stopLoop() {
  cancelAnimationFrame(state.rafId);
  state.rafId = null;
}

function finish() {
  stopLoop();
  clearHighlights();
  state.status = 'done';
  visual.classList.add('done');
  updateStats();
  updateControls();
}

function frame(now) {
  state.acc += now - state.lastFrame;
  state.lastFrame = now;
  const delay = getDelay();

  // Apply as many steps as the elapsed time allows, so tiny delays stay fast.
  let steps = 0;
  while (state.acc >= delay && steps < 500) {
    if (state.pointer >= state.actions.length) {
      finish();
      return;
    }
    applyAction(state.actions[state.pointer++]);
    state.acc -= delay;
    steps++;
  }
  if (steps === 500) state.acc = 0;

  updateStats();
  state.rafId = requestAnimationFrame(frame);
}

function play() {
  if (state.status === 'done') resetRun();
  state.status = 'running';
  state.lastFrame = performance.now();
  state.acc = getDelay();
  state.rafId = requestAnimationFrame(frame);
  updateControls();
}

function pause() {
  stopLoop();
  state.status = 'paused';
  updateControls();
}

function togglePlay() {
  if (state.status === 'running') pause();
  else play();
}

function step() {
  if (state.status === 'done') return;
  stopLoop();
  if (state.pointer < state.actions.length) {
    applyAction(state.actions[state.pointer++]);
    state.status = 'paused';
    updateStats();
    updateControls();
  }
  if (state.pointer >= state.actions.length) finish();
}

// Restores the original array and precomputes the actions for the current algorithm.
function resetRun() {
  stopLoop();
  state.values = [...state.original];
  state.actions = [...ALGORITHMS[state.algorithm].run([...state.original])];
  state.pointer = 0;
  state.stats = { comparisons: 0, swaps: 0, writes: 0 };
  state.highlighted = [];
  state.status = 'idle';
  renderBars();
  updateStats();
  updateControls();
}

function newArray() {
  state.original = createValues(Number(sizeInput.value), patternSelect.value);
  resetRun();
}

// Theme

const THEME_KEY = 'algorithm-animator-theme';
const darkQuery = window.matchMedia('(prefers-color-scheme: dark)');

function storedTheme() {
  try {
    return localStorage.getItem(THEME_KEY);
  } catch {
    return null;
  }
}

function applyTheme(theme) {
  const root = document.documentElement;
  if (theme) root.dataset.theme = theme;
  const dark = theme ? theme === 'dark' : darkQuery.matches;
  root.classList.toggle('is-dark', dark);
}

function toggleTheme() {
  const next = document.documentElement.classList.contains('is-dark') ? 'light' : 'dark';
  try {
    localStorage.setItem(THEME_KEY, next);
  } catch {
    // Storage unavailable; the choice just won't persist.
  }
  applyTheme(next);
}

// Events

for (const [key, algo] of Object.entries(ALGORITHMS)) {
  const btn = document.createElement('button');
  btn.className = 'algo-btn';
  btn.type = 'button';
  btn.setAttribute('role', 'radio');
  btn.dataset.key = key;
  btn.textContent = algo.name.replace(' Sort', '');
  btn.addEventListener('click', () => {
    state.algorithm = key;
    renderInfo();
    resetRun();
  });
  algoList.appendChild(btn);
}

sizeInput.addEventListener('input', () => {
  $('#size-out').textContent = sizeInput.value;
  newArray();
});
speedInput.addEventListener('input', updateSpeed);
patternSelect.addEventListener('change', newArray);
generate.addEventListener('click', newArray);
resetBtn.addEventListener('click', resetRun);
stepBtn.addEventListener('click', step);
playBtn.addEventListener('click', togglePlay);
$('#theme-toggle').addEventListener('click', toggleTheme);
darkQuery.addEventListener('change', () => applyTheme(storedTheme()));

document.addEventListener('keydown', (e) => {
  if (e.metaKey || e.ctrlKey || e.altKey) return;
  const tag = e.target.tagName;
  if (tag === 'SELECT' || (tag === 'INPUT' && e.key !== ' ')) return;

  if (e.key === ' ') {
    e.preventDefault();
    // Blur so a focused button doesn't also fire its own click on keyup.
    if (tag === 'BUTTON') e.target.blur();
    togglePlay();
  } else if (e.key === 'ArrowRight') {
    step();
  } else if (e.key === 'r' || e.key === 'R') {
    resetRun();
  } else if (e.key === 'n' || e.key === 'N') {
    newArray();
  }
});

// Init

applyTheme(storedTheme());
$('#size-out').textContent = sizeInput.value;
updateSpeed();
renderInfo();
newArray();
