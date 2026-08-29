#Laravel #React #Typescript #php 
Documentación Técnica del proyecto web "[Mizumeblog](https://mizumeblog.es/)" creado version 2.0.0

Esta versión se propone deconstruir el desastre de código que he implemente en mi primera versión 1.0.0 plagado de duplicación de código, malas praxis , ininteligibilidad y muy poca modalización de código. 


## Estructura de proyecto 
Se sigue una convención de estructura de proyecto Laravel + React.  Esta estructura se ve modificada por mis propias modificaciones 

```
├───app  
│   ├───Casts # Cast de objetos customs 
│   ├───DTO  # Data Object Transfern - Estructura JSON de un campo específico de BBDD
│   ├───Console 
│   ├───Enums # Tipados Especificos de MizumeBlog
│   ├───Http 
│   ├───Models 
│   ├───Policies # Politicas de la página web 
│   ├───Providers 
│   ├───Services # Servicios propios de la página web
├───bootstrap
├───config
├───database
├───docker
├───docs
├───node_modules
├───public
├───resources
├───routes
├───storage
├───tests
├───vendor
````


### Objetos y Servicios Propios

**Console**
````
├── Console
│   └── Commands
│       └── CreateAdminUser.php
│       └── CreateTestPost.php
````

Creación de usuario administrador .

**Enums**
````
├── Enums
│   ├── ContentType.php
│   ├──   PositionType.php
│   └── ImageType.php

````

Tipos específicos de contenido de la página web 

**Http**

**Controllers**
````
├── Controllers
│   ├── Auth/ # Controladores de lógica de autentificacion Brezee
│   ├── AdminController.php # Controlador de Acciones Adminitrador
│   ├── ApiController.php  # Controlador de Peticiones Api JSON
│   ├── ArtworkController.php # Controlador de Artworks
│   ├── ComentController.php # Controlador de Comentarios
│   ├── Controller.php 
│   ├── GoogleController.php # Controlador de Autentificacion OAuth
│   ├── HomeController.php # Controlador del Homepage
│   ├── IndexController.php # Controlador inicial
│   ├── PostImageConfigController.ph # Controlador de Configruaciones PostImage
````

**Middleware**
````
├── Middleware
│   ├── AdminMiddleware.php # Middleware que verifica usuario adminitrador
│   └── HandleInertiaRequests.php # Middleware que capta peticion Inertia
````

**HandleInertiaRequests**
````
# Obtenemos Usuario y Respuestas de controladores


 public function share(Request $request): array
    {
        [$message, $author] = str(Inspiring::quotes()->random())->explode('-');

        return [
            ...parent::share($request),
            'name'  => config('app.name'),
            'quote' => ['message' => trim($message), 'author' => trim($author)],
            'auth'  => [
                'user' => $request->user()?->only([
                    'id',
                    'name',
                    'email',
                    'role',
                    'avatar',
                ]),
            ],
            'flash' => [
                'success' => fn() => $request->session()->get('success'),
                'error' => fn() => $request->session()->get('error'),
                'warning' => fn() => $request->session()->get('warning'),
            ]
        ];
    }
````

**Request**
```
├──Requests
│       ├── Auth/
│       ├── Settings/
│       ├── StoreArtwork.php # Request de Store Artwork
│       ├── StorePostRequest.php # Request de Store Post
│       ├── UpdateArtwork.php # Request de Update Artwork
│       └── UpdatePostRequest.php # Request de Update Post
```


### Modelos
Partiendo de estas entidades he construido los siguientes modelos con las siguientes funciones 

|       Post       |     Comment      |  Artwork  |  ArtworkImage  |      PostImage      |
| :--------------: | :--------------: | :-------: | :------------: | :-----------------: |
|    **title**     | **description**  | **title** | **artwork_id** | **artwor_image_id** |
|  **web_title**   | **publish_date** | **code**  |    **num**     |     **post_id**     |
|     **tags**     |   **user_id**    |     X     |    **name**    |       **key**       |
|   **category**   |   **post_id**    |     X     |    **alt**     |          X          |
|    **author**    |  **parent_id**   |     X     |       X        |          X          |
| **publish_date** |        X         |     X     |       X        |          X          |
| **description**  |        X         |     X     |       X        |          X          |
|   **featured**   |        X         |     X     |       X        |          X          |
|    **cover**     |        X         |     X     |       X        |          X          |
|  **cover_card**  |        X         |     X     |       X        |          X          |
|    **config**    |        X         |     X     |       X        |          X          |
|     **code**     |        X         |     X     |       X        |          X          |



Modelos con las siguientes funciones 

#### Post

Cast de propiedades
``` 
protected $casts = [
	'config' => ConfigCast::class,
];
```

|         Post         |                              Descripción                               | Static |
| :------------------: | :--------------------------------------------------------------------: | :----: |
|   **comments ()**    |                 Obtiene todo los comentarios del post                  |        |
|     **images()**     |                     Obtiene Imágenes relacionadas                      |        |
|    **artworks()**    |                   Obtiene los Artworks Relacionados                    |        |
|   **featured ()**    |                      Obtiene los post destacados                       |        |
|    **publish ()**    |                      Obtiene los post publicados                       |        |
|  **notPublish ()**   |                      Obtiene los post borradores                       |        |
| **distincValues ()** | Función que retorna  valores separados de: tags / categories / formats |   ✅    |
|      **tags()**      |                         Obtiene todos los tags                         |   ✅    |
|   **categories()**   |                      Obtiene todas las categorias                      |   ✅    |
|    **fromats()**     |                      Obtiene todos los 'configs'                       |   ✅    |
|     **booted()**     |         Convencion de propieadades al crear/actualizar un post         |   ✅    |
|      **path()**      |                     Obtiene el path del contenido                      |        |
|  **conventions()**   |                      Convenciones de propiedades                       |   ✅    |


#### Comment

|    Comment    |                    Descripción                    |
| :-----------: | :-----------------------------------------------: |
| **replies()** | Obtiene las respuestas relacionadas al comentario |
| **parent()**  |          Obtiene el padre del comentario          |
|  **user()**   |     Obtiene el usuario relativo al comentario     |
|  **post()**   |      Obtiene el post relativo al comentario       |

#### Artwork

|      Artwork      |                        Descripción                         | Static |
| :---------------: | :--------------------------------------------------------: | :----: |
|   **images()**    |               Obtiene imagenes relacionadas                |        |
|    **posts()**    |                 Obtiene post relacionados                  |        |
|  **generate()**   |             Genera codigo unico para imagenes              |   ✅    |
|   **booted()**    | Convencion de propiedades cuando crea o actualiza artworks |   ✅    |
| **conventions()** |                Convenciones de propiedades                 |        |

#### ArtworkImages
|  ArtworkImages   |              Descripción              |
| :--------------: | :-----------------------------------: |
|  **artwork()**   |     Obtiene artworks relacionadas     |
|   **images()**   |     Obtiene imagenes relacionadas     |
| **postImages()** | Obtiene imagenes de post relacionados |

#### Post Image
|  PostImage  |              Descripción              |
| :---------: | :-----------------------------------: |
| **post()**  |     Obtiene donde pertence a post     |
| **image()** | Obtiene imagen especifica relacionada |


### Controladores 
### AdminController 

|  AdminController   |       Ruta        |     View     |                  Descripcion                  |
| :----------------: | :---------------: | :----------: | :-------------------------------------------: |
|    **create()**    |   /post/create    | post.create  |        Vista para crear un Post Nuevo         |
|    **panel()**     | /post/MizumeAdmin |  post.panel  |      Vista para a al panel Adminitracion      |
|     **edit()**     |  /post/edit/{id}  |  post.edit   |            Vista a editar un Post             |
|    **update()**    |  /post/edit/{id}  | post.update  |         Función para actualizar Post          |
|   **destroy()**    |    /post/{id}     | post.destroy |          Función para eliminar Post           |
|    **store()**     |    /post/store    |  post.store  |             Función que crea post             |
|    **backup()**    |   /post/backup    | post.backup  |           Función que crea backups            |
| **replaceImage()** |         X         |      X       |         Helper para manejar imagenes          |
|  **buildTags()**   |         X         |      X       |        Helper que reconstruye los tags        |
|   **register()**   |         x         |      x       | Helper que asocia y desasocia post y artworks |

### ArtworkController 

| AdminController |               Ruta                |       View        |                      Descripcion                      |
| :-------------: | :-------------------------------: | :---------------: | :---------------------------------------------------: |
|  **create()**   |          /artwork/create          |  artwork.create   |             Vista de creacion de Artwork              |
|   **index()**   |          /artwork/index           |   artwork.index   |               Vista de lista de Artwork               |
|   **edit()**    |        /artwork/edit/{id}         |   artwork.edit    |       Vista de Fomrulario de edicion de artwork       |
|  **update()**   |       /artwork/update/{id}        |  artwork.update   |             Funcion de actualizar Artwork             |
|  **destroy()**  |           /artwork/{id}           |  artwork.destroy  |             Función para eliminar Artwork             |
|   **store()**   |          /artwork/store           |   artwork.store   |               Función que crea Artwork                |
|  **remove()**   | artwork/{artworkId}/img/{imageId} |  artwork.remove   |    Función que borra imagen especifica del Artwork    |
| **updateAlt()** | artwork/{artworkId}/img/{ImageId} | artwork.updateAlt | Funcion que actualiza texto alternativo de una imagen |



## HomeController

|  HomeController  |       Ruta       |      View       |         Descripcion         |
| :--------------: | :--------------: | :-------------: | :-------------------------: |
|   **index()**    |    /dashboard    |    dashboard    | Dirige a Desaborad General  |
|    **show()**    | /post/show/{id}  |    post.show    |  Dirige a Post individual   |
| **archivador()** | /post/archivador | post.archivador | Dirige a Archivador de Post |
|    **pdf()**     |  /post/{id}/pdf  |    post.pdf     |  Descarga contenido en pdf  |

### ComentController

| ComentController    | Ruta                        | View                   | Descripcion                                |
| :------------------ | :-------------------------- | :--------------------- | :----------------------------------------- |
| **store()**         | /comentarios                | comments.store         | Crear un Comentario                        |
| **destroy()**       | /comentarios{id}            | comments.destroy       | Borrar un Comentario                       |
| **destroyByPost()** | /comentarios/post/{post_id} | comments.destroyByPost | Borar Comentarios de un post               |
| **deleteAll()**     | /comentarios                | comments.deleteAll     | Borrar todos los comentarios de un usuario |
### ApiController

|   ApiController   |                      Ruta                       |     View      |                          Descripción                          |
| :---------------: | :---------------------------------------------: | :-----------: | :-----------------------------------------------------------: |
|  **upcomming()**  |                  api/upcomming                  | api.upcomming |                   Trae los Post borradores                    |
| **apiComments()** |           api/post/{post_id}/comments           |  apiComments  |      Trae los Comentarios relativos a un post & Usuario       |
|  **avaliable()**  |     api/post/{post_id}/artwork/{artwork_id}     |   avaliable   | Obtiene imagenes disponibles de post relacionado a un Artwork |
|   **replace()**   |      api/post/{post_id}/replace/{image_id}      |    replace    |   Remplaza una imagen especifica de un post por otra imagen   |
|  **associate()**  | api/post/{post_id}/associate/{artwork_image_id} |   associate   |                 Asociar una imagena a un post                 |
|   **symlink()**   |           api/post/{post_id}/symlink            |    symlink    |                  Asocia un post a un artwork                  |
### Otros  Controladores

| GoogleController |         Ruta         |   View   |     Descripción      |
| :--------------: | :------------------: | :------: | :------------------: |
|    **redirect()**    |     /auth/google     | redirect | Redireccion de OAuth |
|    **callback()**    | /auth/goole/callback | callback | Validacion de OAuth  |


---

| PostImageConfigController |               Ruta               |           View           |                Descripción                 |
| :-----------------------: | :------------------------------: | :----------------------: | :----------------------------------------: |
|        **index()**        |    /admin/posts/image-config     |    posts.image-config    | Muestra vista con formatos de las imagenes |
|       **update()**        | /admin/posts/{post}/image-config | post.image-config.update |             Actualiza formatos             |

## Políticas 

| Politica      | Descripcion                                                                                                                                                |
| ------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| PostPolicy    | before() Comprobara que toda accion create , update , delete relativo a post, lo ejecute solo un usario con role admin                                     |
| CommentPolicy | before() Comprobara que toda accion create , update , delete es ejecutada por un usuario con role admin o en su defecto el propetario de dicho comentario. |
| ArtworkPolicy | before() Comprobara que toda accion create , update , delete relativo a post, lo ejecute solo un usario con role admin                                     |


## Servicies 

### FileContentService

Anida Funciones que comparten algunos controladores

| FileContentService |                 Descripcion                  |
| :----------------: | :------------------------------------------: |
|  **parseTags()**   |   Pasa un string tag especifico a un array   |
| **modifyImages()** |    Modifica la portada o Cover de un post    |
|  **buildTags()**   | Obtiene todos los tagss y lo traduce a array |
|  **saveImages()**  |  Guarda y registra las imagenes de Artworks  |
|   **hashName()**   |       Crea codigo único para imagenes        |

**parsetags() y  buildTags()**** 
```
'ejemplo1, ejemplo2' => ['ejemplo1' , 'ejemplo2']
```

### MarkdownService
Algomera funciones relativos al md:

|    MarkdownService    |             Descripcion             |
| :-------------------: | :---------------------------------: |
|   **hasHeading()**    | Comprueba si el MD subido es valido |
|     **extract()**     |   Extrae ## y construye un indice   |
|    **generate()**     |   Genera un md plantilla inicial    |
|      **build()**      |    Construye la ruta de imagenes    |
|    **syncKeys()**     |     Sincroniza keys de BD y MD      |
| **keyExistsInPost()** |           Comprueba keys            |



## Diseño Web
He decidido cambiar el diseño original de mi página web, inicialmente diseñe en Figma una serie de plantillas base, sin embargo debido a la pobre accesibilidad que proporcionaba, he decidido optar por un diseño mucho más accesible, mejor modularizado y además con una lógica mejor implementada.

### Diseño Compartido

![[Layout-App.png]]


La página web se compondrá de un *Tobar* que le permitirá al usuario navegar entras las diferentes página de manera directa. Este diseño lo comparte todos los componentes. 

![[Layout.png]]


#### Show
**Estructura**
![[Show.png]]



![[Show-Layout.png]]


#### Archivador / library 
![[Archivador.png]]


![[Archive-Photo.png]]


![[Archive-photo-responsive.png]]