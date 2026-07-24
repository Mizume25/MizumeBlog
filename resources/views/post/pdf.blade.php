<!DOCTYPE html>
<html>

<head>
    <meta charset="utf-8">
    <style>
          {!! file_get_contents(public_path('pdf.css')) !!}
    </style>
</head>

<body>
    
    <div class="info">
        <h2>Titulo: {{ $post->title }}</h2>
        <h4 class="text-muted">Titulo Post: {{ $post->web_title }}</h4>
        <p>Categoria: {{ $post->category }}</p>
        <p>Auto/ar: {{ $post->author }}</p>
        <p>Fecha Publicacion {{ $post->publish_date }}</p>
    </div>

    <hr>

    <p><strong>Categorías</strong></p>

    @foreach ($tags as $tag)
        <span class="badge info">{{ $tag }}</span>
    @endforeach


    <hr>

    <main class="content">
        {!! $content !!}
    </main>


</body>

</html>
