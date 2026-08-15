<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreArtwork;
use App\Http\Requests\UpdateArtwork;
use App\Models\Artwork;
use App\Models\ArtworkImage;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Storage;
use Illuminate\Support\Str;

class ArtworkController extends Controller
{

    /**
     * Formulario de creacion de Artwork
     */
    public function create()
    {
        return Inertia::render('IMG/create');
    }

    /**
     * Formulario de Edicion
     */

    public function edit(int $id)
    {
        $artwork = Artwork::findOrFail($id);

        $pictures = $artwork->images;

        return Inertia::render('IMG/edit', compact('artwork', 'pictures'));
    }

    /**
     * Indice de contenido de Artwork
     */

    public function index()
    {

        $artworks = Artwork::all();

        return Inertia::render('IMG/index', compact('artworks'));
    }

    /**
     * Crear un Artwork
     */
    public function store(StoreArtwork $request)
    {
        $request->validated();

        $artwork = Artwork::create([
            'title' => $request->title,
        ]);

        /** Creamos el directorio */
        Storage::disk('public')->makeDirectory('IMG/' . $artwork->code);

        /**
         * En caso de existir imagenes las pondremos en su carpeta
         */
        if ($request->hasFile('images')) $this->saveImages($request->file('images'), $request->photos, $artwork);



        return redirect()->route('artwork.index')->with('success', 'Artwork creado correctamente');
    }

    /**
     * Actualizar un Artwork
     */

    public function update(UpdateArtwork $request, int $id)
    {

        $artwork = Artwork::findOrFail($id);


        $request->validated();


        $artwork->update([
            'title' => $request->title,
        ]);

        if ($request->hasFile('images')) {

            $this->saveImages($request->file('images'), $request->photos, $artwork);
        }

        return back()->with('success', 'El artwork se ha actualizado correctamente');
    }

    /**
     * Borrar un Artwork de BD
     */
    public function destroy(int $id)
    {
        $artwork = Artwork::findOrFail($id);

        if ($artwork->posts()->exists()) {

            return back()->with('error', 'Hay Post Relacionados, primero debes borrarlos');
        }

        Storage::disk('public')->deleteDirectory("IMG/{$artwork->code}");

        $artwork->delete();

        return back()->with('success', 'Se ha eliminado el artwork perfectamente');
    }

    /**
     * Eliminar imagen especifica de un artwork
     */
    public function remove(int $artworkId, int $imageId)
    {

        $artwork = Artwork::findOrFail($artworkId);

        $image = ArtworkImage::where('artwork_id', $artwork->id)
            ->where('id', $imageId)
            ->firstOrFail();

        if ($image->postImages()->exists()) {
            return back()->with('error', 'Esta imagen pertence a un post, remplazala para poder eliminarla');
        }

        Storage::disk('public')->delete("IMG/{$artwork->code}/{$image->name}");

        $image->delete();

        return back()->with('success', 'Se ha borrado perfectamente la imagen');
    }

    /**
     * Actualiza texto alternativo específico
     */
    public function updateAlt (Request $request, int $artworkId , int $id) 
    {   
        $request->validate([
            'alt' => 'required|string|max:255',
        ]);

        $artwork = Artwork::findOrFail($artworkId);

        $image = ArtworkImage::where('artwork_id', $artwork->id)
        ->where('id', $id)
        ->firstOrFail();

        $image->update([
            'alt' => $request->alt,
        ]);

        return back()->with('success', 'EL texto alternativo se ha actualizado correctamente');


    }

    /**
     * Poner imagenes publicas
     */
    private function saveImages(array $images, array $photos, Artwork $artwork): void
    {
        $next = ($artwork->images()->max('num') ?? 0) + 1;

        foreach ($images as $i => $image) {
            $alt = $photos[$i]['alt'] ?? null;
            $name = $this->hasName($image->getClientOriginalName());

            Storage::disk('public')->putFileAs("IMG/{$artwork->code}", $image , $name);

            ArtworkImage::create([
                'artwork_id' => $artwork->id,
                'num' => $next + $i,
                'name' => $name,
                'alt' => $alt,
            ]);
        }
    }

    private function hasName(string $name): string
    {
        $path = pathinfo($name);
        $base = $path['filename'];
        $ext = $path['extension'] ?? '';
        $hash = Str::random(6);

        return "{$base}_{$hash}.{$ext}";
    }
}
