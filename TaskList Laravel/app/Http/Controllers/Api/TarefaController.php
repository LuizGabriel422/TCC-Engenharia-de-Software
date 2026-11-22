<?php

namespace App\Http\Controllers\Api;

use App\Tarefa;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

class TarefaController extends Controller
{
    public function index(Request $request)
    {
        return response()->json(
            $request->user()->tarefas()->with('categorias')->get()
        );
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

        $categoriaIds = $request->input('categoria_ids', []);
        if (!$this->categoriasPertencemAoUsuario($request, $categoriaIds)) {
            return response()->json(['message' => 'Uma ou mais categorias nao pertencem ao usuario.'], 422);
        }

        $dados = $request->only([
            'nome',
            'descricao',
            'data',
            'hora_inicio',
            'hora_termino',
        ]);
        $dados['user_id'] = $request->user()->id;

        $tarefa = Tarefa::create($dados);

        if ($request->has('categoria_ids')) {
            $tarefa->categorias()->sync($categoriaIds);
        }

        return response()->json($tarefa->load('categorias'), 201);
    }

    public function show(Request $request, $id)
    {
        $tarefa = $request->user()->tarefas()->with('categorias')->where('id', $id)->first();

        if (!$tarefa) {
            return response()->json(['message' => 'Tarefa nao encontrada.'], 404);
        }

        return response()->json($tarefa);
    }

    public function update(Request $request, $id)
    {
        $tarefa = $request->user()->tarefas()->where('id', $id)->first();

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
            $categoriaIds = $request->input('categoria_ids', []);
            if (!$this->categoriasPertencemAoUsuario($request, $categoriaIds)) {
                return response()->json(['message' => 'Uma ou mais categorias nao pertencem ao usuario.'], 422);
            }

            $tarefa->categorias()->sync($categoriaIds);
        }

        return response()->json($tarefa->load('categorias'));
    }

    public function destroy(Request $request, $id)
    {
        $tarefa = $request->user()->tarefas()->where('id', $id)->first();

        if (!$tarefa) {
            return response()->json(['message' => 'Tarefa nao encontrada.'], 404);
        }

        $tarefa->delete();

        return response()->json(['message' => 'Tarefa excluida com sucesso.']);
    }

    private function categoriasPertencemAoUsuario(Request $request, array $categoriaIds)
    {
        if (empty($categoriaIds)) {
            return true;
        }

        $total = $request->user()->categorias()->whereIn('id', $categoriaIds)->count();

        return $total === count(array_unique($categoriaIds));
    }
}
