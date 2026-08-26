<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class ConfigRequest extends FormRequest
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
            'home' => ['required', 'string'],
            'card' => ['required', 'string'],
            'accent' => ['required', 'string', 'regex:/^#[0-9A-Fa-f]{6}$/'],
            'article' => ['required', 'array'],
            'article.height' => ['required', 'string'],
            'article.position' => ['required', 'string', 'in:bottom,top,center'],
        ];
    }
}
