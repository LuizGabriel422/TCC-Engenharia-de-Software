<?php

use Illuminate\Http\Request;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::middleware('auth:api')->get('/user', function (Request $request) {
    return $request->user();
});

Route::prefix('tarefas')->group(function () {
    Route::get('/', 'Api\TarefaController@index'); // Listar todas as tarefas
    Route::post('/', 'Api\TarefaController@store'); // Criar uma nova tarefa
    Route::get('{id}', 'Api\TarefaController@show'); // Exibir uma tarefa específica
    Route::put('{id}', 'Api\TarefaController@update'); // Atualizar uma tarefa existente
    Route::delete('{id}', 'Api\TarefaController@destroy'); // Excluir uma tarefa
});

Route::prefix('categorias')->group(function () {
    Route::get('/', 'Api\CategoriaController@index'); // Listar todas as categorias
    Route::post('/', 'Api\CategoriaController@store'); // Criar uma nova categoria
    Route::get('{id}', 'Api\CategoriaController@show'); // Exibir uma categoria específica
    Route::put('{id}', 'Api\CategoriaController@update'); // Atualizar uma categoria existente
    Route::delete('{id}', 'Api\CategoriaController@destroy'); // Excluir uma categoria
});