<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateArtwork extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        $artworkId = $this->route('id');

        return [
            'title' => [
                'required',
                'string',
                'max:255',
                Rule::unique('artworks', 'title')->ignore($artworkId),
            ],
            'images' => ['nullable', 'array'],
            'images.*' => ['image', 'mimes:jpg,jpeg,png,webp'],
            'photos' => ['nullable', 'array'],
            'photos.*.name' => ['required', 'string', 'max:255'],
            'photos.*.alt' => ['required', 'string', 'max:255'],
        ];
    }
}
