<?php

Route::post('register', 'Api\AuthController@register');
Route::post('login', 'Api\AuthController@login');
Route::post('reset-password', 'Api\AuthController@resetPassword');

Route::middleware('auth:api')->group(function () {
    Route::get('user', 'Api\AuthController@me');
    Route::post('logout', 'Api\AuthController@logout');

    Route::prefix('tarefas')->group(function () {
        Route::get('/', 'Api\TarefaController@index');
        Route::post('/', 'Api\TarefaController@store');
        Route::get('{id}', 'Api\TarefaController@show');
        Route::put('{id}', 'Api\TarefaController@update');
        Route::delete('{id}', 'Api\TarefaController@destroy');
    });

    Route::prefix('categorias')->group(function () {
        Route::get('/', 'Api\CategoriaController@index');
        Route::post('/', 'Api\CategoriaController@store');
        Route::get('{id}', 'Api\CategoriaController@show');
        Route::put('{id}', 'Api\CategoriaController@update');
        Route::delete('{id}', 'Api\CategoriaController@destroy');
    });
});
