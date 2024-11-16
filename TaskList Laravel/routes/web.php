<?php

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/', function () {
    return view('welcome');

    // tarefas
    Route::get('tarefas/create', 'TarefaController@create')->name('tarefas.create');
    Route::post('tarefas', 'TarefaController@store')->name('tarefas.store');
    Route::get('tarefas/{id}/edit', 'TarefaController@edit')->name('tarefas.edit');
    Route::put('tarefas/{id}', 'TarefaController@update')->name('tarefas.update');
    Route::delete('tarefas/{id}', 'TarefaController@destroy')->name('tarefas.destroy');

    // categorias
    Route::get('categorias/create', 'CategoriaController@create')->name('categorias.create');
    Route::post('categorias', 'CategoriaController@store')->name('categorias.store');
    Route::get('categorias/{id}/edit', 'CategoriaController@edit')->name('categorias.edit');
    Route::put('categorias/{id}', 'CategoriaController@update')->name('categorias.update');
    Route::delete('categorias/{id}', 'CategoriaController@destroy')->name('categorias.destroy');
});
