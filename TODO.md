# TODO: Implementar Encriptación en Inicio de Sesión y Configuración HTTPS

## Información Recopilada
- Página de login: `Paginas/Paginasemergentes/iniciosesion.html` ya tiene input de tipo password, pero sin encriptación real.
- Código JS: `index.js` maneja el login simulado en `initLoginPage()`.
- Necesidad: Encriptar contraseñas con hashing (SHA-256) para evitar texto plano, y configurar HTTPS para transmisión segura (como Cloudflare).

## Plan
- Agregar CryptoJS (librería para hashing) vía CDN en `iniciosesion.html`.
- Modificar `index.js` para hashear la contraseña en `initLoginPage()`, comparar con hash predefinido de usuario dummy, y simular login exitoso.
- Agregar instrucciones para configurar HTTPS/Cloudflare en README.md o un archivo separado.

## Archivos a Editar
- `Paginas/Paginasemergentes/iniciosesion.html`: Incluir script de CryptoJS.
- `index.js`: Actualizar `initLoginPage()` para hashing y verificación.
- `README.md`: Agregar sección sobre despliegue con HTTPS.

## Pasos de Seguimiento
- Probar el login con contraseña correcta (dummy: email "test@example.com", password "password123").
- Verificar que la contraseña no se vea en consola o localStorage.
- Configurar HTTPS en hosting (e.g., Cloudflare Pages para SSL automático).
- Desplegar y probar en producción.

## Próximos Pasos
1. Editar `iniciosesion.html` para agregar CryptoJS.
2. Editar `index.js` para implementar hashing en login.
3. Actualizar README.md con instrucciones HTTPS.
4. Probar funcionalidad.
5. Desplegar con HTTPS.
