<?php

namespace App\Http\Requests\Filters;

use App\Enums\MediaType;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class MediaRequest extends FormRequest
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
            'type' => ['nullable', Rule::enum(MediaType::class)],
            'search_name' => ['nullable', 'string', 'max:100'],
            'search_artist' => ['nullable', 'string', 'max:100'],
            'work' => ['nullable', 'string', 'max:100'],
        ];
    }
}
