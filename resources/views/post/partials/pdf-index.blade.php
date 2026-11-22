{{-- Índice del PDF: se llama a sí mismo para los hijos (## → ###### de MarkdownService::extract) --}}
<ul>
    @foreach ($nodes as $node)
        <li class="index">
            <a href="#{{ $node['id'] }}">{{ $node['id'] }}. {{ $node['title'] }}</a>

            @if (!empty($node['children']))
                @include('post.partials.pdf-index', ['nodes' => $node['children']])
            @endif
        </li>
    @endforeach
</ul>
