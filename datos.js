// datos.js — mejora: espera DOMContentLoaded y valida selectores
document.addEventListener('DOMContentLoaded', () => {
    const formulario = document.getElementById('formulario');
    const imagenInput = document.getElementById('imagen');
    const preview = document.getElementById('preview');
    const respEl = document.getElementById('respuesta');
    const submitBtn = formulario ? formulario.querySelector('button[type="submit"]') : null;

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
                xhr.open('POST', "../../api/post/registro.php", true);
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