// registro-cuenta.js - Maneja el registro de cuentas con AJAX/JSON

// Capturar la URL del script actual para determinar la raíz del sitio de forma robusta
const _currentScriptSrc = document.currentScript ? document.currentScript.src : '';

document.addEventListener('DOMContentLoaded', () => {
    const IS_GHPAGES = /github\.io$/i.test(location.hostname);
    
    // Calcular SITE_ROOT basado en la ubicación de este script (que está en la raíz)
    let SITE_ROOT = '';
    if (_currentScriptSrc) {
        const match = _currentScriptSrc.match(/^(.*\/)registro-cuenta\.js(\?.*)?$/i);
        if (match) SITE_ROOT = match[1];
    }
    // Fallback
    if (!SITE_ROOT) {
        const path = window.location.pathname.toLowerCase();
        if (path.includes('/paginas/paginasemergentes/')) SITE_ROOT = '../../';
        else if (path.includes('/paginas/')) SITE_ROOT = '../';
    }

    const REMOTE_ORIGIN = (typeof window !== 'undefined' && window.BACKEND_ORIGIN) ? String(window.BACKEND_ORIGIN).replace(/\/$/, '') : '';
    const formulario = document.getElementById('form-registro');
    const respEl = document.getElementById('respuesta-registro');
    const submitBtn = formulario ? formulario.querySelector('button[type="submit"]') : null;

    if (!formulario) {
        console.error('❌ No se encontró el formulario de registro');
        return;
    }

    console.log('✅ Formulario de registro encontrado, escuchando submit...');

    // Aviso en GH Pages
    if (IS_GHPAGES && !REMOTE_ORIGIN) {
        const note = document.createElement('div');
        note.textContent = 'Registro deshabilitado en GitHub Pages (requiere backend PHP). Prueba en tu servidor XAMPP o hosting.';
        note.style.background = '#fff3cd';
        note.style.color = '#856404';
        note.style.border = '1px solid #ffeeba';
        note.style.padding = '10px 12px';
        note.style.borderRadius = '8px';
        note.style.margin = '10px 0';
        (formulario.parentElement || document.body).insertBefore(note, formulario);
    }

    formulario.addEventListener('submit', (evento) => {
        evento.preventDefault();

        if (IS_GHPAGES && !REMOTE_ORIGIN) {
            if (respEl) {
                respEl.textContent = 'Esta acción requiere backend. Prueba en XAMPP o hosting con PHP.';
                respEl.classList.remove('success');
                respEl.classList.add('error');
            }
            return;
        }

        const formData = new FormData(formulario);
        const dataObjeto = {};
        for (const [k, v] of formData.entries()) {
            dataObjeto[k] = v;
        }

        console.log('📤 Enviando datos de registro:', {
            nombre: dataObjeto.nombre || '(vacío)',
            correo: dataObjeto.correo || '(vacío)',
            telefono: dataObjeto.telefono || '(vacío)',
            clave: dataObjeto.clave ? '🔒 [ENCRIPTADA]' : '(vacío)',
            confirmar_clave: dataObjeto.confirmar_clave ? '🔒 [ENCRIPTADA]' : '(vacío)'
        });
        
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('📋 CONFIRMACIÓN DE DATOS A ENVIAR:');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('👤 Nombre:', dataObjeto.nombre);
        console.log('📧 Correo:', dataObjeto.correo);
        console.log('📞 Teléfono:', dataObjeto.telefono || '(no proporcionado)');
        console.log('🔐 Contraseña:', '●●●●●●●● (protegida)');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('🚀 Enviando al servidor...');

        // Validación cliente: asegurar que las contraseñas coincidan antes de enviar
        if ((dataObjeto.clave || '') !== (dataObjeto.confirmar_clave || '')) {
            const msg = 'Las contraseñas no coinciden.';
            console.error('❌ Validación cliente:', msg);
            if (respEl) {
                respEl.textContent = msg;
                respEl.classList.remove('success');
                respEl.classList.add('error');
            }
            return; // evitar enviar al servidor
        }

        function sendPayload(payload) {
            try {
                if (submitBtn) {
                    submitBtn.disabled = true;
                    submitBtn.dataset.origText = submitBtn.textContent;
                    submitBtn.textContent = 'Creando cuenta...';
                }

                const xhr = new XMLHttpRequest();
                const base = REMOTE_ORIGIN ? (REMOTE_ORIGIN + '/api/post') : (SITE_ROOT + 'api/post');
                xhr.open('POST', base + "/registro-cuenta.php", true);
                if (REMOTE_ORIGIN) {
                    xhr.withCredentials = true; // permitir cookies/sesión entre dominios
                }
                xhr.timeout = 15000;
                xhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');

                xhr.onload = function () {
                    if (xhr.status === 200) {
                        let msg = 'Cuenta creada exitosamente.';
                        try {
                            const json = JSON.parse(xhr.responseText);
                            console.log('✅ Respuesta servidor:', json);
                            if (json && json.message) msg = json.message;
                            if (json && json.success) {
                                console.log('✅ Éxito:', msg);
                                console.log('ℹ️ No se realizará redirección automática. Mantén la página abierta para revisar la consola.');
                            } else {
                                console.warn('⚠️ Registro no exitoso:', msg);
                            }
                        } catch (e) {
                            if (xhr.responseText && xhr.responseText.trim()) msg = xhr.responseText.trim();
                            console.log('✅ Respuesta servidor (no JSON):', msg);
                        }
                        console.log('Respuesta completa:', xhr.responseText);
                    } else {
                        console.error('❌ Error:', xhr.status, xhr.statusText);
                        let serverMsg = 'Error en el registro.';
                        try {
                            if (xhr.responseText) {
                                const jsonErr = JSON.parse(xhr.responseText);
                                if (jsonErr && (jsonErr.message || jsonErr.mensaje)) serverMsg = jsonErr.message || jsonErr.mensaje;
                                else serverMsg = xhr.responseText;
                            }
                        } catch (e) {
                            if (xhr.responseText && xhr.responseText.trim()) serverMsg = xhr.responseText.trim();
                        }
                        console.error('❌ Error del servidor:', serverMsg);
                        console.error('Detalle respuesta servidor:', xhr.responseText);
                    }
                };

                xhr.onerror = function () {
                    console.error('❌ Network error al enviar - Verifica tu conexión');
                };

                xhr.ontimeout = function () {
                    console.error('❌ Timeout al enviar - El servidor no respondió a tiempo');
                };

                xhr.onreadystatechange = function () {
                    if (xhr.readyState === 4) {
                        if (submitBtn) {
                            submitBtn.disabled = false;
                            submitBtn.textContent = submitBtn.dataset.origText || 'Crear cuenta';
                        }
                    }
                };

                xhr.send(JSON.stringify(payload));
            } catch (err) {
                console.error('❌ Exception al enviar payload:', err);
                if (submitBtn) { submitBtn.disabled = false; submitBtn.textContent = submitBtn.dataset.origText || 'Crear cuenta'; }
            }
        }

        sendPayload(dataObjeto);
    });
});
