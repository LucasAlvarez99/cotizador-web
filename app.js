/* ════════════════════════════════════════
   WEB STUDIO — app.js
════════════════════════════════════════ */

// ── CONFIG ────────────────────────────────────────
const WA_NUMBER  = '5491100000000';       // 👈 Reemplazá con tu número
const EMAIL_TO   = 'hola@webstudio.com'; // 👈 Reemplazá con tu email

// ── PROJECT DATA (90 proyectos) ───────────────────
// Paletas de colores para placeholders
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
  landing:     { challenge:'El cliente necesitaba captar más consultas online pero su presencia digital era nula. No tenía sitio web y dependía 100% de referidos.', solution:'Diseñamos una landing page orientada a conversión con un formulario visible desde el primer scroll, testimonios reales y un llamado a la acción claro. Integramos WhatsApp para consultas directas.', result:'En el primer mes recibió 18 consultas a través del sitio. Su tasa de conversión de visita a consulta llegó al 12%, muy por encima del promedio del sector.' },
  corporativo: { challenge:'La empresa tenía un sitio desactualizado de 2015 que no reflejaba su crecimiento. Perdían oportunidades por no transmitir confianza online.', solution:'Rediseñamos completamente su presencia digital con un sitio moderno, panel de administración y sección de noticias para mantener el contenido actualizado sin depender de un desarrollador.', result:'El tiempo de permanencia en el sitio aumentó un 140%. Comenzaron a recibir solicitudes de cotización directamente desde el formulario de contacto.' },
  ecommerce:   { challenge:'Tenían una tienda física con buen volumen de ventas pero ninguna presencia online. La pandemia los obligó a buscar canales alternativos urgente.', solution:'Desarrollamos un e-commerce completo integrado con su sistema de stock existente, MercadoPago y un panel de gestión que el equipo pudo usar desde el primer día.', result:'En 6 meses las ventas online representaban el 40% del total. Alcanzaron clientes en todo el país sin necesidad de ampliar la infraestructura física.' },
  blog:        { challenge:'El cliente tenía mucho contenido de valor generado por especialistas pero disperso en redes sociales sin un hogar propio que le diera autoridad.', solution:'Creamos un portal editorial con categorías, buscador, sistema de autores y newsletter. La arquitectura SEO fue diseñada desde el primer día para posicionar en Google.', result:'En 4 meses el portal alcanzó 15.000 visitas mensuales orgánicas. El newsletter llegó a 2.800 suscriptores activos y el tiempo promedio de lectura es de 4 minutos.' },
  app:         { challenge:'El negocio operaba con procesos manuales que no escalaban. Necesitaban una solución móvil para sus usuarios sin depender de terceros.', solution:'Desarrollamos una app híbrida para Android e iOS con sistema de autenticación, notificaciones push y panel web para administración. Publicada en ambas tiendas en 10 semanas.', result:'La app tiene 1.200 usuarios activos en el primer trimestre con un rating de 4.8 en ambas tiendas. Redujo el tiempo de gestión interna en un 60%.' },
};

const TESTIMONIALS = {
  landing:     [{ initials:'MR', name:'Martina R.', role:'Psicóloga', text:'El sitio superó todas mis expectativas. En los primeros 15 días ya tenía 3 consultas nuevas. El diseño es hermoso y el proceso fue muy profesional.' }],
  corporativo: [{ initials:'AG', name:'Alejandro G.', role:'Director Comercial', text:'La comunicación fue excelente en todo momento. Me mostraron el boceto a los 10 días y el resultado final fue aún mejor de lo esperado. Muy recomendable.' }],
  ecommerce:   [{ initials:'CL', name:'Carlos L.', role:'Dueño de Ferretería', text:'Las ventas online ya representan el 40% del negocio. No puedo creer el impacto que tuvo el e-commerce en tan poco tiempo. Una inversión que valió muchísimo la pena.' }],
  blog:        [{ initials:'PV', name:'Pablo V.', role:'Editor de contenidos', text:'Google empezó a posicionarlo muy bien desde el primer mes. La estructura que armaron es sólida y el equipo de redacción puede publicar sin ningún problema técnico.' }],
  app:         [{ initials:'LM', name:'Laura M.', role:'Fundadora de startup', text:'El equipo entendió exactamente lo que necesitábamos. La app es rápida, bonita y los usuarios la adoptaron de inmediato. Superó nuestras métricas del primer trimestre.' }],
};

const TECH_TAGS = {
  landing:     ['HTML/CSS','JavaScript','Next.js','Vercel','Google Analytics','WhatsApp API'],
  corporativo: ['WordPress','PHP','MySQL','AWS','Elementor Pro','WooCommerce'],
  ecommerce:   ['React','Node.js','MongoDB','MercadoPago','Stripe','AWS S3'],
  blog:        ['Next.js','Sanity CMS','Tailwind CSS','Vercel','Mailchimp','GA4'],
  app:         ['React Native','Expo','Firebase','Node.js','Push Notifications','App Store'],
};

// Genera los 90 proyectos
function generateProjects() {
  const projects = [];
  const counts = { landing:20, corporativo:20, ecommerce:18, blog:14, app:8 };
  let id = 0;

  CATEGORIES.forEach(cat => {
    const names   = [...PROJECT_NAMES[cat]];
    const palGroup = PALETTES[cat];
    for (let i = 0; i < counts[cat]; i++) {
      const name    = names[i % names.length] + (i >= names.length ? ` ${Math.floor(i/names.length)+1}` : '');
      const pal     = palGroup[i % palGroup.length];
      const [bg,fg] = pal.split('/');
      const year    = 2022 + Math.floor(Math.random() * 3);
      const heights = [220,280,240,300,260,320,250,290]; // for masonry variety
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
        desc:       DESCRIPTIONS[cat],
        challenge:  CHALLENGES[cat],
        testi,
        tech:       TECH_TAGS[cat],
        url:        '#',
        client:     name,
      });
    }
  });

  // Shuffle for visual variety
  for (let i = projects.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [projects[i], projects[j]] = [projects[j], projects[i]];
  }
  return projects;
}

const ALL_PROJECTS = generateProjects();
let visibleProjects = [];
let currentFilter   = 'all';
let searchQuery     = '';
let visibleCount    = 24;
const PAGE_SIZE     = 12;

// ── MASONRY RENDER ────────────────────────────────
function getFilteredProjects() {
  return ALL_PROJECTS.filter(p => {
    const matchCat  = currentFilter === 'all' || p.cat === currentFilter;
    const matchSearch = !searchQuery || p.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchSearch;
  });
}

function renderMasonry() {
  const grid    = document.getElementById('masonryGrid');
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

  // Update load more
  const wrap   = document.getElementById('loadMoreWrap');
  const info   = document.getElementById('loadMoreInfo');
  const btn    = document.getElementById('btnLoadMore');
  const total  = filtered.length;
  const showing = Math.min(visibleCount, total);
  info.textContent = `Mostrando ${showing} de ${total} proyectos`;
  wrap.style.display = total === 0 ? 'none' : 'block';
  btn.style.display  = showing >= total ? 'none' : 'block';

  // Update tab counts
  updateTabCounts();
}

function updateTabCounts() {
  CATEGORIES.forEach(cat => {
    const el = document.getElementById('count-' + cat);
    if (el) el.textContent = ALL_PROJECTS.filter(p => p.cat === cat).length;
  });
  document.getElementById('count-all').textContent = ALL_PROJECTS.length;
}

function catLabel(cat) {
  return { landing:'Landing', corporativo:'Corporativo', ecommerce:'E-commerce', blog:'Blog / Portal', app:'App / PWA' }[cat] || cat;
}

function loadMore() {
  visibleCount += PAGE_SIZE;
  renderMasonry();
  // Small scroll to show new items
  document.getElementById('masonryGrid').lastElementChild?.scrollIntoView({ behavior:'smooth', block:'nearest' });
}

function filterPortfolio() {
  searchQuery  = document.getElementById('portfolioSearch').value;
  visibleCount = 24;
  renderMasonry();
}

// Filter tabs
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
  renderMasonry();
  initCounters();
  initTimer();
  initQuoterNav();
  showStep(1);
});

// ── POPUP ─────────────────────────────────────────
let popupSlideIndex = 0;
let currentProject  = null;

function openPopup(project) {
  currentProject   = project;
  popupSlideIndex  = 0;
  document.body.style.overflow = 'hidden';

  // Images
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

  // Meta
  const badgeClass = project.cat;
  document.getElementById('popupMeta').innerHTML = `
    <span class="popup-meta-tag masonry-badge ${badgeClass}">${catLabel(project.cat)}</span>
    <span class="popup-meta-year">· ${project.year}</span>
    <span class="popup-meta-client">· ${project.client}</span>`;
  document.getElementById('popupTitle').textContent = project.name;

  // Overview tab
  document.getElementById('popupDesc').textContent = project.desc;
  document.getElementById('popupTech').innerHTML = project.tech.map(t => `<span class="tech-tag">${t}</span>`).join('');

  // Case study tab
  const cs = project.challenge;
  document.getElementById('popupCase').innerHTML = `
    <div class="cs-block"><div class="cs-label">🎯 Desafío</div><div class="cs-text">${cs.challenge}</div></div>
    <div class="cs-block"><div class="cs-label">💡 Solución</div><div class="cs-text">${cs.solution}</div></div>
    <div class="cs-block"><div class="cs-label">📈 Resultado</div><div class="cs-text">${cs.result}</div></div>
    <div class="cs-block"><div class="cs-label">🛠 Tecnologías</div><div class="cs-text">${project.tech.join(' · ')}</div></div>`;

  // Testimonial tab
  const t = project.testi;
  document.getElementById('popupTesti').innerHTML = `
    <div class="pt-stars">★★★★★</div>
    <div class="pt-text">"${t.text}"</div>
    <div class="pt-author">
      <div class="pt-avatar">${t.initials}</div>
      <div><div class="pt-name">${t.name}</div><div class="pt-role">${t.role}</div></div>
    </div>`;

  // Visit button
  document.getElementById('popupVisitBtn').href = project.url;

  // Reset to first tab
  document.querySelectorAll('.ptab').forEach((t,i) => t.classList.toggle('active', i===0));
  document.querySelectorAll('.ptab-content').forEach((c,i) => c.classList.toggle('active', i===0));

  // Open
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

// Close popup on ESC
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
  if (a1 === 'vender')                { icon='🛒'; title='E-commerce';       desc='Una tienda online completa con catálogo, carrito y medios de pago.'; }
  else if (a1 === 'informar')          { icon='✍️'; title='Blog / Portal';    desc='Una plataforma editorial con buscador, categorías y panel de administración.'; }
  else if (a1 === 'empresa' && a3 !== 'bajo') { icon='🏢'; title='Sitio Corporativo'; desc='Presencia profesional completa con múltiples secciones y panel de gestión.'; }
  else                                 { icon='🚀'; title='Landing Page';     desc='Una página clara y efectiva para captar clientes y presentar tu propuesta.'; }

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

// ── TIMER ─────────────────────────────────────────
function initTimer() {
  const key = 'ws_timer_end_v2';
  let end = localStorage.getItem(key);
  if (!end || isNaN(end)) {
    end = Date.now() + 48 * 60 * 60 * 1000; // 48hs
    localStorage.setItem(key, end);
  }
  end = parseInt(end);
  const clock = document.getElementById('timerClock');
  if (!clock) return;
  function tick() {
    const diff = end - Date.now();
    if (diff <= 0) { clock.textContent = '¡Oferta finalizada!'; return; }
    const h = Math.floor(diff/3600000).toString().padStart(2,'0');
    const m = Math.floor((diff%3600000)/60000).toString().padStart(2,'0');
    const s = Math.floor((diff%60000)/1000).toString().padStart(2,'0');
    clock.textContent = `${h}:${m}:${s}`;
  }
  tick();
  setInterval(tick, 1000);
}

// ── QUOTER (SIN PRECIOS) ──────────────────────────
const TOTAL_STEPS = 7;
let currentStep   = 1;

const quoterState = {
  type: '', pages: '', features: [], palette: '', extras: []
};

const STEP_LABELS = ['Tipo','Páginas','Funciones','Estilo','Extras','Contacto','✓'];

function initQuoterNav() {
  // Inject nav buttons into each step
  document.querySelectorAll('.step').forEach((stepEl, idx) => {
    const n = idx + 1;
    if (n === TOTAL_STEPS) return; // last step has no nav
    const nav = document.createElement('div');
    nav.className = 'quoter-nav';
    const backBtn = n > 1
      ? `<button class="btn-q-back" onclick="prevStep()">← Atrás</button>`
      : `<div></div>`;
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

function nextStep() {
  if (currentStep >= TOTAL_STEPS) return;
  currentStep++;
  showStep(currentStep);
}

function prevStep() {
  if (currentStep <= 1) return;
  currentStep--;
  showStep(currentStep);
}

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

// ── SEND WHATSAPP (brief, sin precio) ────────────
function sendWhatsApp() {
  const name  = document.getElementById('clientName').value.trim();
  const biz   = document.getElementById('clientBusiness').value.trim();
  const email = document.getElementById('clientEmail').value.trim();
  const phone = document.getElementById('clientPhone').value.trim();
  const note  = document.getElementById('clientNote').value.trim();

  if (!name || !phone) { alert('Por favor completá tu nombre y WhatsApp para continuar.'); return; }

  const allFeatures = [...new Set([...quoterState.features, ...quoterState.extras])];

  let msg = `🌐 *CONSULTA DE PROYECTO — WEB STUDIO*\n`;
  msg += `─────────────────────────\n`;
  msg += `👤 *Nombre:* ${name}\n`;
  if (biz)   msg += `🏢 *Empresa/Proyecto:* ${biz}\n`;
  if (email) msg += `📧 *Email:* ${email}\n`;
  msg += `📞 *WhatsApp:* ${phone}\n\n`;
  msg += `📋 *DETALLE DEL PROYECTO*\n`;
  if (quoterState.type)    msg += `• Tipo: ${quoterState.type}\n`;
  if (quoterState.pages)   msg += `• Páginas/secciones: ${quoterState.pages}\n`;
  if (quoterState.palette) msg += `• Estilo visual: ${quoterState.palette}\n`;
  if (allFeatures.length)  msg += `• Funcionalidades:\n  – ${allFeatures.join('\n  – ')}\n`;
  if (note)                msg += `\n📝 *Notas:* ${note}\n`;
  msg += `─────────────────────────\n`;
  msg += `_Enviado desde el cotizador de Web Studio_`;

  window.open(`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(msg)}`, '_blank');
  goToConfirmation();
}

// ── SEND EMAIL ─────────────────────────────────────
function sendEmail() {
  const name  = document.getElementById('clientName').value.trim();
  const biz   = document.getElementById('clientBusiness').value.trim();
  const email = document.getElementById('clientEmail').value.trim();
  const phone = document.getElementById('clientPhone').value.trim();
  const note  = document.getElementById('clientNote').value.trim();

  if (!name || !email) { alert('Por favor completá tu nombre y email para continuar.'); return; }

  const allFeatures = [...new Set([...quoterState.features, ...quoterState.extras])];

  const subject = encodeURIComponent(`Consulta de proyecto web — ${name}${biz ? ' / ' + biz : ''}`);

  let body = `Hola Web Studio,\n\nQuería consultar por un proyecto web con las siguientes características:\n\n`;
  body += `DATOS DE CONTACTO\n`;
  body += `Nombre: ${name}\n`;
  if (biz)   body += `Empresa: ${biz}\n`;
  body += `Email: ${email}\n`;
  if (phone) body += `WhatsApp: ${phone}\n\n`;
  body += `DETALLE DEL PROYECTO\n`;
  if (quoterState.type)    body += `Tipo: ${quoterState.type}\n`;
  if (quoterState.pages)   body += `Páginas/secciones: ${quoterState.pages}\n`;
  if (quoterState.palette) body += `Estilo visual: ${quoterState.palette}\n`;
  if (allFeatures.length)  body += `Funcionalidades: ${allFeatures.join(', ')}\n`;
  if (note)                body += `\nNotas adicionales: ${note}\n`;
  body += `\nQuedo a la espera de su presupuesto personalizado.\n\nSaludos,\n${name}`;

  window.location.href = `mailto:${EMAIL_TO}?subject=${subject}&body=${encodeURIComponent(body)}`;
  goToConfirmation();
}

function goToConfirmation() {
  currentStep = TOTAL_STEPS;
  showStep(TOTAL_STEPS);
}

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

// ── NAV MOBILE ─────────────────────────────────────
function toggleMenu() {
  document.getElementById('navMobile').classList.toggle('open');
}