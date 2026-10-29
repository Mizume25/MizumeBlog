<?php

namespace App\Http\Requests\Filters;

use App\Enums\WorkCategory;
use App\Enums\WorkMedium;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class WorkFilterRequest extends FormRequest
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
            'category' => ['nullable', Rule::enum(WorkCategory::class)],
            'search'   => ['nullable', 'string', 'max:100'],
            'tags'     => ['nullable', 'array'],
            'tags.*'   => ['integer', 'exists:tags,id'],
            'medium'   => ['nullable', Rule::enum(WorkMedium::class)],
        ];
    }
}
