@php
    /** Obra del post (posts.work_id); null en los artículos de author */
    $work = $post->work;
@endphp
<!DOCTYPE html>
<html lang="{{ app()->getLocale() }}">

<head>
    <meta charset="utf-8">
    <title>{{ $post->title }}</title>
    <style>
        {!! file_get_contents(public_path('pdf.css')) !!}
    </style>
</head>

<body>
    <!-- Ficha técnica del post -->
    <div class="info">
        <h2>{{ __('pdf.title') }}: {{ $post->title }}</h2>

        @if ($work)
            <h4 class="text-muted">{{ __('pdf.work') }}: {{ $work->title }}</h4>
            <p><strong>{{ __('pdf.category') }}:</strong> {{ __("filters.works.categories.{$work->category->value}") }}</p>

            @if ($work->medium)
                <p><strong>{{ __('pdf.medium') }}:</strong> {{ __("filters.works.mediums.{$work->medium->value}") }}</p>
            @endif

            @if ($work->tags->isNotEmpty())
                <p><strong>{{ __('pdf.tags') }}:</strong> {{ $work->tags->pluck('name')->implode(', ') }}</p>
            @endif
        @endif

        <p><strong>{{ __('pdf.author') }}:</strong> {{ $post->user?->name }}</p>

        <p>
            <strong>{{ __('pdf.published') }}:</strong>
            {{ $post->publish_date
                ? \Illuminate\Support\Carbon::parse($post->publish_date)->locale(app()->getLocale())->translatedFormat('j F Y')
                : __('pdf.unpublished') }}
        </p>
    </div>

    <!-- Índice de contenido -->
    @if (!empty($index))
        <div>
            <h4>{{ __('pdf.index') }}</h4>
            @include('post.partials.pdf-index', ['nodes' => $index])
        </div>
    @endif

    <hr> <!-- Separador inicial -->

    <main class="content">
        {!! $content !!}
    </main>
</body>

</html>
