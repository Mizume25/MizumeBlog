<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;
use Laravel\Socialite\Facades\Socialite;

class GoogleController extends Controller
{
    public function redirect()
    {
        return Socialite::driver('google')->stateless()->redirect();
    }

    public function callback()
    {
        $googleUser = Socialite::driver('google')->stateless()->user();

        $user = User::updateOrCreate(
            ['email' => $googleUser->email],
            [
                'name'            => $googleUser->name,
                'google_id'       => $googleUser->id,
                'avatar'          => $googleUser->avatar,
                'password'        => bcrypt(Str::random(24)),
            ]
        );

        if (!$user->hasVerifiedEmail()) {
            $user->markEmailAsVerified();
        }


        Auth::login($user);
        return redirect('dashboard')->with('Registro con Exito!');
    }
}
