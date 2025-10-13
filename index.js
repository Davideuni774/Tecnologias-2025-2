// Inyecta header (top-bar + header + nav) y footer comunes en todas las páginas
// Detecta si la página está en /Paginas/ para ajustar rutas relativas
//hola xd
(function () {
  const isSubpage = /\/Paginas\//i.test(location.pathname);
  const base = isSubpage ? '../' : '';

  const headerHTML = () => `
    <div class="top-bar">
      <span class="envios">Envíos a toda Colombia</span>
      <span>Mis pedidos</span>
      <span>Mi cuenta</span>
      <img src="https://i.imgur.com/BHiRNHm.png" alt="Usuario" style="height:24px;">
    </div>
    <header>
      <div class="header-left">
        <a href="${base}index.html" aria-label="Ir a inicio - logo">
          <img src="https://i.imgur.com/sUTU3bi.png" alt="Logo Draconis">
        </a>
        <a href="${base}index.html" aria-label="Ir a inicio - texto">
          <img src="https://i.imgur.com/CmZgZpI.png" alt="Draconis Texto">
        </a>
      </div>
      <div class="search-container">
        <img src="https://i.imgur.com/1CvowTj.png" alt="Buscar" style="height:18px;margin-right:8px">
        <input type="search" placeholder="Buscar">
      </div>
      <div class="header-right">
        <img src="https://i.imgur.com/orxdqLp.png" alt="Carrito">
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

  // Ejecutar cuando el DOM esté listo
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      injectHeader();
      injectFooter();
      console.log('[Draconis] Header y footer inyectados (DOMContentLoaded).');
    });
  } else {
    injectHeader();
    injectFooter();
    console.log('[Draconis] Header y footer inyectados (carga inmediata).');
  }
})();
