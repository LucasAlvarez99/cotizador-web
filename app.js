/* ════════════════════════════════════════
   WEB STUDIO — app.js
════════════════════════════════════════ */

// ── CONFIG ────────────────────────────────────────
const WA_NUMBER = '5491125925851';
const EMAIL_TO  = 'lucas.alvarez.bernardez.99@gmail.com';
const IG_URL    = 'https://www.instagram.com/el_mago_lucas/';

// Cupos del mes (opcional). null = no muestra número.
// ⚠️ Poné un número SOLO si es real (ej: 3). Con 0 la barra avisa que la agenda del mes está completa.
const CUPOS_DISPONIBLES = null;

const VIDEO_SLOTS = 6;

// ══════════════════════════════════════════════════
//  PROYECTOS — desde projects.json
// ══════════════════════════════════════════════════
let ALL_PROJECTS = [];
let visibleProjects = [];
let currentFilter   = 'all';
let searchQuery     = '';
let visibleCount    = 24;
const PAGE_SIZE     = 12;
let currentReviews  = [];

const isPersonalProject = p => /personal|developer|pr[aá]ctica/i.test(p.client || '');
const isPlaceholderText = t => !t || /va ac[aá]\.?$/i.test(t.trim());

async function loadProjects() {
  try {
    const res = await fetch('projects.json');
    ALL_PROJECTS = await res.json();
  } catch (e) {
    ALL_PROJECTS = [];
  }
  updateDynamicStats();
  renderMasonry();
  renderTrust();
  renderTestimonials();
}

// ── MASONRY ───────────────────────────────────────
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
    grid.style.columns = '1';
    grid.innerHTML = `<div style="text-align:center;padding:60px 24px;color:var(--muted);width:100%">
      <div style="font-size:16px;margin-bottom:8px;color:var(--text)">No hay proyectos para mostrar</div>
      <div style="font-size:13px">Agregalos en <code>projects.json</code> siguiendo el README.</div>
    </div>`;
  } else {
    grid.style.columns = '';
  }

  visibleProjects.forEach(p => {
    const item = document.createElement('div');
    item.className = 'masonry-item';
    item.innerHTML = `
      <div class="masonry-img-wrap" style="height:${Number(p.height) || 260}px">
        <img src="${p.img}" alt="${escapeHtml(p.name)}" loading="lazy">
        <div class="masonry-overlay">
          <div class="masonry-overlay-title">${escapeHtml(p.name)}</div>
          <div class="masonry-overlay-cat">${catLabel(p.cat)}</div>
          <div class="masonry-overlay-cta">Ver proyecto →</div>
        </div>
      </div>
      <div class="masonry-info">
        <span class="masonry-badge ${p.cat}">${catLabel(p.cat)}</span>
        <div class="masonry-title">${escapeHtml(p.name)}</div>
        <div class="masonry-desc">${escapeHtml(p.desc.substring(0, 70))}…</div>
      </div>`;
    item.addEventListener('click', () => openPopup(p));
    grid.appendChild(item);
  });

  const wrap    = document.getElementById('loadMoreWrap');
  const info    = document.getElementById('loadMoreInfo');
  const btn     = document.getElementById('btnLoadMore');
  const total   = filtered.length;
  const showing = Math.min(visibleCount, total);
  info.textContent   = `Mostrando ${showing} de ${total} proyectos`;
  wrap.style.display = total === 0 ? 'none' : 'block';
  btn.style.display  = showing >= total ? 'none' : 'inline-flex';

  updateTabCounts();
}

function updateTabCounts() {
  ['landing', 'corporativo', 'ecommerce', 'blog', 'app'].forEach(cat => {
    const el = document.getElementById('count-' + cat);
    if (el) el.textContent = ALL_PROJECTS.filter(p => p.cat === cat).length;
  });
  const countAll = document.getElementById('count-all');
  if (countAll) countAll.textContent = ALL_PROJECTS.length;
}

function catLabel(cat) {
  return { landing: 'Landing', corporativo: 'Corporativo', ecommerce: 'E-commerce', blog: 'Blog / Portal', app: 'App / PWA' }[cat] || cat;
}
function loadMore() {
  visibleCount += PAGE_SIZE;
  renderMasonry();
}
function filterPortfolio() {
  searchQuery  = document.getElementById('portfolioSearch').value;
  visibleCount = 24;
  renderMasonry();
}

// ── CREDIBILIDAD (clientes + tecnologías) ─────────
function renderTrust() {
  const section = document.getElementById('trust');
  const clientsEl = document.getElementById('trustClients');
  const techEl = document.getElementById('trustTech');
  if (!section) return;

  const clients = ALL_PROJECTS.filter(p => p.real && !isPersonalProject(p)).map(p => p.name);
  const tech = [...new Set(ALL_PROJECTS.flatMap(p => p.tech || []))];

  clientsEl.innerHTML = clients.map(n => `<span class="trust-pill">${escapeHtml(n)}</span>`).join('');
  techEl.innerHTML    = tech.map(t => `<span class="trust-pill tech">${escapeHtml(t)}</span>`).join('');
  clientsEl.parentElement.style.display = clients.length ? '' : 'none';
  techEl.parentElement.style.display    = tech.length ? '' : 'none';
  section.style.display = (clients.length || tech.length) ? '' : 'none';
}

// ── TESTIMONIOS (reales, desde projects.json) ─────
function renderTestimonials() {
  const grid = document.getElementById('testiGrid');
  if (!grid) return;
  const items = ALL_PROJECTS
    .filter(p => p.real && !isPersonalProject(p) && p.testi && !isPlaceholderText(p.testi.text))
    .map(p => p.testi);

  if (!items.length) {
    grid.innerHTML = '<div class="testi-empty">Pronto vas a ver acá las opiniones de nuestros clientes.</div>';
    return;
  }
  grid.innerHTML = items.map(t => {
    const color = AVATAR_COLORS[Math.abs(hashStr(t.name)) % AVATAR_COLORS.length];
    return `<div class="testi-card">
      <div class="testi-stars">★★★★★</div>
      <p class="testi-text">“${escapeHtml(t.text)}”</p>
      <div class="testi-author">
        <div class="testi-avatar" style="background:${color}">${escapeHtml(t.initials || '')}</div>
        <div><div class="testi-name">${escapeHtml(t.name)}</div><div class="testi-role">${escapeHtml(t.role || '')}</div></div>
      </div>
    </div>`;
  }).join('');
}

// ══════════════════════════════════════════════════
//  VIDEOS — 6 slots, se cargan desde videos.json
//  (ver Readmevideos.md)
// ══════════════════════════════════════════════════
const IS_EDIT_MODE = ['localhost', '127.0.0.1', ''].includes(location.hostname) || /[?&]edit\b/.test(location.search);

function parseVideo(src) {
  if (!src) return null;
  const yt = src.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|shorts\/|embed\/))([\w-]{11})/);
  if (yt) return { kind: 'youtube', id: yt[1] };
  const vm = src.match(/vimeo\.com\/(?:video\/)?(\d+)/);
  if (vm) return { kind: 'vimeo', id: vm[1] };
  return { kind: 'file', src };
}

function pauseOtherVideos(except) {
  document.querySelectorAll('#videoGrid video').forEach(v => { if (v !== except) v.pause(); });
}

function buildVideoCard(v, i) {
  const card = document.createElement('article');
  card.className = 'video-card';
  const media = document.createElement('div');
  media.className = 'video-media';
  const info = parseVideo(v && v.src);

  if (!info) {
    const empty = document.createElement('div');
    empty.className = 'video-empty';
    empty.innerHTML = `<div class="video-empty-n">${String(i + 1).padStart(2, '0')}</div>
      <div class="video-empty-icon">▶</div>
      <div class="video-empty-t">${IS_EDIT_MODE ? 'Slot libre — pegá el link en <code>videos.json</code>' : 'Próximamente'}</div>`;
    media.appendChild(empty);
    card.appendChild(media);
    return card;
  }

  if (info.kind === 'file') {
    const video = document.createElement('video');
    video.controls = true;
    video.playsInline = true;
    video.preload = 'metadata';
    if (v.poster) video.poster = v.poster;
    video.src = info.src;
    video.addEventListener('play', () => pauseOtherVideos(video));
    media.appendChild(video);
  } else {
    const thumb = document.createElement('img');
    thumb.alt = v.title || `Video ${i + 1}`;
    thumb.loading = 'lazy';
    thumb.src = v.poster || (info.kind === 'youtube' ? `https://i.ytimg.com/vi/${info.id}/hqdefault.jpg` : '');
    if (!thumb.src) thumb.remove(); else media.appendChild(thumb);

    const play = document.createElement('button');
    play.className = 'video-play';
    play.setAttribute('aria-label', 'Reproducir video');
    play.innerHTML = '<span>▶</span>';
    play.addEventListener('click', () => {
      pauseOtherVideos(null);
      const iframe = document.createElement('iframe');
      iframe.allow = 'autoplay; encrypted-media; picture-in-picture; fullscreen';
      iframe.allowFullscreen = true;
      iframe.title = v.title || `Video ${i + 1}`;
      iframe.src = info.kind === 'youtube'
        ? `https://www.youtube-nocookie.com/embed/${info.id}?autoplay=1&rel=0&playsinline=1`
        : `https://player.vimeo.com/video/${info.id}?autoplay=1`;
      media.innerHTML = '';
      media.appendChild(iframe);
    });
    media.appendChild(play);
  }
  card.appendChild(media);

  if (v.title || v.who) {
    const cap = document.createElement('div');
    cap.className = 'video-cap';
    if (v.title) { const t = document.createElement('div'); t.className = 'video-title'; t.textContent = v.title; cap.appendChild(t); }
    if (v.who)   { const w = document.createElement('div'); w.className = 'video-who';   w.textContent = v.who;   cap.appendChild(w); }
    card.appendChild(cap);
  }
  return card;
}

async function loadVideos() {
  let list = [];
  try {
    const res = await fetch('videos.json');
    const data = await res.json();
    if (Array.isArray(data)) list = data;
  } catch (e) { /* sin videos.json → slots vacíos */ }
  const grid = document.getElementById('videoGrid');
  if (!grid) return;
  grid.innerHTML = '';
  for (let i = 0; i < VIDEO_SLOTS; i++) grid.appendChild(buildVideoCard(list[i] || {}, i));
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
  document.querySelectorAll('input[name="urgency"], input[name="budget"], #qualCommit')
    .forEach(el => el.addEventListener('change', updateQualification));

  loadProjects();
  loadVideos();
  initTimer();
  initQuoterNav();
  initReviews();
  updateQualification();
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
    slides.innerHTML += `<div class="popup-slide"><img src="${img}" alt="${escapeHtml(project.name)} — vista ${i + 1}" loading="lazy"></div>`;
    const dot = document.createElement('div');
    dot.className = 'popup-dot' + (i === 0 ? ' active' : '');
    dot.onclick = () => goToSlide(i);
    dots.appendChild(dot);
  });
  slides.style.transform = 'translateX(0)';

  document.getElementById('popupMeta').innerHTML = `
    <span class="popup-meta-tag masonry-badge ${project.cat}">${catLabel(project.cat)}</span>
    <span class="popup-meta-year">· ${project.year}</span>
    <span class="popup-meta-client">· ${escapeHtml(project.client)}</span>`;
  document.getElementById('popupTitle').textContent = project.name;
  document.getElementById('popupDesc').textContent  = project.desc;
  document.getElementById('popupTech').innerHTML    = project.tech.map(t => `<span class="tech-tag">${escapeHtml(t)}</span>`).join('');

  const cs = project.challenge;
  document.getElementById('popupCase').innerHTML = `
    <div class="cs-block"><div class="cs-label">🎯 Desafío</div><div class="cs-text">${escapeHtml(cs.challenge)}</div></div>
    <div class="cs-block"><div class="cs-label">💡 Solución</div><div class="cs-text">${escapeHtml(cs.solution)}</div></div>
    <div class="cs-block"><div class="cs-label">📈 Resultado</div><div class="cs-text">${escapeHtml(cs.result)}</div></div>
    <div class="cs-block"><div class="cs-label">🛠 Tecnologías</div><div class="cs-text">${project.tech.map(escapeHtml).join(' · ')}</div></div>`;

  const t = project.testi;
  document.getElementById('popupTesti').innerHTML = isPlaceholderText(t.text)
    ? `<div class="pt-text">Testimonio del cliente próximamente.</div>`
    : `<div class="pt-stars">★★★★★</div>
       <div class="pt-text">“${escapeHtml(t.text)}”</div>
       <div class="pt-author">
         <div class="pt-avatar">${escapeHtml(t.initials)}</div>
         <div><div class="pt-name">${escapeHtml(t.name)}</div><div class="pt-role">${escapeHtml(t.role)}</div></div>
       </div>`;

  document.getElementById('popupVisitBtn').href = project.url;
  document.querySelectorAll('.ptab').forEach((tb, i) => tb.classList.toggle('active', i === 0));
  document.querySelectorAll('.ptab-content').forEach((c, i) => c.classList.toggle('active', i === 0));
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
  document.querySelectorAll('.popup-dot').forEach((d, i) => d.classList.toggle('active', i === idx));
}
function switchTab(btn, tabId) {
  document.querySelectorAll('.ptab').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.ptab-content').forEach(c => c.classList.remove('active'));
  btn.classList.add('active');
  document.getElementById('tab-' + tabId).classList.add('active');
}
document.addEventListener('keydown', e => { if (e.key === 'Escape') closePopupBtn(); });

// ══════════════════════════════════════════════════
//  TOP BAR — cuenta regresiva al cierre del mes
//  (hora de Argentina, UTC-3 sin horario de verano)
// ══════════════════════════════════════════════════
function initTimer() {
  const banner = document.getElementById('timerBanner');
  const textEl = document.getElementById('timerText');
  const clock  = document.getElementById('timerClock');
  if (!banner || !clock) return;

  const MESES = ['enero','febrero','marzo','abril','mayo','junio','julio','agosto','septiembre','octubre','noviembre','diciembre'];
  const OFFSET = 3 * 3600 * 1000;

  function fmt(ms) {
    const d = Math.floor(ms / 86400000);
    const h = Math.floor((ms % 86400000) / 3600000).toString().padStart(2, '0');
    const m = Math.floor((ms % 3600000) / 60000).toString().padStart(2, '0');
    const s = Math.floor((ms % 60000) / 1000).toString().padStart(2, '0');
    return d > 0 ? `${d}d ${h}:${m}:${s}` : `${h}:${m}:${s}`;
  }

  function tick() {
    const nowAR = new Date(Date.now() - OFFSET);
    const y = nowAR.getUTCFullYear(), mo = nowAR.getUTCMonth();
    const end = Date.UTC(y, mo + 1, 1, 3, 0, 0) - 1000;   // 23:59:59 AR del último día del mes
    const mes = MESES[mo], siguiente = MESES[(mo + 1) % 12];

    if (CUPOS_DISPONIBLES === 0) {
      textEl.textContent = `Agenda de ${mes} completa. Reservá tu lugar para ${siguiente}:`;
      clock.style.display = 'none';
      return;
    }
    clock.style.display = '';
    textEl.textContent = CUPOS_DISPONIBLES
      ? `Quedan ${CUPOS_DISPONIBLES} ${CUPOS_DISPONIBLES === 1 ? 'cupo' : 'cupos'} para ${mes} · Cierra en`
      : `Tomo pocos proyectos por mes · La agenda de ${mes} cierra en`;
    clock.textContent = fmt(end - Date.now());
  }
  tick();
  setInterval(tick, 1000);
}

// ══════════════════════════════════════════════════
//  COTIZADOR
// ══════════════════════════════════════════════════
const TOTAL_STEPS = 7;
const CONTACT_STEP = 6;
let currentStep   = 1;
const quoterState = { type: '', pages: '', features: [], palette: '', extras: [] };
const STEP_LABELS = ['Tipo', 'Páginas', 'Funciones', 'Estilo', 'Extras', 'Contacto', '✓'];

function initQuoterNav() {
  document.querySelectorAll('.step').forEach((stepEl, idx) => {
    const n = idx + 1;
    if (n === TOTAL_STEPS) return;
    const nav = document.createElement('div');
    nav.className = 'quoter-nav';
    const backBtn = n > 1 ? `<button class="btn-q-back" onclick="prevStep()">← Atrás</button>` : `<div></div>`;
    // En el paso de contacto no hay "Siguiente": solo se avanza enviando (WhatsApp / Email)
    const nextBtn = n === CONTACT_STEP ? '' : `<button class="btn-q-next" onclick="nextStep()">Siguiente →</button>`;
    nav.innerHTML = `${backBtn}${nextBtn}`;
    stepEl.appendChild(nav);
  });
  updateProgressBar();
}
function showStep(n) {
  document.querySelectorAll('.step').forEach(s => s.classList.remove('active'));
  document.getElementById('step-' + n).classList.add('active');
  updateProgressBar();
  if (n > 1) document.getElementById('cotizador').scrollIntoView({ behavior: 'smooth', block: 'start' });
}
function updateProgressBar() {
  const pct = ((currentStep - 1) / (TOTAL_STEPS - 1)) * 100;
  document.getElementById('progressBar').style.width = pct + '%';
  document.getElementById('stepsLabel').innerHTML = STEP_LABELS.map((l, i) =>
    `<span class="${currentStep === i + 1 ? 'active' : ''}">${l}</span>`).join('');
}
function nextStep() { if (currentStep < CONTACT_STEP) { currentStep++; showStep(currentStep); } }
function prevStep() { if (currentStep > 1) { currentStep--; showStep(currentStep); } }
function restartQuoter() {
  currentStep = 1;
  quoterState.type = ''; quoterState.pages = ''; quoterState.features = []; quoterState.palette = ''; quoterState.extras = [];
  document.querySelectorAll('.option-card.selected,.toggle-item.selected,.palette-card.selected').forEach(el => el.classList.remove('selected'));
  ['clientName', 'clientBusiness', 'clientEmail', 'clientPhone', 'clientNote'].forEach(id => {
    const el = document.getElementById(id); if (el) el.value = '';
  });
  document.querySelectorAll('input[name="urgency"], input[name="budget"]').forEach(r => { r.checked = false; });
  document.getElementById('qualCommit').checked = false;
  updateQualification();
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

// ── FILTRO DE CALIFICACIÓN ────────────────────────
// Si la persona "solo está mirando" o "no está segura", no se habilita el envío
// y se la deriva a Instagram para que vuelva cuando esté lista.
const URGENCY_LABEL = { ya: 'Lo antes posible', pronto: 'En 1 a 2 meses', mirando: 'Solo está mirando' };
const BUDGET_LABEL  = { si: 'Sí, presupuesto definido', ajustar: 'Lo tiene que organizar, pero está decidido/a', no: 'No está seguro/a todavía' };

function qualStatus() {
  const urgency = (document.querySelector('input[name="urgency"]:checked') || {}).value || '';
  const budget  = (document.querySelector('input[name="budget"]:checked')  || {}).value || '';
  const commit  = document.getElementById('qualCommit').checked;
  let state = 'ok';
  if (urgency === 'mirando' || budget === 'no') state = 'stop';
  else if (!urgency || !budget || !commit)      state = 'incomplete';
  return { state, urgency, budget, commit };
}

function updateQualification() {
  const s   = qualStatus();
  const msg = document.getElementById('qualMsg');
  const wa  = document.getElementById('btnWA');
  const em  = document.getElementById('btnEmail');
  if (!msg || !wa || !em) return;

  wa.disabled = em.disabled = s.state !== 'ok';
  msg.className = 'qual-msg show';

  if (s.state === 'stop') {
    msg.classList.add('stop');
    msg.innerHTML = `<strong>Gracias por la honestidad.</strong> Si todavía no estás seguro/a, es mejor que no agendes ahora: así no perdemos tiempo ninguno de los dos. <a href="${IG_URL}" target="_blank" rel="noopener">Seguinos en Instagram</a> y escribinos cuando estés listo/a.`;
  } else if (s.state === 'incomplete') {
    msg.classList.add('info');
    msg.textContent = 'Respondé las dos preguntas y confirmá el último punto para habilitar el envío.';
  } else {
    msg.classList.add('ok');
    msg.textContent = 'Perfecto, ya podés enviar tu consulta.';
  }
}

function sendWhatsApp() {
  const q = qualStatus();
  if (q.state !== 'ok') { updateQualification(); return; }
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
  msg += `\n🎯 *DIAGNÓSTICO*\n• Urgencia: ${URGENCY_LABEL[q.urgency]}\n• Presupuesto: ${BUDGET_LABEL[q.budget]}\n• Confirmó anticipo del 30% y aporte de información: sí\n`;
  if (note)                msg += `\n📝 *Notas:* ${note}\n`;
  msg += `─────────────────────────\n_Enviado desde el cotizador de Web Studio_`;
  window.open(`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(msg)}`, '_blank');
  goToConfirmation();
}
function sendEmail() {
  const q = qualStatus();
  if (q.state !== 'ok') { updateQualification(); return; }
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
  body += `\nDIAGNÓSTICO\nUrgencia: ${URGENCY_LABEL[q.urgency]}\nPresupuesto: ${BUDGET_LABEL[q.budget]}\nConfirmó anticipo del 30% y aporte de información: sí\n`;
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
// ══════════════════════════════════════════════════
const JSONBIN_ID  = '69a2e9a9ae596e708f5240fd';
const JSONBIN_KEY = '$2a$10$lk4TqI/SJOVg8299EQHmPOXBguKnDOQWwSjUt8yp5/nEQwO9Byanq';
const JSONBIN_URL = `https://api.jsonbin.io/v3/b/${JSONBIN_ID}`;

const AVATAR_COLORS = [
  'linear-gradient(135deg,#7e1ed2,#9b4dff)',
  'linear-gradient(135deg,#d20606,#ff5a5a)',
  'linear-gradient(135deg,#4b0f86,#7e1ed2)',
  'linear-gradient(135deg,#9b4dff,#c9a2ff)',
  'linear-gradient(135deg,#8a0404,#d20606)',
  'linear-gradient(135deg,#5b21b6,#a855f7)',
];
let selectedStars = 0;

async function getStoredReviews() {
  try {
    const res = await fetch(JSONBIN_URL + '/latest', { headers: { 'X-Master-Key': JSONBIN_KEY } });
    const data = await res.json();
    const r = data.record;
    return Array.isArray(r) ? r : (r && Array.isArray(r.reviews) ? r.reviews : []);
  } catch {
    return [];
  }
}

async function saveReviews(arr) {
  try {
    await fetch(JSONBIN_URL, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'X-Master-Key': JSONBIN_KEY },
      body: JSON.stringify({ reviews: arr })
    });
  } catch (e) {
    console.error('Error guardando reseña:', e);
  }
}

async function initReviews() {
  currentReviews = await getStoredReviews();
  renderUserReviews(currentReviews);
  updateDynamicStats(currentReviews);
}

// ── Estadísticas ─────────────────────────────────
function updateDynamicStats(userReviews = currentReviews) {
  const sp = document.getElementById('statProjects');
  if (sp) sp.textContent = ALL_PROJECTS.length > 0 ? '+' + ALL_PROJECTS.length : '—';

  const box = document.getElementById('reviewsSummary');
  if (!box) return;
  if (!userReviews.length) { box.style.display = 'none'; return; }

  const total = userReviews.length;
  const avg   = userReviews.reduce((a, r) => a + r.stars, 0) / total;
  const rounded = Math.round(avg);
  box.style.display = 'inline-flex';
  document.getElementById('rsScore').textContent = avg.toFixed(1);
  document.getElementById('rsStars').textContent = '★'.repeat(rounded) + '☆'.repeat(5 - rounded);
  document.getElementById('rsTotalCount').textContent = total;
}

function renderUserReviews(reviews) {
  const wrap = document.getElementById('userReviewsWrap');
  const grid = document.getElementById('userReviewsGrid');
  if (!grid) return;

  if (!reviews.length) { if (wrap) wrap.style.display = 'none'; return; }
  if (wrap) wrap.style.display = 'block';
  grid.innerHTML = '';

  [...reviews].reverse().forEach(r => {
    const initials = r.name.trim().split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
    const color    = AVATAR_COLORS[Math.abs(hashStr(r.name)) % AVATAR_COLORS.length];
    const stars    = '★'.repeat(r.stars) + '☆'.repeat(5 - r.stars);
    const card     = document.createElement('div');
    card.className = 'testi-card';
    card.innerHTML = `
      <div class="testi-stars">${stars}</div>
      <p class="testi-text">“${escapeHtml(r.text)}”</p>
      <div class="testi-author">
        <div class="testi-avatar" style="background:${color}">${escapeHtml(initials)}</div>
        <div>
          <div class="testi-name">${escapeHtml(r.name)}</div>
          ${r.role ? `<div class="testi-role">${escapeHtml(r.role)}</div>` : ''}
        </div>
      </div>
      <div class="testi-date">${formatDate(r.date)}</div>`;
    grid.appendChild(card);
  });
}

function pickStar(n) {
  selectedStars = n;
  const labels = ['Muy malo 😕', 'Malo 😐', 'Regular 🙂', 'Bueno 😊', 'Excelente 🤩'];
  const labelEl = document.getElementById('starLabel');
  if (labelEl) labelEl.textContent = labels[n - 1];
  document.querySelectorAll('.star-pick').forEach((s, i) => s.classList.toggle('active', i < n));
}

async function submitReview() {
  const name = document.getElementById('reviewName').value.trim();
  const role = document.getElementById('reviewRole').value.trim();
  const text = document.getElementById('reviewText').value.trim();

  if (!name)            { alert('Por favor ingresá tu nombre.'); return; }
  if (!selectedStars)   { alert('Por favor seleccioná una calificación.'); return; }
  if (text.length < 10) { alert('Por favor escribí un comentario de al menos 10 caracteres.'); return; }

  const btn = document.querySelector('.btn-review-submit');
  if (btn) { btn.disabled = true; btn.textContent = 'Publicando...'; }

  const reviews = await getStoredReviews();
  reviews.push({ name, role, text, stars: selectedStars, date: new Date().toISOString() });
  await saveReviews(reviews);
  currentReviews = reviews;

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

  renderUserReviews(reviews);
  updateDynamicStats(reviews);
}

// ── Helpers ───────────────────────────────────────
function escapeHtml(str) {
  return String(str == null ? '' : str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}
function hashStr(str) {
  let h = 0;
  for (let i = 0; i < str.length; i++) { h = (h << 5) - h + str.charCodeAt(i); h |= 0; }
  return h;
}
function formatDate(iso) {
  try { return new Date(iso).toLocaleDateString('es-AR', { day: 'numeric', month: 'long', year: 'numeric' }); }
  catch { return ''; }
}
