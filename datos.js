// datos.js — mejora: espera DOMContentLoaded y valida selectores
document.addEventListener('DOMContentLoaded', () => {
    // Detectar raíz del sitio para construir rutas absolutas
    let SITE_ROOT = '';
    try {
        // Buscar el script datos.js en el DOM para obtener su src
        const scripts = document.querySelectorAll('script');
        let scriptUrl = '';
        scripts.forEach(s => {
            if (s.src && s.src.includes('datos.js')) scriptUrl = s.src;
        });
        
        if (scriptUrl) {
            // Si datos.js está en la raíz, SITE_ROOT es la carpeta que lo contiene
            const match = scriptUrl.match(/^(.*\/)datos\.js(\?.*)?$/i);
            if (match) SITE_ROOT = match[1];
        } else {
            // Fallback relativo si no se encuentra el script
            SITE_ROOT = '../../'; 
        }
    } catch (e) { console.error('Error detectando root:', e); SITE_ROOT = '../../'; }

    const API_LISTAR = SITE_ROOT + 'api/post/listar-productos.php';
    const API_REGISTRO = SITE_ROOT + 'api/post/registro.php';

    const formulario = document.getElementById('formulario');
    const imagenInput = document.getElementById('imagen');
    const preview = document.getElementById('preview');
    const respEl = document.getElementById('respuesta');
    const submitBtn = formulario ? formulario.querySelector('button[type="submit"]') : null;
    const listaProductos = document.getElementById('productos');

    function renderProducto(p) {
        if (!listaProductos) return;
        const li = document.createElement('li');
        li.style.border = '1px solid #ccc';
        li.style.padding = '8px';
        li.style.marginBottom = '6px';
        // Ajustar ruta de imagen si es relativa
        let imgUrl = p.imagen;
        if (imgUrl && !imgUrl.startsWith('http') && !imgUrl.startsWith('data:')) {
            imgUrl = SITE_ROOT + imgUrl;
        }

        li.innerHTML = `
            <strong>${p.nombre}</strong><br>
            <span>Precio: ${p.precio}</span><br>
            <span>Stock: ${p.stock !== null && p.stock !== undefined ? p.stock : (p.referencia || '-')}</span><br>
            <span>Categoría: ${p.categoria || '-'}</span><br>
            ${imgUrl ? `<img src="${imgUrl}" alt="${p.nombre}" style="max-width:120px;display:block;margin-top:4px;">` : ''}
        `;
        listaProductos.appendChild(li);
    }

    function cargarProductos() {
        if (!listaProductos) return;
        fetch(API_LISTAR)
            .then(r => {
                if (!r.ok) throw new Error('Error HTTP ' + r.status);
                return r.json();
            })
            .then(json => {
                if (!json.success) {
                    console.warn('No se pudo cargar productos:', json.message);
                    return;
                }
                listaProductos.innerHTML = '';
                json.data.forEach(renderProducto);
            })
            .catch(err => console.error('Error cargando productos:', err));
    }

    // Cargar productos al entrar a la página del formulario
    cargarProductos();

    if (!formulario) return; // nada que hacer si no hay form

    formulario.addEventListener('submit', (evento) => {
        evento.preventDefault();

        const formData = new FormData(formulario);
        // Convert FormData entries to plain object (non-file fields)
        const dataObjeto = {};
        for (const [k, v] of formData.entries()) {
            // skip file input here; we will handle it separately
            if (k === 'imagen') continue;
            dataObjeto[k] = v;
        }

        function sendPayload(payload) {
                // Log payload summary for debugging
                try {
                    console.log('Enviando producto:', {
                        producto: payload.producto || '(sin nombre)',
                        precio: payload.precio || '(sin precio)',
                        stock: payload.stock || '(sin stock)',
                        categoria: payload.categoria || '(sin categoria)'
                    });
                } catch (e) { console.log('Error al loggear payload', e); }
            // Envía JSON al backend (actualizar si tu API requiere multipart/form-data)
            try {
                if (submitBtn) {
                    submitBtn.disabled = true;
                    submitBtn.dataset.origText = submitBtn.textContent;
                    submitBtn.textContent = 'Enviando...';
                }
                if (respEl) {
                    respEl.style.color = '';
                    respEl.textContent = 'Enviando...';
                }

                const xhr = new XMLHttpRequest();
                xhr.open('POST', API_REGISTRO, true);
                xhr.timeout = 15000; // 15s
                xhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');

                xhr.onload = function () {
                    if (xhr.status === 200) {
                        // éxito
                        let msg = 'Envío exitoso.';
                        try {
                            // si el backend devuelve JSON con mensaje, lo mostramos
                            const json = JSON.parse(xhr.responseText);
                            if (json && json.message) msg = json.message;
                        } catch (e) {
                            // no JSON — usar texto crudo
                            if (xhr.responseText && xhr.responseText.trim()) msg = xhr.responseText.trim();
                        }
                        console.log('Éxito:', xhr.responseText);
                        // Log sent payload and server response
                        try { console.log('Datos enviados (payload):', payload); } catch (e) {}
                        try { console.log('Respuesta servidor:', xhr.responseText); } catch (e) {}
                        if (respEl) { respEl.style.color = 'green'; respEl.textContent = msg; }
                        // limpiar formulario y preview (opcional)
                        try { formulario.reset(); } catch (e) {}
                        if (preview) preview.src = '';

                        // Intentar parsear para obtener ID e incorporar nuevo producto sin recargar todo
                        try {
                            const json = JSON.parse(xhr.responseText);
                            // Si la respuesta incluye id, reconstruimos objeto mínimo y lo añadimos
                            if (json && json.success) {
                                const nuevo = {
                                    id: json.id,
                                    nombre: dataObjeto.producto,
                                    precio: parseFloat(dataObjeto.precio) || 0,
                                    stock: dataObjeto.stock ? parseInt(dataObjeto.stock) : null,
                                    referencia: dataObjeto.stock || '',
                                    imagen: dataObjeto.imagen ? '(imagen subida)' : '',
                                    categoria: dataObjeto.categoria || ''
                                };
                                renderProducto(nuevo);
                            }
                        } catch (e) {
                            // Si falla el parse, recargamos la lista completa
                            cargarProductos();
                        }
                    } else {
                        // Mostrar información más útil: intentar parsear JSON de error
                        console.error('Error:', xhr.status, xhr.statusText);
                        let serverMsg = 'Error en el envío (server).';
                        try {
                            if (xhr.responseText) {
                                const jsonErr = JSON.parse(xhr.responseText);
                                if (jsonErr && (jsonErr.message || jsonErr.mensaje)) serverMsg = jsonErr.message || jsonErr.mensaje;
                                else serverMsg = xhr.responseText;
                            }
                        } catch (e) {
                            // no JSON
                            if (xhr.responseText && xhr.responseText.trim()) serverMsg = xhr.responseText.trim();
                        }
                        if (respEl) { respEl.style.color = 'crimson'; respEl.textContent = serverMsg; }
                        try { console.log('Datos enviados (payload) en error:', payload); } catch (e) {}
                        try { console.log('Respuesta servidor (error):', xhr.responseText); } catch (e) {}
                        console.error('Detalle respuesta servidor:', xhr.responseText);
                    }
                };

                xhr.onerror = function () {
                    console.error('Network error al enviar');
                    if (respEl) { respEl.style.color = 'crimson'; respEl.textContent = 'Error de red al enviar.'; }
                };

                xhr.ontimeout = function () {
                    console.error('Timeout al enviar');
                    if (respEl) { respEl.style.color = 'crimson'; respEl.textContent = 'Tiempo de espera agotado.'; }
                };

                xhr.onreadystatechange = function () {
                    if (xhr.readyState === 4) {
                        if (submitBtn) {
                            submitBtn.disabled = false;
                            submitBtn.textContent = submitBtn.dataset.origText || 'Enviar';
                        }
                    }
                };

                xhr.send(JSON.stringify(payload));
            } catch (err) {
                console.error('Exception al enviar payload', err);
                if (respEl) { respEl.style.color = 'crimson'; respEl.textContent = 'Error interno al preparar el envío.'; }
                if (submitBtn) { submitBtn.disabled = false; submitBtn.textContent = submitBtn.dataset.origText || 'Enviar'; }
            }
        }

        // Si hay archivo seleccionado, lo convertimos a base64 y lo añadimos al payload
        if (imagenInput && imagenInput.files && imagenInput.files.length > 0) {
            const file = imagenInput.files[0];
            const reader = new FileReader();
            reader.onload = function (e) {
                dataObjeto.imagen = e.target.result; // base64
                sendPayload(dataObjeto);
            };
            reader.onerror = function (e) {
                console.error('Error leyendo imagen:', e);
                sendPayload(dataObjeto);
            };
            reader.readAsDataURL(file);
        } else {
            sendPayload(dataObjeto);
        }
    });

    // Preview de imagen (si existe)
    if (imagenInput && preview) {
        imagenInput.addEventListener('change', function () {
            const file = this.files && this.files[0];
            if (!file) {
                preview.src = '';
                return;
            }
            const reader = new FileReader();
            reader.onload = function (e) {
                preview.src = e.target.result;
            };
            reader.readAsDataURL(file);
        });
    }
});