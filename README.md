
# 🍳 Mi Chef - Rotisería Familiar

Repositorio de "Mi Chef". 
Sitio web de una rotisería familiar fictica ubicada en Merlo, Buenos Aires, fundada en el año 2012. El proyecto fue diseñado y desarrollado con un enfoque moderno, priorizando la experiencia de usuario (UX) en dispositivos móviles y una navegación rápida y fluida.

---

## 🚀 Características del Proyecto

* **Arquitectura Multi-página:** Contenido modularizado para una navegación organizada.
* **Diseño Mobile-First & Responsivo:** Adaptación fluida en computadoras, tablets y celulares.
* **Menú Hamburguesa Optimizado:** Interfaz móvil ultralimpia, sin barras de scroll visuales molestas y con despliegue inteligente de categorías.
* **Integración con WhatsApp:** Botón flotante permanente y conversión de pedidos directos desde las tarjetas de menú o el formulario de contacto.
* **Animaciones de Revelado:** Efectos visuales profesionales y contadores estadísticos animados al hacer scroll utilizando *Intersection Observer*.
* **Rendimiento y Optimización:** Imágenes de carga diferida (*Lazy Loading*) y formatos modernos de alta compresión (`.webp`).

---

## 📁 Estructura del Sitio Web

El sitio está compuesto por los siguientes archivos y secciones principales:

* **`index.html` (Home):** Pantalla de bienvenida (Hero), sección histórica "Nuestra Historia", banner de estadísticas de la marca y accesos directos al menú.
* **`platos.html` (Especialidades):** Página exclusiva del menú principal que agrupa las categorías de comida: *Pizzas, Empanadas, Milanesas, Pastas Caseras, Carnes, Pollos y Ensaladas*.
* **`extra.html` (Complementos):** Página dedicada a los extras para acompañar la cena: *Bebidas, Salsas y Postres*.
* **`galeria.html` (Visual):** Galería interactiva con filtros dinámicos en tiempo real (*Todos, El Local, Comidas, Extras*) y un visor expandible de imágenes (*Lightbox Modal*).
* **`contacto.html` (Atención):** Horarios de apertura, dirección física en Merlo con mapa interactivo y un formulario validado con JavaScript que envía las consultas directamente a WhatsApp de forma formateada.

---

## 🛠️ Tecnologías Utilizadas

* **HTML5:** Estructuración semántica y accesible para motores de búsqueda (SEO).
* **CSS3:** Estilos personalizados, maquetación moderna mediante CSS Grid y Flexbox, variables globales y transiciones fluidas.
* **JavaScript Vanilla (ES6+):** Programación nativa y modular sin dependencias pesadas (control de navegación entre páginas mediante anclas con *hashes*, validación de formularios y animaciones interactivas).
* **Font Awesome v6:** Biblioteca de iconografía vectorial para los elementos visuales.
* **Google Fonts:** Combinación tipográfica elegante utilizando `'Playfair Display'` para títulos y `'DM Sans'` para el cuerpo de texto.

---

## 🎨 Identidad Visual

El diseño web utiliza una paleta de colores cálida y gastronómica que evoca la sensación de un hogar y comida casera abundante:

| Color | Código Hex | Aplicación |
| :--- | :--- | :--- |
| **Terracota** | `#C45C3A` | Botones principales, detalles destacados y etiquetas secundarias. |
| **Bordó** | `#6B1F1F` | Fondos institucionales, pies de página y textos fuertes. |
| **Crema** | `#FAF5EC` | Fondo general del sitio web para una lectura descansada. |
| **Dorado** | `#D4A843` | Detalles de elegancia, íconos de submenús y resaltados en textos tipográficos. |

---

## 🔧 Estructura de Directorios

```text
├── css/
│   └── style.css       # Hoja de estilos general y reglas responsivas
├── js/
│   └── script.js       # Lógica de interacción, modales, filtros y scroll
├── img/                # Catálogo de imágenes optimizadas en formato .webp
├── index.html          # Página principal (Home)
├── platos.html         # Sección de comidas
├── extra.html          # Sección de bebidas, salsas y postres
├── galeria.html        # Galería de fotos con Lightbox
└── contacto.html       # Formulario y datos del local
