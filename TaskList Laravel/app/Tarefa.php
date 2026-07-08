<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Tarefa extends Model
{
    protected $table = 'tarefas';

    protected $fillable = [
        'nome',
        'descricao',
        'data',
        'hora_inicio',
        'hora_termino',
    ];

    public function categorias()
    {
        return $this->belongsToMany(
            Categoria::class,
            'tarefa_categoria',
            'id_tarefa',
            'id_categoria'
        )->withTimestamps();
    }
}
