<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreArtwork;
use App\Http\Requests\UpdateArtwork;
use App\Models\Artwork;
use App\Models\ArtworkImage;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Storage;

class ArtworkController extends Controller
{   

    /**
     * Formulario de creacion de Artwork
     */
    public function create () 
    {
        return Inertia::render('IMG/create');
    }

    /**
     * Formulario de Edicion
     */

    public function edit (int $id)
    {   
        $artwork = Artwork::findOrFail($id);

        $pictures = $artwork->images;

        return Inertia::render('IMG/edit', compact('artwork', 'pictures'));
    }

    /**
     * Indice de contenido de Artwork
     */

    public function index () 
    {   

        $artworks = Artwork::all();

        return Inertia::render('IMG/index', compact('artworks'));
    }

    /**
     * Crear un Artwork
     */
    public function store(StoreArtwork $request) 
    {
        $data = $request->validated();


        $artwork = Artwork::create([
            'title' => $data->title,
        ]);

        /** Creamos el directorio */
        Storage::disk('public')->makeDirectory('IMG/' . $artwork->code);

        /**
         * En caso de existir imagenes las pondremos en su carpeta
         */
        if($data->hasFile('images')) $this->saveImages($data->file('images'), $artwork->code);


       
        return redirect()->route('artwork.index')->with('success', 'Artwork creado correctamente');

    }

    /**
     * Actualizar un Artwork
     */

    public function update (UpdateArtwork $request, int $id) 
    {
        
        $artwork = Artwork::findOrFail($id);
        

        $request->validated();


        $artwork->update([
            'title' => $request->title,
        ]);
        
        if($request->hasFile('images')) {
            
            $this->saveImages($request->file('images'), $artwork);

        }

        return back()->with('succes', 'El artwork se ha actualizado correctamente');
        
    }

    /**
     * Borrar un Artwork de BD
     */
    public function destroy(int $id) 
    {
        $artwork = Artwork::findOrFail($id);

        if($artwork->posts()->exists()) {

            return back()->with('error', 'Hay Post Relacionados, primero debes borrarlos');
        }

        Storage::disk('public')->deleteDirectory("IMG/{$artwork->code}");

        $artwork->delete();

        return back()->with('success', 'Se ha eliminado el artwork perfectamente');

    }

    /**
     * Eliminar imagen especifica de un artwork
     */
    public function remove (int $artworkId , int $imageId) 
    {
        
        $artwork = Artwork::findOrFail($artworkId);
    
        $image = ArtworkImage::
        where('artwork_id', $artwork->id)
        ->where('id', $imageId)
        ->firstOrFail();

        if($image->postImages()->exists()) {
            return back()->with('error', 'Esta imagen pertence a un post, remplazala para poder eliminarla');
        }

        Storage::disk('public')->delete("IMG/{$artwork->code}/{$image->name}");

        $image->delete();

        return back()->with('success', 'Se ha borrado perfectamente la imagen');


    }

    /**
     * Poner imagenes publicas
     */
    private function saveImages(array $images, Artwork $artwork)
    {
        $paths = [];

        foreach ($images as $image) {

            $paths[] = Storage::disk('public')->put('IMG/' . $artwork->code, $image);
            
            
            ArtworkImage::create([
                'artwork_id' => $artwork->id,
                'num' => $artwork->images()->count() + 1,
                'name' => $image->getClientOriginalName(),
                'alt' => null,
            ]);
        }
    }
}
