// Mueve lo que el CLI de shadcn deja en la raiz a resources/js/ y borra las carpetas vacias.
// Guardar en la raiz del proyecto (junto a package.json). Uso: npm run mover

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.dirname(fileURLToPath(import.meta.url));
const dest = path.join(root, 'resources', 'js');

// Carpetas de la raiz que se vuelcan en resources/js/<nombre>. Editable.
const folders = ['components', 'hooks', 'lib'];

if (!fs.existsSync(dest)) {
    console.error(`No existe ${dest}. Ejecuta el script desde la raiz del proyecto.`);
    process.exit(1);
}

function walk(dir) {
    return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
        const full = path.join(dir, entry.name);
        return entry.isDirectory() ? walk(full) : [full];
    });
}

function removeEmptyDirs(dir) {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
        if (entry.isDirectory()) removeEmptyDirs(path.join(dir, entry.name));
    }
    if (fs.readdirSync(dir).length === 0) fs.rmdirSync(dir);
}

let moved = 0;

for (const name of folders) {
    const src = path.join(root, name);
    if (!fs.existsSync(src)) continue;

    for (const file of walk(src)) {
        const relative = path.relative(src, file);
        const to = path.join(dest, name, relative);
        const status = fs.existsSync(to) ? 'sobrescrito' : 'movido';

        fs.mkdirSync(path.dirname(to), { recursive: true });
        fs.copyFileSync(file, to);
        fs.unlinkSync(file);

        console.log(`[${status}] ${name}/${relative.split(path.sep).join('/')}`);
        moved++;
    }

    removeEmptyDirs(src);

    if (fs.existsSync(src)) {
        console.log(`[aviso] ${name} no esta vacia, no se borra.`);
    } else {
        console.log(`[borrada] carpeta vacia: ${name}`);
    }
}

console.log(moved === 0 ? 'Nada que mover.' : `Listo: ${moved} archivo(s) movido(s).`);
