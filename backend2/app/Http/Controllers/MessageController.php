<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use App\Models\Message;

class MessageController extends Controller
{
    public function send(Request $request)
    {
        $text = $request->text;
        $message = new Message([
            'text' => $text,
            'user_id' => Auth::id(),
            'group' => Auth::user()->group
        ]);
        $message->save();
        return response()->json([
            'success' => true,
            'message' => 'sent',
            'text' => $text
        ], 200);
    }
    public function get(Request $request)
    {
        $messages = Message::where('group', Auth::user()->group)->get();
        $num = $messages->count();
        if($num)
        {
            return response()->json([
                'success' => true,
                'messages' => $messages,
                'num' => $num
            ], 200);
        }
        else
        {
            return response()->json([
                'success' => false,
                'message' => 'no messages'
            ], 404);
        }
    } #88576d06-1b10-43f6-a5e0-52210944aab8
    public function ai(Request $request)
    {
        $text = $request->text;
        $url = 'https://ngw.devices.sberbank.ru:9443/api/v2/oauth';
        $data = random_bytes(16);

        // Установка версии (4) и варианта (2)
        $data[6] = chr(ord($data[6]) & 0x0F | 0x40); // Версия 4
        $data[8] = chr(ord($data[8]) & 0x3F | 0x80); // Вариант 2

        // Форматирование в строку UUID
        
        $rqUID = vsprintf('%s%s-%s-%s-%s-%s%s%s', str_split(bin2hex($data), 4));
        $authorization = 'Basic M2FmZjJmOGQtODdhMS00NGEwLWI2ZjYtY2FmZWM4ODAyMTRmOjljYTc0Y2FmLWI2YjktNGJiZi04M2EzLTQwMzQxOTVkZTU4Mw==';
        $scope = 'GIGACHAT_API_PERS';

        $ch = curl_init();

        curl_setopt($ch, CURLOPT_URL, $url);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
        curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, false);
        curl_setopt($ch, CURLOPT_POST, true);
        curl_setopt($ch, CURLOPT_HTTPHEADER, [
            'Content-Type: application/x-www-form-urlencoded',
            'Accept: application/json',
            'RqUID: ' . $rqUID,
            'Authorization: ' . $authorization
        ]);
        curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query(['scope' => $scope]));

        $response = curl_exec($ch);

        $token = json_decode($response, true)['access_token'];
        
        $url = 'https://gigachat.devices.sberbank.ru/api/v1/chat/completions';
        curl_setopt($ch, CURLOPT_URL, $url);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
        curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, false);
        curl_setopt($ch, CURLOPT_POST, true);
        curl_setopt($ch, CURLOPT_HTTPHEADER, [
            'Content-Type: application/x-www-form-urlencoded',
            'Accept: application/json',
            'Authorization: Bearer '.$token
        ]);
        $body = [
            'model' => 'GigaChat',
            'messages' => [[
                'role' => 'user',
                'content' => 'Ты сказочник, который рассказывает истории для детей. Тебе нужно составить небоольшую историю на основе следющего текста: '.$text
            ]],
            'stream' => false
        ];
        curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($body));
        $response = curl_exec($ch);
        curl_close($ch);
        $text = $request->text;
        $message = new Message([
            'text' => "'".$text."'"." - Хм... Ну что ж... ".json_decode($response, true)['choices'][0]['message']['content'],
            'user_id' => 222,
            'group' => Auth::user()->group
        ]);
        $message->save();
        return response()->json([
            'response' => json_decode($response, true)['choices'][0]['message']['content']
        ]);
    }
}
