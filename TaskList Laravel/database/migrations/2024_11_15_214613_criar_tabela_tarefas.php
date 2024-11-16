<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CriarTabelaTarefas extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('tarefas', function (Blueprint $table) {
            $table->increments('id'); // Cria uma chave primária.
            $table->string('nome'); // Coluna para o nome da tarefa.
            $table->text('descricao')->nullable(); // Coluna para descrição, pode ser nula.
            $table->date('data'); // Coluna para a data da tarefa.
            $table->time('hora_inicio'); // Coluna para a hora de início.
            $table->time('hora_termino'); // Coluna para a hora de término.
            $table->timestamps(); // Cria as colunas created_at e updated_at.
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('tarefas');
    }
}
