<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class UpdatePostRequest extends FormRequest
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
        return [
            'title'    => 'required|string|max:255',
            'web_title' => 'nullable|string|max:255',
            'category'  => 'required|in:literatura,animeManga,reflexiones',
            'tags'    => 'required|array|min:1|max:10',
            'tags.*'  => ['required', 'string', 'min:2', 'max:50', 'distinct'],
            'publish_date' => 'nullable|date',
            'author' => 'required|string|max:255',
            'description' => 'nullable|string',
            'cover' => 'nullable|file|mimes:jpg,jpeg,png,webp',
            'cover_card'    => 'nullable|file|mimes:jpg,jpeg,png,webp',

            'config'                    => ['nullable', 'array'],
            'config.home_config'        => ['nullable', 'string'],
            'config.article_config'     => ['nullable', 'string'],
            'config.card_config'        => ['nullable', 'string', 'regex:/^\d{1,3}%$/'],
            'config.accent:' => ['nullable', 'string'],
        ];
    }
}
