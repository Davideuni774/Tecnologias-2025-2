// login-cuenta.js - Maneja el login con AJAX/JSON
document.addEventListener('DOMContentLoaded', () => {
    const IS_GHPAGES = /github\.io$/i.test(location.hostname);
    const REMOTE_ORIGIN = (typeof window !== 'undefined' && window.BACKEND_ORIGIN) ? String(window.BACKEND_ORIGIN).replace(/\/$/, '') : '';

    // Helper: Mostrar un toast no modal en la esquina superior derecha
    function showToast(message, type = 'info') {
        const existing = document.getElementById('site-toast');
        if (existing) existing.remove();
        const toast = document.createElement('div');
        toast.id = 'site-toast';
        toast.textContent = message;
        toast.style.position = 'fixed';
        toast.style.top = '16px';
        toast.style.right = '16px';
        toast.style.background = type === 'success' ? '#2ecc71' : (type === 'error' ? '#e74c3c' : '#333');
        toast.style.color = '#fff';
        toast.style.padding = '10px 14px';
        toast.style.borderRadius = '8px';
        toast.style.boxShadow = '0 6px 18px rgba(0,0,0,0.2)';
        toast.style.zIndex = 99999;
        toast.style.fontFamily = 'Arial, sans-serif';
        toast.style.fontSize = '14px';
        document.body.appendChild(toast);
        setTimeout(() => {
            toast.style.transition = 'opacity 300ms ease';
            toast.style.opacity = '0';
            setTimeout(() => toast.remove(), 350);
        }, 3000);
    }

    const formulario = document.getElementById('form-login');
    const submitBtn = formulario ? formulario.querySelector('button[type="submit"]') : null;

    if (!formulario) {
        console.error('❌ No se encontró el formulario de login');
        return;
    }

    console.log('✅ Formulario de login encontrado, escuchando submit...');

    // Aviso en GH Pages
    if (IS_GHPAGES && !REMOTE_ORIGIN) {
        const note = document.createElement('div');
        note.textContent = 'Inicio de sesión deshabilitado en GitHub Pages (requiere backend PHP). Prueba en tu servidor XAMPP o hosting.';
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
            showToast('Esta acción requiere backend. Prueba en XAMPP o hosting con PHP.', 'error');
            return;
        }

        const formData = new FormData(formulario);
        const dataObjeto = {};
        for (const [k, v] of formData.entries()) {
            dataObjeto[k] = v;
        }

        console.log('🔐 Enviando datos de login:', {
            correo: dataObjeto.correo || '(vacío)',
            clave: dataObjeto.clave ? '🔒 [ENCRIPTADA]' : '(vacío)'
        });

        function sendPayload(payload) {
            try {
                if (submitBtn) {
                    submitBtn.disabled = true;
                    submitBtn.dataset.origText = submitBtn.textContent;
                    submitBtn.textContent = 'Iniciando sesión...';
                }

                const xhr = new XMLHttpRequest();
                const base = REMOTE_ORIGIN ? (REMOTE_ORIGIN + '/api/post') : '../../api/post';
                xhr.open('POST', base + "/login-cuenta.php", true);
                if (REMOTE_ORIGIN) {
                    xhr.withCredentials = true;
                }
                xhr.timeout = 15000;
                xhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');

                xhr.onload = function () {
                    if (xhr.status === 200) {
                        let msg = 'Inicio de sesión exitoso.';
                        try {
                            const json = JSON.parse(xhr.responseText);
                            console.log('✅ Respuesta servidor:', json);
                            if (json && json.message) msg = json.message;

                            if (json && json.success) {
                                console.log('✅ Éxito:', msg);

                                try { showToast(msg, 'success'); } catch (e) {}

                                /*
                                 * BLOQUE NUEVO:
                                 * Redirigir de vuelta a la página donde el usuario estaba
                                 * (por ejemplo carrito o checkout).
                                 */
                                try {
                                    const prev = sessionStorage.getItem('redirect_after_login');
                                    if (prev) {
                                        sessionStorage.removeItem('redirect_after_login');
                                        console.log('🔁 Volviendo automáticamente a:', prev);
                                        window.location.href = prev;
                                        return;
                                    }
                                } catch (e) {
                                    console.warn('⚠️ No se pudo manejar redirect_after_login', e);
                                }

                                // Si no venía de pago, solo recargar la página actual
                                setTimeout(() => location.reload(), 300);
                            } else {
                                console.warn('⚠️ Login no exitoso:', msg);
                                try { showToast(msg, 'error'); } catch (e) {}
                            }

                        } catch (e) {
                            console.log('Respuesta servidor (no JSON):', xhr.responseText);
                        }
                    } else {
                        console.error('❌ Error:', xhr.status, xhr.statusText);
                    }
                };

                xhr.onreadystatechange = function () {
                    if (xhr.readyState === 4) {
                        if (submitBtn) {
                            submitBtn.disabled = false;
                            submitBtn.textContent = submitBtn.dataset.origText || 'Continuar';
                        }
                    }
                };

                xhr.onerror = function () {
                    console.error('❌ Network error al enviar - Verifica conexión');
                };

                xhr.ontimeout = function () {
                    console.error('❌ Timeout - Servidor no respondió a tiempo');
                };

                xhr.send(JSON.stringify(payload));
            } catch (err) {
                console.error('❌ Exception al enviar payload:', err);
                if (submitBtn) { submitBtn.disabled = false; submitBtn.textContent = submitBtn.dataset.origText || 'Continuar'; }
            }
        }

        sendPayload(dataObjeto);
    });
});
