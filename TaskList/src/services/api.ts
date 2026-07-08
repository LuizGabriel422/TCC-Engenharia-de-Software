import { Platform } from 'react-native';

import type { Categoria, CategoriaPayload, Tarefa, TarefaPayload } from '@/src/types/task';

const API_BASE_URL =
  Platform.OS === 'android'
    ? 'http://10.0.2.2:8000/api'
    : 'http://127.0.0.1:8000/api';

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  const text = await response.text();
  const data = text ? JSON.parse(text) : null;

  if (!response.ok) {
    const message = data?.message
      || (data?.errors ? JSON.stringify(data.errors) : 'Nao foi possivel concluir a solicitacao.');

    throw new Error(message);
  }

  return data as T;
}

export const api = {
  listarTarefas: () => request<Tarefa[]>('/tarefas'),
  buscarTarefa: (id: number) => request<Tarefa>(`/tarefas/${id}`),
  criarTarefa: (payload: TarefaPayload) =>
    request<Tarefa>('/tarefas', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
  atualizarTarefa: (id: number, payload: TarefaPayload) =>
    request<Tarefa>(`/tarefas/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    }),
  excluirTarefa: (id: number) =>
    request<{ message: string }>(`/tarefas/${id}`, {
      method: 'DELETE',
    }),

  listarCategorias: () => request<Categoria[]>('/categorias'),
  buscarCategoria: (id: number) => request<Categoria>(`/categorias/${id}`),
  criarCategoria: (payload: CategoriaPayload) =>
    request<Categoria>('/categorias', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
  atualizarCategoria: (id: number, payload: CategoriaPayload) =>
    request<Categoria>(`/categorias/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    }),
  excluirCategoria: (id: number) =>
    request<{ message: string }>(`/categorias/${id}`, {
      method: 'DELETE',
    }),
};
