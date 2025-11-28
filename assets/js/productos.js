// assets/js/productos.js
// Utilidades para crear y listar productos y renderizarlos por categoría.

// Detectar si estamos en GitHub Pages (servidor estático sin PHP)
const IS_GHPAGES = /github\.io$/i.test(location.hostname);

// Detección robusta de la raíz del sitio basada en la ubicación de este script (assets/js/productos.js)
// Esto funciona perfecto en InfinityFree sin importar la URL del navegador.
let SITE_ROOT = '';
try {
    const scriptUrl = document.currentScript ? document.currentScript.src : '';
    // Buscamos la parte de la URL antes de 'assets/js/productos.js'
    const match = scriptUrl.match(/^(.*\/)assets\/js\/productos\.js(\?.*)?$/i);
    if (match) {
        SITE_ROOT = match[1]; // Ej: "https://tusitio.infinityfreeapp.com/"
    } else {
        // Fallback por si el script se llama diferente o algo falla
        const path = window.location.pathname.toLowerCase();
        if (path.includes('/paginas/paginasemergentes/')) SITE_ROOT = '../../';
        else if (path.includes('/paginas/')) SITE_ROOT = '../';
    }
} catch (e) { console.error('Error detectando root:', e); }

// Permitir configurar un backend remoto (e.g., hosting con PHP): define window.BACKEND_ORIGIN = 'https://tu-dominio.com'
const REMOTE_ORIGIN = (typeof window !== 'undefined' && window.BACKEND_ORIGIN) ? String(window.BACKEND_ORIGIN).replace(/\/$/, '') : '';
// Usar API remota si está definida; si no, usa ruta calculada
const API_BASE = REMOTE_ORIGIN ? (REMOTE_ORIGIN + '/api/post') : (SITE_ROOT + 'api/post');
// Fallback estático para GitHub Pages cuando NO hay backend remoto
const ENDPOINT_LISTAR_STATIC = SITE_ROOT + 'Datos/productos.json';
const ENDPOINT_LISTAR = API_BASE + '/listar-productos.php';
const ENDPOINT_REGISTRO = API_BASE + '/registro.php';

/**
 * Convierte un File a cadena base64 (dataURL)
 * @param {File} file
 * @returns {Promise<string>}
 */
function fileToBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = e => resolve(e.target.result);
        reader.onerror = err => reject(err);
        reader.readAsDataURL(file);
    });
}

/**
 * Crea un producto en el backend.
 * @param {Object} data { nombre, precio, categoria, stock, imagenFile }
 * @returns {Promise<Object>} respuesta JSON
 */
async function crearProducto(data) {
    if (IS_GHPAGES && !REMOTE_ORIGIN) {
        throw new Error('Crear producto no está disponible en GitHub Pages (no hay PHP). Usa tu servidor XAMPP/hosting con PHP.');
    }
    const {
        nombre = '',
        precio = 0,
        categoria = '',
        stock = null,
        imagenFile = null
    } = data;

    let imagenBase64 = '';
    if (imagenFile instanceof File) {
        imagenBase64 = await fileToBase64(imagenFile);
    }

    const payload = {
        producto: nombre,
        precio: parseFloat(precio) || 0,
        categoria,
        stock: stock !== null ? parseInt(stock, 10) : null,
        imagen: imagenBase64
    };

    const res = await fetch(ENDPOINT_REGISTRO + '?t=' + Date.now(), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    });
    const json = await res.json().catch(() => ({ success: false, message: 'JSON inválido' }));
    if (!res.ok || !json.success) {
        throw new Error(json.message || 'Error creando producto');
    }
    return json; // { success, message, id }
}

/**
 * Obtiene todos los productos.
 * @returns {Promise<Array>} lista de productos
 */
async function listarProductos() {
    // Si estamos en GitHub Pages sin backend remoto, ir al JSON estático
    if (IS_GHPAGES && !REMOTE_ORIGIN) {
        const res = await fetch(ENDPOINT_LISTAR_STATIC + '?t=' + Date.now());
        if (!res.ok) throw new Error('No se pudo cargar Datos/productos.json');
        const data = await res.json();
            // Normalizar posibles formatos: arreglo plano, {data:[...]}, o {categorias:[{nombre, Productos:{...}}]}
            let items = [];
            if (Array.isArray(data)) {
                items = data;
            } else if (Array.isArray(data?.data)) {
                items = data.data;
            } else if (Array.isArray(data?.categorias)) {
                data.categorias.forEach(cat => {
                    const catName = (cat?.nombre || '').toString();
                    const productosObj = cat?.Productos || {};
                    Object.values(productosObj).forEach(p => {
                        items.push({
                            nombre: p?.nombre || '',
                            precio: p?.precio,
                            stock: p?.stock ?? null,
                            imagen: p?.imagen || '',
                            categoria: catName
                        });
                    });
                });
            }
            return items.map(n => ({
                id: n.id ?? 0,
                nombre: n.nombre,
                precio: Number((n.precio ?? 0)) || 0,
                stock: n.stock ?? null,
                referencia: n.referencia ?? '',
                imagen: n.imagen ? (SITE_ROOT + n.imagen) : (n.imagenNombre ? (SITE_ROOT + 'imagenes/' + n.imagenNombre) : ''),
                categoria: n.categoria || ''
            }));
    }
    // En servidor con PHP (local o remoto)
    try {
        const res = await fetch(ENDPOINT_LISTAR + '?t=' + Date.now());
        const json = await res.json().catch(() => ({ success: false }));
        if (!json.success) throw new Error(json.message || 'Error listando productos');
        return json.data.map(n => ({
            ...n,
            imagen: n.imagen ? (SITE_ROOT + n.imagen) : ''
        }));
    } catch (e) {
        // Fallback: intentar JSON estático si el endpoint PHP falla (útil en GH Pages sin backend)
        const res2 = await fetch(ENDPOINT_LISTAR_STATIC + '?t=' + Date.now());
        if (!res2.ok) throw e;
        const data = await res2.json();
            let items = [];
            if (Array.isArray(data)) {
                items = data;
            } else if (Array.isArray(data?.data)) {
                items = data.data;
            } else if (Array.isArray(data?.categorias)) {
                data.categorias.forEach(cat => {
                    const catName = (cat?.nombre || '').toString();
                    const productosObj = cat?.Productos || {};
                    Object.values(productosObj).forEach(p => {
                        items.push({
                            nombre: p?.nombre || '',
                            precio: p?.precio,
                            stock: p?.stock ?? null,
                            imagen: p?.imagen || '',
                            categoria: catName
                        });
                    });
                });
            }
            return items.map(n => ({
                id: n.id ?? 0,
                nombre: n.nombre,
                precio: Number((n.precio ?? 0)) || 0,
                stock: n.stock ?? null,
                referencia: n.referencia ?? '',
                imagen: n.imagen || (n.imagenNombre ? ('imagenes/' + n.imagenNombre) : ''),
                categoria: n.categoria || ''
            }));
    }
}

/**
 * Filtra productos por categoría exacta (case-insensitive trim).
 * @param {Array} productos
 * @param {String} categoria
 */
function filtrarPorCategoria(productos, categoria) {
    if (!categoria) return productos;
    const catNorm = categoria.trim().toLowerCase();
    return productos.filter(p => (p.categoria || '').trim().toLowerCase() === catNorm);
}

/**
 * Renderiza productos en un contenedor.
 * @param {HTMLElement} container
 * @param {Array} productos
 * @param {Object} opts { mostrarStock, placeholderImg }
 */
function renderizarProductos(container, productos, opts = {}) {
    const { mostrarStock = false, placeholderImg = 'https://via.placeholder.com/300x300?text=Producto' } = opts;
    if (!container) return;
    container.innerHTML = '';
    if (!productos.length) {
        container.innerHTML = '<p>No hay productos en esta categoría.</p>';
        return;
    }
    const fragment = document.createDocumentFragment();
    productos.forEach(p => {
        const card = document.createElement('div');
        card.className = 'producto-card';
        card.innerHTML = `
            <div class="producto-img">
              <img src="${p.imagen || placeholderImg}" alt="${escapeHtml(p.nombre)}" loading="lazy" />
            </div>
            <div class="producto-info">
              <h3>${escapeHtml(p.nombre)}</h3>
              <p class="precio">$${Number(p.precio).toFixed(2)}</p>
              ${mostrarStock && p.stock !== null ? `<p class="stock">Stock: ${p.stock}</p>` : ''}
            </div>
        `;
        fragment.appendChild(card);
    });
    container.appendChild(fragment);
}

/** Escapa HTML simple para evitar inyecciones en nombres */
function escapeHtml(str) {
    return String(str).replace(/[&<>"]/g, s => ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;' }[s]));
}

// Inicializador para una página de categoría
// Llamar: initCategoriaPage('Figuras', '#contenedorProductos');
async function initCategoriaPage(categoria, selectorContenedor, opciones = {}) {
    const cont = document.querySelector(selectorContenedor);
    if (!cont) return;
    try {
        const todos = await listarProductos();
        const filtrados = filtrarPorCategoria(todos, categoria);
        renderizarProductos(cont, filtrados, opciones);
    } catch (e) {
        cont.innerHTML = '<p>Error cargando productos: ' + e.message + '</p>';
    }
}

// Manejador estándar para un formulario de creación
// formSelector: '#formCrearProducto'
function attachCrearProductoHandler(formSelector, refreshCallback) {
    const form = document.querySelector(formSelector);
    if (!form) return;
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        if (IS_GHPAGES) {
            alert('Crear producto no está disponible en GitHub Pages. Prueba en tu servidor local (XAMPP) o hosting con PHP.');
            return;
        }
        const fd = new FormData(form);
        const nombre = fd.get('nombre');
        const precio = fd.get('precio');
        const categoria = fd.get('categoria');
        const stock = fd.get('stock');
        const imagenFile = fd.get('imagen');
        const btn = form.querySelector('[type=submit]');
        if (btn) btn.disabled = true;
        try {
            await crearProducto({ nombre, precio, categoria, stock, imagenFile });
            // Limpiar y refrescar listado
            form.reset();
            if (typeof refreshCallback === 'function') refreshCallback();
        } catch (err) {
            alert('Error: ' + err.message);
        } finally {
            if (btn) btn.disabled = false;
        }
    });
}

// Exportar a window para uso rápido sin bundler
window.ProductosAPI = {
    crearProducto,
    listarProductos,
    filtrarPorCategoria,
    renderizarProductos,
    initCategoriaPage,
    attachCrearProductoHandler
};
