<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\User;

class Message extends Model
{
    use HasFactory;
    protected $fillable = [
        'text',
        'user_id',
        'group'
    ];
    public $timestamps = false;
}
