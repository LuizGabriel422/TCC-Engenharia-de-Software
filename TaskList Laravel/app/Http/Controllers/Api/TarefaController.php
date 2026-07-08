<?php

namespace App\Http\Controllers\Api;

use App\Tarefa;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

class TarefaController extends Controller
{
    public function index()
    {
        return response()->json(Tarefa::with('categorias')->get());
    }

    public function store(Request $request)
    {
        $this->validate($request, [
            'nome' => 'required|string|max:255',
            'descricao' => 'nullable|string',
            'data' => 'required|date',
            'hora_inicio' => 'required|date_format:H:i',
            'hora_termino' => 'required|date_format:H:i',
            'categoria_ids' => 'nullable|array',
            'categoria_ids.*' => 'integer|exists:categorias,id',
        ]);

        $tarefa = Tarefa::create($request->only([
            'nome',
            'descricao',
            'data',
            'hora_inicio',
            'hora_termino',
        ]));

        if ($request->has('categoria_ids')) {
            $tarefa->categorias()->sync($request->input('categoria_ids'));
        }

        return response()->json($tarefa->load('categorias'), 201);
    }

    public function show($id)
    {
        $tarefa = Tarefa::with('categorias')->find($id);

        if (!$tarefa) {
            return response()->json(['message' => 'Tarefa nao encontrada.'], 404);
        }

        return response()->json($tarefa);
    }

    public function update(Request $request, $id)
    {
        $tarefa = Tarefa::find($id);

        if (!$tarefa) {
            return response()->json(['message' => 'Tarefa nao encontrada.'], 404);
        }

        $this->validate($request, [
            'nome' => 'sometimes|required|string|max:255',
            'descricao' => 'nullable|string',
            'data' => 'sometimes|required|date',
            'hora_inicio' => 'sometimes|required|date_format:H:i',
            'hora_termino' => 'sometimes|required|date_format:H:i',
            'categoria_ids' => 'nullable|array',
            'categoria_ids.*' => 'integer|exists:categorias,id',
        ]);

        $dados = array_filter($request->only([
            'nome',
            'descricao',
            'data',
            'hora_inicio',
            'hora_termino',
        ]), function ($valor) {
            return !is_null($valor);
        });

        if (!empty($dados)) {
            $tarefa->fill($dados);
            $tarefa->save();
        }

        if ($request->has('categoria_ids')) {
            $tarefa->categorias()->sync($request->input('categoria_ids'));
        }

        return response()->json($tarefa->load('categorias'));
    }

    public function destroy($id)
    {
        $tarefa = Tarefa::find($id);

        if (!$tarefa) {
            return response()->json(['message' => 'Tarefa nao encontrada.'], 404);
        }

        $tarefa->delete();

        return response()->json(['message' => 'Tarefa excluida com sucesso.']);
    }
}
