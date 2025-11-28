// assets/js/perfil.js - Maneja la carga de datos del perfil
document.addEventListener('DOMContentLoaded', () => {
    const IS_GHPAGES = /github\.io$/i.test(location.hostname);
    
    // Detectar raíz del sitio
    let SITE_ROOT = '';
    try {
        const scripts = document.querySelectorAll('script');
        scripts.forEach(s => {
            if (s.src && s.src.includes('perfil.js')) {
                const match = s.src.match(/^(.*\/)assets\/js\/perfil\.js(\?.*)?$/i);
                if (match) SITE_ROOT = match[1];
            }
        });
        if (!SITE_ROOT) SITE_ROOT = '../../';
    } catch (e) { SITE_ROOT = '../../'; }

    const REMOTE_ORIGIN = (typeof window !== 'undefined' && window.BACKEND_ORIGIN) ? String(window.BACKEND_ORIGIN).replace(/\/$/, '') : '';
    const API_BASE = REMOTE_ORIGIN ? (REMOTE_ORIGIN + '/api/post') : (SITE_ROOT + 'api/post');

    const nombreTitulo = document.getElementById('nombre-titulo');
    const perfilNombre = document.getElementById('perfil-nombre');
    const perfilCorreo = document.getElementById('perfil-correo');
    const perfilTelefono = document.getElementById('perfil-telefono');
    const loadingMsg = document.getElementById('loading-msg');
    const profileContent = document.getElementById('profile-content');
    const btnLogout = document.getElementById('btn-logout');

    console.log('%c[Draconis Profile] Cargando perfil...', 'color: cyan; font-weight: bold;');

    if (IS_GHPAGES && !REMOTE_ORIGIN) {
        loadingMsg.textContent = 'Perfil no disponible en modo estático (GitHub Pages).';
        loadingMsg.style.color = 'orange';
        return;
    }

    // Función para cargar datos
    function cargarPerfil() {
        const xhr = new XMLHttpRequest();
        xhr.open('GET', API_BASE + '/perfil.php', true);
        if (REMOTE_ORIGIN) xhr.withCredentials = true;
        
        xhr.onload = function() {
            if (xhr.status === 200) {
                try {
                    const json = JSON.parse(xhr.responseText);
                    if (json.success) {
                        console.log('%c[Draconis Profile] Datos recibidos:', 'color: green;', json.data);
                        
                        // Llenar datos
                        nombreTitulo.textContent = json.data.nombre.split(' ')[0]; // Primer nombre
                        perfilNombre.textContent = json.data.nombre;
                        perfilCorreo.textContent = json.data.correo;
                        perfilTelefono.textContent = json.data.telefono;

                        // Mostrar contenido
                        loadingMsg.style.display = 'none';
                        profileContent.style.display = 'block';
                    } else {
                        console.warn('[Draconis Profile] Error:', json.message);
                        loadingMsg.textContent = 'Error: ' + json.message;
                        // Si no hay sesión, redirigir al login
                        if (xhr.status === 401 || json.message.includes('sesión')) {
                            window.location.href = 'iniciosesion.html';
                        }
                    }
                } catch (e) {
                    console.error('Error parseando JSON:', e);
                    loadingMsg.textContent = 'Error procesando datos del servidor.';
                }
            } else if (xhr.status === 401) {
                console.warn('[Draconis Profile] No autorizado. Redirigiendo...');
                window.location.href = 'iniciosesion.html';
            } else {
                loadingMsg.textContent = 'Error de conexión con el servidor.';
            }
        };
        
        xhr.onerror = () => { loadingMsg.textContent = 'Error de red.'; };
        xhr.send();
    }

    // Función Logout
    if (btnLogout) {
        btnLogout.addEventListener('click', () => {
            if (confirm('¿Estás seguro de que deseas cerrar sesión?')) {
                // Limpiar inmediatamente para evitar condiciones de carrera
                localStorage.removeItem('draconis_cart_items');
                localStorage.removeItem('draconis_logged_in');
                
                const xhr = new XMLHttpRequest();
                // Añadir parámetro ajax=1 para evitar redirección 302 y obtener JSON
                xhr.open('GET', SITE_ROOT + 'Phps/logout.php?ajax=1', true);
                
                if (REMOTE_ORIGIN) {
                    xhr.open('GET', API_BASE.replace('/api/post', '/Phps/logout.php?ajax=1'), true);
                    xhr.withCredentials = true;
                }
                
                xhr.onload = () => {
                    // Redirigir manualmente tras confirmar logout en servidor
                    window.location.href = '../../index.html';
                };
                
                xhr.onerror = () => {
                    // Fallback si falla la red: redirigir igual
                    window.location.href = '../../index.html';
                };
                
                xhr.send();
            }
        });
    }

    cargarPerfil();
});
