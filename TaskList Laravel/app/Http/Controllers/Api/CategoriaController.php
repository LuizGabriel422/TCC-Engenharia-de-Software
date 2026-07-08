<?php

namespace App\Http\Controllers\Api;

use App\Categoria;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

class CategoriaController extends Controller
{
    public function index()
    {
        return response()->json(Categoria::with('tarefas')->get());
    }

    public function store(Request $request)
    {
        $this->validate($request, [
            'nome' => 'required|string|max:255',
            'cor' => 'nullable|string|max:20',
        ]);

        $categoria = Categoria::create($request->only(['nome', 'cor']));

        return response()->json($categoria, 201);
    }

    public function show($id)
    {
        $categoria = Categoria::with('tarefas')->find($id);

        if (!$categoria) {
            return response()->json(['message' => 'Categoria nao encontrada.'], 404);
        }

        return response()->json($categoria);
    }

    public function update(Request $request, $id)
    {
        $categoria = Categoria::find($id);

        if (!$categoria) {
            return response()->json(['message' => 'Categoria nao encontrada.'], 404);
        }

        $this->validate($request, [
            'nome' => 'sometimes|required|string|max:255',
            'cor' => 'nullable|string|max:20',
        ]);

        $dados = array_filter($request->only(['nome', 'cor']), function ($valor) {
            return !is_null($valor);
        });

        if (!empty($dados)) {
            $categoria->fill($dados);
            $categoria->save();
        }

        return response()->json($categoria);
    }

    public function destroy($id)
    {
        $categoria = Categoria::find($id);

        if (!$categoria) {
            return response()->json(['message' => 'Categoria nao encontrada.'], 404);
        }

        $categoria->delete();

        return response()->json(['message' => 'Categoria excluida com sucesso.']);
    }
}
