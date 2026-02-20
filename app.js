/* ════════════════════════════════════════
   WEB STUDIO — COTIZADOR
   app.js
════════════════════════════════════════ */

// ─── CONSTANTS ───────────────────────────
const TOTAL_STEPS = 9;

const FEATURE_LABELS = {
  blog_integrado:    'Blog integrado',
  multilenguaje:     'Multilenguaje',
  buscador:          'Buscador interno',
  formulario_contacto: 'Formulario de contacto',
  chat_whatsapp:     'Botón WhatsApp flotante',
  reservas:          'Sistema de turnos/reservas',
  login_usuarios:    'Login de usuarios',
  pagos:             'Pagos online (MercadoPago/Stripe)',
  galeria:           'Galería / Portfolio',
  newsletter:        'Newsletter',
  seo_basico:        'SEO básico',
  seo_avanzado:      'SEO avanzado',
  analytics:         'Analytics & Métricas',
  redes_sociales:    'Integración redes sociales',
  google_ads_pixel:  'Pixel FB + Google Ads',
  dominio_hosting:   'Dominio + Hosting (1 año)',
  mantenimiento:     'Mantenimiento 6 meses',
  capacitacion:      'Capacitación gestión',
  logo:              'Diseño de logotipo',
};

const STEP_LABELS = [
  'Tipo', 'Páginas', 'Funciones', 'App', 'Estilo', 'SEO', 'Extras', 'Datos', 'Resumen'
];

// ─── STATE ───────────────────────────────
let currentStep = 1;

const state = {
  type:      null,
  typeLabel: '',
  baseMin:   0,
  baseMax:   0,
  pages:     3,
  features:  {},
  app:       null,
  appLabel:  '',
  appCost:   0,
  palette:   '',
};

// ─── UTILS ───────────────────────────────
function formatPesos(n) {
  return '$' + Math.round(n).toLocaleString('es-AR');
}

function calcTotal() {
  const base    = (state.baseMin + state.baseMax) / 2 || 0;
  const extras  = Object.values(state.features).reduce((a, b) => a + b, 0);
  const pages   = state.pages > 3 ? (state.pages - 3) * 15000 : 0;
  return base + extras + state.appCost + pages;
}

// ─── PORTFOLIO CAROUSEL ──────────────────
(function initCarousel() {
  const grid   = document.getElementById('portfolioGrid');
  const dotsEl = document.getElementById('carouselDots');
  const btnPrev = document.getElementById('carouselPrev');
  const btnNext = document.getElementById('carouselNext');
  if (!grid) return;

  let currentIndex = 0;
  let isDragging   = false;
  let startX       = 0;
  let scrollStart  = 0;

  // ── Build dots based on visible cards ──
  function buildDots() {
    const cards = [...grid.querySelectorAll('.portfolio-card:not(.hidden)')];
    dotsEl.innerHTML = '';
    cards.forEach((_, i) => {
      const dot = document.createElement('div');
      dot.className = 'dot' + (i === 0 ? ' active' : '');
      dot.addEventListener('click', () => scrollToIndex(i));
      dotsEl.appendChild(dot);
    });
    currentIndex = 0;
  }

  function getVisibleCards() {
    return [...grid.querySelectorAll('.portfolio-card:not(.hidden)')];
  }

  function updateDots() {
    dotsEl.querySelectorAll('.dot').forEach((d, i) => {
      d.classList.toggle('active', i === currentIndex);
    });
  }

  function scrollToIndex(idx) {
    const cards = getVisibleCards();
    if (!cards[idx]) return;
    currentIndex = idx;
    grid.scrollTo({ left: cards[idx].offsetLeft - 16, behavior: 'smooth' });
    updateDots();
  }

  // Update active dot on scroll
  grid.addEventListener('scroll', () => {
    const cards = getVisibleCards();
    let closest = 0;
    let minDist = Infinity;
    cards.forEach((c, i) => {
      const dist = Math.abs(c.offsetLeft - grid.scrollLeft - 16);
      if (dist < minDist) { minDist = dist; closest = i; }
    });
    if (closest !== currentIndex) {
      currentIndex = closest;
      updateDots();
    }
  });

  // Arrow buttons
  btnPrev && btnPrev.addEventListener('click', () => {
    const cards = getVisibleCards();
    scrollToIndex(Math.max(0, currentIndex - 1));
  });

  btnNext && btnNext.addEventListener('click', () => {
    const cards = getVisibleCards();
    scrollToIndex(Math.min(cards.length - 1, currentIndex + 1));
  });

  // ── Drag to scroll ──
  grid.addEventListener('mousedown', e => {
    isDragging  = true;
    startX      = e.pageX;
    scrollStart = grid.scrollLeft;
    grid.classList.add('grabbing');
  });

  window.addEventListener('mousemove', e => {
    if (!isDragging) return;
    e.preventDefault();
    grid.scrollLeft = scrollStart - (e.pageX - startX);
  });

  window.addEventListener('mouseup', () => {
    isDragging = false;
    grid.classList.remove('grabbing');
  });

  // ── Filter tabs ──
  document.querySelectorAll('.tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const filter = tab.dataset.filter;
      document.querySelectorAll('.portfolio-card').forEach(card => {
        if (filter === 'all' || card.dataset.category === filter) {
          card.classList.remove('hidden');
        } else {
          card.classList.add('hidden');
        }
      });

      grid.scrollLeft = 0;
      buildDots();
    });
  });

  // Init dots
  buildDots();
})();

// ─── PRICE BAR ───────────────────────────
function updatePriceBar() {
  const total = calcTotal();
  document.getElementById('priceAmount').textContent = formatPesos(total);

  if (state.baseMin && state.baseMax) {
    if (state.baseMin === state.baseMax) {
      document.getElementById('priceRange').textContent = 'Base: ' + formatPesos(state.baseMin);
    } else {
      document.getElementById('priceRange').textContent =
        'Rango base: ' + formatPesos(state.baseMin) + ' – ' + formatPesos(state.baseMax);
    }
  }
}

function showPriceBar() {
  document.getElementById('priceBar').classList.add('visible');
}

// ─── STEP NAVIGATION ─────────────────────
function showStep(n) {
  // Hide all steps
  document.querySelectorAll('.step').forEach(s => s.classList.remove('active'));
  document.getElementById('step-' + n).classList.add('active');

  // Back button
  const btnBack = document.getElementById('btnBack');
  if (n === 1) {
    btnBack.classList.remove('visible');
  } else {
    btnBack.classList.add('visible');
  }

  // Next button label
  const btnNext = document.getElementById('btnNext');
  if (n === TOTAL_STEPS) {
    btnNext.textContent = '← Volver al inicio';
  } else if (n === TOTAL_STEPS - 1) {
    btnNext.textContent = 'Ver cotización →';
  } else {
    btnNext.textContent = 'Siguiente →';
  }

  // Disable next when selection is required
  if (n === 1) btnNext.disabled = !state.type;
  else if (n === 4) btnNext.disabled = !state.app;
  else if (n === 5) btnNext.disabled = !state.palette;
  else btnNext.disabled = false;

  // Progress bar
  const pct = ((n - 1) / (TOTAL_STEPS - 1)) * 100;
  document.getElementById('progressBar').style.width = pct + '%';

  // Step labels
  const wrap = document.getElementById('stepsLabel');
  wrap.innerHTML = STEP_LABELS.map((label, i) =>
    `<span class="${n === i + 1 ? 'active' : ''}">${label}</span>`
  ).join('');

  // Scroll to cotizador section
  if (n > 1) {
    document.getElementById('cotizador').scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

function nextStep() {
  if (currentStep === TOTAL_STEPS) {
    // Reset to top
    currentStep = 1;
    resetState();
    showStep(1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    return;
  }
  if (currentStep === TOTAL_STEPS - 1) {
    buildSummary();
  }
  currentStep++;
  showStep(currentStep);
}

function prevStep() {
  if (currentStep === 1) return;
  currentStep--;
  showStep(currentStep);
}

// ─── RESET ───────────────────────────────
function resetState() {
  Object.assign(state, {
    type: null, typeLabel: '', baseMin: 0, baseMax: 0,
    pages: 3, features: {}, app: null, appLabel: '', appCost: 0, palette: '',
  });

  // Clear UI selections
  document.querySelectorAll('.option-card.selected').forEach(c => c.classList.remove('selected'));
  document.querySelectorAll('.toggle-item.selected').forEach(t => t.classList.remove('selected'));
  document.querySelectorAll('.palette-card.selected').forEach(p => p.classList.remove('selected'));

  const slider = document.getElementById('pagesSlider');
  if (slider) { slider.value = 3; updatePages(3); }

  ['clientName','clientBusiness','clientPhone','clientNote'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.value = '';
  });

  document.getElementById('priceAmount').textContent = '$0';
  document.getElementById('priceRange').textContent = 'Seleccioná el tipo de sitio para comenzar';
}

// ─── SELECTIONS ──────────────────────────
function selectCard(el, group, value, min, max) {
  // Deselect siblings in same step
  const stepEl = el.closest('.step');
  stepEl.querySelectorAll('.option-card').forEach(c => c.classList.remove('selected'));
  el.classList.add('selected');

  if (group === 'type') {
    state.type      = value;
    state.typeLabel = el.querySelector('.card-title').textContent;
    state.baseMin   = min;
    state.baseMax   = max;
    showPriceBar();
  } else if (group === 'app') {
    state.app      = value;
    state.appLabel = el.querySelector('.card-title').textContent;
    state.appCost  = (min + max) / 2;
  }

  updatePriceBar();
  document.getElementById('btnNext').disabled = false;
}

function selectPalette(el, name) {
  document.querySelectorAll('.palette-card').forEach(c => c.classList.remove('selected'));
  el.classList.add('selected');
  state.palette = name;
  updatePriceBar();
  document.getElementById('btnNext').disabled = false;
}

function toggleFeature(el, key, cost) {
  el.classList.toggle('selected');
  if (el.classList.contains('selected')) {
    state.features[key] = cost;
  } else {
    delete state.features[key];
  }
  updatePriceBar();
}

function updatePages(v) {
  state.pages = parseInt(v);
  document.getElementById('pagesVal').textContent =
    v + (parseInt(v) === 1 ? ' página' : ' páginas');
  updatePriceBar();
}

// ─── BUILD SUMMARY ───────────────────────
function buildSummary() {
  const total   = calcTotal();
  const deposit = total * 0.3;

  document.getElementById('summaryAmount').textContent = formatPesos(total);
  document.getElementById('depositAmount').textContent = formatPesos(deposit);

  if (state.baseMin !== state.baseMax) {
    const extrasTotal = Object.values(state.features).reduce((a, b) => a + b, 0);
    document.getElementById('summaryRange').textContent =
      'Rango estimado: ' + formatPesos(state.baseMin) + ' – ' +
      formatPesos(state.baseMax + extrasTotal + state.appCost);
  } else {
    document.getElementById('summaryRange').textContent = '';
  }

  // Build rows
  const selectedFeats = Object.keys(state.features)
    .map(k => FEATURE_LABELS[k] || k)
    .join(', ');

  let html = `<div class="summary-header">Detalle del proyecto</div>`;
  html += summaryRow('Tipo de sitio', state.typeLabel || '—');
  html += summaryRow('Páginas / secciones', state.pages);
  html += summaryRow('Estilo visual', state.palette || '—');
  html += summaryRow('App móvil', state.appLabel || '—');
  if (selectedFeats) html += summaryRow('Funcionalidades', selectedFeats);
  html += summaryRow('Total estimado', formatPesos(total));
  html += summaryRow('Anticipo 30%', formatPesos(deposit));

  document.getElementById('summarySection').innerHTML = html;
}

function summaryRow(key, val) {
  return `<div class="summary-row">
    <span class="key">${key}</span>
    <span class="val">${val}</span>
  </div>`;
}

// ─── WHATSAPP ────────────────────────────
function sendWhatsApp() {
  const name  = document.getElementById('clientName').value.trim();
  const biz   = document.getElementById('clientBusiness').value.trim();
  const phone = document.getElementById('clientPhone').value.trim();
  const note  = document.getElementById('clientNote').value.trim();

  if (!name || !phone) {
    alert('Por favor completá tu nombre y número de WhatsApp para continuar.');
    currentStep = 8;
    showStep(8);
    return;
  }

  buildSummary(); // recalculate fresh
  const total   = calcTotal();
  const deposit = total * 0.3;

  const selectedFeats = Object.keys(state.features)
    .map(k => FEATURE_LABELS[k] || k);

  let msg = `🌐 *COTIZACIÓN — WEB STUDIO*\n`;
  msg += `─────────────────────────\n`;
  msg += `👤 *Nombre:* ${name}\n`;
  if (biz) msg += `🏢 *Empresa/Proyecto:* ${biz}\n`;
  msg += `📞 *WhatsApp:* ${phone}\n\n`;
  msg += `📋 *DETALLE DEL PROYECTO*\n`;
  msg += `• Tipo: ${state.typeLabel}\n`;
  msg += `• Páginas/secciones: ${state.pages}\n`;
  msg += `• Estilo visual: ${state.palette}\n`;
  if (state.appLabel && state.app !== 'no_app') msg += `• App móvil: ${state.appLabel}\n`;
  if (selectedFeats.length) msg += `• Extras incluidos:\n  – ${selectedFeats.join('\n  – ')}\n`;
  msg += `\n💰 *INVERSIÓN*\n`;
  msg += `Total estimado: *${formatPesos(total)}*\n`;
  msg += `Anticipo requerido (30%): *${formatPesos(deposit)}*\n\n`;
  msg += `📅 *PRÓXIMOS PASOS*\n`;
  msg += `• Dentro de los primeros *15 días hábiles* recibirás el boceto inicial del diseño para tu aprobación.\n`;
  msg += `• Para iniciar el proyecto se requiere un anticipo del *30%* (${formatPesos(deposit)}).\n`;
  msg += `• El saldo restante (${formatPesos(total - deposit)}) se abona a contra entrega del proyecto terminado.\n`;
  if (note) msg += `\n📝 *Aclaración:* ${note}\n`;
  msg += `─────────────────────────\n`;
  msg += `_Cotización generada en Web Studio_`;

  // 👇 REEMPLAZÁ con tu número de WhatsApp (código de país sin el +)
  const WA_NUMBER = '5491125925851';
  const url = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(msg)}`;
  window.open(url, '_blank');
}

// ─── SCROLL: show price bar when cotizador is in view ─
(function initScrollObserver() {
  const target = document.getElementById('cotizador');
  if (!target) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        showPriceBar();
      }
    });
  }, { threshold: 0.1 });

  observer.observe(target);
})();

// ─── INIT ────────────────────────────────
(function init() {
  document.getElementById('btnNext').disabled = true;
  document.getElementById('btnBack').classList.remove('visible');
  showStep(1);
  updatePriceBar();
})();