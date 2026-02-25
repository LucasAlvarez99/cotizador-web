/* ════════════════════════════════════════
   WEB STUDIO — app.js
════════════════════════════════════════ */

// ── CONFIG ────────────────────────────────────────
const WA_NUMBER = '5491100000000';       // 👈 Reemplazá con tu número
const EMAIL_TO  = 'hola@webstudio.com'; // 👈 Reemplazá con tu email

// ══════════════════════════════════════════════════
//  CAMBIO 1 + 4 — PROYECTOS DINÁMICOS DESDE JSON
//  Los proyectos se cargan desde projects.json
//  Para agregar un proyecto: editá projects.json y recargá la página
// ══════════════════════════════════════════════════

let ALL_PROJECTS = [];
let visibleProjects = [];
let currentFilter   = 'all';
let searchQuery     = '';
let visibleCount    = 24;
const PAGE_SIZE     = 12;

// Carga projects.json y arranca todo
async function loadProjects() {
  try {
    const res = await fetch('projects.json');
    const customProjects = await res.json();
    // Mezcla proyectos reales (del JSON) + generados (para completar 90)
    // Si tenés proyectos reales, los del JSON van primero y se muestran con destaque
    const generated = generateProjects(customProjects.length);
    ALL_PROJECTS = [...customProjects, ...generated];
  } catch(e) {
    // Si no hay JSON disponible (ej: abrir directo desde file://) usa solo generados
    ALL_PROJECTS = generateProjects(0);
  }

  // Actualiza contadores y UI
  updateDynamicStats();
  renderMasonry();
  updateTabCounts();
}

// ── PROJECT DATA (generados automáticamente) ──────
const PALETTES = {
  landing:     ['1a0d2e/9b59b6','120a24/7d3c98','0d0a1e/8e44ad','1a0520/a569bd'],
  corporativo: ['0d1f0d/4caf7d','0a1a10/27ae60','0d1a0d/1e8449','061206/239b56'],
  ecommerce:   ['1a1a2e/c9a84c','12122a/b8860b','0d0d1f/d4ac0d','0a0a18/f0b429'],
  blog:        ['1a1000/e67e22','14100a/d35400','1a0c00/ca6f1e','100c08/ba4a00'],
  app:         ['200a0a/e74c3c','1a0808/c0392b','140606/a93226','0e0404/96281b'],
};
const CATEGORIES = ['landing','corporativo','ecommerce','blog','app'];
const PROJECT_NAMES = {
  landing:     ['Studio Pilates','Abogada Fernández','Consultora Zenith','Dr. Pérez Cardiólogo','Coach María Torres','Odontología Smile','Arquitecta Valentina','Estudio Sanz & Co','Psicologa Brennan','Fotógrafa Karina','Personal Trainer Max','Clases de Yoga Online','Nutricionista Vera','Tatuajes & Arte Ink','Diseñadora Gráfica Lu','Coaching Ejecutivo','Estudio de Danza','Centro Meditación'],
  corporativo: ['Constructora Nordik','Estudio Rodríguez','Clínica MedCentro','Ingeniería Vidal','Consultora BrightPath','Grupo Inmobiliario Sur','Fundación Futuro','Universidad Privada','Laboratorio Bernal','Manufactura Textil SA','Energía Renovable Arg','Aseguradora Confianza','Farmacéutica Salud+','Logística Express','Estudio Jurídico Pérez','Constructora Premium'],
  ecommerce:   ['Moda Urbana Shop','Ferretería El Martillo','Tienda de Electrónica','Natural Beauty Store','Librería del Pueblo','Deportes & Aventura','Mascotas Felices','Vinos & Bodegas Select','Casa & Deco Online','Tecno Hogar Store','Zapatería Moderna','Juguetería Mágica','Suplementos Sport Pro','Ropa Infantil Kids','Joyería Artesanal'],
  blog:        ['Sabores del Norte','Blog de Viajes AR','Portal de Finanzas','Revista Digital Tech','Noticias Rosario','Portal Universitario','Gastronomía BA','Salud & Bienestar','Mundo Fitness','Emprendedores AR'],
  app:         ['FitLife App','TurnoFácil','ComerciApp','PedidosYa Clone','Wallet Digital','MedRemind App','PropiedApp','EventosAR App'],
};
const DESCRIPTIONS = {
  landing:     'Landing page de alta conversión con secciones hero, testimonios, servicios y llamado a la acción optimizado. Diseño enfocado en captar leads y consultas desde el primer scroll.',
  corporativo: 'Sitio institucional completo con múltiples secciones, panel de administración de contenido, formularios avanzados y blog integrado. Diseño profesional alineado a la identidad de marca.',
  ecommerce:   'Tienda online completa con catálogo de productos, filtros avanzados, carrito de compras, integración con MercadoPago y panel de gestión de pedidos y stock en tiempo real.',
  blog:        'Portal de contenidos de alto tráfico con sistema de categorías, buscador avanzado, gestión multi-autor, newsletter integrado y diseño optimizado para lectura y engagement.',
  app:         'Aplicación móvil multiplataforma con interfaz nativa, sistema de autenticación, notificaciones push, panel de administración web y publicación en App Store y Google Play.',
};
const CHALLENGES = {
  landing:     { challenge:'El cliente necesitaba captar más consultas online pero su presencia digital era nula. No tenía sitio web y dependía 100% de referidos.', solution:'Diseñamos una landing page orientada a conversión con un formulario visible desde el primer scroll, testimonios reales y un llamado a la acción claro.', result:'En el primer mes recibió 18 consultas a través del sitio. Su tasa de conversión de visita a consulta llegó al 12%.' },
  corporativo: { challenge:'La empresa tenía un sitio desactualizado de 2015 que no reflejaba su crecimiento. Perdían oportunidades por no transmitir confianza online.', solution:'Rediseñamos completamente su presencia digital con un sitio moderno, panel de administración y sección de noticias.', result:'El tiempo de permanencia en el sitio aumentó un 140%. Comenzaron a recibir solicitudes de cotización directamente desde el formulario de contacto.' },
  ecommerce:   { challenge:'Tenían una tienda física con buen volumen de ventas pero ninguna presencia online.', solution:'Desarrollamos un e-commerce completo integrado con su sistema de stock existente, MercadoPago y un panel de gestión.', result:'En 6 meses las ventas online representaban el 40% del total. Alcanzaron clientes en todo el país.' },
  blog:        { challenge:'El cliente tenía mucho contenido de valor generado por especialistas pero disperso en redes sociales.', solution:'Creamos un portal editorial con categorías, buscador, sistema de autores y newsletter.', result:'En 4 meses el portal alcanzó 15.000 visitas mensuales orgánicas. El newsletter llegó a 2.800 suscriptores activos.' },
  app:         { challenge:'El negocio operaba con procesos manuales que no escalaban.', solution:'Desarrollamos una app híbrida para Android e iOS con sistema de autenticación, notificaciones push y panel web.', result:'La app tiene 1.200 usuarios activos en el primer trimestre con un rating de 4.8 en ambas tiendas.' },
};
const TESTIMONIALS = {
  landing:     [{ initials:'MR', name:'Martina R.', role:'Psicóloga', text:'El sitio superó todas mis expectativas. En los primeros 15 días ya tenía 3 consultas nuevas. El diseño es hermoso y el proceso fue muy profesional.' }],
  corporativo: [{ initials:'AG', name:'Alejandro G.', role:'Director Comercial', text:'La comunicación fue excelente en todo momento. Me mostraron el boceto a los 10 días y el resultado final fue aún mejor de lo esperado.' }],
  ecommerce:   [{ initials:'CL', name:'Carlos L.', role:'Dueño de Ferretería', text:'Las ventas online ya representan el 40% del negocio. No puedo creer el impacto que tuvo el e-commerce en tan poco tiempo.' }],
  blog:        [{ initials:'PV', name:'Pablo V.', role:'Editor de contenidos', text:'Google empezó a posicionarlo muy bien desde el primer mes. La estructura que armaron es sólida y el equipo de redacción puede publicar sin problema.' }],
  app:         [{ initials:'LM', name:'Laura M.', role:'Fundadora de startup', text:'El equipo entendió exactamente lo que necesitábamos. La app es rápida, bonita y los usuarios la adoptaron de inmediato.' }],
};
const TECH_TAGS = {
  landing:     ['HTML/CSS','JavaScript','Next.js','Vercel','Google Analytics','WhatsApp API'],
  corporativo: ['WordPress','PHP','MySQL','AWS','Elementor Pro','WooCommerce'],
  ecommerce:   ['React','Node.js','MongoDB','MercadoPago','Stripe','AWS S3'],
  blog:        ['Next.js','Sanity CMS','Tailwind CSS','Vercel','Mailchimp','GA4'],
  app:         ['React Native','Expo','Firebase','Node.js','Push Notifications','App Store'],
};

// Genera proyectos placeholder (startId para no chocar con los reales del JSON)
function generateProjects(startId = 0) {
  const projects = [];
  const counts = { landing:20, corporativo:20, ecommerce:18, blog:14, app:8 };
  let id = startId;

  CATEGORIES.forEach(cat => {
    const names    = [...PROJECT_NAMES[cat]];
    const palGroup = PALETTES[cat];
    for (let i = 0; i < counts[cat]; i++) {
      const name    = names[i % names.length] + (i >= names.length ? ` ${Math.floor(i/names.length)+1}` : '');
      const pal     = palGroup[i % palGroup.length];
      const [bg,fg] = pal.split('/');
      const year    = 2022 + Math.floor(Math.random() * 3);
      const heights = [220,280,240,300,260,320,250,290];
      const height  = heights[i % heights.length];
      const testi   = TESTIMONIALS[cat][0];
      projects.push({
        id: ++id, cat, name, year, height,
        img: `https://placehold.co/600x${height}/${bg}/${fg}?text=${encodeURIComponent(name.split(' ').slice(0,2).join('+')).replace(/%20/g,'+')}`,
        images: [
          `https://placehold.co/900x500/${bg}/${fg}?text=${encodeURIComponent(name+'+-+Vista+1')}`,
          `https://placehold.co/900x500/${bg.split('').reverse().join('')}/${fg}?text=${encodeURIComponent(name+'+-+Vista+2')}`,
          `https://placehold.co/900x500/${bg}/${fg}?text=${encodeURIComponent(name+'+-+Mobile')}`,
        ],
        desc:      DESCRIPTIONS[cat],
        challenge: CHALLENGES[cat],
        testi,
        tech:      TECH_TAGS[cat],
        url:       '#',
        client:    name,
      });
    }
  });

  // Shuffle
  for (let i = projects.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [projects[i], projects[j]] = [projects[j], projects[i]];
  }
  return projects;
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
  CATEGORIES.forEach(cat => {
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
  loadProjects();       // Carga JSON + genera el resto
  initCounters();
  initTimer();          // CAMBIO 2: timer del 2 al 9 de marzo
  initQuoterNav();
  initReviews();        // CAMBIO 3: sistema de reseñas reales
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

  const badgeClass = project.cat;
  document.getElementById('popupMeta').innerHTML = `
    <span class="popup-meta-tag masonry-badge ${badgeClass}">${catLabel(project.cat)}</span>
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
//  CAMBIO 2 — TIMER OFERTA 50% DEL 2 AL 9 DE MARZO
// ══════════════════════════════════════════════════
function initTimer() {
  const clock  = document.getElementById('timerClock');
  const banner = document.getElementById('timerBanner');
  if (!clock) return;

  // Inicio: 2 de marzo 2025 00:00:00 hora Argentina (UTC-3)
  // Fin:    9 de marzo 2025 23:59:59 hora Argentina
  const START = new Date('2025-03-02T00:00:00-03:00').getTime();
  const END   = new Date('2025-03-09T23:59:59-03:00').getTime();
  const now   = Date.now();

  // Si ya pasó la oferta, ocultar banner
  if (now > END) { banner.style.display = 'none'; return; }

  // Si todavía no llegó la fecha, mostrar cuenta regresiva hasta el inicio
  const countdownTarget = now < START ? START : END;

  function tick() {
    const diff = countdownTarget - Date.now();
    if (diff <= 0) {
      if (countdownTarget === START) {
        // Ya arrancó la oferta, ahora cuenta hasta el fin
        initTimer();
      } else {
        banner.style.display = 'none';
      }
      return;
    }
    const days = Math.floor(diff / 86400000);
    const h    = Math.floor((diff % 86400000) / 3600000).toString().padStart(2,'0');
    const m    = Math.floor((diff % 3600000)  / 60000).toString().padStart(2,'0');
    const s    = Math.floor((diff % 60000)    / 1000).toString().padStart(2,'0');
    clock.textContent = days > 0 ? `${days}d ${h}:${m}:${s}` : `${h}:${m}:${s}`;
  }
  tick();
  setInterval(tick, 1000);
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
//  CAMBIO 1 + 3 — RESEÑAS REALES + SATISFACCIÓN DINÁMICA
// ══════════════════════════════════════════════════

const STORAGE_REVIEWS = 'ws_reviews_v1';

// Reseñas base fijas (las 6 cards del HTML original, todas 5★)
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

function initReviews() {
  renderUserReviews();
  updateDynamicStats();
}

function getStoredReviews() {
  try { return JSON.parse(localStorage.getItem(STORAGE_REVIEWS) || '[]'); } catch { return []; }
}

function saveReviews(arr) {
  try { localStorage.setItem(STORAGE_REVIEWS, JSON.stringify(arr)); } catch {}
}

// CAMBIO 1: satisfacción real = suma de todas las estrellas / (total * 5) * 100
function calcStats(userReviews) {
  const allStars = [...BASE_REVIEW_STARS, ...userReviews.map(r => r.stars)];
  const total    = allStars.length;
  const sum      = allStars.reduce((a, b) => a + b, 0);
  const avg      = sum / total;
  const pct      = Math.round((avg / 5) * 100);
  return { avg: Math.round(avg * 10) / 10, pct, total };
}

// CAMBIO 1 + 4: actualiza header stats, hero button y portfolio title
function updateDynamicStats() {
  const userReviews = getStoredReviews();
  const { avg, pct, total } = calcStats(userReviews);
  const projCount = ALL_PROJECTS.length || 90;

  // Hero stats
  const sp = document.getElementById('statProjects');
  const sr = document.getElementById('statRating');
  const ss = document.getElementById('statSatisfaction');
  if (sp) sp.textContent = '+' + projCount;
  if (sr) sr.textContent = avg.toFixed(1) + '★';
  if (ss) ss.textContent = pct + '%';

  // CAMBIO 4: botón y título del portfolio con cantidad real
  const heroBtn = document.getElementById('heroPortfolioBtn');
  if (heroBtn) heroBtn.textContent = `Ver +${projCount} proyectos`;
  const portTitle = document.getElementById('portfolioTitle');
  if (portTitle) portTitle.innerHTML = `+${projCount} proyectos<br><em>realizados</em>`;

  // Reviews summary
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

function renderUserReviews() {
  const reviews = getStoredReviews();
  const wrap    = document.getElementById('userReviewsWrap');
  const grid    = document.getElementById('userReviewsGrid');
  if (!grid) return;

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
      <div style="font-size:11px;color:var(--border);margin-top:10px">${formatDate(r.date)}</div>`;
    grid.appendChild(card);
  });
}

// CAMBIO 3: star picker
function pickStar(n) {
  selectedStars = n;
  const labels = ['Muy malo 😕','Malo 😐','Regular 🙂','Bueno 😊','Excelente 🤩'];
  const labelEl = document.getElementById('starLabel');
  if (labelEl) labelEl.textContent = labels[n - 1];
  document.querySelectorAll('.star-pick').forEach((s, i) => s.classList.toggle('active', i < n));
}

// CAMBIO 3: submit reseña real
function submitReview() {
  const name = document.getElementById('reviewName').value.trim();
  const role = document.getElementById('reviewRole').value.trim();
  const text = document.getElementById('reviewText').value.trim();

  if (!name)         { alert('Por favor ingresá tu nombre.'); return; }
  if (!selectedStars){ alert('Por favor seleccioná una calificación.'); return; }
  if (text.length < 10) { alert('Por favor escribí un comentario de al menos 10 caracteres.'); return; }

  const reviews = getStoredReviews();
  reviews.push({ name, role, text, stars: selectedStars, date: new Date().toISOString() });
  saveReviews(reviews);

  // Reset form
  document.getElementById('reviewName').value = '';
  document.getElementById('reviewRole').value = '';
  document.getElementById('reviewText').value = '';
  selectedStars = 0;
  document.querySelectorAll('.star-pick').forEach(s => s.classList.remove('active'));
  const labelEl = document.getElementById('starLabel');
  if (labelEl) labelEl.textContent = 'Seleccioná una calificación';

  const successEl = document.getElementById('reviewSuccess');
  if (successEl) {
    successEl.style.display = 'block';
    setTimeout(() => { successEl.style.display = 'none'; }, 4000);
  }

  renderUserReviews();
  updateDynamicStats();
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