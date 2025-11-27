// Inyecta header (top-bar + header + nav) y footer comunes en todas las páginas
// Detecta si la página está en /Paginas/ para ajustar rutas relativas

(function () {
  // Determinar base relativa hasta la raíz, contemplando subcarpetas
  const path = location.pathname.replace(/\\/g, '/');
  const isNestedSubpage = /\/Paginas\/Paginasemergentes\//i.test(path);
  const isSubpage = /\/Paginas\//i.test(path);
  const baseToRoot = isNestedSubpage ? '../../' : (isSubpage ? '../' : '');
  const loginPath = `${baseToRoot}Paginas/Paginasemergentes/iniciosesion.html`;

  const headerHTML = () => `
    <div class="top-bar">
      <a href="${baseToRoot}Paginas/Paginasemergentes/Formpro.html" class="admin-tools" style="margin-right:12px; color:inherit; text-decoration:none;">Herramientas de administrador</a>
      <span class="envios">Envíos a toda Colombia</span>
      <a href="${baseToRoot}Paginas/Paginasemergentes/Mispedidos.html" style="color: inherit; text-decoration: none;">
        <span>Mis pedidos</span>
      </a>
      <a href="${loginPath}" style="color: inherit; text-decoration: none;"><span>Mi cuenta</span></a>
      <a href="${loginPath}"><img src="https://i.imgur.com/BHiRNHm.png" alt="Usuario" style="height:24px;"></a>
    </div>
    <header>
      <div class="header-left">
        <a href="${baseToRoot}index.html" aria-label="Ir a inicio - logo">
          <img src="https://i.imgur.com/sUTU3bi.png" alt="Logo Draconis">
        </a>
        <a href="${baseToRoot}index.html" aria-label="Ir a inicio - texto">
          <img src="https://i.imgur.com/CmZgZpI.png" alt="Draconis Texto">
        </a>
      </div>
      <div class="search-container">
        <img src="https://i.imgur.com/1CvowTj.png" alt="Buscar" style="height:18px;margin-right:8px">
        <input type="search" placeholder="Buscar">
      </div>
      <div class="header-right">
        <a href="${baseToRoot}Paginas/Paginasemergentes/Micarrito.html" class="cart-wrapper" aria-label="Carrito">
          <img src="https://i.imgur.com/orxdqLp.png" alt="Carrito">
          <span class="cart-badge" id="cart-count" aria-live="polite">0</span>
        </a>
      </div>
    </header>
    <nav>
      <a href="${baseToRoot}Paginas/Paginasemergentes/Loultimo.html">Lo último</a>
      <div class="dropdown">
        <a href="#" class="drop-toggle">Funkos</a>
        <div class="dropdown-menu">
          <a href="${baseToRoot}Paginas/Paginasemergentes/detemporada.html">De temporada</a>
          <a href="${baseToRoot}Paginas/Paginasemergentes/Clasicos.html">Clásicos</a>
        </div>
      </div>
      <div class="dropdown">
        <a href="#" class="drop-toggle">Coleccionables</a>
        <div class="dropdown-menu">
          <a href="#">Coming soon</a>
        </div>
      </div>
    </nav>
  `;

  const footerHTML = () => `
    <footer>
      <div class="footer-grid">
        <div>
          <h3>Servicio al cliente</h3>
          <p>Email: dannydalkyrieartworks666@gmail.com</p>
          <p>WhatsApp: +57 3244534929</p>
          <p>Horario: Lunes a Domingo, 9:00 am a 5:00 pm</p>
        </div>
        <div>
          <h3>Puntos de venta</h3>
          <p>Tienda Virtual</p>
          <p>Envíos a toda Colombia</p>
          <p>Entregas Universidad Militar Nueva Granada</p>
        </div>
        <div>
          <img src="https://i.imgur.com/RqgEn01.png" alt="mujer verde">
        </div>
      </div>
    </footer>
    <div class="metodos">
      <h2>Aceptamos los siguientes métodos de pago</h2>
      <div class="payment-logos">
        <img src="https://i.imgur.com/H4nivaw.png" alt="Nequi">
        <img src="https://i.imgur.com/ibVUeR5.png" alt="Paypal">
        <img src="https://i.imgur.com/8sHIBqR.png" alt="Daviplata">
        <img src="https://i.imgur.com/QxLErK6.png" alt="Mercado Pago">
      </div>
    </div>
    <section class="footer-bottom">
      <div class="footer-bottom-grid">
        <div><h4>Acerca De</h4><ul><li>Tendencias</li><li>Sostenibilidad</li><li>Blog</li></ul></div>
        <div><h4>Ayuda/QR</h4><ul><li>Compras</li><li>Ventas</li><li>Resolución de problemas</li></ul></div>
        <div><h4>Redes Sociales</h4><ul><li>X</li><li>Instagram</li><li>Facebook</li></ul></div>
        <div><h4>Temporadas</h4><ul><li>Black Friday</li><li>Hot sale</li><li>Descuentazos</li></ul></div>
        <div><h4>Mi cuenta</h4><ul><li>Resumen</li><li>Favoritos</li><li>Carrito</li></ul></div>
      </div>
      <div class="footer-bottom-text">
        <span>Copyright 2022-2025</span>
        <span>Calle 100 Edificio we work, Bogotá D.C</span>
        <span>Términos y Condiciones</span>
        <span>Accesibilidad</span>
      </div>
    </section>
  `;

  function injectHeader() {
    const existingTopBar = document.querySelector('.top-bar');
    const existingHeader = document.querySelector('header');
    const existingNav = document.querySelector('nav');

    const container = document.createElement('div');
    container.innerHTML = headerHTML();

    const insertionPoint = existingHeader || document.body.firstElementChild;
    if (insertionPoint && insertionPoint.parentNode) {
      insertionPoint.parentNode.insertBefore(container, insertionPoint);
    } else {
      document.body.prepend(container);
    }

    existingTopBar && existingTopBar.remove();
    existingHeader && existingHeader.remove();
    existingNav && existingNav.remove();
  }

  function injectFooter() {
    const existingFooter = document.querySelector('footer');
    const existingMetodos = document.querySelector('.metodos');
    const existingFooterBottom = document.querySelector('.footer-bottom');

    const container = document.createElement('div');
    container.innerHTML = footerHTML();

    document.body.appendChild(container);

    existingFooter && existingFooter.remove();
    existingMetodos && existingMetodos.remove();
    existingFooterBottom && existingFooterBottom.remove();
  }

  // --- Carrito (localStorage) ---
  const CART_KEY = 'draconis_cart_items';
  function escapeHtml(str) {
    return String(str || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }
  function parsePriceToNumber(text) {
    // Quita todo excepto dígitos; asume moneda sin decimales (COP)
    const digits = String(text || '').replace(/[^\d]/g, '');
    return digits ? parseInt(digits, 10) : 0;
  }
  function getCart() {
    try {
      const raw = localStorage.getItem(CART_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch { return []; }
  }
  function setCart(items) {
    localStorage.setItem(CART_KEY, JSON.stringify(items));
    updateCartBadge();
  }
  function addToCart(product) {
    const items = getCart();
    // Sumar cantidad si ya existe mismo nombre; de lo contrario, push
    const idx = items.findIndex(it => it.name === product.name);
    if (idx >= 0) items[idx].qty += product.qty || 1; else items.push(product);
    setCart(items);
  }
  function updateCartBadge() {
    const countEl = document.getElementById('cart-count');
    if (!countEl) return;
    const items = getCart();
    const total = items.reduce((sum, it) => sum + (it.qty || 1), 0);
    countEl.textContent = String(total);
  }

  // --- Búsqueda global de productos ---
  // Índice simple de productos y categorías (paths relativos a la raíz del repo)
  const PRODUCT_INDEX = [
    // Categorías
    { name: 'Accesorios', path: 'Paginas/Aceesorios.html', keywords: ['aretes', 'collares', 'accesorio'] },
    { name: 'Figuras personalizadas', path: 'Paginas/Figuras-personalizadas.html', keywords: ['figuras', 'personalizado', 'muñeco', 'funko'] },
    { name: 'Modelos 3D', path: 'Paginas/Modelos 3D.html', keywords: ['impresion', 'impresión', '3d', 'modelos'] },
    { name: 'Props', path: 'Paginas/Props.html', keywords: ['props', 'cosplay', 'utileria', 'accesorios'] },
    { name: 'Pregrabado de madera', path: 'Paginas/Pregrabado de madera.html', keywords: ['madera', 'grabado', 'laser'] },

    // Productos (Paginasemergentes)
    { name: 'Accesorios Ghost', path: 'Paginas/Paginasemergentes/Accesorios-Ghost.html', keywords: ['ghost', 'collar', 'aretes', 'banda'] },
    { name: 'Aretes Monster Draculavra', path: 'Paginas/Paginasemergentes/Aretes-Monster-Draculavra.html', keywords: ['aretes', 'monster', 'draculavra'] },
    { name: 'Aretes y Collar Banda Avatar', path: 'Paginas/Paginasemergentes/Aretes-y-Collar-Banda-Avatar.html', keywords: ['aretes', 'collar', 'avatar', 'banda'] },
    { name: 'Cofres Madera Personalizados', path: 'Paginas/Paginasemergentes/Cofres-Madera-Personalizados.html', keywords: ['cofre', 'madera', 'grabado'] },
    { name: 'Collar Banda Ghost', path: 'Paginas/Paginasemergentes/Collar-Banda-Ghost.html', keywords: ['collar', 'ghost', 'banda'] },
    { name: 'Collar Linkin Park', path: 'Paginas/Paginasemergentes/Collar-Linkin-Park.html', keywords: ['collar', 'linkin', 'park', 'banda'] },
    { name: 'Cuadros Personalizados', path: 'Paginas/Paginasemergentes/Cuadros-Personalizados.html', keywords: ['cuadros', 'personalizado', 'arte'] },
    { name: 'Escudo Vikingo de Madera', path: 'Paginas/Paginasemergentes/Escudo-Vikingo-de-Madera.html', keywords: ['escudo', 'vikingo', 'madera'] },
    { name: 'Joey Jordison Slipknot', path: 'Paginas/Paginasemergentes/Joey-Jordison-Slipknot.html', keywords: ['joey', 'jordison', 'slipknot', 'baterista'] },
    { name: 'Johannes Eckerström Avatar', path: 'Paginas/Paginasemergentes/Johannes-Eckerstrom-Avatar.html', keywords: ['johannes', 'eckerstrom', 'avatar', 'banda'] },
    { name: 'Johannes Eckerström', path: 'Paginas/Paginasemergentes/Johannes-Eckerstrom.html', keywords: ['johannes', 'eckerstrom', 'cantante'] },
    { name: 'Josh Dun', path: 'Paginas/Paginasemergentes/Josh-Dun.html', keywords: ['josh', 'dun', 'twenty one pilots', 'baterista'] },
    { name: 'Manos Robot Cyberpunk', path: 'Paginas/Paginasemergentes/Manos-Robot-Cyberpunk.html', keywords: ['manos', 'robot', 'cyberpunk'] },
    { name: 'Ned TOP', path: 'Paginas/Paginasemergentes/Ned-TOP.html', keywords: ['ned', 'top', 'twenty one pilots'] },
    { name: 'Ned Twenty One Pilots Modelo 3D', path: 'Paginas/Paginasemergentes/Ned-Twenty-One-Pilots-Modelo-3D.html', keywords: ['ned', 'modelo', '3d', 'impresion'] },
    { name: 'Papa Emeritus II Ghost Cetro', path: 'Paginas/Paginasemergentes/Papa-Emeritus-II-Ghost-Cetro.html', keywords: ['papa', 'emeritus', 'ghost', 'cetro'] },
    { name: 'Saorix Caballeros del Zodiaco', path: 'Paginas/Paginasemergentes/Saorix-Caballeros-del-Zodiaco.html', keywords: ['saorix', 'caballeros', 'zodiaco'] },
    { name: 'Tankards Pocillos Personalizados', path: 'Paginas/Paginasemergentes/Tankards-Pocillos-Personalizados.html', keywords: ['pocillos', 'tankards', 'personalizado'] },
    { name: 'Tyler Joseph', path: 'Paginas/Paginasemergentes/Tyler-Joseph.html', keywords: ['tyler', 'joseph', 'twenty one pilots', 'cantante'] }
  ];

  function normalizeText(s) {
    return String(s || '')
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9\s]+/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  function doSearch(query) {
    const q = (query || '').trim();
    const dest = `${baseToRoot}Paginas/Paginasemergentes/Buscar.html?q=${encodeURIComponent(q)}`;
    location.href = dest;
  }

  function initSearch() {
    const searchContainer = document.querySelector('.search-container');
    if (!searchContainer) return;
    const input = searchContainer.querySelector('input[type="search"]');
    const icon = searchContainer.querySelector('img');
    if (input) {
      input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          doSearch(input.value);
        }
      });
    }
    if (icon) {
      icon.style.cursor = 'pointer';
      icon.addEventListener('click', () => {
        // En pantallas muy pequeñas, expandimos el input; si ya está expandido y no hay input visible, navegar
        const isUltraMobile = window.matchMedia('(max-width: 360px)').matches;
        if (isUltraMobile) {
          if (!searchContainer.classList.contains('search-expanded')) {
            searchContainer.classList.add('search-expanded');
            if (input) {
              input.style.display = 'block';
              input.focus();
            }
            // Cerrar al hacer clic fuera
            const closeOnOutside = (ev) => {
              if (!searchContainer.contains(ev.target)) {
                searchContainer.classList.remove('search-expanded');
                if (input) input.style.display = '';
                document.removeEventListener('click', closeOnOutside);
                document.removeEventListener('keydown', closeOnEsc);
              }
            };
            const closeOnEsc = (ev) => {
              if (ev.key === 'Escape') {
                searchContainer.classList.remove('search-expanded');
                if (input) input.style.display = '';
                document.removeEventListener('click', closeOnOutside);
                document.removeEventListener('keydown', closeOnEsc);
              }
            };
            setTimeout(() => {
              document.addEventListener('click', closeOnOutside);
              document.addEventListener('keydown', closeOnEsc);
            }, 0);
            return;
          }
          // Si ya está expandido, ejecutar búsqueda
          doSearch(input?.value || '');
          return;
        }
        // pantallas normales: ejecutar búsqueda
        doSearch(input?.value || '');
      });
    }
  }

  function initSearchResultsPage() {
    const root = document.getElementById('search-root');
    if (!root) return; // no estamos en la página de resultados

    const params = new URLSearchParams(location.search);
    const qRaw = params.get('q') || '';
  const qNorm = normalizeText(qRaw);
  const tokens = qNorm.split(' ').filter(Boolean);

    // Mostrar query en el input del header si existe
    const headerInput = document.querySelector('.search-container input[type="search"]');
    if (headerInput) headerInput.value = qRaw;

    let results = [];
    if (tokens.length) {
      results = PRODUCT_INDEX.filter(p => {
        const doc = normalizeText([p.name].concat(p.keywords || []).join(' '));
        return tokens.every(t => doc.includes(t));
      });
    }

    const title = document.createElement('h2');
    title.textContent = qRaw ? `Resultados (${results.length}) para "${qRaw}"` : 'Buscar productos';
    if (qRaw) {
      document.title = `Buscar: ${qRaw} — ${results.length} resultados`;
    }
    const container = document.createElement('div');
    container.className = 'grid-categorias';

    if (!results.length) {
      root.innerHTML = '';
      root.appendChild(title);
      const msg = document.createElement('p');
      msg.textContent = qRaw ? 'No encontramos resultados. Intenta con otro término.' : 'Escribe en la barra superior y presiona Enter.';
      root.appendChild(msg);
      return;
    }

    results.forEach(p => {
      const a = document.createElement('a');
      a.className = 'categoria';
      a.href = `${baseToRoot}${p.path}`;
      a.innerHTML = `
        <img src="https://i.imgur.com/lj72Ghv.png" alt="${p.name}">
        <p>${p.name}</p>
      `;
      container.appendChild(a);
    });

    root.innerHTML = '';
    root.appendChild(title);
    root.appendChild(container);
  }

  // --- Render de la página Mi carrito ---
  function renderCartPage() {
    const root = document.getElementById('cart-root');
    if (!root) return; // No estamos en la página del carrito
    const items = getCart();

    if (!items.length) {
      root.innerHTML = '<p>Tu carrito está vacío.</p>' +
        `<div class="cart-actions"><a class="btn-primary" href="${baseToRoot}index.html">Seguir comprando</a></div>`;
      return;
    }

    const list = document.createElement('ul');
    list.className = 'cart-list';

    items.forEach((it, idx) => {
      const li = document.createElement('li');
      li.className = 'cart-item';
      const unit = typeof it.price === 'number' ? it.price : parsePriceToNumber(it.price);
      const linkOpen = it.url ? `<a class="cart-link" href="${it.url}">` : '';
      const linkClose = it.url ? `</a>` : '';
      const imgHtml = it.image ? `${linkOpen}<img class="cart-thumb" src="${it.image}" alt="${it.name}">${linkClose}` : '';
      li.innerHTML = `
        ${imgHtml}
        ${linkOpen}<span class="cart-item-name">${it.name}</span>${linkClose}
        <span class="cart-price">$${unit.toLocaleString()}</span>
        <span class="cart-qty">
          Cantidad: <input type="number" min="1" value="${it.qty || 1}" data-idx="${idx}" />
          <button class="cart-remove" data-idx="${idx}">Eliminar</button>
        </span>
      `;
      list.appendChild(li);
    });

    const total = items.reduce((sum, it) => {
      const unit = typeof it.price === 'number' ? it.price : parsePriceToNumber(it.price);
      return sum + unit * (it.qty || 1);
    }, 0);

    // Bloque de dirección de envío y método de pago
    const shipping = (() => { try { return localStorage.getItem('draconis_shipping_address') || ''; } catch { return ''; } })();
    const payMethod = (() => { try { return localStorage.getItem('draconis_payment_method') || ''; } catch { return ''; } })();
    const metaDiv = document.createElement('div');
    metaDiv.className = 'cart-meta';
    metaDiv.innerHTML = `
      <div class="cart-meta-row">
        <span class="cart-meta-label">Dirección:</span>
        <span class="cart-meta-value">${shipping ? escapeHtml(shipping) : 'No seleccionada'}</span>
        <a class="cart-meta-change" href="${baseToRoot}Paginas/Paginasemergentes/Direcciondeenvio.html">${shipping ? 'Cambiar' : 'Añadir'}</a>
      </div>
      <div class="cart-meta-row">
        <span class="cart-meta-label">Pago:</span>
        <span class="cart-meta-value">${payMethod ? escapeHtml(payMethod) : 'No seleccionado'}</span>
        <a class="cart-meta-change" href="${baseToRoot}Paginas/Paginasemergentes/Mediosdepago.html">${payMethod ? 'Cambiar' : 'Elegir'}</a>
      </div>
    `;
    const summary = document.createElement('div');
    summary.className = 'cart-summary';
    summary.innerHTML = `
      <strong>Total: $${total.toLocaleString()}</strong>
      <div class="cart-actions">
        <button id="cart-clear" class="btn-secondary">Vaciar carrito</button>
        <button id="cart-checkout" class="btn-primary">Finalizar compra</button>
      </div>
    `;

    root.innerHTML = '';
    root.appendChild(list);
    root.appendChild(metaDiv);
    root.appendChild(summary);

    // Eventos
    root.querySelectorAll('input[type="number"]').forEach(input => {
      input.addEventListener('change', (e) => {
        const idx = parseInt(e.target.getAttribute('data-idx'), 10);
        const qty = Math.max(1, parseInt(e.target.value, 10) || 1);
        const items = getCart();
        if (items[idx]) {
          items[idx].qty = qty;
          setCart(items);
          renderCartPage();
        }
      });
    });

    root.querySelectorAll('.cart-remove').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const idx = parseInt(e.target.getAttribute('data-idx'), 10);
        const items = getCart();
        items.splice(idx, 1);
        setCart(items);
        renderCartPage();
      });
    });

    document.getElementById('cart-clear')?.addEventListener('click', () => {
      setCart([]);
      renderCartPage();
    });

    document.getElementById('cart-checkout')?.addEventListener('click', () => {
      // Validar que exista dirección de envío y método de pago antes de continuar
      const shipping = (() => { try { return localStorage.getItem('draconis_shipping_address') || ''; } catch { return ''; } })();
      const payMethod = (() => { try { return localStorage.getItem('draconis_payment_method') || ''; } catch { return ''; } })();

      if (!shipping) {
        alert('Por favor, añade tu Dirección de envío para continuar.');
        location.href = `${baseToRoot}Paginas/Paginasemergentes/Direcciondeenvio.html`;
        return;
      }
      if (!payMethod) {
        alert('Por favor, elige un Medio de pago para continuar.');
        location.href = `${baseToRoot}Paginas/Paginasemergentes/Mediosdepago.html`;
        return;
      }

      // Ambos presentes: continuar a página de confirmación
      location.href = `${baseToRoot}Paginas/Paginasemergentes/Gracias.html`;
    });
  }

  // --- Página Inicio de sesión (iniciosesion.html) ---
  function initLoginPage() {
    // Detectar por estructura de la página
    const loginContainer = document.querySelector('.login-container');
    if (!loginContainer) return;

    const continuarBtn = loginContainer.querySelector('.button.primary');
    const crearBtn = loginContainer.querySelector('.button.secondary');
    const emailInput = loginContainer.querySelector('input[type="text"]');
    const passwordInput = loginContainer.querySelector('input[type="password"]');
    const errorMsg = document.getElementById('error-message');

    // Interstitial tipo Cloudflare: crear/mostrar/ocultar overlay sencillo
    function createInterstitial() {
      let overlay = document.getElementById('dg-interstitial');
      if (overlay) return overlay;
      overlay = document.createElement('div');
      overlay.id = 'dg-interstitial';
      overlay.setAttribute('role', 'status');
      overlay.style.cssText = 'position:fixed;inset:0;display:none;align-items:center;justify-content:center;background:rgba(255,255,255,0.96);z-index:9999;backdrop-filter:blur(2px);';
      overlay.innerHTML = `
        <div style="text-align:center;max-width:360px;padding:22px;border-radius:10px;">
          <div style="width:56px;height:56px;margin:0 auto 12px;border-radius:50%;border:6px solid #eee;border-top-color:#925cff;animation:dg-spin 1s linear infinite;"></div>
          <div style="font-weight:700;margin-bottom:6px;font-size:16px;color:#111">Comprobando tu navegador</div>
          <div style="color:#666;font-size:13px">Esto ayuda a proteger tu cuenta y tus datos.</div>
        </div>
        <style id="dg-interstitial-style">@keyframes dg-spin{to{transform:rotate(360deg)}}</style>
      `;
      document.body.appendChild(overlay);
      return overlay;
    }
    function showInterstitial() { const o = createInterstitial(); o.style.display = 'flex'; }
    function hideInterstitial() { const o = document.getElementById('dg-interstitial'); if (o) o.style.display = 'none'; }

    // Usuario dummy para simulación (en producción, esto vendría de un backend)
    const dummyUser = {
      email: 'test@example.com',
      passwordHash: CryptoJS.SHA256('password123').toString() // Hash de "password123"
    };

    if (continuarBtn) {
      continuarBtn.addEventListener('click', (e) => {
        e.preventDefault();
        const email = emailInput?.value?.trim() || '';
        const password = passwordInput?.value?.trim() || '';

        if (!email || !password) {
          if (errorMsg) {
            errorMsg.style.display = 'block';
            errorMsg.textContent = 'Por favor, ingresa tu correo y contraseña.';
          }
          return;
        }

        // Mostrar interstitial durante la comprobación (simulamos un pequeño delay)
        showInterstitial();
        setTimeout(() => {
          const passwordHash = CryptoJS.SHA256(password).toString();

          // Verificar credenciales (simulado)
          if (email === dummyUser.email && passwordHash === dummyUser.passwordHash) {
            // Login exitoso: guardar en localStorage y redirigir
            try {
              localStorage.setItem('draconis_logged_in', 'true');
              localStorage.setItem('draconis_user_email', email);
            } catch {}
            hideInterstitial();
            alert('Inicio de sesión exitoso.');
            location.href = `${baseToRoot}index.html`;
          } else {
            hideInterstitial();
            if (errorMsg) {
              errorMsg.style.display = 'block';
              errorMsg.textContent = 'Correo o contraseña incorrectos.';
            }
          }
        }, 900);
      });
    }
    if (crearBtn) {
      crearBtn.addEventListener('click', (e) => {
        e.preventDefault();
        location.href = `${baseToRoot}Paginas/Paginasemergentes/crearcuenta.html`;
      });
    }
  }

  // --- Página Crear Cuenta ---
  function initCreateAccountPage() {
    // Detectar por estructura de la página
    const createContainer = document.querySelector('.create-account-container');
    if (!createContainer) return;

    const crearBtn = createContainer.querySelector('.button.primary');
    const yaTengoBtn = createContainer.querySelector('.button.secondary');

    if (crearBtn) {
      crearBtn.addEventListener('click', (e) => {
        e.preventDefault();
        // Capturar datos del formulario usando querySelectorAll para mayor fiabilidad
        const inputs = createContainer.querySelectorAll('input');
        const nombre = inputs[0]?.value?.trim() || '';
        const email = inputs[1]?.value?.trim() || '';
        const telefono = inputs[2]?.value?.trim() || '';
        // Validar que todos los campos estén completos
        if (!nombre || !email || !telefono) {
          alert('Por favor, completa todos los campos.');
          return;
        }
        // Simular guardar en localStorage
        try {
          localStorage.setItem('draconis_user_name', nombre);
          localStorage.setItem('draconis_user_email', email);
          localStorage.setItem('draconis_user_phone', telefono);
        } catch {}
        // Mostrar mensaje y redirigir al inicio
        alert('Cuenta creada exitosamente');
        location.href = `${baseToRoot}index.html`;
      });
    }
    if (yaTengoBtn) {
      yaTengoBtn.addEventListener('click', (e) => {
        e.preventDefault();
        location.href = `${baseToRoot}Paginas/Paginasemergentes/iniciosesion.html`;
      });
    }
  }

  function injectAddToCartButtons() {
    // Inserta un botón "Agregar al carrito" debajo de cada .btn-comprar
    const buyButtons = document.querySelectorAll('.btn-comprar');
    buyButtons.forEach((btn) => {
      // Evitar duplicar si ya existe un .btn-agregar junto a este botón
      const next = btn.nextElementSibling;
      if (next && next.classList && next.classList.contains('btn-agregar')) return;

      const addBtn = document.createElement('button');
      addBtn.className = 'btn-agregar';
      addBtn.type = 'button';
      addBtn.textContent = 'Agregar al carrito';
      addBtn.addEventListener('click', () => {
        try {
          const info = btn.closest('.producto-info');
          const title = info?.querySelector('h1')?.textContent?.trim() || 'Producto';
          const priceText = info?.querySelector('.precio')?.textContent || '';
          const price = parsePriceToNumber(priceText);
          // Capturar imagen dentro del bloque de detalle
          const detail = info?.closest('.producto-detalle') || document.querySelector('.producto-detalle');
          const imgEl = detail?.querySelector('.producto-imagen img') || detail?.querySelector('img');
          const image = imgEl?.getAttribute('src') || '';
          const url = location.pathname;
          addToCart({ name: title, price, image, url, qty: 1 });
          addBtn.textContent = 'Agregado ✔';
          setTimeout(() => (addBtn.textContent = 'Agregar al carrito'), 1200);
          // Opcional: navegar directo al carrito al agregar
          // location.href = `${baseToRoot}Paginas/Paginasemergentes/Micarrito.html`;
        } catch (e) {
          console.warn('[Carrito] No se pudo identificar el producto', e);
        }
      });

      btn.insertAdjacentElement('afterend', addBtn);
    });
  }

  // Redirige los botones "Comprar" a Medios de pago
  function wireBuyButtons() {
    document.querySelectorAll('.btn-comprar').forEach(btn => {
      if (btn.dataset.buyWired === '1') return; // evitar duplicar
      btn.dataset.buyWired = '1';
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        try {
          // Intentar capturar info del producto como en Agregar al carrito
          const info = btn.closest('.producto-info');
          const title = info?.querySelector('h1')?.textContent?.trim() || 'Producto';
          const priceText = info?.querySelector('.precio')?.textContent || '';
          const price = parsePriceToNumber(priceText);
          const detail = info?.closest('.producto-detalle') || document.querySelector('.producto-detalle');
          const imgEl = detail?.querySelector('.producto-imagen img') || detail?.querySelector('img');
          const image = imgEl?.getAttribute('src') || '';
          const url = location.pathname;
          addToCart({ name: title, price, image, url, qty: 1 });
        } catch (err) {
          console.warn('[Comprar] No se pudo agregar al carrito antes de ir a pagos', err);
        }
        // Ir a Medios de pago
        location.href = `${baseToRoot}Paginas/Paginasemergentes/Mediosdepago.html`;
      });
    });
  }

  // --- Página Medios de Pago ---
  function initPaymentPage() {
    const form = document.getElementById('payment-form');
    if (!form) return; // No estamos en la página de medios de pago

    // Preseleccionar método guardado
    try {
      const saved = localStorage.getItem('draconis_payment_method');
      if (saved) {
        const input = document.querySelector(`input[name="payment"][value="${saved}"]`);
        if (input) input.checked = true;
      }
    } catch {}

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const selected = document.querySelector('input[name="payment"]:checked');
      if (!selected) {
        alert('Por favor, selecciona un medio de pago.');
        return;
      }
      try { localStorage.setItem('draconis_payment_method', selected.value); } catch {}
      // Regresar al carrito
      location.href = `${baseToRoot}Paginas/Paginasemergentes/Micarrito.html`;
    });

    const cancelBtn = document.getElementById('cancel-payment');
    cancelBtn?.addEventListener('click', () => {
      location.href = `${baseToRoot}Paginas/Paginasemergentes/Micarrito.html`;
    });
  }

  // --- Página Dirección de Envío ---
  function initShippingPage() {
    const form = document.getElementById('shipping-form');
    if (!form) return; // No estamos en la página de dirección de envío

    const current = document.getElementById('current-address');
    const other = document.getElementById('other-address');
    const clearBtn = document.querySelector('.clear-btn');

    clearBtn?.addEventListener('click', () => {
      if (current) { current.value = ''; current.focus(); }
    });

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const chosen = (other && other.value && other.value.trim()) ? other.value.trim() : (current?.value || '').trim();
      try { localStorage.setItem('draconis_shipping_address', chosen); } catch {}
      // Ir a Medios de pago después de guardar
      location.href = `${baseToRoot}Paginas/Paginasemergentes/Mediosdepago.html`;
    });
  }

  // --- Página Mi Usuario ---
  function initUserPage() {
    const form = document.getElementById('user-form');
    if (!form) return; // no estamos en Mi usuario

    const emailEl = document.getElementById('user-email');
    const phoneEl = document.getElementById('user-phone');
    const addrEl = document.getElementById('user-address');

    // Prefill desde localStorage
    try {
      const savedEmail = localStorage.getItem('draconis_user_email') || '';
      const savedPhone = localStorage.getItem('draconis_user_phone') || '';
      const savedAddr  = localStorage.getItem('draconis_user_address') || '';
      if (emailEl && savedEmail) emailEl.value = savedEmail;
      if (phoneEl && savedPhone) phoneEl.value = savedPhone;
      if (addrEl && savedAddr) addrEl.value = savedAddr;
    } catch {}

    // Botones de limpiar
    document.querySelectorAll('.clear-btn[data-target]')?.forEach(btn => {
      btn.addEventListener('click', () => {
        const targetId = btn.getAttribute('data-target');
        const input = targetId ? document.getElementById(targetId) : null;
        if (input) { input.value = ''; input.focus(); }
      });
    });

    // Guardar
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = emailEl?.value?.trim() || '';
      const phone = phoneEl?.value?.trim() || '';
      const addr  = addrEl?.value?.trim() || '';
      try {
        localStorage.setItem('draconis_user_email', email);
        localStorage.setItem('draconis_user_phone', phone);
        localStorage.setItem('draconis_user_address', addr);
        // También sincronizar como dirección de envío por defecto
        if (addr) localStorage.setItem('draconis_shipping_address', addr);
      } catch {}
      alert('Datos guardados.');
    });
  }

  // --- Página Crear Cuenta Formulario ---
  function initCreateAccountFormPage() {
    // Detectar inputs del mock de Crear cuenta
    const inputs = document.querySelectorAll('.form-section .form-input');
    if (!inputs || inputs.length < 3) return; // no estamos en crearcuenta.html

    const emailEl = inputs[0];
    const phoneEl = inputs[1];
    const addrEl  = inputs[2];

    // Prefill
    try {
      const savedEmail = localStorage.getItem('draconis_user_email') || '';
      const savedPhone = localStorage.getItem('draconis_user_phone') || '';
      const savedAddr  = localStorage.getItem('draconis_user_address') || '';
      if (savedEmail) emailEl.value = savedEmail;
      if (savedPhone) phoneEl.value = savedPhone;
      if (savedAddr)  addrEl.value  = savedAddr;
    } catch {}

    // Interceptar los botones que navegan a Miusuario.html para guardar antes de salir
    const userLinks = Array.from(document.querySelectorAll('a[href$="Miusuario.html"]'));
    userLinks.forEach(a => {
      a.addEventListener('click', (e) => {
        e.preventDefault();
        const email = emailEl?.value?.trim() || '';
        const phone = phoneEl?.value?.trim() || '';
        const addr  = addrEl?.value?.trim() || '';
        try {
          localStorage.setItem('draconis_user_email', email);
          localStorage.setItem('draconis_user_phone', phone);
          localStorage.setItem('draconis_user_address', addr);
          if (addr) localStorage.setItem('draconis_shipping_address', addr);
        } catch {}
        location.href = a.getAttribute('href');
      });
    });
  }

  // Ejecutar cuando el DOM esté listo
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      injectHeader();
      injectFooter();
      injectAddToCartButtons();
      initSearch();
      wireBuyButtons();
      updateCartBadge();
      renderCartPage();
      initShippingPage();
      initPaymentPage();
      initLoginPage();
      initUserPage();
      initCreateAccountPage();
      initSearchResultsPage();
      console.log('[Draconis] Header y footer inyectados (DOMContentLoaded).');
    });
  } else {
    injectHeader();
    injectFooter();
    injectAddToCartButtons();
    initSearch();
    wireBuyButtons();
    updateCartBadge();
    renderCartPage();
    initShippingPage();
    initPaymentPage();
    initLoginPage();
    initUserPage();
    initCreateAccountPage();
    initSearchResultsPage();
    console.log('[Draconis] Header y footer inyectados (carga inmediata).');
  }
})();

// cambios Nicol 19 de noviembre

// =======================
//   SISTEMA DE COOKIES
// =======================

const COOKIE_KEY = "draconis_cookie_consent";

function showCookieModal() {
  const modal = document.getElementById("cookie-modal");
  if (!modal) return;
  modal.style.display = "flex";
}

function hideCookieModal() {
  const modal = document.getElementById("cookie-modal");
  if (!modal) return;
  modal.style.display = "none";
}

function initCookieSystem() {
  const consent = localStorage.getItem(COOKIE_KEY);

  // Si el usuario ya decidió, no mostrar nada
  if (consent === "accepted" || consent === "rejected") return;

  // Mostrar ventana
  showCookieModal();

  document.getElementById("cookie-accept").addEventListener("click", () => {
    localStorage.setItem(COOKIE_KEY, "accepted");
    hideCookieModal();

    console.log("Cookies activadas");
    // aquí puedes activar cosas como Google Analytics si lo usas
  });

  document.getElementById("cookie-reject").addEventListener("click", () => {
    localStorage.setItem(COOKIE_KEY, "rejected");
    hideCookieModal();

    console.log("Cookies rechazadas");
  });
}

document.addEventListener("DOMContentLoaded", initCookieSystem);

