/* ════════════════════════════════════════
   WEB STUDIO — app.js
════════════════════════════════════════ */

// ── CONFIG ────────────────────────────────────────
const WA_NUMBER = '5491100000000';       // 👈 Reemplazá con tu número
const EMAIL_TO  = 'hola@webstudio.com'; // 👈 Reemplazá con tu email

// ══════════════════════════════════════════════════
//  PROYECTOS — solo desde projects.json
//  Editá ese archivo para agregar los tuyos
// ══════════════════════════════════════════════════

let ALL_PROJECTS = [];
let visibleProjects = [];
let currentFilter   = 'all';
let searchQuery     = '';
let visibleCount    = 24;
const PAGE_SIZE     = 12;

async function loadProjects() {
  try {
    const res = await fetch('projects.json');
    ALL_PROJECTS = await res.json();
  } catch(e) {
    ALL_PROJECTS = [];
  }
  updateDynamicStats();
  renderMasonry();
  updateTabCounts();
}

// ── MASONRY RENDER ────────────────────────────────
function getFilteredProjects() {
  return ALL_PROJECTS.filter(p => {
    const matchCat    = currentFilter === 'all' || p.cat === currentFilter;
    const matchSearch = !searchQuery || p.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchSearch;
  });
}

function renderMasonry() {
  const grid     = document.getElementById('masonryGrid');
  const filtered = getFilteredProjects();
  visibleProjects = filtered.slice(0, visibleCount);

  grid.innerHTML = '';

  if (visibleProjects.length === 0) {
    grid.innerHTML = `<div style="text-align:center;padding:60px 24px;color:var(--muted);width:100%">
      <div style="font-size:48px;margin-bottom:16px">📂</div>
      <div style="font-size:16px;margin-bottom:8px;color:var(--text)">Todavía no hay proyectos cargados</div>
      <div style="font-size:13px">Agregá tus proyectos en <code style="background:var(--card);padding:2px 8px;border-radius:4px">projects.json</code> siguiendo el README</div>
    </div>`;
  }

  visibleProjects.forEach(p => {
    const item = document.createElement('div');
    item.className = 'masonry-item';
    item.innerHTML = `
      <div class="masonry-img-wrap" style="height:${p.height}px">
        <img src="${p.img}" alt="${p.name}" loading="lazy">
        <div class="masonry-overlay">
          <div class="masonry-overlay-title">${p.name}</div>
          <div class="masonry-overlay-cat">${catLabel(p.cat)}</div>
          <div class="masonry-overlay-cta">Ver proyecto →</div>
        </div>
      </div>
      <div class="masonry-info">
        <span class="masonry-badge ${p.cat}">${catLabel(p.cat)}</span>
        <div class="masonry-title">${p.name}</div>
        <div class="masonry-desc">${p.desc.substring(0,70)}…</div>
      </div>`;
    item.addEventListener('click', () => openPopup(p));
    grid.appendChild(item);
  });

  const wrap    = document.getElementById('loadMoreWrap');
  const info    = document.getElementById('loadMoreInfo');
  const btn     = document.getElementById('btnLoadMore');
  const total   = filtered.length;
  const showing = Math.min(visibleCount, total);
  info.textContent = `Mostrando ${showing} de ${total} proyectos`;
  wrap.style.display = total === 0 ? 'none' : 'block';
  btn.style.display  = showing >= total ? 'none' : 'block';

  updateTabCounts();
}

function updateTabCounts() {
  const CATS = ['landing','corporativo','ecommerce','blog','app'];
  CATS.forEach(cat => {
    const el = document.getElementById('count-' + cat);
    if (el) el.textContent = ALL_PROJECTS.filter(p => p.cat === cat).length;
  });
  const countAll = document.getElementById('count-all');
  if (countAll) countAll.textContent = ALL_PROJECTS.length;
}

function catLabel(cat) {
  return { landing:'Landing', corporativo:'Corporativo', ecommerce:'E-commerce', blog:'Blog / Portal', app:'App / PWA' }[cat] || cat;
}

function loadMore() {
  visibleCount += PAGE_SIZE;
  renderMasonry();
  document.getElementById('masonryGrid').lastElementChild?.scrollIntoView({ behavior:'smooth', block:'nearest' });
}

function filterPortfolio() {
  searchQuery  = document.getElementById('portfolioSearch').value;
  visibleCount = 24;
  renderMasonry();
}

// ── INIT ──────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      currentFilter = tab.dataset.filter;
      visibleCount  = 24;
      renderMasonry();
    });
  });
  loadProjects();
  initCounters();
  initTimer();
  initQuoterNav();
  initReviews();
  showStep(1);
});

// ── POPUP ─────────────────────────────────────────
let popupSlideIndex = 0;
let currentProject  = null;

function openPopup(project) {
  currentProject  = project;
  popupSlideIndex = 0;
  document.body.style.overflow = 'hidden';

  const slides = document.getElementById('popupSlides');
  const dots   = document.getElementById('popupDots');
  slides.innerHTML = '';
  dots.innerHTML   = '';
  project.images.forEach((img, i) => {
    slides.innerHTML += `<div class="popup-slide"><img src="${img}" alt="${project.name} — vista ${i+1}" loading="lazy"></div>`;
    const dot = document.createElement('div');
    dot.className = 'popup-dot' + (i === 0 ? ' active' : '');
    dot.onclick = () => goToSlide(i);
    dots.appendChild(dot);
  });
  slides.style.transform = 'translateX(0)';

  document.getElementById('popupMeta').innerHTML = `
    <span class="popup-meta-tag masonry-badge ${project.cat}">${catLabel(project.cat)}</span>
    <span class="popup-meta-year">· ${project.year}</span>
    <span class="popup-meta-client">· ${project.client}</span>`;
  document.getElementById('popupTitle').textContent = project.name;
  document.getElementById('popupDesc').textContent  = project.desc;
  document.getElementById('popupTech').innerHTML    = project.tech.map(t => `<span class="tech-tag">${t}</span>`).join('');

  const cs = project.challenge;
  document.getElementById('popupCase').innerHTML = `
    <div class="cs-block"><div class="cs-label">🎯 Desafío</div><div class="cs-text">${cs.challenge}</div></div>
    <div class="cs-block"><div class="cs-label">💡 Solución</div><div class="cs-text">${cs.solution}</div></div>
    <div class="cs-block"><div class="cs-label">📈 Resultado</div><div class="cs-text">${cs.result}</div></div>
    <div class="cs-block"><div class="cs-label">🛠 Tecnologías</div><div class="cs-text">${project.tech.join(' · ')}</div></div>`;

  const t = project.testi;
  document.getElementById('popupTesti').innerHTML = `
    <div class="pt-stars">★★★★★</div>
    <div class="pt-text">"${t.text}"</div>
    <div class="pt-author">
      <div class="pt-avatar">${t.initials}</div>
      <div><div class="pt-name">${t.name}</div><div class="pt-role">${t.role}</div></div>
    </div>`;

  document.getElementById('popupVisitBtn').href = project.url;
  document.querySelectorAll('.ptab').forEach((t,i) => t.classList.toggle('active', i===0));
  document.querySelectorAll('.ptab-content').forEach((c,i) => c.classList.toggle('active', i===0));
  document.getElementById('popupOverlay').classList.add('open');
  document.getElementById('popupBox').scrollTop = 0;
}

function closePopup(e) {
  if (e.target === document.getElementById('popupOverlay')) closePopupBtn();
}
function closePopupBtn() {
  document.getElementById('popupOverlay').classList.remove('open');
  document.body.style.overflow = '';
}
function slidePopup(dir) {
  if (!currentProject) return;
  const total = currentProject.images.length;
  popupSlideIndex = (popupSlideIndex + dir + total) % total;
  goToSlide(popupSlideIndex);
}
function goToSlide(idx) {
  popupSlideIndex = idx;
  document.getElementById('popupSlides').style.transform = `translateX(-${idx * 100}%)`;
  document.querySelectorAll('.popup-dot').forEach((d,i) => d.classList.toggle('active', i===idx));
}
function switchTab(btn, tabId) {
  document.querySelectorAll('.ptab').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.ptab-content').forEach(c => c.classList.remove('active'));
  btn.classList.add('active');
  document.getElementById('tab-' + tabId).classList.add('active');
}
document.addEventListener('keydown', e => { if (e.key === 'Escape') closePopupBtn(); });

// ── QUIZ ──────────────────────────────────────────
const quizAnswers = {};
let quizStep = 1;

function quizAnswer(el) {
  const q = parseInt(el.dataset.q);
  el.closest('.quiz-opts').querySelectorAll('.quiz-opt').forEach(o => o.classList.remove('selected'));
  el.classList.add('selected');
  quizAnswers[q] = el.dataset.v;
  setTimeout(() => {
    if (q < 3) {
      document.getElementById(`q${q}`).classList.remove('active');
      document.getElementById(`q${q+1}`).classList.add('active');
      quizStep = q + 1;
      updateQuizDots();
    } else {
      showQuizResult();
    }
  }, 350);
}
function updateQuizDots() {
  document.querySelectorAll('.qp-dot').forEach((d,i) => d.classList.toggle('active', i < quizStep));
}
function showQuizResult() {
  const a1 = quizAnswers[1], a3 = quizAnswers[3];
  let icon, title, desc;
  if (a1 === 'vender')                         { icon='🛒'; title='E-commerce';        desc='Una tienda online completa con catálogo, carrito y medios de pago.'; }
  else if (a1 === 'informar')                   { icon='✍️'; title='Blog / Portal';     desc='Una plataforma editorial con buscador, categorías y panel de administración.'; }
  else if (a1 === 'empresa' && a3 !== 'bajo')  { icon='🏢'; title='Sitio Corporativo'; desc='Presencia profesional completa con múltiples secciones y panel de gestión.'; }
  else                                          { icon='🚀'; title='Landing Page';      desc='Una página clara y efectiva para captar clientes y presentar tu propuesta.'; }
  document.getElementById('qrIcon').textContent  = icon;
  document.getElementById('qrTitle').textContent = title;
  document.getElementById('qrDesc').textContent  = desc;
  document.getElementById('qrTag').textContent   = 'El presupuesto final depende de la complejidad — consultanos sin compromiso';
  ['q1','q2','q3'].forEach(id => document.getElementById(id).classList.remove('active'));
  document.getElementById('qresult').classList.add('active');
  document.getElementById('quizProgress').style.display = 'none';
}
function resetQuiz() {
  Object.keys(quizAnswers).forEach(k => delete quizAnswers[k]);
  quizStep = 1;
  ['q1','q2','q3','qresult'].forEach(id => document.getElementById(id).classList.remove('active'));
  document.getElementById('q1').classList.add('active');
  document.getElementById('quizProgress').style.display = 'flex';
  updateQuizDots();
  document.querySelectorAll('.quiz-opt').forEach(o => o.classList.remove('selected'));
}

// ── COUNTERS ──────────────────────────────────────
function initCounters() {
  const obs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = parseInt(el.dataset.target);
      let start = null;
      const step = ts => {
        if (!start) start = ts;
        const p = Math.min((ts - start) / 1800, 1);
        el.textContent = Math.floor(p * target);
        if (p < 1) requestAnimationFrame(step);
        else el.textContent = target;
      };
      requestAnimationFrame(step);
      obs.unobserve(el);
    });
  }, { threshold: 0.3 });
  document.querySelectorAll('.stat-num[data-target]').forEach(n => obs.observe(n));
}

// ══════════════════════════════════════════════════
//  TIMER — 3 FASES
//
//  FASE 1 (antes 2/3):  "🎉 Próximas promociones · Arrancan el 2 de marzo en  [reloj]"
//  FASE 2 (2/3→15/3):  "🔥 Oferta 50% · Termina el 15 de marzo en  [reloj]"
//  FASE 3 (post 15/3): banner oculto
// ══════════════════════════════════════════════════
function initTimer() {
  const banner = document.getElementById('timerBanner');
  const textEl = document.getElementById('timerText');
  const clock  = document.getElementById('timerClock');
  if (!banner || !clock) return;

  const START = new Date('2026-03-02T00:00:00-03:00').getTime();
  const END   = new Date('2026-03-15T23:59:59-03:00').getTime();

  function fmt(ms) {
    const d = Math.floor(ms / 86400000);
    const h = Math.floor((ms % 86400000) / 3600000).toString().padStart(2,'0');
    const m = Math.floor((ms % 3600000)  / 60000).toString().padStart(2,'0');
    const s = Math.floor((ms % 60000)    / 1000).toString().padStart(2,'0');
    return d > 0 ? `${d}d ${h}:${m}:${s}` : `${h}:${m}:${s}`;
  }

  let iv = null;

  function tick() {
    const now = Date.now();
    if (now > END) {
      banner.style.display = 'none';
      if (iv) clearInterval(iv);
      return;
    }
    if (now < START) {
      if (textEl) textEl.innerHTML = '🎉 <strong>Próximas promociones</strong> · Arrancan el 2 de marzo en';
      clock.textContent = fmt(START - now);
      return;
    }
    if (textEl) textEl.innerHTML = '🔥 Oferta especial: <strong>50% de descuento</strong> · Termina el 15 de marzo en';
    clock.textContent = fmt(END - now);
  }

  tick();
  iv = setInterval(tick, 1000);
}

// ── QUOTER ────────────────────────────────────────
const TOTAL_STEPS = 7;
let currentStep   = 1;
const quoterState = { type: '', pages: '', features: [], palette: '', extras: [] };
const STEP_LABELS = ['Tipo','Páginas','Funciones','Estilo','Extras','Contacto','✓'];

function initQuoterNav() {
  document.querySelectorAll('.step').forEach((stepEl, idx) => {
    const n = idx + 1;
    if (n === TOTAL_STEPS) return;
    const nav = document.createElement('div');
    nav.className = 'quoter-nav';
    const backBtn = n > 1 ? `<button class="btn-q-back" onclick="prevStep()">← Atrás</button>` : `<div></div>`;
    const nextLabel = n === TOTAL_STEPS - 1 ? 'Enviar consulta →' : 'Siguiente →';
    nav.innerHTML = `${backBtn}<button class="btn-q-next" id="qnext-${n}" onclick="nextStep()">${nextLabel}</button>`;
    stepEl.appendChild(nav);
  });
  updateProgressBar();
}
function showStep(n) {
  document.querySelectorAll('.step').forEach(s => s.classList.remove('active'));
  document.getElementById('step-' + n).classList.add('active');
  updateProgressBar();
  if (n > 1) document.getElementById('cotizador').scrollIntoView({ behavior:'smooth', block:'start' });
}
function updateProgressBar() {
  const pct = ((currentStep - 1) / (TOTAL_STEPS - 1)) * 100;
  document.getElementById('progressBar').style.width = pct + '%';
  document.getElementById('stepsLabel').innerHTML = STEP_LABELS.map((l,i) =>
    `<span class="${currentStep === i+1 ? 'active' : ''}">${l}</span>`).join('');
}
function nextStep() { if (currentStep < TOTAL_STEPS) { currentStep++; showStep(currentStep); } }
function prevStep() { if (currentStep > 1) { currentStep--; showStep(currentStep); } }
function restartQuoter() {
  currentStep = 1;
  quoterState.type = ''; quoterState.pages = ''; quoterState.features = []; quoterState.palette = ''; quoterState.extras = [];
  document.querySelectorAll('.option-card.selected,.toggle-item.selected,.palette-card.selected').forEach(el => el.classList.remove('selected'));
  ['clientName','clientBusiness','clientEmail','clientPhone','clientNote'].forEach(id => {
    const el = document.getElementById(id); if (el) el.value = '';
  });
  showStep(1);
}
function selectCard(el, group, value) {
  el.closest('.step').querySelectorAll('.option-card').forEach(c => c.classList.remove('selected'));
  el.classList.add('selected');
  if (group === 'type')  quoterState.type  = value;
  if (group === 'pages') quoterState.pages = value;
}
function selectPalette(el, name) {
  document.querySelectorAll('.palette-card').forEach(c => c.classList.remove('selected'));
  el.classList.add('selected');
  quoterState.palette = name;
}
function toggleFeature(el, label) {
  el.classList.toggle('selected');
  if (el.classList.contains('selected')) {
    if (!quoterState.features.includes(label)) quoterState.features.push(label);
    if (!quoterState.extras.includes(label))   quoterState.extras.push(label);
  } else {
    quoterState.features = quoterState.features.filter(f => f !== label);
    quoterState.extras   = quoterState.extras.filter(f => f !== label);
  }
}
function sendWhatsApp() {
  const name  = document.getElementById('clientName').value.trim();
  const biz   = document.getElementById('clientBusiness').value.trim();
  const email = document.getElementById('clientEmail').value.trim();
  const phone = document.getElementById('clientPhone').value.trim();
  const note  = document.getElementById('clientNote').value.trim();
  if (!name || !phone) { alert('Por favor completá tu nombre y WhatsApp para continuar.'); return; }
  const allFeatures = [...new Set([...quoterState.features, ...quoterState.extras])];
  let msg = `🌐 *CONSULTA DE PROYECTO — WEB STUDIO*\n─────────────────────────\n`;
  msg += `👤 *Nombre:* ${name}\n`;
  if (biz)   msg += `🏢 *Empresa/Proyecto:* ${biz}\n`;
  if (email) msg += `📧 *Email:* ${email}\n`;
  msg += `📞 *WhatsApp:* ${phone}\n\n📋 *DETALLE DEL PROYECTO*\n`;
  if (quoterState.type)    msg += `• Tipo: ${quoterState.type}\n`;
  if (quoterState.pages)   msg += `• Páginas/secciones: ${quoterState.pages}\n`;
  if (quoterState.palette) msg += `• Estilo visual: ${quoterState.palette}\n`;
  if (allFeatures.length)  msg += `• Funcionalidades:\n  – ${allFeatures.join('\n  – ')}\n`;
  if (note)                msg += `\n📝 *Notas:* ${note}\n`;
  msg += `─────────────────────────\n_Enviado desde el cotizador de Web Studio_`;
  window.open(`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(msg)}`, '_blank');
  goToConfirmation();
}
function sendEmail() {
  const name  = document.getElementById('clientName').value.trim();
  const biz   = document.getElementById('clientBusiness').value.trim();
  const email = document.getElementById('clientEmail').value.trim();
  const phone = document.getElementById('clientPhone').value.trim();
  const note  = document.getElementById('clientNote').value.trim();
  if (!name || !email) { alert('Por favor completá tu nombre y email para continuar.'); return; }
  const allFeatures = [...new Set([...quoterState.features, ...quoterState.extras])];
  const subject = encodeURIComponent(`Consulta de proyecto web — ${name}${biz ? ' / ' + biz : ''}`);
  let body = `Hola Web Studio,\n\nQuería consultar por un proyecto web:\n\nDATOS DE CONTACTO\nNombre: ${name}\n`;
  if (biz)   body += `Empresa: ${biz}\n`;
  body += `Email: ${email}\n`;
  if (phone) body += `WhatsApp: ${phone}\n`;
  body += `\nDETALLE DEL PROYECTO\n`;
  if (quoterState.type)    body += `Tipo: ${quoterState.type}\n`;
  if (quoterState.pages)   body += `Páginas/secciones: ${quoterState.pages}\n`;
  if (quoterState.palette) body += `Estilo visual: ${quoterState.palette}\n`;
  if (allFeatures.length)  body += `Funcionalidades: ${allFeatures.join(', ')}\n`;
  if (note)                body += `\nNotas: ${note}\n`;
  body += `\nQuedo a la espera de su presupuesto.\n\nSaludos,\n${name}`;
  window.location.href = `mailto:${EMAIL_TO}?subject=${subject}&body=${encodeURIComponent(body)}`;
  goToConfirmation();
}
function goToConfirmation() { currentStep = TOTAL_STEPS; showStep(TOTAL_STEPS); }

// ── FAQ ───────────────────────────────────────────
function toggleFaq(el) {
  const item   = el.closest('.faq-item');
  const isOpen = item.classList.contains('open');
  document.querySelectorAll('.faq-item.open').forEach(i => i.classList.remove('open'));
  if (!isOpen) item.classList.add('open');
}

// ── WA BUBBLE ─────────────────────────────────────
function openWaBubble() {
  const msg = encodeURIComponent('¡Hola! Vi su página y me gustaría consultar por un proyecto web.');
  window.open(`https://wa.me/${WA_NUMBER}?text=${msg}`, '_blank');
}

// ── NAV MOBILE ────────────────────────────────────
function toggleMenu() {
  document.getElementById('navMobile').classList.toggle('open');
}

// ══════════════════════════════════════════════════
//  RESEÑAS — JSONbin.io (compartidas entre usuarios)
//
//  👇 Pegá tus datos de jsonbin.io en las 2 líneas de abajo
// ══════════════════════════════════════════════════
const JSONBIN_ID  = '69a2e9a9ae596e708f5240fd';
const JSONBIN_KEY = '$2a$10$lk4TqI/SJOVg8299EQHmPOXBguKnDOQWwSjUt8yp5/nEQwO9Byanq';
const JSONBIN_URL = `https://api.jsonbin.io/v3/b/${JSONBIN_ID}`;

const BASE_REVIEW_STARS = [5, 5, 5, 5, 5, 5];
const AVATAR_COLORS = [
  'linear-gradient(135deg,#c9a84c,#e8c97a)',
  'linear-gradient(135deg,#4caf7d,#2d8a5e)',
  'linear-gradient(135deg,#4d79ff,#00e5ff)',
  'linear-gradient(135deg,#9b59b6,#6c3483)',
  'linear-gradient(135deg,#e74c3c,#c0392b)',
  'linear-gradient(135deg,#c0622f,#8a3a1a)',
  'linear-gradient(135deg,#1abc9c,#16a085)',
  'linear-gradient(135deg,#f39c12,#e67e22)',
];
let selectedStars = 0;

// ── Lee reseñas desde JSONbin ─────────────────────
async function getStoredReviews() {
  try {
    const res = await fetch(JSONBIN_URL + '/latest', {
      headers: { 'X-Master-Key': JSONBIN_KEY }
    });
    const data = await res.json();
    const r = data.record; return Array.isArray(r) ? r : (r && Array.isArray(r.reviews) ? r.reviews : []);
  } catch {
    return [];
  }
}

// ── Guarda el array completo en JSONbin ──────────
async function saveReviews(arr) {
  try {
    await fetch(JSONBIN_URL, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'X-Master-Key': JSONBIN_KEY
      },
      body: JSON.stringify({ reviews: arr })
    });
  } catch(e) {
    console.error('Error guardando reseña:', e);
  }
}

// ── Init ─────────────────────────────────────────
async function initReviews() {
  await renderUserReviews();
  const reviews = await getStoredReviews();
  updateDynamicStats(reviews);
}

// ── Estadísticas ─────────────────────────────────
function calcStats(userReviews) {
  const allStars = [...BASE_REVIEW_STARS, ...userReviews.map(r => r.stars)];
  const total    = allStars.length;
  const sum      = allStars.reduce((a, b) => a + b, 0);
  const avg      = sum / total;
  const pct      = Math.round((avg / 5) * 100);
  return { avg: Math.round(avg * 10) / 10, pct, total };
}

function updateDynamicStats(userReviews = []) {
  const { avg, pct, total } = calcStats(userReviews);
  const projCount = ALL_PROJECTS.length || 0;

  const sp = document.getElementById('statProjects');
  const sr = document.getElementById('statRating');
  const ss = document.getElementById('statSatisfaction');
  if (sp) sp.textContent = projCount > 0 ? '+' + projCount : '—';
  if (sr) sr.textContent = avg.toFixed(1) + '★';
  if (ss) ss.textContent = pct + '%';

  const heroBtn = document.getElementById('heroPortfolioBtn');
  if (heroBtn) heroBtn.textContent = projCount > 0 ? `Ver +${projCount} proyectos` : 'Ver proyectos';
  const portTitle = document.getElementById('portfolioTitle');
  if (portTitle) portTitle.innerHTML = projCount > 0
    ? `+${projCount} proyectos<br><em>realizados</em>`
    : `Nuestros proyectos<br><em>realizados</em>`;

  const rsScore = document.getElementById('rsScore');
  const rsStars = document.getElementById('rsStars');
  const rsTotal = document.getElementById('rsTotalCount');
  const rsSat   = document.getElementById('rsSatisfaction');
  const starsHtml = '★'.repeat(Math.round(avg)) + '☆'.repeat(5 - Math.round(avg));
  if (rsScore) rsScore.textContent = avg.toFixed(1);
  if (rsStars) rsStars.textContent = starsHtml;
  if (rsTotal) rsTotal.textContent = total;
  if (rsSat)   rsSat.textContent   = pct + '%';
}

// ── Renderiza reseñas en el grid ─────────────────
async function renderUserReviews() {
  const wrap = document.getElementById('userReviewsWrap');
  const grid = document.getElementById('userReviewsGrid');
  if (!grid) return;

  // Mostrar spinner mientras carga
  if (wrap) wrap.style.display = 'block';
  grid.innerHTML = `<div style="text-align:center;padding:32px;color:var(--muted);width:100%;grid-column:1/-1">
    <div style="font-size:22px;margin-bottom:8px">⏳</div>
    <div style="font-size:13px">Cargando reseñas...</div>
  </div>`;

  const reviews = await getStoredReviews();

  if (reviews.length === 0) {
    if (wrap) wrap.style.display = 'none';
    return;
  }

  if (wrap) wrap.style.display = 'block';
  grid.innerHTML = '';

  [...reviews].reverse().forEach(r => {
    const initials = r.name.trim().split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
    const color    = AVATAR_COLORS[Math.abs(hashStr(r.name)) % AVATAR_COLORS.length];
    const stars    = '★'.repeat(r.stars) + '☆'.repeat(5 - r.stars);
    const card     = document.createElement('div');
    card.className = 'testi-card';
    card.innerHTML = `
      <div class="testi-stars" style="color:#e8c97a">${stars}</div>
      <p class="testi-text">"${escapeHtml(r.text)}"</p>
      <div class="testi-author">
        <div class="testi-avatar" style="background:${color}">${initials}</div>
        <div>
          <div class="testi-name">${escapeHtml(r.name)}</div>
          ${r.role ? `<div class="testi-role">${escapeHtml(r.role)}</div>` : ''}
        </div>
      </div>
      <div style="font-size:11px;color:var(--muted);margin-top:10px">${formatDate(r.date)}</div>`;
    grid.appendChild(card);
  });
}

// ── Star picker ───────────────────────────────────
function pickStar(n) {
  selectedStars = n;
  const labels = ['Muy malo 😕','Malo 😐','Regular 🙂','Bueno 😊','Excelente 🤩'];
  const labelEl = document.getElementById('starLabel');
  if (labelEl) labelEl.textContent = labels[n - 1];
  document.querySelectorAll('.star-pick').forEach((s, i) => s.classList.toggle('active', i < n));
}

// ── Submit reseña (async) ─────────────────────────
async function submitReview() {
  const name = document.getElementById('reviewName').value.trim();
  const role = document.getElementById('reviewRole').value.trim();
  const text = document.getElementById('reviewText').value.trim();

  if (!name)            { alert('Por favor ingresá tu nombre.'); return; }
  if (!selectedStars)   { alert('Por favor seleccioná una calificación.'); return; }
  if (text.length < 10) { alert('Por favor escribí un comentario de al menos 10 caracteres.'); return; }

  // Deshabilitar botón mientras guarda
  const btn = document.querySelector('.btn-review-submit');
  if (btn) { btn.disabled = true; btn.textContent = 'Publicando...'; }

  const reviews = await getStoredReviews();
  reviews.push({ name, role, text, stars: selectedStars, date: new Date().toISOString() });
  await saveReviews(reviews);

  // Reset form
  document.getElementById('reviewName').value = '';
  document.getElementById('reviewRole').value = '';
  document.getElementById('reviewText').value = '';
  selectedStars = 0;
  document.querySelectorAll('.star-pick').forEach(s => s.classList.remove('active'));
  const labelEl = document.getElementById('starLabel');
  if (labelEl) labelEl.textContent = 'Seleccioná una calificación';
  if (btn) { btn.disabled = false; btn.textContent = 'Publicar reseña →'; }

  const successEl = document.getElementById('reviewSuccess');
  if (successEl) {
    successEl.style.display = 'block';
    setTimeout(() => { successEl.style.display = 'none'; }, 4000);
  }

  await renderUserReviews();
  updateDynamicStats(reviews);
}


// ── Helpers ───────────────────────────────────────
function escapeHtml(str) {
  return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}
function hashStr(str) {
  let h = 0;
  for (let i = 0; i < str.length; i++) { h = (h << 5) - h + str.charCodeAt(i); h |= 0; }
  return h;
}
function formatDate(iso) {
  try { return new Date(iso).toLocaleDateString('es-AR', { day:'numeric', month:'long', year:'numeric' }); }
  catch { return ''; }
}