# ARENA NLD 24HS — Landing page

Sitio estático responsive para el gimnasio ARENA NLD 24HS.

## Estructura

- `index.html`: contenido y estructura semántica de la página.
- `css/styles.css`: estilos personalizados y ajustes visuales.
- `js/main.js`: comportamiento del menú móvil, carrusel y año del footer.
- `assets/images/logoNLD.jpg`: logo oficial utilizado en el sitio.

## Cómo verlo

1. Descargá y descomprimí la carpeta del proyecto.
2. Abrí `index.html` en el navegador. Para una experiencia más cercana a producción, podés usar la extensión **Live Server** de Visual Studio Code.
3. El sitio carga Tailwind CSS y las fuentes desde internet, por lo que necesitás conexión para esos recursos.

## Buenas prácticas aplicadas

- Separación de HTML, CSS y JavaScript.
- Comentarios en los archivos para explicar responsabilidades.
- Imágenes con texto alternativo y carga diferida en la galería.
- Navegación con etiquetas semánticas y estados accesibles en el menú.
- Respeto por la preferencia de movimiento reducido del sistema.

## Antes de publicar

- Reemplazar el teléfono de ejemplo `+54 11 0000-0000` y el número de los enlaces `wa.me` por el contacto real.
- Confirmar que el precio, la dirección, los horarios y los testimonios sean correctos y autorizados.
- Revisar los enlaces legales que actualmente son marcadores (`#`).
- Para producción, conviene instalar Tailwind con npm y generar CSS optimizado en lugar de depender del CDN.
