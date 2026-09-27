/**
 * @fileoverview Servicio de mascota representantiva de la app 
 */

/**
 * @constant Turtle Objeto mascota listo para poder usarse
 */
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


