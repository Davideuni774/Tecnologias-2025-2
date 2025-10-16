// Inyecta header (top-bar + header + nav) y footer comunes en todas las páginas
// Detecta si la página está en /Paginas/ para ajustar rutas relativas

(function () {
  // Determinar base relativa hasta la raíz, contemplando subcarpetas
  const path = location.pathname.replace(/\\/g, '/');
  const isNestedSubpage = /\/Paginas\/Paginasemergentes\//i.test(path);
  const isSubpage = /\/Paginas\//i.test(path);
  const baseToRoot = isNestedSubpage ? '../../' : (isSubpage ? '../' : '');
  const loginPath = `${baseToRoot}Paginas/iniciosesion.html`;

  const headerHTML = () => `
    <div class="top-bar">
      <span class="envios">Envíos a toda Colombia</span>
      <span>Mis pedidos</span>
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
      <a href="#">Lo último</a>
      <div class="dropdown">
        <a href="#" class="drop-toggle">Funkos</a>
        <div class="dropdown-menu">
          <a href="#">De temporada</a>
          <a href="#">Clásicos</a>
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
        <span>$${unit.toLocaleString()}</span>
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
      alert('Gracias por tu compra (demo).');
    });
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

  // Ejecutar cuando el DOM esté listo
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      injectHeader();
      injectFooter();
      injectAddToCartButtons();
      updateCartBadge();
      renderCartPage();
      console.log('[Draconis] Header y footer inyectados (DOMContentLoaded).');
    });
  } else {
    injectHeader();
    injectFooter();
    injectAddToCartButtons();
    updateCartBadge();
    renderCartPage();
    console.log('[Draconis] Header y footer inyectados (carga inmediata).');
  }
})();
