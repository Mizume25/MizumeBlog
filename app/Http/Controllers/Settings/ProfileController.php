<?php

namespace App\Http\Controllers\Settings;

use App\Http\Controllers\Controller;
use App\Http\Requests\Settings\ProfileUpdateRequest;
use App\Models\Comment;
use App\Models\Post;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class ProfileController extends Controller
{
    /**
     * Show the user's profile settings page.
     */
    public function edit(Request $request): Response
    {
        return Inertia::render('settings/profile', [
            'mustVerifyEmail' => $request->user() instanceof MustVerifyEmail,
            'status' => $request->session()->get('status'),
        ]);
    }

    /**
     * Update the user's profile settings.
     */
    public function update(ProfileUpdateRequest $request): RedirectResponse
    {
        $request->user()->fill($request->validated());

        if ($request->user()->isDirty('email')) {
            $request->user()->email_verified_at = null;
        }

        $request->user()->save();

        return to_route('profile.edit');
    }

    /**
     * Delete the user's account.
     */
    public function destroy(Request $request): RedirectResponse
    {
        $request->validate([
            'password' => ['required', 'current_password'],
        ]);

        $user = $request->user();

        Auth::logout();

        $user->delete();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect('/');
    }

    /**
     * Historial de Comentarios de Usuario
     * 
     */
    public function history()
    {
        $ids = Comment::where('user_id', Auth::id())
            ->select('post_id')
            ->groupBy('post_id')
            ->orderBy('publish_date', 'desc')
            ->get();

        $postIds = $ids->pluck('post_id');

        $posts = Post::whereIn('id', $postIds)->get();

        return Inertia::render('settings/history', compact('posts'));
    }

    /*public function history()
    {
        
        $posts = Comment::where('user_id', Auth::id())
            ->select('post_id')
            ->groupBy('post_id')
            ->orderBy('publish_date', 'desc')
            ->paginate(10);

       
        $comments = Comment::with(['user', 'replies.user', 'post'])
            ->where('user_id', Auth::id())
            ->whereIn('post_id', $posts->pluck('post_id'))
            ->get()
            ->groupBy('post_id');


        
    } */
}
