# UI de MizumeBlog

Referencia rápida de la identidad visual (paleta, hoja de estilo principal) y de los componentes
compartidos del layout (`BlogLayout`, `TopAuthBar`, `HomeFooter`, `SideBarLeft`, `SideBarRight`).


---

## 1. Paleta de colores

Tailwind v4 (config "CSS-first", sin `tailwind.config.js`). Todos los tokens se declaran como
variables CSS en `:root` y se exponen como colores de Tailwind (`bg-primary`, `text-btn-danger`, etc.)
mediante el bloque `@theme`.

### Colores base

| Token | Valor | Uso |
|---|---|---|
| `--pure-color` | `hsl(0, 100%, 100%)` | Blanco puro, base de varios `-foreground` |
| `--primary` | `hsl(23, 40%, 12%)` | Marrón muy oscuro (madera/cuero) — fondo de navbar, sidebars, botones principales |
| `--primary-foreground` | `hsl(48, 75%, 81%)` | Dorado/crema pálido — texto sobre `primary` |
| `--secondary` | `hsl(30, 55%, 30%)` | Marrón medio |
| `--secondary-foreground` | `var(--pure-color)` | Blanco |
| `--tertiary` | `hsl(53, 100%, 35%)` | Amarillo mostaza/dorado saturado |
| `--tertiary-foreground` | `var(--pure-color)` | Blanco |
| `--fourth` | `hsl(40, 12%, 90%)` | Beige muy claro |
| `--fourth-foreground` | `var(--primary-foreground)` | Dorado pálido |

### Paleta de botones principales

| Token | Valor | Uso |
|---|---|---|
| `--btn-primary` | `#F5EDD8` | Crema — fondo botón principal |
| `--btn-primary-foreground` | `hsl(36, 100%, 27%)` | Marrón/ámbar — texto sobre `btn-primary` |
| `--btn-secondary` | `hsl(20, 32%, 13%)` | Marrón muy oscuro |
| `--btn-secondary-foreground` | `hsla(48, 56%, 81%, 0.8)` | Dorado semitransparente |
| `--btn-tertiary` | `var(--pure-color)` | Blanco |
| `--btn-tertiary-foreground` | `hsl(30, 55%, 30%)` | Marrón medio |

### Paleta de botones de acción (semántica)

| Token | Valor | Significado |
|---|---|---|
| `--btn-danger` | `hsl(0, 72%, 55%)` | Rojo — acciones destructivas |
| `--btn-success` | `hsl(142, 100%, 39%)` | Verde — confirmación/éxito |
| `--btn-info` | `hsl(213, 94%, 52%)` | Azul — información/neutral |
| `--btn-warning` | `hsl(250, 68%, 66%)` | Violeta — aviso |
| `--btn-*-foreground` | `var(--pure-color)` | Blanco en los 4 casos |

### Otros

- Fondo global de `body`: imagen `--background-image-blog: url('/IMG/Fondo.jpg')` (`bg-cover bg-center bg-no-repeat bg-fixed`).
- Fuente: `--font-sans: 'Lexend', ui-sans-serif, system-ui, ...`.
- Breakpoint custom: `--breakpoint-lg: 950px` (ojo: sustituye el `lg` de Tailwind por defecto, 950px en vez de 1024px).
- Bloque `.dark` existe pero está vacío/comentado — el modo oscuro **no está implementado todavía**, solo queda el esqueleto heredado del boilerplate (shadcn) comentado como "Colores no usados" (`--background`, `--card`, `--sidebar-*`, etc.).
- Muchos componentes (`TopAuthBar`, `HomeFooter`, `SideBarLeft`, `SideBarRight`) usan además colores hardcodeados fuera de la paleta de tokens (p.ej. `#8c6c44`, `rgb(45,29,13)`, `#2A1B12`, `#C4A484`, `#c9a87c`) — son variaciones de la misma gama marrón/dorado pero no están centralizados como variable. Tenerlo en cuenta si se decide migrar todo a tokens.

**Ruta:** `resources/css/app.css` (bloque `@theme` y `:root`, líneas ~60-180)

---

## 2. Hoja de estilos principal (`app.css`)

Es el único entrypoint CSS global (importado en `resources/js/app.tsx`). Contiene:

- `@import 'tailwindcss'` + `@plugin 'tailwindcss-animate'`.
- El bloque `@theme` que traduce las variables de la sección 1 en utilidades Tailwind (`bg-primary`, `text-btn-primary-foreground`, etc.).
- El bloque `@layer base` de compatibilidad de bordes (Tailwind v4).
- Las **clases compartidas** (con `@apply`) usadas en varios componentes:

### `.title`
```css
.title {
    @apply text-white tracking-tight drop-shadow-[2px_2px_4px_rgba(0,0,0,0.8)]
           [text-shadow:_2px_2px_4px_rgba(0,0,0,0.8),_0_0_10px_rgba(0,0,0,0.5)] truncate;
}
```
Título con sombra doble (drop-shadow + text-shadow) para legibilidad sobre el fondo con imagen. Usado en el logo de `TopAuthBar` ("Mizumeblog") y en encabezados de sección.

### `._btn_secondary`
```css
._btn_secondary {
    @apply cursor-pointer rounded-md bg-[#3B2314] px-4 py-2 text-sm text-[#E8D5A3]
           shadow-sm transition-colors hover:bg-[#6B3F1F];
}
```
Botón secundario con colores hardcodeados (no usa los tokens `--btn-secondary`). Nomenclatura con guion bajo inicial, inconsistente con `.btn-hover-scale`.

### `.btn-hover-scale`
```css
.btn-hover-scale {
    @apply cursor-pointer transition-transform duration-150 hover:scale-105;
}
```
Animación compartida de "crecer al hover". Es la utilidad de interacción más reutilizada del proyecto: aparece en `TopAuthBar`, `SideBarLeft`, `HomeEdition`, `InfoNav`, `PostEdit`, `PostForm`, `PostContent`, `MizumeAdmin`, `library`, `dashboard`.

**Ruta:** `resources/css/app.css` (clases al final del archivo, tras el bloque `:root`)

### CSS Module aparte: `HomeMain.module.css`
No forma parte de `app.css`; es un módulo CSS aislado para el post destacado de portada (`.featuredPost`), con su propio pseudo-elemento `::before` para la imagen de fondo con zoom al hover y breakpoints responsive propios.

**Ruta:** `resources/css/HomeMain.module.css` · consumido por `resources/js/core/home/HomePanelPost.tsx`

---

## 3. Componentes compartidos de layout

### 3.1 `BlogLayout`

Layout raíz que envuelve las páginas del blog. Compone, en este orden: `FlashHandler` (mensajes flash) →
`TopAuthBar` (navegación superior) → `<main>` con `SideBarLeft` (drawer responsive) + `children` (contenido de la página) → `HomeFooter`.

Gestiona el estado local `sidebar` (abierto/cerrado) que pasa como `isOpen`/`onClose` a `SideBarLeft` y como `onToggle` a `TopAuthBar`, para el drawer del menú en móvil.

Props: `children`, `post_id?`, `edit?`, `onEdit?` (estos tres últimos se reenvían a `TopAuthBar` para el modo edición de un post).

**Ruta:** `resources/js/layouts/app/blog-layout.tsx`

---

### 3.2 `TopAuthBar`

Barra de navegación superior, `sticky top-0`, fondo `bg-primary-foreground` (dorado pálido).

- Grid de 3 columnas en desktop (`lg:grid-cols-3`) / flex en móvil: nav izquierda (`WEB_ROUTE`), logo centrado (clase `.title`), acciones de auth a la derecha.
- Los enlaces de navegación llevan un subrayado animado con `group`/`group-hover` (`w-0` → `w-full` en 300ms), color `#8c6c44`.
- El botón "Registrarse" usa `.btn-hover-scale` sobre `bg-primary`/`text-primary-foreground`.
- Si el usuario es `admin` y se pasan `edit`/`onEdit`, muestra un `Switch` (react-switch) con `onColor="#a79101"` / `offColor="#454545"` para alternar el modo edición.
- Si el rol es `admin`/`editor`, muestra botones `AuthButton` (Panel, Edit) con iconos en color `#C8AD7F`.
- Botón hamburguesa (`Menu` de lucide) solo visible en móvil (`lg:hidden`), fondo `bg-primary`, dispara `onToggle` para abrir `SideBarLeft`.

**Ruta:** `resources/js/core/auth/TopAuthBar.tsx`
**Clases compartidas usadas:** `.title` (logo) y `.btn-hover-scale` (botón Registrarse) — ambas definidas en `resources/css/app.css`

---

### 3.3 `HomeFooter`

Footer global, fondo sólido `#0d0804` (fuera de la paleta de tokens, hardcodeado inline).

- **Carrusel superior**: hace `fetch('/api/upcoming')` para traer posts próximos (`Post[]`), duplica el array (`doubled`) para loguear un scroll infinito con `@keyframes carouselScroll` (translateX 0 → -50%, 55s linear infinite, se pausa con `onMouseEnter`). Cada card usa `cover_card` como imagen de fondo (fallback `/IMG/IconApp.png`) y un borde izquierdo con el color `config.accent` del post.
- **3 columnas** (Cita del día vía `usePage().props.quote`, Secciones, Sígueme) con separadores verticales que solo se muestran a partir de `640px` (media query inyectada con un `<style>` inline en el propio componente, clase `.footer-cols` / `.footer-divider-el`).
- Copyright final con año dinámico (`new Date().getFullYear()`).
- Todo el estilo está hecho con `style={{...}}` inline (no usa clases de Tailwind ni `app.css`, salvo la excepción del `<style>` embebido para el media query y el keyframe).

**Ruta:** `resources/js/core/home/HomeFooter.tsx`
**Estilos propios:** definidos inline en el propio archivo (media query `.footer-cols`/`.footer-divider-el` y `@keyframes carouselScroll`), no dependen de `app.css`

---

### 3.4 `SideBarLeft` (auth)

Drawer lateral izquierdo, **solo visible en móvil** (`lg:hidden`), fondo `bg-[rgb(45,29,13)]` (marrón oscuro).

- Controlado por `isOpen`/`onClose` (estado que vive en `BlogLayout`), con overlay oscuro (`bg-black/50`) y transición `translate-x` de 300ms.
- Cabecera: avatar (`auth.user.avatar`, o `HomeProfile` con iniciales, o imagen por defecto `/IMG/Foto-Perfil.jpg`) + saludo "Hola, {nombre}".
- Menú de opciones (`Menu`/`MenuButton`/`MenuItems` de Headless UI) con botón `bg-btn-primary`: si es admin muestra "Panel" y "Artworks"; siempre muestra "Profile" (`bg-btn-info`) y "Log Out" (`bg-btn-danger`) — usa directamente los tokens de botón semánticos de la paleta.
- Lista de secciones (`WEB_ROUTE`) con hover `hover:bg-[#624a2e]` y `hover:scale-[1.02]`.
- Bloque "Sígueme" (redes sociales, `netWork` importado de `HomeSideBarRight`) que solo aparece en el drawer móvil.

**Ruta:** `resources/js/core/auth/SideBarLeft.tsx`
**Clases compartidas usadas:** `.btn-hover-scale` (botones del menú de opciones)
**Nota:** existe también `LibrarySideBarLeft.tsx`, `InfoSideBarLeft.tsx` y `PostSideBarLeft.tsx` — variantes específicas de página, no la compartida por `BlogLayout`.

---

### 3.5 `SideBarRight` (auth)

Aside derecho, **solo visible en desktop** (`hidden lg:block`), `sticky` (posición configurable vía prop `sticky`, por defecto `lg:top-6`).

Componente parametrizable con props: `posts`, `featuredTitle`, `showProfile`, `showFollow`, `variant` (`'dark' | 'light'`), `sticky`, `className`, `colSpan`.

- Bloque de perfil opcional (`showProfile`), mismo patrón de avatar que `SideBarLeft`, más `PostProfile`.
- Bloque "Post Destacados" (siempre presente), con dos variantes de estilo según `variant`:
  - `dark`: fondo `bg-[rgb(45,29,13)]`, texto blanco con `text-shadow` doble (mismo patrón visual que `.title`, pero sin reutilizar la clase).
  - `light`: fondo `bg-[#EDEDED]`, texto `text-[#2A1B12]` / `text-[#34495E]`.
- Bloque "Sígueme" opcional (`showFollow`), itera `NETWORKS` (de `@/types`), mismo estilo hover `hover:bg-[rgb(129,106,84)]` que el bloque de redes de `SideBarLeft`.

**Ruta:** `resources/js/core/auth/SideBarRight.tsx`
**Nota:** existe una variante `resources/js/core/home/HomeSideBarRight.tsx` (de donde `SideBarLeft` importa `netWork`) — revisar si conviene unificarlas junto con el plan de [[autor-obra-separation-plan]] si en algún momento el sidebar empieza a depender de datos de Autor/Obra.

---

## 4. Resumen de clases/animaciones compartidas (`@apply`)

| Clase | Definición | Dónde se usa |
|---|---|---|
| `.title` | `resources/css/app.css` | `TopAuthBar`, encabezados varios |
| `._btn_secondary` | `resources/css/app.css` | botón secundario (colores hardcodeados) |
| `.btn-hover-scale` | `resources/css/app.css` | `TopAuthBar`, `SideBarLeft`, `HomeEdition`, `InfoNav`, `PostEdit`, `PostForm`, `PostContent`, `MizumeAdmin`, `library`, `dashboard` |

**Ruta única de definición:** `resources/css/app.css`
