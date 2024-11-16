<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CriarTabelaTarefaCategorias extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('tarefa_categoria', function (Blueprint $table) {
            $table->increments('id'); // Chave primária para a tabela intermediária.
            $table->unsignedInteger('id_tarefa');
            $table->unsignedInteger('id_categoria');

            $table->foreign('id_tarefa')
                ->references('id')
                ->on('tarefas')
                ->onDelete('cascade')
                ->onUpdate('cascade'); // Relaciona com a tabela tarefas.
            $table->foreign('id_categoria')
                ->references('id')
                ->on('categorias')
                ->onDelete('cascade')
                ->onUpdate('cascade'); // Relaciona com a tabela categorias.
            $table->timestamps(); // Colunas created_at e updated_at.
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('tarefa_categoria');
    }
}
