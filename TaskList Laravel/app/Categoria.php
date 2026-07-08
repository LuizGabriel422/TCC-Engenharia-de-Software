<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Categoria extends Model
{
    protected $table = 'categorias';

    protected $fillable = [
        'nome',
        'cor',
    ];

    public function tarefas()
    {
        return $this->belongsToMany(
            Tarefa::class,
            'tarefa_categoria',
            'id_categoria',
            'id_tarefa'
        )->withTimestamps();
    }
}
