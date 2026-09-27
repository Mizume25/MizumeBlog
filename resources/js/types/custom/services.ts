/**
 * @fileoverview Servicio de mascota representantiva de la app 
 */

/**
 * @type Estados de la tortuga
 */
type TurtleStatus = 'dead' | 'angry' | 'confused' | 'embarrassed' | 'maintenance' | 'smile' | 'thinking' | 'welcome' | 'worried'

/**
 * @interface Tipo de Icono
 */
type Icon = {
    path: string,
    status: string,
    alt: string,
    name: string
}

/**
 * @type Tipo Especifico para tortuga
 */
type IconTurtle = Omit<Icon, 'status'> & {
    status: TurtleStatus
}


/**
 * @constant TURTLE_ICONS Constante de iconos
 */
const TURTLE_ICONS: IconTurtle[] = [
    {
        path: '/Icons/turtle/angry.png',
        status: 'angry',
        alt: 'angry turtle',
        name: 'angry.png'
    },
    {
        path: '/Icons/turtle/confused.png',
        status: 'confused',
        alt: 'confused turtle',
        name: 'confused.png'
    },
    {
        path: '/Icons/turtle/dead.png',
        status: 'dead',
        alt: 'dead turtle',
        name: 'dead.png'
    },
    {
        path: '/Icons/turtle/embarrassed.png',
        status: 'embarrassed',
        alt: 'embarrassed turtle',
        name: 'embarrassed.png'
    },
    {
        path: '/Icons/turtle/maintenance.png',
        status: 'maintenance',
        alt: 'maintenance turtle',
        name: 'maintenance.png'
    },
    {
        path: '/Icons/turtle/smile.png',
        status: 'smile',
        alt: 'smile turtle',
        name: 'smile.png'
    },
    {
        path: '/Icons/turtle/thinking.png',
        status: 'thinking',
        alt: 'thinking turtle',
        name: 'thinking.png'
    },
    {
        path: '/Icons/turtle/welcome.png',
        status: 'welcome',
        alt: 'welcome turtle',
        name: 'welcome.png'
    },
    {
        path: '/Icons/turtle/worried.png',
        status: 'worried',
        alt: 'worried turtle',
        name: 'worried.png'
    } 
]



/**
 * @interface Pet Interfaz de mascota
 */
type Pet = {
    name: string,
    bullet: string,
    onPath: (status: string) => string,
    onImage: (status: string) => string,
    onName: (status: string) => string,
    onObject: (status: string) => { name: string, alt: string },
}

type TURTLE = Omit<Pet, 'onPath' | 'onImage' | 'onName' | 'onObject'> & {
    onPath: (status: TurtleStatus) => string,
    onImage: (status: TurtleStatus, style: string) => string,
    onName: (status: TurtleStatus) => string,
    onObject: (status: TurtleStatus) => { name: string, alt: string },
}

const Turtle: TURTLE = {
    name: 'Turtle',
    bullet: "🐢",
    onPath(status) {
        const obj = TURTLE_ICONS.find((p) => p.status === status);
        if (obj === undefined) return 'not-image';
        return obj.path;
    },
    onImage(status, style) {
        const obj = TURTLE_ICONS.find((p) => p.status === status);
        if (obj === undefined) return 'not-image';
        return `<img src='${obj.path}' alt='${obj.alt}' class='${style}' />`;
    },
    onName(status) {
        const name = TURTLE_ICONS.find((p) => p.status === status)?.name;
        if (name === undefined) return 'not-image';
        return name;
    },
    onObject(status) {
        const obj = TURTLE_ICONS.find((p) => p.status === status);
        if (obj === undefined) return { name: 'not-image', alt: 'not-image' };
        return { name: obj.name, alt: obj.alt };
    },
}   


/**
 
 src/
  types/
    core.ts          ← Pet, Icon, TurtleStatus
    turtle.ts        ← TURTLE (el tipo específico)
    index.ts         ← export * from './core'; export * from './turtle';
  data/
    turtle-icons.ts  ← TURTLE_ICONS
  objects/
    turtle.ts        ← const Turtle: TURTLE = { ... }
    index.ts
  services/
    api.ts
    request.ts
    utils.ts
  constants.ts
  app.tsx
  ssr.jsx
  vite-env.d.ts   
  
  estrucutra que se recomeinda 
 */