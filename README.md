# Tecnologias-2025-2

## Encriptación y Seguridad en Inicio de Sesión

Para proteger las contraseñas de los usuarios, hemos implementado hashing con SHA-256 usando CryptoJS. Las contraseñas nunca se almacenan en texto plano; en su lugar, se hashean antes de comparar con el hash almacenado (simulado en localStorage para demo).

### Usuario de Prueba
- **Email:** test@example.com
- **Contraseña:** password123

### Configuración HTTPS (Cloudflare-like)
Para transmisión segura de datos (como Cloudflare), configura HTTPS en tu hosting:

1. **Despliegue en Cloudflare Pages:**
   - Sube tu proyecto a un repositorio Git (e.g., GitHub).
   - Ve a [Cloudflare Pages](https://pages.cloudflare.com/), conecta tu repo.
   - Cloudflare Pages habilita HTTPS automáticamente (certificado SSL gratuito).
   - URL: `https://tu-proyecto.pages.dev`

2. **Otros Hosting con SSL:**
   - Usa servicios como Netlify, Vercel, o GitHub Pages (con dominio custom para HTTPS).
   - Para servidores propios: Instala un certificado SSL (Let's Encrypt es gratuito).

3. **Verificación:**
   - Asegúrate de que la URL comience con `https://`.
   - Usa herramientas como [SSL Labs](https://www.ssllabs.com/ssltest/) para verificar la seguridad.

Esto protege la transmisión de contraseñas y otros datos sensibles.
Proyecto pagina web 
