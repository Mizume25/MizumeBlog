<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreArtwork;
use App\Http\Requests\UpdateArtwork;
use App\Models\Artwork;
use App\Models\ArtworkImage;
use Illuminate\Http\Request;
use App\Services\FileContentService;
use Inertia\Inertia;
use Storage;
use Illuminate\Support\Str;

class ArtworkController extends Controller
{

    private FileContentService $files;

    public function __construct(FileContentService $files)
    {
        $this->files = $files;
    }

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

        $posts = $artwork->posts;

        return Inertia::render('IMG/edit', compact('artwork', 'pictures', 'posts'));
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


        $this->authorize('create', Artwork::class);

        $artwork = Artwork::create([
            'title' => $request->title,
        ]);

    

        /** Creamos el directorio */
        Storage::disk('public')->makeDirectory('IMG/' . $artwork->code);

        /**
         * En caso de existir imagenes las pondremos en su carpeta
         */
        if ($request->hasFile('images')) {
            $this->files->saveImages($request->file('images'), $request->photos, $artwork);
        }



        return redirect()->route('artwork.index')->with('success', 'Artwork creado correctamente');
    }

    /**
     * Actualizar un Artwork
     */

    public function update(UpdateArtwork $request, int $id)
    {

        $request->validated();

        $artwork = Artwork::findOrFail($id);

        $this->authorize('update', $artwork);
        
       


        $artwork->update([
            'title' => $request->title,
        ]);

        if ($request->hasFile('images')) {

            $unassociated = $this->files->saveImages($request->file('images'), $request->photos, $artwork, $request->post_id);
            if (!empty($unassociated)) {
                return back()->with('warning', 'Algunas imágenes se catalogaron pero no se pudieron asociar (no había claves pendientes suficientes): ' . implode(', ', $unassociated));
            }
        }

        return back()->with('success', 'El artwork se ha actualizado correctamente');
    }

    /**
     * Borrar un Artwork de BD
     */
    public function destroy(int $id)
    {
        $artwork = Artwork::findOrFail($id);

        $this->authorize('delete', $artwork);

        if ($artwork->posts()->exists()) {

            return back()->with('error', 'Hay Post Relacionados, primero debes borrarlos');
        }

        Storage::disk('public')->deleteDirectory("IMG/{$artwork->code}");

        $artwork->delete();

        return redirect()->route('artwork.index')->with('success', 'Se ha eliminado el artwork perfectamente');
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

         $this->authorize('delete', $image);

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
    public function updateAlt(Request $request, int $artworkId, int $id)
    {
        $request->validate([
            'alt' => 'required|string|max:255',
        ]);

        $artwork = Artwork::findOrFail($artworkId);



        $image = ArtworkImage::where('artwork_id', $artwork->id)
            ->where('id', $id)
            ->firstOrFail();

        $this->authorize('update', $image);

        $image->update([
            'alt' => $request->alt,
        ]);

        return back()->with('success', 'EL texto alternativo se ha actualizado correctamente');
    }


}
