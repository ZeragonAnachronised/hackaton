<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use App\Models\Message;


class UserController extends Controller
{
    public function auth(Request $request)
    {
        $data = $request->validate([
            'email' => ['required', 'email'],
            'password' => ['required']
        ]);
        if(Auth::attempt($data))
        {
            $token = $request->user()->createToken('bearer');

            return response()->json([
                'success' => true,
                'message' => 'logged in',
                'token' => $token->plainTextToken
            ], 200);
        }
        return response()->json([
            'success' => false,
            'message' => 'wrong login data'
        ], 201);
    }
    public function logout(Request $request)
    {
        Auth::user()->tokens()->delete();
        return response()->json([
            'success' => true,
            'message' => 'logged out'
        ], 200);
    }
    public function reg(Request $request)
    {
        if(User::where('email', $request->email)->first())
        {
            return response()->json([
                'success' => false,
                'message' => 'email is already taken'
            ], 201);
        }
        else
        {
            $user = new User([
                'name' => $request->name,
                'email' => $request->email,
                'password' => Hash::make($request->password),
                'group' => 0
            ]);
            $user->save();
            $user->group = $user->id;
            $user->save();
            $token = $user->createToken('bearer');
            return response()->json([
                'success' => true,
                'message' => 'registered',
                'token' => $token->plainTextToken
            ], 200);
        }
    }
    public function info(Request $request)
    {
        $user_id = Auth::id();
        return response()->json([
            'success' => true,
            'id' => $user_id
        ]);
    }
}