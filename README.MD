# MizumeBlog 
MizumeBlog - Es una version mejorada de mi blog personal.Una plataforma web full-stack construida con Laravel 12, React y TypeScript. Implementa autenticación robusta mediante Laravel Breeze e Inertia.js, con una interfaz estilizada íntegramente en Tailwind CSS. Enfocado en el rendimiento y una experiencia de usuario fluida (SPA).

## Versiones 
- Laravel 12.56.0
- PHP 8.2.12
- Composer version 2.8.12
- React 19.0.0.0 

## Estructura del Proyecto
````
├───app
│   ├───Console
│   │   └───Commands
│   │           CreateAdminUser.php # Comando de Consola
│   │
│   ├───Http
│   │   ├───Controllers
│   │   │   │   AdminController.php # Controlador Admin
│   │   │   │   ApiController.php # Controlador Api request 
│   │   │   │   ComentController.php # Controlador de Comentarios
│   │   │   │   Controller.php 
│   │   │   │   GoogleController.php # Controlador Validación OAuth 
│   │   │   │   HomeController.php # Controlador de la página
│   │   │   │   IndexController.php # Carga Página incial
│   │   │   │   PostImageConfigController.php  # Controlador de Formato Imagenes
│   │   │   │
│   │   │   ├───Auth # Controladores de Breeze
│   │   │   │       AuthenticatedSessionController.php
│   │   │   │       ConfirmablePasswordController.php
│   │   │   │       EmailVerificationNotificationController.php
│   │   │   │       EmailVerificationPromptController.php
│   │   │   │       NewPasswordController.php
│   │   │   │       PasswordResetLinkController.php
│   │   │   │       RegisteredUserController.php
│   │   │   │       VerifyEmailController.php
│   │   │   │
│   │   │   └───Settings  # Controladores de Breeze
│   │   │           PasswordController.php
│   │   │           ProfileController.php
│   │   │
│   │   ├───Middleware 
│   │   │       AdminMiddleware.php # Middleware de Administrador
│   │   │       HandleInertiaRequests.php # Middlewware Inertia
│   │   │
│   │   └───Requests # Tipos de Request 
│   │       │   StorePostRequest.php # Crear un Post
│   │       │   UpdatePostConfigRequest.php  # Actualizar Formato de un Post
│   │       │   UpdatePostRequest.php # Actualizar un Post
│   │       │
│   │       ├───Auth
│   │       │       LoginRequest.php
│   │       │
│   │       └───Settings
│   │               ProfileUpdateRequest.php
│   │
│   ├───Models # Modelos de la página 
│   │       Comment.php
│   │       Post.php
│   │       User.php
│   │
│   ├───Policies # Politicias de la App 
│   │       CommentPolicy.php
│   │       PostPolicy.php
│   │
│   ├───Providers
│   │       AppServiceProvider.php 
│   │
│   └───Services #Servicios de la app 
│           FileContentService.php ## Servicio de Contenido de  rutas
│           MarkdownService.php ## Servicio de Contenido MD 
│
├───bootstrap 
│   │   app.php
│   │   providers.php
│   │
│   └───cache
│           .gitignore
│           packages.php
│           services.php
│
├───config
├───database
│   ├───factories
│   ├───migrations ## Migraciones de la página
│   │       0001_01_01_000000_create_users_table.php
│   │       0001_01_01_000001_create_cache_table.php
│   │       0001_01_01_000002_create_jobs_table.php
│   │       2026_04_12_131250_create_posts_table.php
│   │       2026_04_13_131941_create_comments_table.php
│   │       2026_07_13_052013_create_personal_access_tokens_table.php
│   └───seeders
│           DatabaseSeeder.php ## Seeders de lapágina
├───public # Carpeta Publica 
│   │
│   ├───IMG # Banners Cards Portadas Fotos de Perfil etc.. 
│   │   │   Error-App.png
│   │   │   Fondo.jpg
│   │   │   Foto-Perfil.jpg
│   │   │   IconApp.png
│   │   ├───Banners
│   │   ├───Cards
│   │   └───Portada
│   └───storage
│       └───IMG # Contido de imagenes de cada post (storage link)
├───resources
│   ├───css
│   │       app.css
│   │       HomeMain.module.css
│   ├───js
│   │   │   app.tsx
│   │   │   ssr.jsx
│   │   ├───components
│   │   │   └───ui
│   │   ├───core # Componentes de la App 
│   │   │   ├───admin
│   │   │   │       index.ts
│   │   │   │       InfoNav.tsx
│   │   │   │       InfoPanel.tsx
│   │   │   │       InfoProgresBar.tsx
│   │   │   │       InfoSideBarLeft.tsx
│   │   │   │       InfoSideBarRight.tsx
│   │   │   │       InfoTable.tsx
│   │   │   │       InfoTableMobile.tsx
│   │   │   │
│   │   │   ├───auth # Layouts Principales 
│   │   │   │       AuthButton.tsx
│   │   │   │       LibraryFormat.tsx
│   │   │   │       LogoutButton.tsx
│   │   │   │       SideBarLeft.tsx
│   │   │   │       SideBarRight.tsx
│   │   │   │       TopAuthBar.tsx
│   │   │   │
│   │   │   ├───coments # Componentes de Comentarios
│   │   │   │       ComentContent.tsx
│   │   │   │       ComentForm.tsx
│   │   │   │       ComentProfile.tsx
│   │   │   │       Coments.tsx
│   │   │   │       ComentsTitle.tsx
│   │   │   │       ComentText.tsx
│   │   │   │       index.ts
│   │   │   │       ReplyBTN.tsx
│   │   │   │       ReplyComent.tsx
│   │   │   │
│   │   │   ├───home #Componentes de Dashboard 
│   │   │   │       HomeContent.tsx
│   │   │   │       HomeFooter.tsx
│   │   │   │       HomePanelPost.tsx
│   │   │   │       HomeProfile.tsx
│   │   │   │       HomeSideBarRight.tsx
│   │   │   │       index.ts
│   │   │   │
│   │   │   ├───library #Componentes de archivador 
│   │   │   │       BookCard.tsx
│   │   │   │       LibraryCard.tsx
│   │   │   │       LibraryContent.tsx
│   │   │   │       LibraryHeader.tsx
│   │   │   │       LibrarySideBarLeft.tsx
│   │   │   │
│   │   │   └───post #Componentes de post
│   │   │           ConfirmModal.tsx
│   │   │           index.ts
│   │   │           MarkdownRenderer.tsx
│   │   │           PostContent.tsx
│   │   │           PostForm.tsx
│   │   │           PostProfile.tsx
│   │   │           PostSideBarLeft.tsx
│   │   ├───layouts
│   │   │   │   app-layout.tsx
│   │   │   │   auth-layout.tsx
│   │   │   ├───app # Layout App por defecto y auxiliares
│   │   │   │       app-header-layout.tsx
│   │   │   │       app-sidebar-layout.tsx
│   │   │   │       blog-layout.tsx
│   │   │   │       FlashHandler.tsx 
│   │   │   ├───auth
│   │   │   ├───core
│   │   │   └───settings
│   │   │           layout.tsx # Layout Settings 
│   │   ├───lib
│   │   ├───pages # Pagina Principal y página de error 
│   │   │   │   dashboard.tsx
│   │   │   │   Error.tsx
│   │   │   │   welcome.tsx
│   │   │   │
│   │   │   ├───auth # pagina de inicio de ssesion y registro 
│   │   │   │       confirm-password.tsx
│   │   │   │       forgot-password.tsx
│   │   │   │       login.tsx
│   │   │   │       register.tsx
│   │   │   │       reset-password.tsx
│   │   │   │       verify-email.tsx
│   │   │   │
│   │   │   ├───post # pagina de post
│   │   │   │       create.tsx
│   │   │   │       edit.tsx
│   │   │   │       format.tsx
│   │   │   │       library.tsx
│   │   │   │       MizumeAdmin.tsx
│   │   │   │       show.tsx
│   │   │   │
│   │   │   └───settings # Paginas de Settings
│   │   │           appearance.tsx
│   │   │           history.tsx
│   │   │           password.tsx
│   │   │           profile.tsx
│   │   │           prueba.tsx
│   │   │
│   │   └───types # Interfaces web, funciones esqeumas constantes de la página
│   │           constants.ts
│   │           index.ts
│   │           interfaces.ts
│   │           schemas.ts
│   │           utils.ts
│   │           vite-env.d.ts
│   │
│   └───views 
│       │   app.blade.php
│       │
│       └───vendor # Plantilla de email
│           └───notifications
│                   email.blade.php
├───routes # Rutas web del proyecto
│       api.php
│       auth.php
│       console.php
│       settings.php
│       web.php
│
├───storage # Almacen de imagenes, contenido y backups
│   ├───app
│   │   ├───private
│   │   │   ├───backups
│   │   │   │
│   │   │   └───blog
│   │   │
│   │   └───public
│   │       └───IMG
│   ├───framework`
`````



## Migraciones 

`````

Migraciones  de Post 
Schema::create('posts', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('web_title');
            $table->string('tags');
            $table->enum('category', ['literatura', 'animemanga', 'reflexiones']);
            $table->string('author');
            $table->date('publish_date')->nullable();
            $table->text('description')->nullable();
            $table->boolean('featured')->default(true);
            $table->string('cover')->nullable();
            $table->string('cover_card')->nullable();
            $table->json('config')->nullable();
            $table->timestamps();
});

Migraciond de Comentarios
Schema::create('comments', function (Blueprint $table) {

            $table->id();
            $table->text('description');
            $table->date('publish_date')->default(DB::raw('CURRENT_DATE'));

			/* FK de usuario post y autoreflexivas */
            $table->unsignedBigInteger('user_id');
            $table->unsignedBigInteger('post_id');
            $table->unsignedBigInteger('parent_id')->nullable();

  

            $table->foreign('user_id')
            ->references('id')
            ->on('users')
            ->onUpdate('cascade')
            ->onDelete('restrict');

  
			
            $table->foreign('post_id')
            ->references('id')
            ->on('posts')
            ->onUpdate('cascade')
            ->onDelete('restrict');


            $table->foreign('parent_id')
            ->references('id')
            ->on('comments')
            ->onUpdate('cascade')
            ->onDelete('restrict');

  
  

            $table->timestamps();

        });
}
````

### Modelos
Partiendo de estas entidades he construido los siguientes modelos con las siguientes funciones 

|   Modelos   |                                                      Propiedades                                                       |
| :---------: | :--------------------------------------------------------------------------------------------------------------------: |
|  **Post**   | **title, web_title, tags,category, author publish_date , description , featured , cover,** <br>**cover_card, config'** |
| **Comment** |                             **description , publish_date , user_id , post_id , parent_id**                             |

Modelos con las siguientes funciones 

#### Post

|         Post         |                              Descripción                               |
| :------------------: | :--------------------------------------------------------------------: |
|   **comments ()**    |                 Obtiene todo los comentarios del post                  |
|   **featured ()**    |                      Obtiene los post destacados                       |
|    **publish ()**    |                      Obtiene los post publicados                       |
|  **notPublish ()**   |                      Obtiene los post borradores                       |
| **distincValues ()** | Función que retorna  valores separados de: tags / categories / formats |

#### Comment

|  Comment  |                    Descripción                    |
| :-------: | :-----------------------------------------------: |
| **replies()** | Obtiene las respuestas relacionadas al comentario |
| **parent()**  |          Obtiene el padre del comentario          |
|  **user()**   |     Obtiene el usuario relativo al comentario     |
|  **post()**   |      Obtiene el post relativo al comentario       |


## Seeders 

````
class DatabaseSeeder extends Seeder
{

    
    public function run(): void
    {
        $data = Storage::disk('local')->json('init.json');


        if (!$data) {
            $this->command->error('No se encontro el archivo');
            return;
        } else {

            foreach ($data["posts"] as $post) {
                Post::create($post);
            }

            $count = 0;
            foreach ($data["users"]  as $userData) {
                $userData['password'] = Hash::make(Str::random(32));
                $user = User::create($userData);


                if (empty($user['google_id']) && app()->environment('production'                                                                                                             )) {
                   Password::sendResetLink(['email' => $user->email]);
                 } else {
                    $count++;
                }
            }

            foreach ($data["comments"] as $comment) {
                Comment::create($comment);
            }





            $this->command->info('Estamos en pruebas locales, hemos detectado '                                                                                                              . $count . ' usuarios a revisar');
            $this->command->info('Los datos se restablecieron correctamente');
        }
    }
}
````

Al iniciar la app tengo archivos json iniciales donde se reinicializara la la estructura de datos en caso de perdida.


## Controladores  & Rutas 
La lógica esta repartida entre 2 únicos perfiles de usuario. admin y user, ademas de otros controladores alternos. 

### AdminController 

|  AdminController   |       Ruta        |     View     |             Descripcion             |
| :----------------: | :---------------: | :----------: | :---------------------------------: |
|    **create()**    |   /post/create    | post.create  |   Vista para crear un Post Nuevo    |
|    **panel()**     | /post/MizumeAdmin |  post.panel  | Vista para a al panel Adminitracion |
|     **edit()**     |  /post/edit/{id}  |  post.edit   |       Vista a editar un Post        |
|    **update()**    |  /post/edit/{id}  | post.update  |    Función para actualizar Post     |
|   **destroy()**    |    /post/{id}     | post.destroy |     Función para eliminar Post      |
|    **store()**     |    /post/store    |  post.store  |        Función que crea post        |
|    **backup()**    |   /post/backup    | post.backup  |      Función que crea backups       |
| **replaceImage()** |         X         |      X       |    Helper para manejar imagenes     |
|  **buildTags()**   |         X         |      X       |   Helper que reconstruye los tags   |

## HomeController

|  HomeController  |       Ruta       |      View       |         Descripcion         |
| :--------------: | :--------------: | :-------------: | :-------------------------: |
|   **index()**    |    /dashboard    |    dashboard    | Dirige a Desaborad General  |
|    **show()**    | /post/show/{id}  |    post.show    |  Dirige a Post individual   |
| **archivador()** | /post/archivador | post.archivador | Dirige a Archivador de Post |

### ComentController

| ComentController |            Ruta             |          View          |                Descripcion                 |
| :--------------: | :-------------------------: | :--------------------: | :----------------------------------------: |
|     **store()**      |        /comentarios         |     comments.store     |            Crear un Comentario             |
|    **destroy()**     |      /comentarios{id}       |    comments.destroy    |            Borrar un Comentario            |
| **destroyByPost()**  | /comentarios/post/{post_id} | comments.destroyByPost |        Borar Comentarios de un post        |
|   **deleteAll()**    |        /comentarios         |   comments.deleteAll   | Borrar todos los comentarios de un usuario |

### Otros  Controladores

| GoogleController |         Ruta         |   View   |     Descripción      |
| :--------------: | :------------------: | :------: | :------------------: |
|    **redirect()**    |     /auth/google     | redirect | Redireccion de OAuth |
|    **callback()**    | /auth/goole/callback | callback | Validacion de OAuth  |

---

| ApiController |           Ruta           |     View      |                    Descripción                     |
| :-----------: | :----------------------: | :-----------: | :------------------------------------------------: |
|  **upcomming()**  |        /upcomming        | api.upcomming |              Trae los Post borradores              |
| **apiComments()** | /post/{post_id}/comments |  apiComments  | Trae los Comentarios relativos a un post & Usuario |

---

| PostImageConfigController |               Ruta               |           View           |                Descripción                 |
| :-----------------------: | :------------------------------: | :----------------------: | :----------------------------------------: |
|          **index()**          |    /admin/posts/image-config     |    posts.image-config    | Muestra vista con formatos de las imagenes |
|         **update()**          | /admin/posts/{post}/image-config | post.image-config.update |             Actualiza formatos             |

## Políticas 


| Politica      | Descripcion                                                                                                                                                |
| ------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| PostPolicy    | before() Comprobara que toda accion create , update , delete relativo a post, lo ejecute solo un usario con role admin                                     |
| CommentPolicy | before() Comprobara que toda accion create , update , delete es ejecutada por un usuario con role admin o en su defecto el propetario de dicho comentario. |


## Servicies 

### FileContentService
Es una clase php que tiene el principal objetivo de generar una convención de carpetas muy específica: 

````
1. Antologia de Machado => FileContentService => 1-antologia-de-machado/
````

y tras esta convención podemos realizar un manejo mas optimo de las imágenes y contenido relacionado al post.

````
imagen9235409384.jpg  => FileContentService => P-antologia-de-machado.jpg
imagen9235409384.jpg  => FileContentService => C-antologia-de-machado.jpg
````

De esa manera ocupamos una convención general del contenido.

### MarkdownService

En caso de que se suba un archivo sin .md se generar un plantilla default,  posee funciones para extraer contenido md y construir índices que luego se guardara en la siguiente estructura

````
storage/app/private/
├───1.post-publicado
│   ├───index.json
│   │───content.md

````

El índice se construye dinámicamente cuando se  o se actualice aun post y se guarda, para mostrar simplemente renderizara el json. 


## Request

StorePostRequest & UpdatePostRequest simplemente validad el store y update de los post, el que vale la pena mencionar es **UpdatePostConfigRequest** cuyo request es único al tener un ciclo de vida propio, que de momento solo se implemento update.

