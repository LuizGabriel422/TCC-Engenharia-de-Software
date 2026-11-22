<?php

namespace App\Http\Controllers\Api;

use App\Categoria;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

class CategoriaController extends Controller
{
    public function index(Request $request)
    {
        return response()->json(
            $request->user()->categorias()->with('tarefas')->get()
        );
    }

    public function store(Request $request)
    {
        $this->validate($request, [
            'nome' => 'required|string|max:255',
            'cor' => 'nullable|string|max:20',
        ]);

        $dados = $request->only(['nome', 'cor']);
        $dados['user_id'] = $request->user()->id;

        $categoria = Categoria::create($dados);

        return response()->json($categoria, 201);
    }

    public function show(Request $request, $id)
    {
        $categoria = $request->user()->categorias()->with('tarefas')->where('id', $id)->first();

        if (!$categoria) {
            return response()->json(['message' => 'Categoria nao encontrada.'], 404);
        }

        return response()->json($categoria);
    }

    public function update(Request $request, $id)
    {
        $categoria = $request->user()->categorias()->where('id', $id)->first();

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

    public function destroy(Request $request, $id)
    {
        $categoria = $request->user()->categorias()->where('id', $id)->first();

        if (!$categoria) {
            return response()->json(['message' => 'Categoria nao encontrada.'], 404);
        }

        $categoria->delete();

        return response()->json(['message' => 'Categoria excluida com sucesso.']);
    }
}
