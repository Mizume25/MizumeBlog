<!DOCTYPE html>
<html>

<head>
    <meta charset="utf-8">
    <style>
        {!! file_get_contents(public_path('pdf.css')) !!}
    </style>
</head>

<body>
    <!--Ficha Técnica de el post-->
    <div class="info">
        <h2>Titulo: {{ $post->title }}</h2>
        <h4 class="text-muted">Titulo Post: {{ $post->web_title }}</h4>
        <p><strong>Categoria: </strong>{{ $post->category }}</p>
        <p><strong>Autor/ra:</strong>: {{ $post->author }}</p>
        <p><strong>Fecha Publicacion:</strong>: {{ $post->publish_date }}</p>
        @foreach ($tags as $tag)
            <span class="badge info">{{ $tag }}</span>
        @endforeach
    </div>

    <!--  Indice de contenido -->
    <div>
        <h4>Indice de Contenido</h4>
        <ul>
            @foreach ($index as $item)
                <div class="order-item">
                    <li class="index"><a href="#{{ $item['id'] }}">{{ $item['titulo'] }}</a></li>
                </div>
            @endforeach
        </ul>

    </div>

    <hr> <!--  Separador Incial -->

    <main class="content">
        {!! $content !!}
    </main>


</body>

</html>
