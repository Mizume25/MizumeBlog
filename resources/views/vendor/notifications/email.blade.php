<x-mail::message>

# ¡Bienvenido a Mizume Blog!

Gracias por registrarte. Por favor verifica tu dirección de correo electrónico haciendo clic en el botón de abajo.

<x-mail::button :url="$actionUrl" color="primary">
Verificar Email
</x-mail::button>

Si no creaste una cuenta en Mizume Blog, puedes ignorar este mensaje.

Un saludo,<br>
{{ config('app.name') }}

<x-slot:subcopy>
Si tienes problemas con el botón, copia y pega esta URL en tu navegador:
<span class="break-all">[{{ $displayableActionUrl }}]({{ $actionUrl }})</span>
</x-slot:subcopy>

</x-mail::message>