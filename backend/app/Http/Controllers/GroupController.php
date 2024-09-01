<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use App\Models\Invite;

class GroupController extends Controller
{
    public function join(Request $request)
    {
        $group = $request->group;
        Auth::user()->group = $group;
        Invite::where('to', Auth::id())->delete();
        return response()->json([
            'success' => true,
            'message' => "you are in group $group"
        ], 200);
    }
    public function get(Request $request)
    {
        $to = Auth::id();
        $invites = Invite::where('to', $to)->get();
        if($invites)
        {
            $people = [];
            $groups = [];
            $i = 0;
            foreach($invites as $invite)
            {
                $people[$i] = User::where('id', $invite->from)->first()->name;
                $groups[$i] = $invite->group;
                $i = $i + 1;
            }
            return response()->json([
                'success' => true,
                'invites' => $groups,
                'people' => $people
            ], 200);
        }
        else
        {
            return response()->json([
                'success' => false,
                'message' => 'no invites'
            ], 201);
        }
    }
    public function send(Request $request)
    {
        $invite = new Invite([
            'group' => Auth::user()->group,
            'from' => Auth::id(),
            'to' => $request->to
        ]);
        $invite->save();
        return response()->json([
            'success' => true,
            'message' => 'person is invited'
        ], 200);
    }

}
