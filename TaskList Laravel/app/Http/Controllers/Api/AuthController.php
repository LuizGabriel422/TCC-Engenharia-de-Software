<?php

namespace App\Http\Controllers\Api;

use App\User;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        $this->validate($request, [
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255|unique:users,email',
            'password' => 'required|string|min:6',
        ]);

        $user = User::create([
            'name' => $request->input('name'),
            'email' => $request->input('email'),
            'password' => bcrypt($request->input('password')),
            'api_token' => str_random(60),
        ]);

        return response()->json($this->authResponse($user), 201);
    }

    public function login(Request $request)
    {
        $this->validate($request, [
            'email' => 'required|email',
            'password' => 'required|string',
        ]);

        $user = User::where('email', $request->input('email'))->first();

        if (!$user || !Hash::check($request->input('password'), $user->password)) {
            return response()->json(['message' => 'E-mail ou senha invalidos.'], 401);
        }

        $user->api_token = str_random(60);
        $user->save();

        return response()->json($this->authResponse($user));
    }

    public function me(Request $request)
    {
        return response()->json($request->user());
    }

    public function logout(Request $request)
    {
        $user = $request->user();
        $user->api_token = null;
        $user->save();

        return response()->json(['message' => 'Logout realizado com sucesso.']);
    }

    public function resetPassword(Request $request)
    {
        $this->validate($request, [
            'email' => 'required|email',
            'password' => 'required|string|min:6',
        ]);

        $user = User::where('email', $request->input('email'))->first();

        if (!$user) {
            return response()->json(['message' => 'Usuario nao encontrado.'], 404);
        }

        $user->password = bcrypt($request->input('password'));
        $user->api_token = str_random(60);
        $user->save();

        return response()->json($this->authResponse($user));
    }

    private function authResponse(User $user)
    {
        return [
            'token' => $user->api_token,
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
            ],
        ];
    }
}
