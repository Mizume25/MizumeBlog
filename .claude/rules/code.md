# Reglas de convencion de codigo

1. Todas y cada una de las funcionalidades del codigo sera en ingles (arrays, funciones, apis, variables, constantes, objetos e interfaces, y propiedades) todas en ingles. Sin embargo el contenido sera en castellano: 

Ejemplo de codigo en ingles y contenido en castellano:
tsx```
import { useState } from "react";

export default function Component() {
  const [message, setMessage] = useState("");

  const onGreet = () => setMessage("Hola");
  const onFarewell = () => setMessage("Bye Bye");
  const onClear = () => setMessage("");

  return (
    <div>
      <p>{message}</p>
      <button onClick={onGreet}>Saludar</button>
      <button onClick={onFarewell}>Despedir</button>
      <button onClick={onClear}>Ignorar</button>
    </div>
  );
}```

2. Convencion de Archivos.
Los archivos en: `resources/js/types` se encontraran los siguientes archivos y funcionalidades

- api.ts # Centralización de funciones api
- constants.ts # Objectos / arrays constantes en la web iterables y mapeables
- index.ts # Re-exportación de todos los archivos
- schema.ts #Schemas, esquemas de datos para formularios
- utils.ts #Funcionalidades compartidas
- request.ts # Tipologia de tipos de request

Cualquier bloque de codigo que deba construirse y cumpla con la funcionalidad (y logicamente sea un bloque abierto a ser compartido por otros componentes) se escribra en estso archivos

3. Construccion de componentes

Los archivos en: `resources/js/core` se utiliza para almacenar los componentes propios y/o compartidos.

nombres ya utilizados
- admin
- comments
- home
- library
- media
- post

Aqui estan todos los componentes especificos o genericos que se utilizan e las ṕaginas principales:
`resources/js/pages`
-> `resources/js/pages/auth` # Página de authentificacion
-> `resources/js/pages/IMG` # Página de CRUD de imagenes
-> `resources/js/pages/post` # Página de POSTS
-> `resources/js/pages/settings` # Página de configuracion de perfil
-> `resources/js/pages/dashboard.tsx` # Home principal
-> `resources/js/pages/Error.tsx` # Página de error

REGLA: Cualquier nueva seccion que se cree debera construir esta estructura:
Imaginemos que construiremos la seccion "author" para la pagina, entonces debemos de crear:
`resources/js/pages/author/` con el archivo tsx conveninete (create para crear, edit para editar show para mostrar index para en listar etc)

 Y se creara otra carpeta
 `resources/js/core/author/`-> Aqui se almacenara todos los componentes especificos para la seccion author. Sea un componente netamente especifico para author o no lo sea. En caso de ser un compnente muy pequeño se recomienda escribirlo en el propio codigo

4. No existira ni existe una página que no tenga los Layouts principales `resources/js/core/auth`con excepcion de AthButton y SideBarRight que son opcionales y especificas.


5. Cualquier creacion de carpeta deberas solicitar permiso, una vez tengas el permiso podras crear todos los archivos que necesites en la carepta designada, si ncesitas crear otra carpeta, solicitaras otro permiso y asi sucesivamente.

