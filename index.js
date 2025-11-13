// Inyecta header (top-bar + header + nav) y footer comunes en todas las páginas
// Detecta si la página está en /Paginas/ para ajustar rutas relativas

(function () {
  const path = location.pathname.replace(/\\/g, '/');
  const isNestedSubpage = /\/Paginas\/Paginasemergentes\//i.test(path);
  const isSubpage = /\/Paginas\//i.test(path);
  const baseToRoot = isNestedSubpage ? '../../' : (isSubpage ? '../' : '');
  const loginPath = `${baseToRoot}Paginas/Paginasemergentes/Miusuario.html`;

  const headerHTML = () => `
    <div class="top-bar">
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
    document.querySelector('.top-bar')?.remove();
    document.querySelector('header')?.remove();
    document.querySelector('nav')?.remove();
    const container = document.createElement('div');
    container.innerHTML = headerHTML();
    document.body.prepend(container);
  }

  function injectFooter() {
    document.querySelector('footer')?.remove();
    document.querySelector('.metodos')?.remove();
    document.querySelector('.footer-bottom')?.remove();
    const container = document.createElement('div');
    container.innerHTML = footerHTML();
    document.body.appendChild(container);
  }

  const CART_KEY = 'draconis_cart_items';
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
  function updateCartBadge() {
    const el = document.getElementById('cart-count');
    if (!el) return;
    const total = getCart().reduce((sum, it) => sum + (it.qty || 1), 0);
    el.textContent = String(total);
  }
  function addToCart(product) {
    const items = getCart();
    const idx = items.findIndex(it => it.name === product.name);
    if (idx >= 0) items[idx].qty += product.qty || 1; else items.push(product);
    setCart(items);
  }

  function injectAddToCartButtons() {
    const buyButtons = document.querySelectorAll('.btn-comprar');
    buyButtons.forEach(btn => {
      const addBtn = document.createElement('button');
      addBtn.className = 'btn-add-cart';
      addBtn.textContent = 'Agregar al carrito';
      addBtn.addEventListener('click', () => {
        const card = btn.closest('.producto, .card, .item, body');
        const name = card.querySelector('h2, h3, .nombre, .titulo')?.textContent?.trim() || document.title;
        const priceText = card.querySelector('.precio, .price, .valor')?.textContent || '0';
        const image = card.querySelector('img')?.src || '';
        const url = location.pathname;
        const price = parseInt(priceText.replace(/[^\d]/g, ''), 10) || 0;
        addToCart({ name, price, image, url, qty: 1 });
        alert('Producto agregado al carrito');
      });
      btn.insertAdjacentElement('afterend', addBtn);
    });
  }

  function init() {
    injectHeader();
    injectFooter();
    updateCartBadge();
    injectAddToCartButtons();
  }

  document.addEventListener('DOMContentLoaded', init);
})();
