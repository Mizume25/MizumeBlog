<?php

namespace App\Http\Requests\Comments;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class CommentsRequest extends FormRequest
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
            'body'      => ['required', 'min:5'],
            'post_id'   => ['required', 'exists:posts,id'],
            'parent_id' => ['sometimes', 'nullable', 'exists:comments,id'],
        ];
    }
}
