<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Categoria extends Model
{
    protected $table = 'categorias';

    protected $fillable = [
        'nome',
        'user_id',
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

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
